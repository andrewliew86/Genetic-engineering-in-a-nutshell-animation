"""Generate scene-aligned neural narration and an original gentle score.
Requires Python, edge-tts, numpy, ffmpeg and ffprobe. No API key required.
"""
import argparse, asyncio, hashlib, json, subprocess, wave
from pathlib import Path
import numpy as np
import edge_tts

ROOT = Path(__file__).resolve().parent
SR = 48000

def run(*args):
    return subprocess.run(list(map(str, args)), check=True, capture_output=True).stdout

def wav(path, data):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2 if data.ndim == 2 else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(data, -1, 1)*32767).astype('<i2').tobytes())

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--video', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    dest = ROOT/'out'/'audio'
    dest.mkdir(parents=True, exist_ok=True)
    scenes = json.loads((ROOT/'narration.json').read_text())
    speech = np.zeros(SR*60)
    timings = []
    for i, scene in enumerate(scenes):
        key = hashlib.sha256(scene['text'].encode()).hexdigest()[:10]
        mp3 = dest/f'voice-{i+1}-{key}.mp3'
        if not mp3.exists():
            await edge_tts.Communicate(scene['text'], 'en-US-JennyNeural', rate='+0%').save(str(mp3))
        raw = run('ffmpeg','-v','error','-i',mp3,'-f','f32le','-ar',SR,'-ac',1,'-')
        samples = np.frombuffer(raw, dtype='<f4').copy()
        # Remove encoder silence, preserving 70ms natural breath room.
        active = np.flatnonzero(np.abs(samples) > 0.003)
        if not len(active):
            raise RuntimeError('Empty narration')
        samples = samples[max(0,active[0]-3360):min(len(samples),active[-1]+3360)]
        available = scene['end']-scene['start']
        factor = max(1, len(samples)/SR/available)
        if factor > 1.18:
            raise RuntimeError(f'Scene {i+1} needs a shorter script: {factor:.2f}')
        if factor > 1:
            temp = dest/f'trim-{i}.wav'
            wav(temp,samples)
            samples = np.frombuffer(run('ffmpeg','-v','error','-i',temp,'-af',f'atempo={factor:.6f}','-f','f32le','-ar',SR,'-ac',1,'-'),dtype='<f4').copy()
        samples *= 0.66/max(np.max(np.abs(samples)),0.01)
        start = round(scene['start']*SR)
        speech[start:start+len(samples)] += samples
        timings.append({'scene':i+1,'start':scene['start'],'end':scene['start']+len(samples)/SR,'tempo':factor})
        print(timings[-1], flush=True)
    wav(dest/'narration.wav',speech)
    # Original 80 BPM celesta-like motif over soft C/Am/F/G pads.
    music = np.zeros((SR*60,2))
    def note(start, duration, midi, level, pan, pad=False):
        n = min(round(duration*SR), len(music)-round(start*SR))
        if n <= 0: return
        t = np.arange(n)/SR
        f = 440*2**((midi-69)/12)
        if pad:
            env = np.minimum(t/.7,1)*np.minimum((duration-t)/.8,1)
            tone = (np.sin(2*np.pi*f*t)+.25*np.sin(2*np.pi*f*1.002*t))*.6
        else:
            env = (1-np.exp(-t*150))*np.exp(-t/0.55)*np.minimum((duration-t)/.15,1)
            tone = np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*f*2*t)*np.exp(-t*3)+.08*np.sin(2*np.pi*f*3*t)
        sound = tone*env*level
        at = round(start*SR)
        music[at:at+n,0] += sound*np.sqrt((1-pan)/2)
        music[at:at+n,1] += sound*np.sqrt((1+pan)/2)
    chords = [[48,55,60,64],[45,52,57,60],[41,48,53,57],[43,50,55,59]]
    for bar in range(20):
        chord = chords[bar%4]
        for j,m in enumerate(chord): note(bar*3,3.7,m,.014,(j-1.5)*.25,True)
        for j,k in enumerate([2,3,1,3]): note(bar*3+j*.75,1.8,chord[k]+12,.035,(-1 if j%2 else 1)*.35)
    # Sparse high melody; rests keep the narration in front.
    for bar in range(0,20,2):
        for j,m in enumerate([76,79,81,79] if bar%4==0 else [77,76,74,72]):
            note(bar*3+.375+j*.75,2,m,.022,.15)
    t = np.arange(SR*60)/SR
    music *= (np.minimum(t/1.5,1)*np.minimum((60-t)/2,1))[:,None]
    # Smooth scene-level ducking with 150ms ramps around speech.
    duck = np.ones(SR*60)
    for item in timings:
        envelope = np.minimum(np.clip((t-item['start']+.15)/.15,0,1),np.clip((item['end']+.3-t)/.3,0,1))
        duck *= 1-.45*envelope
    wav(dest/'music.wav',music)
    mix = music*duck[:,None]+speech[:,None]
    wav(dest/'mix.wav',mix)
    (dest/'timings.json').write_text(json.dumps(timings,indent=2))
    args.output.parent.mkdir(parents=True,exist_ok=True)
    run('ffmpeg','-y','-v','error','-i',args.video,'-i',dest/'mix.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000','-t','60','-movflags','+faststart',args.output)
    print(f'Created {args.output}',flush=True)

if __name__ == '__main__': asyncio.run(main())


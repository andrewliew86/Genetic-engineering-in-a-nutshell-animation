# One-minute cartoon version

A silent, **60-second, 1920 × 1080** JavaScript animation with explanatory captions, an original mint-green bacterium and a violet bacteriophage. Six scenes follow infection, restriction enzymes, plasmids, recombinant DNA, protein expression and insulin. Models are cartoon metaphors, not molecular simulations; the origins of the ancient systems are not precisely dated.

## Create the video

Requirements: Node.js 22+, npm, Chrome/Chromium or Microsoft Edge, and `ffmpeg` on PATH.

```sh
cd animation
npm ci
npm run video
```

The silent H.264 MP4 is written to `out/video.mp4` at 24 fps, with 12 painted drawings per second held for two frames (traditional animation “on twos”). Use `node render.mjs --chrome="/path/to/browser" --clip --on-twos --out=out/video.mp4` for a browser in a nonstandard location. Omit `--on-twos` to paint every frame. On machines without a working GPU, add `--soft-gl`.

Open `studio.html` in a supported browser after installing dependencies to scrub or play the live painting preview. Real-time preview speed depends on the device; offline rendering preserves exact video timing.

## Edit and review

- `STORYBOARD.md`: the six shots, captions and timing.
- `src/microbes.js`: original characters, DNA and protein shapes, caption styling.
- `src/story.js`: scenes as pure functions of time, including anticipation, eased movement and holds.
- `src/config.js`: 60-second duration and a silent 100 BPM motion rhythm.
- `npm run sheet`: a contact sheet for reviewing the story.
- `node render.mjs --strip=4.4:4.7 --out=out/motion.jpg`: consecutive-frame review.

No voice, music, hosted service, API key or generated-image assets are needed. The original React/Three.js website remains separate. This branch does not update the live Pages site because its deployment workflow runs only on `main`.

## Acknowledgements

The hand-painted approach follows John Heibel's [animation guide](https://github.com/JohnHeibel/ClaudeAnimationBase/blob/main/ANIMATION_GUIDE.md), with [PDoomVideo](https://github.com/JohnHeibel/PDoomVideo) as the user's style reference. Explanatory text is included intentionally, as requested.

`src/core.js`, `src/timeline.js` and `render.mjs` are adapted from **ClaudeAnimationBase**, copyright © 2026 John Heibel, under the MIT license reproduced in `ENGINE-LICENSE`. The engine uses p5.js and p5.brush. Changes include caption fonts without a network dependency, playback controls, Edge discovery and the custom microbe story. Character designs and scene code were created for this project with OpenAI Codex. Scientific sources are listed in the repository's main README.

## Narration and music edition

The narrated edition adds Microsoft Jenny Neural synthetic speech, with a conversational script aligned to all six scenes, and an original 80 BPM score of soft pads and celesta-like notes. Music gently ducks under the narration. The source animation and captions are unchanged.

To add audio to an existing silent render:

```sh
python -m pip install edge-tts==7.2.8 numpy
python audio.py --video out/video.mp4 --output out/video-narrated.mp4
```

Narration generation uses the online Microsoft Edge speech service through [edge-tts](https://github.com/rany2/edge-tts); internet access is required on the first run. The script caches generated speech in `out/audio`, trims leading/trailing silence, aligns each segment, and uses only small pitch-preserving timing adjustments. Edit `narration.json` to change the words. The music is synthesized locally from an original note arrangement; no stock recording is used. FFmpeg mixes the audio to a -16 LUFS target and copies the existing video without re-encoding it. `out/audio` also contains separate narration, music, mix, and timing files. The narration is AI-generated, not a recording of a human actor.

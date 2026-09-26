// Original characters. All geometry is flat and all poses are pure functions of time.
const BIO = { mint:'#9BC6A1', dark:'#497A67', purple:'#AA91C3', coral:'#D47C6A', gold:'#D5A84D', pale:'#E9E4D5', blue:'#A9C6D1' };
function words(text,x,y,size=42,col=PAL.ink,opts={}) {
  letter(text,x,y,size,col,{font:`${opts.bold?'600':'400'} ${size}px ${opts.serif?'Georgia':'"Segoe UI", Arial, sans-serif'}`,ink:false,...opts});
}
function face(t, mood=0, size=1, look=0) {
  // A continuous mood value: 0 smile, 1 surprise; shared blink compresses the eyes.
  const blink=1-.93*Math.pow(Math.max(0,Math.cos(t*1.45+1)),35);
  for(const side of [-1,1]){
    const x=side*38+look*8;
    paint(ellPts(x,-13,11,Math.max(2,20*blink+7*mood),14,1),{wash:PAL.ink,ink:null});
    if(blink>.4) paint(ellPts(x-3,-20,3.5,4,8,.2),{wash:PAL.cream,ink:null});
    paint(ellPts(side*63,20,16,7,14,.6),{wash:'#D79788',washOp:140,ink:null});
  }
  if(mood<.5){inkLine([[-19,24],[0,34*(1-2*mood)+24*mood],[20,22]],.8,PAL.ink,'ink',.7)}
  else paint(ellPts(0,29,9+(mood-.5)*8,8+(mood-.5)*14,14,.7),{wash:PAL.ink,ink:null});
}
function bacterium(x,y,s,t,{mood=0,look=0,tilt=0,squash=0,inside=false,key='bacterium',arms=true}={}){
  boilSeed(key);push();translate(x,y+5*Math.sin(t*2.1));rotate(tilt);scale(s*(1+squash),s/(1+squash));
  // A single flagellum and offset arms make a readable, playful silhouette.
  inkLine([[-164,25],[-210,7+8*Math.sin(t*3)],[-245,40],[-280,22+10*Math.sin(t*3-.5)]],1.15,BIO.dark,'ink',.8);
  if(arms){inkLine([[-137,50],[-175,90],[-192,78+9*Math.sin(t*2)]],1.1,BIO.dark);inkLine([[137,40],[172,67],[189,41+10*Math.sin(t*2+.7)]],1.1,BIO.dark)}
  paint(rrPts(-170,-105,340,210,100,2),{wash:BIO.mint,fill:BIO.dark,fillOp:22,tex:.6,ink:PAL.ink,sw:1.1,curv:.2});
  if(inside){inkLine([[-118,12],[-85,-24],[-42,20],[12,-30],[45,14],[15,43],[-40,34],[-64,9]],.7,BIO.dark,'ink',.8)}
  else face(t,mood,1,look);
  for(let i=0;i<5;i++)paint(ellPts(-115+i*55,70+5*Math.sin(i),4,3,8,.5),{wash:BIO.dark,ink:null});
  pop();
}
function phage(x,y,s,t,{tilt=0,mood=0,key='phage'}={}){
  boilSeed(key);push();translate(x,y);rotate(tilt);scale(s);
  for(let i=0;i<3;i++)for(const side of [-1,1])inkLine([[0,91],[side*(38+i*18),110+i*7],[side*(68+i*15),146+4*Math.sin(t*3+i)]],.8,PAL.ink,'ink',.15);
  paint(rrPts(-13,22,26,76,6,1),{wash:BIO.purple,sw:.8});
  for(let i=0;i<5;i++)inkLine([[-12,40+i*10],[12,44+i*10]],.35,PAL.ink);
  const hex=Array.from({length:6},(_,i)=>[Math.cos(i*TAU/6-Math.PI/6)*82,Math.sin(i*TAU/6-Math.PI/6)*76-35]);
  paint(hex,{wash:BIO.purple,fill:'#806993',fillOp:24,sw:1.1});
  push();translate(0,-38);scale(.65);face(t+.5,mood,1,-.3);pop();
  pop();
}
function plasmid(x,y,r,t,{gap=0,progress=1,key='ring',col=BIO.gold}={}){
  boilSeed(key);const start=gap/2,end=TAU-gap/2,pts=[];
  for(let i=0;i<=60;i++){const a=start+(end-start)*i/60*progress;pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r+Math.sin(a*3+t*.6)*2])}
  if(progress>.01)inkLine(pts,2.2,col,'ink',.7);
  // The short crossbars suggest a double-stranded ring without turning it into a technical diagram.
  for(let i=0;i<18*progress;i++){const a=start+(end-start)*i/18;inkLine([[x+Math.cos(a)*(r-7),y+Math.sin(a)*(r-7)],[x+Math.cos(a)*(r+7),y+Math.sin(a)*(r+7)]],.45,PAL.ink)}
}
function dna(x,y,len,t,{cut=0,col=BIO.coral,key='dna',vertical=false,progress=1}={}){
  boilSeed(key);push();translate(x,y);if(vertical)rotate(Math.PI/2);
  for(let half=0;half<2;half++){
    const offset=(half?1:-1)*cut;
    for(const side of [-1,1]){const p=[];for(let i=0;i<=24;i++){const q=half*.5+i/48;if(q>progress)break;p.push([(q-.5)*len+offset,side*Math.sin(q*Math.PI*6)*25])}if(p.length>1)inkLine(p,.85,col,'ink',.65)}
    for(let i=0;i<10;i++){const q=half*.5+i/20;if(q>progress)break;const xx=(q-.5)*len+offset,yy=Math.sin(q*Math.PI*6)*25;inkLine([[xx,yy],[xx,-yy]],.4,BIO.dark)}
  }pop();
}
function enzyme(x,y,s,t,clench=0){
  boilSeed('enzyme');push();translate(x,y);scale(s);const points=Array.from({length:26},(_,i)=>{const a=i/26*TAU,r=64+8*Math.sin(a*5);return [Math.cos(a)*r,Math.sin(a)*r*(1-.3*clench)]});paint(points,{wash:BIO.gold,sw:1,curv:.5});inkLine([[-32,-15],[0,8],[30,-14]],.7,PAL.ink);pop();
}
function heart(x,y,s,t){boilSeed('heart');push();translate(x,y);scale(s*(1+.04*Math.sin(t*3)));paint([[0,35],[-45,2],[-42,-30],[-20,-39],[0,-22],[20,-39],[42,-30],[45,2]],{wash:BIO.coral,sw:.8,curv:.7});pop()}
function bg(t,warm=0){
  boilSeed('backdrop');paint(ellPts(960,540,865,307,36,8),{fill:mixCol(BIO.blue,'#E2C687',warm),fillOp:58,bleed:.16,tex:.5,ink:null});
  for(let i=0;i<8;i++){boilSeed('speck'+i);const x=160+hash(i)*1590,y=300+hash(i+20)*455;paint(ellPts(x,y+7*Math.sin(t*.6+i),7+hash(i+5)*7,8,12,1),{wash:mixCol(BIO.blue,BIO.gold,warm),washOp:80,ink:null})}
}
function caption(era,title,lines){words(era,960,83,30,BIO.dark,{bold:true});words(title,960,159,66,PAL.ink,{serif:true});lines.forEach((line,i)=>words(line,960,918+i*54,40));}
function seam(lt,dur,first=false,last=false){
  flushLetters();boilSeed('transition');
  if(first&&lt<.6)flash(1-ease(seg(lt,0,.6)),PAL.paper);
  else if(!first&&lt<.35)brushWipe(.5+lt/.7,[BIO.blue,BIO.mint]);
  if(last&&lt>dur-1)flash(ease(seg(lt,dur-1,dur)),PAL.paper);
  else if(!last&&lt>dur-.35)brushWipe((lt-(dur-.35))/.7,[BIO.blue,BIO.mint]);
}

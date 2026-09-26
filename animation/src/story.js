// Every shot can be rendered in any order. There is no integrated physics or hidden frame state.
(() => {
  function invasion(t,l,d){
    bg(t);const notice=ease(seg(l,2.2,2.6)),land=ease(seg(l,3,4.5)),enter=ease(seg(l,5.1,7.3));
    const hit=take(l,4.5,.55);
    bacterium(885,630,1.5,t,{mood:notice,look:.7,squash:hit.sq});
    const p=arcPt([1350,375],[1005,322],70,land);phage(p[0],p[1]+(1-land)*8*Math.sin(t*3),1.05,t,{tilt:lerp(-.18,0,land)});
    if(enter>.01)dna(1005,422+enter*105,210*enter,l,{vertical:true,key:'injection'});
    caption('BILLIONS OF YEARS AGO','A very small struggle for survival',[
      'Long before humans, bacteria faced tiny invaders:',
      'viruses called bacteriophages.'
    ]);seam(l,d,true);
  }
  function defence(t,l,d){
    bg(t,.08);const bind=ease(seg(l,1,2.8)),cut=ease(seg(l,4,4.5));
    bacterium(1450,615,.9,t,{mood:1-ease(seg(l,5,6)),look:-.7,squash:take(l,4.5,.5).sq});
    dna(770,505,690,t,{cut:cut*100});
    enzyme(lerp(400,770,bind),lerp(335,500,bind)-70*ease(seg(l,5.5,7)),1.2,t,Math.sin(cut*Math.PI)*.8);
    dna(760,710,540,t,{col:BIO.dark,key:'own-dna'});
    for(let i=0;i<5;i++){boilSeed('mark'+i);paint(ellPts(550+i*100,676,10,10,12,1),{wash:BIO.gold,sw:.3})}
    words('protected bacterial DNA',770,782,28,BIO.dark);
    if(l>4&&l<4.7){const k=Math.sin(seg(l,4,4.7)*Math.PI);for(const sign of [-1,1])inkLine([[770+sign*35,455],[770+sign*(35+30*k),435]],.8,BIO.coral)}
    caption('AN ANCIENT ARMS RACE','Nature invents a molecular defence',[
      'Restriction enzymes are proteins that cut invading DNA.',
      'Chemical marks help protect the bacterium’s own DNA.'
    ]);seam(l,d);
  }
  function rings(t,l,d){
    bg(t,.22);bacterium(940,552,2,t,{inside:true,arms:false});
    const separation=ease(seg(l,5,6.5)),copy=ease(seg(l,2.2,4.8));
    plasmid(1080,525,72,t);if(copy>.01)plasmid(1080-separation*210,525-25*Math.sin(copy*Math.PI)+Math.sin(separation*Math.PI)*45,72,t,{progress:copy,key:'copy'});
    words('plasmid',1090,805,30,BIO.dark);
    caption('NATURE’S TOOLKIT','A little ring with a big future',[
      'Plasmids are extra DNA rings that can copy themselves.',
      'Scientists saw a useful carrier for new genes.'
    ]);seam(l,d);
  }
  function engineering(t,l,d){
    bg(t,.38);const join=ease(seg(l,2,4.4)),deliver=ease(seg(l,7,9));
    const x=lerp(785,1380,deliver),y=lerp(530,555,deliver),r=lerp(165,45,deliver);
    bacterium(1390,575,1.22,t,{inside:deliver>.01,look:-1,squash:take(l,9,.5).sq});
    plasmid(x,y,r,t,{gap:1.15});
    const pts=[];for(let i=0;i<=20;i++){const a=-.575+i/20*1.15;pts.push([x+Math.cos(a)*r+(1-join)*220*(1-deliver),y+Math.sin(a)*r])}
    inkLine(pts,2.3,BIO.coral,'ink',.7);
    for(const sign of [-1,1]){const k=ease(seg(l,4.8,5.5));if(k>.01){boilSeed('seal'+sign);paint(ellPts(x+Math.cos(.575)*r,y+sign*Math.sin(.575)*r,9*k,9*k,10,.4),{wash:BIO.dark,ink:null})}}
    if(l<6.8){words('plasmid',740,772,28,BIO.dark);words('new gene',1105,345,28,BIO.coral)}
    caption('1973 · RECOMBINANT DNA','New instructions, familiar machinery',[
      'Scientists joined DNA pieces into working plasmids.',
      'Bacteria could copy the new instructions.'
    ]);seam(l,d);
  }
  function protein(t,l,d){
    bg(t,.52);bacterium(420,585,1.15,t,{look:1,mood:.25*(1-ease(seg(l,6,7)))});plasmid(890,365,76,t);
    const message=ease(seg(l,.8,2.5));const path=[[890,455],[840,510],[990,548],[1160,533]];if(message>.01)inkLine(path.map((p,i)=>[lerp(890,p[0],message),lerp(455,p[1],message)]),1.1,BIO.gold,'ink',.7);
    const read=ease(seg(l,2.8,6.8));boilSeed('ribosome');paint(ellPts(1090+read*180,548,82,64,25,2),{wash:BIO.purple,sw:.8});paint(ellPts(1090+read*180,597,58,30,20,2),{wash:'#8F76AA',sw:.7});
    const chain=[];for(let i=0;i<15;i++){const k=ease(seg(l,3+i*.22,3.3+i*.22));if(k<=0)continue;const x=1090+read*180+i*13,y=650+Math.sin(i*.7)*20+i*4;chain.push([x,y]);boilSeed('amino'+i);paint(ellPts(x,y,12*k,12*k,12,.7),{wash:i%2?BIO.coral:BIO.gold,sw:.35})}
    if(chain.length>1)inkLine(chain,.3,PAL.ink,'ink',.6);
    words('RNA message',845,690,28,BIO.dark);words('protein',1410,790,28,BIO.dark);
    caption('1977 · A HUMAN PROTEIN','Life speaks a shared language',[
      'With the right instructions, bacteria can make human proteins.',
      'In 1977, scientists demonstrated this with a human hormone.'
    ]);seam(l,d);
  }
  function medicine(t,l,d){
    bg(t,.85);const together=ease(seg(l,.8,2.8)),vial=ease(seg(l,4.8,5.5));
    if(l<5.5){push();translate(960,535);scale(1-vial*.85);for(let c=0;c<2;c++){const p=[];for(let i=0;i<10;i++){const x=(c?1:-1)*(150-85*together)+Math.sin(i*.9)*43,y=-110+i*25;p.push([x,y]);boilSeed('insulin'+c+'-'+i);paint(ellPts(x,y,13,13,12,1),{wash:c?BIO.coral:BIO.gold,sw:.4})}inkLine(p,.55,PAL.ink)}if(l>3)for(const i of [2,7]){const x=Math.sin(i*.9)*43,y=-110+i*25,k=ease(seg(l,3,3.5));inkLine([[x-65,y],[x-65+130*k,y]],.8,BIO.dark)}pop()}
    if(vial>.01){boilSeed('vial');push();translate(960,550);scale(vial);paint(rrPts(-105,-130,210,320,28,2),{wash:PAL.cream,fill:BIO.blue,fillOp:35,sw:1});paint(rrPts(-87,-175,174,64,10,1),{wash:BIO.purple,sw:.9});paint(rrPts(-75,-25,150,118,4,1),{wash:'#E7D9B7',sw:.45});pop();words('INSULIN',960,573,29,PAL.ink,{bold:true,alpha:vial})}
    const greet=ease(seg(l,5.7,6.6));bacterium(lerp(520,580,greet),650,1.2,t,{look:.8,squash:jump(l,6.5,7.1,25).sq});
    if(l>6)heart(1330,560,1.3*ease(seg(l,6,6.7)),t);
    if(l<5.5)caption('1978 → 1982','From a tiny cell to a life-saving medicine',[
      'In 1978, bacteria helped make human insulin.',
      'In 1982, recombinant human insulin was approved.'
    ]);else caption('TODAY','Evolution’s tools. Human curiosity.',[
      'Purified and tested, insulin becomes life-saving medicine.',
      'An ancient struggle helped us build a healthier future.'
    ]);seam(l,d,false,true);
  }
  shots([[0,invasion],[9,defence],[19,rings],[28,engineering],[39,protein],[49,medicine]]);
})();

globalThis.VELNAR = globalThis.VELNAR || {};

// Each story is one bounded overlay, driven only by CSS transform and opacity.
// Real GitHub cells remain untouched, so hover, links and graph scrolling work.
VELNAR.CollectionStories = {
  render(id, {actor,target,beam,hand,points:p,size}) {
    const art=VELNAR.CollectionArt;
    if(!art.characters[id])return null;
    const svg=body=>`<svg viewBox="0 0 60 60" aria-hidden="true">${body}</svg>`;
    const icon=(n,cls,body)=>target(n,cls,svg(body));
    const moving=(cls,body)=>`<div class="prop ${cls}">${svg(body)}</div>`;
    const ring='<circle cx="30" cy="30" r="23" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="30" cy="30" r="16" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 5"/>';
    const trace='<path d="M10 48Q18 12 51 8Q35 24 17 49Z" fill="#fff3f4"/><path d="M10 48Q18 12 51 8" fill="none" stroke="#ff8196" stroke-width="2"/>';
    const light=color=>`<circle cx="30" cy="30" r="21" fill="${color}" fill-opacity=".2" stroke="${color}" stroke-width="2"/><circle cx="30" cy="30" r="9" fill="${color}"/>`;
    const a=actor('hero');
    // Positions are snapped to measured cell centers by GraphScenes.
    const pos=(n,angle=0,dy='0px')=>`translate(var(--x${n}),calc(var(--y${n}) + ${dy})) rotate(${angle}deg)`;
    const actorFrames=frames=>`@keyframes vn-hero{${frames}}`;
    const walk=`0%{transform:translate(calc(0px - var(--size)),var(--y0));opacity:0;}12%,28%{transform:${pos(0)};opacity:1;}`;
    const exit=`88%{transform:${pos(3)};opacity:1;}100%{transform:translate(var(--width),var(--y3));opacity:0;}`;
    const cssBase=`
      .hero{animation:vn-hero 14s linear infinite;}
      .prop{position:absolute;left:0;top:0;width:30px;height:30px;color:var(--effect);opacity:0;}
      .target{color:var(--effect);}
      .hit{animation:vn-hit 14s ease-out infinite;}.echo{animation:vn-hit 14s ease-out 1s infinite;}
      @keyframes vn-hit{0%,35%{opacity:0;transform:scale(.2) rotate(-12deg);}42%,53%{opacity:.9;transform:scale(1) rotate(0);}66%,100%{opacity:0;transform:scale(1.3) rotate(12deg);}}
      @keyframes vn-ray{0%,28%{opacity:0;transform:scaleX(0);}32%,40%{opacity:.95;transform:scaleX(1);}48%,100%{opacity:0;transform:scaleX(1);}}
    `;
    let markup='',css='';
    switch(id) {
      case 'batman':
        markup=a+moving('batarang',art.bat)+icon(2,'hit signal',`<circle cx="30" cy="30" r="28" fill="#efcc66" fill-opacity=".2"/><g transform="translate(1 9) scale(.9)" color="#efcc66">${art.bat}</g>`)+icon(3,'echo',ring);
        css=`.stage{--effect:#efcc66}.batarang{width:34px;animation:vn-batarang 14s linear infinite;}
          ${actorFrames(`0%{transform:translate(-65px,-30px) rotate(-22deg);opacity:0;}17%,33%{transform:${pos(0)};opacity:1;}57%{transform:${pos(1,14,'-9px')};}76%{transform:${pos(2,-12)};} ${exit}`)}
          @keyframes vn-batarang{0%,29%{transform:translate(calc(var(--cx0) + 14px),var(--y0)) rotate(0);opacity:0;}30%{transform:translate(calc(var(--cx0) + 14px),var(--y0)) rotate(0);opacity:1;}43%{transform:translate(calc(var(--cx2) - 17px),calc(var(--cy2) - 15px)) rotate(720deg);opacity:1;}48%,100%{transform:translate(calc(var(--cx2) - 17px),calc(var(--cy2) - 15px)) rotate(900deg);opacity:0;}}`;
        break;
      case 'star-wars':
        markup=a+beam('force',hand(p[0]),p[1],'#ff718b')+icon(1,'hit force-ring',ring)+icon(2,'echo force-ring',ring);
        css=`.stage{--effect:#ff819b}.force i{animation:vn-ray 14s linear infinite}.force-ring{width:46px;height:46px;margin:-23px;}
          ${actorFrames(`${walk}32%,48%{transform:${pos(0,-5)};}62%{transform:${pos(1)};}76%{transform:${pos(2)};}${exit}`)}`;
        break;
      case 'harry-potter':
        markup=a+beam('spell',hand(p[0]),p[1],'#ffdfa0')+icon(1,'hit enchantment',art.star)+icon(3,'echo',art.star);
        css=`.stage{--effect:#ffe19f}.spell i{height:2px;animation:vn-ray 14s linear infinite}.enchantment{width:28px;height:28px;margin:-14px;}
          ${actorFrames(`${walk}31%{transform:${pos(0,-7)};}38%,51%{transform:${pos(0)};}66%{transform:${pos(2)};}${exit}`)}`;
        break;
      case 'deadpool':
        markup=a+icon(1,'hit slash',trace)+icon(1,'echo slash cross',trace)+icon(2,'hit badge',art.symbols[id]);
        css=`.stage{--effect:#ff8ca7}.slash{width:42px;height:42px;margin:-21px;}.cross svg{transform:scaleX(-1)}.cross{animation-delay:.55s}.badge{animation-delay:3s;width:22px;height:22px;margin:-11px;}
          ${actorFrames(`${walk}36%{transform:${pos(1,-12)};}46%{transform:${pos(1,8)};}57%{transform:${pos(2,185,'-10px')};}69%{transform:${pos(2,360)};} ${exit}`)}`;
        break;
      case 'stranger-things':
        markup=a+icon(1,'lift cube','<rect x="18" y="18" width="24" height="24" rx="3" fill="#9193db" stroke="#e7c5d7"/>')+icon(2,'lift cube second','<rect x="21" y="21" width="18" height="18" rx="2" fill="#bf6687" stroke="#ffe0cd"/>')+icon(3,'hit rift',art.symbols[id]);
        css=`.stage{--effect:#f399a6}.lift{animation:vn-lift 14s ease-in-out infinite}.lift.second{animation-delay:1s}.rift{height:58px;margin-top:-29px;}
          ${actorFrames(`${walk}38%,52%{transform:${pos(0,0,'-6px')};}62%{transform:${pos(0)};}77%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-lift{0%,23%{opacity:0;transform:translateY(0) rotate(0);}32%{opacity:.9;transform:translateY(-4px) rotate(-8deg);}45%{opacity:.9;transform:translateY(-16px) rotate(13deg);}55%{opacity:1;transform:translateY(-12px) rotate(-12deg);}64%,100%{opacity:0;transform:translateY(0) rotate(0);}}`;
        break;
      case 'wednesday':
        markup=a+moving('thing',art.hand)+icon(1,'hit moon','<path d="M36 5a24 24 0 1 0 18 39A24 24 0 0 1 36 5Z" fill="#d9c7ef"/>')+icon(3,'echo',art.star);
        css=`.stage{--effect:#ddc0fb}.thing{width:27px;height:27px;animation:vn-thing 14s linear infinite;}
          ${actorFrames(`${walk}32%{transform:${pos(0,14)};}39%{transform:${pos(1,-14)};}46%{transform:${pos(1,14)};}53%{transform:${pos(1,-10)};}61%{transform:${pos(2,12)};}69%{transform:${pos(2,-13)};}78%{transform:${pos(2,8)};}${exit}`)}
          @keyframes vn-thing{0%{transform:translate(-30px,calc(var(--height) - 28px));opacity:0;}15%{transform:translate(var(--cx0),calc(var(--height) - 28px)) rotate(-8deg);opacity:1;}35%{transform:translate(var(--cx1),calc(var(--height) - 31px)) rotate(8deg);}55%{transform:translate(var(--cx2),calc(var(--height) - 28px)) rotate(-8deg);}80%{transform:translate(var(--cx3),calc(var(--height) - 31px)) rotate(8deg);opacity:1;}100%{transform:translate(var(--width),calc(var(--height) - 28px));opacity:0;}}`;
        break;
      case 'squid-game':
        markup=a+icon(3,'green signal',light('#83e6ba'))+icon(3,'red signal',light('#ff7296'))+icon(1,'hit shapes',art.symbols[id]);
        css=`.stage{--effect:#ffa5c8}.green{animation:vn-green 14s linear infinite}.red{animation:vn-red 14s linear infinite}.signal{width:27px;height:27px;margin:-13.5px;}
          ${actorFrames(`${walk}40%,57%{transform:${pos(1)};}74%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-green{0%,10%{opacity:0;transform:scale(.6);}14%,36%{opacity:1;transform:scale(1);}39%,59%{opacity:0;transform:scale(.8);}62%,82%{opacity:1;transform:scale(1);}87%,100%{opacity:0;transform:scale(.6);}}
          @keyframes vn-red{0%,36%{opacity:0;transform:scale(.6);}40%,57%{opacity:1;transform:scale(1);}60%,100%{opacity:0;transform:scale(.8);}}`;
        break;
      case 'god-of-war': {
        const origin=hand(p[0]);
        markup=a+moving('leviathan',art.axe)+icon(2,'hit frost',`<g color="#b9f8ff">${art.star}</g>`)+icon(2,'echo frost-ring',ring);
        css=`.stage{--effect:#aeeeff}.leviathan{width:34px;height:34px;animation:vn-axe 14s linear infinite;}.hero .held-axe{animation:vn-held-axe 14s linear infinite;}
          ${actorFrames(`${walk}32%{transform:${pos(0,-10)};}38%,63%{transform:${pos(0)};}77%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-axe{0%,29%{opacity:0;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(-10deg);}31%{opacity:1;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(-10deg);}43%,47%{opacity:1;transform:translate(calc(var(--cx2) - 17px),calc(var(--cy2) - 17px)) rotate(710deg);}60%{opacity:1;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(-10deg);}62%,100%{opacity:0;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(-10deg);}}
          @keyframes vn-held-axe{0%,29%,62%,100%{opacity:1;}31%,60%{opacity:0;}}`;
        break;
      }
      case 'assassins-creed':
        markup=a+moving('eagle','<path d="M30 27Q17 10 1 20l14 5-12 3 20 5 7 12 7-12 20-5-12-3 14-5Q43 10 30 27Z" fill="#e8dfc9"/><path d="m27 31 3-8 4 8" fill="#baa886"/>')+icon(2,'hit landing','<path d="M8 36q22-13 44 0M3 43q27-19 54 0" fill="none" stroke="#d8bf92" stroke-width="3"/>')+icon(3,'echo',art.seal);
        css=`.stage{--effect:#e9d4b1}.eagle{width:35px;height:35px;animation:vn-eagle 14s ease-in-out infinite;}
          ${actorFrames(`0%{transform:translate(-50px,var(--y0));opacity:0;}18%,30%{transform:${pos(0)};opacity:1;}40%{transform:${pos(1,85,'-12px')};}48%{transform:${pos(2,90,'-8px')};}57%,63%{transform:${pos(2)};} ${exit}`)}
          @keyframes vn-eagle{0%,13%{transform:translate(-40px,0) rotate(-12deg);opacity:0;}25%{transform:translate(var(--cx0),0) rotate(6deg);opacity:1;}48%{transform:translate(var(--cx2),7px) rotate(-7deg);}78%{transform:translate(var(--cx3),0) rotate(6deg);opacity:1;}95%,100%{transform:translate(var(--width),0);opacity:0;}}`;
        break;
      case 'minecraft':
        markup=a+icon(2,'mine-block',art.block)+icon(2,'cracks','<path d="m30 8-4 13 9 5-6 8 5 19m-8-32-12-5m15 18-14 7m20-15 11-8" fill="none" stroke="#142825" stroke-width="3"/>')+icon(2,'chips','<g fill="#b9df8c"><path d="M6 12h7v7H6Zm35-5h8v8h-8ZM9 42h6v6H9Zm36-5h7v7h-7Z"/></g>');
        css=`.stage{--effect:#b7e990}.mine-block{animation:vn-block 14s linear infinite}.cracks{animation:vn-cracks 14s linear infinite}.chips{animation:vn-chips 14s ease-out infinite}.hero .held-pickaxe{transform-origin:132px 86px;animation:vn-pickaxe 14s linear infinite;}
          ${actorFrames(`0%{transform:translate(calc(0px - var(--size)),var(--y0));opacity:0;}12%{transform:${pos(0)};opacity:1;}27%,30%,42%{transform:translate(calc(var(--cx2) - var(--size)*.86),var(--y2)) rotate(-5deg);opacity:1;}35%,47%{transform:translate(calc(var(--cx2) - var(--size)*.86),var(--y2)) rotate(4deg);}53%{transform:translate(calc(var(--cx2) - var(--size)*.86),var(--y2));}68%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-block{0%,13%{opacity:0;transform:scale(.7);}20%,45%{opacity:1;transform:scale(1);}48%,100%{opacity:0;transform:scale(.7);}}
          @keyframes vn-cracks{0%,33%{opacity:0;transform:scale(1);}36%,46%{opacity:1;transform:scale(1);}49%,100%{opacity:0;transform:scale(.7);}}
          @keyframes vn-chips{0%,45%{opacity:0;transform:scale(.3);}48%{opacity:1;transform:scale(.8);}61%,100%{opacity:0;transform:scale(1.8) translateY(10px);}}
          @keyframes vn-pickaxe{0%,26%,53%,100%{transform:rotate(0);}30%,42%{transform:rotate(-40deg);}35%,47%{transform:rotate(25deg);}}`;
        break;
    }
    return {markup,css:cssBase+css};
  }
};

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
    // Keep the performer on stage for nearly the whole loop. A short edge-to-edge
    // reset is deliberate; long invisible stretches made the graph look broken.
    const walk=`0%{transform:translate(calc(0px - var(--size)),var(--y0));opacity:0;}5%{transform:${pos(0)};opacity:1;}18%,28%{transform:${pos(0)};opacity:1;}`;
    const exit=`86%,96%{transform:${pos(3)};opacity:1;}100%{transform:translate(var(--width),var(--y3));opacity:0;}`;
    const cssBase=`
      .stage{--vn-cycle:8s;}
      .hero{animation:vn-hero var(--vn-cycle) cubic-bezier(.42,0,.22,1) infinite;will-change:transform,opacity;}
      .hero .vn-character{transform-box:fill-box;transform-origin:50% 82%;animation:vn-presence var(--vn-cycle) ease-in-out infinite;will-change:transform;}
      .prop{position:absolute;left:0;top:0;width:30px;height:30px;color:var(--effect);opacity:0;will-change:transform,opacity;}
      .target{color:var(--effect);}
      .hit{animation:vn-hit var(--vn-cycle) ease-out infinite;}.echo{animation:vn-hit var(--vn-cycle) ease-out 1s infinite;}
      @keyframes vn-hit{0%,30%{opacity:0;transform:scale(.2) rotate(-12deg);}35%,68%{opacity:.95;transform:scale(1) rotate(0);}80%,100%{opacity:0;transform:scale(1.32) rotate(12deg);}}
      @keyframes vn-ray{0%,24%{opacity:0;transform:scaleX(0);}29%,64%{opacity:1;transform:scaleX(1);}76%,100%{opacity:0;transform:scaleX(1);}}
      @keyframes vn-presence{0%,8%{transform:translateY(4px) scale(.97);}15%,24%{transform:translateY(0) scale(1);}30%{transform:translateY(-3px) scale(1.02);}36%{transform:translateY(2px) scale(.99);}43%,59%{transform:translateY(0) scale(1);}68%{transform:translateY(-3px) scale(1.01);}77%{transform:translateY(2px) scale(.99);}88%,100%{transform:translateY(0) scale(1);}}
    `;
    let markup='',css='';
    switch(id) {
      case 'batman':
        markup=a+moving('batarang',art.bat)+icon(2,'hit signal',`<circle cx="30" cy="30" r="28" fill="#efcc66" fill-opacity=".2"/><g transform="translate(1 9) scale(.9)" color="#efcc66">${art.bat}</g>`)+icon(3,'echo',ring);
        css=`.stage{--effect:#efcc66}.hero .vn-character{animation:vn-batman var(--vn-cycle) ease-in-out infinite}.hero .hero-cape{transform-box:fill-box;transform-origin:50% 8%;animation:vn-cape 2.8s ease-in-out -1.4s infinite}.batarang{width:34px;filter:drop-shadow(0 0 5px #efcc66);animation:vn-batarang var(--vn-cycle) cubic-bezier(.5,.05,.25,1) infinite}.signal{animation:vn-signal var(--vn-cycle) ease-in-out infinite}
          @keyframes vn-signal{0%,28%{opacity:.15;transform:scale(.84)}38%,49%{opacity:1;transform:scale(1.05)}59%,69%{opacity:.45;transform:scale(.96)}80%,100%{opacity:.15;transform:scale(.84)}}
          @keyframes vn-batman{0%,14%{transform:rotate(-2deg) translateY(2px)}19%,28%{transform:rotate(3deg) translateY(-2px)}34%,47%{transform:rotate(-4deg) translateY(1px)}53%,70%{transform:rotate(0) translateY(0)}82%{transform:rotate(5deg) translateY(-2px)}100%{transform:rotate(0) translateY(2px)}}
          @keyframes vn-cape{0%,100%{transform:skewX(0) scaleX(1)}50%{transform:skewX(-5deg) scaleX(1.04)}}
          ${actorFrames(`0%{transform:translate(-65px,-30px) rotate(-22deg);opacity:0;}7%,24%{transform:${pos(0)};opacity:1;}42%{transform:${pos(1,14,'-9px')};}67%{transform:${pos(2,-12)};} ${exit}`)}
          @keyframes vn-batarang{0%,26%{transform:translate(calc(var(--cx0) + 14px),var(--y0)) rotate(0) scale(.55);opacity:0;}30%{transform:translate(calc(var(--cx0) + 14px),var(--y0)) rotate(0) scale(1);opacity:1;}41%{transform:translate(var(--cx1),calc(var(--cy1) - 22px)) rotate(420deg) scale(1.12);opacity:1;}50%{transform:translate(calc(var(--cx2) - 17px),calc(var(--cy2) - 15px)) rotate(800deg) scale(1);opacity:1;}61%{transform:translate(calc(var(--cx2) - 17px),calc(var(--cy2) - 15px)) rotate(1120deg) scale(.95);opacity:.85;}69%,100%{transform:translate(calc(var(--cx2) - 17px),calc(var(--cy2) - 15px)) rotate(1440deg) scale(.7);opacity:0;}}`;
        break;
      case 'star-wars':
        markup=a+beam('force',hand(p[0]),p[1],'#ff718b')+icon(1,'hit force-ring',ring)+icon(2,'echo force-ring',ring);
        css=`.stage{--effect:#ff819b}.hero .vn-character{animation:vn-vader var(--vn-cycle) ease-in-out infinite}.force i{height:5px;filter:drop-shadow(0 0 4px #ff355e);box-shadow:0 0 11px #ff355e;animation:vn-ray var(--vn-cycle) linear infinite}.force-ring{width:46px;height:46px;margin:-23px;filter:drop-shadow(0 0 5px #ff718b)}
          @keyframes vn-vader{0%,15%{transform:rotate(0) translateY(2px)}24%,30%{transform:rotate(-2deg) translateY(0)}32%,42%{transform:rotate(2deg) translateY(-1px)}48%,63%{transform:rotate(0) translateY(1px)}76%{transform:rotate(-4deg) translateY(-2px)}100%{transform:rotate(0) translateY(2px)}}
          ${actorFrames(`${walk}32%,62%{transform:${pos(0,-5)};}73%{transform:${pos(1)};}82%{transform:${pos(2)};}${exit}`)}`;
        break;
      case 'harry-potter':
        markup=a+beam('spell',hand(p[0]),p[1],'#ffdfa0')+icon(1,'hit enchantment',art.star)+icon(3,'echo',art.star);
        css=`.stage{--effect:#ffe19f}.hero .vn-character{animation:vn-wizard var(--vn-cycle) ease-in-out infinite}.spell i{height:3px;box-shadow:0 0 8px #ffdfa0;animation:vn-ray var(--vn-cycle) linear infinite}.enchantment{width:28px;height:28px;margin:-14px;filter:drop-shadow(0 0 5px #ffe19f)}
          @keyframes vn-wizard{0%,18%{transform:rotate(0)}29%{transform:rotate(-4deg) translateY(-1px)}34%,40%{transform:rotate(5deg) translateY(-3px)}46%{transform:rotate(-2deg)}55%,68%{transform:rotate(0)}81%{transform:rotate(3deg)}100%{transform:rotate(0)}}
          ${actorFrames(`${walk}31%{transform:${pos(0,-7)};}38%,51%{transform:${pos(0)};}66%{transform:${pos(2)};}${exit}`)}`;
        break;
      case 'deadpool':
        markup=a+icon(1,'hit slash',trace)+icon(1,'echo slash cross',trace)+icon(2,'hit badge',art.symbols[id]);
        css=`.stage{--effect:#ff8ca7}.hero{transform-origin:50% 82%}.hero .vn-character{animation:vn-deadpool var(--vn-cycle) cubic-bezier(.3,.1,.25,1) infinite}.slash{width:42px;height:42px;margin:-21px;filter:drop-shadow(0 0 4px #ff8ca7)}.cross svg{transform:scaleX(-1)}.cross{animation-delay:.55s}.badge{animation-delay:3s;width:22px;height:22px;margin:-11px;}
          @keyframes vn-deadpool{0%,15%{transform:rotate(0)}30%{transform:rotate(-4deg)}36%{transform:rotate(7deg)}43%{transform:rotate(-8deg)}49%{transform:rotate(4deg)}58%{transform:rotate(180deg)}64%{transform:rotate(360deg)}71%{transform:rotate(360deg)}86%,100%{transform:rotate(0)}}
          ${actorFrames(`${walk}36%{transform:${pos(1,-12)};}46%{transform:${pos(1,8)};}57%{transform:${pos(2,185,'-10px')};}69%{transform:${pos(2,360)};} ${exit}`)}`;
        break;
      case 'stranger-things':
        markup=a+icon(1,'lift cube','<rect x="18" y="18" width="24" height="24" rx="3" fill="#9193db" stroke="#e7c5d7"/>')+icon(2,'lift cube second','<rect x="21" y="21" width="18" height="18" rx="2" fill="#bf6687" stroke="#ffe0cd"/>')+icon(3,'hit rift',art.symbols[id]);
        css=`.stage{--effect:#f399a6}.hero .vn-character{animation:vn-eleven var(--vn-cycle) ease-in-out infinite}.lift{filter:drop-shadow(0 0 5px #f399a6);animation:vn-lift var(--vn-cycle) cubic-bezier(.2,.8,.2,1) infinite}.lift.second{animation-delay:1s}.rift{height:58px;margin-top:-29px;filter:drop-shadow(0 0 6px #dc607f)}
          @keyframes vn-eleven{0%,20%{transform:rotate(0) translateY(0)}29%{transform:rotate(-2deg) translateY(-2px)}37%,49%{transform:rotate(1deg) translateY(-5px)}56%{transform:rotate(0) translateY(-2px)}66%,78%{transform:rotate(-2deg) translateY(0)}100%{transform:rotate(0) translateY(0)}}
          ${actorFrames(`${walk}38%,52%{transform:${pos(0,0,'-6px')};}62%{transform:${pos(0)};}77%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-lift{0%,23%{opacity:0;transform:translateY(0) rotate(0);}32%{opacity:.9;transform:translateY(-4px) rotate(-8deg);}45%{opacity:.9;transform:translateY(-16px) rotate(13deg);}55%{opacity:1;transform:translateY(-12px) rotate(-12deg);}64%,100%{opacity:0;transform:translateY(0) rotate(0);}}`;
        break;
      case 'wednesday':
        markup=a+moving('thing',art.hand)+icon(1,'hit moon','<path d="M36 5a24 24 0 1 0 18 39A24 24 0 0 1 36 5Z" fill="#d9c7ef"/>')+icon(3,'echo',art.star);
        css=`.stage{--effect:#ddc0fb}.hero .vn-character{animation:vn-wednesday var(--vn-cycle) ease-in-out infinite}.thing{width:27px;height:27px;filter:drop-shadow(0 0 4px #ddc0fb);animation:vn-thing var(--vn-cycle) cubic-bezier(.4,0,.2,1) infinite;}
          @keyframes vn-wednesday{0%,20%{transform:rotate(0) translateY(0)}29%{transform:rotate(-7deg) translateY(-2px)}35%{transform:rotate(7deg) translateY(0)}41%{transform:rotate(-8deg) translateY(-2px)}47%{transform:rotate(8deg) translateY(0)}54%{transform:rotate(-5deg) translateY(-1px)}62%{transform:rotate(4deg)}72%,86%{transform:rotate(0)}100%{transform:rotate(0)}}
          ${actorFrames(`${walk}32%{transform:${pos(0,14)};}39%{transform:${pos(1,-14)};}46%{transform:${pos(1,14)};}53%{transform:${pos(1,-10)};}61%{transform:${pos(2,12)};}69%{transform:${pos(2,-13)};}78%{transform:${pos(2,8)};}${exit}`)}
          @keyframes vn-thing{0%{transform:translate(-30px,calc(var(--height) - 28px));opacity:0;}15%{transform:translate(var(--cx0),calc(var(--height) - 28px)) rotate(-8deg);opacity:1;}35%{transform:translate(var(--cx1),calc(var(--height) - 31px)) rotate(8deg);}55%{transform:translate(var(--cx2),calc(var(--height) - 28px)) rotate(-8deg);}80%{transform:translate(var(--cx3),calc(var(--height) - 31px)) rotate(8deg);opacity:1;}100%{transform:translate(var(--width),calc(var(--height) - 28px));opacity:0;}}`;
        break;
      case 'squid-game':
        markup=a+icon(3,'green signal',light('#83e6ba'))+icon(3,'red signal',light('#ff7296'))+icon(1,'hit shapes',art.symbols[id]);
        css=`.stage{--effect:#ffa5c8}.hero .vn-character{animation:vn-guard var(--vn-cycle) ease-in-out infinite}.green{animation:vn-green var(--vn-cycle) linear infinite}.red{animation:vn-red var(--vn-cycle) linear infinite}.signal{width:27px;height:27px;margin:-13.5px;filter:drop-shadow(0 0 5px currentColor)}
          @keyframes vn-guard{0%,13%{transform:translateY(1px)}22%,36%{transform:translateY(0)}41%{transform:translateY(1px) rotate(1deg)}47%,58%{transform:translateY(0)}69%{transform:translateY(-1px)}100%{transform:translateY(1px)}}
          ${actorFrames(`${walk}40%,57%{transform:${pos(1)};}74%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-green{0%,10%{opacity:0;transform:scale(.6);}14%,36%{opacity:1;transform:scale(1);}39%,59%{opacity:0;transform:scale(.8);}62%,82%{opacity:1;transform:scale(1);}87%,100%{opacity:0;transform:scale(.6);}}
          @keyframes vn-red{0%,36%{opacity:0;transform:scale(.6);}40%,57%{opacity:1;transform:scale(1);}60%,100%{opacity:0;transform:scale(.8);}}`;
        break;
      case 'god-of-war': {
        const origin=hand(p[0]);
        markup=a+moving('leviathan',art.axe)+icon(2,'hit frost',`<g color="#b9f8ff">${art.star}</g>`)+icon(2,'echo frost-ring',ring);
        css=`.stage{--effect:#aeeeff}.hero .vn-character{animation:vn-kratos var(--vn-cycle) ease-in-out infinite}.leviathan{width:34px;height:34px;filter:drop-shadow(0 0 6px #9cefff);animation:vn-axe var(--vn-cycle) cubic-bezier(.45,0,.18,1) infinite;}.hero .held-axe{transform-box:fill-box;transform-origin:15% 12%;animation:vn-held-axe var(--vn-cycle) ease-in-out infinite;}
          @keyframes vn-kratos{0%,20%{transform:rotate(0)}29%{transform:rotate(-4deg) translateY(1px)}35%{transform:rotate(7deg) translateY(-2px)}42%{transform:rotate(-3deg)}50%,66%{transform:rotate(0)}78%{transform:rotate(3deg)}100%{transform:rotate(0)}}
          ${actorFrames(`${walk}32%{transform:${pos(0,-10)};}38%,63%{transform:${pos(0)};}77%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-axe{0%,29%{opacity:0;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(-10deg) scale(.7);}31%{opacity:1;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(-10deg) scale(1);}40%{opacity:1;transform:translate(var(--cx1),calc(var(--cy1) - 22px)) rotate(350deg) scale(1.08);}46%,49%{opacity:1;transform:translate(calc(var(--cx2) - 17px),calc(var(--cy2) - 17px)) rotate(720deg) scale(1);}58%{opacity:.9;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(1080deg) scale(.94);}62%,100%{opacity:0;transform:translate(${origin.x-17}px,${origin.y-17}px) rotate(1080deg) scale(.7);}}
          @keyframes vn-held-axe{0%,28%,59%,100%{opacity:1;transform:rotate(0)}30%{opacity:.7;transform:rotate(-28deg)}34%,56%{opacity:0;transform:rotate(38deg)}58%{opacity:.75;transform:rotate(12deg)}}`;
        break;
      }
      case 'assassins-creed':
        markup=a+moving('eagle','<path d="M30 27Q17 10 1 20l14 5-12 3 20 5 7 12 7-12 20-5-12-3 14-5Q43 10 30 27Z" fill="#e8dfc9"/><path d="m27 31 3-8 4 8" fill="#baa886"/>')+icon(2,'hit landing','<path d="M8 36q22-13 44 0M3 43q27-19 54 0" fill="none" stroke="#d8bf92" stroke-width="3"/>')+icon(3,'echo',art.seal);
        css=`.stage{--effect:#e9d4b1}.hero .vn-character{animation:vn-assassin var(--vn-cycle) cubic-bezier(.4,0,.2,1) infinite}.eagle{width:35px;height:35px;filter:drop-shadow(0 0 4px #e9d4b1);animation:vn-eagle var(--vn-cycle) ease-in-out infinite;}
          @keyframes vn-assassin{0%,21%{transform:rotate(0) translateY(0)}30%,36%{transform:rotate(-5deg) translateY(-2px)}43%{transform:rotate(11deg) translateY(2px)}48%,56%{transform:rotate(-3deg) translateY(0)}63%{transform:rotate(2deg) translateY(1px)}76%,86%{transform:rotate(0)}100%{transform:rotate(0)}}
          ${actorFrames(`0%{transform:translate(-50px,var(--y0));opacity:0;}7%,24%{transform:${pos(0)};opacity:1;}38%{transform:${pos(1,85,'-12px')};}47%{transform:${pos(2,90,'-8px')};}57%,63%{transform:${pos(2)};} ${exit}`)}
          @keyframes vn-eagle{0%,13%{transform:translate(-40px,0) rotate(-12deg);opacity:0;}25%{transform:translate(var(--cx0),0) rotate(6deg);opacity:1;}48%{transform:translate(var(--cx2),7px) rotate(-7deg);}78%{transform:translate(var(--cx3),0) rotate(6deg);opacity:1;}95%,100%{transform:translate(var(--width),0);opacity:0;}}`;
        break;
      case 'minecraft':
        markup=a+icon(2,'mine-block',art.block)+icon(2,'cracks','<path d="m30 8-4 13 9 5-6 8 5 19m-8-32-12-5m15 18-14 7m20-15 11-8" fill="none" stroke="#142825" stroke-width="3"/>')+icon(2,'chips','<g fill="#b9df8c"><path d="M6 12h7v7H6Zm35-5h8v8h-8ZM9 42h6v6H9Zm36-5h7v7h-7Z"/></g>');
        css=`.stage{--effect:#b7e990}.hero .vn-character{animation:vn-steve var(--vn-cycle) ease-in-out infinite}.mine-block{filter:drop-shadow(0 0 5px #a2d977);animation:vn-block var(--vn-cycle) cubic-bezier(.2,.8,.2,1) infinite}.cracks{animation:vn-cracks var(--vn-cycle) linear infinite}.chips{animation:vn-chips var(--vn-cycle) ease-out infinite}.hero .held-pickaxe{transform-box:fill-box;transform-origin:72% 34%;animation:vn-pickaxe var(--vn-cycle) cubic-bezier(.4,0,.2,1) infinite;}
          @keyframes vn-steve{0%,20%{transform:rotate(0)}28%{transform:rotate(-3deg) translateY(1px)}33%{transform:rotate(5deg) translateY(-1px)}38%{transform:rotate(-5deg) translateY(1px)}44%{transform:rotate(3deg)}51%,65%{transform:rotate(0)}78%{transform:rotate(2deg)}100%{transform:rotate(0)}}
          ${actorFrames(`0%{transform:translate(calc(0px - var(--size)),var(--y0));opacity:0;}5%{transform:${pos(0)};opacity:1;}18%,24%{transform:${pos(0)};opacity:1;}27%,30%,42%{transform:translate(calc(var(--cx2) - var(--size)*.86),var(--y2)) rotate(-5deg);opacity:1;}35%,47%{transform:translate(calc(var(--cx2) - var(--size)*.86),var(--y2)) rotate(4deg);}53%{transform:translate(calc(var(--cx2) - var(--size)*.86),var(--y2));}68%{transform:${pos(2)};}${exit}`)}
          @keyframes vn-block{0%,13%{opacity:0;transform:scale(.7);}20%,45%{opacity:1;transform:scale(1);}48%,100%{opacity:0;transform:scale(.7);}}
          @keyframes vn-cracks{0%,33%{opacity:0;transform:scale(1);}36%,46%{opacity:1;transform:scale(1);}49%,100%{opacity:0;transform:scale(.7);}}
          @keyframes vn-chips{0%,45%{opacity:0;transform:scale(.3);}48%{opacity:1;transform:scale(.8);}61%,100%{opacity:0;transform:scale(1.8) translateY(10px);}}
          @keyframes vn-pickaxe{0%,26%,53%,100%{transform:rotate(0);}30%,42%{transform:rotate(-40deg);}35%,47%{transform:rotate(25deg);}}`;
        break;
    }
    return {markup,css:cssBase+css};
  }
};

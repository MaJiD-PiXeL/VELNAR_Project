globalThis.VELNAR = globalThis.VELNAR || {};

// A small overlay per graph. Native contribution cells never receive animations.
VELNAR.GraphScenes = {
  STYLE_ID: "velnar-graph-style",
  _state: null,
  _graphs: new Map(),
  _observer: null,
  _resize: null,
  _intersection: null,
  _frame: null,
  apply(theme, settings) {
    if (!theme?.scene || !settings.enabled || !settings.animationsEnabled || settings.componentOverrides?.contributionGraph === false || document.hidden || matchMedia("(prefers-reduced-motion:reduce)").matches) {
      this.remove(); return;
    }
    this._state = theme;
    const tag = VELNAR.Injector._getOrCreateTag(this.STYLE_ID);
    const css = '[data-velnar-graph] {position:relative!important;} [data-velnar-graph]::after {content:none!important;animation:none!important;}';
    if (tag.textContent !== css) tag.textContent = css;
    if (!this._observer && document.body) {
      this._observer = new MutationObserver(records => {
        if (records.some(r => r.target.closest?.('.js-calendar-graph') || [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType === 1 && (n.matches('.js-calendar-graph,.js-calendar-graph-table') || n.querySelector('.js-calendar-graph,.js-calendar-graph-table'))))) this._schedule();
      });
      this._observer.observe(document.body, {childList:true,subtree:true});
      this._resize = new ResizeObserver(() => this._schedule());
      this._intersection = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const record = this._graphs.get(entry.target);
          if (record) record.host.dataset.visible = String(entry.isIntersecting);
        }
      });
    }
    this._sync();
  },
  _schedule() {
    if (this._frame !== null) return;
    this._frame = requestAnimationFrame(() => { this._frame = null; this._sync(); });
  },
  _discard(root, record) {
    this._resize?.unobserve(root);
    if (record.table) this._resize?.unobserve(record.table);
    this._intersection?.unobserve(root);
    record.host.remove();
    root.removeAttribute('data-velnar-graph');
    this._graphs.delete(root);
  },
  remove() {
    this._state = null;
    this._observer?.disconnect(); this._observer = null;
    for (const [root, record] of this._graphs) this._discard(root, record);
    this._resize?.disconnect(); this._resize = null;
    this._intersection?.disconnect(); this._intersection = null;
    if (this._frame !== null) cancelAnimationFrame(this._frame);
    this._frame = null;
    document.getElementById(this.STYLE_ID)?.remove();
  },
  _sync() {
    if (!this._state) return;
    for (const [root, record] of this._graphs) if (!root.isConnected || !root.contains(record.host)) this._discard(root, record);
    for (const root of document.querySelectorAll('.js-calendar-graph')) {
      if (!(root instanceof HTMLElement)) continue;
      const table = root.querySelector('.js-calendar-graph-table,svg');
      const cells = [...root.querySelectorAll('.js-calendar-graph-table td.ContributionCalendar-day,rect.ContributionCalendar-day')];
      if (!cells.length) continue;
      const boxes = cells.map(el => el.getBoundingClientRect()).filter(r => r.width && r.height);
      if (!boxes.length) continue;
      const outer = root.getBoundingClientRect();
      const left = Math.min(...boxes.map(r=>r.left)), top = Math.min(...boxes.map(r=>r.top));
      const width = Math.max(...boxes.map(r=>r.right)) - left, height = Math.max(...boxes.map(r=>r.bottom)) - top;
      if (width < 180 || height < 35) continue;
      // Scene anchors snap to real cell centers, including horizontally scrolled graphs.
      const anchor = (x,y) => {
        const targetX=left+width*x,targetY=top+height*y;
        const box=boxes.reduce((a,b)=>Math.hypot(a.left+a.width/2-targetX,a.top+a.height/2-targetY)<Math.hypot(b.left+b.width/2-targetX,b.top+b.height/2-targetY)?a:b);
        return {x:box.left-left+box.width/2,y:box.top-top+box.height/2,w:box.width,h:box.height};
      };
      const points=[anchor(.18,.72),anchor(.43,.15),anchor(.65,.66),anchor(.87,.2)];
      let record=this._graphs.get(root);
      if (!record) {
        const host=document.createElement('div');host.className='velnar-graph-scene';host.inert=true;host.setAttribute('aria-hidden','true');
        host.style.cssText='all:initial!important;position:absolute!important;pointer-events:none!important;overflow:hidden!important;z-index:2!important;contain:strict!important;';
        host.attachShadow({mode:'open'});
        root.setAttribute('data-velnar-graph','');root.append(host);
        record={host,table,signature:''};this._graphs.set(root,record);
        this._resize?.observe(root);if(table)this._resize?.observe(table);this._intersection?.observe(root);
      }
      if (record.table !== table) { if(record.table)this._resize?.unobserve(record.table);if(table)this._resize?.observe(table);record.table=table; }
      const x=left-outer.left+root.scrollLeft-root.clientLeft,y=top-outer.top+root.scrollTop-root.clientTop;
      const signature=JSON.stringify([this._state.id,x,y,width,height,points]);
      if(record.signature===signature)continue;
      record.signature=signature;
      for (const [key,value] of Object.entries({left:x,top:y,width,height})) record.host.style.setProperty(key,value+'px','important');
      record.host.dataset.scene=this._state.id;
      this._render(record.host,this._state,{width,height,points});
    }
  },
  _render(host,theme,{width,height,points:p}) {
    const size=Math.min(76,Math.max(40,height*.78),height*.9);
    const actor=(name)=>`<div class="actor ${name}">${VELNAR.CharacterArt.svg(theme.id)}</div>`;
    const actorY=q=>Math.max(1,Math.min(height-size-1,q.y-size*.85));
    const target=(n,cls,body)=>`<div class="target ${cls}" style="left:${p[n].x}px;top:${p[n].y}px">${body}</div>`;
    const web='<svg viewBox="-30 -30 60 60"><g fill="none" stroke="#c8efff" stroke-width="1.5"><path d="M-29 0h58M0-29v58m-21-21 42 42m0-42-42 42M-20 0Q-10-10 0-20 10-10 20 0 10 10 0 20-10 10-20 0ZM-10 0Q-5-5 0-10 5-5 10 0 5 5 0 10-5 5-10 0Z"/></g></svg>';
    const fungus='<svg viewBox="-30 -30 60 60"><g stroke="#dac295" stroke-width="2" fill="#b8b976"><path d="M0 25Q4 2-7-20M1 17 19-4M1 9-17-1" fill="none"/><ellipse cx="-10" cy="-14" rx="12" ry="5" transform="rotate(25 -10 -14)"/><ellipse cx="17" cy="-1" rx="12" ry="5" transform="rotate(-20 17 -1)"/><ellipse cx="-13" cy="2" rx="11" ry="5"/></g></svg>';
    const portal='<svg viewBox="-30 -30 60 60"><ellipse rx="20" ry="27" fill="#12391a" stroke="#adf653" stroke-width="4"/><path d="M0-23C26-16 24 16 0 22S-23-8-3-13 15 14 1 12-12-3 1-2" fill="none" stroke="#e2ffa3" stroke-width="3"/></svg>';
    const reticle='<svg viewBox="-30 -30 60 60"><g fill="none" stroke="#f37350" stroke-width="2"><circle r="13"/><path d="M-22 0h13m18 0h13M0-22v13m0 18v13"/></g><circle r="3" fill="#ffd092"/></svg>';
    const spark='<svg viewBox="-30 -30 60 60"><path d="m0-25 5 17 16-7-10 14 16 7-18 1 4 18L0 11-12 25l4-19-18-6 18-5-6-18L-1-10Z" fill="#e4fcff"/><circle r="5" fill="#70deff"/></svg>';
    const beam=(name,a,b,color)=>{
      const dx=b.x-a.x,dy=b.y-a.y;
      return `<div class="beam-wrap ${name}" style="left:${a.x}px;top:${a.y}px;width:${Math.hypot(dx,dy)}px;transform:rotate(${Math.atan2(dy,dx)}rad)"><i style="background:${color}"></i></div>`;
    };
    const handPoint={'spider-man':[153,60],'the-last-of-us':[152,73],'red-dead':[155,61],'iron-man':[145,61],'star-wars':[138,77],'harry-potter':[155,41],'god-of-war':[134,64]}[theme.id]||[145,61];
    const hand=q=>({x:q.x-size/2+size/12+handPoint[0]/192*size,y:actorY(q)+handPoint[1]/192*size});
    const shotStart=hand(p[0]);
    const extra=VELNAR.CollectionStories?.render(theme.id,{actor,target,beam,hand,points:p,size});
    const scenes=extra?{}:{
      'spider-man':actor('webman')+beam('thread',shotStart,p[1],'#ddf4ff')+beam('thread second',hand(p[2]),p[3],'#ddf4ff')+target(1,'web-hit',web)+target(3,'web-hit second',web),
      'the-last-of-us':actor('survivor')+'<div class="flashlight"></div>'+target(0,'colony',fungus)+target(2,'colony second',fungus)+target(3,'colony third',fungus)+'<div class="firefly"></div>',
      'red-dead':actor('outlaw')+target(1,'crosshair',reticle)+target(3,'crosshair second',reticle)+beam('bullet',shotStart,p[1],'#ffd591')+target(1,'impact',spark.replaceAll('#e4fcff','#ffe0a2').replaceAll('#70deff','#ed8e43')),
      'rick-and-morty':target(0,'portal entrance',portal)+target(3,'portal exit',portal)+actor('duo'),
      'iron-man':actor('ironman')+beam('repulsor',shotStart,p[1],'#a4f7ff')+target(1,'arc-hit',spark)+'<div class="exhaust"></div>'
    };
    const style=document.createElement('style');style.textContent=this._css(theme.id)+(extra?.css||'');
    const light=hand({...p[1],y:p[0].y});
    const stage=document.createElement('div');stage.className='stage';stage.style.cssText=`--size:${size}px;--width:${width}px;--height:${height}px;--cell:${p[0].w}px;--light-x:${light.x}px;--light-y:${light.y-height*.45}px;`+p.map((q,i)=>`--x${i}:${q.x-size/2}px;--y${i}:${actorY(q)}px;--cx${i}:${q.x}px;--cy${i}:${q.y}px;`).join('');
    stage.innerHTML=extra?.markup||scenes[theme.id]||'';host.shadowRoot.replaceChildren(style,stage);
  },
  _css(scene) {
    const base=`
      :host,*{box-sizing:border-box;pointer-events:none!important;} .stage{position:absolute;inset:0;overflow:hidden;}
      svg{display:block;width:100%;height:100%;overflow:visible;} .actor{position:absolute;left:0;top:0;width:var(--size);height:var(--size);transform-origin:center;}
      .target{position:absolute;width:36px;height:36px;margin:-18px;transform-origin:center;opacity:0;}
      .beam-wrap{position:absolute;height:2px;transform-origin:left center;}.beam-wrap i{display:block;height:100%;width:100%;transform-origin:left center;opacity:0;}
      :host([data-visible="false"]) *{animation-play-state:paused!important;}
      @media(prefers-reduced-motion:reduce){.stage{display:none;}}
    `;
    const css={
      'spider-man':`
        .webman{animation:vn-graph-webman 14s linear infinite;}.thread i{animation:vn-graph-thread 14s linear infinite;}
        .web-hit{animation:vn-graph-web-hit 14s ease-out infinite;}.web-hit.second,.thread.second i{animation-delay:4.6s;}
        @keyframes vn-graph-webman{0%{transform:translate(-45px,var(--y0)) rotate(-18deg);opacity:0;}8%,24%{transform:translate(var(--x0),var(--y0));opacity:1;}33%{transform:translate(var(--x0),var(--y0)) rotate(-8deg);}43%{transform:translate(var(--x1),-8px) rotate(25deg);}55%,63%{transform:translate(var(--x2),var(--y2));}77%{transform:translate(var(--x3),-10px) rotate(20deg);}88%{transform:translate(var(--width),var(--y3)) rotate(-15deg);opacity:1;}89%,100%{transform:translate(var(--width),var(--y3));opacity:0;}}
        @keyframes vn-graph-thread{0%,23%{transform:scaleX(0);opacity:0;}24%{transform:scaleX(.05);opacity:1;}28%,34%{transform:scaleX(1);opacity:.9;}42%,100%{transform:scaleX(1);opacity:0;}}
        @keyframes vn-graph-web-hit{0%,27%{transform:scale(.1);opacity:0;}31%,45%{transform:scale(1);opacity:.8;}58%,100%{transform:scale(1.1);opacity:0;}}
      `,
      'the-last-of-us':`
        .survivor{animation:vn-graph-scout 18s linear infinite;}.flashlight{position:absolute;left:var(--light-x);top:var(--light-y);width:36%;height:90%;background:linear-gradient(90deg,#eddfa32e,transparent);clip-path:polygon(0 48%,100% 0,100% 100%);transform-origin:left center;animation:vn-graph-torch 18s ease-in-out infinite;}
        .colony{animation:vn-graph-colony 18s ease-in-out infinite;transform-origin:center bottom;}.colony.second{animation-delay:3s;}.colony.third{animation-delay:6s;}
        .firefly{position:absolute;left:0;top:0;width:4px;height:4px;border-radius:50%;background:#efffc2;box-shadow:0 0 8px #dfff91;animation:vn-graph-firefly 18s ease-in-out infinite;}
        @keyframes vn-graph-scout{0%{transform:translate(-40px,var(--y0));opacity:0;}10%{opacity:1;}35%,58%{transform:translate(var(--x1),var(--y0));}85%{transform:translate(var(--x3),var(--y0));opacity:1;}96%,100%{transform:translate(var(--width),var(--y0));opacity:0;}}
        @keyframes vn-graph-torch{0%,32%,65%,100%{opacity:0;transform:rotate(-12deg);}39%,56%{opacity:.85;transform:rotate(8deg);}}
        @keyframes vn-graph-colony{0%,12%{transform:scale(.15);opacity:0;}35%,60%{transform:scale(1);opacity:.85;}82%,100%{transform:scale(1.05);opacity:0;}}
        @keyframes vn-graph-firefly{0%,100%{transform:translate(var(--cx0),var(--cy0));opacity:0;}25%{transform:translate(var(--cx1),var(--cy1));opacity:1;}50%{transform:translate(var(--cx2),var(--cy2));opacity:.8;}75%{transform:translate(var(--cx3),var(--cy3));opacity:1;}}
      `,
      'red-dead':`
        .outlaw{animation:vn-graph-gunslinger 16s linear infinite;}.crosshair{animation:vn-graph-deadeye 16s ease-out infinite;}.crosshair.second{animation-delay:5s;}
        .bullet i{height:1px;animation:vn-graph-bullet 16s linear infinite;}.impact{animation:vn-graph-impact 16s ease-out infinite;}
        @keyframes vn-graph-gunslinger{0%{transform:translate(-40px,var(--y0));opacity:0;}12%,30%{transform:translate(var(--x0),var(--y0));opacity:1;}31%{transform:translate(calc(var(--x0) - 3px),var(--y0)) rotate(-8deg);}35%,47%{transform:translate(var(--x0),var(--y0));}69%{transform:translate(var(--x2),var(--y2));}91%,100%{transform:translate(var(--width),var(--y2));opacity:0;}}
        @keyframes vn-graph-deadeye{0%,16%{transform:scale(1.5);opacity:0;}23%,30%{transform:scale(1);opacity:.95;}35%,100%{transform:scale(.5);opacity:0;}}
        @keyframes vn-graph-bullet{0%,30%{transform:scaleX(0);opacity:0;}31%{transform:scaleX(1);opacity:.9;}34%,100%{transform:scaleX(1);opacity:0;}}
        @keyframes vn-graph-impact{0%,31%{transform:scale(.1);opacity:0;}33%{transform:scale(.6);opacity:.9;}38%,100%{transform:scale(1.1);opacity:0;}}
      `,
      'rick-and-morty':`
        .portal{width:34px;height:52px;margin:-26px -17px;animation:vn-graph-portal 16s ease-in-out infinite;}.portal.exit{animation-delay:1s;}.portal svg{animation:vn-graph-portal-wobble 4s ease-in-out infinite;}
        .duo{animation:vn-graph-portal-walk 16s linear infinite;}
        @keyframes vn-graph-portal{0%,4%{transform:scaleY(.05);opacity:0;}14%,76%{transform:scaleY(1);opacity:.95;}88%,100%{transform:scaleY(.05);opacity:0;}}
        @keyframes vn-graph-portal-wobble{50%{transform:rotate(8deg) scaleX(.9);}}
        @keyframes vn-graph-portal-walk{0%,12%{transform:translate(var(--x0),var(--y0)) scaleX(.05);opacity:0;}22%{transform:translate(var(--x0),var(--y0)) scaleX(1);opacity:1;}38%{transform:translate(var(--x1),var(--y2)) rotate(-3deg);}55%{transform:translate(var(--x2),var(--y2)) rotate(3deg);}70%{transform:translate(var(--x3),var(--y3)) scaleX(1);opacity:1;}78%,100%{transform:translate(var(--x3),var(--y3)) scaleX(.05);opacity:0;}}
      `,
      'iron-man':`
        .ironman{animation:vn-graph-flight 15s ease-in-out infinite;}.repulsor i{height:3px;animation:vn-graph-repulsor 15s linear infinite;}.arc-hit{animation:vn-graph-arc-hit 15s ease-out infinite;}
        .exhaust{position:absolute;left:0;top:0;width:6px;height:16px;margin-left:calc(var(--size)*.33);margin-top:calc(var(--size)*.82);background:linear-gradient(90deg,transparent,#82eaff);animation:vn-graph-flight 15s ease-in-out infinite;}
        @keyframes vn-graph-flight{0%{transform:translate(-45px,var(--y0)) rotate(65deg);opacity:0;}14%,25%{transform:translate(var(--x0),var(--y0));opacity:1;}28%,39%{transform:translate(var(--x0),calc(var(--y0) - 3px));}52%{transform:translate(var(--x1),var(--y1)) rotate(65deg);}72%{transform:translate(var(--x3),var(--y3)) rotate(70deg);opacity:1;}87%,100%{transform:translate(var(--width),-35px) rotate(65deg);opacity:0;}}
        @keyframes vn-graph-repulsor{0%,25%{transform:scaleX(0);opacity:0;}28%,32%{transform:scaleX(1);opacity:.9;}39%,100%{transform:scaleX(1);opacity:0;}}
        @keyframes vn-graph-arc-hit{0%,27%{transform:scale(.1);opacity:0;}31%{transform:scale(.8);opacity:1;}42%,100%{transform:scale(1.25);opacity:0;}}
      `
    };
    return base+(css[scene]||'');
  }
};

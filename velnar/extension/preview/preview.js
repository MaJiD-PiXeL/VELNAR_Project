(() => {
  const descriptions = {
    "spider-man": "Watch Spider-Man cross your contribution squares, shoot webs onto cells and swing to his next landing.",
    "the-last-of-us": "Ellie explores your activity grid with her backpack and flashlight while fungal colonies grow and a firefly drifts between cells.",
    "red-dead": "Arthur Morgan steps onto your activity grid, lines up a Dead Eye target and fires across the contribution squares.",
    "rick-and-morty": "Rick and Morty step out of a green portal, cross your contribution squares and disappear into another dimension.",
    "iron-man": "Iron Man flies through your activity grid, fires a repulsor at a contribution cell and accelerates away."
  };
  const worlds = VELNAR.PRESET_THEMES.filter(theme => theme.scene);
  const fromHash = location.hash.slice(1);
  let selected = worlds.find(theme => theme.id === fromHash) || worlds[0];
  let motion = true;
  const motionStyle = document.createElement("style"); document.head.append(motionStyle);
  const $ = id => document.getElementById(id);
  for (const theme of worlds) {
    const button = document.createElement("button");button.type="button";button.dataset.theme=theme.id;
    button.style.setProperty("--tab-color",theme.colors.accent);
    button.innerHTML = '<i aria-hidden="true"></i><span></span>';
    button.lastChild.textContent=theme.name;
    button.addEventListener("click",()=>{selected=theme;history.replaceState(null,"",`#${theme.id}`);render();});
    $("worldTabs").append(button);
  }
  for(let day=0;day<7;day++) {
    const row=document.createElement("tr");
    for(let week=0;week<52;week++) {
      const cell=document.createElement("td");cell.className="ContributionCalendar-day";
      cell.dataset.level=String((week*13+day*7+Math.floor(week/5))%5);row.append(cell);
    }
    $("contributionCells").append(row);
  }
  function render() {
    const settings=structuredClone(VELNAR.DEFAULT_SETTINGS);settings.animationsEnabled=motion;
    VELNAR.Injector.applyThemeVars(selected.colors,settings.layout);
    VELNAR.Injector.applyComponents(settings.componentOverrides);
    VELNAR.Injector.applyAnimations(motion,settings.componentOverrides,false);
    VELNAR.Cinema.apply(selected,settings);
    motionStyle.textContent=VELNAR.SceneArt.motionCss + (motion ? "" : ".vn-art * {animation:none!important;}");
    $("sceneIllustration").innerHTML=VELNAR.SceneArt.svg(selected.id);
    $("sceneTitle").textContent=selected.name;
    $("sceneKicker").textContent=`WORLD ${String(worlds.indexOf(selected)+1).padStart(2,"0")} / ${String(worlds.length).padStart(2,"0")}`;
    $("sceneDescription").textContent=selected.tagline;
    $("effectDescription").textContent=descriptions[selected.id] || VELNAR.CollectionArt.descriptions[selected.id];
    $("colorDots").replaceChildren();
    for(const key of ["background","backgroundSecondary","accent","accentSecondary","textPrimary"]) {const dot=document.createElement("i");dot.style.background=selected.colors[key];$("colorDots").append(dot);}
    document.querySelectorAll("[data-theme]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.theme===selected.id)));
    $("motionToggle").setAttribute("aria-pressed",String(motion));
    $("motionToggle").textContent=motion?"Pause effects":"Play effects";
    $("replayGraph").disabled=!motion||matchMedia("(prefers-reduced-motion:reduce)").matches;
    $("motionNote").textContent=matchMedia("(prefers-reduced-motion:reduce)").matches?"Reduced motion is on":motion?"Animations are on":"Animations paused";
    $("applyStatus").textContent="";
  }
  $("motionToggle").addEventListener("click",()=>{motion=!motion;render();});
  $("replayGraph").addEventListener("click",()=>document.querySelectorAll('.velnar-graph-scene').forEach(host=>host.shadowRoot.getAnimations().forEach(animation=>{animation.currentTime=0;})));
  $("applyTheme").addEventListener("click",async()=>{
    if(!globalThis.chrome?.runtime?.id){$("applyStatus").textContent="Install VELNAR, then select this theme in the extension.";return;}
    try { await VELNAR.Storage.selectTheme(selected.id);if(!motion)await VELNAR.Storage.set({animationsEnabled:false});$("applyStatus").textContent=`${selected.name} applied to GitHub.`; }
    catch(error){$("applyStatus").textContent=error.message;}
  });
  $("demoAction").addEventListener("click",event=>{const active=event.currentTarget.getAttribute("aria-pressed")!=="true";event.currentTarget.setAttribute("aria-pressed",String(active));event.currentTarget.textContent=active?"Demo starred ★":"Star this demo ☆";});
  matchMedia("(prefers-reduced-motion:reduce)").addEventListener("change",render);
  render();
  if(new URL(location.href).searchParams.get("focus")==="activity") document.querySelector('.activity').scrollIntoView({block:'center'});
})();

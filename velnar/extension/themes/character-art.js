globalThis.VELNAR = globalThis.VELNAR || {};

// Shared, scalable character art for the grid actors and cinematic illustrations.
// Fine detail lives in the vectors; animation still moves just the outer actor.
VELNAR.CharacterArt = (() => {
  let serial=0;
  const names={"spider-man":"Spider-Man","the-last-of-us":"Ellie","red-dead":"Arthur Morgan","rick-and-morty":"Rick and Morty","iron-man":"Iron Man"};
  const art={
    "spider-man":`
      <g stroke="#131c32" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="m58 109-24 24 6 17 18-6 15-18 15 4 5 39 15 4 5-51-19-21Z" fill="url(#@blue@)"/>
        <path d="m40 139-12 11-11 17 7 7 28-20 8-12Z" fill="url(#@red@)"/>
        <path d="m93 158 17 1 4 16 12 6-2 8H93l-4-9Z" fill="url(#@red@)"/>
        <path d="m65 61-21 11-14 27 10 11 14-11 11-22 15 4Z" fill="url(#@red@)"/>
        <path d="m33 94-13 11-9 15 7 6 11-10 13-9Z" fill="url(#@red@)"/>
        <path d="m68 63 25-3 17 14-12 31-8 19-35-12 3-30Z" fill="url(#@red@)"/>
        <path d="m59 87 8 4 3 18-11-2m39-28-9 17 1 16 10-11" fill="#164b8d"/>
        <path d="m94 66 19 8 16-12 10 7-19 21-23-8" fill="url(#@red@)"/>
        <path d="m128 61 10-6 11 1 7 5-2 4-11-3 7 7-3 4-13-5-5 2Z" fill="url(#@red@)"/>
        <path d="m138 58 11-8 4 2-8 9" fill="none"/>
        <path d="M64 24q10-14 26-8 18 6 16 23-1 13-12 22l-11 7-17-10-8-17Z" fill="url(#@red@)"/>
        <g fill="none" stroke="#6e1634" stroke-width="1.15">
          <path d="m83 15 1 23m0 11 1 17M63 22q18 10 36-1M59 36q17-15 45-2M64 54q20-10 36-1M74 18l-4 15m28-12-5 13M66 58l8-9m24 9-7-8M69 67l-6 42m25-46 0 49M63 75q14 7 33 1M59 89q16 8 34 2M58 104q13-5 33 4M45 76l13 10M36 91l13 10M96 72l9 12M108 75l9 10M126 63l8 9M35 146l13 11M27 156l13 8M95 167l17 2M94 180l21-1"/>
        </g>
        <path d="m63 33 19 10-5 13q-11-4-14-23Zm39-2-18 13 8 12q11-7 10-25Z" fill="#f5fcff" stroke-width="3"/>
        <g fill="#111627" stroke="#111627" stroke-width="1.8">
          <ellipse cx="79" cy="87" rx="2.5" ry="5.5"/><circle cx="79" cy="80" r="2"/>
          <path d="m77 83-6-7-4-1m10 10-9-3-3 2m12 4-8 5-3 7m15-17 6-7 4-1m-10 10 9-3 3 2m-12 4 8 5 3 7" fill="none"/>
        </g>
        <path d="m66 26 6-7m-9 53 5-4m-33 27 4-9m59 78 7 1" stroke="#ff9294" fill="none" stroke-width="2"/>
      </g>`,
    "the-last-of-us":`
      <g stroke="#282b28" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
        <path d="m51 106 41-1 4 28-10 38-14-1 5-35-9-7-4 43-15-1-3-39Z" fill="url(#@denim@)"/>
        <path d="m48 162 15 1 0 18-10 7H37l-2-6 11-6Zm26 0 13 0 4 16 14 7-2 5H75l-3-8Z" fill="#715e47"/>
        <path d="m49 169 11 2m-19 11 14-1m22-10 11-1m-5 13 17 2" fill="none" stroke="#bbab85"/>
        <path d="M38 63q-13 7-12 23l4 34 24 5 15-13-3-39Z" fill="#6c6649"/>
        <path d="m31 86 18 1 4 26-18 2Z" fill="#8b8059"/><path d="m32 93 16 1m-7-6 1 23" stroke="#d1bf84" fill="none"/>
        <path d="m52 58 26-5 17 21-6 43-43-2 1-34Z" fill="url(#@denim@)"/>
        <path d="m60 61 11 1 7 48H60Z" fill="#713a3e"/>
        <path d="m58 59-10 13 9 6 3-10m14-13 9 11-6 9-6-11" fill="#7b9091"/>
        <path d="M50 71q-11 17-12 37l9 6 10-24m26-20 17 24 25-10 5 9-29 15-21-24" fill="url(#@skin@)"/>
        <path d="m46 111 0 14-9 5-3-5 3-15m89-30 12-2 7 6-4 7-13 1" fill="url(#@skin@)"/>
        <path d="m123 77 25-8 4 8-25 9Z" fill="#39413e"/><path d="m147 69 5-1 3 8-5 1" fill="#e5dbac"/>
        <path d="m83 64 12 15-9 8-11-16m-27-10-9 14 12 7 6-13" fill="#60797d"/>
        <path d="M61 49v13l10 5 8-9-2-15" fill="url(#@skin@)"/>
        <path d="M47 24q-1-20 26-18 24 2 23 24l-8 28-17 1-20-11Z" fill="#5f3b2f"/>
        <path d="M54 28q7-10 26-9l10 12-4 19-11 9-14-6-7-14Z" fill="url(#@skin@)"/>
        <path d="M49 30q-2-23 22-25 21 1 24 21L83 17l-14 4-10 10-3 14-8-6Z" fill="url(#@hair@)"/>
        <path d="m50 33-9 0-5 12 5 18 6-8 7-6" fill="#654235"/>
        <path d="m57 31 10-2m10 0 8 2" stroke="#684e3e" fill="none"/>
        <path d="m58 35 7 0m12 0 7 0" stroke="#eee6d6" stroke-width="3"/><path d="m62 35 .1 0m19 0 .1 0" stroke="#4b6260" stroke-width="2.8"/>
        <path d="m72 35-2 7 4 1m-7 6 9 0" fill="none" stroke="#a7775d" stroke-width="1.2"/>
        <path d="m61 25 2 5" stroke="#c39979" stroke-width="1"/>
        <g fill="#a67559" stroke="none"><circle cx="59" cy="41" r=".8"/><circle cx="63" cy="42" r=".8"/><circle cx="66" cy="40" r=".7"/><circle cx="78" cy="41" r=".8"/><circle cx="82" cy="40" r=".8"/></g>
        <path d="m105 98 11-8m-9 6-1-5m5 2-1-5m4 3 0-5m-4 8 4 2" fill="none" stroke="#465449" stroke-width="1.1"/>
        <path d="m49 69 6 36m25-40 7 32" stroke="#b2a077" stroke-width="3.5" fill="none"/>
        <path d="m52 118 9 0m21 0 7 0m-34 16-2 20m29-18-4 19" stroke="#84958c" stroke-width="1.2" fill="none"/>
      </g>`,
    "red-dead":`
      <g stroke="#25251f" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
        <path d="m49 106 43 0 5 25-9 41-17 0 8-38-13-7-7 44-17-1 2-37Z" fill="url(#@denim@)"/>
        <path d="m43 159 18 2-3 22-13 6H29l-2-7 13-7Zm31 1 17 0 0 17 15 7-2 6H73l-3-7Z" fill="#553c2a"/>
        <path d="m34 183 19-2m24 3h23m-51-17 8 1m21-2h8" fill="none" stroke="#ab8557"/>
        <path d="m50 57 26-4 20 14 1 43-50 5-4-32Z" fill="url(#@denim@)"/>
        <path d="m50 59-8 14-13 35 10 9 19-31m29-23 23 10 19-10 8 9-24 18-21-8" fill="url(#@denim@)"/>
        <path d="m29 105 10 6-4 16-8 3-5-9m105-60 12-5 9 5 1 8-13 7-8-5Z" fill="url(#@skin@)"/>
        <path d="m51 58-8 23 4 32 18-4 2-38-8-12m14-3 11 8 9 45-20-1-4-36Z" fill="url(#@leather@)"/>
        <path d="m58 57 11 7 9-7-5 22-11-8Z" fill="#b6ad8d"/>
        <path d="m59 60 7 9-6 22 10-7 2-13 7-10" fill="#382d2a"/>
        <path d="m47 104 46-2 2 10-47 7Z" fill="#5e402a"/><rect x="65" y="104" width="12" height="9" rx="1" fill="#c3a372"/>
        <path d="m85 110 13 0 3 26-15 4Z" fill="#705239"/><path d="m90 113 8 1" stroke="#bb9c65"/>
        <path d="m41 72 13 44" stroke="#b29865" stroke-width="4"/>
        <path d="M57 46v13l12 8 11-9-2-15" fill="url(#@skin@)"/>
        <path d="M50 22q14-14 32-5l9 18-5 19-16 8-17-11-7-17Z" fill="url(#@skin@)"/>
        <path d="m47 26 7 16 6-12 23-2 6 13 5-14-7-15-29 0Z" fill="#7b5a3b"/>
        <path d="m51 40 9 6 10 2 12-4 6-6-3 16-15 10-16-10Z" fill="#76543c"/>
        <path d="m62 49 8 2 8-3-7 9Z" fill="#c8a382" stroke="none"/>
        <path d="m54 34 11-2m11 0 9 2" fill="none" stroke="#543f31" stroke-width="2.4"/>
        <path d="m57 37 7 0m13 0 6 0" stroke="#d7e2da" stroke-width="2.5"/><path d="m61 37 .1 0m19 0 .1 0" stroke="#669da4" stroke-width="2"/>
        <path d="m71 35-2 10 5 0" fill="none" stroke="#a87958" stroke-width="1.2"/>
        <path d="M30 24 47 20 52 3q13-4 29 1l8 15 22 4q-7 12-31 9L48 32Z" fill="url(#@leather@)"/>
        <path d="m48 19 38 0 4 5-45 1Z" fill="#96886a"/><path d="m52 17 29 0" fill="none" stroke="#cfbd8c" stroke-width="1"/>
        <path d="m130 58 25-1 0 7-17 2-4 17-8-2 4-16-5-3Z" fill="#636c69"/><path d="m132 59h22" stroke="#e4e3d0"/><circle cx="134" cy="66" r="3.5" fill="#9ca39a"/>
        <g fill="#cbb28a" stroke="none"><circle cx="59" cy="85" r="1.3"/><circle cx="59" cy="98" r="1.3"/><circle cx="80" cy="87" r="1.3"/></g>
      </g>`,
    "rick-and-morty":`
      <g stroke="#243137" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
        <path d="m41 111 32 1 0 28-6 38-11 0 1-40-8 37-12-1Z" fill="#987250"/>
        <path d="m37 171 12 1 0 13-18 2-1-6Zm21 1 11 0 6 10-2 6H55Z" fill="#25343b"/>
        <path d="m32 65-9 25-7 25 8 5 14-30m32-24 16 18 10 10-7 7-17-15" fill="#e4efeb"/>
        <path d="m18 111-6 9 4 10 7-5 3-8m65-23 9 1 5 7-6 5-8-7" fill="#cec9ae"/>
        <path d="m32 63 20-5 21 8 4 71-21-1-5-40-5 39-23-4Z" fill="#f4f5ee"/>
        <path d="m44 66 15 1 7 48-25-1Z" fill="#9adee4"/><path d="m40 66-5 12 7 5-7 13m27-30 7 12-6 5 9 14" fill="none" stroke="#a6b8b5"/>
        <path d="m45 51-1 14 12 9 7-13-4-12" fill="#d7d2b9"/>
        <path d="m29 27-15-6 14-9 1-13 12 10 12-10 5 12 16-6-3 15 14 4-12 10 7 12-15-1-25 10-14-8 8-9Z" fill="#a9e2e8"/>
        <path d="M34 24q16-8 31 1l0 28-11 10-15-7-8-18Z" fill="#d7d2b9"/>
        <ellipse cx="41" cy="34" rx="8" ry="9" fill="#fff"/><ellipse cx="60" cy="34" rx="8" ry="9" fill="#fff"/>
        <path d="m34 28 12 0m8 0 13 0" stroke="#a9e2e8" stroke-width="4"/>
        <circle cx="43" cy="35" r="1.4" fill="#1e2b31" stroke="none"/><circle cx="61" cy="35" r="1.4" fill="#1e2b31" stroke="none"/>
        <path d="m50 34-3 10 6 1m-13 7q12-5 23 0" fill="none" stroke="#697774" stroke-width="1.4"/>
        <path d="m51 52 1 7 4 0 1-6" fill="#91b996" stroke="none"/>
        <path d="m101 130 30-1-1 29-2 22-12-1-1-25-5 26-12-2Z" fill="#3d5da2"/>
        <path d="m96 176 14 1-2 10-20 0 0-5Zm23 0 11 0 6 10-20 1Z" fill="#eeeeea"/>
        <path d="m101 83-12 12-3 29 8 3 9-26m27-17 15 17 6 17-8 5-10-17" fill="#ebc390"/>
        <path d="m100 82 24-2 12 16-2 38-39 0 1-33Z" fill="#f7df4b"/>
        <path d="m101 87-8 13 9 6m24-21 9 18 8-5" fill="#f7df4b"/>
        <path d="M91 54q1-24 24-25 25 1 26 26l-7 23-17 11-18-8Z" fill="#ebc390"/>
        <path d="M91 56q-8-22 10-32 20-10 35 7 8 12 3 27l-9-19q-14-7-30 2l-3 16Z" fill="#84512e"/>
        <ellipse cx="105" cy="58" rx="10" ry="12" fill="#fff"/><ellipse cx="127" cy="58" rx="10" ry="12" fill="#fff"/>
        <circle cx="107" cy="59" r="1.6" fill="#243137" stroke="none"/><circle cx="127" cy="59" r="1.6" fill="#243137" stroke="none"/>
        <path d="m116 60-2 7 5 1m-12 11q9-8 20-2" fill="none" stroke="#986b4b" stroke-width="1.4"/>
        <path d="m91 116-8 7 2 10 8 0 2-10m47-7 10 6 1 10-8 0-5-11" fill="#ebc390"/>
      </g>`,
    "iron-man":`
      <g stroke="#341f2b" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round">
        <path d="m54 110 34-2 14 27-7 31-17-1 3-27-10-10-9 36-16-1 2-27Z" fill="url(#@gold@)"/>
        <path d="m47 146 17 2-3 28-12 12H31l-1-8 13-9Zm35 2 17 1 2 27 16 9-1 6H83l-5-11Z" fill="url(#@metal@)"/>
        <path d="m48 153 12 1-4 20-9 3m37-22 10-1 2 22-9 0" fill="#e45045" stroke-width="1"/>
        <path d="m50 108 36-1 4 15-18 8-21-9Z" fill="#952334"/>
        <path d="m49 56-17 14-13 35 12 7 19-30 15-10" fill="url(#@gold@)"/>
        <path d="m27 87 11 7-9 26-14 9-6-9 8-17Z" fill="url(#@metal@)"/>
        <path d="m49 57 31-3 23 17-10 33-9 13-34-5-7-36Z" fill="url(#@metal@)"/>
        <path d="m49 67 18 7 7 0 18-7-3 16-17 9-17-7Z" fill="#e8584c" stroke-width="1.3"/>
        <path d="m53 87 8 10 25-1 4-11m-35 18 29 0m-28 7 24 0" fill="none" stroke="#562739" stroke-width="2.5"/>
        <path d="m62 77 16 0-8 14Z" fill="#e6ffff" stroke="#69e0f4" stroke-width="2.3"/>
        <path d="m92 60 18 8 16-9 10 10-21 18-20-7" fill="url(#@gold@)"/>
        <path d="m112 65 13-10 10 5 0 12-16 10-10-8Z" fill="url(#@metal@)"/>
        <path d="m129 52 10-5 11 5 7 10-6 13-14 1-10-11Z" fill="url(#@metal@)"/>
        <circle cx="145" cy="61" r="6.5" fill="#cdfbff" stroke="#64cde4" stroke-width="2"/><circle cx="145" cy="61" r="3.5" fill="#fff" stroke="none"/>
        <path d="m45 12 14-8 25 4 12 14-3 27-15 14-24-5-13-16Z" fill="url(#@metal@)"/>
        <path d="m49 17 10 11 17 1 9-11 5 10-5 18-9 5-1 7-15-1-1-8-11-7-4-14Z" fill="url(#@gold@)"/>
        <path d="m45 27 13 8 4 9-12-7m37-8-11 7-4 9 12-7" fill="#8d5a32" stroke="none"/>
        <path d="m49 31 15 5-2 5-12-5Zm34 1-15 4 2 5 12-5Z" fill="#d5ffff" stroke="#6adcf4" stroke-width="1"/>
        <path d="m61 48 13 0m-10 5 7 0" fill="none" stroke="#6f482c" stroke-width="2"/>
        <path d="m46 17 2 14m6-20 14-3m-18 55 9-4m39 9 10 5m16-8 6-5m-82 93 4-8m38 4 4 12" fill="none" stroke="#ffaba0" stroke-width="1.6"/>
        <path d="m17 112 9 3m26 68h-10m48 1 12 0" stroke="#7fedff" stroke-width="2" fill="none"/>
      </g>`
  };
  return {
    names,
    svg(id) {
      const drawing=art[id] || VELNAR.CollectionArt?.characters[id];
      if(!drawing)return '';
      const prefix=`vn-character-${++serial}`;
      const colors={red:['#ff5a59','#c61839'],blue:['#278ed0','#113f83'],skin:['#e5c49e','#b98c6c'],hair:['#9b6544','#50332d'],denim:['#779394','#364d60'],leather:['#6e5340','#302820'],gold:['#ffe19b','#b87837'],metal:['#ed5a4e','#8c1936']};
      const defs=Object.entries(colors).map(([key,[a,b]])=>`<linearGradient id="${prefix}-${key}" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join('');
      return `<svg class="vn-character vn-character--${id}" viewBox="0 0 160 192" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>${drawing.replace(/@([a-z]+)@/g,(_,key)=>`${prefix}-${key}`)}</svg>`;
    }
  };
})();

globalThis.VELNAR = globalThis.VELNAR || {};

// Local vector artwork, shared by the cards, dashboard and contribution stories.
// Character coordinates match CharacterArt's 160 x 192 canvas and gradient palette.
VELNAR.CollectionArt = (() => {
  const ink = body => `<g stroke="#17202c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
  const characters = {
    'batman': ink(`
      <path d="M57 51Q26 64 6 164l26-15 10 26 20-13 19 19 19-19 23 13 9-24 24 10Q141 75 105 51Z" fill="#0d1524"/>
      <path d="M58 62Q38 111 31 151m69-91q24 36 33 88M59 66 48 153m47-88 19 91" stroke="#303d52" fill="none"/>
      <path d="m57 107 45 0-3 31-8 37-17 0 1-41-8 0-5 41-17-1 3-41Z" fill="#536176"/>
      <path d="m47 153 18 2-2 29-13 5H35v-9l11-10Zm30 1h18l5 18 12 9-2 8H78l-3-12Z" fill="#151f31"/>
      <path d="m58 52-19 12-14 47 12 6 17-32 10-7m33-25 21 13 14 31 14-3 8 13-28 8-18-28" fill="#536176"/>
      <path d="m25 104 13 7-3 22-10 3-7-8Zm102-12 15-2 10 14-12 9-17-8Z" fill="#172236"/>
      <path d="m21 110-8-11 2 17-8-7 4 16m115-29 0-13 6 13 3-13 5 12" fill="#172236"/>
      <path d="m57 51 42 0 10 27-9 38-46 0-7-36Z" fill="#606e80"/>
      <path d="m54 92 22 5 25-6m-44 11 18 4 20-4m-20-18v18" fill="none" stroke="#3a465b"/>
      <ellipse cx="79" cy="76" rx="23" ry="12" fill="#e7bc51"/>
      <path d="m58 72 7 2 4-5 6 7 2-7 3 0 2 7 7-7 4 5 7-2-5 9-8-1-8 7-7-7-9 1Z" fill="#142031" stroke="none"/>
      <path d="M55 113h46v9H54Z" fill="#b78c39"/><g fill="#ebc36a" stroke-width="1"><path d="M57 113h8v9h-8zm14 0h13v10H71zm20 0h8v9h-8Z"/></g>
      <path d="M57 8 69 20h20l14-14-1 41-13 15-20-2-15-16Z" fill="#19263b"/>
      <path d="m60 29 15 6-3 5-12-4m37-7-15 6 3 5 11-4" fill="#effaff" stroke="none"/>
      <path d="m66 43 13-3 13 3-4 12-10 4-11-6Z" fill="url(#@skin@)"/>
      <path d="m73 50 12 0m-7-23 1 14" fill="none" stroke="#887369" stroke-width="1.3"/>
    `),
    'star-wars': ink(`
      <path d="M56 51Q33 61 23 100L8 180l37-9 17 14 21-7 24 7 39-9-17-87-25-37Z" fill="#10131c"/>
      <path d="m50 70-18 98m73-99 22 96m-9-30 8 36M48 170l8-37" stroke="#343846" fill="none"/>
      <path d="m55 112 46 0-4 32-3 35-17 0-2-37-7 0-5 37-17 0 3-38Z" fill="#292d3b"/>
      <path d="m47 158 17 1-2 22-7 8H35v-8l11-8Zm29 0h18l4 19 13 6-2 7H77l-3-11Z" fill="#111723"/>
      <path d="m53 56-17 10-12 39 11 5 18-29m50-24 15 10 6 27 15 7-5 13-25-15-10-20" fill="#272c38"/>
      <path d="m24 102 13 4-4 23-12 0-5-10m112-16 10 0 5 11-6 10-12-8Z" fill="#111723"/>
      <path d="m55 51 45 0 7 24-6 47H53l-5-45Z" fill="#222631"/>
      <path d="m52 54 9-6 29 0 13 8 5 13-15-5-32 0-14 8Z" fill="#717984"/>
      <path d="m61 53 3 11m25-13-1 13M57 77v31m8-38v8m25-8v8m8 0v31" fill="none" stroke="#9fa8b3" stroke-width="2.6"/>
      <rect x="66" y="77" width="25" height="29" rx="2" fill="#0d1420" stroke="#6e7785"/>
      <path d="M71 82h4v5h-4Zm10 0h5v5h-5Z" fill="#f09591" stroke="none"/><path d="M71 92h14m-14 5h14" stroke="#b4d4de" stroke-width="3"/>
      <path d="M52 113h50v10H52Z" fill="#0e1620"/><path d="M60 115h9v5h-9m17-5h9v5h-9" fill="#8de8b5" stroke="none"/>
      <path d="M47 48 54 19Q64 1 80 3q24 0 30 31l6 20-25 3-28 0Z" fill="#151b27"/>
      <path d="M58 23Q75 7 94 21l5 22-11 17H70L56 43Z" fill="#343b4a"/>
      <path d="m59 29 17 4-7 9-12-6m24-3 18-5 1 10-14 4" fill="#060c16" stroke="#748191"/>
      <path d="m77 30 2-17 3 17-3 9m-1 0-15 17h32L81 39Z" fill="#111a26" stroke="#82909c"/>
      <path d="m74 46-3 7m7-8v8m5-7 3 7" stroke="#a9b4c4"/>
      <circle cx="64" cy="49" r="3" fill="#87939f"/><circle cx="96" cy="49" r="3" fill="#87939f"/>
      <path d="m138 109 0-69" stroke="#ff475f" stroke-width="7"/><path d="m138 109 0-69" stroke="#fff0f1" stroke-width="2.8"/><path d="M135 110h6v17h-6Z" fill="#8c98ac"/>
    `),
    'harry-potter': ink(`
      <path d="m53 54-18 13-11 86 27-7 9 12h39l15-16 20 10-16-80-18-19Z" fill="#20202d"/>
      <path d="m49 70-14 75 21-17m48-60 19 73-22-9" fill="#742638"/>
      <path d="m59 126 37 0-2 37-13 0-3-27-6 0-2 27-15 0Z" fill="#454858"/>
      <path d="m55 156 17 1-1 26-15 6H44v-8l11-7Zm25 0h16l1 21 15 6-1 6H81Z" fill="#151d29"/>
      <path d="m55 54 42 1 4 72-46 2Z" fill="#6f7586"/>
      <path d="m62 54 15 15 13-14-4 21-9-7-10 9Z" fill="#f3eee6"/>
      <path d="m73 65 9 0-2 10 6 35-9 9-7-10 5-34Z" fill="#ae3444"/>
      <path d="m74 83 7 4m-9 8 11 4m-11 5 12 4" stroke="#e2b55d" stroke-width="4"/>
      <path d="m57 55 5 77-13 20 3-46m44-50-6 76 14 18-2-48" fill="#242c3c"/>
      <path d="m45 69-9 34-14 11 8 11 22-15 10-29m43-14 15 18 20-12 7 10-28 21-16-13" fill="#293142"/>
      <path d="m22 111-8 6 1 13 11-1 5-6m105-50 8-5 9 6-4 10-9 2Z" fill="url(#@skin@)"/>
      <path d="m143 76 12-35" stroke="#b79569" stroke-width="3"/>
      <path d="M52 27q0-24 27-23 27 0 29 24l-5 21-22 14-22-10Z" fill="url(#@skin@)"/>
      <path d="M50 35Q40 8 65 5q28-15 42 9l1 23-9-13-13-9-10 13-2-10-10 10-3-7-4 15Z" fill="#292634"/>
      <circle cx="67" cy="36" r="11" fill="none" stroke="#263247" stroke-width="2.8"/><circle cx="93" cy="36" r="11" fill="none" stroke="#263247" stroke-width="2.8"/>
      <path d="M78 36h4m-26-2-6-2m54 2 4-2" stroke="#263247"/>
      <circle cx="68" cy="36" r="2" fill="#436c60" stroke="none"/><circle cx="93" cy="36" r="2" fill="#436c60" stroke="none"/>
      <path d="m81 37-2 7 4 1m-10 7 14-1m3-34-4 5 6 0-5 7" fill="none" stroke="#9f6b5d" stroke-width="1.4"/>
    `),
    'deadpool': ink(`
      <path d="m36 14 86 130m5-130L41 143" stroke="#101825" stroke-width="9"/>
      <path d="m36 14 9 14m82-14-9 14" stroke="#afb4c0" stroke-width="3"/><path d="m37 29 11-7m67 0 12 8" stroke="#9d3448" stroke-width="5"/>
      <path d="m53 106 48 0-3 30-5 32-17 0-1-32-7 0-4 32-18 0 2-32Z" fill="url(#@red@)"/>
      <path d="m48 142 18 3-4 29-11 14H33v-10l12-11Zm29 2 17-2 5 29 14 10-2 7H80l-5-14Z" fill="#1c2533"/>
      <path d="m55 54-18 13-13 36 14 7 17-25m46-29 21 12 19 29-10 10-27-26" fill="url(#@red@)"/>
      <path d="m23 100 17 6-7 24-11 4-9-11Zm107-9 14 0 9 17-6 12-14-7-9-13" fill="#252837"/>
      <path d="m54 53 47 0 7 25-8 37H52l-6-35Z" fill="url(#@red@)"/>
      <path d="m54 54 8 9-7 30 3 17-7-1-5-32m54-23-9 10 9 29-5 18 7-3 6-31" fill="#252638"/>
      <path d="m62 74 14 5 17-5m-32 17 14 5 17-6M63 101h28" fill="none" stroke="#9b233d"/>
      <path d="m59 50 42 55" stroke="#352a32" stroke-width="8"/><path d="m61 54 39 51" stroke="#c0a17d" stroke-width="1"/>
      <path d="M50 111h51v12H49Z" fill="#392d34"/><circle cx="78" cy="117" r="9" fill="#e33953"/><path d="M77 109v16m-6-11 3 5m11-5-3 5" stroke="#242333"/>
      <path d="M52 114h9v13h-9Zm42 0h10v13H94Z" fill="#9e7560"/>
      <path d="M54 21Q59 4 79 4q25 0 29 22l-5 21-21 17-22-12Z" fill="url(#@red@)"/>
      <path d="m56 25 8-9 13 14-3 17-9 5-8-15m44-13-10-7-10 14 2 17 10 5 8-16" fill="#202735"/>
      <path d="m61 31 12 4-2 6-9-3m36-7-11 4 2 6 8-4" fill="#f5fafc" stroke="none"/>
      <path d="m80 12 0 19m-1 15 0 10m-15-5 10 6m19-7-9 7" fill="none" stroke="#a22844" stroke-width="1.2"/>
    `),
    'stranger-things': ink(`
      <path d="m59 116 37 0 4 29-17 2-5-23-4 23-18-1Z" fill="#d3a5a2"/>
      <path d="m56 144 18 0-6 32-12-1m26-30 18-1-5 32-12-1" fill="url(#@skin@)"/>
      <path d="m56 161 15 1-4 18-13-1m30-17 14 0-3 18-13-1" fill="#f1e8ce"/>
      <path d="m55 167 13 2m16-1 11 1" stroke="#759aaf" stroke-width="3"/>
      <path d="m54 176 14 0-2 11-19 3-8-5 4-7Zm28 0h13l6 6 12 1-1 7H81Z" fill="#f3eee3"/>
      <path d="m57 53 39 0 9 46 1 32-58 0 5-35Z" fill="#dfaeae"/>
      <path d="m67 54 10 9 10-10-3 16-8-5-9 5Z" fill="#f2d8ce"/>
      <path d="m60 52-16 9-5 30-18 17 10 12 24-18 6-24-6 47 18-2-4-49Zm36 0 15 13 12 24 18-7 6 12-29 12-15-20 9 37-23-1 0-54Z" fill="#617795"/>
      <path d="m45 66 8 4-6 19m53-21 9 5 9 20m-24-38 2 51M63 58l-5 52" fill="none" stroke="#9bacbf"/>
      <path d="m22 106-9 8 1 13 7 4 10-13m108-36 3-10 3-7 3 1-1 9 5-4 3 2-5 11 5 3-2 7-13 0Z" fill="url(#@skin@)"/>
      <path d="M54 27Q55 6 78 6q24 0 28 22l-6 23-19 13-21-13Z" fill="url(#@skin@)"/>
      <path d="M54 32Q45 10 67 3q26-6 39 15l1 17-8-9-4-9-23-3-11 9-3 13Z" fill="#705347"/>
      <path d="m61 27 11-1m15 1 11 2m-34 7 7 0m19 0 6 0" fill="none" stroke="#574039"/>
      <circle cx="68" cy="36" r="2" fill="#4a3b32" stroke="none"/><circle cx="92" cy="36" r="2" fill="#4a3b32" stroke="none"/>
      <path d="m80 37-2 7 5 1m-11 7 16-1" fill="none" stroke="#9c695d" stroke-width="1.3"/>
    `),
    'wednesday': ink(`
      <path d="m56 130 42 0-5 39-13 0-1-28-6 0-6 28H55Z" fill="#333241"/>
      <path d="m56 163 15 0-4 15-1 10H42v-8l11-5Zm25 0h15l-1 14 14 5-1 7H80Z" fill="#131b29"/>
      <path d="m43 184 20 0m20 0 22 1" stroke="#85879b"/>
      <path d="m58 54 41 0 5 40 14 49-75 0 11-48Z" fill="#242332"/>
      <path d="m64 62 4 24-12 48m35-72-6 24 16 49M78 77v63" fill="none" stroke="#494358"/>
      <path d="m62 53 16 10 13-11 4 17-14-6-7 8Z" fill="#f4eee5"/>
      <path d="m59 57-15 6-14 29-14-12-8 9 22 22 13-11 12-20m44-25 14 6 9 31 23-3 3 13-36 3-15-31" fill="#292736"/>
      <path d="m17 81-8-11-6 2 3 15 7 7m133-6 8-9 5 3-2 17-10 3" fill="#e2c5ba"/>
      <path d="m17 80-9 8m133 1 3 13" stroke="#f3ece6" stroke-width="5"/>
      <path d="M54 22Q59 3 79 3q26 0 29 25l-7 25-19 12-23-12Z" fill="#ead0c3"/>
      <path d="M51 37Q44 6 75 2q35-5 35 33l-7 10-5-25-9-3-2 11-11-11-6 12-5-10-7 6-2 22Z" fill="#171b29"/>
      <path d="m56 36-7 18 1 23 8 16 5-2-4-17 3-14-3-20m45-8 9 17-1 26-7 15-5-2 5-21-4-12 1-18" fill="#202431"/>
      <path d="m49 53 12 7-11 5 10 9-9 6m53-27 10 7-10 6 7 8-9 6" fill="none" stroke="#505163"/>
      <path d="m55 85 8 1m37 0 8 1" stroke="#9780ae" stroke-width="3"/>
      <path d="m63 34 9-1m15 0 11 1" stroke="#282333"/><ellipse cx="68" cy="39" rx="5" ry="3" fill="#f4e8df" stroke="#85717a"/><ellipse cx="92" cy="39" rx="5" ry="3" fill="#f4e8df" stroke="#85717a"/>
      <circle cx="69" cy="39" r="2.3" fill="#352b38" stroke="none"/><circle cx="92" cy="39" r="2.3" fill="#352b38" stroke="none"/>
      <path d="m80 39-2 8 4 0m-8 7 12 0" fill="none" stroke="#a17776" stroke-width="1.4"/>
      <g fill="#d3cfdb" stroke="none"><circle cx="79" cy="83" r="1.7"/><circle cx="79" cy="96" r="1.7"/><circle cx="79" cy="109" r="1.7"/></g>
    `),
    'squid-game': ink(`
      <path d="m51 108 52 0-3 33-5 35-18 0-1-39-8 0-3 39H46l2-38Z" fill="#d74777"/>
      <path d="m47 153 18 1-3 24-8 11H34v-10l11-6Zm30 1h18l2 23 13 5-1 8H79l-4-13Z" fill="#142634"/>
      <path d="m57 53-19 13-16 45 13 7 19-34m46-29 19 13 18 41-12 9-21-33" fill="#ed5288"/>
      <path d="m22 106 15 6-5 21-10 3-9-12m111-17 14-3 8 20-6 12-11-5Z" fill="#132732"/>
      <path d="m54 53 47 0 8 28-8 37H51l-4-38Z" fill="#f36093"/>
      <path d="M76 58v54m-21-16h14v15H55m30-15h14v15H85m-31-25 11 3m23-3 12-3" fill="none" stroke="#ad2e63"/>
      <path d="M49 112h54v9H49Z" fill="#19303a"/><path d="M71 112h12v10H71Z" fill="#4c5b66"/>
      <path d="m57 60 42 48" stroke="#24313c" stroke-width="6"/>
      <path d="M49 31Q51 4 78 3q30-1 34 29l-5 25-29 12-29-13Z" fill="#e94a83"/>
      <path d="M57 25Q64 12 80 12q18 0 24 15l-3 22-22 14-21-15Z" fill="#192936" stroke="#9c2e5b" stroke-width="3"/>
      <path d="M65 27h27v23H65Z" fill="none" stroke="#f0f6ed" stroke-width="3.5"/>
      <path d="m59 34 0 8m40-8 0 8m-32 15 8 4m11-4-6 4" stroke="#435560" stroke-width="1"/>
    `),
    'god-of-war': ink(`
      <path d="m51 112 46 0 1 31-15 17-9-21-9 25-20-19Z" fill="#765442"/>
      <path d="m48 144 20 7-6 29-13 8H31v-8l11-12Zm32 6 16-7 3 28 12 10-1 7H78l-3-14Z" fill="#57473d"/>
      <path d="m46 158 17 5m-19 3 17 5m20-12 15-3m-15 12 16-3" stroke="#b1a28a" stroke-width="3"/>
      <path d="m56 51-20 9-12 34 12 7 17-22m48-26 18 13 13 23 17-4 7 12-27 12-22-26" fill="#d5c7b0"/>
      <path d="m30 91 10 10-8 30-13 1-6-12 8-15m119-20 13-7 7 9-7 15-11-2Z" fill="#c1ac92"/>
      <path d="m55 52 44 0 10 28-12 36H49l-3-40Z" fill="#d7c9b3"/>
      <path d="m62 54-8 38 9 20 11-2-12-19 11-32Z" fill="#b84046" stroke="none"/>
      <path d="m72 80 7 9 22-11m-33 17 10 6 19-7m-22 12 17 1" fill="none" stroke="#aa9a83"/>
      <path d="m49 48 18 6-17 40-16-6 5-25Z" fill="#664c3b"/><path d="m43 55 13 4-10 25-9-3Z" fill="#9d8160"/>
      <path d="m62 57 34 52" stroke="#6c4636" stroke-width="9"/><path d="m63 56 35 53" stroke="#b7a27e" stroke-width="1"/>
      <path d="M47 110h52v15H47Z" fill="#54473b"/><path d="m51 122-8 30 17-3 9-25m17 0 7 29 13-3-5-28" fill="#66513e"/>
      <path d="m70 113 13 0 3 11-9 7-11-8Z" fill="#bdab86"/>
      <path d="M55 23Q58 3 79 3q24 0 28 22l-5 20-23 15-21-14Z" fill="#dbceba"/>
      <path d="m71 5-9 18 6 16 8-3-7-14 9-18Z" fill="#b44145" stroke="none"/>
      <path d="m57 38 13 7 9-4 11 4 14-8-4 20-13 15-15-4-13-14Z" fill="#5b4338"/>
      <path d="m64 47 9 5 8-3 8 3 9-5m-32 10 6 4m18-5-6 6" stroke="#8c7057" fill="none"/>
      <path d="m61 29 12 1m15 0 11-2" stroke="#705344" stroke-width="3"/>
      <path d="m65 34 6 0m19-1 5 0m-17-1-1 9 6 0" stroke="#7d6b59" fill="none" stroke-width="1.5"/>
      <g class="held-axe"><path d="m135 64 8 72" stroke="#8f6547" stroke-width="6"/><path d="m125 42 25-11 7 27-28 7 2-12Z" fill="#b4cbd1" stroke="#566f7b"/><path d="m150 35 2 20-11 4m-7-12 9-4" stroke="#80edff" fill="none"/></g>
    `),
    'assassins-creed': ink(`
      <path d="m93 48 24 20 23 96-28-10-22-38Z" fill="#a63349"/>
      <path d="m50 115 47-1 1 33-16 23-11-29-8 29-20-23Z" fill="#52505a"/>
      <path d="m44 150 20 6-4 23-9 10H30v-10l12-10Zm33 5 20-7 1 28 13 8-2 6H77l-3-13Z" fill="#56453b"/>
      <path d="m43 161 17 5m-17 3 15 4m22-10 15-4m-15 12 17-4" stroke="#b6a183" stroke-width="2.6"/>
      <path d="m56 54-18 12-15 34 14 7 18-23m43-29 18 11 17 30-11 12-24-29" fill="#e3ddcd"/>
      <path d="m23 96 16 7-7 23-13-4Zm99-4 13-5 14 22-14 10-12-17" fill="#75594a"/>
      <path d="m21 119-7 8 1 9 12 1 7-12m100-9 8-1 11 10-4 9-10-1-10-12Z" fill="url(#@skin@)"/>
      <path d="m17 123-7 24 12-18m115-15 19 19-9-26" fill="#c9d5d9" stroke="#697987"/>
      <path d="m57 54 38 0 9 26-8 34 14 36-26-7-10 14-15-15-22 6 12-37-3-32Z" fill="#e6dfce"/>
      <path d="m58 58 17 23 20-26-10 34-3 29H65l1-30Z" fill="#827362"/>
      <path d="m53 88 44-10" stroke="#664d40" stroke-width="7"/><path d="M47 110h52v14H47Z" fill="#b33a4b"/>
      <path d="m69 115 11 0 8 12-14 6-12-5Z" fill="#cfc3a5"/><path d="m75 118-6 10 7-3 6 2Z" fill="#635b54" stroke="none"/>
      <path d="m67 133-5 11m22-11 7 8m-14-10-2 15" fill="none" stroke="#a09480"/>
      <path d="M45 44 54 19 77 2l23 13 14 29-20 20-34-1Z" fill="#eee8d8"/>
      <path d="M55 35 78 18l24 18-8 21-17 9-19-12Z" fill="#5b5250"/>
      <path d="m61 39 18-5 17 5-4 12-14 10-14-8Z" fill="url(#@skin@)"/>
      <path d="m59 35 18-17 25 18-16-7-8 13-6-10Z" fill="#e4decd"/>
      <path d="m66 49 10 5 15-5-7 10-9 4-9-7" fill="#645044" stroke="none"/><path d="m72 48 11 0" stroke="#997c68"/>
      <path d="m48 44 10 10-2 10m48-20-10 14 1 5" fill="none" stroke="#b7ac98"/>
    `),
    'minecraft': `
      <g stroke="#22322b" stroke-width="2" stroke-linejoin="miter" shape-rendering="crispEdges">
        <path d="M44 107h31v72H43Zm33 0h32v73H78Z" fill="#5854a6"/><path d="M65 109h10v66H65Zm33 0h11v66H98Z" fill="#424783" stroke="none"/>
        <path d="M42 173h33v15H33v-10h9Zm35 0h32v6h13v10H77Z" fill="#46515e"/>
        <path d="M42 55h69v62H42Z" fill="#38b8ba"/><path d="M95 56h16v61H95Z" fill="#208c98" stroke="none"/>
        <path d="M42 61H24v40h20Zm67 1h16v25h17v17h-30Z" fill="#bd9274"/><path d="M25 60h17v18H25Zm84 0h17v19h-17Z" fill="#32a4ad"/>
        <path d="M24 94h20v24H23Zm103-9h21v20h-21Z" fill="#c99c79"/><path d="M30 99h7v12h-7m99-20h9v9h-9" fill="#b07a5f" stroke="none"/>
        <path d="M48 7h53v48H48Z" fill="#c39877"/><path d="M89 7h12v48H89Z" fill="#ac7f62" stroke="none"/>
        <path d="M48 7h53v16H90v-5H61v11H48Z" fill="#503d33"/><path d="M51 29h17v8H51Zm28 0h17v8H79Z" fill="#eee7dc" stroke="none"/>
        <path d="M59 29h8v8h-8Zm20 0h8v8h-8Z" fill="#6760b4" stroke="none"/>
        <path d="M69 35h11v8H69Z" fill="#9c654c" stroke="none"/><path d="M59 41h9v7h13v-7h9v14H59Z" fill="#654536" stroke="none"/>
        <path d="M60 57h27v8H77v7H67v-7h-7Z" fill="#b78868" stroke="none"/>
        <path d="M55 79h12v11H55Zm20 15h12v13H75Z" fill="#2ba4ab" stroke="none"/>
        <g class="held-pickaxe"><path d="m126 89 24-34-5-4-24 34Z" fill="#a27747"/>
        <path d="m120 43 7-8 25 18 5 12-10 10-6-9 4-6Z" fill="#53d5cc" stroke="#25686b" stroke-width="3"/>
        <path d="m128 40 20 15" stroke="#baf3e4"/></g>
      </g>`
  };

  const bat = '<path d="M16 23 5 10l2 15-6 9 16-3 10 12 5-13 5 13 10-12 16 3-6-9 2-15-11 13-9 0-4-8-3 6-3-6-4 8Z" fill="currentColor"/>';
  const axe = '<path d="m26 8 6 49" stroke="#986c48" stroke-width="5"/><path d="m20 7 25-4 8 19-30 7 1-12Z" fill="#c4e2e6" stroke="#77b8ca" stroke-width="2"/><path d="m43 7 5 12-17 5" fill="none" stroke="#79e9fc" stroke-width="2"/>';
  const star = '<path d="m30 4 6 18 20 8-20 6-6 20-7-20-19-6 19-8Z" fill="currentColor"/>';
  const hand = '<path d="m14 47-5-12 2-13 6 0 1 13 4-26 5-1 0 23 4-29 5 1 0 28 5-23 5 1-2 26 5-15 5 2-3 24-12 11-14-1Z" fill="#dcc4b5" stroke="#8d7776" stroke-width="2"/><path d="m20 37 18 4m-12-21 9 2m-16 25 13-2" stroke="#a79798" stroke-width="1.5"/>';
  const block = '<path d="m9 13 22-10 23 10v32L31 57 9 45Z" fill="#916343" stroke="#322f28" stroke-width="2"/><path d="m9 13 22 11 23-11L31 3Z" fill="#99c760"/><path d="m9 13 0 13 7 3v-7l8 5v7l7 2V24Zm22 11v12l7-3v-7l8-4v7l8-3V13Z" fill="#62a050"/><path d="M31 36v21l23-12V26Z" fill="#674b37"/><path d="m16 35 6 3v6l-6-3m24-4 7-3v6l-7 3" fill="#ab835e"/>';
  const seal = '<path d="m30 3-24 49 17-8 7 12 7-12 17 8Zm0 13 9 23-9-5-9 5Z" fill="currentColor" fill-rule="evenodd"/>';
  const symbols = {
    'batman':bat,
    'star-wars':'<circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 50 47 8" stroke="#ffb9c4" stroke-width="4"/><path d="m8 54 10-12" stroke="#97a8c4" stroke-width="6"/>',
    'harry-potter':star,
    'deadpool':'<circle cx="30" cy="30" r="25" fill="#be2d4d" stroke="#f98196" stroke-width="3"/><path d="M29 7v46M10 16l13 8-4 18-10-8m41-18-13 8 4 18 10-8" fill="#1a2031" stroke="#1a2031" stroke-width="3"/><path d="m12 25 10 4-2 6-8-5m36-5-10 4 2 6 8-5" fill="#f1f4f6"/>',
    'stranger-things':'<path d="m32 2-14 17 10 8-15 13 11 17 7-18 13-9-12-11 10-11Z" fill="#702542" stroke="#ed6776" stroke-width="2"/>',
    'wednesday':hand,
    'squid-game':'<g fill="none" stroke="currentColor" stroke-width="3"><circle cx="15" cy="19" r="10"/><path d="m42 8 12 21H30Z"/><path d="M19 35h23v21H19Z"/></g>',
    'god-of-war':axe,
    'assassins-creed':seal,
    'minecraft':block
  };
  const motif = id => `<g transform="translate(30 30) scale(4)" color="currentColor">${symbols[id]}</g>`;
  const backgrounds = {
    'batman':`<circle cx="475" cy="90" r="57" fill="#e9ca77" opacity=".55"/><g transform="translate(418 48) scale(1.8)" color="#263549">${bat}</g><path d="M0 291h25V179h38v112h31V133h45v158h30V203h35v88h253V218h29v73h32V132h41v159h29V180h38v111h24v69H0Z" fill="#25364f"/><path d="M0 321h69V220h36v101h48V261h36v60h289V244h36v77h53V239h31v82h42v39H0Z" fill="#101a2b"/>`,
    'star-wars':'<g fill="#c9d9f3"><circle cx="64" cy="54" r="2"/><circle cx="153" cy="101" r="1.6"/><circle cx="469" cy="39" r="2"/><circle cx="563" cy="194" r="2"/><circle cx="505" cy="285" r="1.4"/></g><circle cx="470" cy="123" r="87" fill="#393747"/><path d="M384 123h172M399 169h143M405 78h130" stroke="#6b6477" fill="none"/><circle cx="447" cy="103" r="23" fill="#1b192c" stroke="#777383" stroke-width="3"/><path d="m0 285 143-61 81 43-66 93H0m640-87-133-45-73 46 74 86h132" fill="#231b30"/><path d="m23 306 115-48m482 47-105-44" stroke="#f26c84" stroke-width="3"/>',
    'harry-potter':'<circle cx="474" cy="76" r="43" fill="#e5d4a7" opacity=".65"/><path d="M0 297h46V172l20-39 20 39v74h29V114l21-44 20 44v119h23v-41l22-38 22 38v96h222V181l25-43 25 43v48h31V108l18-39 20 39v160h35V189l20-40 19 40v108h32v63H0Z" fill="#41334c"/><g fill="#e6be77" opacity=".7"><path d="M60 190h8v16h-8m65-70h8v16h-8m68 71h8v16h-8m270-9h8v16h-8m65-70h8v16h-8m58 78h8v16h-8"/></g><path d="M0 329q160-52 304 0t336-5v36H0Z" fill="#211b31"/>',
    'deadpool':'<g fill="none" stroke="#842d49" stroke-width="3"><path d="M35 20 244 340M119 15 314 336M526 20 314 336M604 47 419 340"/></g><path d="m28 73 121 21-70 26 80 30-116 18m521 9-96 25 74 16-112 45 126 4" fill="none" stroke="#bd3f5f" stroke-width="5"/><circle cx="504" cy="101" r="49" fill="#562136"/><path d="m32 294 116-30 84 37 230-17 98 24 80-10v62H0Z" fill="#321727"/>',
    'stranger-things':'<path d="M0 18h96v48h32v46h36v97h-32V152H99V92H64V38H0m640-20h-84v77h-27v99h34v-63h27V42h50" fill="#2f203b"/><path d="m469 0-22 52 26 25-42 56 39 37-25 53 30 43-25 94" fill="none" stroke="#b74667" stroke-width="5"/><path d="m463 0-22 52 26 25-42 56 39 37-25 53 30 43-25 94" fill="none" stroke="#ffbba5" stroke-width="1"/><g stroke="#45426c" stroke-width="4"><path d="M0 303q122-76 188 0M0 331q93-124 128-7M640 305q-116-69-173 16" fill="none"/></g>',
    'wednesday':'<path d="M395 330V159Q395 30 496 19q102 20 102 140v171Z" fill="#393149" stroke="#7e6c96" stroke-width="5"/><path d="M496 24v307M398 159h197M399 236h195m-183-123 177 0m-175-10 80 53 83-53m-80 54-64 79m64-79 65 79" fill="none" stroke="#92819d" stroke-width="3"/><circle cx="496" cy="106" r="55" fill="none" stroke="#a995b9" stroke-width="3"/><path d="M0 341q153-42 238 0t402 0v19H0Z" fill="#171523"/><g fill="#b5a4c6" opacity=".5"><circle cx="103" cy="72" r="2"/><circle cx="168" cy="164" r="3"/><circle cx="89" cy="226" r="2"/></g>',
    'squid-game':'<path d="M0 92h120v51H73v53h86v55H90v58H0m640-253H523v62h49v47H477v59h82v65h81" fill="none" stroke="#497e7b" stroke-width="20"/><path d="M0 71h121m-48 52v54h86m365-140v62h48m-95 47h83v77" fill="none" stroke="#de7198" stroke-width="7"/><g fill="none" stroke="#fd9abd" stroke-width="4"><circle cx="464" cy="68" r="24"/><path d="m506 245 32 53h-64Zm-419 23h41v41H87Z"/></g>',
    'god-of-war':'<path d="M0 274 96 122l64 85 73-120 110 175 94-64 89-120 114 196v86H0Z" fill="#3a505d"/><path d="m49 197 47-75 34 46-28-15-17 30-11-4Zm130-48 54-62 40 64-26-14-14-24-21 35Zm304-31 43-40 39 60-34-20-17 12Z" fill="#95b4bd"/><path d="M0 314q153-72 302 0t338-10v56H0Z" fill="#1b303d"/><g fill="none" stroke="#86c5d1" stroke-width="3" opacity=".55"><circle cx="481" cy="145" r="71"/><path d="M481 88v104m-26-86 50 24-50 25 48 28M431 145h98"/></g>',
    'assassins-creed':'<path d="M0 291h41V175h29v116h18V120l28-49 29 49v171h25V189h48v102h215V162h40v129h33V97l23-29 23 29v194h31V181h35v110h22v69H0Z" fill="#51454a"/><path d="M89 121h56m359-18h50M19 268h163m278-48h144" stroke="#9b8975" stroke-width="4"/><g fill="#c2ac87" opacity=".7"><path d="M106 144h12v28h-12m1 25h12v24h-12m409-66h12v22h-12m0 24h12v22h-12"/></g><path d="M0 334 179 292l152 19 201-23 108 35v37H0Z" fill="#29252e"/>',
    'minecraft':'<g shape-rendering="crispEdges"><path d="M0 276h64v-35h58v40h75v-51h62v45h167v-27h73v-35h76v60h65v87H0Z" fill="#507b46"/><path d="M0 297h64v-35h58v40h75v-51h62v45h167v-27h73v-35h76v60h65v66H0Z" fill="#604a38"/><path d="M54 151h20v112H54m483-145h20v118h-20" fill="#6b543f"/><path d="M20 108h88v66H20m486-59h111v90H486" fill="#345c3c"/><path d="M42 85h53v53H42m466-32h98v57h-98" fill="#477b47"/><path d="M161 53h63v17h29v18h-119V70h27m291-40h78v18h27v17H425V48h27" fill="#b7cebc" opacity=".55"/></g>'
  };
  const descriptions = {
    'batman':'Batman glides over the grid and sends a spinning batarang toward the Bat-Signal.',
    'star-wars':'Darth Vader advances with his red lightsaber and sends a Force ripple across the squares.',
    'harry-potter':'Harry casts a golden spell from his wand; enchanted sparks light up a contribution square.',
    'deadpool':'Deadpool flips through the grid and leaves two crossed katana slashes behind.',
    'stranger-things':'Eleven raises her hand, lifts squares with telekinesis and opens an Upside Down rift.',
    'wednesday':'Wednesday dances across the grid while Thing walks between the squares.',
    'squid-game':'A masked guard watches the grid as the signal alternates between green light and red light.',
    'god-of-war':'Kratos throws the Leviathan Axe; it spins into a frosty impact and returns to his hand.',
    'assassins-creed':'Ezio takes a leap of faith while an eagle sweeps above the contribution squares.',
    'minecraft':'Steve swings his diamond pickaxe, cracks a grass block and sends pixel chips flying.'
  };
  return {characters, backgrounds, symbols, descriptions, bat, axe, star, hand, block, seal,
    motif(id) { return symbols[id] ? motif(id) : ''; },
    skin(theme) {
      if (!characters[theme.id]) return null;
      const c=theme.colors;
      return {canvas:`radial-gradient(ellipse at 88% 5%,${c.accentSecondary}17,transparent 50%),linear-gradient(145deg,${c.background},${c.backgroundSecondary}55)`,header:`linear-gradient(100deg,${c.backgroundSecondary},${c.background})`,edge:c.accentSecondary};
    }
  };
})();

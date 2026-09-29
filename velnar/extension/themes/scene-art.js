globalThis.VELNAR = globalThis.VELNAR || {};

// Original, code-native artwork. The same vector scenes power cards and previews.
VELNAR.SceneArt = (() => {
  let serial = 0;
  const web = '<path d="M0 0 300 300M0 0 300 95M0 0 95 300M0 0 300 0M0 0 0 300M28 0Q23 24 0 28M74 0Q59 58 0 74M140 0Q108 108 0 140M222 0Q173 174 0 222M300 25Q244 244 25 300" fill="none" stroke="currentColor" stroke-width="1.4"/>';
  const portal = '<g class="vn-orbit"><circle cx="150" cy="150" r="104" fill="#183923" stroke="#b2f45d" stroke-width="12"/><circle cx="150" cy="150" r="90" fill="none" stroke="#dcff9c" stroke-width="3" stroke-dasharray="48 18 8 25"/><path d="M148 60C235 57 262 185 180 222S66 193 83 130s114-60 125 5-66 77-80 38 35-51 43-23" fill="none" stroke="#89e85a" stroke-width="12" stroke-linecap="round"/><circle cx="150" cy="150" r="117" fill="none" stroke="#59ddde" stroke-width="2" stroke-dasharray="2 12"/></g>';
  const reactor = '<g class="vn-orbit"><circle cx="150" cy="150" r="111" fill="none" stroke="#77e5ff" stroke-width="2" stroke-dasharray="100 20 14 30"/><circle cx="150" cy="150" r="98" fill="none" stroke="#d5a858" stroke-width="9" stroke-dasharray="2 18"/></g><g class="vn-counter-orbit"><circle cx="150" cy="150" r="78" fill="none" stroke="#81eaff" stroke-width="8" stroke-dasharray="25 7"/></g><circle cx="150" cy="150" r="63" fill="#143445" stroke="#6de5ff" stroke-width="2"/><path class="vn-pulse" d="m150 94 51 90H99Z" fill="#dfffff" stroke="#6de5ff" stroke-width="8" stroke-linejoin="round"/>';
  const fungus = '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M150 282Q165 167 130 46M152 223Q75 196 42 125M150 176Q219 162 250 82M148 134Q75 119 65 60"/><path d="M64 160Q18 126 40 107Q84 102 95 176M197 150Q245 58 268 77Q284 110 213 161M130 72Q83 24 116 20Q159 27 148 103"/></g><g fill="currentColor" opacity=".35"><ellipse cx="67" cy="142" rx="36" ry="12" transform="rotate(43 67 142)"/><ellipse cx="236" cy="117" rx="47" ry="13" transform="rotate(-50 236 117)"/><ellipse cx="114" cy="56" rx="34" ry="13" transform="rotate(38 114 56)"/></g>';
  const outlaw = '<path d="M91 158q17-40 25-48l64 2 24 44 36 10q-68 25-177 0Z" fill="#190909"/><path d="m119 151-4 33 17 30-18 15-30 58h143l-30-58-22-15 14-27-2-32Z" fill="#140a09"/><path d="m112 164 75 3" stroke="#f2b86d" stroke-width="3" opacity=".5"/>';

  const backgrounds = {
    'spider-man': `<path d="M0 293h50v-39h25v39h44v-76h39v76h30v-50h40v50h238v-67h36v67h24v-94h30v94h26v-50h58v117H0Z" fill="#142b50"/><g color="#9dcaff" opacity=".25">${web}</g><g transform="translate(640 0) scale(-1 1)" color="#9dcaff" opacity=".2">${web}</g>`,
    'the-last-of-us': `<path d="M0 257h48v-68h40v68h34v-36h56v60h40v79H0ZM475 282v-90h49v47h35v-98h33v116h48v103H453Z" fill="#20382b"/><g stroke="#2c4c33" stroke-width="8"><path d="M47 360 67 52M79 149 8 88M62 224 142 140M588 360 570 38M576 180 637 93M571 123 507 78"/></g><g transform="translate(35 68) scale(.8)" color="#c4c088" opacity=".45">${fungus}</g><g fill="#d7efaa" class="vn-pulse"><circle cx="182" cy="83" r="3"/><circle cx="426" cy="114" r="4"/><circle cx="485" cy="238" r="2"/><circle cx="116" cy="245" r="3"/></g>`,
    'red-dead': '<circle class="vn-pulse" cx="326" cy="166" r="138" fill="#d14731"/><circle cx="326" cy="166" r="119" fill="#e76a3e"/><path d="M0 253 63 192l74 44 61-58 92 91 120-72 53 40 74-43 103 59v107H0Z" fill="#462116"/><path d="M0 300 116 250l116 40 94-15 154 15 78-43 82 49v64H0Z" fill="#25130e"/>',
    'rick-and-morty': `<g transform="translate(138 -8) scale(1.15)">${portal}</g>`,
    'iron-man': `<g stroke="#55bbd0" opacity=".25" fill="none"><path d="M25 90h120l45 46M25 275h140l41-41M615 90H495l-41 41M615 280H480l-40-40"/><circle cx="320" cy="177" r="150" stroke-dasharray="80 20 4 20"/></g><g transform="translate(412 147) scale(.55)" opacity=".5">${reactor}</g>`
  };
  const motifs = { "spider-man": `<g class="vn-web-draw">${web}</g>`, "the-last-of-us": `<g class="vn-sway">${fungus}</g>`, "red-dead": `<circle class="vn-pulse" cx="150" cy="150" r="115" fill="#dc5133" opacity=".5"/>${outlaw}`, "rick-and-morty": portal, "iron-man": reactor };
  return {
    svg(id) {
      const theme = VELNAR.getThemeById(id);
      const background=backgrounds[id] || VELNAR.CollectionArt?.backgrounds[id];
      if (!theme?.scene || !background) return "";
      const gradient = `vn-art-glow-${++serial}`;
      const character = VELNAR.CharacterArt.svg(id).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      return `<svg class="vn-art vn-art--${id}" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="${gradient}"><stop stop-color="${theme.colors.accentSecondary}" stop-opacity=".28"/><stop offset="1" stop-color="${theme.colors.background}" stop-opacity="0"/></radialGradient></defs><path fill="${theme.colors.background}" d="M0 0h640v360H0Z"/><path fill="url(#${gradient})" d="M0 0h640v360H0Z"/>${background}<g class="vn-subject"><g transform="translate(174 4) scale(1.823)">${character}</g></g></svg>`;
    },
    motif(id) { const body=motifs[id] || VELNAR.CollectionArt?.motif(id);return body ? `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>` : ""; },
    motionCss: `
      .vn-art { display:block; width:100%; height:100%; overflow:hidden; }
      .vn-orbit,.vn-counter-orbit { transform-origin:150px 150px; }
      @keyframes vn-orbit { to { transform:rotate(360deg); } }
      @keyframes vn-pulse { 50% { opacity:.55; } }
      @keyframes vn-subject { 50% { transform:translateY(-5px); } }
      @keyframes vn-banner-spider { 0%,100%{transform:translate(0,0) rotate(0)}30%{transform:translate(-7px,-8px) rotate(-3deg)}62%{transform:translate(8px,-3px) rotate(4deg)} }
      @keyframes vn-banner-ellie { 0%,100%{transform:translate(0,0) rotate(0)}37%{transform:translate(2px,3px) rotate(-3deg)}72%{transform:translate(-3px,-2px) rotate(2deg)} }
      @keyframes vn-banner-arthur { 0%,100%{transform:translate(0,0) rotate(0)}30%{transform:translate(3px,0) rotate(-2deg)}39%{transform:translate(-2px,1px) rotate(2deg)}68%{transform:translate(1px,-2px)} }
      @keyframes vn-banner-rick { 0%,100%{transform:translate(0,1px)}28%{transform:translate(-5px,-4px) rotate(-2deg)}62%{transform:translate(5px,-1px) rotate(2deg)} }
      @keyframes vn-banner-iron { 0%,100%{transform:translate(0,2px) rotate(0)}35%{transform:translate(-5px,-6px) rotate(-3deg)}68%{transform:translate(7px,-2px) rotate(3deg)} }
      @keyframes vn-banner-batman { 0%,100%{transform:translate(0,0) rotate(0)}33%{transform:translate(-8px,-7px) rotate(-3deg)}70%{transform:translate(8px,-4px) rotate(3deg)} }
      @keyframes vn-banner-vader { 0%,100%{transform:translate(0,1px) rotate(0)}32%{transform:translate(-2px,0) rotate(-1deg)}61%{transform:translate(3px,-2px) rotate(1deg)} }
      @keyframes vn-banner-harry { 0%,100%{transform:translate(0,1px) rotate(0)}35%{transform:translate(-3px,-5px) rotate(-2deg)}68%{transform:translate(4px,-2px) rotate(2deg)} }
      @keyframes vn-banner-deadpool { 0%,100%{transform:translate(0,0) rotate(0)}28%{transform:translate(-3px,-3px) rotate(-4deg)}46%{transform:translate(3px,0) rotate(4deg)}65%{transform:translate(-2px,-2px) rotate(-3deg)} }
      @keyframes vn-banner-eleven { 0%,100%{transform:translate(0,0)}36%{transform:translate(-3px,-9px) rotate(-2deg)}69%{transform:translate(4px,-5px) rotate(2deg)} }
      @keyframes vn-banner-wednesday { 0%,100%{transform:translate(0,0) rotate(0)}28%{transform:translate(-3px,-2px) rotate(-4deg)}48%{transform:translate(3px,0) rotate(4deg)}69%{transform:translate(-2px,-2px) rotate(-3deg)} }
      @keyframes vn-banner-squid { 0%,100%{transform:translate(0,0)}34%{transform:translate(-2px,1px) rotate(-1deg)}61%{transform:translate(2px,-1px) rotate(1deg)} }
      @keyframes vn-banner-kratos { 0%,100%{transform:translate(0,0) rotate(0)}34%{transform:translate(-3px,1px) rotate(-3deg)}43%{transform:translate(3px,-2px) rotate(3deg)}69%{transform:translate(1px,0) rotate(-1deg)} }
      @keyframes vn-banner-ezio { 0%,100%{transform:translate(0,0) rotate(0)}30%{transform:translate(-5px,-6px) rotate(-4deg)}50%{transform:translate(3px,-2px) rotate(2deg)}72%{transform:translate(-2px,0) rotate(-1deg)} }
      @keyframes vn-banner-steve { 0%,100%{transform:translate(0,1px)}31%{transform:translate(-2px,-2px) rotate(-2deg)}39%{transform:translate(2px,1px) rotate(2deg)}56%{transform:translate(0,0)} }
      @keyframes vn-cape { 0%,100%{transform:skewX(0) scaleX(1)}50%{transform:skewX(-5deg) scaleX(1.04)} }
      @media (prefers-reduced-motion:no-preference) {
        .vn-art--spider-man .vn-subject{animation:vn-banner-spider 5.2s ease-in-out infinite}
        .vn-art--the-last-of-us .vn-subject{animation:vn-banner-ellie 6s ease-in-out infinite}
        .vn-art--red-dead .vn-subject{animation:vn-banner-arthur 7s ease-in-out infinite}
        .vn-art--rick-and-morty .vn-subject{animation:vn-banner-rick 5.7s ease-in-out infinite}
        .vn-art--iron-man .vn-subject{animation:vn-banner-iron 4.8s ease-in-out infinite}
        .vn-art--batman .vn-subject{animation:vn-banner-batman 5.1s ease-in-out infinite}
        .vn-art--star-wars .vn-subject{animation:vn-banner-vader 6.2s ease-in-out infinite}
        .vn-art--harry-potter .vn-subject{animation:vn-banner-harry 5.5s ease-in-out infinite}
        .vn-art--deadpool .vn-subject{animation:vn-banner-deadpool 4.5s ease-in-out infinite}
        .vn-art--stranger-things .vn-subject{animation:vn-banner-eleven 5.3s ease-in-out infinite}
        .vn-art--wednesday .vn-subject{animation:vn-banner-wednesday 4.8s ease-in-out infinite}
        .vn-art--squid-game .vn-subject{animation:vn-banner-squid 5.8s ease-in-out infinite}
        .vn-art--god-of-war .vn-subject{animation:vn-banner-kratos 5.4s ease-in-out infinite}
        .vn-art--assassins-creed .vn-subject{animation:vn-banner-ezio 5.1s ease-in-out infinite}
        .vn-art--minecraft .vn-subject{animation:vn-banner-steve 4.4s ease-in-out infinite}
        .vn-art--batman .hero-cape{transform-box:fill-box;transform-origin:50% 8%;animation:vn-cape 2.8s ease-in-out infinite}
        .vn-art--star-wars .hero-saber{filter:drop-shadow(0 0 5px #ff405f);animation:vn-banner-saber 1.4s ease-in-out infinite alternate}
        @keyframes vn-banner-saber{to{opacity:.72;filter:drop-shadow(0 0 11px #ff405f)}}
      }
      @keyframes vn-sway { 50% { transform:rotate(3deg); } }
      @keyframes vn-web-draw { 0% { stroke-dashoffset:850; opacity:.1; } 35%,85% { stroke-dashoffset:0; opacity:1; } 100% { stroke-dashoffset:0; opacity:.1; } }
      @media (prefers-reduced-motion:no-preference) {
        .vn-orbit { animation:vn-orbit 22s linear infinite; }
        .vn-counter-orbit { animation:vn-orbit 13s linear infinite reverse; }
        .vn-pulse { animation:vn-pulse 5s ease-in-out infinite; }
        .vn-subject { animation:vn-subject 7s ease-in-out infinite; }
        .vn-web-draw { stroke-dasharray:850; animation:vn-web-draw 12s ease-in-out infinite; }
        .vn-sway { transform-origin:150px 282px; animation:vn-sway 10s ease-in-out infinite; }
      }
    `
  };
})();

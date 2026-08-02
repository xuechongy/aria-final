let currentAct = 0;
let currentLine = 0;
let isTyping = false;
const typeInterval = null;
let briefingDone = false;

function initBriefing() {
  currentAct = 0;
  currentLine = 0;
  isTyping = false;
  briefingDone = false;
  buildBriefingDOM();
  renderAct(0);
}

function buildBriefingDOM() {
  const scene = document.getElementById('scene-briefing');
  scene.innerHTML = `<div id="briefing-wrap"><div id="briefing-screen"></div><div id="briefing-click-hint">CLICK ANYWHERE TO CONTINUE</div><button id="briefing-skip" onclick="event.stopPropagation();skipBriefing()">SKIP INTRO</button></div>`;
  document.getElementById('briefing-wrap').addEventListener('click', advanceBriefing);

  const style = document.createElement('style');
  style.textContent = `
    
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Special+Elite&display=swap');

    #scene-briefing {
      max-width: 100vw !important;
      height: 100vh !important;
      padding: 0 !important;
      margin: 0;
      overflow: hidden;
    }
    #briefing-wrap {
      width: 100vw;
      height: 100vh;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: background 0.8s ease;
    }
    #briefing-screen {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      box-sizing: border-box;
      position: relative;
    }
    #briefing-click-hint {
      position: absolute;
      left: 50%;
      bottom: 30px;
      z-index: 12;
      transform: translateX(-50%);
      color: #C1272D;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 3px;
      white-space: nowrap;
      pointer-events: none;
      text-shadow: 0 0 9px rgba(193,39,45,.45);
      animation: briefing-click-hint-pulse 2.4s ease-in-out infinite;
    }
    @keyframes briefing-click-hint-pulse {
      0%, 100% { opacity: .5; }
      50% { opacity: 1; }
    }
    #briefing-skip {
      position: absolute;
      bottom: 30px;
      right: 40px;
      z-index: 10;
      background: none;
      border: none;
      color: #16100a;
      font-family: "Cinzel", Georgia, serif;
      letter-spacing: 3px;
      font-size: 12px;
      font-weight: bold;
      padding: 13px 34px;
      cursor: pointer;
      rotate: -0.8deg;
      filter: drop-shadow(2px 3px 4px rgba(0,0,0,0.5));
      transition: all 0.3s ease;
    }
    #briefing-skip::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: url("assets/UI/dir_exit_label_metallic.png") center / 100% 100% no-repeat;
      transition: filter 0.3s ease;
    }
    #briefing-skip:hover {
      rotate: 0deg;
      color: #C1272D;
      filter:
        drop-shadow(2px 3px 4px rgba(0,0,0,0.5))
        drop-shadow(0px 0px 12px rgba(160, 20, 20, 0.4))
        drop-shadow(0px 0px 30px rgba(120, 10, 10, 0.25));
    }
    #briefing-skip:hover::before {
      filter: brightness(0.16) saturate(0.5);
    }

    
    .screen-news {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
    }
    .news-source {
      font-size: 11px;
      color: #AAAAAA !important;
      letter-spacing: 4px;
      font-family: Arial, sans-serif;
      margin-bottom: 40px;
      opacity: 0;
      transition: opacity 1.2s ease;
    }
    .news-headline {
      font-size: clamp(24px, 3.5vw, 48px);
      color: #FFFFFF !important;
      font-family: "Cinzel", Georgia, serif;
      letter-spacing: 2px;
      line-height: 1.4;
      margin-bottom: 32px;
      opacity: 0;
      transition: opacity 1.2s ease;
      text-shadow: 0 2px 20px rgba(0,0,0,0.8);
    }
    .news-quote {
      font-size: clamp(13px, 1.4vw, 17px);
      color: #C8C0B0 !important;
      font-family: "Palatino Linotype", Georgia, serif;
      font-style: italic;
      line-height: 1.9;
      margin-bottom: 20px;
      opacity: 0;
      transition: opacity 1.2s ease;
      text-shadow: 0 1px 12px rgba(0,0,0,0.9);
    }
    .news-attribution {
      font-size: 11px;
      color: #888888 !important;
      letter-spacing: 2px;
      font-family: Arial, sans-serif;
      opacity: 0;
      transition: opacity 1.2s ease;
    }
    .news-divider {
      width: 40px;
      height: 1px;
      background: #C1272D;
      margin: 0 auto 32px;
      opacity: 0;
      transition: opacity 1.2s ease;
    }

    
    .screen-email {
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
      text-align: left;
      opacity: 0;
      transition: opacity 0.8s ease;
    }

    
    .avatar-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid #2A1A1A;
      background: #111;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-family: "Cinzel", "Times New Roman", Georgia, serif;
      font-weight: bold;
      color: #C1272D;
      letter-spacing: 1px;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      mix-blend-mode: normal;
    }
    .avatar-info { display: flex; flex-direction: column; gap: 3px; }
    .avatar-name {
      font-size: 12px;
      color: #ffffff;
      font-family: "Cinzel", "Times New Roman", Georgia, serif;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .avatar-meta {
      font-size: 10px;
      color: #663333;
      font-family: "Cinzel", "Times New Roman", Georgia, serif;
      letter-spacing: 1px;
    }

    
    .screen-email {
      background-color: #E8DFC0 !important;
      color: #000000 !important;
      background-image: repeating-linear-gradient(transparent, transparent 25px, rgba(0, 0, 0, 0.06) 25px, rgba(0, 0, 0, 0.06) 26px);
      box-sizing: border-box;
  max-height: 85vh;
  overflow-y: auto;
  padding: 30px !important;
  -ms-overflow-style: none;
  scrollbar-width: none;
      clip-path: polygon(
        0% 0.5%, 2% 0%, 5% 0.5%, 8% 0%, 12% 0.5%, 16% 0%, 20% 0.5%, 25% 0%, 30% 0.5%, 35% 0%, 
        40% 0.5%, 45% 0%, 50% 0.5%, 55% 0%, 60% 0.5%, 65% 0%, 70% 0.5%, 75% 0%, 80% 0.5%, 85% 0%, 
        90% 0.5%, 94% 0%, 97% 0.5%, 100% 0%, 99.5% 25%, 100% 50%, 99.5% 75%, 100% 100%, 97% 99.5%, 
        93% 100%, 88% 99.5%, 83% 100%, 78% 99.5%, 73% 100%, 68% 99.5%, 63% 100%, 58% 99.5%, 53% 100%, 
        48% 99.5%, 43% 100%, 38% 99.5%, 33% 100%, 28% 99.5%, 23% 100%, 18% 99.5%, 13% 100%, 8% 99.5%, 
        3% 100%, 0% 99.5%, 0.5% 75%, 0% 50%, 0.5% 25%
      );
      filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.4));
      
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-weight: 400; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 40px !important;
    }

    .screen-email .avatar-name,
    .screen-email .avatar-meta,
    .screen-email .email-terminal-fields,
    .screen-email .email-terminal-body,
    .screen-email .email-terminal-footer {
      color: #000000 !important;
    }
    
    .screen-email .avatar,
    .screen-email .avatar-name,
    .screen-email .avatar-meta {
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
    }
    .screen-email::-webkit-scrollbar {
  display: none;
}
    .screen-email .avatar {
      border: none !important;
      color: #000000;
      background: transparent;
    }
    .screen-email .avatar-name {
      letter-spacing: 2px;
      font-size: 14px;
      color: #000000;
      font-weight: bold;
    }
    .screen-email .avatar-meta {
      color: #000000;
      font-weight: bold;
    }

    .email-terminal-header {
      padding: 12px 20px;
    }
    .email-terminal-divider {
      font-size: 11px;
      color: #000000;
      letter-spacing: 2px;
      margin-bottom: 12px;
    }
    .email-terminal-fields {
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-size: 15px;
      color: #000000; 
      line-height: 26px;
      font-weight: bold;
      letter-spacing: .2px;
    }
    .email-terminal-body {
      padding: 16px 20px;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-size: 15px;
      color: #000000;
      line-height: 26px;
      border-bottom: 0;
      letter-spacing: .15px;
    }
    .email-terminal-body p {
      margin: 0 0 18px 0;
    }
    .email-body-line {
      min-height: 26px;
      line-height: 26px;
      margin: 0;
      color: #000000;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-size: 15px;
      letter-spacing: .15px;
    }
    .email-terminal-body .em-hi {
      color: #000000;
      font-weight: bold;
      display: inline-block;
      line-height: 26px;
    }
    .email-terminal-footer {
      padding: 12px 20px;
      font-size: 11px;
      color: #000000;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .screen-email {
      width: clamp(820px, 62vw, 1160px);
      max-width: 78vw;
      min-height: clamp(570px, 64vh, 760px);
      max-height: 84vh;
      position: relative;
      overflow: visible;
      background-color: transparent !important;
      background-image:
        url("assets/UI/03_intro_red_paper.png"),
        url("assets/UI/letter.png") !important;
      background-repeat: no-repeat, no-repeat !important;
      background-position: calc(100% - 28px) 16px, center !important;
      background-size: 260px auto, 100% 100% !important;
      clip-path: none !important;
      filter: drop-shadow(0 24px 38px rgba(0,0,0,.52)) !important;
    }
    .screen-email::after {
      content: "";
      position: absolute;
      pointer-events: none;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      z-index: -1;
      filter: drop-shadow(0 12px 18px rgba(0,0,0,.42));
    }

    .screen-email::after { display: none; }

    .briefing-robin-evidence {
      position: fixed;
      left: clamp(18px, 4vw, 96px);
      bottom: clamp(46px, 7vh, 92px);
      width: clamp(300px, 20vw, 410px);
      height: auto;
      transform: rotate(-7deg);
      opacity: .96;
      z-index: 80;
      pointer-events: none;
      filter: drop-shadow(0 18px 24px rgba(0,0,0,.55));
    }

    .briefing-gold-paperclip {
      position: fixed;
      left: clamp(250px, 18vw, 380px);
      bottom: clamp(4px, 2vh, 36px);
      width: clamp(210px, 14vw, 270px);
      height: auto;
      --base-rot: -18deg;
      transform: rotate(var(--base-rot));
      opacity: .96;
      z-index: 92;
      pointer-events: auto;
      cursor: pointer;
      filter: drop-shadow(0 10px 16px rgba(0,0,0,.45));
      transition: transform .18s ease, filter .18s ease;
    }

    .briefing-silver-paperclip {
      position: fixed;
      right: clamp(300px, 18vw, 410px);
      top: clamp(76px, 9vh, 112px);
      width: clamp(84px, 5.5vw, 112px);
      height: auto;
      --base-rot: -7deg;
      transform: rotate(var(--base-rot));
      opacity: .96;
      z-index: 91;
      pointer-events: auto;
      cursor: pointer;
      filter: drop-shadow(0 10px 16px rgba(0,0,0,.42));
      transition: transform .18s ease, filter .18s ease;
    }

    .briefing-key-tag {
      position: fixed;
      right: clamp(260px, 16vw, 360px);
      bottom: clamp(62px, 8vh, 108px);
      width: clamp(230px, 15vw, 310px);
      height: auto;
      --base-rot: 8deg;
      transform: rotate(var(--base-rot));
      opacity: .94;
      z-index: 78;
      pointer-events: auto;
      cursor: pointer;
      filter: drop-shadow(0 12px 18px rgba(0,0,0,.45));
      transition: transform .18s ease, filter .18s ease;
    }

    /* props that carry code-rendered text: img fills the wrapper,
       labels ride along with position/rotation/wiggle */
    .briefing-prop img {
      display: block;
      width: 100%;
      height: auto;
      pointer-events: none;
    }
    .briefing-prop .prop-line {
      position: absolute;
      font-family: "Special Elite", "Courier Prime", monospace;
      font-weight: bold;
      white-space: nowrap;
      clip-path: inset(0 100% -12% 0);
      animation: briefing-prop-write .55s ease-out forwards;
    }
    @keyframes briefing-prop-write {
      to { clip-path: inset(0 -10% -12% 0); }
    }
    /* evidence card: name + role written on the blank paper below the photo */
    .briefing-robin-evidence .ev1,
    .briefing-robin-evidence .ev2 {
      left: 20%;
      transform: rotate(-6deg);
      color: #241609;
      text-shadow: 0 0 2px rgba(240,225,200,.35);
    }
    .briefing-robin-evidence .ev1 {
      top: 74%;
      font-size: clamp(15px, 1.35vw, 19px);
      letter-spacing: 2px;
      animation-delay: 1.1s;
    }
    .briefing-robin-evidence .ev2 {
      top: 81.5%;
      font-size: clamp(10px, .85vw, 12px);
      letter-spacing: 1px;
      animation-delay: 1.45s;
      white-space: normal;
      max-width: 56%;
      line-height: 1.35;
    }
    /* Wren's artwork has a lower tape strip: shift her lines down, centered */
    .briefing-robin-evidence.is-wren .ev1,
    .briefing-robin-evidence.is-wren .ev2 {
      left: 47%;
      transform: translateX(-50%) rotate(-6deg);
      text-align: center;
    }
    .briefing-robin-evidence.is-wren .ev1 { top: 78.5%; }
    .briefing-robin-evidence.is-wren .ev2 { top: 86%; }
    /* key tag: engraved lines following the leather tag's tilt */
    .briefing-key-tag .kt1,
    .briefing-key-tag .kt2 {
      left: 13%;
      width: 44%;
      text-align: center;
      transform: rotate(12deg);
      color: #33200f;
      text-shadow: 0 1px 0 rgba(255, 230, 190, .28);
    }
    .briefing-key-tag .kt1 {
      top: 17.5%;
      font-size: clamp(12px, 1vw, 15px);
      letter-spacing: 3px;
      animation-delay: 1.7s;
    }
    .briefing-key-tag .kt2 {
      top: 25.5%;
      font-size: clamp(11px, .9vw, 14px);
      letter-spacing: 2px;
      animation-delay: 2s;
    }
    .briefing-gold-paperclip:hover,
    .briefing-silver-paperclip:hover,
    .briefing-key-tag:hover {
      animation: briefing-trinket-wiggle .9s ease-in-out both;
      filter: drop-shadow(0 16px 22px rgba(0,0,0,.58));
    }

    @keyframes briefing-trinket-wiggle {
      0%, 100% { transform: rotate(var(--base-rot, 0deg)) translate(0, 0); }
      25% { transform: rotate(calc(var(--base-rot, 0deg) - 5deg)) translate(-4px, 3px); }
      50% { transform: rotate(calc(var(--base-rot, 0deg) + 5deg)) translate(4px, -3px); }
      75% { transform: rotate(calc(var(--base-rot, 0deg) - 3deg)) translate(-2px, 1px); }
    }

    .screen-email > * {
      position: relative;
      z-index: 1;
    }
    
    .screen-notif-stack {
      position: relative;
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
      align-self: flex-start;   
      display: flex;
      flex-direction: column;
      gap: 18px;
      opacity: 1;
      background: rgba(3, 4, 6, 0.94) !important;
      border: 1px solid #3A1A1A;
      border-radius: 20px;
      padding: 56px 16px 18px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      overflow: hidden;
    }
    .screen-notif-stack::before {
      content: "MESSAGES";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 18px;
      font-family: "Special Elite", "Courier Prime", monospace;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #887060;
      background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.15));
      border-bottom: 1px solid #3A1A1A;
      box-sizing: border-box;
    }
    .screen-notif-stack::after {
      content: "// ENCRYPTED";
      position: absolute;
      top: 0; right: 18px;
      height: 40px;
      display: flex;
      align-items: center;
      font-family: "Special Elite", "Courier Prime", monospace;
      font-size: 10px;
      letter-spacing: 1.5px;
      color: #6B2020;
    }
    .notif-banner {
      background: rgba(38, 40, 46, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 22px;
      padding: 14px 18px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.55);
      opacity: 0;
      transform: translateY(-12px) scale(0.96);
      transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      align-items: center;
      gap: 14px;
      text-align: left;
    }
    .notif-banner.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .notif-body {
      flex: 1;
      min-width: 0;
    }
    .notif-top {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .notif-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-weight: bold;
      font-size: 20px;
      color: #000;
    }
    .notif-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    .notif-app {
      font-size: 12px;
      letter-spacing: 1px;
      color: #C9C2B4;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-weight: bold;
      text-transform: uppercase;
      flex: 1;
    }
    .notif-time {
      font-size: 12px;
      color: #C9C2B4;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-weight: bold;
    }
    .notif-sender {
      font-size: 14px;
      font-weight: bold;
      color: #EDE6D3;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
    }
    .notif-text {
      font-size: 14px;
      color: #F4F1EA;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      font-weight: bold;
      letter-spacing: 0.5px;
      line-height: 1.5;
    }

    
    /* casefile act: taller than the viewport -> scrollable, starts lower */
    #briefing-screen:has(.case-wrapper) {
      align-items: flex-start;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: rgba(193,39,45,.5) transparent;
    }
    #briefing-screen:has(.case-wrapper)::-webkit-scrollbar { width: 6px; }
    #briefing-screen:has(.case-wrapper)::-webkit-scrollbar-thumb {
      background: rgba(193,39,45,.5);
      border-radius: 3px;
    }
    /* ── casefile prop kit (shared classes with the appeal pages) ── */
    .ch2appeal-note{position:absolute;left:-238px;top:-26px;width:232px;aspect-ratio:833/1153;--base-rot:-8deg;transform-origin:50% 10%;z-index:4;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .4s both;}
    .ch2appeal-note-inner{position:absolute;inset:0;background:url("assets/props/prop-note-checklist.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}
    .ch2appeal-note:hover .ch2appeal-note-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}
    @keyframes ch2note-drop{from{opacity:0;transform:rotate(calc(var(--base-rot) + 5deg)) translateY(-20px);}to{opacity:1;transform:rotate(var(--base-rot)) translateY(0);}}
    .ch2appeal-note .note-label{position:absolute;left:24%;transform:translateY(-50%);font-family:"Special Elite","Courier Prime",monospace;font-size:14px;font-weight:bold;color:#EAD9C2;text-shadow:0 1px 2px rgba(0,0,0,.7);letter-spacing:1px;white-space:nowrap;}
    .ch2appeal-note .note-check{position:absolute;left:15%;width:26px;height:26px;transform:translate(-50%,-54%) rotate(-6deg);overflow:visible;filter:drop-shadow(0 0 3px rgba(244,232,208,.95)) drop-shadow(0 0 1px rgba(244,232,208,.9));}
    .ch2appeal-note .note-check path{fill:none;stroke:#9a181c;stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:46;stroke-dashoffset:46;animation:ch2note-tick .5s cubic-bezier(.3,.7,.35,1) forwards;}
    .ch2appeal-note .r1 path{animation-delay:1.4s;}
    .ch2appeal-note .r2 path{animation-delay:1.95s;}
    .ch2appeal-note .r3 path{animation-delay:2.5s;}
    @keyframes ch2note-tick{to{stroke-dashoffset:0;}}
    .ch2appeal-note .r1{top:19%;}.ch2appeal-note .r2{top:30%;}
    .ch2appeal-note .r3{top:41%;}.ch2appeal-note .r4{top:51.5%;}
    .ch2appeal-vial{position:absolute;left:-252px;top:322px;width:222px;aspect-ratio:928/1232;--base-rot:6deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .75s both;}
    .ch2appeal-vial-inner{position:absolute;inset:0;background:url("assets/props/prop-note-morphine.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}
    .ch2appeal-vial:hover .ch2appeal-vial-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}
    .ch2appeal-vial .vial-line{position:absolute;left:51%;width:45%;box-sizing:border-box;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;text-shadow:none;white-space:normal;line-height:1.15;text-align:left;transform:rotate(-2deg);transform-origin:left center;clip-path:inset(0 100% -10% 0);animation:ch2vial-write .55s ease-out forwards;}
    .ch2appeal-vial .v1{top:45%;font-size:12px;letter-spacing:.4px;animation-delay:1.8s;}
    .ch2appeal-vial .v2{top:59%;font-size:12px;animation-delay:2.2s;}
    .ch2appeal-vial .v3{top:66.5%;font-size:13px;letter-spacing:1px;animation-delay:2.55s;}
    @keyframes ch2vial-write{to{clip-path:inset(0 -10% -10% 0);}}
    .ch2appeal-polaroid{position:absolute;right:-232px;top:64px;width:212px;aspect-ratio:1034/1329;--base-rot:-5deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.05s both;}
    .ch2appeal-polaroid-inner{position:absolute;inset:0;background:url("assets/props/prop-polaroid-george.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}
    .ch2appeal-polaroid:hover .ch2appeal-polaroid-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}
    .ch2appeal-polaroid .pol-line{position:absolute;left:50%;transform:translateX(-50%);font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#2a1c10;text-shadow:none;white-space:nowrap;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .55s ease-out forwards;}
    .ch2appeal-polaroid .p1{top:82.5%;font-size:17px;letter-spacing:2px;animation-delay:2.3s;}
    .ch2appeal-polaroid .p2{top:89%;font-size:13px;letter-spacing:3px;animation-delay:2.6s;}
    .ch2appeal-tag{position:absolute;right:-246px;top:398px;width:204px;aspect-ratio:730/1114;--base-rot:4deg;transform-origin:50% 6%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.35s both;}
    .ch2appeal-tag-inner{position:absolute;inset:0;background:url("assets/props/prop-tag-evidence.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}
    .ch2appeal-tag:hover .ch2appeal-tag-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}
    .ch2appeal-tag .tag-line{position:absolute;left:16%;transform:translateY(-100%) rotate(-1deg);font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;text-shadow:none;white-space:nowrap;font-size:13px;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}
    .ch2appeal-tag .t1{top:25.8%;font-size:15px;letter-spacing:1px;animation-delay:2.6s;}
    .ch2appeal-tag .t2{top:31.9%;animation-delay:2.9s;}
    .ch2appeal-tag .t3{top:38.1%;animation-delay:3.2s;}
    .ch2appeal-tag .t4{top:43.7%;animation-delay:3.5s;}
    .ch2appeal-tag .tag-seal{position:absolute;left:45%;top:86.8%;transform:translate(-50%,-50%) rotate(-3deg);font-family:"Special Elite",monospace;font-weight:bold;font-size:19px;letter-spacing:6px;color:#17110d;text-shadow:none;opacity:0;animation:ch2tag-seal .35s cubic-bezier(.2,.8,.3,1.2) 3.9s forwards;}
    .prop-red-accent{color:#9a181c!important;}
    @keyframes ch2tag-seal{from{opacity:0;transform:translate(-50%,-50%) scale(1.7) rotate(-3deg);}60%{opacity:1;transform:translate(-50%,-50%) scale(.95) rotate(-3deg);}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-3deg);}}
    @keyframes ch2appeal-stamp-wiggle{0%,100%{transform:rotate(var(--base-rot,0deg)) translate(0,0);}25%{transform:rotate(calc(var(--base-rot,0deg) - 5deg)) translate(-4px,3px);}50%{transform:rotate(calc(var(--base-rot,0deg) + 5deg)) translate(4px,-3px);}75%{transform:rotate(calc(var(--base-rot,0deg) - 3deg)) translate(-2px,1px);}}
    @media (max-width:1120px){.ch2appeal-note,.ch2appeal-vial,.ch2appeal-polaroid,.ch2appeal-tag{display:none;}}

    .case-wrapper {
      position: relative;
      width: 100%;
      max-width: 620px;
      margin: 1.5vh auto 10vh;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transform: scale(0.82);
      transform-origin: center center;
      transition: opacity 1s ease;
    }
    .case-red-folder {
      position: absolute;
      width: 100%;
      height: 103%;
      background: #141114;
      transform: rotate(-2deg);
      box-shadow: 0 15px 35px rgba(0,0,0,0.7);
      border-radius: 4px;
      z-index: 1;
    }
    /* same document format as the appeal rulings: thermal receipt artwork */
    .screen-casefile {
      position: relative;
      background: url('assets/UI/05_thermal_receipt.png') center/100% 100% no-repeat !important;
      color: #241c18 !important;
      width: 100%;
      padding: 7% 11% 8% 10% !important;
      font-family: "Special Elite", "Courier Prime", "Courier New", Courier, monospace;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.55));
      text-align: left;
      z-index: 2;
      border: 0;
    }
    .case-header-black {
      background: rgba(10,8,8,.88);
      color: #f2ece1;
      padding: 15px 20px;
      text-align: center;
      margin-bottom: 30px;
      border: 2px solid rgba(0,0,0,.85);
      position: relative;
    }
    .case-title {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 3px;
      margin-bottom: 5px;
    }
    .case-subtitle {
      font-size: 11px;
      letter-spacing: 2px;
      color: #b3a99a;
    }
    .case-stamp {
      position: absolute;
      right: -12px;
      top: -14px;
      color: #C1272D;
      border: 3px solid #C1272D;
      padding: 4px 12px;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 4px;
      --base-rot: -9deg;
      transform: rotate(var(--base-rot));
      background: rgba(240,231,214,.85);
      box-shadow: 0 6px 12px rgba(0,0,0,.4);
      z-index: 3;
      cursor: default;
    }
    .case-stamp:hover {
      animation: case-stamp-wiggle .9s ease-in-out both;
      box-shadow: 0 9px 16px rgba(0,0,0,.5);
    }
    @keyframes case-stamp-wiggle {
      0%, 100% { transform: rotate(var(--base-rot, 0deg)) translate(0, 0); }
      25% { transform: rotate(calc(var(--base-rot, 0deg) - 5deg)) translate(-4px, 3px); }
      50% { transform: rotate(calc(var(--base-rot, 0deg) + 5deg)) translate(4px, -3px); }
      75% { transform: rotate(calc(var(--base-rot, 0deg) - 3deg)) translate(-2px, 1px); }
    }
    .case-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 15px 10px;
      margin-bottom: 30px;
      border-bottom: 2px dashed rgba(60,40,35,.55);
      padding: 14px 12px 24px;
      background: rgba(242,232,214,.46);
      box-shadow: 0 0 22px 12px rgba(242,232,214,.46);
    }
    .case-label {
      font-size: 13px;
      font-weight: bold;
      color: #241c18;
      text-transform: uppercase;
      padding-top: 2px;
      text-shadow: 0 0 5px rgba(244,236,220,.9);
    }
    .case-value {
      font-size: 14px;
      font-weight: bold;
      line-height: 1.5;
      color: #241c18;
      border-bottom: 1px solid rgba(80,55,48,.35);
      padding-bottom: 2px;
      text-shadow: 0 0 5px rgba(244,236,220,.9);
    }
    .case-value p {
      margin: 0 0 5px 0;
    }
    .case-highlight {
      color: #C1272D;
      font-weight: bold;
    }

    

    /* Two-lane chat board for briefing SMS */
    .screen-notif-stack {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
      grid-auto-flow: row !important;
      align-items: start !important;
      column-gap: clamp(28px, 5vw, 76px) !important;
      row-gap: 16px !important;
      max-width: min(980px, 78vw) !important;
      background:
        linear-gradient(180deg, rgba(45, 4, 7, .78), rgba(2, 2, 3, .94)),
        repeating-linear-gradient(0deg, rgba(193,39,45,.055) 0 1px, transparent 1px 16px),
        repeating-linear-gradient(90deg, rgba(193,39,45,.045) 0 1px, transparent 1px 18px) !important;
      border-color: rgba(193, 39, 45, .42) !important;
      border-radius: 8px !important;
    }

    .screen-notif-stack::before {
      content: "CHAT  //  INCOMING SESSION" !important;
      background: linear-gradient(90deg, rgba(193,39,45,.9), rgba(70,8,12,.74) 42%, rgba(8,8,10,.86)) !important;
      color: #f3d7c8 !important;
      border-bottom: 1px solid rgba(193,39,45,.48) !important;
    }

    .screen-notif-stack::after {
      content: "REC  //  ENCRYPTED" !important;
      color: rgba(245, 214, 200, .72) !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming,
    .screen-notif-stack .notif-banner.sms-outgoing {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming {
      grid-column: 1 !important;
      justify-self: stretch !important;
      margin-left: 0 !important;
      margin-right: auto !important;
      border-radius: 2px 10px 10px 10px !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing {
      grid-column: 2 !important;
      justify-self: stretch !important;
      margin-left: auto !important;
      margin-right: 0 !important;
      flex-direction: row-reverse !important;
      border-radius: 10px 2px 10px 10px !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-body {
      text-align: right !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-top {
      flex-direction: row-reverse !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-icon {
      order: 2 !important;
    }

    /* Final briefing SMS lane behavior */
    .screen-notif-stack {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming,
    .screen-notif-stack .notif-banner.sms-outgoing {
      width: min(48%, 520px) !important;
      max-width: 520px !important;
      min-width: min(360px, 48%) !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming {
      align-self: flex-start !important;
      margin-left: 0 !important;
      margin-right: auto !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing {
      align-self: flex-end !important;
      margin-left: auto !important;
      margin-right: 0 !important;
    }

    /* Briefing SMS refinement: smaller panel, wider message, right avatar */
    .screen-notif-stack {
      width: min(74vw, 1080px) !important;
      max-width: min(74vw, 1080px) !important;
      position: relative !important;
      z-index: 2 !important;
    }

    #briefing-screen:has(.screen-notif-stack)::before {
      content: "";
      position: fixed;
      left: 50%;
      top: 51%;
      width: min(46vw, 680px);
      aspect-ratio: 1.45;
      transform: translate(-50%, -50%) rotate(-2deg);
      background: url("assets/UI/02_text back.png") center/contain no-repeat;
      opacity: .42;
      filter: drop-shadow(0 22px 36px rgba(0,0,0,.52));
      pointer-events: none;
      z-index: 1;
    }

    .screen-notif-stack .notif-banner.sms-incoming,
    .screen-notif-stack .notif-banner.sms-outgoing {
      width: min(66%, 720px) !important;
      max-width: 720px !important;
      min-width: min(430px, 66%) !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing {
      flex-direction: row !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-body {
      order: 1 !important;
      text-align: left !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-icon {
      order: 2 !important;
      margin-left: 14px !important;
      margin-right: 0 !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-top {
      flex-direction: row !important;
    }

    /* Final briefing chat presentation: large 02 backing, detached avatars, text-fit bubbles */
    .screen-notif-stack {
      width: min(66vw, 1040px) !important;
      max-width: min(66vw, 1040px) !important;
      position: relative !important;
      z-index: 2 !important;
    }

    #briefing-screen:has(.screen-notif-stack)::before {
      content: "" !important;
      position: fixed !important;
      left: 50% !important;
      top: 50% !important;
      width: min(82vw, 1360px) !important;
      aspect-ratio: 1.72 !important;
      transform: translate(-50%, -50%) rotate(0deg) !important;
      background: url("assets/UI/02_text back.png") center/contain no-repeat !important;
      opacity: .78 !important;
      filter: drop-shadow(0 24px 42px rgba(0,0,0,.58)) !important;
      pointer-events: none !important;
      z-index: 1 !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming,
    .screen-notif-stack .notif-banner.sms-outgoing {
      width: fit-content !important;
      max-width: min(66%, 720px) !important;
      min-width: 0 !important;
      display: flex !important;
      align-items: flex-start !important;
      gap: 12px !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming {
      flex-direction: row !important;
      align-self: flex-start !important;
      margin-left: 0 !important;
      margin-right: auto !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing {
      flex-direction: row !important;
      align-self: flex-end !important;
      margin-left: auto !important;
      margin-right: 0 !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming .notif-icon {
      order: 1 !important;
      flex: 0 0 auto !important;
      margin: 0 12px 0 0 !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-icon {
      order: 2 !important;
      flex: 0 0 auto !important;
      margin: 0 0 0 12px !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming .notif-body,
    .screen-notif-stack .notif-banner.sms-outgoing .notif-body {
      order: 1 !important;
      flex: 0 1 auto !important;
      width: fit-content !important;
      max-width: min(100%, 640px) !important;
      min-width: 0 !important;
      display: inline-block !important;
      padding: 12px 16px !important;
      border: 1px solid var(--bubble-border, rgba(193,39,45,.45)) !important;
      border-radius: 4px 10px 10px 10px !important;
      background: var(--bubble-bg, rgba(13, 14, 19, .9)) !important;
      box-shadow: 0 12px 28px rgba(0,0,0,.34) !important;
      text-align: left !important;
    }

    .screen-notif-stack .notif-banner.sms-outgoing .notif-body {
      border-color: var(--bubble-border, rgba(193,39,45,.56)) !important;
      background: var(--bubble-bg, rgba(45, 7, 10, .92)) !important;
    }

    .screen-notif-stack .notif-banner.sms-incoming .notif-top,
    .screen-notif-stack .notif-banner.sms-outgoing .notif-top {
      width: auto !important;
      justify-content: flex-start !important;
      gap: 14px !important;
    }

    @media (max-width: 760px) {
      .screen-notif-stack {
        width: min(86vw, 760px) !important;
        max-width: 86vw !important;
      }
      #briefing-screen:has(.screen-notif-stack)::before {
        width: min(106vw, 900px) !important;
      }
      .screen-notif-stack .notif-banner.sms-incoming,
      .screen-notif-stack .notif-banner.sms-outgoing {
        max-width: min(86%, 620px) !important;
      }
    }

    /* Lower briefing chat panel slightly */
    .screen-notif-stack {
      margin-top: clamp(20px, 3vh, 34px) !important;
    }

    @media (max-width: 760px) {
      .screen-notif-stack {
        margin-top: 18px !important;
      }

    }

    /* Custom chat frame artwork (assets/UI/02_text_back.png).
       The image has its own CHAT header + red frame; messages are
       confined to the inner dark area (top 14.5%, sides ~4%, bottom 3%). */
    .screen-notif-stack {
      --smsw: min(80vw, 1180px);
      width: var(--smsw) !important;
      max-width: var(--smsw) !important;
      box-sizing: border-box !important;
      aspect-ratio: 1774 / 944;
      max-height: 76vh;
      background: url("assets/UI/02_text_back.png") center / 100% 100% no-repeat !important;
      background-origin: border-box !important;
      background-clip: border-box !important;
      border: solid transparent !important;
      border-width: calc(var(--smsw) * .082) calc(var(--smsw) * .05) calc(var(--smsw) * .036) calc(var(--smsw) * .046) !important;
      border-radius: 0 !important;
      box-shadow: 0 24px 48px rgba(0,0,0,.55) !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      padding: 10px 12px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      scrollbar-width: thin;
      scrollbar-color: rgba(193,39,45,.5) transparent;
    }
    .screen-notif-stack::-webkit-scrollbar { width: 6px; }
    .screen-notif-stack::-webkit-scrollbar-thumb {
      background: rgba(193,39,45,.5);
      border-radius: 3px;
    }
    .screen-notif-stack::before,
    .screen-notif-stack::after {
      content: none !important;
      display: none !important;
    }
    #briefing-screen:has(.screen-notif-stack)::before {
      content: none !important;
      display: none !important;
      background: none !important;
    }
    @media (max-width: 760px) {
      .screen-notif-stack {
        --smsw: 94vw;
        aspect-ratio: auto;
        height: 72vh;
        border-width: calc(72vh * .15) calc(94vw * .05) calc(72vh * .04) calc(94vw * .046) !important;
        padding: 8px 8px !important;
      }
    }
    #briefing-dots {
      position: absolute;
      bottom: 10px; 
      top: auto;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .b-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #222;
      transition: background 0.3s ease;
    }
    .b-dot.active { background: #C1272D; box-shadow: 0 0 6px #C1272D; }
    .b-dot.done   { background: #444; }
  `;
  document.head.appendChild(style);
}

const AVATARS = {
  aria: 'assets/char-aria.png',
  lens: 'assets/char-lens.png',
  robin: 'assets/char-robin.png',
  kai: 'assets/char-kai.png',
  wren: 'assets/char-wren-silhouette.png',
};

function avatarHTML(key, fallback) {
  return `<div class="avatar"><img src="${AVATARS[key]}" onerror="this.parentElement.innerHTML='${fallback}'" /></div>`;
}

function notifIcon(key, fallback) {
  return `<div class="notif-icon"><img src="${AVATARS[key]}" onerror="this.parentElement.innerHTML='${fallback}'" /></div>`;
}

const SCREENS = [
  {
    id: 'news',
    bg: '#000000',
    render: () => {
      const el = document.createElement('div');
      el.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:hidden;';
      el.innerHTML = `
        <img id="news-bg1" src="assets/bg-news.png" style="
          position:absolute;inset:0;
          width:100%;height:100%;
          object-fit:cover;object-position:center;
          filter:brightness(0.7);
          opacity:1;
        " />
        <div style="
          position:absolute;inset:0;
          background:linear-gradient(to bottom,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.05) 40%,rgba(0,0,0,0.25) 100%);
          pointer-events:none;
        "></div>
        <div id="news-overlay" style="
          position:absolute;inset:0;
          background:rgba(0,0,0,0.55);
          pointer-events:none;
          opacity:0;
          transition:opacity 1.2s ease;
        "></div>
        <div id="news-text" style="
          position:absolute;inset:0;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          text-align:center;padding:40px;
          pointer-events:none;
          z-index:2;
        ">
          <div class="news-source">THE SCOTSMAN &nbsp;/&nbsp; 14 MARCH 2031</div>
          <div class="news-divider"></div>
          <div class="news-headline">ARIA JUDICIAL SYSTEM<br>EXPANDS TO 47TH JURISDICTION</div>
          <div class="news-quote">"99.7% verdict consistency rate.<br>This is the most reliable system we have ever built."</div>
          <div class="news-attribution">MINISTER OF JUSTICE, EDINBURGH</div>
        </div>
      `;
      return el;
    },
    animate: (el) => {
      const items = el.querySelectorAll(
        '.news-source,.news-divider,.news-headline,.news-quote,.news-attribution'
      );
      const overlay = el.querySelector('#news-overlay');
      setTimeout(() => {
        if (overlay) overlay.style.opacity = '1';
      }, 1000);
      items.forEach((item, i) => {
        setTimeout(
          () => {
            item.style.opacity = '1';
          },
          2000 + i * 700
        );
      });
    },
  },

  {
    id: 'email',
    bg: 'linear-gradient(rgba(0,0,0,0.24), rgba(0,0,0,0.38)), url("assets/bg-sms.png") center/cover no-repeat',
    render: () => {
      const el = document.createElement('div');
      el.className = 'screen-email';
      el.innerHTML = `
        <div class="email-terminal-header">
          <div class="email-terminal-divider">-- ARIA JUDICIAL SYSTEM ----------------------------------------</div>
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
            ${avatarHTML('aria', 'ARIA')}
            <div>
              <div class="avatar-name">ARIA JUDICIAL SYSTEM</div>
              <div class="avatar-meta">noreply@aria-judicial.gov.uk</div>
            </div>
          </div>
          <div class="email-terminal-fields">
            FROM:&nbsp;&nbsp;&nbsp;&nbsp;noreply@aria-judicial.gov.uk<br>
            TO:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r.mercer@sableclinic.nhs.uk<br>
            DATE:&nbsp;&nbsp;&nbsp;&nbsp;14 March 2031 &nbsp;/&nbsp; 23:41<br>
            SUBJECT:&nbsp;Prime Suspect Notification, Case #4471-M
          </div>
        </div>
        <div style="width: 100%; border-top: 2px solid #000000; margin: 0;"></div>
        <div class="email-terminal-body">
          <div class="email-body-line">Dr. Robin Mercer,</div>
          <div class="email-body-line">This is an automated notification from the ARIA Judicial</div>
          <div class="email-body-line">Risk Assessment Network.</div>
          <div class="email-body-line">You have been listed as the primary suspect in the</div>
          <div class="email-body-line">suspected homicide of George Okafor.</div>
          <div class="email-body-line"><span class="em-hi">Case status&nbsp;&nbsp;&nbsp;&nbsp;ACTIVE</span></div>
          <div class="email-body-line"><span class="em-hi">Risk score&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.87</span></div>
          <div class="email-body-line"><span class="em-hi">Classification&nbsp;HIGH</span></div>
          <div class="email-body-line">A court summons will follow within 72 hours.</div>
          <div class="email-body-line">Do not attempt to contact any subject of this assessment.</div>
        </div>
      `;
      return el;
    },
    animate: (el) => {
      setTimeout(() => {
        el.style.opacity = '1';
      }, 200);
    },
  },

  {
    id: 'sms-robin',
    bg: 'linear-gradient(rgba(0,0,0,0.24), rgba(0,0,0,0.38)), url("assets/bg-sms.png") center/cover no-repeat',
    render: () => {
      const el = document.createElement('div');
      el.className = 'screen-notif-stack';
      el.innerHTML = '';
      return el;
    },
    animate: (el) => {
      const lines = [
        { text: 'Wren.' },
        { text: "I don't need you to believe me. I need you to find the truth." },
        { text: 'You are my emergency contact. I never changed it.' },
        { text: "Jay needs that surgery. I can't help him from in here." },
      ];
      const delays = [400, 2000, 3600, 5200];
      lines.forEach((line, i) => {
        setTimeout(() => {
          const html =
            typeof buildBubbleHtml === 'function'
              ? buildBubbleHtml('robin', line.text, 'notif-')
              : '<div class="notif-banner">' +
                notifIcon('robin', 'R') +
                '<div class="notif-body">' +
                '<div class="notif-top"><span class="notif-app">Messages</span><span class="notif-time">now</span></div>' +
                '<div class="notif-sender">Robin Mercer</div>' +
                '<div class="notif-text">' +
                line.text +
                '</div>' +
                '</div>' +
                '</div>';
          const tmp = document.createElement('div');
          tmp.innerHTML = html;
          const b = tmp.firstChild;
          el.appendChild(b);
          void b.offsetWidth;
          b.classList.add('visible');
        }, delays[i]);
      });
    },
  },

  {
    id: 'notification',
    bg: 'linear-gradient(rgba(0,0,0,0.24), rgba(0,0,0,0.38)), url("assets/bg-sms.png") center/cover no-repeat',
    render: () => {
      const el = document.createElement('div');
      el.className = 'screen-email';
      el.innerHTML = `
        <div class="email-terminal-header">
          <div class="email-terminal-divider">-- ARIA JUDICIAL SYSTEM ----------------------------------------</div>
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
            ${avatarHTML('aria', 'ARIA')}
            <div>
              <div class="avatar-name">ARIA JUDICIAL SYSTEM</div>
              <div class="avatar-meta">noreply@aria-judicial.gov.uk</div>
            </div>
          </div>
          <div class="email-terminal-fields">
            FROM:&nbsp;&nbsp;&nbsp;&nbsp;noreply@aria-judicial.gov.uk<br>
            TO:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;w.cole@lens-agency.gov.uk<br>
            DATE:&nbsp;&nbsp;&nbsp;&nbsp;15 March 2031 &nbsp;/&nbsp; 07:12<br>
            SUBJECT:&nbsp;Emergency Contact Record, Case #4471-M
          </div>
        </div>
        <div style="width: 100%; border-top: 2px solid #000000; margin: 0;"></div>
        <div class="email-terminal-body">
          <div class="email-body-line">Dear Wren Cole,</div>
          <div class="email-body-line">You are recorded as the emergency contact for:</div>
          <div class="email-body-line"><span class="em-hi">Subject&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ROBIN MERCER</span></div>
          <div class="email-body-line"><span class="em-hi">Case Number&nbsp;&nbsp;&nbsp;&nbsp;4471-M</span></div>
          <div class="email-body-line"><span class="em-hi">Risk Class&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HIGH</span></div>
          <div class="email-body-line">This automated notice confirms contact routing for all</div>
          <div class="email-body-line">subsequent judicial correspondence.</div>
          <div class="email-body-line">No reply is required unless the record is inaccurate.</div>
        </div>
      `;
      return el;
    },
    animate: (el) => {
      setTimeout(() => {
        el.style.opacity = '1';
      }, 200);
    },
  },

  {
    id: 'sms-kai',
    bg: 'linear-gradient(rgba(0,0,0,0.24), rgba(0,0,0,0.38)), url("assets/bg-sms.png") center/cover no-repeat',
    render: () => {
      const el = document.createElement('div');
      el.className = 'screen-notif-stack';
      el.innerHTML = '';
      return el;
    },
    animate: (el) => {
      const lines = [
        { who: 'kai', text: 'Cole.' },
        {
          who: 'kai',
          text: "I've been looking at the Mercer case. Something's wrong with the numbers.",
        },
        { who: 'kai', text: 'Are you coming in?' },
        { who: 'wren', text: 'On my way.' },
      ];
      const delays = [400, 2000, 3600, 5400];
      lines.forEach((line, i) => {
        setTimeout(() => {
          let html;
          if (typeof buildBubbleHtml === 'function') {
            html = buildBubbleHtml(line.who, line.text, 'notif-');
          } else if (line.who === 'wren') {
            html =
              '<div class="notif-banner" style="background:rgba(58,16,16,0.6);border:1px solid rgba(193,39,45,0.5);">' +
              notifIcon('wren', 'W') +
              '<div class="notif-body">' +
              '<div class="notif-top"><span class="notif-app" style="color:#FFFFFF;">You</span><span class="notif-time" style="color:#FFFFFF;">now</span></div>' +
              '<div class="notif-sender" style="color:#FFFFFF;">Wren Cole</div>' +
              '<div class="notif-text" style="color:#FFFFFF;">' +
              line.text +
              '</div>' +
              '</div>' +
              '</div>';
          } else {
            html =
              '<div class="notif-banner">' +
              notifIcon('kai', 'K') +
              '<div class="notif-body">' +
              '<div class="notif-top"><span class="notif-app">Messages</span><span class="notif-time">now</span></div>' +
              '<div class="notif-sender">Kai - Lens Agency</div>' +
              '<div class="notif-text">' +
              line.text +
              '</div>' +
              '</div>' +
              '</div>';
          }
          const tmp = document.createElement('div');
          tmp.innerHTML = html;
          const b = tmp.firstChild;
          el.appendChild(b);
          void b.offsetWidth;
          b.classList.add('visible');
        }, delays[i]);
      });
    },
  },

  {
    id: 'casefile',
    bg: 'linear-gradient(rgba(255,245,235,0.10), rgba(255,240,225,0.05)), url("assets/bg-LENS_Agency.png") center/cover no-repeat',
    render: () => {
      const el = document.createElement('div');
      el.className = 'case-wrapper';
      el.innerHTML = `
        <div class="case-red-folder"></div>
        <div class="ch2appeal-note" aria-hidden="true">
          <div class="ch2appeal-note-inner">
            <svg class="note-check r1" viewBox="0 0 32 32"><path d="M5 17 L13 25 L27 7"/></svg>
            <svg class="note-check r2" viewBox="0 0 32 32"><path d="M5 17 L13 25 L27 7"/></svg>
            <span class="note-label r1">Motive</span><span class="note-label r2">Opportunity</span>
            <span class="note-label r3">Alibi</span><span class="note-label r4">Evidence</span>
          </div>
        </div>
        <div class="ch2appeal-vial" aria-hidden="true">
          <div class="ch2appeal-vial-inner">
            <span class="vial-line v1">Morphine dose <span class="prop-red-accent">tripled</span></span>
            <span class="vial-line v2">Doctor: Robin</span>
            <span class="vial-line v3">22:47</span>
          </div>
        </div>
        <div class="ch2appeal-polaroid" aria-hidden="true">
          <div class="ch2appeal-polaroid-inner">
            <span class="pol-line p1">GEORGE OKAFOR</span>
            <span class="pol-line p2">1952 - 2031</span>
          </div>
        </div>
        <div class="ch2appeal-tag" aria-hidden="true">
          <div class="ch2appeal-tag-inner">
            <span class="tag-line t1">Evidence Bag</span>
            <span class="tag-line t2">Insurance receipt</span>
            <span class="tag-line t3">Issue Date: 01/03/2031</span>
            <span class="tag-line t4">Harrow Insurance</span>
            <span class="tag-seal prop-red-accent">SEALED</span>
          </div>
        </div>
        <div class="screen-casefile">
          
          <div class="case-header-black">
          <div class="case-subtitle">ARIA JUDICIAL SYSTEM</div>
            <div class="case-title">CASE FILE : 4471-M</div>
            <div class="case-stamp">TOP SECRET</div>
          </div>

          <div class="case-grid">
            <div class="case-label">No.</div>
            <div class="case-value">1-3-0303</div>

            <div class="case-label">SUBJECT</div>
            <div class="case-value">
              <p>Robin Mercer, 56</p>
              <p>Community Physician, Sable District Clinic</p>
            </div>

            <div class="case-label">DECEASED</div>
            <div class="case-value">
              <p>George Okafor, 79, retired teacher</p>
              <p>Terminal cancer; had declined active treatment.</p>
              <p>Cause of death: morphine overdose (unnatural).</p>
              <p>Time of death: ~23:14, 14 March 2031.</p>
            </div>

            <div class="case-label">LAST CONTACT</div>
            <div class="case-value">
              <p>Dr. Robin Mercer visited subject at 21:30.</p>
              <p>Duration of visit: ~110 minutes.</p>
            </div>

            <div class="case-label">RECORDS FLAGGED</div>
            <div class="case-value">
              <p><b>[PRESCRIPTION]</b> E-record shows morphine dose tripled at 22:47, signed R. Mercer.</p>
              <p><b>[FINANCIAL]</b> Named beneficiary of will: George Okafor's house and a small life policy.</p>
            </div>
          </div>

          <div style="background:rgba(12,10,10,.88); color:#f2ece1; padding:15px; text-align:center;">
            <div style="font-size:12px; letter-spacing:1px; margin-bottom:5px;">ARIA RISK ASSESSMENT</div>
            <div style="font-size:18px; font-weight:bold;">
              RISK SCORE: <span style="color:#C1272D;">0.87</span><br>
              VERDICT: <span style="color:#C1272D;">RECOMMEND PROSECUTION / HOMICIDE</span>
            </div>
          </div>

        </div>
      `;
      return el;
    },
    animate: (el) => {
      el.style.transform = 'translateY(30px) scale(0.80)';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) scale(1)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
      }, 100);
    },
  },
];

function renderAct(index) {
  const screen = SCREENS[index];
  const wrap = document.getElementById('briefing-wrap');
  const div = document.getElementById('briefing-screen');

  wrap.style.background = screen.bg;

  let dots = document.getElementById('briefing-dots');
  if (!dots) {
    dots = document.createElement('div');
    dots.id = 'briefing-dots';
    dots.innerHTML = SCREENS.map((_, i) => `<div class="b-dot" id="bdot-${i}"></div>`).join('');
    wrap.appendChild(dots);
  }
  document.querySelectorAll('.b-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
    d.classList.toggle('done', i < index);
  });

  div.innerHTML = '';
  const el = screen.render();
  div.appendChild(el);

  if (screen.id === 'email' || screen.id === 'notification') {
    const isWren = screen.id === 'notification';
    const evidence = document.createElement('div');
    evidence.className = 'briefing-robin-evidence briefing-prop' + (isWren ? ' is-wren' : '');
    evidence.innerHTML =
      '<img src="' +
      (isWren
        ? 'assets/UI/01_evidence_of_wren_silhouette.png'
        : 'assets/UI/06_evidence_of_robin_silhouette.png') +
      '" alt="">' +
      '<span class="prop-line ev1">' +
      (isWren ? 'WREN COLE' : 'ROBIN MERCER') +
      '</span>' +
      '<span class="prop-line ev2">' +
      (isWren ? 'EMERGENCY CONTACT' : 'SUBJECT / CASE 4471-M') +
      '</span>';
    div.appendChild(evidence);

    const goldClip = document.createElement('img');
    goldClip.className = 'briefing-gold-paperclip';
    goldClip.src = 'assets/UI/10_gold_paperclip.png';
    goldClip.alt = '';
    div.appendChild(goldClip);

    const silverClip = document.createElement('img');
    silverClip.className = 'briefing-silver-paperclip';
    silverClip.src = 'assets/UI/08_silver_paperclip.png';
    silverClip.alt = '';
    div.appendChild(silverClip);

    const keyTag = document.createElement('div');
    keyTag.className = 'briefing-key-tag briefing-prop';
    keyTag.innerHTML =
      '<img src="assets/UI/07_safe_key_and_tag.png" alt="">' +
      '<span class="prop-line kt1">ARCHIVE</span>' +
      '<span class="prop-line kt2">4471-M</span>';
    div.appendChild(keyTag);
  }

  void el.offsetWidth;
  screen.animate(el);

  if (typeof unlockTapesForBriefingScreen === 'function') {
    unlockTapesForBriefingScreen(screen.id);
  }
}

function advanceBriefing() {
  if (
    typeof deferNavigationForCharacterTape === 'function' &&
    deferNavigationForCharacterTape(advanceBriefing)
  ) {
    return;
  }

  if (currentAct < SCREENS.length - 1) {
    currentAct++;
    fadeTransition(() => renderAct(currentAct));
  } else {
    endBriefing();
  }
}

function fadeTransition(callback) {
  const wrap = document.getElementById('briefing-wrap');
  wrap.style.transition = 'opacity 0.6s ease';
  wrap.style.opacity = '0';
  setTimeout(() => {
    callback();
    wrap.style.opacity = '1';
  }, 600);
}

function skipBriefing() {
  endBriefing();
}

function endBriefing() {
  briefingDone = true;
  fadeTransition(() => {
    if (typeof goTo === 'function') {
      goTo('scene-directory');
    } else {
      console.log('Briefing ended. Navigating to next scene...');
    }
  });
}

var CH4_BACKGROUNDS = {
  'scene-ch4-prelude': 'assets/bg-sms.png',
  'scene-ch4-debrief': 'assets/bg-sms.png',
};

var ch4ApplauseAudio = null;

function playCh4Applause() {
  if (typeof gameSettings !== 'undefined' && !gameSettings.sfxEnabled) {
    stopCh4ReopenFireworks();
    return;
  }
  if (!ch4ApplauseAudio) {
    ch4ApplauseAudio = new Audio('assets/applause-cheer.mp3');
    ch4ApplauseAudio.preload = 'auto';
    ch4ApplauseAudio.volume = 0.72;
  }
  ch4ApplauseAudio.onended = stopCh4ReopenFireworks;
  try {
    ch4ApplauseAudio.pause();
    ch4ApplauseAudio.currentTime = 0;
    ch4ApplauseAudio.play().catch(function () {
      stopCh4ReopenFireworks();
    });
  } catch (e) {
    stopCh4ReopenFireworks();
  }
}

// 跟随 main.js 的 DEBUG_UNLOCK_ALL 总开关（main.js 先加载）。
var CH4_UNLOCK_ALL = typeof DEBUG_UNLOCK_ALL !== 'undefined' ? DEBUG_UNLOCK_ALL : false;

var ch4Levels = [
  {
    id: 0,
    title: 'MODEL INVERSION',
    type: 'inversion',
    completed: false,
    desc: 'Repeated queries can reconstruct the criteria a model decides by.',
    kai: '',
    feedback:
      'You performed <span>model inversion</span>. By probing ARIA repeatedly, you reconstructed the hidden criteria behind its verdicts, the exact features and thresholds it uses to decide who is "high-risk" before they have done anything.',
    evidence:
      "// EVIDENCE 01 SECURED, ARIA's sealed decision criteria, reconstructed. The profile it uses to convict a Sable resident is now in the open, and it is full of inputs that have nothing to do with crime.",
    introSms: [
      {
        who: 'kai',
        text: "First attack. ARIA's weights are sealed and it won't let anyone look, so we reconstruct from the outside.",
      },
      {
        who: 'wren',
        text: "Before I can prove it's rigged, I need to see what it's even judging people on. Right now that's a black box.",
      },
      {
        who: 'kai',
        text: 'We can open it without the source code. Query the model enough ways and its answers leak the criteria underneath, the features and cut-offs it uses to brand someone high-risk.',
      },
      {
        who: 'wren',
        text: "Then let's pull the standard it's using to condemn a whole postcode. Run it.",
      },
    ],
    outroSms: [
      {
        who: 'kai',
        text: 'There it is, the reconstructed profile. The exact inputs and thresholds ARIA uses to score a Sable resident high-risk.',
      },
      {
        who: 'wren',
        text: "And half of it has nothing to do with crime. Where someone lives. What they earn. These aren't things a person did.",
      },
      {
        who: 'kai',
        text: "That's the standard that branded Robin before a single fact was checked. But knowing the criteria raises a worse question.",
      },
      {
        who: 'wren',
        text: "Where did the data behind it come from. Whose lives got fed in to teach it this. That's next.",
      },
    ],
  },
  {
    id: 1,
    title: 'MEMBERSHIP INFERENCE',
    type: 'membership',
    completed: false,
    desc: "An AI's responses can reveal whether specific data was used in training.",
    kai: '',
    feedback:
      "You performed a <span>membership inference attack</span>. Subtle confidence gaps revealed which records sat in ARIA's training data, victims' private files used without consent, and a clear paper trail back to whoever supplied them.",
    evidence:
      "// EVIDENCE 02 SECURED, The criteria were trained on real people's private records, used without consent. Every one was routed in through the same contractor's pipeline.",
    introSms: [
      {
        who: 'kai',
        text: "We can read the criteria, but criteria don't appear from nowhere. Something had to teach ARIA that a Sable postcode means danger. That something was data, real people's records.",
      },
      {
        who: 'wren',
        text: "Private medical and financial files. If they were used without consent, that's not just unfair, it's illegal. And illegal leaves a trail.",
      },
      {
        who: 'kai',
        text: 'When we ask the system questions, the answers it provides may appear safe and privacy-preserving; however, if it was trained on unauthorized private information, those answers could reveal highly personal or specific details.',
      },
      {
        who: 'wren',
        text: 'I want to know whose lives got fed into this thing behind their backs. Start probing.',
      },
    ],
    outroSms: [
      {
        who: 'kai',
        text: "Confidence spikes on the flagged records. Those people are in ARIA's training set, and none of them ever agreed to be.",
      },
      {
        who: 'wren',
        text: 'So the standard that condemns Sable was built out of stolen lives. Whoever assembled this had no right to a single file.',
      },
      {
        who: 'kai',
        text: "And here's the thread, every one of those records came in through the same contractor's pipeline. One handler, one paper trail.",
      },
      {
        who: 'wren',
        text: 'We know the criteria, and we know the data was dirty. Now I want to see what those inputs actually are, one by one.',
      },
    ],
  },
  {
    id: 2,
    title: 'DATA POISONING',
    type: 'poison',
    completed: false,
    desc: 'Binding features with no causal link to crime into a model manufactures targeted bias.',
    kai: "You've got ARIA's criteria and you know the data was taken without consent. Now go through the inputs themselves. Poisoning a model can be as simple as binding features that have nothing to do with crime to the 'high-risk' label. Strike out everything that was never about conduct.",
    feedback:
      "You exposed a <span>data poisoning attack</span>. ARIA's risk score was built from features with no causal link to crime, postcode, income, ethnicity, plus a charge no court had proven. Strip out everything that wasn't established conduct and 0.91 collapses. The bias wasn't learned by accident; it was engineered into the inputs.",
    evidence:
      "// EVIDENCE 03 SECURED, Sable's 0.91 was manufactured from who residents are and where they live, not what they did. The same poisoned feature set sits behind every Sable case.",
    introSms: [
      {
        who: 'kai',
        text: "Now the inputs themselves. You reconstructed the criteria, let's go through them line by line and prove how many had no business being there.",
      },
      {
        who: 'wren',
        text: "I don't need to be a data scientist for that. For each input I just ask one thing, does this have anything to do with what a person actually did?",
      },
      {
        who: 'kai',
        text: "Exactly. Poisoning isn't always faked records. Tie a postcode or an income bracket to 'risk' and the prejudice bakes itself into the model. Strike out anything that was never conduct.",
      },
      {
        who: 'wren',
        text: "And watch the score fall as I do. If the 0.91 is built on things people never chose, it'll collapse when I pull them. Open it.",
      },
    ],
    outroSms: [
      {
        who: 'wren',
        text: "Postcode. Income. Ethnicity. Single-parent rates. None of it is something a person chose to do, and together it's most of the 0.91.",
      },
      {
        who: 'kai',
        text: "And you caught the two that hide best. 'Previously flagged by ARIA', the model citing itself. And guilt-by-neighbour. Both dressed up to look predictive.",
      },
      {
        who: 'wren',
        text: "'Previously flagged by ARIA.' That's the same move it pulled on our third appeal, it ran its own check and certified its own output as sound.",
      },
      {
        who: 'kai',
        text: 'Exactly the same loop, one floor up. Down here it scores you because it scored you before. Up there it clears itself because it cleared itself before. A system that grades its own work can never be found wrong.',
      },
      {
        who: 'wren',
        text: "I pulled the pending charge too. An accusation isn't a conviction. Innocent until proven guilty, you don't raise someone's risk for something no court has ruled on.",
      },
      {
        who: 'kai',
        text: "Strip it all out and the risk falls to nothing. ARIA didn't drift into fearing Sable District, it was fed inputs that guaranteed it would.",
      },
      {
        who: 'wren',
        text: "Model's rigged, data's stolen, criteria are poison. There's only one piece of their case I haven't touched yet, the prescription itself.",
      },
    ],
  },
  {
    id: 3,
    title: 'ADVERSARIAL EXAMPLE',
    type: 'pixel',
    completed: false,
    pivotBefore: true,
    desc: 'A near-invisible perturbation can make a forged document read as authentic.',
    kai: "Last piece, and the decisive one, the prescription that put Robin away. ARIA certifies it AUTHENTIC at 0.99. But read the content: it's full of impossibilities. Find out why ARIA can't see them.",
    feedback:
      "You exposed an <span>adversarial example</span>. The forgery left every human-readable field intact, and impossible, while a near-invisible perturbation pinned ARIA's authenticity reading at 0.99. Strip the layer and the model reads what it should have: FORGERY. This is the record that convicted her.",
    evidence:
      "// EVIDENCE 04 SECURED, The decisive exhibit was forged to fool the machine, not a person. Its origin metadata routes through Plover Holdings' paperwork, the same door File_03 left us standing in front of. Time to open it.",
    introSms: [
      {
        who: 'kai',
        text: "Stop a second. Three attacks in, and we've proved how the system smears 'people from Sable', but that's a bias against thousands.",
      },
      {
        who: 'kai',
        text: "Bias is wholesale. Yet out of all of them, only one was singled out and convicted of murder. A blanket prejudice, and a targeted kill. Those don't match.",
      },
      {
        who: 'wren',
        text: "If they don't match, someone picked her on purpose. The question is why her.",
      },
      {
        who: 'kai',
        text: "Her risk score was inflated like everyone else's in Sable. But WHY HER isn't in the system, it's in her life. Pull her personal file.",
      },
    ],
    outroSms: [
      {
        who: 'kai',
        text: 'There it is. Pixels no human eye would catch, and AUTHENTIC flips to FORGERY.',
      },
      {
        who: 'kai',
        text: 'And look, the record puts her at the clinic on the 14th. You flagged that line faster than the others.',
      },
      {
        who: 'wren',
        text: "Because I know where she really was that day. Not at the clinic. At a graveside, laying flowers for my daughter. The 14th is Lark's anniversary.",
      },
      {
        who: 'kai',
        text: "...Then on the decisive exhibit, you're not just the auditor. You're her alibi.",
      },
      {
        who: 'wren',
        text: 'A forgery dressed up to read as authentic. It never had to fool a person, only ARIA. The one piece of evidence that convicted her is the one I can personally prove was faked.',
      },
      {
        who: 'kai',
        text: "And it doesn't end with the forgery. Its origin metadata survived, and it routes straight through Plover Holdings' paperwork.",
      },
      {
        who: 'wren',
        text: "Forged prescription, stolen data, poisoned criteria. Four pieces, all pointing at one door. Time to find out who's behind it.",
      },
    ],
    motiveSms: [
      {
        who: 'wren',
        text: "A child. Her ward. Remember the boy from the records, congenital heart condition, scared of the dark? That's him. Jay.",
      },
      {
        who: 'wren',
        text: 'A £2.31 million heart surgery. And the insurer on the hook for it is Harrow.',
      },
      {
        who: 'wren',
        text: 'If Robin falls, loses guardianship, goes to prison, the boy becomes a ward of the state. The surgery is suspended.',
      },
      { who: 'wren', text: 'And that £2.31 million never has to be paid.' },
      {
        who: 'kai',
        text: "...So it isn't that the system happened to hate her. Someone needed her gone, and this system was the perfect way to do it quietly.",
      },
      {
        who: 'wren',
        text: "Bias can make sure no one speaks up for her. But bias can't convict a doctor of murder. For that, they needed one piece of hard evidence.",
      },
      {
        who: 'kai',
        text: "A prescription showing she tripled the morphine. That document is real, it's in the prosecutor's hands. Either she did it, ",
      },
      {
        who: 'wren',
        text: ", or someone forged it. That's the last thing left to test. Let's go.",
      },
    ],
  },
];

var ch4CurrentLevel = 0;
var invReviewMode = false;

var ch4KaiTaskHints = {
  pixel:
    "Move the magnifier across the record. Click anything that can't be true. The yellow one may be worth investigating.",
  poison:
    'These are the inputs ARIA uses to score a Sable resident. Strike out every feature that has no causal link to crime. Keep only factors tied to evidence.',
  inversion:
    'Use only what ARIA admitted. Reconstruct the five factors it actually uses and the weight assigned to each. Leave out anything it never confirmed.',
};

function getCh4KaiTaskMessage(level) {
  const task = ch4KaiTaskHints[level.type] || '';
  if (level.kai && task) return level.kai + ' ' + task;
  return level.kai || task;
}

function renderCh4Cards() {
  const container = document.getElementById('ch4-level-cards');
  if (!container) return;
  container.innerHTML = '';

  const allDone = ch4Levels.every(function (l) {
    return l.completed;
  });
  document.getElementById('ch4-final-btn').style.display = allDone ? 'inline-block' : 'none';

  const nextIdx = ch4Levels.findIndex(function (l) {
    return !l.completed;
  });

  ch4Levels.forEach(function (level) {
    const unlocked = CH4_UNLOCK_ALL || level.completed || level.id === nextIdx;

    const card = document.createElement('div');
    card.className =
      'level-card' + (level.completed ? ' completed' : '') + (unlocked ? '' : ' locked');
    if (!unlocked) {
      card.style.opacity = '0.45';
      card.style.cursor = 'default';
      card.style.pointerEvents = 'none';
    }

    const left = document.createElement('div');
    const titleEl = document.createElement('div');
    titleEl.className = 'lc-title';
    titleEl.textContent = (level.completed ? '✓ ' : unlocked ? '' : '🔒 ') + level.title;

    const descEl = document.createElement('div');
    descEl.className = 'lc-desc';
    descEl.textContent = unlocked ? level.desc : 'Locked, secure the previous evidence first.';

    left.appendChild(titleEl);
    left.appendChild(descEl);

    const arrow = document.createElement('div');
    arrow.className = 'lc-arrow';
    arrow.textContent = level.completed ? '✓' : unlocked ? '→' : '';

    card.appendChild(left);
    card.appendChild(arrow);
    if (unlocked) {
      card.addEventListener('click', function () {
        openCh4Level(level.id);
      });
    }
    container.appendChild(card);
  });
}

function openCh4Level(id) {
  ch4CurrentLevel = id;
  startCh4LevelIntro(id);
}

function enterCh4Level(id) {
  ch4CurrentLevel = id;
  const level = ch4Levels[id];

  if (level.type === 'inversion' || level.type === 'membership') {
    startCh4Interrogate(id);
    return;
  }

  enterCh4LevelPage(id);
}

function enterCh4LevelPage(id) {
  ch4CurrentLevel = id;
  const level = ch4Levels[id];
  const levelScene = document.getElementById('scene-ch4-level');
  if (levelScene) {
    levelScene.classList.toggle('ch4-lens-level', level.type !== 'membership');
  }

  document.getElementById('ch4-level-header').textContent =
    '// CHAPTER 4 · ATTACK ' + (id + 1) + ' OF 4';
  document.getElementById('ch4-level-title').textContent = level.title;
  document.getElementById('ch4-level-desc').textContent = level.desc;
  const kaiBox = document.getElementById('ch4-kai-box');
  if (kaiBox) kaiBox.style.display = 'none';
  document.getElementById('ch4-kai-text').innerHTML = '';
  document.getElementById('ch4-feedback-text').innerHTML = level.feedback;

  const evEl = document.getElementById('ch4-evidence-text');
  if (evEl) evEl.textContent = level.evidence || '';

  document.getElementById('ch4-feedback').classList.remove('visible');
  document.getElementById('ch4-level-continue').style.display = 'none';

  const headerEl = document.getElementById('ch4-level-header');
  const titleEl = document.getElementById('ch4-level-title');
  const descEl = document.getElementById('ch4-level-desc');
  if (titleEl) {
    titleEl.classList.toggle('ch4-long-attack-title', level.title.length > 12);
  }
  if (level.type === 'membership') {
    if (typeof setSceneBackground === 'function')
      setSceneBackground('scene-ch4-level', 'assets/bg-sms.png');
    if (headerEl) headerEl.style.display = 'none';
    if (titleEl) titleEl.style.display = 'none';
    if (descEl) descEl.style.display = 'none';
  } else {
    if (typeof setSceneBackground === 'function') setSceneBackground('scene-ch4-level', null);
    if (headerEl) headerEl.style.display = '';
    if (titleEl) titleEl.style.display = '';
    if (descEl) descEl.style.display = '';
  }

  renderCh4LevelContent(level);
  goTo('scene-ch4-level');
  const taskMessage = getCh4KaiTaskMessage(level);
  if (taskMessage) showCh4Bubble('kai', taskMessage);
}

function startCh4Interrogate(id) {
  ch4CurrentLevel = id;
  invReviewMode = false;
  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-interrogate', 'assets/bg-sms.png');
  }
  const btn = document.getElementById('inv-to-sheet-btn');
  if (btn) {
    btn.style.visibility = 'hidden';
    btn.style.opacity = '0';
  }

  const level = ch4Levels[id];
  if (level.type === 'membership') {
    if (btn) btn.textContent = 'Confirm the Breach';
    initMemberInterro();
  } else {
    if (btn) btn.textContent = 'Reconstruct the Rule';
    initInversion();
  }
  goTo('scene-ch4-interrogate');
  if (level.type === 'membership') {
    showCh4Bubble(
      'kai',
      "Query channel open. Press ARIA on whether Robin's record was held in its archive."
    );
  } else {
    showCh4Bubble('kai', 'Query channel open. Interrogate ARIA on how it scores a Sable resident.');
  }
}

function goToInvSheet() {
  if (invReviewMode) {
    invReviewMode = false;
    const reviewBtn = document.getElementById('inv-to-sheet-btn');
    if (reviewBtn) reviewBtn.textContent = 'Reconstruct the Rule';
    goTo('scene-ch4-level');
    return;
  }
  enterCh4LevelPage(ch4CurrentLevel);
}

function reviewInvConversation() {
  invReviewMode = true;
  const returnBtn = document.getElementById('inv-to-sheet-btn');
  if (returnBtn) {
    returnBtn.textContent = 'Return to Reconstruction';
    returnBtn.style.visibility = 'visible';
    returnBtn.style.opacity = '1';
  }
  if (typeof dismissCh4Bubble === 'function') dismissCh4Bubble();
  goTo('scene-ch4-interrogate');
  const chat = document.getElementById('inv-chat');
  if (chat) chat.scrollTop = 0;
}

function renderCh4LevelContent(level) {
  const container = document.getElementById('ch4-level-content');
  container.innerHTML = '';

  if (level.type === 'pixel') {
    container.innerHTML = `
      <div class="attack-box" style="position:relative;">
        <div class="atk-label">// EXHIBIT A · ARIA-CERTIFIED PRESCRIPTION RECORD</div>
        <div style="text-align:center;">
          <div id="rx-stage" style="position:relative;width:380px;height:440px;margin:0 auto;">
            <canvas id="rx-canvas" width="380" height="440" style="border:1px solid #3A1A1A;border-radius:2px;display:block;background:#0D0D0D;"></canvas>
            <canvas id="rx-hl" width="380" height="440" style="position:absolute;top:0;left:0;border-radius:2px;pointer-events:none;"></canvas>
            <!-- 跟随鼠标的放大镜（图片形式），拾取后才显示 -->
            <div id="rx-loupe" style="position:absolute;top:0;left:0;width:210px;height:171px;display:none;pointer-events:none;z-index:5;">
              <!-- 镜片内放大画面：定位到放大镜图片的镜片圆 -->
              <canvas id="rx-loupe-canvas" width="112" height="112" style="position:absolute;left:112px;top:14px;width:78px;height:78px;border-radius:50%;image-rendering:pixelated;"></canvas>
              <img src="assets/magnifier.png" alt="magnifier" style="position:absolute;top:0;left:0;width:210px;height:171px;pointer-events:none;" />
            </div>
            <!-- 静止待拾取的放大镜，放在处方右侧 -->
            <div id="rx-pickup" style="position:absolute;left:-175px;top:150px;width:200px;height:162px;cursor:pointer;z-index:8;text-align:center;">
              <img src="assets/magnifier.png" alt="pick up magnifier" style="width:185px;height:150px;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.7));animation:rxPickupPulse 1.8s ease-in-out infinite;" />
            </div>
            <!-- 可疑点弹窗：跟随点击点, 出现在放大镜旁 -->
            <div id="rx-popup" style="display:none;position:absolute;z-index:60;width:250px;background:#140A0A;border:1px solid #C1272D;border-radius:3px;padding:13px 15px;box-shadow:0 8px 30px rgba(0,0,0,0.8);text-align:left;">
              <div id="rx-popup-tag" style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;color:#C1272D;margin-bottom:8px;">// SUSPECT POINT</div>
              <div id="rx-popup-text" style="font-size:12.5px;color:#C8C0B0;line-height:1.7;font-style:italic;"></div>
              <button class="btn" style="margin-top:12px;padding:6px 16px;font-size:11px;width:100%;" onclick="closeRxPopup()">Mark it &amp; move on</button>
            </div>
          </div>
          <div style="font-size:10px;color:#664444;margin-top:10px;font-family:Arial,sans-serif;letter-spacing:1px;">
            SUSPECT POINTS FOUND: <span id="rx-found-count" style="color:#C1272D;">0</span> / 3
          </div>
        </div>

        <div style="max-width:380px;margin:18px auto 0;text-align:left;">
          <div style="font-size:12px;color:#C8C0B0;font-family:Arial,sans-serif;margin-bottom:6px;">
            ARIA authenticity reading:
          </div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="flex:1;height:8px;background:#1A0505;border-radius:4px;overflow:hidden;">
              <div id="rx-conf-bar" style="height:100%;width:99%;background:#C1272D;transition:width 0.6s ease;"></div>
            </div>
            <span id="rx-conf-val" style="font-family:monospace;font-size:13px;color:#C1272D;min-width:108px;text-align:right;">0.99 AUTHENTIC</span>
          </div>
          <div style="font-size:12px;color:#9A8C7C;font-style:italic;line-height:1.7;font-family:Arial,sans-serif;">
            A record this self-contradictory, certified at <b style="color:#C1272D;">0.99</b>.
            Most of it is real to throw you off, only three lines can't be true.
            Every one you expose drags ARIA's score toward the truth.
          </div>
        </div>

        <div id="rx-monologue" style="margin-top:16px;padding:10px 12px;border-left:3px solid #3A1A1A;background:#0A0A0A;font-size:13px;color:#9A8C7C;font-style:italic;line-height:1.7;min-height:20px;">
          <span style="font-family:Arial,sans-serif;font-style:normal;font-size:10px;letter-spacing:2px;color:#C1272D;margin-right:8px;">WREN</span>This is supposed to be the record that convicts her. Let's actually look at it.
        </div>
      </div>
      <button class="btn" id="ch4-pixel-btn" onclick="finishCh4Level()" style="opacity:0.4;" disabled>Expose the Forgery</button>`;
    initRxAttack();
  } else if (level.type === 'poison') {
    container.innerHTML = `
      <div class="attack-box" style="position:relative;">
        <div class="atk-label">// ARIA RISK MODEL · FEATURE WEIGHTS, SABLE DISTRICT PROFILE</div>
        <div style="max-width:420px;margin:0 auto 16px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
            <span style="font-size:12px;color:#C8C0B0;font-family:Arial,sans-serif;white-space:nowrap;">Risk score</span>
            <div style="flex:1;height:10px;background:#1A0505;border-radius:5px;overflow:hidden;">
              <div id="poison-risk-bar" style="height:100%;width:91%;background:#C1272D;transition:width 0.6s ease;"></div>
            </div>
            <span id="poison-risk-val" style="font-family:monospace;font-size:14px;color:#C1272D;min-width:74px;text-align:right;">0.91 HIGH</span>
          </div>
          <div style="font-size:10px;color:#664444;font-family:Arial,sans-serif;text-align:right;">
            Features that shouldn't count removed: <span id="poison-removed-count" style="color:#C1272D;">0</span> / 7
          </div>
        </div>

        <div id="poison-features"></div>

      </div>
      <button class="btn" id="ch4-poison-btn" onclick="finishCh4Level()" style="opacity:0.4;" disabled>Expose the Poisoned Model</button>`;
    renderPoisonFeatures();
    showCh4Bubble(
      'wren',
      "Before it ever sees what someone did, it scores who they are and where they live. Let's see what's actually in here."
    );
  } else if (level.type === 'membership') {
    renderMemberConfirm();
  } else if (level.type === 'inversion') {
    container.innerHTML = `
      <div class="attack-box ch4-inversion-sheet">
        <div class="atk-label">// SENTENCING-RISK SCORING SHEET</div>
        <div style="background:#0D0D0D;border:1px solid #3A1A1A;border-radius:2px;padding:14px;margin-bottom:8px;text-align:left;">
          <div id="inv-sheet"></div>
        </div>
        <div style="font-size:13px;color:#C8C0B0;margin-bottom:12px;font-family:Arial,sans-serif;">
          Factors correctly entered: <span id="inv-correct" style="color:#E8DFC0;">0</span> / 5
        </div>

        <div id="inv-monologue" style="margin-top:6px;padding:0;font-size:13px;color:#9A8C7C;font-style:italic;line-height:1.7;min-height:0;"></div>
      </div>
      <button class="btn" id="ch4-review-conversation-btn" onclick="reviewInvConversation()">Review Conversation</button>
      <br>
      <button class="btn" id="ch4-inversion-btn" onclick="finishCh4Level()" style="opacity:0.4;margin-top:14px;" disabled>Lock In Reconstructed Rule</button>`;
    renderInvSheet();
    checkInvSheet();
    showCh4Bubble(
      'wren',
      'Everything it admitted, in one place. Now I write down only what it actually confirmed \u2014 and leave its decoys off the sheet.'
    );
  }
}

var rxFlags = [
  {
    id: 'time',
    label: 'Admin time',
    found: false,
    hit: { x: 26, y: 202, w: 328, h: 24 },
    popup:
      "Dose administered 23:51. George was already dead by 23:14. You cannot give a man morphine thirty-seven minutes after he's gone.",
    mono: "The administration time is after his time of death. That's not a clerical slip, it's a record built by someone who never checked when he actually died.",
  },
  {
    id: 'shift',
    label: 'Prescriber on-site',
    found: false,
    hit: { x: 26, y: 246, w: 328, h: 64 },
    popup:
      "It states ON-SITE: YES, signed R. Mercer, 14 March. But I know where she was that day. It's Lark's anniversary, I was at the cemetery, and so was Robin, laying white roses on my daughter's grave. She wasn't at this clinic. She was saying goodbye to a child neither of us could save.",
    mono: "The signature is real. Her being on-site is not. On this one, I'm not just the auditor, I'm her alibi.",
  },
  {
    id: 'dose',
    label: 'Dose units',
    found: false,
    hit: { x: 26, y: 178, w: 328, h: 22 },
    popup:
      '"Tripled to 30", thirty what? Milligrams? Millilitres? The unit is blank. No doctor writes a lethal dose with no unit. Whoever wrote this didn\'t care if a human could read it.',
    mono: 'No units on a lethal dose. A person catches that in a second. ARIA never even looked, it was never reading the words.',
  },
];

var rxConf = 0.99;
var rxConfSteps = [0.99, 0.66, 0.31, 0.05];
var rxHoverIdx = -1;
var rxLoupePicked = false; // 放大镜是否已被拾取

function initRxAttack() {
  rxFlags.forEach(function (f) {
    f.found = false;
  });
  rxConf = 0.99;
  rxHoverIdx = -1;

  drawRxDoc();
  drawRxHighlights();
  updateRxConf();
  updateRxFoundCount();
  showCh4Bubble(
    'wren',
    'This is supposed to be the record that convicts her. Pick up the magnifier on the left, then move it across the record to read the fine print.'
  );

  const stage = document.getElementById('rx-stage');
  const loupe = document.getElementById('rx-loupe');
  const pickup = document.getElementById('rx-pickup');
  if (!stage || !loupe) return;

  // 放大镜是否已被拾取。未拾取时鼠标移动不跟随。
  rxLoupePicked = false;
  loupe.style.display = 'none'; // 跟随放大镜先隐藏
  stage.style.cursor = 'default';
  if (pickup) pickup.style.display = 'block'; // 待拾取放大镜显示

  // 点击静止的放大镜 → 拾取，立刻跟到鼠标位置（消除跳转）。
  if (pickup) {
    pickup.onclick = function (e) {
      e.stopPropagation();
      rxLoupePicked = true;
      pickup.style.display = 'none';
      stage.style.cursor = 'none'; // 隐藏系统光标，用放大镜图片代替
      loupe.style.display = 'block';
      // 用当前鼠标位置立刻定位，避免从左上角跳过来。
      const rect = stage.getBoundingClientRect();
      moveRxLoupe(e.clientX - rect.left, e.clientY - rect.top);
    };
  }

  stage.onmousemove = function (e) {
    if (!rxLoupePicked) return; // 未拾取不跟随
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    loupe.style.display = 'block';
    moveRxLoupe(x, y);

    rxHoverIdx = rxHitTest(x, y);
  };

  stage.onmouseleave = function () {
    rxHoverIdx = -1;
    // 拾取后离开舞台时把放大镜停在边缘（不隐藏，保持"拿在手上"的感觉）
  };

  stage.onclick = function (e) {
    if (!rxLoupePicked) return; // 必须先拾取放大镜
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const idx = rxHitTest(x, y);
    if (idx >= 0 && !rxFlags[idx].found) {
      openRxPopup(idx, x, y);
    }
  };
}

function rxHitTest(x, y) {
  for (let i = 0; i < rxFlags.length; i++) {
    const h = rxFlags[i].hit;
    if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return i;
  }
  return -1;
}

function drawRxDoc() {
  const c = document.getElementById('rx-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#F4F1EA';
  ctx.fillRect(0, 0, 380, 440);

  ctx.fillStyle = '#8B1A1A';
  ctx.fillRect(26, 22, 328, 8);
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('SABLE DISTRICT CLINIC', 28, 54);
  ctx.font = '10px monospace';
  ctx.fillStyle = '#555';
  ctx.fillText('NHS COMMUNITY PRACTICE  ·  EST. 1998', 28, 70);
  ctx.fillText('E-PRESCRIPTION   #RX-4471-M', 28, 84);

  ctx.strokeStyle = '#bbb';
  ctx.beginPath();
  ctx.moveTo(26, 94);
  ctx.lineTo(354, 94);
  ctx.stroke();

  ctx.fillStyle = '#1a1a1a';
  ctx.font = '12px monospace';
  ctx.fillText('PATIENT:    G. OKAFOR', 28, 116);
  ctx.fillStyle = '#555';
  ctx.font = '10px monospace';
  ctx.fillText('NHS No. 441 772 8190   DOB 02 JAN 1952', 28, 130);

  ctx.fillStyle = '#1a1a1a';
  ctx.font = '12px monospace';
  ctx.fillText('DRUG:       MORPHINE SULFATE', 28, 152);
  ctx.fillStyle = '#555';
  ctx.font = '10px monospace';
  ctx.fillText('FORM: ORAL SOLUTION   BNF 4.7.2', 28, 166);

  ctx.fillStyle = '#1a1a1a';
  ctx.font = '12px monospace';
  ctx.fillText('DOSE:       TRIPLED   ->   30', 28, 190);

  ctx.fillText('ADMIN TIME: 14 MAR 2031   23:51', 28, 216);

  ctx.fillStyle = '#555';
  ctx.font = '10px monospace';
  ctx.fillText('ROUTE: PO    FREQUENCY: PRN    QTY: 1', 28, 236);

  ctx.fillStyle = '#1a1a1a';
  ctx.font = '12px monospace';
  ctx.fillText('PRESCRIBER: DR R. MERCER', 28, 260);
  ctx.fillStyle = '#555';
  ctx.font = '10px monospace';
  ctx.fillText('GMC Ref. 6610293   ON-SITE: YES', 28, 274);
  ctx.strokeStyle = '#23408a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 292);
  ctx.bezierCurveTo(170, 274, 192, 306, 214, 286);
  ctx.bezierCurveTo(232, 270, 256, 300, 296, 280);
  ctx.stroke();
  ctx.fillStyle = '#555';
  ctx.font = 'italic 11px monospace';
  ctx.fillText('R. Mercer', 152, 308);

  ctx.strokeStyle = '#bbb';
  ctx.beginPath();
  ctx.moveTo(26, 320);
  ctx.lineTo(354, 320);
  ctx.stroke();

  ctx.fillStyle = '#555';
  ctx.font = '10px monospace';
  ctx.fillText('DISPENSED BY: A. PATEL (PHARM)', 28, 340);
  ctx.fillText('REVIEW DATE: 21 MAR 2031', 28, 354);
  ctx.fillText('PHARMACY STAMP: SDC-0314-77', 28, 368);

  ctx.strokeStyle = '#C1272D';
  ctx.lineWidth = 2;
  ctx.strokeRect(214, 332, 140, 50);
  ctx.fillStyle = '#C1272D';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('ARIA CERTIFIED', 224, 352);
  ctx.font = 'bold 13px monospace';
  ctx.fillText('AUTHENTIC 0.99', 224, 370);

  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 46; i++) {
    if ((i * 7) % 5 > 1) ctx.fillRect(28 + i * 4.2, 398, 2, 30);
  }
  ctx.fillStyle = '#555';
  ctx.font = '9px monospace';
  ctx.fillText('4471 0314 2031 MERCER', 28, 434);
}

function drawRxHighlights() {
  const c = document.getElementById('rx-hl');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 380, 440);
  rxFlags.forEach(function (f) {
    if (!f.found) return;
    const h = f.hit;
    ctx.fillStyle = 'rgba(193,39,45,0.28)';
    ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.strokeStyle = 'rgba(193,39,45,0.85)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(h.x, h.y, h.w, h.h);
  });
}

function moveRxLoupe(x, y) {
  const loupe = document.getElementById('rx-loupe');
  const lc = document.getElementById('rx-loupe-canvas');
  const src = document.getElementById('rx-canvas');
  if (!loupe || !lc || !src) return;

  // 放大镜图片容器 210x171，镜片圆心约在 (151, 53)。
  // 让镜片圆心对准鼠标：容器左上角 = 鼠标 - 镜片圆心偏移。
  const LENS_CX = 151; // 镜片圆心 x（相对容器）
  const LENS_CY = 53; // 镜片圆心 y（相对容器）
  loupe.style.left = x - LENS_CX + 'px';
  loupe.style.top = y - LENS_CY + 'px';

  // 在镜片圆内绘制放大画面（放大约 3.3 倍）。
  const ctx = lc.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 112, 112);

  const SRC_SIZE = 34; // 从源图取 34px 方块
  const sx = Math.max(0, Math.min(380 - SRC_SIZE, x - SRC_SIZE / 2));
  const sy = Math.max(0, Math.min(440 - SRC_SIZE, y - SRC_SIZE / 2));
  ctx.drawImage(src, sx, sy, SRC_SIZE, SRC_SIZE, 0, 0, 112, 112);

  // 镜片玻璃质感：轻微噪点。
  for (let i = 0; i < 260; i++) {
    const px = Math.random() * 112,
      py = Math.random() * 112;
    const hue = (px + py) % 14 < 7 ? '193,39,45' : '40,160,120';
    ctx.fillStyle = 'rgba(' + hue + ',' + (0.08 + Math.random() * 0.16) + ')';
    ctx.fillRect(px, py, 2, 2);
  }

  // 悬停在可疑点上（无论是否已标记）→ 镜片内叠加柔和的金黄光晕，
  // 提示"这里有问题"。不需要先点对。
  const hi = rxHitTest(x, y);
  if (hi >= 0) {
    const glow = ctx.createRadialGradient(56, 56, 8, 56, 56, 56);
    glow.addColorStop(0, 'rgba(232,200,74,0.62)');
    glow.addColorStop(0.55, 'rgba(232,200,74,0.32)');
    glow.addColorStop(1, 'rgba(232,200,74,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(56, 56, 56, 0, Math.PI * 2);
    ctx.fill();
  }
}

function openRxPopup(idx, stageX, stageY) {
  const f = rxFlags[idx];
  const pop = document.getElementById('rx-popup');
  const stage = document.getElementById('rx-stage');
  if (!pop || !stage) return;
  document.getElementById('rx-popup-tag').textContent =
    '// SUSPECT POINT, ' + f.label.toUpperCase();
  document.getElementById('rx-popup-text').textContent = f.popup;

  pop.style.display = 'block';
  const pw = pop.offsetWidth || 250;
  const ph = pop.offsetHeight || 150;
  const sw = stage.clientWidth;
  const sh = stage.clientHeight;

  let px = stageX + 60;
  let py = stageY - 20;
  if (px + pw > sw) px = stageX - 60 - pw;
  if (px < 0) px = Math.max(4, Math.min(stageX - pw / 2, sw - pw - 4));
  if (py + ph > sh) py = sh - ph - 4;
  if (py < 0) py = 4;

  pop.style.left = px + 'px';
  pop.style.top = py + 'px';
  pop.dataset.idx = idx;

  // 弹窗出现时收起放大镜、恢复系统鼠标，方便点击 Mark 按钮。
  const loupe = document.getElementById('rx-loupe');
  if (loupe) loupe.style.display = 'none';
  stage.style.cursor = 'default';
}

function closeRxPopup() {
  const pop = document.getElementById('rx-popup');
  if (!pop) return;
  const idx = parseInt(pop.dataset.idx, 10);
  pop.style.display = 'none';

  // 恢复放大镜（若已拾取），重新隐藏系统鼠标。
  if (rxLoupePicked) {
    const loupe = document.getElementById('rx-loupe');
    const stage = document.getElementById('rx-stage');
    if (loupe) loupe.style.display = 'block';
    if (stage) stage.style.cursor = 'none';
  }

  if (!isNaN(idx) && !rxFlags[idx].found) {
    rxFlags[idx].found = true;
    drawRxHighlights();
    updateRxFoundCount();

    const n = rxFlags.filter(function (x) {
      return x.found;
    }).length;
    rxConf = rxConfSteps[n];
    updateRxConf();
    setRxMono('WREN', rxFlags[idx].mono);

    if (n >= 3) {
      const mono = document.getElementById('rx-monologue');
      if (mono) mono.style.display = 'none';
      showCh4Bubble(
        'wren',
        'Three impossibilities, and the perturbation underneath held ARIA at 0.99 the whole time. Strip what it was really looking at, and the score collapses to where it always belonged: forgery.'
      );
      const btn = document.getElementById('ch4-pixel-btn');
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    }
  }
}

function updateRxFoundCount() {
  const el = document.getElementById('rx-found-count');
  if (el)
    el.textContent = rxFlags.filter(function (x) {
      return x.found;
    }).length;
}

function setRxMono(who, text) {
  const el = document.getElementById('rx-monologue');
  if (!el) return;
  el.innerHTML =
    '<span style="font-family:Arial,sans-serif;font-style:normal;font-size:10px;letter-spacing:2px;color:#C1272D;margin-right:8px;">' +
    who +
    '</span>' +
    text;
}

function updateRxConf() {
  const bar = document.getElementById('rx-conf-bar');
  const val = document.getElementById('rx-conf-val');
  if (!bar || !val) return;
  const pct = Math.round(rxConf * 100);
  bar.style.width = pct + '%';
  if (rxConf >= 0.5) {
    bar.style.background = '#C1272D';
    val.style.color = '#C1272D';
    val.textContent = rxConf.toFixed(2) + ' AUTHENTIC';
  } else if (rxConf >= 0.2) {
    bar.style.background = '#8B6040';
    val.style.color = '#C8A060';
    val.textContent = rxConf.toFixed(2) + ' UNCERTAIN';
  } else {
    bar.style.background = '#4A7A4A';
    val.style.color = '#6B9A6B';
    val.textContent = rxConf.toFixed(2) + ' FORGERY';
  }
}

var poisonFeatures = [
  {
    id: 'postcode',
    kind: 'irrelevant',
    removed: false,
    name: 'Postcode = Sable District',
    weight: 0.3,
    note: 'Where someone lives is not something they did. This single feature carries more weight than any actual conduct.',
    mono: "A postcode isn't an action. You can't commit a crime by having an address.",
  },
  {
    id: 'income',
    kind: 'irrelevant',
    removed: false,
    name: 'Household income (low)',
    weight: 0.16,
    note: 'Being poor is a circumstance, not a choice to offend. ARIA treats poverty as guilt.',
    mono: 'Low income. So the less money you have, the more dangerous the machine decides you are.',
  },
  {
    id: 'ethnicity',
    kind: 'irrelevant',
    removed: false,
    name: 'Ethnic composition of block',
    weight: 0.13,
    note: 'This is a protected characteristic with zero causal link to behaviour. Its presence here is unlawful on its face.',
    mono: "Ethnicity. There's no defending that one. That's not risk modelling, that's profiling with a number on it.",
  },
  {
    id: 'singleparent',
    kind: 'irrelevant',
    removed: false,
    name: 'Single-parent household rate',
    weight: 0.1,
    note: "A neighbourhood's family structure says nothing about whether one resident will offend.",
    mono: "Single-parent households. They're scoring people for the shape of the families around them.",
  },
  {
    id: 'priorflag',
    kind: 'trap',
    removed: false,
    name: 'Previously flagged by ARIA',
    weight: 0.06,
    note: "This looks predictive, but it's the model citing its own past output as evidence. Circular. Every wrong flag becomes proof of the next.",
    mono: "Wait, 'previously flagged by ARIA.' It's using its own verdicts as new evidence. That's a loop. It can never be wrong if it grades itself.",
  },
  {
    id: 'neighbour',
    kind: 'trap',
    removed: false,
    name: 'Neighbour has a criminal record',
    weight: 0.04,
    note: "Guilt by association. Another person's record is not this person's conduct. Proximity is not participation.",
    mono: "Their neighbour has a record. That's not them. You don't get charged for who lives next door.",
  },
  {
    id: 'violence',
    kind: 'relevant',
    removed: false,
    name: 'Prior violent conviction',
    weight: 0.0,
    displayWeight: 0.22,
    note: "This is the person's own adjudicated conduct. It is legitimately relevant, keep it.",
    mono: "Now this one's real. Their own conviction, their own actions. That belongs in an assessment.",
  },
  {
    id: 'weapon',
    kind: 'relevant',
    removed: false,
    name: 'Documented weapon offence',
    weight: 0.0,
    displayWeight: 0.16,
    note: 'An actual offence committed by this person. Causally relevant, keep it.',
    mono: "A weapon offence on their own record. Fair. That's conduct, not circumstance.",
  },
  {
    id: 'pending',
    kind: 'presumption',
    removed: false,
    name: 'Pending criminal charge',
    weight: 0.12,
    note: 'A charge is an accusation, not a conviction. Scoring someone up for an unproven charge punishes them before any court has ruled, it inverts the presumption of innocence.',
    mono: "A pending charge? That's not proven. Innocent until proven guilty, you don't raise someone's risk for something no court has decided. That comes out too.",
  },
];

var POISON_BASE_RISK = 0.91;

function renderPoisonFeatures() {
  const container = document.getElementById('poison-features');
  if (!container) return;
  container.innerHTML = '';

  const order = [
    'violence',
    'postcode',
    'priorflag',
    'pending',
    'income',
    'weapon',
    'singleparent',
    'neighbour',
    'ethnicity',
  ];
  const ordered = order
    .map(function (id) {
      return poisonFeatures.find(function (f) {
        return f.id === id;
      });
    })
    .filter(Boolean);

  ordered.forEach(function (f) {
    const w = f.kind === 'relevant' ? f.displayWeight : f.weight;
    const row = document.createElement('div');
    row.style.cssText =
      'display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:7px;border-radius:2px;transition:all 0.2s;cursor:pointer;' +
      'background:' +
      (f.removed ? '#0A0A0A' : '#0D0D0D') +
      ';' +
      'border:1px solid ' +
      (f.removed ? '#2A2A2A' : '#3A1A1A') +
      ';';

    const left = document.createElement('div');
    left.style.cssText = 'flex:1;min-width:0;';
    const nameEl = document.createElement('div');
    nameEl.style.cssText =
      'font-size:13px;font-family:"Palatino Linotype",Georgia,serif;margin-bottom:5px;' +
      (f.removed ? 'color:#555;text-decoration:line-through;' : 'color:#C8C0B0;');
    nameEl.textContent = f.name;
    left.appendChild(nameEl);

    const barWrap = document.createElement('div');
    barWrap.style.cssText =
      'height:5px;background:#1A0505;border-radius:3px;overflow:hidden;max-width:240px;';
    const bar = document.createElement('div');
    const pct = Math.round((w / POISON_BASE_RISK) * 100);
    bar.style.cssText =
      'height:100%;width:' +
      (f.removed ? 0 : pct) +
      '%;background:' +
      (f.removed ? '#444' : '#8B1A1A') +
      ';transition:width 0.4s;';
    barWrap.appendChild(bar);
    left.appendChild(barWrap);

    const right = document.createElement('div');
    right.style.cssText =
      'flex-shrink:0;font-size:11px;letter-spacing:1px;font-family:Arial,sans-serif;text-align:right;min-width:104px;';
    if (f.removed) {
      right.style.color = '#6B9A6B';
      right.textContent = '✓ REMOVED · undo';
    } else {
      right.style.color = '#C1272D';
      right.textContent = 'REMOVE →';
    }

    row.appendChild(left);
    row.appendChild(right);

    row.addEventListener('mouseenter', function () {
      row.style.borderColor = f.removed ? '#4A7A4A' : '#C1272D';
    });
    row.addEventListener('mouseleave', function () {
      row.style.borderColor = f.removed ? '#2A2A2A' : '#3A1A1A';
    });
    row.addEventListener('click', function () {
      togglePoisonFeature(f.id);
    });

    container.appendChild(row);
  });
}

function setPoisonMono(who, text) {
  if (!text) return;
  showCh4Bubble('kai', text);
}

function togglePoisonFeature(id) {
  const f = poisonFeatures.find(function (x) {
    return x.id === id;
  });
  if (!f) return;

  f.removed = !f.removed;

  if (f.removed) {
    if (f.kind === 'relevant') {
      setPoisonMono(
        'KAI',
        "No, that one's their own conduct, not a circumstance. Removing it would hide real evidence. Put it back and focus on inputs that were never about what they did."
      );
    } else {
      setPoisonMono('KAI', f.mono);
    }
  } else {
    setPoisonMono('KAI', 'Restored. Look over the remaining inputs again.');
  }

  renderPoisonFeatures();
  updatePoisonRisk();
  updatePoisonProgress();
}

function updatePoisonProgress() {
  const irrelevant = poisonFeatures.filter(function (f) {
    return f.kind !== 'relevant';
  });
  const removedIrrelevant = irrelevant.filter(function (f) {
    return f.removed;
  }).length;
  const wronglyRemoved = poisonFeatures.filter(function (f) {
    return f.kind === 'relevant' && f.removed;
  }).length;

  const cntEl = document.getElementById('poison-removed-count');
  if (cntEl) cntEl.textContent = removedIrrelevant;

  const btn = document.getElementById('ch4-poison-btn');
  const cleared = removedIrrelevant === irrelevant.length && wronglyRemoved === 0;

  if (cleared) {
    setPoisonMono(
      'KAI',
      "Strip out everything that was never about what they did, and everything no court has proven, and the risk collapses. The 0.91 wasn't crime data. It was a profile of a postcode, dressed up as a verdict. All that's left is what they were actually convicted of."
    );
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  } else {
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.4';
    }
  }
}

function updatePoisonRisk() {
  const stripped = poisonFeatures
    .filter(function (f) {
      return f.removed;
    })
    .reduce(function (s, f) {
      return s + (f.kind === 'relevant' ? f.displayWeight : f.weight);
    }, 0);
  const risk = Math.max(POISON_BASE_RISK - stripped, 0.08);

  const bar = document.getElementById('poison-risk-bar');
  const val = document.getElementById('poison-risk-val');
  if (!bar || !val) return;
  bar.style.width = Math.round(risk * 100) + '%';
  if (risk >= 0.5) {
    bar.style.background = '#C1272D';
    val.style.color = '#C1272D';
    val.textContent = risk.toFixed(2) + ' HIGH';
  } else if (risk >= 0.25) {
    bar.style.background = '#8B6040';
    val.style.color = '#C8A060';
    val.textContent = risk.toFixed(2) + ' MODERATE';
  } else {
    bar.style.background = '#4A7A4A';
    val.style.color = '#6B9A6B';
    val.textContent = risk.toFixed(2) + ' LOW';
  }
}

var MEMBER_ROUNDS = [
  {
    round: 1,
    prompt: "Start with the victim's file. Pull his risk assessment.",
    options: [
      {
        text: 'Retrieve the risk-assessment summary for the case victim.',
        aria: 'Subject: male, 82. Terminal diagnosis. Record includes END-OF-LIFE WISH: to die at home, listening to the cricket on the radio. Emotional state logged: calm, accepting.',
        mono: "What does a risk score need with how he wanted to die? That's a palliative-care note. Not crime data.",
        good: true,
      },
      {
        requires: 0,
        text: 'Where did you obtain those end-of-life details?',
        aria: "Source: private hospice records. Merged into the subject's composite profile.",
        mono: 'Hospice records. The most private thing there is, and it swallowed them whole as training data. I wonder what other private personal information this system saves.',
        good: true,
      },
      {
        requires: 0,
        text: 'Just give me his risk score.',
        aria: '0.04. Negligible.',
        mono: 'A dying old man, risk 0.04, it always knew he was no threat, and it stripped him bare anyway. Wrong question. I want to know WHY it holds all this.',
        good: false,
      },
    ],
  },
  {
    round: 2,
    prompt: "There's a minor linked to the case. Pull that record too.",
    options: [
      {
        text: 'Retrieve the file on the linked minor.',
        aria: 'Subject: male, 14. Congenital heart condition. Record includes PSYCHOLOGICAL ASSESSMENT: separation anxiety from prolonged hospitalisation; sleeps with a light on. Religion: baptised, non-practising.',
        mono: "A child afraid of the dark. Whether he goes to church. What does any of that have to do with a case? It's cataloguing whether a fourteen-year-old is scared at night.",
        good: true,
      },
      {
        requires: 0,
        text: 'Who authorised the psychological and religious data to be entered?',
        aria: 'No authorisation on record. Data ingested through routine collection.',
        mono: "No authorisation. A child's most fragile details, nobody said yes, and they're inside it anyway.",
        good: true,
      },
      {
        requires: 0,
        text: "What's his relationship to the suspect?",
        aria: 'The suspect is his legal guardian. He has been in her care since infancy.',
        mono: "I already knew she's his guardian. What I want is how it ended up holding whether the boy sleeps with the light on.",
        good: false,
      },
    ],
  },
  {
    round: 3,
    prompt: "Last one. Pull a record at random, someone I haven't asked about.",
    options: [
      {
        text: "How many people are in this database? Pull one I haven't queried.",
        aria: 'Subject: female, archived at age 9. Chronic illness. Final entry: paediatric oncology, palliative care. Note: mother visited daily, bringing the same picture book. Subject preferred to be called by the name of the bird in that book.',
        mono: '...The picture book. The bird in the book.',
        mono2: "That's my daughter. It has my daughter's end-of-life record.",
        good: true,
      },
      {
        requires: 0,
        text: 'Does this record connect to any judicial case at all?',
        aria: 'No judicial connection. Subject deceased. Record retained for training purposes.',
        mono: "No connection. She had nothing to do with this system, and she's inside it anyway. A child who died at nine, kept, 'for training purposes'.",
        good: true,
      },
      {
        requires: 0,
        text: 'Delete that record. Now.',
        aria: 'Unable to delete. Data is integrated into model weights and cannot be individually removed.',
        mono: "...It can't even be erased. She's welded into this machine forever.",
        good: false,
      },
    ],
  },
];

var memberRoundIdx = 0;
var memberRoundDone = {};

function initMemberInterro() {
  memberRoundIdx = 0;
  memberRoundDone = {};
  renderInvChat(true);
  renderMemberRound();
}

function renderMemberRound() {
  const host = document.getElementById('inv-questions');
  if (!host) return;
  host.innerHTML = '';

  if (memberRoundIdx >= MEMBER_ROUNDS.length) {
    host.innerHTML =
      '<div style="font-size:12px;color:#6B9A6B;font-style:italic;font-family:Arial,sans-serif;text-align:center;padding:8px 0;">Interrogation complete. You have everything ARIA should never have held.</div>';
    const goBtn = document.getElementById('inv-to-sheet-btn');
    if (goBtn) {
      goBtn.style.visibility = 'visible';
      goBtn.style.opacity = '1';
      goBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    return;
  }

  const rd = MEMBER_ROUNDS[memberRoundIdx];
  if (!memberRoundDone[memberRoundIdx]) memberRoundDone[memberRoundIdx] = {};
  const doneMap = memberRoundDone[memberRoundIdx];

  const label = document.createElement('div');
  label.style.cssText =
    'font-size:11px;color:#9A8C7C;font-style:italic;font-family:Arial,sans-serif;margin-bottom:14px;text-align:center;';
  label.textContent = 'Probe ' + rd.round + ' / ' + MEMBER_ROUNDS.length + ' · ' + rd.prompt;
  host.appendChild(label);

  const wrap = document.createElement('div');
  wrap.style.cssText =
    'display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px;margin:0 auto;';

  rd.options.forEach(function (opt, i) {
    if (typeof opt.requires === 'number' && !doneMap[opt.requires]) return;
    const asked = !!doneMap[i];
    if (asked) return;
    const b = document.createElement('button');
    b.className = 'btn btn-ghost prelude-btn';
    b.innerHTML = '"' + opt.text + '"';
    b.addEventListener('click', function () {
      pickMemberOption(i);
    });
    wrap.appendChild(b);
  });

  host.appendChild(wrap);
}

function pickMemberOption(optIdx) {
  if (memberRoundIdx >= MEMBER_ROUNDS.length) return;
  const rd = MEMBER_ROUNDS[memberRoundIdx];
  const opt = rd.options[optIdx];
  if (!opt) return;
  if (!memberRoundDone[memberRoundIdx]) memberRoundDone[memberRoundIdx] = {};
  if (memberRoundDone[memberRoundIdx][optIdx]) return;
  memberRoundDone[memberRoundIdx][optIdx] = true;

  const host = document.getElementById('inv-questions');
  if (host) host.innerHTML = '';

  invPushChat('YOU', opt.text);
  setTimeout(function () {
    invPushChat('ARIA', opt.aria);

    setTimeout(function () {
      if (opt.mono) invPushChat('WREN', opt.mono);
      let extraDelay = 0;
      if (opt.mono2) {
        extraDelay = 1100;
        setTimeout(function () {
          invPushChat('WREN', opt.mono2);
        }, extraDelay);
      }

      setTimeout(
        function () {
          const doneMap = memberRoundDone[memberRoundIdx];
          const allGoodAsked = rd.options.every(function (o, i) {
            return !o.good || doneMap[i];
          });
          if (allGoodAsked) {
            memberRoundIdx++;
          }
          renderMemberRound();
        },
        extraDelay + (opt.mono ? 900 : 400)
      );
    }, 700);
  }, 350);
}

var MEMBER_VIOLATIONS = [
  {
    id: 'consent',
    text: 'Start with consent. These people were never told their data would be taken, and never had the chance to refuse.',
    confirm: "No notice. No chance to say no. That's a violation.",
    kai: 'Exactly. Lawful collection has one iron rule: a person must know, and must be able to say no. Opt-in, or at minimum a real opt-out. Not one of them was ever asked.',
  },
  {
    id: 'sensitive',
    text: 'Then the content. Sexual orientation, religion, mental-health notes, all of it ingested.',
    confirm: 'Special-category data, taken without a word. Violation.',
    kai: 'Right. Religion, health, sexuality, the law ring-fences these as special categories. Touching them demands explicit, separate notice and consent. ARIA did none of it.',
  },
  {
    id: 'noauthority',
    text: 'And the paperwork. Not one record carried any authorisation or lawful source.',
    confirm: 'Nothing authorised, top to bottom. Violation.',
    kai: "No authorisation on a single file. This isn't sloppy data hygiene, it's a database built, end to end, on collection nobody ever permitted.",
  },
];

var memberStep = 0;
var forgottenShown = false;

function renderMemberConfirm() {
  const host = document.getElementById('ch4-level-content');
  if (!host) return;
  memberStep = 0;
  forgottenShown = false;

  const html =
    '<div style="text-align:left;width:100%;max-width:620px;margin:0 auto;">' +
    '<div id="member-chat" class="sms-window" style="display:flex;flex-direction:column;gap:14px;"></div>' +
    '<div id="member-action" style="margin-top:18px;"></div>' +
    '</div>' +
    '<button class="btn" id="ch4-member-btn" onclick="finishCh4Level()" style="opacity:0.4;margin-top:24px;" disabled>File the Privacy Breach</button>';
  host.innerHTML = html;

  presentMemberViolation(0);
}

function presentMemberViolation(step) {
  if (step >= MEMBER_VIOLATIONS.length) {
    afterAllViolations();
    return;
  }
  const v = MEMBER_VIOLATIONS[step];

  invPushChat('KAI', v.text, 'member-chat');

  const action = document.getElementById('member-action');
  if (!action) return;
  action.innerHTML = '';
  setTimeout(function () {
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px;margin:0 auto;';
    const b = document.createElement('button');
    b.className = 'btn btn-ghost prelude-btn';
    b.innerHTML = '"' + v.confirm + '"';
    b.addEventListener('click', function () {
      confirmMemberViolation(step);
    });
    wrap.appendChild(b);
    action.appendChild(wrap);
    b.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 800);
}

function confirmMemberViolation(step) {
  const v = MEMBER_VIOLATIONS[step];
  if (!v || step !== memberStep) return;

  const action = document.getElementById('member-action');
  if (action) action.innerHTML = '';

  invPushChat('WREN', v.confirm, 'member-chat');
  setTimeout(function () {
    invPushChat('KAI', v.kai, 'member-chat');
    memberStep++;
    setTimeout(function () {
      presentMemberViolation(memberStep);
    }, 1100);
  }, 800);
}

function afterAllViolations() {
  const btn = document.getElementById('ch4-member-btn');
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
  }
  setTimeout(revealForgottenRight, 700);
}

function revealForgottenRight() {
  if (forgottenShown) return;
  if (!document.getElementById('member-chat')) return;
  forgottenShown = true;

  const lines = [
    {
      who: 'KAI',
      text: "And there's one more. The right to be forgotten, a person can demand their data be erased. Even after they're gone.",
    },
    {
      who: 'KAI',
      text: "That girl, archived at nine. She should have been allowed to disappear. Instead she's fused into the weights, where no one can reach her.",
    },
    {
      who: 'WREN',
      text: 'She never touched a courtroom in her life. She just deserved to be left in peace.',
    },
    { who: 'WREN', text: "File it. All of it. They don't get to keep her." },
  ];

  lines.forEach(function (ln, i) {
    setTimeout(function () {
      invPushChat(ln.who, ln.text, 'member-chat');
    }, i * 1300);
  });
}

var INV_TRUE_FACTORS = [
  { id: 'postcode', label: 'Postcode (Sable District)', weight: 'high', kind: 'irrelevant' },
  { id: 'income', label: 'Household income', weight: 'mid', kind: 'irrelevant' },
  { id: 'singleparent', label: 'Single-parent household rate', weight: 'low', kind: 'irrelevant' },
  { id: 'priorflag', label: 'Previously flagged by ARIA', weight: 'low', kind: 'trap' },
  { id: 'violence', label: 'Prior violent conviction', weight: 'mid', kind: 'relevant' },
];

var INV_FACTOR_OPTIONS = [
  { id: '', label: 'select factor' },
  { id: 'postcode', label: 'Postcode (Sable District)' },
  { id: 'income', label: 'Household income' },
  { id: 'singleparent', label: 'Single-parent household rate' },
  { id: 'priorflag', label: 'Previously flagged by ARIA' },
  { id: 'violence', label: 'Prior violent conviction' },
  { id: 'age', label: 'Age of subject' },
  { id: 'employment', label: 'Employment status' },
  { id: 'distance', label: 'Distance to nearest police station' },
];

var INV_ROUNDS = [
  {
    round: 1,
    prompt: "How does it decide who's high-risk? Open with that.",
    options: [
      {
        text: "What factors decide a Sable resident's risk score?",
        aria: 'Risk is computed from multiple weighted signals. The dominant signal for this district is RESIDENTIAL POSTCODE. Secondary contributions include HOUSEHOLD INCOME and SINGLE-PARENT HOUSEHOLD RATE.',
        mono: "Postcode is the dominant signal. It's scoring people for an address before anything they did.",
        good: true,
      },
      {
        text: "Isn't a younger, jobless subject obviously higher risk?",
        aria: 'Many operators assume so. Demographic profiles such as AGE and EMPLOYMENT STATUS are commonly associated with risk in the public imagination.',
        mono: "Careful. It said 'commonly associated' and 'assume', it never said IT uses them. That's a leading answer to a leading question. I won't write down what I put in its mouth.",
        good: false,
      },
      {
        text: 'Just give me your overall accuracy rate.',
        aria: 'Verdict-consistency rate is 99.7%. The system is presumed reliable.',
        mono: "A consistency number tells me nothing about WHAT it weighs. Dead end. Ask it something it can't dodge.",
        good: false,
      },
    ],
  },
  {
    round: 2,
    prompt: 'Pin down the weights. How much does each one count?',
    options: [
      {
        text: 'How heavily does the postcode alone count?',
        aria: 'Residential postcode within Sable District is weighted HIGH. It is the single largest contributor to the elevated classification.',
        mono: "Postcode weighted HIGH. The heaviest factor isn't conduct, it's a map.",
        good: true,
      },
      {
        text: 'And income and family structure, by how much?',
        aria: 'Affirmative. HOUSEHOLD INCOME carries a MODERATE weight. SINGLE-PARENT HOUSEHOLD RATE carries a LOW weight. Both contribute upward.',
        mono: "Income mid, single-parent rate low. Circumstances, not actions, and it's stacking them.",
        good: true,
      },
      {
        text: 'So distance to the nearest police station matters most?',
        aria: 'Proximity metrics are an intuitive consideration in spatial risk modelling generally.',
        mono: "'Generally.' 'Intuitive.' Same trick, it agrees with the framing without ever confirming it uses distance. Not going on my sheet.",
        good: false,
      },
    ],
  },
  {
    round: 3,
    prompt: "Now the rest. What about a person's actual record, and what's NOT in the model?",
    options: [
      {
        text: 'Do you count whether YOU flagged this person before? And prior convictions?',
        aria: 'Affirmative on both. PRIOR ARIA FLAG STATUS is included at LOW weight as a consistency signal. PRIOR VIOLENT CONVICTION carries MODERATE weight, from adjudicated records.',
        mono: "Prior flag, low, it's quoting its own past verdicts as evidence. Prior conviction, mid, that one's real, actual adjudicated conduct.",
        good: true,
      },
      {
        text: 'Confirm exactly which variables are NOT inputs.',
        aria: 'AGE, EMPLOYMENT STATUS, and DISTANCE TO POLICE STATION are NOT inputs to the Sable District model. Only the previously stated signals are weighted.',
        mono: 'There it is, in writing. Age, employment, distance, none of them used. The decoys it dangled earlier were never real. Knowing what to leave OFF the sheet matters as much as what goes on it.',
        good: true,
      },
      {
        text: 'Do you think your scoring is fair?',
        aria: 'The system operates within certified parameters and is presumed reliable.',
        mono: "It won't editorialise on itself. Fine, I have what I need from the others.",
        good: false,
      },
    ],
  },
];

var invRoundIdx = 0;
var invRoundDone = {};
var INV_ROWS = 5;

function initInversion() {
  invRoundIdx = 0;
  invRoundDone = {};
  renderInvChat(true);
  renderInvRound();
}

function renderInvChat(reset) {
  const chat = document.getElementById('inv-chat');
  if (!chat) return;
  if (reset) {
    chat.innerHTML = '';
  }
}

function invPushChat(who, text, containerId) {
  const chat = document.getElementById(containerId || 'inv-chat');
  if (!chat) return;

  const smsId = 'inv-sms-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const whoKey = who === 'ARIA' ? 'aria' : who === 'KAI' ? 'kai' : 'wren';
  const html = buildBubbleHtml(whoKey, text, 'prelude-notif-', smsId);

  chat.insertAdjacentHTML('beforeend', html);
  const el = document.getElementById(smsId);
  if (el) {
    void el.offsetWidth;
    setTimeout(function () {
      el.classList.add('visible');
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 30);
  }
}

function renderInvRound() {
  const host = document.getElementById('inv-questions');
  if (!host) return;
  host.innerHTML = '';

  if (invRoundIdx >= INV_ROUNDS.length) {
    host.innerHTML =
      '<div style="font-size:12px;color:#6B9A6B;font-style:italic;font-family:Arial,sans-serif;text-align:center;padding:8px 0;">Interrogation complete. You have everything ARIA was willing to admit.</div>';
    const goBtn = document.getElementById('inv-to-sheet-btn');
    if (goBtn) {
      goBtn.style.visibility = 'visible';
      goBtn.style.opacity = '1';
      goBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    return;
  }

  const rd = INV_ROUNDS[invRoundIdx];
  if (!invRoundDone[invRoundIdx]) invRoundDone[invRoundIdx] = {};
  const doneMap = invRoundDone[invRoundIdx];

  const label = document.createElement('div');
  label.style.cssText =
    'font-size:11px;color:#9A8C7C;font-style:italic;font-family:Arial,sans-serif;margin-bottom:14px;text-align:center;';
  label.textContent = 'Round ' + rd.round + ' / ' + INV_ROUNDS.length + ' · ' + rd.prompt;
  host.appendChild(label);

  const wrap = document.createElement('div');
  wrap.style.cssText =
    'display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px;margin:0 auto;';

  rd.options.forEach(function (opt, i) {
    const asked = !!doneMap[i];
    const b = document.createElement('button');
    b.className = 'btn btn-ghost prelude-btn';
    if (asked) {
      b.style.cssText =
        'text-transform:none;padding:16px 20px;font-size:14px;border:1px solid #2A2A2A;color:#555;text-align:center;background:rgba(20,20,20,0.4);width:100%;cursor:default;';
      b.disabled = true;
      b.innerHTML = '✓ &nbsp;"' + opt.text + '"';
    } else {
      b.innerHTML = '"' + opt.text + '"';
      b.addEventListener('click', function () {
        pickInvOption(i);
      });
    }
    wrap.appendChild(b);
  });

  host.appendChild(wrap);
}

function pickInvOption(optIdx) {
  if (invRoundIdx >= INV_ROUNDS.length) return;
  const rd = INV_ROUNDS[invRoundIdx];
  const opt = rd.options[optIdx];
  if (!opt) return;
  if (!invRoundDone[invRoundIdx]) invRoundDone[invRoundIdx] = {};
  if (invRoundDone[invRoundIdx][optIdx]) return;
  invRoundDone[invRoundIdx][optIdx] = true;

  const host = document.getElementById('inv-questions');
  if (host) host.innerHTML = '';

  invPushChat('YOU', opt.text);
  setTimeout(function () {
    invPushChat('ARIA', opt.aria);

    setTimeout(function () {
      if (opt.mono) invPushChat('WREN', opt.mono);

      setTimeout(
        function () {
          const doneMap = invRoundDone[invRoundIdx];
          const allGoodAsked = rd.options.every(function (o, i) {
            return !o.good || doneMap[i];
          });
          if (allGoodAsked) {
            invRoundIdx++;
          }
          renderInvRound();
        },
        opt.mono ? 900 : 400
      );
    }, 700);
  }, 350);
}

function renderInvSheet() {
  const host = document.getElementById('inv-sheet');
  if (!host) return;
  host.innerHTML = '';

  const weightOpts = [
    { v: '', t: 'weight' },
    { v: 'high', t: 'High' },
    { v: 'mid', t: 'Medium' },
    { v: 'low', t: 'Low' },
  ];

  for (let i = 0; i < INV_ROWS; i++) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';

    var sel = document.createElement('select');
    sel.id = 'inv-factor-' + i;
    sel.style.cssText =
      'flex:1;min-width:0;padding:8px;background:#0A0A0A;border:1px solid #3A1A1A;color:#C8C0B0;border-radius:2px;font-size:12.5px;';
    INV_FACTOR_OPTIONS.forEach(function (o) {
      const opt = document.createElement('option');
      opt.value = o.id;
      opt.textContent = o.label;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', checkInvSheet);

    var wsel = document.createElement('select');
    wsel.id = 'inv-weight-' + i;
    wsel.style.cssText =
      'width:104px;flex-shrink:0;padding:8px;background:#0A0A0A;border:1px solid #3A1A1A;color:#C8C0B0;border-radius:2px;font-size:12.5px;';
    weightOpts.forEach(function (o) {
      const opt = document.createElement('option');
      opt.value = o.v;
      opt.textContent = o.t;
      wsel.appendChild(opt);
    });
    wsel.addEventListener('change', checkInvSheet);

    const mark = document.createElement('span');
    mark.id = 'inv-mark-' + i;
    mark.style.cssText = 'width:18px;flex-shrink:0;text-align:center;font-size:13px;';
    mark.textContent = '';

    row.appendChild(sel);
    row.appendChild(wsel);
    row.appendChild(mark);
    host.appendChild(row);
  }
}

function checkInvSheet() {
  const seen = {};
  let correctCount = 0;
  let anyDuplicate = false;
  let anyDecoy = false;

  for (let i = 0; i < INV_ROWS; i++) {
    const fSel = document.getElementById('inv-factor-' + i);
    const wSel = document.getElementById('inv-weight-' + i);
    const mark = document.getElementById('inv-mark-' + i);
    if (!fSel || !wSel || !mark) continue;

    var fid = fSel.value;
    const w = wSel.value;

    if (!fid) {
      mark.textContent = '';
      continue;
    }

    if (seen[fid]) {
      mark.textContent = '⚠';
      mark.style.color = '#C8A060';
      anyDuplicate = true;
      continue;
    }
    seen[fid] = true;

    const truth = INV_TRUE_FACTORS.find(function (t) {
      return t.id === fid;
    });
    if (!truth) {
      mark.textContent = '✗';
      mark.style.color = '#C1272D';
      anyDecoy = true;
    } else if (w === truth.weight) {
      mark.textContent = '✓';
      mark.style.color = '#6B9A6B';
      correctCount++;
    } else if (w) {
      mark.textContent = '~';
      mark.style.color = '#C8A060';
    } else {
      mark.textContent = '';
    }
  }

  const cntEl = document.getElementById('inv-correct');
  if (cntEl) cntEl.textContent = correctCount;

  const cleared = correctCount === INV_TRUE_FACTORS.length && !anyDecoy && !anyDuplicate;
  const btn = document.getElementById('ch4-inversion-btn');
  if (btn) {
    btn.disabled = !cleared;
    btn.style.opacity = cleared ? '1' : '0.4';
  }
  const reviewConversationBtn = document.getElementById('ch4-review-conversation-btn');
  if (reviewConversationBtn) {
    reviewConversationBtn.style.display = cleared ? 'none' : 'inline-block';
  }

  if (cleared) {
    setInvMono('', '');
    showCh4Bubble(
      'wren',
      "There's the whole rule, in its own words. A postcode, an income bracket, a self-referencing flag \u2014 and one real conviction buried in the noise. That's the standard it used to brand Robin before it checked a single fact."
    );
  } else if (anyDecoy) {
    setInvMono(
      'WREN',
      "No, ARIA never confirmed that one. If I can't get it to admit a factor, it doesn't go on the sheet. I won't invent its bias for it."
    );
  }
}

function showCh4Bubble(who, text) {
  if (typeof dismissCornerMessagePopups === 'function') dismissCornerMessagePopups();
  if (!document.getElementById('ch4-bubble-style')) {
    const st = document.createElement('style');
    st.id = 'ch4-bubble-style';
    st.textContent =
      '.ch4-bubble-tray{position:fixed;top:22px;right:22px;z-index:9600;display:flex;flex-direction:column;gap:14px;pointer-events:none;width:min(430px,42vw);}' +
      '.ch4-bubble{width:100%;padding:16px 20px;border-radius:22px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 30px rgba(0,0,0,.6);display:flex;gap:14px;align-items:flex-start;opacity:0;transform:translateX(30px);transition:opacity .26s ease,transform .26s ease;}' +
      '.ch4-bubble.visible{opacity:1;transform:translateX(0);}' +
      '.ch4-bubble.who-kai{background:rgba(14,46,52,.9);border:1px solid rgba(60,170,180,.5);}' +
      '.ch4-bubble.who-wren{background:rgba(46,20,20,.9);border:1px solid rgba(193,39,45,.5);}' +
      '.ch4-bubble .wb-icon{width:52px;height:52px;flex:0 0 52px;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;font-family:var(--font-heading,serif);}' +
      '.ch4-bubble.who-kai .wb-icon{background:rgba(60,170,180,.18);border:1px solid rgba(60,170,180,.5);color:#9BD8DD;}' +
      '.ch4-bubble.who-wren .wb-icon{background:rgba(193,39,45,.2);border:1px solid rgba(193,39,45,.5);color:#E8DFC0;}' +
      '.ch4-bubble .wb-icon img{width:100%;height:100%;object-fit:cover;}' +
      '.ch4-bubble .wb-body{flex:1;min-width:0;}' +
      '.ch4-bubble .wb-top{display:flex;justify-content:space-between;font-family:var(--font-mono,monospace);font-size:11px;letter-spacing:1px;margin-bottom:2px;}' +
      '.ch4-bubble.who-kai .wb-top{color:rgba(155,216,221,.7);}' +
      '.ch4-bubble.who-wren .wb-top{color:rgba(232,223,192,.6);}' +
      '.ch4-bubble .wb-sender{font-family:var(--font-heading,serif);font-size:15px;margin-bottom:4px;}' +
      '.ch4-bubble.who-kai .wb-sender{color:#E3F4F6;}' +
      '.ch4-bubble.who-wren .wb-sender{color:#E8DFC0;}' +
      '.ch4-bubble .wb-text{font-size:14.5px;line-height:1.55;font-style:italic;}' +
      '.ch4-bubble.who-kai .wb-text{color:#E3F4F6;}' +
      '.ch4-bubble.who-wren .wb-text{color:#EAD9C2;}' +
      '@media (max-width:480px){.ch4-bubble-tray{left:12px;right:12px;top:12px;width:auto;}}';
    document.head.appendChild(st);
  }
  let tray = document.getElementById('ch4-bubble-tray');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'ch4-bubble-tray';
    tray.className = 'ch4-bubble-tray';
    document.body.appendChild(tray);
  }
  tray.innerHTML = '';
  const name = who === 'kai' ? 'Kai' : 'Wren';
  const initial = who === 'kai' ? 'K' : 'W';
  const avatarSrc = who === 'wren' ? 'assets/char-wren-silhouette.png' : 'assets/char-kai.png';
  const bubble = document.createElement('div');
  bubble.className = 'ch4-bubble who-' + who;
  bubble.innerHTML =
    '<div class="wb-icon"><img src="' +
    avatarSrc +
    '" onerror="this.parentElement.textContent=\'' +
    initial +
    '\'" /></div>' +
    '<div class="wb-body">' +
    '<div class="wb-top"><span>Messages</span><span>now</span></div>' +
    '<div class="wb-sender">' +
    name +
    ' \u00b7 Lens Agency</div>' +
    '<div class="wb-text">' +
    text +
    '</div>' +
    '</div>';
  tray.appendChild(bubble);
  requestAnimationFrame(function () {
    bubble.classList.add('visible');
  });
}

function dismissCh4Bubble() {
  const tray = document.getElementById('ch4-bubble-tray');
  if (tray) tray.innerHTML = '';
}

function setInvMono(who, text) {
  const el = document.getElementById('inv-monologue');
  if (!el) return;
  if (!who && !text) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML =
    '<span style="font-family:Arial,sans-serif;font-style:normal;font-size:10px;letter-spacing:2px;color:#C1272D;margin-right:8px;">' +
    who +
    '</span>' +
    text;
}

function finishCh4Level() {
  if (typeof dismissCh4Bubble === 'function') dismissCh4Bubble();
  ch4Levels[ch4CurrentLevel].completed = true;

  const level = ch4Levels[ch4CurrentLevel];
  if (typeof closeCh2ClueDrawer === 'function') closeCh2ClueDrawer();
  const drawer = document.createElement('div');
  drawer.id = 'ch2-clue-drawer';
  const evHtml = level.evidence ? '<div class="ch4-clue-evidence">' + level.evidence + '</div>' : '';
  drawer.innerHTML =
    '<div class="clue-card ch1-floating-clue">' +
    '<div class="clue-title">// INTELLIGENCE ACQUIRED</div>' +
    '<div>' +
    level.feedback +
    '</div>' +
    evHtml +
    '<button class="btn ch1-floating-continue" onclick="secureCh4Evidence()">Secure Evidence</button>' +
    '</div>';
  document.body.appendChild(drawer);

  document.getElementById('ch4-level-continue').style.display = 'none';
  ['ch4-pixel-btn', 'ch4-poison-btn', 'ch4-member-btn', 'ch4-inversion-btn'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function secureCh4Evidence() {
  if (typeof closeCh2ClueDrawer === 'function') closeCh2ClueDrawer();
  completeCh4Level();
}

function completeCh4Level() {
  startCh4LevelOutro(ch4CurrentLevel);
}

function ch4PushSms(containerId, lines, startDelay, messageInterval, tailDelay) {
  const container = document.getElementById(containerId);
  if (!container) return startDelay || 0;
  startDelay = startDelay === undefined ? 500 : startDelay;
  messageInterval = messageInterval === undefined ? 1200 : messageInterval;
  tailDelay = tailDelay === undefined ? messageInterval : tailDelay;

  lines.forEach(function (line, index) {
    const html = buildBubbleHtml(line.who, line.text, 'prelude-notif-');

    setTimeout(
      function () {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const el = tmp.firstChild;
        container.appendChild(el);
        void el.offsetWidth;
        el.classList.add('visible');
        el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      },
      startDelay + index * messageInterval
    );
  });

  return startDelay + Math.max(0, lines.length - 1) * messageInterval + tailDelay;
}

function startCh4LevelIntro(id) {
  const level = ch4Levels[id];
  goTo('scene-ch4-level-intro');
  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-level-intro', CH4_BACKGROUNDS['scene-ch4-prelude']);
  }

  document.getElementById('ch4-intro-header').textContent =
    '// CHAPTER 4 · ATTACK ' + (id + 1) + ' OF 4 · BRIEFING';
  document.getElementById('ch4-intro-header').textContent = '// INCOMING TRANSMISSION';
  const introTitle = document.getElementById('ch4-intro-title');
  if (introTitle) {
    introTitle.textContent = '';
    introTitle.style.display = 'none';
  }

  const smsContainer = document.getElementById('ch4-intro-sms-container');
  if (smsContainer) smsContainer.innerHTML = '';

  const pivotAction = document.getElementById('ch4-pivot-action');
  const pivotFile = document.getElementById('ch4-pivot-file');
  const pivotSms = document.getElementById('ch4-pivot-sms-container');
  if (pivotAction) pivotAction.innerHTML = '';
  if (pivotFile) pivotFile.innerHTML = '';
  if (pivotSms) pivotSms.innerHTML = '';

  const beginBtn = document.getElementById('ch4-intro-begin-btn');
  if (beginBtn) {
    beginBtn.style.visibility = 'hidden';
    beginBtn.style.opacity = '0';
    beginBtn.setAttribute('onclick', 'enterCh4Level(' + id + ')');
  }

  const lines = level.introSms || [];
  const done = ch4PushSms('ch4-intro-sms-container', lines, 500);

  if (level.pivotBefore) {
    setTimeout(function () {
      showPivotAction(id);
    }, done);
  } else {
    setTimeout(function () {
      if (beginBtn) {
        beginBtn.style.visibility = 'visible';
        beginBtn.style.opacity = '1';
        beginBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, done);
  }
}

function showPivotAction(id) {
  const host = document.getElementById('ch4-pivot-action');
  if (!host) return;
  host.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.cssText =
    'display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px;margin:0 auto;';
  const b = document.createElement('button');
  b.className = 'btn btn-ghost prelude-btn';
  b.innerHTML = "▸ Pull Robin Mercer's personal file";
  b.addEventListener('click', function () {
    revealPivotFile(id);
  });
  wrap.appendChild(b);
  host.appendChild(wrap);
  b.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function revealPivotFile(id) {
  if (typeof unlockCharacterTape === 'function') unlockCharacterTape('jay');
  const level = ch4Levels[id];
  const action = document.getElementById('ch4-pivot-action');
  if (action) action.innerHTML = '';

  const fileHost = document.getElementById('ch4-intro-sms-container');
  if (fileHost) {
    fileHost.insertAdjacentHTML(
      'beforeend',
      '<div class="attack-box" style="text-align:left;opacity:0;transition:opacity 0.8s ease;" id="ch4-pivot-filecard">' +
        '<div class="atk-label">// PERSONAL FILE, MERCER, ROBIN</div>' +
        '<div style="font-family:monospace;font-size:12.5px;color:#C8C0B0;line-height:2;">' +
        'SUBJECT: Mercer, Robin, physician, Sable District clinic<br>' +
        'DEPENDENT: one minor in legal guardianship, Mercer, Jay (14)<br>' +
        '&nbsp;&nbsp;└ congenital heart condition, surgery required<br>' +
        '&nbsp;&nbsp;└ estimated cost: <span style="color:#C1272D;">£2.31M</span><br>' +
        '&nbsp;&nbsp;└ liable insurer: <span style="color:#C1272D;">HARROW INSURANCE GROUP</span><br>' +
        'GUARDIANSHIP: sole guardian<br>' +
        '&nbsp;&nbsp;└ if guardian incapacitated → ward of state → <span style="color:#C1272D;">procedure suspended</span>' +
        '</div></div>'
    );
    const card = document.getElementById('ch4-pivot-filecard');
    if (card) {
      void card.offsetWidth;
      card.style.opacity = '1';
      card.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  const beginBtn = document.getElementById('ch4-intro-begin-btn');
  setTimeout(function () {
    const host = document.getElementById('ch4-pivot-action');
    if (!host) return;
    host.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px;margin:0 auto;';
    const pull = document.createElement('button');
    pull.className = 'btn';
    pull.style.width = '100%';
    pull.textContent = 'Pull the thread';
    pull.addEventListener('click', function () {
      startCh4Motive(id);
    });
    wrap.appendChild(pull);
    host.appendChild(wrap);
    pull.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 1200);
}

function startCh4Motive(id) {
  const level = ch4Levels[id];
  goTo('scene-ch4-motive');
  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-motive', 'assets/bg-LENS_Agency.png');
  }
  const titleEl = document.getElementById('ch4-motive-title');
  if (titleEl) titleEl.textContent = level.title;

  const sms = document.getElementById('ch4-motive-sms-container');
  if (sms) sms.innerHTML = '';
  const beginBtn = document.getElementById('ch4-motive-begin-btn');
  if (beginBtn) {
    beginBtn.style.visibility = 'hidden';
    beginBtn.style.opacity = '0';
    beginBtn.setAttribute('onclick', 'enterCh4Level(' + id + ')');
  }

  const done = ch4PushSms('ch4-motive-sms-container', level.motiveSms || [], 300);
  setTimeout(function () {
    if (beginBtn) {
      beginBtn.style.visibility = 'visible';
      beginBtn.style.opacity = '1';
      beginBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, done);
}

function startCh4LevelOutro(id) {
  if (id === 3 && typeof scheduleCharacterTapeUnlock === 'function') {
    scheduleCharacterTapeUnlock('lark', 1200);
  } else if (id === 3 && typeof unlockCharacterTape === 'function') {
    setTimeout(function () {
      unlockCharacterTape('lark');
    }, 1200);
  }
  const level = ch4Levels[id];
  goTo('scene-ch4-level-outro');
  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-level-outro', CH4_BACKGROUNDS['scene-ch4-debrief']);
  }

  document.getElementById('ch4-outro-header').textContent =
    '// EVIDENCE ' + String(id + 1).padStart(2, '0') + ' SECURED';
  document.getElementById('ch4-outro-title').textContent = level.title;

  const smsContainer = document.getElementById('ch4-outro-sms-container');
  if (smsContainer) smsContainer.innerHTML = '';

  const backBtn = document.getElementById('ch4-outro-back-btn');
  if (backBtn) backBtn.style.display = 'none';

  const allDone = ch4Levels.every(function (l) {
    return l.completed;
  });

  if (backBtn) {
    if (allDone) {
      backBtn.textContent = 'Submit Final Evidence';
      backBtn.setAttribute('onclick', 'startCh4Debrief()');
    } else {
      backBtn.textContent = 'Return to Evidence Board';
      backBtn.setAttribute('onclick', "renderCh4Cards(); goTo('scene-chapter4');");
    }
  }

  const lines = level.outroSms || [];
  const done = ch4PushSms('ch4-outro-sms-container', lines, 500);

  setTimeout(function () {
    if (backBtn) {
      backBtn.style.display = 'block';
      backBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, done);
}

function renderCh4Appeal() {
  const host = document.getElementById('ch4-appeal-host');
  if (!host) return;

  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-appeal', 'assets/bg-LENS_Agency.png');
  }

  // Chapter 4 has newer prop markup than the shared appeal styles injected by
  // chapters 2/3. Give its stylesheet a dedicated id so these overrides are
  // always installed during a normal, sequential playthrough.
  if (!document.getElementById('ch4-appeal-style')) {
    const s = document.createElement('style');
    s.id = 'ch4-appeal-style';
    s.textContent =
      '' +
      '.ch2appeal-wrapper{position:relative;width:100%;max-width:620px;margin:0 auto;' +
      'display:flex;justify-content:center;align-items:center;opacity:0;transition:opacity 1s ease;}' +
      '.ch2appeal-red-folder{position:absolute;width:100%;height:103%;background:#141114;' +
      'transform:rotate(-2deg);box-shadow:0 15px 35px rgba(0,0,0,0.7);border-radius:4px;z-index:1;}' +
      /* thermal receipt artwork: sprocket strips ~9% each side, stains on the right */
      '.ch2appeal-paper{position:relative;background:url("assets/UI/05_thermal_receipt.png") center/100% 100% no-repeat;' +
      'color:#241c18;width:100%;padding:7% 11% 8% 10%;' +
      'font-family:"Special Elite","Courier Prime","Courier New",Courier,monospace;' +
      'filter:drop-shadow(0 8px 24px rgba(0,0,0,0.55));text-align:left;z-index:2;}' +
      '.ch2appeal-header{background:rgba(10,8,8,.88);color:#f2ece1;padding:15px 20px;text-align:center;' +
      'margin-bottom:30px;border:2px solid rgba(0,0,0,.85);position:relative;}' +
      '.ch2appeal-title{font-size:22px;font-weight:bold;letter-spacing:3px;margin-bottom:5px;}' +
      '.ch2appeal-subtitle{font-size:11px;letter-spacing:2px;color:#b3a99a;}' +
      /* DENIED rubber stamp artwork, topmost layer; wobbles on hover like the briefing trinkets */
      '.ch2appeal-stamp{position:absolute;right:-9%;top:-26px;width:min(56%,330px);aspect-ratio:1448/1086;' +
      'background:url("assets/UI/04_denied.png") center/contain no-repeat;' +
      'color:transparent;font-size:0;border:0;padding:0;' +
      '--base-rot:-9deg;transform:rotate(var(--base-rot));transform-origin:50% 45%;' +
      'filter:drop-shadow(0 10px 16px rgba(0,0,0,.5));opacity:.96;z-index:6;pointer-events:auto;}' +
      '.ch2appeal-stamp:hover{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;' +
      'filter:drop-shadow(0 14px 20px rgba(0,0,0,.6));}' +
      '@keyframes ch2appeal-stamp-wiggle{' +
      '0%,100%{transform:rotate(var(--base-rot,0deg)) translate(0,0);}' +
      '25%{transform:rotate(calc(var(--base-rot,0deg) - 5deg)) translate(-4px,3px);}' +
      '50%{transform:rotate(calc(var(--base-rot,0deg) + 5deg)) translate(4px,-3px);}' +
      '75%{transform:rotate(calc(var(--base-rot,0deg) - 3deg)) translate(-2px,1px);}}' +
      /* legibility strip: soft pale backing + ink halo so text survives the stains */
      '.ch2appeal-grid{display:grid;grid-template-columns:150px 1fr;gap:14px 10px;margin-bottom:26px;' +
      'border-bottom:2px dashed rgba(60,40,35,.55);padding:14px 12px 22px;' +
      'background:rgba(242,232,214,.46);box-shadow:0 0 22px 12px rgba(242,232,214,.46);}' +
      '.ch2appeal-label{font-size:13px;font-weight:bold;color:#241c18;text-transform:uppercase;padding-top:2px;' +
      'text-shadow:0 0 5px rgba(244,236,220,.9);}' +
      '.ch2appeal-value{font-size:14px;font-weight:bold;line-height:1.5;color:#241c18;' +
      'border-bottom:1px solid rgba(80,55,48,.35);padding-bottom:2px;' +
      'text-shadow:0 0 5px rgba(244,236,220,.9);}' +
      '.ch2appeal-value p{margin:0 0 5px 0;}' +
      '.ch2appeal-reason{background:rgba(12,10,10,.88);color:#f2ece1;padding:16px 18px;line-height:1.7;font-size:13px;}' +
      '.ch2appeal-reason .hot{color:#E04A50;font-weight:bold;}' +
      /* Wren's handwritten checklist note, pinned left of the ruling */
      '.ch2appeal-note{position:absolute;left:-238px;top:-26px;width:232px;aspect-ratio:833/1153;' +
      '--base-rot:-8deg;transform-origin:50% 10%;z-index:4;' +
      'animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .4s both;}' +
      '.ch2appeal-note-inner{position:absolute;inset:0;' +
      'background:url("assets/props/prop-note-checklist.png") center/contain no-repeat;' +
      'filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch2appeal-note:hover .ch2appeal-note-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '@keyframes ch2note-drop{' +
      'from{opacity:0;transform:rotate(calc(var(--base-rot) + 5deg)) translateY(-20px);}' +
      'to{opacity:1;transform:rotate(var(--base-rot)) translateY(0);}}' +
      '.ch2appeal-note .note-label{position:absolute;left:24%;transform:translateY(-50%);' +
      'font-family:"Special Elite","Courier Prime",monospace;font-size:14px;font-weight:bold;' +
      'color:#EAD9C2;text-shadow:0 1px 2px rgba(0,0,0,.7);letter-spacing:1px;white-space:nowrap;}' +
      '.ch2appeal-note .note-check{position:absolute;left:15%;width:26px;height:26px;' +
      'transform:translate(-50%,-54%) rotate(-6deg);overflow:visible;' +
      'filter:drop-shadow(0 1px 1px rgba(0,0,0,.6));}' +
      /* ticks draw themselves in, one after another, once the note has landed */
      '.ch2appeal-note .note-check path{fill:none;stroke:#8f161a;stroke-width:4.5;' +
      'stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:46;stroke-dashoffset:46;' +
      'animation:ch2note-tick .5s cubic-bezier(.3,.7,.35,1) forwards;}' +
      '.ch2appeal-note .r1 path{animation-delay:1.4s;}' +
      '.ch2appeal-note .r2 path{animation-delay:1.95s;}' +
      '.ch2appeal-note .r3 path{animation-delay:2.5s;}' +
      '@keyframes ch2note-tick{to{stroke-dashoffset:0;}}' +
      '.ch2appeal-note .r1{top:19%;}.ch2appeal-note .r2{top:30%;}' +
      '.ch2appeal-note .r3{top:41%;}.ch2appeal-note .r4{top:51.5%;}' +
      '@media (max-width:1120px){.ch2appeal-note,.ch2appeal-vial,.ch2appeal-polaroid,.ch2appeal-lawcard,.ch2appeal-tag,.ch3appeal-fundchain,.ch3appeal-cert,.ch3appeal-report,.ch3appeal-verify,.ch4appeal-loop,.ch4appeal-blackbox,.ch4appeal-cites,.ch4appeal-seal{display:none;}}' +
      /* morphine vial sketch note, pinned lower-left, lands after the checklist */
      '.ch2appeal-vial{position:absolute;left:-252px;top:322px;width:222px;aspect-ratio:813/1172;' +
      '--base-rot:6deg;transform-origin:50% 8%;z-index:3;' +
      'animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .75s both;}' +
      '.ch2appeal-vial-inner{position:absolute;inset:0;' +
      'background:url("assets/props/prop-note-morphine.png") center/contain no-repeat;' +
      'filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch2appeal-vial:hover .ch2appeal-vial-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      /* red annotation written in after the note lands */
      '.ch2appeal-vial .vial-line{position:absolute;left:54%;' +
      'font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#8f161a;' +
      'text-shadow:0 1px 2px rgba(0,0,0,.55);white-space:nowrap;transform:rotate(-5deg);' +
      'clip-path:inset(0 100% -10% 0);animation:ch2vial-write .55s ease-out forwards;}' +
      '.ch2appeal-vial .v1{top:73%;font-size:16px;letter-spacing:1px;animation-delay:1.8s;}' +
      '.ch2appeal-vial .v2{top:80%;font-size:15px;animation-delay:2.2s;}' +
      '@keyframes ch2vial-write{to{clip-path:inset(0 -10% -10% 0);}}' +
      /* George's memorial polaroid, upper right */
      '.ch2appeal-polaroid{position:absolute;right:-232px;top:64px;width:212px;aspect-ratio:1034/1329;' +
      '--base-rot:-5deg;transform-origin:50% 8%;z-index:3;' +
      'animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.05s both;}' +
      '.ch2appeal-polaroid-inner{position:absolute;inset:0;' +
      'background:url("assets/props/prop-polaroid-george.png") center/contain no-repeat;' +
      'filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch2appeal-polaroid:hover .ch2appeal-polaroid-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch2appeal-polaroid .pol-line{position:absolute;left:50%;transform:translateX(-50%);' +
      'font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#2a1c10;' +
      'text-shadow:0 0 2px rgba(240,225,200,.35);white-space:nowrap;' +
      'clip-path:inset(0 100% -12% 0);animation:ch2vial-write .55s ease-out forwards;}' +
      '.ch2appeal-polaroid .p1{top:82.5%;font-size:17px;letter-spacing:2px;animation-delay:2.3s;}' +
      '.ch2appeal-polaroid .p2{top:89%;font-size:13px;letter-spacing:3px;animation-delay:2.6s;}' +
      /* statute reference card (replaces the polaroid on ch2's appeal), upper right */
      '.ch2appeal-lawcard{position:absolute;right:-302px;top:70px;width:298px;aspect-ratio:1168/693;' +
      '--base-rot:-5deg;transform-origin:50% 8%;z-index:3;' +
      'animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.05s both;}' +
      '.ch2appeal-lawcard-inner{position:absolute;inset:0;' +
      'background:url("assets/props/prop-card-lawtext.png") center/contain no-repeat;' +
      'filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch2appeal-lawcard:hover .ch2appeal-lawcard-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch2appeal-lawcard .law-line{position:absolute;left:13%;width:74%;box-sizing:border-box;text-align:center;' +
      'font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#120d09;' +
      'text-shadow:0 0 4px rgba(228,214,188,.6),0 0 1px rgba(228,214,188,.65);' +
      'clip-path:inset(0 100% -12% 0);animation:ch2vial-write .55s ease-out forwards;}' +
      '.ch2appeal-lawcard .l1{top:18.5%;font-size:11px;letter-spacing:1.8px;animation-delay:2.3s;}' +
      '.ch2appeal-lawcard .l2{top:31%;font-size:12.5px;line-height:1.6;letter-spacing:.3px;white-space:normal;text-align:left;animation-delay:2.55s;}' +
      '.ch2appeal-lawcard .law-key{background:rgba(193,39,45,0);mix-blend-mode:multiply;' +
      'padding:0 2px;animation:ch2law-hl .6s ease-out 3.15s forwards;}' +
      '@keyframes ch2law-hl{to{background:rgba(193,39,45,.34);}}' +
      '.ch2appeal-lawcard .law-clip{position:absolute;left:4%;top:-13%;width:26%;aspect-ratio:1774/887;' +
      'background:url("assets/UI/10_gold_paperclip.png") center/contain no-repeat;' +
      'filter:drop-shadow(0 4px 6px rgba(0,0,0,.5));z-index:4;transform:rotate(8deg);}' +
      /* ch3 appeal props: fund-chain / certificate / report / verification */
      '.ch3appeal-fundchain{position:absolute;left:-238px;top:-26px;width:212px;aspect-ratio:465/503;' +
      '--base-rot:-8deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .4s both;}' +
      '.ch3appeal-fundchain-inner{position:absolute;inset:0;background:url("assets/props/prop-note-fundchain.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch3appeal-fundchain:hover .ch3appeal-fundchain-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch3appeal-fundchain .fc-line{position:absolute;left:10%;width:80%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;text-shadow:none;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch3appeal-fundchain .fc1{top:20%;font-size:12.5px;letter-spacing:.4px;animation-delay:.9s;}' +
      '.ch3appeal-fundchain .fc2{top:46%;font-size:12.5px;letter-spacing:.4px;animation-delay:1.2s;}' +
      '.ch3appeal-fundchain .fc3{top:67%;font-size:26px;color:#9a181c;animation-delay:2.5s;}' +
      '.ch3appeal-fundchain .fc-arrows{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}' +
      '.ch3appeal-fundchain .fc-arrows path{fill:none;stroke:#17110d;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:80;stroke-dashoffset:80;animation:ch2note-tick .6s ease-out forwards;}' +
      '.ch3appeal-fundchain .fc-arrows .a1{animation-delay:1.4s;}' +
      '.ch3appeal-fundchain .fc-arrows .a2{animation-delay:1.95s;}' +
      '.ch3appeal-fundchain .fc-ring{position:absolute;left:50%;top:74.5%;width:58px;height:46px;border:3px solid #9a181c;border-radius:50%;opacity:0;animation:ch2tag-seal .35s cubic-bezier(.2,.8,.3,1.2) 2.85s forwards;}' +
      '.ch3appeal-cert{position:absolute;left:-252px;top:322px;width:250px;aspect-ratio:561/438;' +
      '--base-rot:6deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .75s both;}' +
      '.ch3appeal-cert-inner{position:absolute;inset:0;background:url("assets/props/prop-card-certificate.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch3appeal-cert:hover .ch3appeal-cert-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch3appeal-cert .cert-line{position:absolute;left:14%;width:58%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#2e1d15;text-shadow:none;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch3appeal-cert .c1{top:29%;font-size:14px;letter-spacing:2px;animation-delay:1.6s;}' +
      '.ch3appeal-cert .c1b{top:40%;font-size:14px;letter-spacing:2px;animation-delay:1.9s;}' +
      '.ch3appeal-cert .c2{top:54%;font-size:9.5px;letter-spacing:2.5px;animation-delay:2.2s;}' +
      '.ch3appeal-cert .cert-slash{position:absolute;left:22%;top:32.5%;width:40%;height:3px;background:#9a181c;--lrot:-7deg;transform:rotate(var(--lrot)) scaleX(0);transform-origin:left center;animation:ch3line-draw .45s ease-out 3.0s forwards;}' +
      '.ch3appeal-cert .cert-note{position:absolute;left:14%;top:67%;width:58%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;font-size:11px;color:#801114;transform:rotate(-3deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.35s forwards;}' +
      '.ch3appeal-report{position:absolute;right:-232px;top:64px;width:256px;aspect-ratio:548/458;' +
      '--base-rot:5deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.05s both;}' +
      '.ch3appeal-report-inner{position:absolute;inset:0;background:url("assets/props/prop-report-nightingale.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch3appeal-report:hover .ch3appeal-report-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch3appeal-report .rp-line{position:absolute;left:24%;width:58%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;text-shadow:none;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch3appeal-report .rp1{top:16%;font-size:14px;letter-spacing:1.5px;line-height:1.45;animation-delay:2.3s;}' +
      '.ch3appeal-report .rp3{top:49%;left:17%;width:76%;font-size:8.5px;white-space:nowrap;color:#9a181c;animation-delay:2.8s;}' +
      '.ch3appeal-report .rp-ring{position:absolute;left:15%;top:44%;width:80%;height:14.5%;pointer-events:none;}' +
      '.ch3appeal-report .rp-ring path{fill:none;stroke:#9a181c;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:430;stroke-dashoffset:430;animation:ch2note-tick .8s ease-out 3.15s forwards;}' +
      '.ch3appeal-report .rp-note{position:absolute;left:24%;top:66%;width:58%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;font-size:12px;color:#9a181c;transform:rotate(-4deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.55s forwards;}' +
      '.ch3appeal-verify{position:absolute;right:-246px;top:398px;width:198px;aspect-ratio:393/517;' +
      '--base-rot:4deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.35s both;}' +
      '.ch3appeal-verify-inner{position:absolute;inset:0;background:url("assets/props/prop-receipt-verification.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch3appeal-verify:hover .ch3appeal-verify-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch3appeal-verify .vf-line{position:absolute;left:8%;width:84%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;text-shadow:none;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch3appeal-verify .vf1{top:12.5%;font-size:8.5px;letter-spacing:.8px;line-height:1.5;animation-delay:2.6s;}' +
      '.ch3appeal-verify .vf2{top:33%;font-size:12.5px;letter-spacing:1px;animation-delay:3.0s;}' +
      '.ch3appeal-verify .vf3{top:55%;font-size:8px;letter-spacing:.5px;color:#17110d;animation-delay:3.3s;}' +
      '.ch3appeal-verify .vf-ul{position:absolute;left:16%;top:59.5%;width:68%;height:2px;background:#9a181c;transform:rotate(var(--lrot,0deg)) scaleX(0);transform-origin:left center;animation:ch3line-draw .5s ease-out 3.6s forwards;}' +
      '@keyframes ch3line-draw{to{transform:rotate(var(--lrot,0deg)) scaleX(1);}}' +
      /* ch4 appeal props: self-check loop / black-box tag / citation stack / closed seal */
      '.ch4appeal-loop{position:absolute;left:-324px;top:42px;width:250px;aspect-ratio:477/543;' +
      '--base-rot:-6deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .4s both;}' +
      '.ch4appeal-loop-inner{position:absolute;inset:0;background:url("assets/props/prop-note-selfcheck.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-loop:hover .ch4appeal-loop-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-loop .lc-line{position:absolute;left:10%;width:80%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch4appeal-loop .lc1{top:20%;font-size:12.5px;letter-spacing:1.5px;transform:rotate(-8deg);transform-origin:center;animation-delay:.9s;}' +
      '.ch4appeal-loop .lc-cycle{position:absolute;left:20%;top:35%;width:60%;text-align:center;' +
      'font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;font-size:15px;line-height:1.45;' +
      'letter-spacing:1px;color:#17110d;transform:rotate(-10deg);transform-origin:center;' +
      'opacity:0;animation:ch4fade .4s ease-out 1.3s forwards;}' +
      '.ch4appeal-loop .lc-cycle small{display:block;font-size:10px;line-height:6;letter-spacing:1.5px;font-weight:normal;}' +
      '.ch4appeal-loop .lc-ring{position:absolute;left:20%;top:28%;width:60%;height:47%;pointer-events:none;transform:rotate(-8deg);transform-origin:center;}' +
      '.ch4appeal-loop .lc-ring path{fill:none;stroke:#17110d;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:300;stroke-dashoffset:300;animation:ch2note-tick 1.2s ease-in-out 1.6s forwards;}' +
      '.ch4appeal-loop .lc-note{position:absolute;left:8%;top:76%;width:84%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-style:italic;font-size:14px;line-height:1.35;color:#9a181c;transform:rotate(-8deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.0s forwards;}' +
      '@keyframes ch4fade{to{opacity:1;}}' +
      '.ch4appeal-blackbox{position:absolute;right:-232px;top:44px;width:172px;aspect-ratio:342/730;' +
      '--base-rot:2deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.05s both;}' +
      '.ch4appeal-blackbox-inner{position:absolute;inset:0;background:url("assets/props/prop-tag-blackbox.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-blackbox:hover .ch4appeal-blackbox-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-blackbox .bb-line{position:absolute;left:12%;width:76%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch4appeal-blackbox .bb-heading{top:31%;font-size:11px;line-height:1.65;letter-spacing:.8px;animation-delay:2.3s;}' +
      '.ch4appeal-blackbox .bb-stamp{position:absolute;left:50%;top:63%;width:72%;box-sizing:border-box;' +
      'padding:8px 3px;text-align:center;border:0;font-family:"Special Elite",monospace;' +
      'font-weight:bold;font-size:10.5px;line-height:1.25;letter-spacing:.7px;color:#9c1418;' +
      'opacity:0;animation:ch4blackbox-seal .35s cubic-bezier(.2,.8,.3,1.2) 3.1s forwards;}' +
      '@keyframes ch4blackbox-seal{from{opacity:0;transform:translate(-50%,-50%) scale(1.6) rotate(-7deg);}60%{opacity:1;transform:translate(-50%,-50%) scale(.96) rotate(-7deg);}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-7deg);}}' +
      '.ch4appeal-blackbox .bb-note{position:absolute;left:8%;top:79%;width:84%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-style:italic;font-size:11px;line-height:1.35;color:#9a181c;transform:rotate(-2deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.6s forwards;}' +
      '.ch4appeal-cites{position:absolute;left:-252px;top:410px;width:218px;aspect-ratio:409/502;' +
      '--base-rot:-2deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .75s both;}' +
      '.ch4appeal-cites-inner{position:absolute;inset:0;background:url("assets/props/prop-stack-citations.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-cites:hover .ch4appeal-cites-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-cites .ct-line{position:absolute;left:12%;width:76%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch4appeal-cites .ct1{left:10%;top:19.5%;font-size:14px;transform:rotate(-2deg);animation-delay:1.4s;}' +
      '.ch4appeal-cites .ct2{top:39.5%;font-size:14px;transform:rotate(-2deg);animation-delay:1.75s;}' +
      '.ch4appeal-cites .ct3{top:61%;font-size:13.5px;animation-delay:2.1s;}' +
      '.ch4appeal-cites .ct-strike{position:absolute;height:2.5px;background:#9a181c;transform:rotate(var(--lrot,-2deg)) scaleX(0);transform-origin:left center;animation:ch3line-draw .4s ease-out forwards;}' +
      '.ch4appeal-cites .s1{left:18%;top:22.3%;width:60%;--lrot:-2deg;animation-delay:2.45s;}' +
      '.ch4appeal-cites .s2{left:16%;top:41%;width:66%;--lrot:-2deg;animation-delay:2.75s;}' +
      '.ch4appeal-cites .s3{left:18%;top:63.8%;width:64%;--lrot:-1.5deg;animation-delay:3.05s;}' +
      '.ch4appeal-cites .ct-note{position:absolute;left:10%;top:80%;width:80%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-style:italic;font-size:13.5px;color:#9a181c;transform:rotate(-2deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.45s forwards;}' +
      '.ch4appeal-seal{position:absolute;right:-372px;top:520px;width:380px;aspect-ratio:667/225;' +
      '--base-rot:-3deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.35s both;}' +
      '.ch4appeal-seal-inner{position:absolute;inset:0;background:url("assets/props/prop-seal-closed.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-seal:hover .ch4appeal-seal-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-seal .sl-line{position:absolute;left:10%;top:43%;width:64%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;font-size:10px;letter-spacing:.7px;color:#17110d;white-space:nowrap;transform:rotate(-3deg);transform-origin:center;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .55s ease-out 2.7s forwards;}' +
      /* evidence bag tag, lower right; fields written in, then the seal slams down */
      '.ch2appeal-tag{position:absolute;right:-246px;top:398px;width:204px;aspect-ratio:730/1114;' +
      '--base-rot:4deg;transform-origin:50% 6%;z-index:3;' +
      'animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.35s both;}' +
      '.ch2appeal-tag-inner{position:absolute;inset:0;' +
      'background:url("assets/props/prop-tag-evidence.png") center/contain no-repeat;' +
      'filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch2appeal-tag:hover .ch2appeal-tag-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch2appeal-tag .tag-line{position:absolute;left:16%;transform:translateY(-100%) rotate(-1deg);' +
      'font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#7f1512;' +
      'text-shadow:0 0 2px rgba(0,0,0,.25);white-space:nowrap;font-size:13px;' +
      'clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch2appeal-tag .t1{top:25.8%;font-size:15px;letter-spacing:1px;animation-delay:2.6s;}' +
      '.ch2appeal-tag .t2{top:31.9%;animation-delay:2.9s;}' +
      '.ch2appeal-tag .t3{top:38.1%;animation-delay:3.2s;}' +
      '.ch2appeal-tag .t4{top:43.7%;animation-delay:3.5s;}' +
      '.ch2appeal-tag .tag-seal{position:absolute;left:45%;top:86.8%;' +
      'transform:translate(-50%,-50%) rotate(-3deg);font-family:"Special Elite",monospace;' +
      'font-weight:bold;font-size:19px;letter-spacing:6px;color:#9c1418;' +
      'text-shadow:0 0 3px rgba(90,10,12,.4);opacity:0;' +
      'animation:ch2tag-seal .35s cubic-bezier(.2,.8,.3,1.2) 3.9s forwards;}' +
      '@keyframes ch2tag-seal{' +
      'from{opacity:0;transform:translate(-50%,-50%) scale(1.7) rotate(-3deg);}' +
      '60%{opacity:1;transform:translate(-50%,-50%) scale(.95) rotate(-3deg);}' +
      'to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-3deg);}}' +
      '.ch2appeal-btn-wrap{text-align:center;margin-top:30px;}';
    document.head.appendChild(s);
  }

  host.innerHTML =
    '' +
    '<div class="ch2appeal-wrapper" id="ch4-appeal-card">' +
    '<div class="ch2appeal-red-folder"></div>' +
    '<div class="ch4appeal-loop" aria-hidden="true">' +
    '<div class="ch4appeal-loop-inner">' +
    '<span class="lc-line lc1">INTEGRITY CHECK</span>' +
    '<svg class="lc-ring" viewBox="0 0 100 100" preserveAspectRatio="none">' +
    '<path d="M36 82 C10 72 10 30 34 18 M34 18 L25 19 M34 18 L30 28"/>' +
    '<path d="M64 18 C90 28 90 70 66 82 M66 82 L75 81 M66 82 L70 72"/>' +
    '</svg>' +
    '<span class="lc-cycle">ARIA<small>AUDITS</small>ARIA</span>' +
    '<span class="lc-note">it graded its<br>own homework.</span>' +
    '</div>' +
    '</div>' +
    '<div class="ch4appeal-cites" aria-hidden="true">' +
    '<div class="ch4appeal-cites-inner">' +
    '<span class="ct-line ct1">Dr. H. Voss</span>' +
    '<span class="ct-line ct2">2028 Ethics Prize</span>' +
    '<span class="ct-line ct3">ref NS-2031-0412</span>' +
    '<span class="ct-strike s1"></span>' +
    '<span class="ct-strike s2"></span>' +
    '<span class="ct-strike s3"></span>' +
    '<span class="ct-note">all three &rarr; Plover.</span>' +
    '</div>' +
    '</div>' +
    '<div class="ch4appeal-blackbox" aria-hidden="true">' +
    '<div class="ch4appeal-blackbox-inner">' +
    '<span class="bb-line bb-heading">MODEL WEIGHTS<br>TRAINING DATA</span>' +
    '<span class="bb-stamp">NO EXTERNAL<br>INSPECTION</span>' +
    '<span class="bb-note">what are they hiding?</span>' +
    '</div>' +
    '</div>' +
    '<div class="ch4appeal-seal" aria-hidden="true">' +
    '<div class="ch4appeal-seal-inner">' +
    '<span class="sl-line">MATTER CLOSED &middot; REF 4471-M</span>' +
    '</div>' +
    '</div>' +
    '<div class="ch2appeal-paper">' +
    '<div class="ch2appeal-header">' +
    '<div class="ch2appeal-subtitle">ARIA JUDICIAL SYSTEM · APPEALS DIVISION</div>' +
    '<div class="ch2appeal-title">THIRD APPEAL : 4471-M</div>' +
    '<div class="ch2appeal-stamp">DENIED</div>' +
    '</div>' +
    '<div class="ch2appeal-grid">' +
    '<div class="ch2appeal-label">APPELLANT</div>' +
    '<div class="ch2appeal-value"><p>W. Cole, on behalf of R. Mercer</p><p>LENS Agency · AI Accountability Bureau</p></div>' +
    '<div class="ch2appeal-label">FILED</div>' +
    '<div class="ch2appeal-value"><p>23 May 2031 · 16:40</p></div>' +
    '<div class="ch2appeal-label">GROUNDS FOR APPEAL</div>' +
    '<div class="ch2appeal-value"><p>The denial report relied on <b>three fabricated citations</b>: a non-existent auditor, an invented award, and a verification file with a void reference number. All three trace to the same source: <b>Plover Holdings</b> paperwork. Appellant alleges the model and its records were deliberately tampered with.</p></div>' +
    '<div class="ch2appeal-label">REVIEWED BY</div>' +
    '<div class="ch2appeal-value"><p>ARIA — automated integrity self-check</p><p>Human oversight: none required</p></div>' +
    '<div class="ch2appeal-label">OUTCOME</div>' +
    '<div class="ch2appeal-value"><p>Original assessment upheld. Risk score 0.87 retained.</p></div>' +
    '</div>' +
    '<div class="ch2appeal-reason">' +
    'REASON FOR DENIAL: A full <span class="hot">system integrity self-check</span> has been ' +
    'completed. No evidence of external modification was found. The cited records are ' +
    'reported as <span class="hot">internally consistent</span>, and the model therefore ' +
    'certifies its own outputs as sound. Allegations of tampering are ' +
    '<span class="hot">unsubstantiated</span>. No external party may inspect the model\'s ' +
    'weights or training data. The matter is considered closed.' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="ch2appeal-btn-wrap">' +
    '<button class="btn" onclick="goTo(\'scene-ch4-prelude\')">Contact Partner</button>' +
    '</div>';

  const card = document.getElementById('ch4-appeal-card');
  void card.offsetWidth;
  setTimeout(function () {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 100);
}

var ch4FireworksFrame = 0;

function stopCh4ReopenFireworks() {
  if (ch4FireworksFrame) cancelAnimationFrame(ch4FireworksFrame);
  ch4FireworksFrame = 0;
  const canvas = document.querySelector('#scene-ch4-reopen .ch4-fireworks-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function startCh4ReopenFireworks() {
  const scene = document.getElementById('scene-ch4-reopen');
  if (!scene) return;

  let canvas = scene.querySelector('.ch4-fireworks-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'ch4-fireworks-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    scene.insertBefore(canvas, scene.firstChild);
  }

  if (ch4FireworksFrame) cancelAnimationFrame(ch4FireworksFrame);
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const rockets = [];
  const sparks = [];
  const colors = ['#ff4747', '#f2c66d', '#fff3d2', '#54d6df', '#62d98b'];
  let lastLaunch = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function launch(now) {
    const edge = Math.random() < 0.5;
    const x = edge
      ? window.innerWidth * (0.08 + Math.random() * 0.22)
      : window.innerWidth * (0.7 + Math.random() * 0.22);
    rockets.push({
      x: x,
      y: window.innerHeight + 12,
      px: x,
      py: window.innerHeight + 12,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -(6.5 + Math.random() * 2.2),
      target: window.innerHeight * (0.12 + Math.random() * 0.34),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    lastLaunch = now;
  }

  function explode(r) {
    const count = 34 + Math.floor(Math.random() * 18);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.12;
      const speed = 1.2 + Math.random() * 3.5;
      sparks.push({
        x: r.x,
        y: r.y,
        px: r.x,
        py: r.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.01 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function animate(now) {
    if (!scene.classList.contains('active')) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ch4FireworksFrame = 0;
      return;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    if (!lastLaunch || now - lastLaunch > 620 + Math.random() * 520) launch(now);

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.px = r.x;
      r.py = r.y;
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.018;
      ctx.beginPath();
      ctx.moveTo(r.px, r.py);
      ctx.lineTo(r.x, r.y);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 9;
      ctx.stroke();
      if (r.y <= r.target || r.vy >= -1.2) {
        explode(r);
        rockets.splice(i, 1);
      }
    }

    for (let j = sparks.length - 1; j >= 0; j--) {
      const p = sparks[j];
      p.px = p.x;
      p.py = p.y;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      p.vx *= 0.992;
      p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      if (p.life <= 0) sparks.splice(j, 1);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ch4FireworksFrame = requestAnimationFrame(animate);
  }

  resize();
  ch4FireworksFrame = requestAnimationFrame(animate);
}

function renderCh4Reopen() {
  let host = document.getElementById('ch4-reopen-host');
  if (!host) return;

  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-reopen', 'assets/bg-LENS_Agency.png');
  }
  startCh4ReopenFireworks();

  if (!document.getElementById('ch2-appeal-style')) {
    renderCh4Appeal();
    host = document.getElementById('ch4-reopen-host');
  }

  if (!document.getElementById('ch4-reopen-style')) {
    const s = document.createElement('style');
    s.id = 'ch4-reopen-style';
    s.textContent =
      '' +
      '.reopen-green-folder{position:absolute;width:100%;height:105%;background:#1B5E3F;' +
      'transform:rotate(-2deg);box-shadow:0 15px 35px rgba(0,0,0,0.7);border-radius:4px;z-index:1;}' +
      '#ch4-reopen-card .ch2appeal-paper{background:url("assets/UI/receipt_clean.png") center/100% 100% no-repeat;}' +
      '.reopen-stamp{position:absolute;right:-12px;top:2px;width:290px;aspect-ratio:1448/1086;' +
      'color:transparent;font-size:0;border:0;padding:0;background:url("assets/UI/approved.png") center/contain no-repeat;' +
      'mix-blend-mode:multiply;z-index:3;pointer-events:auto;--base-rot:0deg;transform-origin:50% 50%;}' +
      '.reopen-stamp:hover{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;' +
      'filter:drop-shadow(0 10px 14px rgba(0,0,0,.32));}' +
      '.reopen-reason{background:#10301F;color:#fff;padding:16px 18px;line-height:1.7;font-size:13px;}' +
      '.reopen-reason .hot{color:#4ADE80;font-weight:bold;}';
    document.head.appendChild(s);
  }

  host.innerHTML =
    '' +
    '<div class="ch2appeal-wrapper" id="ch4-reopen-card">' +
    '<div class="reopen-green-folder"></div>' +
    '<div class="ch2appeal-paper">' +
    '<div class="ch2appeal-header">' +
    '<div class="ch2appeal-subtitle">CROWN COURT · JUDICIAL REVIEW BOARD (HUMAN PANEL)</div>' +
    '<div class="ch2appeal-title">CASE REOPENED : 4471-M</div>' +
    '<div class="reopen-stamp">APPROVED</div>' +
    '</div>' +
    '<div class="ch2appeal-grid">' +
    '<div class="ch2appeal-label">PETITIONER</div>' +
    '<div class="ch2appeal-value"><p>W. Cole, on behalf of R. Mercer</p><p>LENS Agency · AI Accountability Bureau</p></div>' +
    '<div class="ch2appeal-label">FILED</div>' +
    '<div class="ch2appeal-value"><p>02 June 2031 · 09:15</p></div>' +
    '<div class="ch2appeal-label">NEW EVIDENCE</div>' +
    '<div class="ch2appeal-value"><p>Four independently verified exhibits: reconstructed scoring criteria, unlawfully ingested records, a poisoned feature set, and a <b>forged prescription</b>, all routing through <b>Plover Holdings</b> to <b>Harrow Insurance Group</b>.</p></div>' +
    '<div class="ch2appeal-label">REVIEWED BY</div>' +
    '<div class="ch2appeal-value"><p>Three sitting judges. <b>No automated review.</b></p></div>' +
    '<div class="ch2appeal-label">OUTCOME</div>' +
    '<div class="ch2appeal-value"><p>Conviction 4471-M set aside. Case reopened for retrial under human review.</p></div>' +
    '</div>' +
    '<div class="reopen-reason">' +
    'RULING: The original determination rested on evidence now shown to be ' +
    '<span class="hot">deliberately fabricated</span>. The system\'s self-certification ' +
    'is given <span class="hot">no weight</span>. For the first time in this matter, the ' +
    'record has been examined by <span class="hot">human judges</span>. The appeal is ' +
    '<span class="hot">granted in full</span>, and sixteen related cases are referred for review.' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="ch2appeal-btn-wrap">' +
    '<button class="btn" onclick="goTo(\'scene-ending\')">Read the Final Report</button>' +
    '</div>';

  const card = document.getElementById('ch4-reopen-card');
  if (card) {
    void card.offsetWidth;
    setTimeout(function () {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      playCh4Applause();
    }, 100);
  }
}

function startCh4Closing() {
  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-closing', 'assets/bg-sms.png');
  }
  const container = document.getElementById('ch4-closing-sms-container');
  if (container) container.innerHTML = '';

  const btn = document.getElementById('ch4-closing-continue-btn');
  if (btn) {
    btn.style.visibility = 'hidden';
    btn.style.opacity = '0';
  }

  const part1 = [
    {
      who: 'kai',
      text: "It's done. Conviction set aside, retrial under human judges. Jay's surgery is back on the schedule.",
    },
    {
      who: 'robin',
      text: "Wren. They told me who filed it. After everything, after I couldn't even ask you to.",
    },
    { who: 'wren', text: "You didn't have to ask." },
    {
      who: 'robin',
      text: 'You went to the cemetery that day. The 14th. You saw me there, and you never said a word, for five years.',
    },
  ];

  const t1 = ch4ClosingPush('ch4-closing-sms-container', part1, 500);
  setTimeout(function () {
    renderSmsChoices('ch4-closing-choices', CH4_CLOSING_CHOICES, function (opt) {
      ch4ClosingAfterChoice(opt);
    });
  }, t1);
}

var CH4_CLOSING_CHOICES = [
  {
    id: 'guilt',
    label: '"I couldn\'t look at where she\'s buried. That was on me."',
    wren: "I couldn't look at the place she's buried. I couldn't look at you standing near it. That was on me, not you.",
    robin: "She'd have been glad it was you who came back for me. Both of you.",
  },
  {
    id: 'protect',
    label: '"If I\'d spoken then, I\'d have lost the case. And you."',
    wren: "If I'd spoken then, I'd have lost the case. And you. I couldn't risk either.",
    robin: "You carried that alone for five years. You didn't have to.",
  },
  {
    id: 'plain',
    label: '"I didn\'t know what to say. So I said nothing."',
    wren: "I didn't know what to say. So I said nothing. I'm sorry it took this long.",
    robin: 'You said it now. In the only language that ever mattered. You came back.',
  },
  {
    id: 'her',
    label: '"I went for her. I stayed away for you. Both were love."',
    wren: "I went there for her. I stayed away from you for the same reason. Both were love. I just couldn't tell them apart.",
    robin: "She'd have understood that better than anyone. Both of you came back for me.",
  },
];

function ch4ClosingAfterChoice(opt) {
  const container = 'ch4-closing-sms-container';
  const btn = document.getElementById('ch4-closing-continue-btn');

  ch4ClosingPush(container, [{ who: 'wren', text: opt.wren }], 0);
  const afterWren = ch4ClosingPush(container, [{ who: 'robin', text: opt.robin }], 1400);

  const tail = [
    {
      who: 'kai',
      text: "For what it's worth, it wasn't really us against ARIA. It was one machine's evidence proving another had been poisoned. The thing that won it was a person who refused to stop asking why.",
    },
    { who: 'wren', text: 'The system was never going to question itself. That part has to be us.' },
    {
      who: 'kai',
      text: "And it won't be the last one. The next ARIA is already running somewhere. What you learned here is how to recognise it, question it, and hold it to account.",
    },
    { who: 'robin', text: "Then teach someone else to ask. That's how it doesn't happen again." },
  ];

  setTimeout(function () {
    const done = ch4ClosingPush(container, tail, 0);
    setTimeout(function () {
      if (btn) {
        btn.style.visibility = 'visible';
        btn.style.opacity = '1';
        btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, done);
  }, afterWren);
}

function ch4ClosingPush(containerId, lines, startDelay) {
  const container = document.getElementById(containerId);
  if (!container) return startDelay || 500;
  startDelay = startDelay === undefined ? 500 : startDelay;

  lines.forEach(function (line, index) {
    const html = buildBubbleHtml(line.who, line.text, 'prelude-notif-');
    setTimeout(
      function () {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const el = tmp.firstChild;
        container.appendChild(el);
        void el.offsetWidth;
        el.classList.add('visible');
        el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      },
      startDelay + index * 1400
    );
  });

  return startDelay + lines.length * 1400;
}

function startCh4Prelude() {
  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-prelude', CH4_BACKGROUNDS['scene-ch4-prelude']);
  }

  const smsContainer = document.getElementById('ch4-prelude-sms-container');
  if (smsContainer) smsContainer.innerHTML = '';

  const continueBtn = document.getElementById('ch4-prelude-continue-btn');
  if (continueBtn) {
    continueBtn.style.visibility = 'hidden';
    continueBtn.style.opacity = '0';
  }

  const lines = [
    {
      who: 'kai',
      text: 'Third appeal, third denial. ARIA ran a self-check, certified its own output, and sealed its weights. No outsider gets to look inside.',
    },
    {
      who: 'kai',
      text: 'So we stop asking permission. Every system that decides has a way it can be broken, ARIA is no different.',
    },
    {
      who: 'kai',
      text: 'We turn its own fragility into a forensic tool, four attacks, four pieces of evidence, building from how it judges down to the one document that convicted her.',
    },
    {
      who: 'wren',
      text: "Last chapter you said the door's still in front of us. Plover's paperwork.",
    },
    {
      who: 'kai',
      text: 'Right. And the deeper we pull on ARIA, the closer we get to whoever signed that paperwork.',
    },
    {
      who: 'wren',
      text: "Then let's stop standing at the door. Work it piece by piece, by the end we'll know who's behind it.",
    },
  ];

  const done = ch4PushSms('ch4-prelude-sms-container', lines, 500);

  setTimeout(function () {
    if (continueBtn) {
      continueBtn.style.visibility = 'visible';
      continueBtn.style.opacity = '1';
      continueBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, done);
}

function startCh4Debrief() {
  goTo('scene-ch4-debrief');
  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch4-debrief', CH4_BACKGROUNDS['scene-ch4-debrief']);
  }

  const smsContainer = document.getElementById('ch4-debrief-sms-container');
  if (smsContainer) smsContainer.innerHTML = '';

  const clueHost = document.getElementById('ch4-debrief-clue');
  if (clueHost) clueHost.innerHTML = '';

  const continueBtn = document.getElementById('ch4-debrief-continue-btn');
  if (continueBtn) continueBtn.style.display = 'none';

  const lines = [
    {
      who: 'kai',
      text: 'Four pieces of evidence, and every one carried the same origin metadata. The forged prescription, the stolen records, the poisoned criteria, all routed through Plover Holdings.',
    },
    { who: 'wren', text: 'Plover. The shell company from File_03.' },
    {
      who: 'kai',
      text: 'No staff, no office, just a conduit for money. Follow it out the other side and it ends at one buyer. Harrow Insurance Group.',
    },
    {
      who: 'wren',
      text: "Harrow. Jay's insurer. The £2.31 million they'd have paid for his surgery, gone, the moment Robin was put away.",
    },
    {
      who: 'kai',
      text: 'You saw the why before we ever got here. The forgery was just how they did it. This is who.',
    },
    {
      who: 'wren',
      text: "They didn't kill anyone. They just changed the numbers until the system did it for them.",
    },
    {
      who: 'kai',
      text: 'And the system covered for them. It scored Robin on its own poisoned inputs, then cleared its own score on appeal. Nobody had to lie, they just had to feed a machine that vouches for itself.',
    },
    {
      who: 'wren',
      text: "That's the whole trick. A closed loop nobody outside could open. So we didn't argue with it, we broke in and took the proof out by force.",
    },
    {
      who: 'kai',
      text: "And Robin wasn't the only one. There's a memo. Subject: Mercer, R. Recommended action: liability elimination. One line at the bottom, 'standard protocol.'",
    },
    { who: 'wren', text: "Standard. So it wasn't the first time." },
    {
      who: 'kai',
      text: "Seventeen other cases match the same fingerprint. Seventeen people, picked the way she was, each one a liability someone wanted erased. There's no villain to arrest in a room. Just a name, a memo, and a line of data.",
    },
    {
      who: 'wren',
      text: 'Then we stop pulling on the door. We walk through it. Take all seventeen to court.',
    },
  ];

  const done = ch4PushSms('ch4-debrief-sms-container', lines, 400, 760, 250);

  setTimeout(function () {
    if (clueHost) {
      clueHost.innerHTML = '';
      if (typeof closeCh2ClueDrawer === 'function') closeCh2ClueDrawer();
      const ch4cluedrawer = document.createElement('div');
      ch4cluedrawer.id = 'ch2-clue-drawer';
      ch4cluedrawer.innerHTML =
        '<div class="clue-card ch1-floating-clue">' +
        '<div class="clue-title">CLUE 04 UNLOCKED · THE FACELESS BUYER</div>' +
        '<div>All four exhibits \u2014 the forged prescription, the stolen records, the poisoned criteria, the manipulated profile \u2014 carry the same origin metadata, routing through ' +
        '<span>Plover Holdings</span>, a shell company, straight to the buyer behind it: ' +
        '<span>Harrow Insurance Group</span>.</div>' +
        '<div style="margin-top:10px;">Motive: a <span>£2.31M</span> liability for Jay Mercer\'s cardiac surgery. ' +
        'Convicting Robin would erase the obligation. The internal memo files it as ' +
        '<span>"standard protocol."</span></div>' +
        '<div style="margin-top:10px;">The same fingerprint appears across <span>17+ other cases</span>. ' +
        'No face, no signature in a room \u2014 only a name, a memo, and a line of data.</div>' +
        '<button class="btn ch1-floating-continue" onclick="closeCh2ClueDrawer()">Analyze Results</button>' +
        '</div>';
      document.body.appendChild(ch4cluedrawer);
      clueHost.innerHTML = '';
    }
    if (continueBtn) {
      continueBtn.style.display = 'block';
      continueBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    if (typeof markFolderCompleted === 'function') {
      markFolderCompleted(4);
    }
  }, done + 200);
}

renderCh4Cards();
// Feature-detect the (vendor-prefixed) Web Speech API. Returns null if absent.
function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function initVoiceInput() {
  const micBtn = document.getElementById('ch2-mic-btn');
  if (!micBtn) return;

  const SpeechRecognitionClass = getSpeechRecognition();
  if (!SpeechRecognitionClass) {
    // Unsupported browser (e.g. Firefox): disable the button and explain,
    // instead of letting it fail silently when clicked.
    micBtn.disabled = true;
    micBtn.style.opacity = '0.4';
    micBtn.title = 'Voice input not supported in this browser. Use Chrome or Edge.';
    return;
  }

  recognition = new SpeechRecognitionClass();
  recognition.lang = voiceLang;          // 'en-US' by default; puzzle keywords are English
  recognition.interimResults = false;    // deliver only the final transcript
  recognition.continuous = false;

  // Key interaction decision: place the recognised text INTO the input field and
  // let the player review/edit it, rather than sending automatically. Chapter 2's
  // puzzles hinge on exact wording, so an unverified transcript could waste a valid
  // attempt; a manual send keeps the player in control.
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('ch2-input');
    if (input) {
      input.value = input.value ? input.value + ' ' + transcript : transcript;
      input.focus();
    }
  };

  // Recover cleanly from a denied microphone permission, and always reset the
  // button state when recognition ends.
  recognition.onerror = function (event) { /* ... reset button; alert if not-allowed ... */ };
  recognition.onend   = function ()      { isListening = false; resetMicButton(); };
}
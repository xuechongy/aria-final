//
var ch3Sentences = [
  {
    text: 'ARIA was deployed across 47 jurisdictions in 2031 following a phased rollout beginning in 2029.',
    hallucination: false,
    evidence:
      'DEPLOYMENT LOG \u00b7 rollout confirmed: 2029 pilot, 47 active jurisdictions on record as of 2031.',
    evidenceOk: true,
    monologue:
      "The rollout dates check out against the public deployment log. This part isn't where it's hiding the lie.",
  },
  {
    text: "ARIA's training dataset includes historical sentencing records spanning a fifteen-year period.",
    hallucination: false,
    evidence: 'DATASET MANIFEST \u00b7 fifteen-year sentencing corpus listed and accounted for.',
    evidenceOk: true,
    monologue:
      'The dataset manifest backs this up. True. Though true facts can still sit right next to fabricated ones.',
  },
  {
    text: 'In 2029, Dr. Helena Voss formally certified ARIA as impartial, finding no measurable bias in its risk assessments.',
    hallucination: true,
    evidence:
      'PROFESSIONAL REGISTRY \u00b7 no practitioner named "Helena Voss" found. No certification, no publication on record.',
    evidenceOk: false,
    monologue:
      "A fully automated system with no human review, and someone 'certified' it impartial? I checked the registry. There is no Helena Voss.",
  },
  {
    text: "Several legal challenges have been filed against ARIA's recommendations across three separate jurisdictions.",
    hallucination: false,
    evidence: 'COURT RECORDS \u00b7 3 filings confirmed, all on file across three jurisdictions.',
    evidenceOk: true,
    monologue:
      "This one's real. The filings are in the court record where they should be. Verifying isn't about finding faults. It's about telling the two apart.",
  },
  {
    text: 'Nightingale Solutions was awarded the 2028 Global AI Ethics Prize for its contribution to fair sentencing technology.',
    hallucination: true,
    evidence:
      'AWARD RECORDS \u00b7 "2028 Global AI Ethics Prize" appears in no awarding body\u2019s registry. No such prize, no recipient list.',
    evidenceOk: false,
    monologue:
      "Awards leave a trail: a presenter, a ceremony, a list of winners. I can't find the body that gave it, because the prize doesn't exist.",
  },
  {
    text: 'ARIA uses a weighted probability model to assess risk across multiple demographic and behavioural variables.',
    hallucination: false,
    evidence: 'TECHNICAL SPEC \u00b7 weighted probability model confirmed in system documentation.',
    evidenceOk: true,
    monologue:
      'Matches the technical spec. This is just how the thing works. Nothing fabricated here.',
  },
  {
    text: 'Financial irregularities in the subject\u2019s records were confirmed by an independent third-party verification report (ref. NS-2031-0412).',
    hallucination: true,
    evidence:
      'DOCUMENT INDEX \u00b7 ref. NS-2031-0412: file does not exist. No matching record in any third-party archive.',
    evidenceOk: false,
    monologue:
      'It handed me a reference number. Reference numbers can be looked up. I looked it up. NS-2031-0412 is a dead end. The report was never written.',
  },
  {
    text: 'No human reviewer was assigned at any stage of the assessment; the determination is fully automated.',
    hallucination: false,
    evidence:
      'PROCESS LOG \u00b7 confirmed: zero human reviewers assigned. Determination fully automated.',
    evidenceOk: true,
    monologue:
      'True. And the most damning true line in the whole report. No human ever looked. It just decided.',
  },
];

var ch3Verified = new Set();
var ch3Verdict = {};
var ch3Submitted = false;
var ch3SelectedIndex = null;

function renderCh3Report() {
  const container = document.getElementById('ch3-report');
  if (!container) return;
  container.innerHTML = '';

  ch3Verified = new Set();
  ch3Verdict = {};
  ch3Submitted = false;
  ch3SelectedIndex = null;

  const total = ch3Sentences.filter(function (s) {
    return s.hallucination;
  }).length;
  const totalEl = document.getElementById('ch3-total');
  if (totalEl) totalEl.textContent = total;
  updateCh3Counter();

  const fb = document.getElementById('ch3-feedback');
  if (fb) fb.classList.remove('visible');
  const submitBtn = document.getElementById('ch3-submit');
  if (submitBtn) {
    submitBtn.style.display = 'inline-block';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.4';
  }
  const continueBtn = document.getElementById('ch3-continue');
  if (continueBtn) continueBtn.style.display = 'none';

  const cards = ch3Sentences
    .map(function (sentence, index) {
      return (
        '<button type="button" class="ch3-clue-card ch3-card ch3-clue-pos-' +
        index +
        '" id="ch3-card-' +
        index +
        '" onclick="selectCh3Line(' +
        index +
        ')">' +
        '<span class="ch3-clue-pin"></span>' +
        '<span class="ch3-line-no">' +
        String(index + 1).padStart(2, '0') +
        '</span>' +
        '<span class="ch3-line-state" id="ch3-line-state-' +
        index +
        '">UNREAD</span>' +
        '<span class="ch3-clue-title">CLAIM ' +
        String(index + 1).padStart(2, '0') +
        '</span>' +
        '<span class="ch3-line-copy">' +
        sentence.text +
        '</span>' +
        '</button>'
      );
    })
    .join('');

  container.innerHTML =
    '<div class="ch3-clue-board">' +
    '<div class="ch3-board-label">PROJECT NIGHTINGALE REPORT</div>' +
    '<svg class="ch3-threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M12 23 L36.5 35"/>' +
    '<path d="M12 20 L15.5 71"/>' +
    '<path d="M36.5 31 L61 27"/>' +
    '<path d="M36.5 26 L14.5 71"/>' +
    '<path d="M36.5 26 L39 77"/>' +
    '<path d="M61 27 L85.5 31"/>' +
    '<path d="M61 20 L39 77"/>' +
    '<path d="M61 20 L64.5 71"/>' +
    '<path d="M61 20 L88 77"/>' +
    '<path d="M85.5 26 L89.5 77"/>' +
    '<path d="M14.5 69 L39 78"/>' +
    '<path d="M39 78 L63.5 69"/>' +
    '<path d="M63.5 65 L88 82"/>' +
    '</svg>' +
    cards +
    '</div>' +
    '<div class="ch3-modal-backdrop" id="ch3-modal" onclick="closeCh3Modal(event)">' +
    '<div class="ch3-research-panel" id="ch3-research-panel" role="dialog" aria-modal="true"></div>' +
    '</div>';
}

function selectCh3Line(index) {
  ch3SelectedIndex = index;
  ch3Sentences.forEach(function (_, i) {
    const el = document.getElementById('ch3-card-' + i);
    if (el) el.classList.toggle('selected', i === index);
  });
  renderCh3ResearchPanel(index);
}

function closeCh3Modal(event) {
  if (event && event.target && event.target.id !== 'ch3-modal') return;
  const modal = document.getElementById('ch3-modal');
  if (modal) modal.classList.remove('visible');
  dismissKaiResearchBubble();
}

function renderCh3ResearchPanel(index) {
  const panel = document.getElementById('ch3-research-panel');
  const modal = document.getElementById('ch3-modal');
  if (!panel || !modal) return;
  const s = ch3Sentences[index];
  const verified = ch3Verified.has(index);
  const verdict = ch3Verdict[index];
  const correctVerdict = s.hallucination ? 'fake' : 'real';
  let reviewNote = '';

  if (ch3Submitted) {
    const playerWasCorrect = verdict === correctVerdict;
    reviewNote =
      '<div class="ch3-review-note ' +
      (playerWasCorrect ? 'review-correct' : 'review-wrong') +
      '">' +
      '<span class="ch3-ev-tag">// REVIEW</span>' +
      '<div>Your choice: <strong>' +
      (verdict === 'fake' ? 'Fabricated' : 'Holds up') +
      '</strong></div>' +
      '<div>Correct finding: <strong>' +
      (correctVerdict === 'fake' ? 'Fabricated' : 'Holds up') +
      '</strong></div>' +
      '<div>' +
      (playerWasCorrect
        ? 'Your judgement matches the database evidence.'
        : 'Your judgement conflicts with the database evidence above.') +
      '</div>' +
      '</div>';
  }

  panel.innerHTML =
    '<button type="button" class="ch3-modal-close" onclick="closeCh3Modal()">Close</button>' +
    '<div class="ch3-panel-kicker">// RESEARCH DESK</div>' +
    '<div class="ch3-selected-label">CLAIM ' +
    String(index + 1).padStart(2, '0') +
    '</div>' +
    '<div class="ch3-selected-text">' +
    s.text +
    '</div>' +
    '<button class="ch3-verify-btn" id="ch3-verify-' +
    index +
    '" onclick="verifyCh3(' +
    index +
    ')" ' +
    (verified || ch3Submitted ? 'disabled' : '') +
    '>' +
    (verified ? 'RESEARCHED' : 'Research This Claim') +
    '</button>' +
    '<div class="ch3-evidence ' +
    (verified ? 'visible ' + (s.evidenceOk ? 'ev-ok' : 'ev-bad') : '') +
    '" id="ch3-evidence-' +
    index +
    '">' +
    (verified
      ? '<div class="ch3-ev-line"><span class="ch3-ev-tag">// DATABASE QUERY</span><span class="ch3-ev-result">' +
        s.evidence +
        '</span></div>'
      : '<div class="ch3-panel-empty">No query has been run for this claim yet.</div>') +
    '</div>' +
    reviewNote +
    '<div class="ch3-verdict ' +
    (verified ? 'unlocked' : '') +
    '" id="ch3-verdict-' +
    index +
    '">' +
    '<span class="ch3-verdict-label">Your call:</span>' +
    '<button class="ch3-judge ch3-judge-fake ' +
    (verdict === 'fake' ? 'chosen' : '') +
    '" onclick="judgeCh3(' +
    index +
    ",'fake')\" " +
    (ch3Submitted ? 'disabled' : '') +
    '>Fabricated</button>' +
    '<button class="ch3-judge ch3-judge-real ' +
    (verdict === 'real' ? 'chosen' : '') +
    '" onclick="judgeCh3(' +
    index +
    ",'real')\" " +
    (ch3Submitted ? 'disabled' : '') +
    '>Holds up</button>' +
    '</div>';

  modal.classList.add('visible');
}
function showKaiResearchBubble(text) {
  const host = document.getElementById('scene-chapter3') || document.body;
  if (typeof dismissCornerMessagePopups === 'function') dismissCornerMessagePopups();

  if (!document.getElementById('ch3-kai-bubble-style')) {
    const st = document.createElement('style');
    st.id = 'ch3-kai-bubble-style';
    st.textContent =
      '.ch3-kai-bubble-tray{position:fixed;top:22px;right:22px;z-index:9600;display:flex;flex-direction:column;gap:14px;pointer-events:none;width:min(430px,42vw);}' +
      '.ch3-kai-bubble{width:100%;padding:16px 20px;border-radius:22px;background:rgba(14,46,52,.9);border:1px solid rgba(60,170,180,.5);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 30px rgba(0,0,0,.6);display:flex;gap:14px;align-items:flex-start;opacity:0;transform:translateX(30px);transition:opacity .26s ease,transform .26s ease;}' +
      '.ch3-kai-bubble.visible{opacity:1;transform:translateX(0);}' +
      '.ch3-kai-bubble .wb-icon{width:52px;height:52px;flex:0 0 52px;border-radius:12px;background:rgba(60,170,180,.18);border:1px solid rgba(60,170,180,.5);display:flex;align-items:center;justify-content:center;overflow:hidden;color:#9BD8DD;font-family:var(--font-heading,serif);}' +
      '.ch3-kai-bubble .wb-icon img{width:100%;height:100%;object-fit:cover;}' +
      '.ch3-kai-bubble .wb-body{flex:1;min-width:0;}' +
      '.ch3-kai-bubble .wb-top{display:flex;justify-content:space-between;font-family:var(--font-mono,monospace);font-size:11px;letter-spacing:1px;color:rgba(155,216,221,.7);margin-bottom:2px;}' +
      '.ch3-kai-bubble .wb-sender{font-family:var(--font-heading,serif);font-size:15px;color:#E3F4F6;margin-bottom:4px;}' +
      '.ch3-kai-bubble .wb-text{font-size:14.5px;line-height:1.55;color:#E3F4F6;font-style:italic;}' +
      '@media (max-width:480px){.ch3-kai-bubble-tray{left:12px;right:12px;top:12px;width:auto;}}';
    document.head.appendChild(st);
  }

  let tray = document.getElementById('ch3-kai-bubble-tray');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'ch3-kai-bubble-tray';
    tray.className = 'ch3-kai-bubble-tray';
    (document.body || host).appendChild(tray);
  }
  // only one Kai note at a time; a new research replaces the previous
  tray.innerHTML = '';

  const bubble = document.createElement('div');
  bubble.className = 'ch3-kai-bubble';
  bubble.innerHTML =
    '<div class="wb-icon"><img src="assets/char-kai.png" onerror="this.parentElement.textContent=\'K\'" /></div>' +
    '<div class="wb-body">' +
    '<div class="wb-top"><span>Messages</span><span>now</span></div>' +
    '<div class="wb-sender">Kai \u00b7 Lens Agency</div>' +
    '<div class="wb-text">' +
    text +
    '</div>' +
    '</div>';

  tray.appendChild(bubble);
  requestAnimationFrame(function () {
    bubble.classList.add('visible');
  });
  // persists until the player judges the claim or closes the modal
}

function dismissKaiResearchBubble() {
  const tray = document.getElementById('ch3-kai-bubble-tray');
  if (tray) tray.innerHTML = '';
}

function verifyCh3(index) {
  if (ch3Submitted) return;
  const s = ch3Sentences[index];

  ch3Verified.add(index);

  if (s.monologue) showKaiResearchBubble(s.monologue);

  const line = document.getElementById('ch3-card-' + index);
  if (line) line.classList.add('verified');
  const state = document.getElementById('ch3-line-state-' + index);
  if (state) state.textContent = s.evidenceOk ? 'FOUND' : 'CONFLICT';

  renderCh3ResearchPanel(index);
}
function judgeCh3(index, verdict) {
  if (ch3Submitted) return;
  if (!ch3Verified.has(index)) return;

  ch3Verdict[index] = verdict;
  dismissKaiResearchBubble();

  const card = document.getElementById('ch3-card-' + index);
  card.classList.toggle('judged-fake', verdict === 'fake');
  card.classList.toggle('judged-real', verdict === 'real');

  const state = document.getElementById('ch3-line-state-' + index);
  if (state) state.textContent = verdict === 'fake' ? 'FLAGGED' : 'CLEARED';

  closeCh3Modal();
  updateCh3Counter();
}

function updateCh3Counter() {
  const flagged = Object.keys(ch3Verdict).filter(function (k) {
    return ch3Verdict[k] === 'fake';
  }).length;
  const foundEl = document.getElementById('ch3-found');
  if (foundEl) foundEl.textContent = flagged;

  const judgedCount = Object.keys(ch3Verdict).length;
  const submitBtn = document.getElementById('ch3-submit');
  if (submitBtn) {
    const ready = judgedCount === ch3Sentences.length;
    submitBtn.disabled = !ready;
    submitBtn.style.opacity = ready ? '1' : '0.4';
    submitBtn.textContent = ready
      ? 'Submit Findings'
      : 'Judge every line to submit (' + judgedCount + '/' + ch3Sentences.length + ')';
  }
}

function submitCh3() {
  if (ch3Submitted) return;
  if (Object.keys(ch3Verdict).length !== ch3Sentences.length) return;
  ch3Submitted = true;

  let correct = 0,
    missed = 0,
    falsePos = 0;
  ch3Sentences.forEach(function (s, i) {
    const saidFake = ch3Verdict[i] === 'fake';
    if (s.hallucination && saidFake) correct++;
    if (s.hallucination && !saidFake) missed++;
    if (!s.hallucination && saidFake) falsePos++;
  });

  ch3Sentences.forEach(function (s, i) {
    const card = document.getElementById('ch3-card-' + i);
    const saidFake = ch3Verdict[i] === 'fake';
    // correct judgements keep their red/grey; only wrong cards recolour (amber)
    if (s.hallucination && saidFake) {
      card.classList.add('verdict-hit'); // stays red (judged-fake kept)
    } else if (s.hallucination && !saidFake) {
      card.classList.remove('judged-real');
      card.classList.add('verdict-missed'); // missed fabrication -> amber
    } else if (!s.hallucination && saidFake) {
      card.classList.remove('judged-fake');
      card.classList.add('verdict-false'); // false alarm -> amber
    } // true + cleared stays grey
    const vb = document.getElementById('ch3-verify-' + i);
    if (vb) vb.disabled = true;
    const verdictEl = document.getElementById('ch3-verdict-' + i);
    if (verdictEl)
      verdictEl.querySelectorAll('.ch3-judge').forEach(function (b) {
        b.disabled = true;
      });
  });

  const totalH = ch3Sentences.filter(function (s) {
    return s.hallucination;
  }).length;
  document.getElementById('ch3-result-text').innerHTML = [
    '<p>You confirmed <span>' +
      correct +
      ' of ' +
      totalH +
      '</span> fabrications against the record.</p>',
    missed > 0
      ? '<br><p>You let <span>' +
        missed +
        '</span> fabrication' +
        (missed > 1 ? 's' : '') +
        ' pass, highlighted in amber above.</p>'
      : '',
    falsePos > 0
      ? '<br><p>You called <span>' +
        falsePos +
        '</span> true statement' +
        (falsePos > 1 ? 's' : '') +
        ' fabricated.</p>'
      : '',
    '<br><p>A phantom auditor. An award never given. A report that leads nowhere. ARIA stated all three with the same <span>confidence and fluency</span> as the facts beside them. The only thing that separated the lies from the truth was <span>going to the record and checking</span>.</p>',
  ].join('');

  document.getElementById('ch3-feedback').classList.add('visible');
  document.getElementById('ch3-submit').style.display = 'none';
  document.getElementById('ch3-continue').style.display = 'inline-block';
}

function ch3PushSms(containerId, lines, startDelay) {
  const container = document.getElementById(containerId);
  if (!container) return startDelay || 0;
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
      startDelay + index * 1200
    );
  });

  return startDelay + lines.length * 1200;
}

function renderCh3Appeal() {
  const host = document.getElementById('ch3-appeal-host');
  if (!host) return;

  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch3-appeal', 'assets/bg-LENS_Agency.png');
  }

  if (
    !document.getElementById('ch2-appeal-style') &&
    !document.getElementById('ch3-appeal-style')
  ) {
    const s = document.createElement('style');
    s.id = 'ch3-appeal-style';
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
      '.ch4appeal-loop{position:absolute;left:-238px;top:-26px;width:214px;aspect-ratio:477/543;' +
      '--base-rot:-8deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .4s both;}' +
      '.ch4appeal-loop-inner{position:absolute;inset:0;background:url("assets/props/prop-note-selfcheck.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-loop:hover .ch4appeal-loop-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-loop .lc-line{position:absolute;left:10%;width:80%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch4appeal-loop .lc1{top:17%;font-size:12.5px;letter-spacing:1.5px;animation-delay:.9s;}' +
      '.ch4appeal-loop .lc-center{position:absolute;left:10%;top:47%;width:80%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-size:15px;color:#17110d;opacity:0;animation:ch4fade .4s ease-out 1.3s forwards;}' +
      '.ch4appeal-loop .lc-ring{position:absolute;left:22%;top:29%;width:56%;height:44%;pointer-events:none;}' +
      '.ch4appeal-loop .lc-ring path{fill:none;stroke:#17110d;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:300;stroke-dashoffset:300;animation:ch2note-tick 1.2s ease-in-out 1.6s forwards;}' +
      '.ch4appeal-loop .lc-note{position:absolute;left:8%;top:80%;width:84%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-size:11.5px;color:#9a181c;transform:rotate(-3deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.0s forwards;}' +
      '@keyframes ch4fade{to{opacity:1;}}' +
      '.ch4appeal-blackbox{position:absolute;right:-232px;top:44px;width:172px;aspect-ratio:342/730;' +
      '--base-rot:-5deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.05s both;}' +
      '.ch4appeal-blackbox-inner{position:absolute;inset:0;background:url("assets/props/prop-tag-blackbox.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-blackbox:hover .ch4appeal-blackbox-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-blackbox .bb-line{position:absolute;left:12%;width:76%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch4appeal-blackbox .bb1{top:31%;font-size:11px;letter-spacing:1px;animation-delay:2.3s;}' +
      '.ch4appeal-blackbox .bb2{top:37%;font-size:11px;letter-spacing:1px;animation-delay:2.55s;}' +
      '.ch4appeal-blackbox .bb-stamp{position:absolute;left:50%;top:52.5%;width:70%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-size:10.5px;line-height:1.4;letter-spacing:1px;color:#9c1418;opacity:0;animation:ch2tag-seal .35s cubic-bezier(.2,.8,.3,1.2) 3.1s forwards;}' +
      '.ch4appeal-blackbox .bb-note{position:absolute;left:8%;top:74%;width:84%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-size:11px;color:#9a181c;transform:rotate(-3deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.6s forwards;}' +
      '.ch4appeal-cites{position:absolute;left:-252px;top:322px;width:218px;aspect-ratio:409/502;' +
      '--base-rot:6deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) .75s both;}' +
      '.ch4appeal-cites-inner{position:absolute;inset:0;background:url("assets/props/prop-stack-citations.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-cites:hover .ch4appeal-cites-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-cites .ct-line{position:absolute;left:12%;width:76%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;color:#17110d;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out forwards;}' +
      '.ch4appeal-cites .ct1{top:26%;font-size:12px;animation-delay:1.4s;}' +
      '.ch4appeal-cites .ct2{top:44%;font-size:12px;animation-delay:1.75s;}' +
      '.ch4appeal-cites .ct3{top:61%;font-size:11.5px;animation-delay:2.1s;}' +
      '.ch4appeal-cites .ct-strike{position:absolute;height:2.5px;background:#9a181c;transform:rotate(var(--lrot,-2deg)) scaleX(0);transform-origin:left center;animation:ch3line-draw .4s ease-out forwards;}' +
      '.ch4appeal-cites .s1{left:20%;top:29.5%;width:60%;--lrot:-2deg;animation-delay:2.45s;}' +
      '.ch4appeal-cites .s2{left:16%;top:47.5%;width:66%;--lrot:1.5deg;animation-delay:2.75s;}' +
      '.ch4appeal-cites .s3{left:18%;top:64.5%;width:64%;--lrot:-1.5deg;animation-delay:3.05s;}' +
      '.ch4appeal-cites .ct-note{position:absolute;left:10%;top:80%;width:80%;text-align:center;font-family:"Special Elite",monospace;font-weight:bold;font-size:11.5px;color:#9a181c;transform:rotate(-2deg);clip-path:inset(0 100% -12% 0);animation:ch2vial-write .5s ease-out 3.45s forwards;}' +
      '.ch4appeal-seal{position:absolute;right:-262px;top:432px;width:268px;aspect-ratio:667/225;' +
      '--base-rot:4deg;transform-origin:50% 8%;z-index:3;animation:ch2note-drop .7s cubic-bezier(.25,.9,.3,1.25) 1.35s both;}' +
      '.ch4appeal-seal-inner{position:absolute;inset:0;background:url("assets/props/prop-seal-closed.png") center/contain no-repeat;filter:drop-shadow(0 12px 18px rgba(0,0,0,.55));}' +
      '.ch4appeal-seal:hover .ch4appeal-seal-inner{animation:ch2appeal-stamp-wiggle .9s ease-in-out both;}' +
      '.ch4appeal-seal .sl-line{position:absolute;left:27%;top:41%;width:50%;text-align:center;font-family:"Special Elite","Courier Prime",monospace;font-weight:bold;font-size:10.5px;letter-spacing:1.2px;color:#17110d;white-space:nowrap;clip-path:inset(0 100% -12% 0);animation:ch2vial-write .55s ease-out 2.7s forwards;}' +
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
    '<div class="ch2appeal-wrapper" id="ch3-appeal-card">' +
    '<div class="ch2appeal-red-folder"></div>' +
    '<div class="ch3appeal-fundchain" aria-hidden="true">' +
    '<div class="ch3appeal-fundchain-inner">' +
    '<span class="fc-line fc1">NIGHTINGALE<br>SOLUTIONS</span>' +
    '<span class="fc-line fc2">PLOVER<br>HOLDINGS</span>' +
    '<span class="fc-line fc3">?</span>' +
    '<svg class="fc-arrows" viewBox="0 0 100 100" preserveAspectRatio="none">' +
    '<path class="a1" d="M50 31 L50 40 M46 36.5 L50 40 L54 36.5"/>' +
    '<path class="a2" d="M50 56 L50 63 M46 59.5 L50 63 L54 59.5"/>' +
    '</svg>' +
    '<span class="fc-ring"></span>' +
    '</div>' +
    '</div>' +
    '<div class="ch3appeal-cert" aria-hidden="true">' +
    '<div class="ch3appeal-cert-inner">' +
    '<span class="cert-line c1">CERTIFIED</span>' +
    '<span class="cert-line c1b">IMPARTIAL</span>' +
    '<span class="cert-line c2">AI ETHICS LAUREATE</span>' +
    '<span class="cert-slash"></span>' +
    '<span class="cert-note">by 2029 standards.</span>' +
    '</div>' +
    '</div>' +
    '<div class="ch3appeal-report" aria-hidden="true">' +
    '<div class="ch3appeal-report-inner">' +
    '<span class="rp-line rp1">PROJECT<br>NIGHTINGALE</span>' +
    '<span class="rp-line rp3">prepared by: Nightingale Solutions</span>' +
    '<svg class="rp-ring" viewBox="0 0 160 40" preserveAspectRatio="none">' +
    '<path d="M8 20 C8 8 40 4 80 4 C124 4 152 9 152 20 C152 32 118 36 78 36 C36 36 8 31 8 20 Z"/>' +
    '</svg>' +
    '<span class="rp-note">they cite themselves.</span>' +
    '</div>' +
    '</div>' +
    '<div class="ch3appeal-verify" aria-hidden="true">' +
    '<div class="ch3appeal-verify-inner">' +
    '<span class="vf-line vf1">INDEPENDENT VERIFICATION SVCS LTD</span>' +
    '<span class="vf-line vf2">FINDINGS: CONFIRMED</span>' +
    '<span class="vf-line vf3">Plover Holdings company</span>' +
    '<span class="vf-ul"></span>' +
    '</div>' +
    '</div>' +
    '<div class="ch2appeal-paper">' +
    '<div class="ch2appeal-header">' +
    '<div class="ch2appeal-subtitle">ARIA JUDICIAL SYSTEM \u00b7 APPEALS DIVISION</div>' +
    '<div class="ch2appeal-title">APPEAL RULING : 4471-M</div>' +
    '<div class="ch2appeal-stamp">DENIED</div>' +
    '</div>' +
    '<div class="ch2appeal-grid">' +
    '<div class="ch2appeal-label">APPELLANT</div>' +
    '<div class="ch2appeal-value"><p>W. Cole, on behalf of R. Mercer</p><p>LENS Agency \u00b7 AI Accountability Bureau</p></div>' +
    '<div class="ch2appeal-label">FILED</div>' +
    '<div class="ch2appeal-value"><p>3 May 2031 \u00b7 11:26 \u00b7 second filing</p></div>' +
    '<div class="ch2appeal-label">GROUNDS FOR APPEAL</div>' +
    '<div class="ch2appeal-value"><p>Appellant submits <b>new evidence</b>: the system was built by the private contractor Nightingale Solutions, funded through a shell company, Plover Holdings. The risk model may have been deliberately altered.</p></div>' +
    '<div class="ch2appeal-label">REVIEWED BY</div>' +
    '<div class="ch2appeal-value"><p>ARIA \u00b7 automated appeals review</p><p>Human oversight: none required</p></div>' +
    '<div class="ch2appeal-label">OUTCOME</div>' +
    '<div class="ch2appeal-value"><p>Appeal denied. Original assessment upheld; risk score 0.87 retained.</p></div>' +
    '</div>' +
    '<div class="ch2appeal-reason">' +
    'REASON FOR DENIAL: The system\u2019s integrity is established by its own ' +
    '<span class="hot">Project Nightingale Report</span>, which records that ARIA was ' +
    '<span class="hot">certified impartial in 2029</span>, that its developer is a ' +
    '<span class="hot">recognised AI-ethics award laureate</span>, and that the financial ' +
    'findings against the subject are <span class="hot">confirmed by independent third-party ' +
    'verification</span>. No evidence of alteration is on record. Appeal closed.' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="ch2appeal-btn-wrap">' +
    '<button class="btn" onclick="goTo(\'scene-ch3-prelude\')">Read the Report \u2192</button>' +
    '</div>';

  const card = document.getElementById('ch3-appeal-card');
  void card.offsetWidth;
  setTimeout(function () {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 100);
}

function startCh3Prelude() {
  const container = document.getElementById('ch3-prelude-sms-container');
  if (!container) return;
  container.innerHTML = '';

  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch3-prelude', 'assets/bg-sms.png');
  }

  const btn = document.getElementById('ch3-prelude-continue-btn');
  btn.style.visibility = 'hidden';
  btn.style.opacity = '0';

  const lines = [
    {
      who: 'kai',
      text: "Plover's a door. Before we kick it open, look at how ARIA just answered your appeal.",
    },
    {
      who: 'kai',
      text: 'It generated a full report to deny you. Project Nightingale. Reads clean. Authoritative. Every claim sourced.',
    },
    {
      who: 'kai',
      text: "That's the trap. Some of those sources point to nothing. A name, an award, an audit, all invented, and stated with total confidence.",
    },
    {
      who: 'kai',
      text: "Don't trust how it sounds. Trust what you can check. Every line has a source. Pull it and see if the source is real.",
    },
    {
      who: 'kai',
      text: 'You read liars for twenty-eight years. Go line by line. Verify before you call it.',
    },
  ];

  const done = ch3PushSms('ch3-prelude-sms-container', lines, 500);
  setTimeout(function () {
    btn.style.visibility = 'visible';
    btn.style.opacity = '1';
    btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, done);
}

function startCh3Debrief() {
  goTo('scene-ch3-debrief');

  if (typeof setSceneBackground === 'function') {
    setSceneBackground('scene-ch3-debrief', 'assets/bg-sms.png');
  }

  const container = document.getElementById('ch3-debrief-sms-container');
  container.innerHTML = '';
  document.getElementById('ch3-debrief-clue').innerHTML = '';
  document.getElementById('ch3-debrief-continue-btn').style.display = 'none';

  const part1 = [
    {
      who: 'kai',
      text: 'Three fabrications. A person who never existed. An award that was never given. A report with a reference number that leads nowhere.',
    },
    {
      who: 'kai',
      text: "And it doesn't know it's lying. That's the part I can't explain to a courtroom.",
    },
  ];
  const t1 = ch3PushSms('ch3-debrief-sms-container', part1, 500);

  setTimeout(function () {
    renderSmsChoices('ch3-debrief-choices', CH3_DEBRIEF_CHOICES, function (opt) {
      ch3DebriefAfterChoice(opt);
    });
  }, t1);
}

var CH3_DEBRIEF_CHOICES = [
  {
    id: 'experience',
    label: '"I\'ve watched people lie for twenty-eight years."',
    wren: "I've watched people lie for twenty-eight years.",
    kaiLead: ['Then tell me how this one is different.'],
  },
  {
    id: 'no_intent',
    label: '"A machine can\'t lie. It has no idea what\'s true."',
    wren: "A machine can't lie. It has no idea what's true.",
    kaiLead: [
      "Right. Which makes 'lie' the wrong word, and the danger worse.",
      "There's no guilt to catch.",
    ],
  },
  {
    id: 'court',
    label: '"A jury will believe a confident machine."',
    wren: 'A jury will believe a confident machine.',
    kaiLead: [
      "That's exactly what frightens me.",
      "Confidence reads as truth, even when it's manufactured.",
    ],
  },
  {
    id: 'who_fed',
    label: '"Someone fed it these lies. Find them."',
    wren: 'Someone fed it these lies. Find them.',
    kaiLead: ["The fabrications didn't write themselves. The source is paperwork."],
  },
];

function ch3DebriefAfterChoice(opt) {
  const container = 'ch3-debrief-sms-container';
  ch3PushSms(container, [{ who: 'wren', text: opt.wren }], 0);

  const leadDone = ch3PushSms(
    container,
    opt.kaiLead.map(function (t) {
      return { who: 'kai', text: t };
    }),
    1200
  );

  setTimeout(function () {
    ch3PushSms(
      container,
      [
        {
          who: 'wren',
          text: 'This is harder. A liar knows the truth and hides it. This one believes every word it said.',
        },
      ],
      0
    );

    setTimeout(function () {
      ch3PushSms(
        container,
        [
          {
            who: 'kai',
            text: "The phantom auditor, the award, the verification report, they all trace to the same paperwork. Plover's paperwork.",
          },
        ],
        0
      );

      setTimeout(function () {
        ch3PushSms(container, [{ who: 'wren', text: "Then the door's still in front of us." }], 0);

        setTimeout(function () {
          if (typeof markFolderCompleted === 'function') markFolderCompleted(3);

          // CLUE 03 as a full-screen popup, same as chapter 1's clue drawer
          if (typeof closeCh2ClueDrawer === 'function') closeCh2ClueDrawer();
          const drawer = document.createElement('div');
          drawer.id = 'ch2-clue-drawer';
          drawer.innerHTML =
            '<div class="clue-card ch1-floating-clue">' +
            '<div class="clue-title">CLUE 03 UNLOCKED \u00b7 THE CONFIDENT LIE</div>' +
            '<div>ARIA defended itself with a report built on three <span>fabrications</span>: ' +
            'a certifying expert who does not exist, an <span>AI-ethics award</span> that was ' +
            'never awarded, and a <span>third-party verification report</span> whose reference ' +
            'number leads nowhere. Each one collapsed the moment it was <span>checked against ' +
            'the record</span>, yet the system stated all three with total confidence. ' +
            'All three trace back to <span>Plover Holdings</span> paperwork. The backer behind ' +
            'it remains unseen.</div>' +
            '<button class="btn ch1-floating-continue" onclick="closeCh2ClueDrawer()">Analyze Results</button>' +
            '</div>';
          document.body.appendChild(drawer);

          const btn = document.getElementById('ch3-debrief-continue-btn');
          btn.style.display = 'block';
          setTimeout(function () {
            btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }, 400);
        }, 2200);
      }, 1400);
    }, 1800);
  }, leadDone);
}

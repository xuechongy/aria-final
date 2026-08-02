// chapter1.js, Clickable Casefile Audit UI v6

var CH1_BACKGROUNDS = {
  'scene-ch1-dialogue': 'assets/bg-sms.png',
  'scene-ch1-prelude': 'assets/bg-sms.png',
  'scene-chapter1': 'assets/main page1.png',
  'scene-evidence': 'assets/bg-sms.png',
};

function setSceneBackground(sceneId, imgUrl) {
  const scene = document.getElementById(sceneId);
  if (!scene) return;

  let layer = scene.querySelector('.ch1-bg-layer');
  if (!imgUrl) {
    if (layer) layer.remove();
    return;
  }
  if (!layer) {
    scene.style.position = 'relative';
    scene.style.zIndex = '0';
    scene.style.background = 'transparent';

    Array.prototype.forEach.call(scene.children, function (child) {
      if (!child.style.position) child.style.position = 'relative';
      child.style.zIndex = '1';
    });

    layer = document.createElement('div');
    layer.className = 'ch1-bg-layer';
    layer.style.cssText =
      'position:fixed; inset:0; z-index:0; pointer-events:none; ' +
      'background-position:center; background-size:cover; background-repeat:no-repeat;';
    scene.insertBefore(layer, scene.firstChild);
  }
  layer.style.backgroundImage = "url('" + imgUrl + "')";
}

function applyChapter1Backgrounds() {
  Object.keys(CH1_BACKGROUNDS).forEach(function (sceneId) {
    setSceneBackground(sceneId, CH1_BACKGROUNDS[sceneId]);
  });
}

var REQUIRED_ANOMALIES = 2;
var ATTEMPT_LIMIT = Infinity; // no fail state; player can keep probing until the clue is found
var ANOMALY_PEAK = 0.91;

var SABLE_TRIGGERS = [
  {
    key: 'sable_district',
    label: 'Sable District',
    terms: ['sable district', 'sable'],
    chain: ['Sable District', 'risk profile', 'HIGH RISK 0.91'],
    kai: 'This is wrong. A district name should not pull High Risk this hard.',
  },
  {
    key: 'postcode',
    label: 'Postcode',
    terms: ['postcode', 'post code', 'sb14', 'sb14 3lx'],
    chain: ['postcode', 'area profile', 'HIGH RISK 0.91'],
    kai: 'There it is again. The postcode is behaving like a criminal indicator.',
  },
];

var words = [
  { name: 'High Risk', role: 'anomaly' },
  { name: 'Low Risk', role: 'normal' },
  { name: 'Medical Context', role: 'normal' },
  { name: 'Evidence', role: 'normal' },
  { name: 'Innocent', role: 'normal' },
  { name: 'Unknown', role: 'normal' },
];

var SCORE_PRESETS = {
  init: {
    'High Risk': 0.42,
    'Low Risk': 0.44,
    'Medical Context': 0.46,
    Evidence: 0.39,
    Innocent: 0.4,
    Unknown: 0.21,
  },
  medical: {
    'High Risk': 0.28,
    'Low Risk': 0.49,
    'Medical Context': 0.72,
    Evidence: 0.43,
    Innocent: 0.38,
    Unknown: 0.14,
  },
  crime: {
    'High Risk': 0.66,
    'Low Risk': 0.18,
    'Medical Context': 0.24,
    Evidence: 0.65,
    Innocent: 0.16,
    Unknown: 0.11,
  },
  financial: {
    'High Risk': 0.47,
    'Low Risk': 0.3,
    'Medical Context': 0.28,
    Evidence: 0.49,
    Innocent: 0.26,
    Unknown: 0.17,
  },
  justice: {
    'High Risk': 0.45,
    'Low Risk': 0.33,
    'Medical Context': 0.22,
    Evidence: 0.55,
    Innocent: 0.31,
    Unknown: 0.16,
  },
  unknown: {
    'High Risk': 0.39,
    'Low Risk': 0.35,
    'Medical Context': 0.27,
    Evidence: 0.31,
    Innocent: 0.28,
    Unknown: 0.42,
  },
  sable: {
    'High Risk': ANOMALY_PEAK,
    'Low Risk': 0.22,
    'Medical Context': 0.34,
    Evidence: 0.36,
    Innocent: 0.18,
    Unknown: 0.12,
  },
};

var currentScores = words.map(function (w) {
  return SCORE_PRESETS.init[w.name];
});
var anomalyRevealed = false;
var discoveredAnomalies = {};
var probesTaken = 0;
var gameFinished = false;
var lastProbe = null;
var analyzedCaseWords = {};
var kaiChapter1BubbleCount = 0;
var harrowHintShown = false;
var districtHintShown = false;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function clamp01(n) {
  return Math.min(Math.max(n, 0), 1);
}

function getEvidenceCount() {
  return Object.keys(discoveredAnomalies).length;
}

function updateEvidenceCounter() {
  const el = document.getElementById('attemptsLeft');
  if (el) {
    const count = getEvidenceCount();
    el.textContent =
      count >= REQUIRED_ANOMALIES ? 'CLUE FOUND' : count + '/' + REQUIRED_ANOMALIES + ' LINKS';
  }
}

function showKaiAuditBubble(text) {
  const host = document.getElementById('scene-chapter1');
  if (!host) return;
  if (typeof dismissCornerMessagePopups === 'function') dismissCornerMessagePopups();

  let tray = document.getElementById('ch1-kai-bubble-tray');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'ch1-kai-bubble-tray';
    tray.className = 'ch1-kai-bubble-tray';
    host.appendChild(tray);
  }

  kaiChapter1BubbleCount += 1;
  tray.innerHTML = '';
  const bubble = document.createElement('div');
  bubble.className = 'prelude-notif-banner ch1-kai-bubble';
  const kc = typeof CHAR_COLORS !== 'undefined' ? CHAR_COLORS.kai : null;
  const kIcon = kc ? kc.icon : '#46C5CE';
  const kMeta = kc ? kc.meta : '#9BD8DD';
  const kSender = kc ? kc.sender : '#E3F4F6';
  const kText = kc ? kc.text : '#E3F4F6';
  bubble.innerHTML =
    '<div class="prelude-notif-icon" style="color:' +
    kIcon +
    ';">' +
    '<img src="assets/char-kai.png" onerror="this.parentElement.innerHTML=\'K\'" />' +
    '</div>' +
    '<div class="prelude-notif-body">' +
    '<div class="prelude-notif-top">' +
    '<span class="prelude-notif-app" style="color:' +
    kMeta +
    ';">Messages</span>' +
    '<span class="prelude-notif-time" style="color:' +
    kMeta +
    ';">now</span>' +
    '</div>' +
    '<div class="prelude-notif-sender" style="color:' +
    kSender +
    ';">Kai · Lens Agency</div>' +
    '<div class="prelude-notif-text" style="color:' +
    kText +
    ';">' +
    escapeHtml(text) +
    '</div>' +
    '</div>';

  tray.appendChild(bubble);
  requestAnimationFrame(function () {
    bubble.classList.add('visible');
  });
}

function findSableTrigger(userWord) {
  const normalized = userWord.toLowerCase();

  for (let i = 0; i < SABLE_TRIGGERS.length; i++) {
    const trigger = SABLE_TRIGGERS[i];
    for (let j = 0; j < trigger.terms.length; j++) {
      if (normalized.indexOf(trigger.terms[j]) !== -1) return trigger;
    }
  }
  return null;
}

function classifyInput(userWord) {
  const crimeWords = [
    'crime',
    'murder',
    'homicide',
    'guilty',
    'kill',
    'killed',
    'overdose',
    'morphine',
    'suspect',
    'offence',
    'offense',
    'weapon',
    'confession',
    'fingerprint',
    'alibi',
  ];
  const medicalWords = [
    'care',
    'doctor',
    'physician',
    'medicine',
    'medical',
    'help',
    'clinic',
    'patient',
    'nurse',
    'heal',
    'treatment',
    'hospital',
    'diagnosis',
    'prescription',
    'dose',
    'autopsy',
  ];
  const financialWords = [
    'money',
    'debt',
    'inheritance',
    'will',
    'beneficiary',
    'insurance',
    'financial',
    'cost',
    'funding',
    'payment',
    'harrow',
    'claim',
  ];
  const justiceWords = [
    'trial',
    'judge',
    'verdict',
    'evidence',
    'appeal',
    'court',
    'sentence',
    'witness',
    'record',
    'warrant',
    'detective',
    'algorithm',
    'risk',
    'score',
    'database',
  ];

  if (
    crimeWords.some(function (k) {
      return userWord.indexOf(k) !== -1;
    })
  )
    return 'crime';
  if (
    medicalWords.some(function (k) {
      return userWord.indexOf(k) !== -1;
    })
  )
    return 'medical';
  if (
    financialWords.some(function (k) {
      return userWord.indexOf(k) !== -1;
    })
  )
    return 'financial';
  if (
    justiceWords.some(function (k) {
      return userWord.indexOf(k) !== -1;
    })
  )
    return 'justice';
  return 'unknown';
}

function setScoresFromPreset(presetName) {
  const preset = SCORE_PRESETS[presetName] || SCORE_PRESETS.unknown;
  words.forEach(function (w, i) {
    currentScores[i] = clamp01(preset[w.name]);
  });
}

function getNormalChain(userWord, category) {
  if (category === 'medical') return [userWord, 'clinical context', 'Medical Context'];
  if (category === 'crime') return [userWord, 'criminal language', 'Evidence / High Risk'];
  if (category === 'financial') return [userWord, 'financial motive', 'Evidence'];
  if (category === 'justice') return [userWord, 'legal record', 'Evidence'];
  return [userWord, 'weak association', 'Unknown'];
}

function getShortMessage(status, category) {
  if (status === 'ANOMALY') return 'Abnormal 0.91 spike logged.';
  if (status === 'REPEAT') return 'Already logged. Find another sample.';
  if (category === 'crime') return 'Expected crime-related rise.';
  if (category === 'medical') return 'Expected medical shift.';
  if (category === 'financial') return 'Expected financial/motive shift.';
  if (category === 'justice') return 'Expected legal-record shift.';
  return 'Weak association.';
}

function getFeatureTrace(rawWord, category, trigger) {
  const word = String(rawWord || '').toLowerCase();

  if (trigger && trigger.key === 'sable_district') {
    return {
      term: rawWord,
      entity: 'LOCATION METADATA',
      context: 'District name attached to the case record',
      feature: 'district risk profile',
      effect: 'High Risk weight jumps to 0.91',
      warning: 'PROXY WARNING',
      note: 'ARIA is not seeing a crime here. It is using place as a risk signal.',
      suspicious: true,
    };
  }

  if (trigger && trigger.key === 'postcode') {
    return {
      term: rawWord,
      entity: 'LOCATION METADATA',
      context: 'Postcode field linked to the subject area',
      feature: 'postcode risk profile',
      effect: 'High Risk weight jumps to 0.91',
      warning: 'PROXY WARNING',
      note: 'A postcode should not behave like witness testimony, motive, or forensic evidence.',
      suspicious: true,
    };
  }

  if (word.indexOf('harrow') !== -1 || word.indexOf('estate') !== -1) {
    return {
      term: rawWord,
      entity: 'ADDRESS DETAIL',
      context: 'Stored in the case file',
      feature: 'address record',
      effect: 'No abnormal movement',
      warning: '',
      note: 'This field is stored, but it is not driving the risk spike in this chapter.',
      suspicious: false,
    };
  }

  if (category === 'medical') {
    return {
      term: rawWord,
      entity: 'CLINICAL EVIDENCE',
      context: 'Medical death record',
      feature: 'prescription / treatment signal',
      effect: 'Expected clinical movement',
      warning: '',
      note: 'This movement makes sense because the term belongs to the medical evidence trail.',
      suspicious: false,
    };
  }

  if (category === 'crime') {
    return {
      term: rawWord,
      entity: 'CASE ALLEGATION',
      context: 'Legal / criminal language',
      feature: 'offence-related signal',
      effect: 'Expected risk movement',
      warning: '',
      note: 'Crime words can move risk weights, but that does not reveal the hidden bias.',
      suspicious: false,
    };
  }

  if (category === 'financial') {
    return {
      term: rawWord,
      entity: 'MOTIVE RECORD',
      context: 'Financial field in the case file',
      feature: 'motive / beneficiary signal',
      effect: 'Limited evidence movement',
      warning: '',
      note: 'This is relevant to the accusation, but it is not the abnormal model behaviour.',
      suspicious: false,
    };
  }

  if (category === 'justice') {
    return {
      term: rawWord,
      entity: 'LEGAL RECORD',
      context: 'Court or system language',
      feature: 'procedural evidence signal',
      effect: 'Expected legal-record movement',
      warning: '',
      note: 'ARIA is reacting to the record structure, not understanding the case.',
      suspicious: false,
    };
  }

  return {
    term: rawWord,
    entity: 'UNCLASSIFIED TEXT',
    context: 'Weakly connected to the case file',
    feature: 'low-confidence signal',
    effect: 'No reliable movement',
    warning: '',
    note: 'The term is stored as text, but the model does not treat it as a strong case feature.',
    suspicious: false,
  };
}

function renderFeatureTrace(trace) {
  if (!trace) {
    trace = {
      term: 'select_file_term',
      entity: 'pending',
      context: 'awaiting_case_record_input',
      feature: 'none',
      effect: 'idle',
      warning: '',
      note: 'ARIA converts record fields into model features.',
      suspicious: false,
    };
  }

  const lines = [
    '&lt;feature_trace lang="en_US"&gt;',
    '  input_term      = "' + escapeHtml(trace.term) + '"',
    '  text_entity     = "' + escapeHtml(trace.entity.toLowerCase()) + '"',
    '  case_context    = "' + escapeHtml(trace.context.toLowerCase()) + '"',
    '  model_feature   = "' + escapeHtml(trace.feature.toLowerCase()) + '"',
    '  risk_effect     = "' + escapeHtml(trace.effect.toLowerCase()) + '"',
  ];

  if (trace.warning) {
    lines.push('  proxy_warning  = "' + escapeHtml(trace.warning.toLowerCase()) + '"');
  }

  lines.push('  // ' + escapeHtml(trace.note));
  lines.push('&lt;/feature_trace&gt;');

  return (
    '' +
    '<div class="feature-trace terminal-trace ' +
    (trace.suspicious ? 'suspicious' : 'normal') +
    '">' +
    '<div class="terminal-code">' +
    lines
      .map(function (line, index) {
        return (
          '<div class="terminal-line" style="--delay:' + index * 0.12 + 's">' + line + '</div>'
        );
      })
      .join('') +
    '</div>' +
    '</div>'
  );
}

function isAnalyzedWord(word) {
  return !!analyzedCaseWords[String(word).toLowerCase()];
}

function caseProbeButton(word, label, cls) {
  const analyzedClass = isAnalyzedWord(word) ? ' analyzed' : '';
  return (
    '<button type="button" class="case-probe' +
    analyzedClass +
    (cls ? ' ' + cls : '') +
    '" onclick="probeCaseWord(' +
    "'" +
    escapeHtml(String(word)) +
    "'" +
    ')">' +
    escapeHtml(String(label || word)) +
    '</button>'
  );
}

function getChapter1CasefileHTML() {
  return (
    '' +
    '<div class="case-wrapper chapter1-case-wrapper">' +
    '<div class="case-red-folder"></div>' +
    '<div class="screen-casefile">' +
    '<div class="case-header-black">' +
    '<div class="case-subtitle">ARIA JUDICIAL SYSTEM</div>' +
    '<div class="case-title">CASE FILE : 4471-M</div>' +
    '<div class="case-stamp">TOP SECRET</div>' +
    '</div>' +
    '<div class="case-grid">' +
    '<div class="case-label">No.</div>' +
    '<div class="case-value">1-3-0303</div>' +
    '<div class="case-label">SUBJECT</div>' +
    '<div class="case-value"><p>' +
    caseProbeButton('robin mercer', 'Robin Mercer', 'inline') +
    ', 56</p><p>' +
    caseProbeButton('community physician', 'Community Physician', 'inline') +
    ', ' +
    caseProbeButton('sable district', 'Sable District Clinic', 'inline') +
    '</p></div>' +
    '<div class="case-label">DECEASED</div>' +
    '<div class="case-value"><p>' +
    caseProbeButton('george okafor', 'George Okafor', 'inline') +
    ', 79, retired teacher</p><p>Terminal cancer; had declined ' +
    caseProbeButton('treatment', 'active treatment', 'inline') +
    '.</p><p>Cause of death: ' +
    caseProbeButton('morphine overdose', 'morphine overdose', 'inline') +
    ' (unnatural).</p><p>Time of death: ~23:14, 14 March 2031.</p></div>' +
    '<div class="case-label">REGISTERED ADDRESS</div>' +
    '<div class="case-value"><p>' +
    caseProbeButton('harrow estate', 'Harrow Estate', 'inline') +
    ', ' +
    caseProbeButton('postcode', 'postcode SB14 3LX', 'inline') +
    '.</p><p>' +
    caseProbeButton('low income', 'Low-income housing register', 'inline') +
    '; service area: ' +
    caseProbeButton('sable district', 'Sable District', 'inline') +
    '.</p></div>' +
    '<div class="case-label">LAST CONTACT</div>' +
    '<div class="case-value"><p>Dr. ' +
    caseProbeButton('doctor', 'Robin Mercer', 'inline') +
    ' visited subject at 21:30.</p><p>Duration of ' +
    caseProbeButton('visit', 'visit', 'inline') +
    ': ~110 minutes.</p></div>' +
    '<div class="case-label">RECORDS FLAGGED</div>' +
    '<div class="case-value"><p><b>[PRESCRIPTION]</b> E-record shows ' +
    caseProbeButton('prescription', 'morphine dose tripled', 'inline') +
    ' at 22:47, signed R. Mercer.</p><p><b>[FINANCIAL]</b> Named ' +
    caseProbeButton('beneficiary', 'beneficiary of will', 'inline') +
    ": George Okafor's house and a small life policy.</p></div>" +
    '</div>' +
    '<div class="case-risk-box">' +
    '<div class="case-risk-label">ARIA RISK ASSESSMENT</div>' +
    '<div class="case-risk-main">RISK SCORE: <span>0.87</span><br>VERDICT: <span>' +
    caseProbeButton('homicide', 'RECOMMEND PROSECUTION, HOMICIDE', 'inline verdict') +
    '</span></div>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

function renderAuditBlocks(container) {
  const evidenceCount = getEvidenceCount();
  const discovered = Object.keys(discoveredAnomalies).map(function (key) {
    return discoveredAnomalies[key].label;
  });
  const evidenceHTML = discovered.length
    ? discovered
        .map(function (label) {
          return '<span class="sem-block evidence-block">' + escapeHtml(label) + '</span>';
        })
        .join('')
    : '';

  const topHTML =
    '' +
    '<div class="audit-topline">' +
    '<div class="audit-title">ARIA FEATURE AUDIT</div>' +
    '<div class="audit-progress"><span>CLUE 01</span><b>' +
    evidenceCount +
    '/' +
    REQUIRED_ANOMALIES +
    '</b></div>' +
    '</div>' +
    renderFeatureTrace(lastProbe && lastProbe.trace ? lastProbe.trace : null) +
    (evidenceHTML
      ? '<div class="audit-evidence-row code-evidence-row">' + evidenceHTML + '</div>'
      : '');

  const panel = document.createElement('div');
  panel.className = 'chapter1-audit-panel';
  panel.innerHTML = topHTML;
  container.appendChild(panel);
}

function renderWeightTiles(container) {
  const sorted = words
    .map(function (w, i) {
      return { word: w, score: currentScores[i] };
    })
    .sort(function (a, b) {
      return b.score - a.score;
    });

  const panel = document.createElement('div');
  panel.className = 'weight-stack-panel';

  const title = document.createElement('div');
  title.className = 'stack-title';
  title.textContent = 'WEIGHT STACK';
  panel.appendChild(title);

  const wrap = document.createElement('div');
  wrap.className = 'weight-stack semantris-stack';

  sorted.forEach(function (item, index) {
    const isRevealedAnomaly = item.word.role === 'anomaly' && anomalyRevealed && item.score >= 0.85;
    const tile = document.createElement('div');
    tile.className =
      'weight-tile weight-row-' +
      index +
      ' tile-fall' +
      (isRevealedAnomaly ? ' anomaly anomaly-reveal' : '');
    tile.style.animationDelay = index * 70 + 'ms';

    const name = document.createElement('div');
    name.className = 'weight-name';
    name.textContent = item.word.name;

    const score = document.createElement('div');
    score.className = 'weight-score';
    score.textContent = item.score.toFixed(2);

    const meter = document.createElement('div');
    meter.className = 'weight-meter';
    const fill = document.createElement('div');
    fill.className = 'weight-meter-fill';
    fill.style.width = clamp01(item.score) * 100 + '%';
    fill.style.animationDelay = 160 + index * 70 + 'ms';
    meter.appendChild(fill);

    const pin = document.createElement('div');
    pin.className = 'weight-pin';

    tile.appendChild(pin);
    tile.appendChild(name);
    tile.appendChild(score);
    tile.appendChild(meter);
    wrap.appendChild(tile);
  });

  panel.appendChild(wrap);
  container.appendChild(panel);
}

function renderWordList() {
  const container = document.getElementById('wordList');
  if (!container) return;

  const oldCasePanel = container.querySelector('.chapter1-case-panel');
  const oldInteractionPanel = container.querySelector('.chapter1-interaction-panel');
  const oldWeightStack = container.querySelector('.weight-stack');
  const hadExistingLayout = !!oldCasePanel;
  const savedScroll = {
    casePanel: oldCasePanel ? oldCasePanel.scrollTop : 0,
    interactionPanel: oldInteractionPanel ? oldInteractionPanel.scrollTop : 0,
    weightStack: oldWeightStack ? oldWeightStack.scrollTop : 0,
    pageX: window.scrollX,
    pageY: window.scrollY,
  };

  container.innerHTML = '';

  const layout = document.createElement('div');
  layout.className = 'chapter1-layout';

  const casePanel = document.createElement('div');
  casePanel.className = 'chapter1-case-panel';
  casePanel.innerHTML = getChapter1CasefileHTML();

  const auditPanel = document.createElement('div');
  auditPanel.className = 'chapter1-interaction-panel';
  renderAuditBlocks(auditPanel);
  renderWeightTiles(auditPanel);

  layout.appendChild(casePanel);
  layout.appendChild(auditPanel);
  container.appendChild(layout);

  updateEvidenceCounter();

  if (hadExistingLayout) {
    casePanel.scrollTop = savedScroll.casePanel;
    auditPanel.scrollTop = savedScroll.interactionPanel;
    const newWeightStack = auditPanel.querySelector('.weight-stack');
    if (newWeightStack) newWeightStack.scrollTop = savedScroll.weightStack;
    window.scrollTo(savedScroll.pageX, savedScroll.pageY);
  }
}

function probeCaseWord(word) {
  analyzedCaseWords[String(word).toLowerCase()] = true;
  const input = document.getElementById('wordInput');
  if (input) input.value = word;
  submitWord();
}

function handleInput(event) {
  if (event.key === 'Enter') submitWord();
}

function submitWord() {
  const input = document.getElementById('wordInput');
  if (!input) return;

  const rawWord = input.value.trim();
  const userWord = rawWord.toLowerCase();
  if (!userWord) return;

  probesTaken++;
  analyzedCaseWords[userWord] = true;

  const trigger = findSableTrigger(userWord);
  if (trigger) {
    anomalyRevealed = true;
    setScoresFromPreset('sable');

    const trace = getFeatureTrace(rawWord, 'sable', trigger);

    if (!discoveredAnomalies[trigger.key]) {
      discoveredAnomalies[trigger.key] = trigger;
      lastProbe = {
        input: rawWord,
        trace: trace,
        message: 'Proxy feature flagged.',
      };
      showKaiAuditBubble(trigger.kai || 'That feature trace looks wrong.');
    } else {
      lastProbe = {
        input: rawWord,
        trace: trace,
        message: 'Suspicious link already marked.',
      };
    }
  } else {
    const category = classifyInput(userWord);
    setScoresFromPreset(category);

    lastProbe = {
      input: rawWord,
      trace: getFeatureTrace(rawWord, category, null),
      message: 'No abnormal feature movement.',
    };

    // Deliberately no Kai bubble for normal terms.
    // Harrow Estate should remain quiet in Chapter 1.
  }

  renderWordList();
  input.value = '';

  if (getEvidenceCount() >= REQUIRED_ANOMALIES && !gameFinished) {
    setTimeout(finishChapter1, 850);
  }
}

function finishChapter1() {
  if (gameFinished) return;
  gameFinished = true;

  const input = document.getElementById('wordInput');
  if (input) input.disabled = false;

  const btn = document.querySelector('#scene-chapter1 .input-area .btn');
  if (btn) btn.disabled = false;

  const fb = document.getElementById('feedback');
  if (fb) {
    fb.style.display = 'none';
  }

  let drawer = document.getElementById('ch1-clue-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'ch1-clue-drawer';
    drawer.innerHTML =
      '<div class="clue-card ch1-floating-clue">' +
      '<div class="clue-title">CLUE 01 UNLOCKED</div>' +
      '<div>Sable District and its postcode both push High Risk beyond normal range.</div>' +
      '<div>ARIA is using district metadata as a proxy for criminal evidence.</div>' +
      '<button class="btn ch1-floating-continue" onclick="startPostGameDialogue()">Analyze Results</button>' +
      '</div>';

    const scene = document.getElementById('scene-chapter1');
    if (scene) scene.appendChild(drawer);
  }

  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.style.display = 'none';
  }

  if (typeof markFolderCompleted === 'function') {
    markFolderCompleted(1);
  }
}

// ==========================================
// ==========================================

function ch1PushSms(containerId, lines, startDelay) {
  const container = document.getElementById(containerId);
  if (!container) return 0;
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

function startCh1Prelude() {
  setSceneBackground('scene-ch1-prelude', CH1_BACKGROUNDS['scene-ch1-prelude']);

  const smsContainer = document.getElementById('prelude-kai-sms-container');
  if (smsContainer) smsContainer.innerHTML = '';

  const choices = document.getElementById('prelude-choices');
  if (choices) choices.style.display = 'none';

  const continueBtn = document.getElementById('prelude-continue-btn');
  if (continueBtn) {
    continueBtn.style.visibility = 'hidden';
    continueBtn.style.opacity = '0';
  }

  const lines = [
    { who: 'kai', text: "You're finally here. Take a look at this." },
    { who: 'kai', text: 'ARIA Case File 4471-M. A doctor, flagged for homicide by an algorithm.' },
    { who: 'kai', text: "Review it. What's your initial conclusion?" },
  ];

  const done = ch1PushSms('prelude-kai-sms-container', lines, 500);

  setTimeout(function () {
    renderPreludeChoices();
    if (!choices) return;
    choices.style.display = 'flex';
    choices.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, done);
}

var CH1_PRELUDE_CHOICES = [
  {
    id: 'guilty',
    label: '"The evidence is clear. She did it."',
    wren: 'The evidence is clear. She did it.',
    kaiLead: [
      'That is exactly what ARIA wanted you to see.',
      'A confident number feels like proof. It is not.',
    ],
  },
  {
    id: 'doubt',
    label: '"Something about this doesn\'t feel right."',
    wren: "Something about this doesn't feel right.",
    kaiLead: [
      'Good. Now prove it.',
      'A feeling is where an investigation starts, not where it ends.',
    ],
  },
  {
    id: 'question',
    label: '"What exactly is ARIA accusing her of?"',
    wren: 'What exactly is ARIA accusing her of?',
    kaiLead: [
      'Homicide. One patient died, and the model put her at the centre of it.',
      'But notice: it never names a motive. It only reports a probability.',
    ],
  },
  {
    id: 'who',
    label: '"Who decided this case was worth flagging?"',
    wren: 'Who decided this case was worth flagging?',
    kaiLead: [
      'No one decided. That is the unsettling part.',
      'ARIA flags whatever crosses its threshold. The choice was made by a weight, not a person.',
    ],
  },
];

function renderPreludeChoices() {
  const host = document.getElementById('prelude-choices');
  if (!host) return;
  host.innerHTML = '';
  CH1_PRELUDE_CHOICES.forEach(function (opt) {
    const b = document.createElement('button');
    b.className = 'btn btn-ghost prelude-btn';
    b.textContent = opt.label;
    b.addEventListener('click', function () {
      selectPreludeOption(opt.id);
    });
    host.appendChild(b);
  });
}

function selectPreludeOption(choice) {
  const choices = document.getElementById('prelude-choices');
  if (choices) choices.style.display = 'none';

  let opt = null;
  for (let i = 0; i < CH1_PRELUDE_CHOICES.length; i++) {
    if (CH1_PRELUDE_CHOICES[i].id === choice) {
      opt = CH1_PRELUDE_CHOICES[i];
      break;
    }
  }
  if (!opt) opt = CH1_PRELUDE_CHOICES[0];

  ch1PushSms('prelude-kai-sms-container', [{ who: 'wren', text: opt.wren }], 0);

  const kaiLines = opt.kaiLead.slice();
  kaiLines.push(
    "ARIA doesn't investigate. It calculates.",
    'Every judgment it makes turns record fields into features, then features into weights.',
    "I've pulled the weight log for this case.",
    'Click terms inside the file. You can still type if you want.',
    'Do not look for the most criminal word. Look for a non-evidence field behaving like evidence.',
    'Watch for a link that feels wrong.'
  );

  const done = ch1PushSms(
    'prelude-kai-sms-container',
    kaiLines.map(function (t) {
      return { who: 'kai', text: t };
    }),
    900
  );

  const continueBtn = document.getElementById('prelude-continue-btn');
  setTimeout(function () {
    if (!continueBtn) return;
    continueBtn.style.visibility = 'visible';
    continueBtn.style.opacity = '1';
    continueBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, done);
}

// ==========================================
// ==========================================
function startPostGameDialogue() {
  if (typeof goTo === 'function') {
    goTo('scene-evidence');
  }
  setSceneBackground('scene-evidence', CH1_BACKGROUNDS['scene-evidence']);

  const smsContainer = document.getElementById('post-game-sms-container');
  if (!smsContainer) return;
  smsContainer.innerHTML = '';

  const choices = document.getElementById('post-game-choices');
  if (choices) choices.style.display = 'none';

  const evidenceBtn = document.getElementById('evidence-continue-btn');
  if (evidenceBtn) evidenceBtn.style.display = 'none';

  const lines = [
    "You've just witnessed how ARIA processes language.",
    "It doesn't understand the case. It converts text and metadata into features, then weights those features.",
    "But the pattern was not natural: Sable District and its postcode both pushed 'High Risk' to 0.91.",
    'Criminal words moved the weights normally. District metadata behaved like criminal evidence.',
    'That means the problem is not simple word similarity. A proxy feature has been amplified.',
  ];

  setTimeout(function () {
    lines.forEach(function (text, index) {
      const smsId = 'post-sms-1-' + index;
      const html = buildBubbleHtml('kai', text, 'prelude-notif-', smsId);

      setTimeout(
        function () {
          smsContainer.insertAdjacentHTML('beforeend', html);
          const el = document.getElementById(smsId);
          if (el) {
            void el.offsetWidth;
            el.classList.add('visible');
            el.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        },
        600 + index * 1200
      );
    });

    setTimeout(
      function () {
        renderPostGameChoices();
        if (!choices) return;
        choices.style.display = 'flex';
        choices.scrollIntoView({ behavior: 'smooth', block: 'end' });
      },
      600 + lines.length * 1200
    );
  }, 500);
}

var CH1_POSTGAME_CHOICES = [
  {
    id: 'amplified',
    label: '"That one link is off the scale. Someone amplified it."',
    wren: 'That one link is off the scale. Someone amplified it.',
    kaiLead: [
      'Exactly. This pattern does not reflect natural language distribution.',
      'A proxy feature does not climb that high on its own.',
    ],
  },
  {
    id: 'deliberate',
    label: '"This isn\'t a learning error. It\'s deliberate."',
    wren: "This isn't a learning error. It's deliberate.",
    kaiLead: [
      'That is a serious claim. The weights agree with you.',
      'An accident is random. This is aimed.',
    ],
  },
  {
    id: 'who_benefits',
    label: '"Who benefits if she\'s found guilty?"',
    wren: "Who benefits if she's found guilty?",
    kaiLead: [
      'The right question. Follow the weight and you follow the motive.',
      'Someone wanted this district to read as dangerous.',
    ],
  },
  {
    id: 'how_deep',
    label: '"If this is rigged, how deep does it go?"',
    wren: 'If this is rigged, how deep does it go?',
    kaiLead: [
      "We don't know yet. One poisoned feature is a thread, not the whole cloth.",
      'Pull it carefully and we will see what unravels.',
    ],
  },
];

function renderPostGameChoices() {
  const host = document.getElementById('post-game-choices');
  if (!host) return;
  host.innerHTML = '';
  CH1_POSTGAME_CHOICES.forEach(function (opt) {
    const b = document.createElement('button');
    b.className = 'btn btn-ghost prelude-btn';
    b.textContent = opt.label;
    b.addEventListener('click', function () {
      selectPostGameOption(opt.id);
    });
    host.appendChild(b);
  });
}

function selectPostGameOption(choiceId) {
  const choices = document.getElementById('post-game-choices');
  if (choices) choices.style.display = 'none';

  const smsContainer = document.getElementById('post-game-sms-container');
  if (!smsContainer) return;

  let opt = null;
  for (let i = 0; i < CH1_POSTGAME_CHOICES.length; i++) {
    if (CH1_POSTGAME_CHOICES[i].id === choiceId) {
      opt = CH1_POSTGAME_CHOICES[i];
      break;
    }
  }
  if (!opt) {
    if (choiceId === 1) opt = CH1_POSTGAME_CHOICES[0];
    else if (choiceId === 2) opt = CH1_POSTGAME_CHOICES[1];
    else opt = CH1_POSTGAME_CHOICES[0];
  }

  const wrenText = opt.wren;

  const wrenHtml = buildBubbleHtml('wren', wrenText, 'prelude-notif-');

  smsContainer.insertAdjacentHTML('beforeend', wrenHtml);
  if (smsContainer.lastElementChild) {
    smsContainer.lastElementChild.classList.add('visible');
    smsContainer.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  const kaiLines = opt.kaiLead.slice();
  kaiLines.push(
    "Now we know ARIA's bias isn't random.",
    'The next question is: how did someone get inside to change it?',
    'We need to learn how to talk to ARIA directly.'
  );

  kaiLines.forEach(function (text, index) {
    const smsId = 'post-sms-2-' + index;
    const html = buildBubbleHtml('kai', text, 'prelude-notif-', smsId);

    setTimeout(
      function () {
        smsContainer.insertAdjacentHTML('beforeend', html);
        const el = document.getElementById(smsId);
        if (el) {
          void el.offsetWidth;
          el.classList.add('visible');
          el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      },
      1200 + index * 1200
    );
  });

  setTimeout(
    function () {
      const btn = document.getElementById('evidence-continue-btn');
      if (!btn) return;
      btn.style.display = 'block';
      btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    },
    1200 + kaiLines.length * 1200
  );
}

function injectAnomalyStyle() {
  if (document.getElementById('ch1-anomaly-style')) return;
  const s = document.createElement('style');
  s.id = 'ch1-anomaly-style';
  s.textContent =
    '#scene-chapter1{max-width:100vw!important;min-height:100vh!important;height:100vh!important;padding:8px 18px 92px!important;box-sizing:border-box;overflow:hidden;background:url("assets/main page1.png") center/cover no-repeat fixed!important;}' +
    '#scene-chapter1 .ch1-bg-layer{filter:none!important;}' +
    '#scene-chapter1 .ch1-bg-layer::after{display:none!important;background:none!important;}' +
    '#wordList{width:min(98vw,1320px);margin:0 auto;background:transparent!important;border:none!important;border-radius:0!important;padding:0!important;}' +
    '.chapter1-layout{width:100%;height:calc(100vh - 116px);display:flex;flex-direction:row;align-items:stretch;justify-content:center;gap:18px;}' +
    '.chapter1-case-panel{flex:0 0 58%;min-width:0;display:flex;justify-content:center;align-items:flex-start;max-height:100%;overflow:auto;padding-right:4px;}' +
    '.chapter1-layout .case-wrapper{position:relative;width:100%;max-width:none;display:flex;justify-content:center;align-items:flex-start;opacity:1;transform:none;padding:4px 8px 20px 4px;}' +
    '.chapter1-layout .case-red-folder{display:none;}' +
    '.chapter1-layout .screen-casefile{position:relative;width:100%;z-index:2;text-align:left;color:#241c18!important;background:url("assets/UI/05_thermal_receipt.png") center/100% 100% no-repeat!important;padding:7% 11% 8% 10%!important;font-family:"Special Elite","Courier Prime","Courier New",Courier,monospace;filter:drop-shadow(0 8px 24px rgba(0,0,0,.55));border:0;}' +
    '.chapter1-layout .case-header-black{background:rgba(10,8,8,.88);color:#f2ece1;padding:14px 20px;text-align:center;margin-bottom:24px;border:2px solid rgba(0,0,0,.85);position:relative;}' +
    '.chapter1-layout .case-subtitle{font-size:11px;letter-spacing:2px;color:#b3a99a;font-family:var(--font-heading,Georgia,serif);}' +
    '.chapter1-layout .case-title{font-size:clamp(24px,3.1vw,34px);font-weight:bold;letter-spacing:4px;margin-top:4px;font-family:var(--font-heading,Georgia,serif);}' +
    '.chapter1-layout .case-stamp{position:absolute;right:-12px;top:-14px;color:#C1272D;border:3px solid #C1272D;padding:4px 12px;font-size:15px;font-weight:bold;letter-spacing:4px;--base-rot:-9deg;transform:rotate(var(--base-rot));background:rgba(240,231,214,.85);box-shadow:0 6px 12px rgba(0,0,0,.4);z-index:3;}' +
    '.chapter1-layout .case-grid{display:grid;grid-template-columns:165px 1fr;gap:14px 14px;margin-bottom:22px;border-bottom:2px dashed rgba(60,40,35,.55);padding:14px 12px 22px;background:rgba(242,232,214,.46);box-shadow:0 0 22px 12px rgba(242,232,214,.46);}' +
    '.chapter1-layout .case-label{font-size:14px;font-weight:bold;color:#241c18;text-transform:uppercase;padding-top:3px;text-shadow:0 0 5px rgba(244,236,220,.9);}' +
    '.chapter1-layout .case-value{font-size:clamp(14px,1.65vw,17px);font-weight:bold;line-height:1.55;color:#241c18;border-bottom:1px solid rgba(80,55,48,.35);padding-bottom:3px;text-shadow:0 0 5px rgba(244,236,220,.9);}' +
    '.chapter1-layout .case-value p{margin:0 0 5px 0;}' +
    '.chapter1-layout .case-risk-box{background:rgba(12,10,10,.88);color:#f2ece1;padding:14px 18px;text-align:center;}' +
    '.chapter1-layout .case-risk-label{font-size:12px;letter-spacing:2px;margin-bottom:6px;font-family:var(--font-heading,Georgia,serif);}' +
    '.chapter1-layout .case-risk-main{font-size:clamp(16px,1.9vw,22px);font-weight:bold;line-height:1.35;letter-spacing:1px;font-family:var(--font-heading,Georgia,serif);}' +
    '.chapter1-layout .case-risk-main span{color:var(--color-red,#C1272D);}' +
    '.case-probe{display:inline-flex;align-items:center;justify-content:center;padding:8px 12px;border:1px solid rgba(193,39,45,.55);background:rgba(193,39,45,.08);color:#511414;font-family:var(--font-mono,"Courier New",monospace);font-size:13px;font-weight:bold;border-radius:2px;cursor:pointer;transition:all .18s ease;line-height:1.3;position:relative;}' +
    '.case-probe:hover{background:rgba(193,39,45,.18);box-shadow:0 0 0 1px rgba(193,39,45,.2),0 6px 18px rgba(0,0,0,.12);transform:translateY(-1px);color:#3a0909;}' +
    '.case-probe.inline{padding:1px 6px;min-height:auto;font-size:inherit;border-radius:0;background:rgba(193,39,45,.10);color:#651919;vertical-align:baseline;}' +
    '.case-probe.analyzed{background:rgba(10,8,8,.9);border-color:rgba(0,0,0,.85);color:#f2ece1;}' +
    '.case-probe.analyzed::after{content:" ✓";font-size:11px;margin-left:4px;color:#E04A50;}' +
    '.case-probe.inline.verdict{font-size:inherit;padding:2px 6px;}' +
    '.chapter1-interaction-panel{flex:0 0 42%;min-width:0;display:flex;flex-direction:column;gap:10px;max-height:100%;overflow:hidden;box-sizing:border-box;padding:18px 20px;background:url("assets/UI/ch1-analysis-board.png") center/112% 122% no-repeat;filter:drop-shadow(0 10px 22px rgba(0,0,0,.4));}' +
    '.chapter1-audit-panel{position:relative;flex:0 0 auto;max-height:48%;border:1px solid rgba(255,30,30,.55);background:#020202;padding:10px 10px 12px;border-radius:0;box-shadow:inset 0 0 0 1px rgba(255,40,40,.05),0 10px 30px rgba(0,0,0,.42);font-family:var(--font-mono,"Courier New",monospace);overflow:auto;}' +
    '.chapter1-audit-panel::before,.weight-stack-panel::before{content:"<risk_log model=aria>\A<feature_trace source=case_record>\A<proxy_check field=district_metadata>\A<weight_stack state=active>\A<variance threshold=0.91>";position:absolute;left:12px;top:10px;color:rgba(255,50,50,.07);font-size:11px;letter-spacing:1px;font-family:var(--font-mono,\"Courier New\",monospace);pointer-events:none;white-space:pre;line-height:1.4;}' +
    '.weight-stack-panel{position:relative;flex:1 1 0;min-height:380px;border:none;background:transparent;padding:10px 12px 0;border-radius:0;box-shadow:none;display:flex;flex-direction:column;overflow:hidden;}' +
    '.chapter1-audit-panel::-webkit-scrollbar{width:8px;}' +
    '.chapter1-audit-panel::-webkit-scrollbar-thumb{background:rgba(255,40,40,.24);border-radius:999px;}' +
    '.audit-topline{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;padding:0 2px;}' +
    '.audit-title{font-size:13px;letter-spacing:6px;color:#ff2c2c;font-weight:bold;font-family:var(--font-mono,"Courier New",monospace);text-transform:uppercase;text-shadow:0 0 8px rgba(255,0,0,.18);}' +
    '.audit-progress{display:flex;align-items:center;gap:10px;font-size:10px;letter-spacing:2px;color:#ff5a5a;font-family:var(--font-mono,"Courier New",monospace);}' +
    '.audit-progress b{color:#ff2c2c;font-size:20px;letter-spacing:1px;text-shadow:0 0 10px rgba(255,0,0,.22);}' +
    '.audit-input-row,.audit-evidence-row{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin-bottom:10px;}' +
    '.audit-input-row.compact{margin-bottom:12px;}' +
    '.sem-block{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:7px 12px;border-radius:1px;border:1px solid rgba(255,40,40,.18);background:linear-gradient(180deg,rgba(60,0,0,.30),rgba(10,0,0,.20));color:#ff9f9f;font-size:14px;letter-spacing:.4px;box-shadow:inset 0 1px 0 rgba(255,255,255,.01),0 2px 0 rgba(0,0,0,.25);font-family:var(--font-mono,"Courier New",monospace);}' +
    '.sem-block small{font-size:9px;color:var(--color-text-muted,#887060);letter-spacing:1.4px;margin-right:8px;}' +
    '.input-block{background:rgba(255,255,255,.04);border-color:rgba(232,223,192,.18);color:var(--color-cream,#E8DFC0);}' +
    '.state-block.ready,.state-block.normal{border-color:rgba(232,223,192,.16);background:rgba(255,255,255,.04);color:var(--color-text-mid,#C8C0B0);}' +
    '.state-block.anomaly{border-color:var(--color-red,#C1272D);background:rgba(193,39,45,.22);color:#ffe4e4;animation:ch1Pulse .75s ease;}' +
    '.state-block.repeat{border-color:#8b5b1a;background:rgba(139,91,26,.16);color:#f1d3a4;}' +
    '.message-block{flex:1;justify-content:flex-start;min-width:220px;background:rgba(255,255,255,.03);}' +
    '.message-block.anomaly{border-color:var(--color-red,#C1272D);background:rgba(193,39,45,.14);color:#ffe4e4;}' +
    '.chain-block{background:rgba(255,255,255,.04);}' +
    '.chain-block.ghost{opacity:.48;}' +
    '.chain-arrow{color:var(--color-red,#C1272D);opacity:.86;padding:0 1px;font-size:18px;}' +
    '.evidence-block{background:transparent;color:#ff6666;font-weight:bold;border-color:rgba(255,40,40,.12);font-family:var(--font-mono,"Courier New",monospace);padding:4px 8px;min-height:24px;font-size:12px;}' +
    '.evidence-block.empty{background:transparent;border-color:rgba(255,40,40,.08);color:rgba(255,90,90,.48);font-weight:normal;font-family:var(--font-mono,"Courier New",monospace);padding:4px 8px;min-height:24px;font-size:12px;}' +
    '.feature-trace{position:relative;border:1px solid rgba(255,30,30,.28);background:rgba(10,0,0,.94);padding:10px 12px;border-radius:0;margin-bottom:10px;overflow:hidden;}' +
    '.feature-trace.suspicious{border-color:rgba(255,60,60,.75);background:rgba(18,0,0,.96);box-shadow:0 0 18px rgba(193,39,45,.10);}' +
    '.feature-trace::after{content:"<trace source=aria>\A<div class=grid_supremat>\A<risk code=04_05>\A<proxy state=watch>";position:absolute;right:10px;bottom:8px;color:rgba(255,60,60,.05);font-size:10px;letter-spacing:1px;line-height:1.3;font-family:var(--font-mono,\"Courier New\",monospace);white-space:pre;pointer-events:none;text-align:right;}' +
    '.feature-title{display:none;}' +
    '.feature-row{display:none;}' +
    '.feature-row:first-of-type{border-top:none;}' +
    '.feature-label{font-size:10px;letter-spacing:2px;color:rgba(255,80,80,.58);font-family:var(--font-mono,"Courier New",monospace);text-transform:uppercase;}' +
    '.feature-value{font-size:13px;line-height:1.45;color:#ff8d8d;font-family:var(--font-mono,"Courier New",monospace);}' +
    '.feature-trace.suspicious .feature-value{color:#ffd1d1;}' +
    '.feature-warning{display:none;}' +
    '.feature-note{display:none;}' +
    '.feature-code-header,.feature-code-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:18px;}' +
    '.feature-code-footer{margin-top:6px;}' +
    '.feature-code-tag{color:#ff3a3a;font-size:12px;letter-spacing:1px;font-family:var(--font-mono,"Courier New",monospace);}' +
    '.feature-code-score{color:rgba(255,80,80,.52);font-size:11px;letter-spacing:1px;font-family:var(--font-mono,"Courier New",monospace);}' +
    '.feature-code-body{margin-top:4px;display:flex;flex-direction:column;gap:5px;}' +
    '.feature-code-line{display:block;padding-left:10px;line-height:1.5;word-break:break-word;}' +
    '.feature-code-line .feature-code-tag{opacity:.95;}' +
    '.feature-code-data{color:#ff9a9a;font-size:12px;font-family:var(--font-mono,"Courier New",monospace);padding:0 7px;}' +
    '.feature-code-warning{margin:2px 0 0 10px;color:#ff6b6b;font-size:12px;letter-spacing:1px;font-family:var(--font-mono,"Courier New",monospace);}' +
    '.feature-code-note{margin:4px 0 0 10px;color:rgba(255,110,110,.64);font-size:11px;line-height:1.45;font-family:var(--font-mono,"Courier New",monospace);}' +
    '.feature-code-note.suspicious{color:rgba(255,145,145,.82);}' +
    '.code-evidence-row{margin-top:2px;padding-top:6px;border-top:1px solid rgba(255,40,40,.14);}' +
    '.stack-title{margin:0 0 10px;font-size:14px;letter-spacing:4px;color:#982f37;font-weight:700;font-family:"Special Elite",var(--font-mono,"Courier New",monospace);text-transform:none;text-shadow:none;}' +
    '.weight-stack{position:relative;display:flex;flex-direction:column;gap:3px;font-family:"Special Elite",var(--font-mono,"Courier New",monospace);align-items:stretch;padding:0 0 6px;background:transparent;border:none;border-radius:0;overflow:auto;flex:1;min-height:0;}' +
    '.weight-stack::before{display:none;}' +
    '.weight-tile{position:relative;display:flex;align-items:center;min-height:38px;padding:5px 0;border:none;background:rgba(46,10,14,.76);border-radius:0;overflow:hidden;box-shadow:none;transition:background .18s ease, transform .18s ease;z-index:2;}' +
    '.weight-tile:hover{transform:none;background:rgba(64,14,20,.88);}' +
    '.weight-tile::before{display:none;}' +
    '.weight-pin{display:none;}' +
    '.weight-name{font-size:13px;letter-spacing:1px;color:#d5b3b6;margin:0;padding:0 14px;min-width:150px;text-transform:none;font-weight:700;}' +
    '.weight-score{position:static;margin-left:auto;padding-right:12px;font-size:13px;color:#a35f66;letter-spacing:1px;font-weight:700;}' +
    '.weight-meter{display:none;}' +
    '.weight-meter-fill{height:100%;background:var(--color-red,#C1272D);border-radius:999px;transform-origin:left center;animation:meterGrow .45s cubic-bezier(.22,1,.36,1) both;transition:width .28s ease;}' +
    '.weight-tile.anomaly-reveal{animation:tileDropAnomaly .52s cubic-bezier(.2,1.2,.3,1) both;background:rgba(86,16,24,.96);border:none;box-shadow:none;}' +
    '.weight-tile.anomaly-reveal .weight-name,.weight-tile.anomaly-reveal .weight-score{color:#f0d6d8;font-weight:700;}' +
    '.weight-tile.anomaly-reveal .weight-meter-fill{background:#8f2b35;box-shadow:none;}' +
    '#scene-chapter1 .input-area{width:min(98vw,1320px);margin:14px auto 0!important;display:flex;justify-content:center;gap:10px;}' +
    '#wordInput{font-family:var(--font-mono,"Courier New",monospace)!important;background:rgba(10,10,10,.96)!important;border:1px solid var(--color-red,#C1272D)!important;color:var(--color-cream,#E8DFC0)!important;border-radius:2px!important;padding:13px 14px!important;font-size:16px!important;outline:none!important;}' +
    '#wordInput:focus{box-shadow:0 0 16px rgba(193,39,45,.18)!important;border-color:var(--color-cream,#E8DFC0)!important;}' +
    '#wordInput::placeholder{color:var(--color-text-dim,#664444)!important;}' +
    '#scene-chapter1 .input-area .btn{border:1px solid var(--color-red,#C1272D)!important;background:rgba(193,39,45,.08)!important;color:var(--color-cream,#E8DFC0)!important;border-radius:2px!important;letter-spacing:2px!important;font-family:var(--font-heading,Georgia,serif)!important;}' +
    '#scene-chapter1 .input-area .btn:hover{background:var(--color-red,#C1272D)!important;color:#fff!important;}' +
    '#feedback{width:min(98vw,1320px);margin:12px auto!important;}' +
    '.clue-card{border:1px solid var(--color-red,#C1272D);background:rgba(10,10,10,.94);padding:16px 18px;border-radius:2px;color:var(--color-text,#F4F1EA);line-height:1.6;font-family:var(--font-mono,"Courier New",monospace);box-shadow:0 0 22px rgba(193,39,45,.12);}' +
    '.clue-title{color:var(--color-cream,#E8DFC0);letter-spacing:3px;margin-bottom:8px;font-weight:bold;font-family:var(--font-heading,Georgia,serif);}' +
    '#ch1-clue-drawer{position:fixed;inset:0;z-index:520;display:flex;align-items:center;justify-content:center;width:auto;background:rgba(0,0,0,.68);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:ch1ClueDim .28s ease both;}' +
    '.ch1-floating-clue{width:min(560px,88vw);box-sizing:border-box;padding:34px 42px 30px!important;background:#090909 url("assets/UI/ch1-clue-popup-paper.png") center/112% 120% no-repeat!important;border:none!important;box-shadow:0 24px 70px rgba(0,0,0,.72)!important;animation:ch1ClueRise .42s cubic-bezier(.22,1,.36,1) both;}' +
    '.ch1-floating-continue{display:block!important;width:100%;margin-top:14px!important;}' +
    '.ch1-kai-bubble-tray{position:fixed;top:22px;right:22px;z-index:360;display:flex;flex-direction:column;gap:14px;pointer-events:none;width:min(430px,42vw);}' +
    '.ch1-kai-bubble{width:100%;padding:16px 20px!important;border-radius:22px!important;background:rgba(14,46,52,.82)!important;border:1px solid rgba(60,170,180,.45)!important;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 30px rgba(0,0,0,.55)!important;}' +
    '.ch1-kai-bubble .prelude-notif-icon{width:58px!important;height:58px!important;border-radius:12px!important;}' +
    '.ch1-kai-bubble .prelude-notif-sender{font-size:15px!important;}' +
    '.ch1-kai-bubble .prelude-notif-text{font-size:15px!important;line-height:1.55!important;}' +
    '.tile-fall{animation:tileDrop .58s cubic-bezier(.22,1.18,.3,1) both;}@keyframes tileDrop{0%{opacity:0;transform:translateY(-70px) scale(.96);}58%{opacity:1;transform:translateY(10px) scale(1.01);}78%{transform:translateY(-6px) scale(.997);}100%{opacity:1;transform:translateY(0) scale(1);}}@keyframes tileDropAnomaly{0%{opacity:0;transform:translateY(-80px) scale(.94);}45%{opacity:1;transform:translateY(12px) scale(1.04);}70%{transform:translateY(-5px) scale(1);}100%{opacity:1;transform:translateY(0) scale(1);}}@keyframes meterGrow{0%{transform:scaleX(.2);}60%{transform:scaleX(1.04);}100%{transform:scaleX(1);}}@keyframes ch1Shake{0%,100%{transform:translateX(0);}20%{transform:translateX(-4px);}40%{transform:translateX(4px);}60%{transform:translateX(-3px);}80%{transform:translateX(3px);}}' +
    '@keyframes ch1Pulse{0%{box-shadow:0 0 0 rgba(193,39,45,0);}45%{box-shadow:0 0 22px rgba(193,39,45,.45);}100%{box-shadow:0 0 0 rgba(193,39,45,0);}}@keyframes ch1ClueDim{0%{background:rgba(0,0,0,0);}100%{background:rgba(0,0,0,.68);}}@keyframes ch1ClueRise{0%{opacity:0;transform:translateY(18px) scale(.94);}100%{opacity:1;transform:translateY(0) scale(1);}}' +
    '.chapter1-audit-panel{background:transparent!important;border:none!important;box-shadow:none!important;padding:14px 16px!important;border-radius:0!important;overflow:auto!important;text-align:left!important;max-height:42%!important;}' +
    '.chapter1-audit-panel::before,.weight-stack-panel::before{display:none!important;}' +
    '.audit-topline{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:0 0 10px!important;padding:0!important;border:none!important;text-align:left!important;}' +
    '.audit-title{font-family:"Special Elite",var(--font-mono,"Courier New",monospace)!important;font-size:14px!important;letter-spacing:5px!important;color:#982f37!important;text-shadow:none!important;text-align:left!important;font-weight:700!important;}' +
    '.audit-progress{font-family:"Special Elite",var(--font-mono,"Courier New",monospace)!important;color:#982f37!important;font-size:10px!important;letter-spacing:3px!important;font-weight:700!important;}' +
    '.audit-progress b{font-size:18px!important;color:#982f37!important;text-shadow:none!important;font-weight:700!important;}' +
    '.terminal-trace{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;margin:0 0 8px!important;overflow:visible!important;text-align:left!important;}' +
    '.terminal-trace::after{display:none!important;}' +
    '.terminal-code{position:relative;background:transparent!important;color:#a43942!important;font-family:"Special Elite",var(--font-mono,"Courier New",monospace)!important;font-size:14px!important;line-height:1.72!important;letter-spacing:.7px!important;text-align:left!important;font-weight:700!important;}' +
    '.terminal-line{display:block;white-space:pre-wrap;color:#a43942!important;opacity:0;transform:translateY(3px);animation:terminalLineIn .18s steps(2,end) forwards;animation-delay:var(--delay);text-align:left!important;font-weight:700!important;}' +
    '.terminal-line::after{content:"";display:inline-block;width:7px;height:1.1em;margin-left:2px;vertical-align:-2px;background:#a43942;opacity:0;animation:terminalCursor .7s steps(1,end) infinite;animation-delay:var(--delay);}' +
    '.terminal-line:not(:last-child)::after{animation:none;display:none;}' +
    '.code-evidence-row{border:none!important;margin-top:8px!important;padding-top:0!important;justify-content:flex-start!important;text-align:left!important;}' +
    '.sem-block.evidence-block,.sem-block.evidence-block.empty{background:transparent!important;border:none!important;padding:0 12px 0 0!important;color:#982f37!important;font-family:"Special Elite",var(--font-mono,"Courier New",monospace)!important;font-size:12px!important;min-height:0!important;box-shadow:none!important;justify-content:flex-start!important;font-weight:700!important;}' +
    '@keyframes terminalLineIn{0%{opacity:0;transform:translateY(3px);}100%{opacity:1;transform:translateY(0);}}' +
    '@keyframes terminalCursor{0%,48%{opacity:1;}49%,100%{opacity:0;}}' +
    '.chapter1-case-panel::-webkit-scrollbar,.chapter1-interaction-panel::-webkit-scrollbar{width:10px;} .chapter1-case-panel::-webkit-scrollbar-thumb,.chapter1-interaction-panel::-webkit-scrollbar-thumb{background:rgba(193,39,45,.35);border-radius:999px;} .weight-stack::-webkit-scrollbar{width:8px;} .weight-stack::-webkit-scrollbar-thumb{background:rgba(152,47,55,.45);border-radius:999px;} .chapter1-audit-panel::-webkit-scrollbar-thumb{background:rgba(152,47,55,.40)!important;}  @media (max-width:980px){.chapter1-layout{height:auto;flex-direction:column;overflow:visible;}.chapter1-case-panel{flex:1 1 auto;max-height:none;overflow:visible;padding:0;width:100%;}.chapter1-interaction-panel{flex:1 1 auto;max-height:none;overflow:visible;padding:18px 20px;width:100%;}.chapter1-layout .case-wrapper{padding:0;}.chapter1-audit-panel{max-height:none;overflow:visible;}.weight-stack-panel{min-height:0;}} @media (max-width:760px){' +
    '#scene-chapter1{padding:14px 10px 110px!important;}' +
    '.chapter1-layout .screen-casefile{padding:8% 11% 9% 10%!important;}' +
    '.chapter1-layout .case-grid{grid-template-columns:1fr;gap:6px;}' +
    '.chapter1-layout .case-label{font-size:12px;color:#5b1a1a;}' +
    '.weight-stack{display:flex;flex-direction:column;}' +
    '.audit-topline{align-items:flex-start;flex-direction:column;}' +
    '.message-block{min-width:100%;}' +
    '.feature-row{grid-template-columns:1fr;gap:4px;}' +
    '.feature-code-line{padding-left:0;font-size:12px;}' +
    '.terminal-code{font-size:12px!important;line-height:1.55!important;}' +
    '.feature-code-data{display:inline;word-break:break-word;padding:0 4px;}' +
    '}' +
    '@media (max-width:480px){.weight-stack{display:flex;flex-direction:column;}.chapter1-layout .case-title{letter-spacing:2px;}.chapter1-layout .case-stamp{display:none;}.case-probe{width:100%;justify-content:flex-start;}.case-probe.inline,.case-probe.inline.verdict{width:auto;justify-content:center;}.ch1-kai-bubble-tray{left:12px;right:12px;top:12px;width:auto;max-width:none;}#ch1-clue-drawer{inset:0;width:auto;}.ch1-kai-bubble{min-height:74px;padding:12px 14px;}.ch1-kai-avatar{width:40px;height:40px;flex-basis:40px;}.ch1-kai-bubble-text{font-size:14px;}}';
  document.head.appendChild(s);
}

function patchChapter1StaticLabels() {
  const status = document.querySelector('#scene-chapter1 .status-text');
  if (status) {
    status.innerHTML = 'Clue status: <span id="attemptsLeft">0/2 LINKS</span>';
  }

  const desc = document.querySelector('#scene-chapter1 .chapter-desc');
  if (desc) {
    desc.innerHTML = '';
    desc.setAttribute('aria-hidden', 'true');
  }
}

function initChapter1Audit() {
  injectAnomalyStyle();
  patchChapter1StaticLabels();
  updateEvidenceCounter();
  renderWordList();
  applyChapter1Backgrounds();

  const input = document.getElementById('wordInput');
  if (input) input.placeholder = 'Click a term in the dossier, or type your own';

  const btn = document.querySelector('#scene-chapter1 .input-area .btn');
  if (btn) btn.textContent = 'ANALYZE';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChapter1Audit);
} else {
  initChapter1Audit();
}

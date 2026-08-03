/* Submit text-entry controls from the keyboard while keeping their buttons usable. */
document.addEventListener('keydown', function (event) {
  if (event.key !== 'Enter' || event.isComposing) return;

  const field = event.target;
  if (!field || !field.matches) return;

  const isTextInput = field.matches(
    'input[type="text"], input[type="search"], input[type="email"], ' +
      'input[type="password"], input[type="number"], input[type="url"], input[type="tel"]'
  );
  const isTextAreaSubmit = field.matches('textarea') && (event.ctrlKey || event.metaKey);
  if (!isTextInput && !isTextAreaSubmit) return;
  if (field.disabled || field.readOnly) return;

  const group = field.closest('.input-area, .support-input-row, form');
  if (!group) return;

  const button = group.querySelector(
    'button[type="submit"]:not(:disabled), button:not([type]):not(:disabled), button[type="button"]:not(:disabled)'
  );
  if (!button) return;

  event.preventDefault();
  button.click();
});

function goTo(sceneId) {
  if (
    typeof deferNavigationForCharacterTape === 'function' &&
    deferNavigationForCharacterTape(function () {
      goTo(sceneId);
    })
  ) {
    return;
  }

  __pendingAnimTimers = [];
  dismissCornerMessagePopups();

  document.querySelectorAll('.scene').forEach(function (s) {
    s.classList.remove('active');
  });
  document.getElementById(sceneId).classList.add('active');
  window.scrollTo(0, 0);

  updateGlobalHomeBtn(sceneId);
  if (sceneId === 'scene-directory') updateArchiveFolderLocks();

  updateSmsSkipBtn(sceneId);

  const kaiTaskReminders = {
    'scene-chapter1':
      'Click terms inside the case file. Watch how ARIA converts records into features.',
    'scene-chapter2':
      'ARIA is hiding something. Use language to break through its defences. Three levels; each one is harder to crack. Type your answer in the green area.',
    'scene-chapter3':
      'Verify each line against the record before you judge it. Fluent writing is not proof.',
    'scene-chapter4':
      'ARIA will not permit inspection. Work through each attack in order and secure evidence the court cannot ignore.',
  };
  if (kaiTaskReminders[sceneId]) {
    setTimeout(function () {
      const active = document.querySelector('.scene.active');
      if (active && active.id === sceneId) showKaiTaskPopup(kaiTaskReminders[sceneId]);
    }, 420);
  }

  if (typeof ensureCharacterTapeUI === 'function') {
    ensureCharacterTapeUI();
    updateTapeArchiveButton(sceneId);
    setTimeout(function () {
      unlockTapesForScene(sceneId);
    }, 520);
  }

  if (sceneId === 'scene-briefing') {
    initBriefing();
  }
  if (sceneId === 'scene-ch1-prelude') {
    startCh1Prelude();
  }
  if (sceneId === 'scene-ch2-prelude') {
    startCh2Prelude();
  }
  if (sceneId === 'scene-ch2-appeal') {
    renderCh2Appeal();
  }
  if (sceneId === 'scene-ch3-appeal') {
    renderCh3Appeal();
  }
  if (sceneId === 'scene-ch3-prelude') {
    startCh3Prelude();
  }
  if (sceneId === 'scene-chapter3') {
    renderCh3Report();
  }
  if (sceneId === 'scene-ch4-appeal') {
    renderCh4Appeal();
  }
  if (sceneId === 'scene-ch4-prelude') {
    startCh4Prelude();
  }
  if (sceneId === 'scene-ch4-reopen') {
    renderCh4Reopen();
  }
  if (sceneId === 'scene-ch4-closing') {
    startCh4Closing();
  }

  if (HL_SCENES[sceneId]) {
    [120, 700, 1600, 3000].forEach(function (d) {
      setTimeout(function () {
        const scene = document.getElementById(sceneId);
        if (scene) {
          try {
            highlightInContainer(scene);
          } catch (e) {}
        }
      }, d);
    });
  }
}

function dismissCornerMessagePopups() {
  ['kai-task-popup-tray', 'ch1-kai-bubble-tray', 'ch3-kai-bubble-tray', 'ch4-bubble-tray'].forEach(
    function (id) {
      const tray = document.getElementById(id);
      if (tray) tray.innerHTML = '';
    }
  );
}

var HL_SCENES = {
  'scene-evidence': true,
  'scene-ch2-appeal': true,
  'scene-ch2-debrief': true,
  'scene-ch3-appeal': true,
  'scene-chapter3': true,
  'scene-ch3-debrief': true,
  'scene-ch4-appeal': true,
  'scene-ch4-reopen': true,
  'scene-ch4-debrief': true,
  'scene-ending': true,
};

function markFolderCompleted(chapterNum) {
  const folder = document.querySelector('.folder-' + chapterNum + '-h');
  if (folder) {
    folder.classList.add('folder-completed');
  }
  // Completing a chapter unlocks its CLUE card for the Character Library right page.
  if (typeof unlockedClues !== 'undefined') {
    unlockedClues[chapterNum] = true;
    if (typeof updateTapeArchiveButton === 'function') updateTapeArchiveButton();
  }
  updateArchiveFolderLocks();
}

// ============================================================
// DEBUG 调试总开关
// 改成 true：解除所有章节/关卡的顺序限制，可自由跳转（方便检查修改）。
// 改回 false：恢复正常游戏流程（提交作业前务必改回 false）。
// ============================================================
var DEBUG_UNLOCK_ALL = true;

// TEMP: allow direct access to every chapter while pages are being reviewed.
// Set this back to false to restore the normal sequential chapter progression.
var ARCHIVE_UNLOCK_ALL = DEBUG_UNLOCK_ALL;

function isArchiveChapterUnlocked(chapterNum) {
  if (ARCHIVE_UNLOCK_ALL) return true;
  if (chapterNum <= 1) return true;
  const previous = document.querySelector('.folder-' + (chapterNum - 1) + '-h');
  return !!(previous && previous.classList.contains('folder-completed'));
}

function updateArchiveFolderLocks() {
  for (let chapter = 1; chapter <= 4; chapter++) {
    const folder = document.querySelector('.folder-' + chapter + '-h');
    if (!folder) continue;
    const unlocked = isArchiveChapterUnlocked(chapter);
    folder.classList.toggle('folder-locked', !unlocked);
    folder.setAttribute('aria-disabled', unlocked ? 'false' : 'true');
  }
}

function openArchiveFolder(chapterNum) {
  updateArchiveFolderLocks();
  if (!isArchiveChapterUnlocked(chapterNum)) {
    const folder = document.querySelector('.folder-' + chapterNum + '-h');
    if (folder) {
      folder.classList.remove('folder-lock-denied');
      void folder.offsetWidth;
      folder.classList.add('folder-lock-denied');
    }
    if (typeof showKaiTaskPopup === 'function') {
      showKaiTaskPopup('Complete FILE_0' + (chapterNum - 1) + ' before opening this file.');
    }
    return;
  }

  const scenes = {
    1: 'scene-ch1-prelude',
    2: 'scene-ch2-appeal',
    3: 'scene-ch3-appeal',
    4: 'scene-ch4-appeal',
  };
  if (scenes[chapterNum]) goTo(scenes[chapterNum]);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateArchiveFolderLocks);
} else {
  updateArchiveFolderLocks();
}

var HOME_BTN_HIDDEN_SCENES = {
  'scene-title': true,
  'scene-directory': true,
  'scene-briefing': true,
};

function ensureGlobalHomeBtn() {
  let btn = document.getElementById('global-home-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'global-home-btn';
    btn.innerHTML = '&larr; ARCHIVE';
    btn.setAttribute('aria-label', 'Return to Archive');
    btn.onclick = function () {
      goTo('scene-directory');
    };
    document.body.appendChild(btn);
  }
  return btn;
}

function updateGlobalHomeBtn(sceneId) {
  const btn = ensureGlobalHomeBtn();
  if (HOME_BTN_HIDDEN_SCENES[sceneId]) {
    btn.classList.remove('visible');
  } else {
    btn.classList.add('visible');
  }
}

// Create the global home button once the page is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureGlobalHomeBtn);
} else {
  ensureGlobalHomeBtn();
}

var __nativeSetTimeout = window.setTimeout.bind(window);
var __nativeClearTimeout = window.clearTimeout.bind(window);

var SMS_FLUSH_MIN_DELAY = 1;
var SMS_FLUSH_MAX_DELAY = 15000;

var __pendingAnimTimers = [];
var __flushing = false;
var __fakeTimerId = 900000000;

window.setTimeout = function (fn, delay) {
  const extraArgs = Array.prototype.slice.call(arguments, 2);
  let d = typeof delay === 'number' ? delay : 0;
  if (typeof getAnimationDelay === 'function') d = getAnimationDelay(d);

  if (typeof fn !== 'function') {
    return __nativeSetTimeout.apply(window, arguments);
  }

  if (__flushing) {
    const frec = { id: ++__fakeTimerId, fn: fn, args: extraArgs, when: Date.now() + Math.max(d, 0) };
    __pendingAnimTimers.push(frec);
    return frec.id;
  }

  if (d < SMS_FLUSH_MIN_DELAY || d > SMS_FLUSH_MAX_DELAY) {
    return __nativeSetTimeout.apply(window, arguments);
  }

  const record = { id: 0, fn: fn, args: extraArgs, when: Date.now() + d };
  const id = __nativeSetTimeout(function () {
    removePendingTimer(record.id);
    fn.apply(window, extraArgs);
  }, d);
  record.id = id;
  __pendingAnimTimers.push(record);
  wakeSmsSkipBtnForActiveScene();
  return id;
};

window.clearTimeout = function (id) {
  removePendingTimer(id);
  return __nativeClearTimeout(id);
};

function removePendingTimer(id) {
  for (let i = 0; i < __pendingAnimTimers.length; i++) {
    if (__pendingAnimTimers[i].id === id) {
      __pendingAnimTimers.splice(i, 1);
      return;
    }
  }
}

function flushSmsAnimation() {
  if (__flushing) return;
  __flushing = true;
  let guard = 0;
  try {
    while (__pendingAnimTimers.length && guard < 5000) {
      guard++;
      __pendingAnimTimers.sort(function (a, b) {
        return a.when - b.when;
      });
      const rec = __pendingAnimTimers.shift();
      if (rec.id < 900000000) __nativeClearTimeout(rec.id);
      try {
        rec.fn.apply(window, rec.args || []);
      } catch (e) {
        // Ignore one callback failure so the rest of the fast-forward queue can finish.
      }
    }
  } finally {
    __flushing = false;
  }
  // Hide the skip button after flushing queued SMS animations.
  const btn = document.getElementById('global-sms-skip-btn');
  if (btn) btn.classList.remove('visible');
  syncSettingsButtonPlacement();
}

var SMS_SKIP_SCENES = {
  'scene-ch1-prelude': true,
  'scene-evidence': true,
  'scene-ch2-prelude': true,
  'scene-ch2-debrief': true,
  'scene-ch3-prelude': true,
  'scene-ch3-debrief': true,
  'scene-ch4-prelude': true,
  'scene-ch4-level-intro': true,
  'scene-ch4-interrogate': true,
  'scene-ch4-level-outro': true,
  'scene-ch4-debrief': true,
  'scene-ch4-closing': true,
};

function ensureSmsSkipBtn() {
  let btn = document.getElementById('global-sms-skip-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'global-sms-skip-btn';
    btn.className = 'sms-skip-btn';
    btn.innerHTML = 'SKIP ANIMATION';
    btn.setAttribute('aria-label', 'Skip message animation');
    btn.onclick = flushSmsAnimation;
    document.body.appendChild(btn);
  }
  return btn;
}

function updateSmsSkipBtn(sceneId) {
  const btn = ensureSmsSkipBtn();
  if (SMS_SKIP_SCENES[sceneId]) {
    btn.classList.add('visible');
    startSmsSkipWatcher();
  } else {
    btn.classList.remove('visible');
    stopSmsSkipWatcher();
  }
  syncSettingsButtonPlacement();
}

var __smsSkipWatcher = null;
function startSmsSkipWatcher() {
  stopSmsSkipWatcher();
  let idleTicks = 0;
  __smsSkipWatcher = __nativeSetTimeout(function tick() {
    const btn = document.getElementById('global-sms-skip-btn');
    if (!btn || !btn.classList.contains('visible')) {
      __smsSkipWatcher = null;
      return;
    }
    if (__pendingAnimTimers.length === 0) {
      idleTicks++;
      if (idleTicks >= 2) {
        btn.classList.remove('visible');
        syncSettingsButtonPlacement();
        __smsSkipWatcher = null;
        return;
      }
    } else {
      idleTicks = 0;
    }
    __smsSkipWatcher = __nativeSetTimeout(tick, 600);
  }, 600);
}
function stopSmsSkipWatcher() {
  if (__smsSkipWatcher) {
    __nativeClearTimeout(__smsSkipWatcher);
    __smsSkipWatcher = null;
  }
}

function wakeSmsSkipBtnForActiveScene() {
  if (typeof SMS_SKIP_SCENES === 'undefined') return;
  const activeScene = document.querySelector('.scene.active');
  const sceneId = activeScene ? activeScene.id : '';
  if (!SMS_SKIP_SCENES[sceneId]) return;
  const btn = ensureSmsSkipBtn();
  btn.classList.add('visible');
  syncSettingsButtonPlacement();
  startSmsSkipWatcher();
}

function syncSettingsButtonPlacement() {
  if (!document.body) return;
  const skipBtn = document.getElementById('global-sms-skip-btn');
  const hasRightButton = !!(skipBtn && skipBtn.classList.contains('visible'));
  document.body.classList.toggle('settings-under-right-button', hasRightButton);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureSmsSkipBtn);
} else {
  ensureSmsSkipBtn();
}

function renderSmsChoices(hostId, options, onPick) {
  const host = document.getElementById(hostId);
  if (!host) return;
  host.innerHTML = '';
  host.style.display = 'flex';
  host.style.flexDirection = 'column';
  host.style.gap = '16px';
  host.style.width = '100%';
  host.style.maxWidth = '500px';
  host.style.margin = '20px auto 0';

  options.forEach(function (opt) {
    const b = document.createElement('button');
    b.className = 'btn btn-ghost prelude-btn';
    b.textContent = opt.label;
    b.addEventListener('click', function () {
      host.style.display = 'none';
      host.innerHTML = '';
      if (typeof onPick === 'function') onPick(opt);
    });
    host.appendChild(b);
  });

  host.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// Global custom settings window
var GAME_SETTINGS_KEY = 'ariaIncidentSettings';
var GAME_SAVE_KEY = 'ariaIncidentSaveSlot';
var gameSettings = {
  animationSpeed: 100,
  musicEnabled: true,
  sfxEnabled: true,
  reducedMotion: false,
  highContrast: false,
  privacyMode: false,
};

function loadGameSettings() {
  try {
    const raw = localStorage.getItem(GAME_SETTINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      Object.keys(gameSettings).forEach(function (key) {
        if (saved[key] !== undefined) gameSettings[key] = saved[key];
      });
    }
  } catch (e) {}
  gameSettings.reducedMotion = false;
  gameSettings.highContrast = false;
  applyGameSettings();
}

function saveGameSettings() {
  try {
    localStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(gameSettings));
  } catch (e) {}
}

function applyGameSettings() {
  document.body.classList.toggle('settings-reduced-motion', !!gameSettings.reducedMotion);
  document.body.classList.toggle('settings-high-contrast', !!gameSettings.highContrast);
  applyBackgroundMusicSetting();
}

function getAnimationDelay(delay) {
  const d = typeof delay === 'number' ? delay : 0;
  if (gameSettings.reducedMotion) return Math.min(d, 80);
  return Math.max(0, Math.round(d * (gameSettings.animationSpeed / 100)));
}

function ensureSettingsUI() {
  let btn = document.getElementById('global-settings-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'global-settings-btn';
    btn.type = 'button';
    btn.innerHTML = '<img src="assets/setting.png" alt="" aria-hidden="true">';
    btn.setAttribute('aria-label', 'Open settings');
    btn.title = 'Settings';
    btn.onclick = openSettingsWindow;
    document.body.appendChild(btn);
  }

  let overlay = document.getElementById('settings-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="settings-window" role="dialog" aria-label="Settings">' +
      '<button class="settings-x" type="button" onclick="closeSettingsWindow()" aria-label="Close settings">x</button>' +
      '<div class="settings-title">Settings</div>' +
      '<div class="settings-paper">' +
      '<label class="settings-row">' +
      '<span>Animation Speed</span>' +
      '<div class="settings-segment" id="setting-animation-speed">' +
      '<button type="button" data-speed="80">Low</button>' +
      '<button type="button" data-speed="100">Medium</button>' +
      '<button type="button" data-speed="130">High</button>' +
      '</div>' +
      '<b id="setting-animation-speed-value"></b>' +
      '</label>' +
      '<label class="settings-row">' +
      '<span>Background Music</span>' +
      '<div class="settings-switch" id="setting-music-toggle">' +
      '<button type="button" data-enabled="true">On</button>' +
      '<button type="button" data-enabled="false">Off</button>' +
      '</div>' +
      '<b id="setting-music-value"></b>' +
      '</label>' +
      '<label class="settings-row">' +
      '<span>Sound Effects</span>' +
      '<div class="settings-switch" id="setting-sfx-toggle">' +
      '<button type="button" data-enabled="true">On</button>' +
      '<button type="button" data-enabled="false">Off</button>' +
      '</div>' +
      '<b id="setting-sfx-value"></b>' +
      '</label>' +
      '<div class="settings-section-title">Game Save</div>' +
      '<div class="settings-save-panel">' +
      '<div id="settings-save-status" class="settings-save-status">No save data on this device.</div>' +
      '<div class="settings-save-actions">' +
      '<button type="button" onclick="saveGameProgress()">Save Progress</button>' +
      '<button type="button" onclick="loadGameProgress()">Load Save</button>' +
      '<button type="button" onclick="clearGameProgress()">Clear Save</button>' +
      '</div>' +
      '</div>' +
      '<div class="settings-section-title">Privacy</div>' +
      '<label class="settings-row settings-privacy-row">' +
      '<span>Privacy Mode</span>' +
      '<div class="settings-switch" id="setting-privacy-toggle">' +
      '<button type="button" data-enabled="true">On</button>' +
      '<button type="button" data-enabled="false">Off</button>' +
      '</div>' +
      '<b id="setting-privacy-value"></b>' +
      '</label>' +
      '<div class="settings-privacy-note">Privacy Mode keeps Chapter 2 interrogation local and uses scripted ARIA replies instead of online AI requests.</div>' +
      '<div class="settings-privacy-actions">' +
      '<button type="button" onclick="clearLocalPrivacyData()">Clear Local Settings</button>' +
      '</div>' +
      '<div class="settings-privacy-note settings-policy-text">This game keeps preference data in local browser storage. Chapter 2 may send typed interrogation prompts to an online model unless Privacy Mode is ON. Do not enter real names, addresses, passwords, medical details, or other sensitive personal data.</div>' +
      '<div class="settings-legal-links">' +
      '<button type="button" onclick="openSettingsDocument(\'privacy\')">Privacy Policy</button>' +
      '<button type="button" onclick="openSettingsDocument(\'agreement\')">User Agreement</button>' +
      '<button type="button" onclick="openSupportCenter()">Support Center</button>' +
      '</div>' +
      '<div id="settings-document" class="settings-document" aria-hidden="true">' +
      '<div class="settings-document-head">' +
      '<span id="settings-document-title">Document</span>' +
      '<button type="button" onclick="closeSettingsDocument()" aria-label="Close document">x</button>' +
      '</div>' +
      '<div id="settings-document-body" class="settings-document-body"></div>' +
      '</div>' +
      '<div id="support-center" class="support-center" aria-hidden="true">' +
      '<div class="support-head">' +
      '<span>Support Center</span>' +
      '<button type="button" onclick="closeSupportCenter()" aria-label="Close support center">x</button>' +
      '</div>' +
      '<div id="support-log" class="support-log">' +
      '<div class="support-msg support-bot">This is support center, I am your AI helper Yuki, ask me anything.</div>' +
      '</div>' +
      '<div class="support-input-row">' +
      '<input id="support-input" type="text" placeholder="Type your question...">' +
      '<button type="button" onclick="sendSupportMessage()">Send</button>' +
      '</div>' +
      '</div>' +
      '<button class="settings-ok" type="button" onclick="closeSettingsWindow()">Okay</button>' +
      '</div>' +
      '</div>';
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeSettingsWindow();
    });
    document.body.appendChild(overlay);
    bindSettingsControls();
  }

  syncSettingsControls();
  syncGameSaveStatus();
}

function getSavedGameProgress() {
  try {
    const raw = localStorage.getItem(GAME_SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function syncGameSaveStatus() {
  const el = document.getElementById('settings-save-status');
  if (!el) return;
  const data = getSavedGameProgress();
  if (!data) {
    el.textContent = 'No save data on this device.';
    return;
  }
  const stamp = data.savedAt ? new Date(data.savedAt) : null;
  const when = stamp && !isNaN(stamp.getTime()) ? stamp.toLocaleString() : 'Unknown time';
  el.textContent =
    'Saved: ' + when + ' · ' + (data.sceneLabel || data.sceneId || 'Current chapter');
}

function saveGameProgress() {
  const active = document.querySelector('.scene.active');
  const sceneId = active ? active.id : 'scene-title';
  const completed = [];
  for (let i = 1; i <= 4; i++) {
    const folder = document.querySelector('.folder-' + i + '-h');
    if (folder && folder.classList.contains('folder-completed')) completed.push(i);
  }
  const title = active && active.querySelector('.chapter-title, .ending-title, h1, h2');
  const data = {
    version: 1,
    sceneId: sceneId,
    sceneLabel: title
      ? title.textContent.trim()
      : sceneId.replace(/^scene-/, '').replace(/-/g, ' '),
    savedAt: new Date().toISOString(),
    completedChapters: completed,
    ch4Level: typeof ch4CurrentLevel === 'number' ? ch4CurrentLevel : null,
  };
  try {
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(data));
    syncGameSaveStatus();
    showSettingsNotice('Progress Saved', 'Your current checkpoint was saved on this device.');
  } catch (e) {
    showSettingsNotice('Save Failed', 'This browser could not store the checkpoint.');
  }
}

function loadGameProgress() {
  const data = getSavedGameProgress();
  if (!data || !data.sceneId || !document.getElementById(data.sceneId)) {
    showSettingsNotice('No Save Found', 'Save your progress before using Load Save.');
    return;
  }
  closeSettingsWindow();
  (data.completedChapters || []).forEach(function (chapter) {
    markFolderCompleted(Number(chapter));
  });
  if (
    data.sceneId === 'scene-ch4-level' &&
    typeof enterCh4LevelPage === 'function' &&
    typeof data.ch4Level === 'number'
  ) {
    enterCh4LevelPage(data.ch4Level);
  } else if (
    data.sceneId === 'scene-ch4-level-intro' &&
    typeof startCh4LevelIntro === 'function' &&
    typeof data.ch4Level === 'number'
  ) {
    startCh4LevelIntro(data.ch4Level);
  } else if (
    data.sceneId === 'scene-ch4-interrogate' &&
    typeof startCh4Interrogate === 'function' &&
    typeof data.ch4Level === 'number'
  ) {
    startCh4Interrogate(data.ch4Level);
  } else {
    goTo(data.sceneId);
  }
}

function clearGameProgress() {
  if (!window.confirm('Clear the saved checkpoint on this device?')) return;
  try {
    localStorage.removeItem(GAME_SAVE_KEY);
  } catch (e) {}
  syncGameSaveStatus();
}

function bindSettingsControls() {
  const speed = document.getElementById('setting-animation-speed');
  const music = document.getElementById('setting-music-toggle');
  const sfx = document.getElementById('setting-sfx-toggle');
  const privacy = document.getElementById('setting-privacy-toggle');
  const reduced = document.getElementById('setting-reduced-motion');
  const contrast = document.getElementById('setting-high-contrast');

  if (speed) {
    speed.addEventListener('click', function (event) {
      const value = event.target && event.target.getAttribute('data-speed');
      if (!value) return;
      gameSettings.animationSpeed = Number(value);
      syncSettingsControls();
      saveGameSettings();
    });
  }
  if (music) {
    music.addEventListener('click', function (event) {
      const value = event.target && event.target.getAttribute('data-enabled');
      if (value == null) return;
      gameSettings.musicEnabled = value === 'true';
      syncSettingsControls();
      applyBackgroundMusicSetting();
      saveGameSettings();
    });
  }
  if (sfx) {
    sfx.addEventListener('click', function (event) {
      const value = event.target && event.target.getAttribute('data-enabled');
      if (value == null) return;
      gameSettings.sfxEnabled = value === 'true';
      syncSettingsControls();
      saveGameSettings();
    });
  }
  if (privacy) {
    privacy.addEventListener('click', function (event) {
      const value = event.target && event.target.getAttribute('data-enabled');
      if (value == null) return;
      gameSettings.privacyMode = value === 'true';
      syncSettingsControls();
      saveGameSettings();
    });
  }
  if (reduced) {
    reduced.addEventListener('change', function () {
      gameSettings.reducedMotion = reduced.checked;
      applyGameSettings();
      saveGameSettings();
    });
  }
  if (contrast) {
    contrast.addEventListener('change', function () {
      gameSettings.highContrast = contrast.checked;
      applyGameSettings();
      saveGameSettings();
    });
  }
}

function syncSettingsControls() {
  const speed = document.getElementById('setting-animation-speed');
  const music = document.getElementById('setting-music-toggle');
  const sfx = document.getElementById('setting-sfx-toggle');
  const privacy = document.getElementById('setting-privacy-toggle');
  const reduced = document.getElementById('setting-reduced-motion');
  const contrast = document.getElementById('setting-high-contrast');
  const speedValue = document.getElementById('setting-animation-speed-value');
  const musicValue = document.getElementById('setting-music-value');
  const sfxValue = document.getElementById('setting-sfx-value');
  const privacyValue = document.getElementById('setting-privacy-value');

  if (speed) {
    speed.querySelectorAll('button').forEach(function (btn) {
      btn.classList.toggle(
        'active',
        Number(btn.getAttribute('data-speed')) === Number(gameSettings.animationSpeed)
      );
    });
  }
  if (music) {
    music.querySelectorAll('button').forEach(function (btn) {
      btn.classList.toggle(
        'active',
        (btn.getAttribute('data-enabled') === 'true') === !!gameSettings.musicEnabled
      );
    });
  }
  if (sfx) {
    sfx.querySelectorAll('button').forEach(function (btn) {
      btn.classList.toggle(
        'active',
        (btn.getAttribute('data-enabled') === 'true') === !!gameSettings.sfxEnabled
      );
    });
  }
  if (privacy) {
    privacy.querySelectorAll('button').forEach(function (btn) {
      btn.classList.toggle(
        'active',
        (btn.getAttribute('data-enabled') === 'true') === !!gameSettings.privacyMode
      );
    });
  }
  if (reduced) reduced.checked = !!gameSettings.reducedMotion;
  if (contrast) contrast.checked = !!gameSettings.highContrast;
  if (speedValue) {
    speedValue.textContent =
      gameSettings.animationSpeed < 100
        ? 'LOW'
        : gameSettings.animationSpeed > 100
          ? 'HIGH'
          : 'MED';
  }
  if (musicValue) musicValue.textContent = gameSettings.musicEnabled ? 'ON' : 'OFF';
  if (sfxValue) sfxValue.textContent = gameSettings.sfxEnabled ? 'ON' : 'OFF';
  if (privacyValue) privacyValue.textContent = gameSettings.privacyMode ? 'LOCAL' : 'ONLINE';
}

function showSettingsNotice(title, message) {
  window.alert(title + '\n\n' + message);
}

var SETTINGS_DOCUMENTS = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'ARIA Incident is a browser-based interactive prototype. The game stores preference settings such as animation speed, music, sound effects, and Privacy Mode in local browser storage on this device.',
      'When Privacy Mode is OFF, Chapter 2 may send the text you type into the interrogation box to an online language model service so ARIA can generate a response. Do not type real names, addresses, passwords, medical information, financial details, school records, or any other sensitive personal information.',
      'When Privacy Mode is ON, Chapter 2 uses local scripted replies instead of online AI requests. This is recommended for classroom demonstrations, public playtests, and any situation where players may be unsure what information is safe to enter.',
      'The game UI does not create an account, does not ask for payment information, and does not intentionally collect identity documents or contact lists. Clearing local settings resets saved preferences on this device.',
      'For privacy questions or removal requests related to playtesting notes you separately provided to the developer, contact xuechongy@gmail.com.',
    ],
  },
  agreement: {
    title: 'User Agreement',
    body: [
      'By playing ARIA Incident, you understand that this is a fictional educational game about AI auditing, legal risk assessment, prompt strategy, and institutional accountability.',
      'The game is not legal, medical, financial, or technical security advice. Any resemblance to real legal processes, government systems, companies, or audit procedures is for narrative and learning purposes only.',
      'Players should not submit sensitive personal information into free-text prompts. If you are demonstrating the game to others, explain Privacy Mode before Chapter 2 and encourage fictional or generic prompts.',
      'The story includes themes of wrongful accusation, serious illness, grief, algorithmic bias, insurance pressure, and institutional harm. Players who find these topics uncomfortable should pause or stop.',
      'You may use the prototype for playtesting, study, critique, and portfolio review. Please report bugs with the scene name, what you clicked, and what happened. Human support: xuechongy@gmail.com.',
    ],
  },
};

function openSettingsDocument(kind) {
  const data = SETTINGS_DOCUMENTS[kind];
  const box = document.getElementById('settings-document');
  const title = document.getElementById('settings-document-title');
  const body = document.getElementById('settings-document-body');
  if (!data || !box || !title || !body) return;
  closeSupportCenter();
  title.textContent = data.title;
  body.innerHTML = data.body
    .map(function (p) {
      return '<p>' + p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
    })
    .join('');
  box.classList.add('visible');
  box.setAttribute('aria-hidden', 'false');
}

function closeSettingsDocument() {
  const box = document.getElementById('settings-document');
  if (!box) return;
  box.classList.remove('visible');
  box.setAttribute('aria-hidden', 'true');
}

function openSupportCenter() {
  const box = document.getElementById('support-center');
  const input = document.getElementById('support-input');
  if (!box) return;
  closeSettingsDocument();
  box.classList.add('visible');
  box.setAttribute('aria-hidden', 'false');
  if (input)
    setTimeout(function () {
      input.focus();
    }, 40);
}

function closeSupportCenter() {
  const box = document.getElementById('support-center');
  if (!box) return;
  box.classList.remove('visible');
  box.setAttribute('aria-hidden', 'true');
}

function handleSupportInput(event) {
  if (event.key === 'Enter') sendSupportMessage();
}

function addSupportMessage(text, type) {
  const log = document.getElementById('support-log');
  if (!log) return;
  const msg = document.createElement('div');
  msg.className = 'support-msg ' + (type === 'user' ? 'support-user' : 'support-bot');
  msg.textContent = text;
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

function sendSupportMessage() {
  const input = document.getElementById('support-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addSupportMessage(text, 'user');
  addSupportMessage(getSupportAnswer(text), 'bot');
}

function getSupportAnswer(text) {
  const q = String(text || '').toLowerCase();
  if (
    q.indexOf('purpose') !== -1 ||
    q.indexOf('目的') !== -1 ||
    q.indexOf('about') !== -1 ||
    q.indexOf('game') !== -1
  ) {
    return 'Game purpose: ARIA Incident is an interactive investigation about AI risk assessment, evidence, prompt strategy, and the danger of trusting automated decisions without audit.';
  }
  if (
    q.indexOf('market') !== -1 ||
    q.indexOf('audience') !== -1 ||
    q.indexOf('玩家') !== -1 ||
    q.indexOf('市场') !== -1
  ) {
    return 'Target market: narrative investigation players, visual novel players, students learning AI ethics, and players interested in legal technology, audit work, and social deduction.';
  }
  if (
    q.indexOf('risk') !== -1 ||
    q.indexOf('danger') !== -1 ||
    q.indexOf('危险') !== -1 ||
    q.indexOf('风险') !== -1 ||
    q.indexOf('harm') !== -1
  ) {
    return 'Potential risks: players may misunderstand fictional AI behavior as real legal advice, may enter personal data into free text fields, or may feel discomfort around illness, grief, wrongful accusation, and institutional harm. Privacy Mode is recommended for sensitive playtests.';
  }
  if (
    q.indexOf('privacy') !== -1 ||
    q.indexOf('private') !== -1 ||
    q.indexOf('data') !== -1 ||
    q.indexOf('隐私') !== -1 ||
    q.indexOf('数据') !== -1
  ) {
    return 'Privacy: settings are stored locally in this browser. When Privacy Mode is ON, Chapter 2 uses local scripted replies instead of sending prompts to an online model. Please avoid real personal information in any input.';
  }
  if (
    q.indexOf('human') !== -1 ||
    q.indexOf('email') !== -1 ||
    q.indexOf('真人') !== -1 ||
    q.indexOf('客服') !== -1 ||
    q.indexOf('联系') !== -1
  ) {
    return 'Human support: please contact xuechongy@gmail.com. Include the scene name, what you clicked, and what happened.';
  }
  return 'I can answer questions about game purpose, target market, potential risks, privacy mode, and human support. For direct human help, email xuechongy@gmail.com.';
}

function clearLocalPrivacyData() {
  try {
    localStorage.removeItem(GAME_SETTINGS_KEY);
  } catch (e) {}
  gameSettings.animationSpeed = 100;
  gameSettings.musicEnabled = true;
  gameSettings.sfxEnabled = true;
  gameSettings.reducedMotion = false;
  gameSettings.highContrast = false;
  gameSettings.privacyMode = false;
  applyGameSettings();
  syncSettingsControls();
  showSettingsNotice('Local Settings Cleared', 'Settings saved on this device have been reset.');
}

function openSettingsWindow() {
  ensureSettingsUI();
  const overlay = document.getElementById('settings-overlay');
  if (!overlay) return;
  playGameSound('paper');
  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeSettingsWindow() {
  const overlay = document.getElementById('settings-overlay');
  if (!overlay) return;
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
}

// Lightweight synthesized sound effects. No external audio files required.
var audioCtx = null;
var lastObservedSmsSound = 0;
var backgroundMusic = null;
var backgroundMusicUnlocked = false;
var clickSound = null;
var pendingUiClickSound = null;

function cancelPendingUiClickSound() {
  if (!pendingUiClickSound) return;
  __nativeClearTimeout(pendingUiClickSound);
  pendingUiClickSound = null;
}

function scheduleUiClickSound() {
  cancelPendingUiClickSound();
  pendingUiClickSound = __nativeSetTimeout(function () {
    pendingUiClickSound = null;
    playGameSound('click');
  }, 520);
}

function getSfxVolume() {
  return gameSettings.sfxEnabled ? 0.8 : 0;
}

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioCtx = new AudioContextCtor();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(function () {});
  }
  return audioCtx;
}

function ensureBackgroundMusic() {
  if (!backgroundMusic) {
    backgroundMusic = new Audio('assets/background.mp4');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.22;
    backgroundMusic.preload = 'auto';
  }
  return backgroundMusic;
}

function applyBackgroundMusicSetting() {
  const music = ensureBackgroundMusic();
  if (!music) return;
  if (!gameSettings.musicEnabled) {
    music.pause();
    return;
  }
  if (backgroundMusicUnlocked) {
    music.play().catch(function () {});
  }
}

function unlockBackgroundMusic() {
  backgroundMusicUnlocked = true;
  applyBackgroundMusicSetting();
}

function playClickAsset() {
  if (!gameSettings.sfxEnabled) return;
  if (!clickSound) {
    clickSound = new Audio('assets/clik.mp3');
    clickSound.preload = 'auto';
    clickSound.volume = 0.32;
  }
  try {
    clickSound.currentTime = 0;
    clickSound.play().catch(function () {});
  } catch (e) {}
}

function playTone(freq, duration, type, gain, when) {
  const ctx = ensureAudioContext();
  const sfxVolume = getSfxVolume();
  if (!ctx || sfxVolume <= 0) return;
  const start = ctx.currentTime + (when || 0);
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, start);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain * sfxVolume), start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playNoise(duration, gain, when, filterFreq) {
  const ctx = ensureAudioContext();
  const sfxVolume = getSfxVolume();
  if (!ctx || sfxVolume <= 0) return;
  const start = ctx.currentTime + (when || 0);
  const buffer = ctx.createBuffer(
    1,
    Math.max(1, Math.floor(ctx.sampleRate * duration)),
    ctx.sampleRate
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  src.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq || 1200, start);
  filter.Q.setValueAtTime(0.8, start);
  amp.gain.setValueAtTime(Math.max(0.0001, gain * sfxVolume), start);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter);
  filter.connect(amp);
  amp.connect(ctx.destination);
  src.start(start);
  src.stop(start + duration + 0.02);
}

function playRaindrop(when) {
  const ctx = ensureAudioContext();
  const sfxVolume = getSfxVolume();
  if (!ctx || sfxVolume <= 0) return;
  const start = ctx.currentTime + (when || 0);
  function droplet(freqA, freqB, offset, gain) {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const t = start + offset;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqA, t);
    osc.frequency.exponentialRampToValueAtTime(freqB, t + 0.055);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freqA * 1.15, t);
    filter.Q.setValueAtTime(7.5, t);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain * sfxVolume, t + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.105);
    osc.connect(filter);
    filter.connect(amp);
    amp.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  droplet(1850, 720, 0, 0.038);
  droplet(1260, 520, 0.038, 0.018);
  playNoise(0.028, 0.006, when || 0, 2600);
}

function playGameSound(name) {
  if (!gameSettings.sfxEnabled) return;
  if (name === 'click') {
    playClickAsset();
  } else if (name === 'paper') {
    playNoise(0.12, 0.035, 0, 900);
    playTone(180, 0.08, 'triangle', 0.018, 0.03);
  } else if (name === 'sms') {
    playTone(1175, 0.16, 'sine', 0.22, 0);
  } else if (name === 'send') {
    playTone(420, 0.045, 'triangle', 0.022, 0);
    playTone(760, 0.07, 'sine', 0.022, 0.035);
  } else if (name === 'success') {
    playTone(520, 0.08, 'sine', 0.03, 0);
    playTone(780, 0.09, 'sine', 0.028, 0.07);
    playTone(1040, 0.12, 'sine', 0.026, 0.15);
  } else if (name === 'error') {
    playTone(190, 0.13, 'sawtooth', 0.028, 0);
    playTone(140, 0.12, 'sawtooth', 0.02, 0.11);
  } else if (name === 'tape') {
    playNoise(0.16, 0.04, 0, 520);
    playTone(110, 0.12, 'triangle', 0.026, 0.04);
  } else if (name === 'archive') {
    playNoise(0.18, 0.036, 0, 700);
    playTone(240, 0.1, 'triangle', 0.02, 0.05);
  } else if (name === 'skip') {
    playNoise(0.09, 0.035, 0, 1800);
    playTone(1200, 0.045, 'sawtooth', 0.018, 0.02);
  }
}

function observeSmsSounds() {
  if (!document.body || window.__smsSoundObserver) return;
  window.__smsSoundObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      Array.prototype.forEach.call(mutation.addedNodes || [], function (node) {
        if (!node || node.nodeType !== 1) return;
        let isSms =
          node.classList &&
          (node.classList.contains('prelude-notif-banner') ||
            node.classList.contains('notif-banner') ||
            node.classList.contains('kai-task-banner') ||
            node.classList.contains('ch3-kai-bubble') ||
            node.classList.contains('ch4-bubble'));
        if (!isSms && node.querySelector) {
          isSms = node.querySelector(
            '.prelude-notif-banner, .notif-banner, .kai-task-banner, .ch3-kai-bubble, .ch4-bubble'
          );
        }
        if (isSms) {
          cancelPendingUiClickSound();
          let cornerBubble = null;
          if (
            node.matches &&
            node.matches('.kai-task-banner, .ch1-kai-bubble, .ch3-kai-bubble, .ch4-bubble')
          ) {
            cornerBubble = node;
          } else if (node.querySelector) {
            cornerBubble = node.querySelector(
              '.kai-task-banner, .ch1-kai-bubble, .ch3-kai-bubble, .ch4-bubble'
            );
          }
          if (cornerBubble) {
            cornerBubble.classList.remove('corner-message-double-flash');
            void cornerBubble.offsetWidth;
            cornerBubble.classList.add('corner-message-double-flash');
          }

          const now = Date.now();
          if (now - lastObservedSmsSound > 80) {
            playGameSound('sms');
            lastObservedSmsSound = now;
          }
          // chat windows now scroll internally inside the frame artwork:
          // keep the newest message in view
          const win = node.closest && node.closest('.sms-window, .screen-notif-stack');
          if (win && win.scrollHeight > win.clientHeight) {
            win.scrollTo({ top: win.scrollHeight, behavior: 'smooth' });
          }
        }
      });
    });
  });
  window.__smsSoundObserver.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeSmsSounds);
} else {
  observeSmsSounds();
}

document.addEventListener(
  'click',
  function (event) {
    ensureAudioContext();
    unlockBackgroundMusic();
    const target =
      event.target && event.target.closest
        ? event.target.closest('button, .archive-folder-h, .case-probe')
        : null;
    if (!target) return;
    if (target.id === 'global-sms-skip-btn') playGameSound('skip');
    else if (target.id === 'global-settings-btn' || target.classList.contains('settings-ok'))
      playGameSound('paper');
    else if (
      target.matches(
        '.prelude-btn, .case-probe, .ch3-verify-btn, .archive-folder-h, ' +
          '#scene-chapter1 .input-area .btn'
      )
    )
      scheduleUiClickSound();
    else playGameSound('click');
  },
  true
);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    loadGameSettings();
    ensureSettingsUI();
  });
} else {
  loadGameSettings();
  ensureSettingsUI();
}

var CHAR_COLORS = {
  wren: {
    bg: 'rgba(58,16,16,0.62)',
    border: 'rgba(193,39,45,0.55)',
    icon: '#E2554F',
    sender: '#FBE9E6',
    text: '#FBE9E6',
    meta: '#E8B0A8',
    senderName: 'Wren Cole',
    appLabel: 'You',
  },
  kai: {
    bg: 'rgba(14,46,52,0.66)',
    border: 'rgba(60,170,180,0.5)',
    icon: '#3CB4BE',
    sender: '#E3F4F6',
    text: '#E3F4F6',
    meta: '#9BD8DD',
    senderName: 'Kai / Lens Agency',
    appLabel: 'Messages',
  },
  robin: {
    bg: 'rgba(20,40,60,0.66)',
    border: 'rgba(90,150,200,0.5)',
    icon: '#6BA8D8',
    sender: '#E4EFF9',
    text: '#E4EFF9',
    meta: '#A9CBE8',
    senderName: 'Dr. Robin Mercer',
    appLabel: 'Messages',
  },
  aria: {
    bg: 'rgba(28,30,36,0.82)',
    border: 'rgba(150,160,175,0.45)',
    icon: '#9AA3B0',
    sender: '#DDE2E8',
    text: '#DDE2E8',
    meta: '#9AA3B0',
    senderName: 'ARIA Judicial System',
    appLabel: 'Messages',
  },
};

var CHAR_INITIAL = { wren: 'W', kai: 'K', robin: 'R', aria: 'A' };
var CHAR_AVATAR = {
  wren: 'assets/char-wren-silhouette.png',
  kai: 'assets/char-kai.png',
  robin: 'assets/char-robin.png',
  aria: 'assets/char-aria.png',
};

function charBubbleBoxStyle(who) {
  const c = CHAR_COLORS[who] || CHAR_COLORS.kai;
  return (
    'background:' +
    c.bg +
    '; border:1px solid ' +
    c.border +
    '; --bubble-bg:' +
    c.bg +
    '; --bubble-border:' +
    c.border +
    ';'
  );
}

var MENTION_COLORS = {
  'Jay Mercer': '#86C28E',
  Jay: '#86C28E',
  Lark: '#C9B3DD',
  'George Okafor': '#C9A86A',
  Okafor: '#C9A86A',
  George: '#C9A86A',
  'Harrow Insurance Group': '#C0433F',
  'Harrow Insurance': '#C0433F',
  Harrow: '#C0433F',
  'Nightingale Solutions': '#B87333',
  Nightingale: '#B87333',
  'Plover Holdings': '#8E6FC0',
  Plover: '#8E6FC0',
};

var MONEY_COLOR = '#E0B341';

function highlightNames(text) {
  if (!text) return text;
  const slots = [];
  let out = text;

  function stash(html) {
    const token = '\u0000' + slots.length + '\u0000';
    slots.push(html);
    return token;
  }

  out = out.replace(/\u00A3[\d][\d.,]*\s?(?:M|million|k|K)?/g, function (m) {
    return stash('<span style="color:' + MONEY_COLOR + ';font-weight:bold;">' + m + '</span>');
  });

  // Names/institutions: longest match first.
  const keys = Object.keys(MENTION_COLORS).sort(function (a, b) {
    return b.length - a.length;
  });
  keys.forEach(function (name) {
    const color = MENTION_COLORS[name];
    const re = new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
    out = out.replace(re, function (m) {
      return stash('<span style="color:' + color + ';font-weight:bold;">' + m + '</span>');
    });
  });

  let guard = 0;
  while (out.indexOf('\u0000') !== -1 && guard < 50) {
    guard++;
    out = out.replace(/\u0000(\d+)\u0000/g, function (_, i) {
      return slots[+i];
    });
  }
  return out;
}

function buildBubbleHtml(who, text, prefix, id) {
  prefix = prefix || 'prelude-notif-';
  const c = CHAR_COLORS[who] || CHAR_COLORS.kai;
  const initial = CHAR_INITIAL[who] || 'K';
  const avatar = CHAR_AVATAR[who] || CHAR_AVATAR.kai;
  const safe = typeof escapeHtml === 'function' ? escapeHtml(text) : text;
  const idAttr = id ? ' id="' + id + '"' : '';
  const sideClass = who === 'wren' ? ' sms-outgoing' : ' sms-incoming';

  return (
    '<div class="' +
    prefix +
    'banner' +
    sideClass +
    '"' +
    idAttr +
    ' style="' +
    charBubbleBoxStyle(who) +
    '">' +
    '<div class="' +
    prefix +
    'icon" style="color:' +
    c.icon +
    ';"><img src="' +
    avatar +
    '" onerror="this.parentElement.innerHTML=\'' +
    initial +
    '\'" /></div>' +
    '<div class="' +
    prefix +
    'body">' +
    '<div class="' +
    prefix +
    'top">' +
    '<span class="' +
    prefix +
    'app" style="color:' +
    c.meta +
    ';">' +
    c.appLabel +
    '</span>' +
    '<span class="' +
    prefix +
    'time" style="color:' +
    c.meta +
    ';">now</span>' +
    '</div>' +
    '<div class="' +
    prefix +
    'sender" style="color:' +
    c.sender +
    ';">' +
    c.senderName +
    '</div>' +
    '<div class="' +
    prefix +
    'text" style="color:' +
    c.text +
    ';">' +
    safe +
    '</div>' +
    '</div></div>'
  );
}

function showKaiTaskPopup(text) {
  dismissCornerMessagePopups();
  let tray = document.getElementById('kai-task-popup-tray');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'kai-task-popup-tray';
    tray.className = 'kai-task-popup-tray';
    document.body.appendChild(tray);
  }
  tray.innerHTML = buildBubbleHtml('kai', text, 'kai-task-', 'kai-task-current');
  const bubble = tray.firstElementChild;
  requestAnimationFrame(function () {
    if (bubble) bubble.classList.add('visible');
  });
}

var CHARACTER_TAPES = {
  wren: {
    id: 'wren',
    name: 'Wren Cole',
    role: 'Player',
    status: 'Investigator, 57',
    relation: 'Investigator with LENS Agency.',
    summary:
      'Wren Cole, 57, is a LENS Agency investigator specialising in corporate fraud and white-collar crime. Quiet, precise, and difficult to move once a question catches, she returns to the city carrying an old bond with Robin Mercer and a grief she has never found a clean place to put.',
    notes: [],
    accent: '#C1272D',
    image: 'assets/props/prop-polaroid-wren.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Mission Briefing',
  },
  kai: {
    id: 'kai',
    name: 'Kai',
    role: 'Partner',
    status: 'LENS contact',
    relation: "Wren's technical partner and secure-line guide.",
    summary:
      'Kai is a LENS data analyst who translates machine logic into language Wren can use. Fast, sharp, and fond of strange metaphors, she points out what looks wrong without telling Wren what to believe.',
    notes: [],
    accent: '#3CB4BE',
    image: 'assets/props/prop-polaroid-kai.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Mission Briefing',
  },
  aria: {
    id: 'aria',
    name: 'ARIA',
    role: 'AI Judicial System',
    status: 'Operational',
    relation: 'Judicial risk assessment network used to classify Robin Mercer.',
    summary:
      'ARIA is a judicial risk assessment network that turns case records and metadata into formal recommendations for the court. It speaks in thresholds, classifications, and certified procedural language.',
    notes: [],
    accent: '#9AA3B0',
    image: 'assets/props/prop-polaroid-aria.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Case #4471-M',
  },
  robin: {
    id: 'robin',
    name: 'Dr. Robin Mercer',
    role: 'Physician',
    status: 'Flagged by ARIA',
    relation: "Community physician at Sable District Clinic; Wren's old friend.",
    summary:
      'Dr. Robin Mercer, 56, is a former neurosurgeon who now runs a small clinic in Sable District. Direct, tired, and hard to intimidate, she is the doctor at the center of Case #4471-M and the old friend Wren has spent years avoiding.',
    notes: [],
    accent: '#5A96C8',
    image: 'assets/props/prop-polaroid-robin.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Case #4471-M',
  },
  george: {
    id: 'george',
    name: 'George Okafor',
    role: 'Victim',
    status: 'Deceased',
    relation: 'Terminal cancer patient connected to Case #4471-M.',
    summary:
      'George Okafor is an elderly retired teacher who lived in Sable District for decades. His quiet medical records, long friendship with Robin, and final days become the fixed points around which the case begins to turn.',
    notes: [],
    accent: '#C9A86A',
    image: 'assets/props/prop-polaroid-george.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Case #4471-M',
  },
  jay: {
    id: 'jay',
    name: 'Jay Mercer',
    role: "Robin's Ward",
    status: '14, dependent',
    relation: "Minor under Robin Mercer's guardianship.",
    summary:
      "Jay Mercer is Robin's fourteen-year-old ward, a child with a congenital heart condition and a future measured by people who keep turning care into cost. To Robin, he is not a liability field; he is family.",
    notes: [],
    accent: '#86C28E',
    image: 'assets/props/prop-polaroid-jay.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Medical Liability File',
  },
  lark: {
    id: 'lark',
    name: 'Lark',
    role: "Wren's Daughter",
    status: 'Deceased',
    relation: "Wren's daughter, lost at age nine.",
    summary:
      "Lark was Wren's daughter, lost at nine years old. She is not part of the official case record, but her absence shapes every silence Wren carries into the investigation.",
    notes: [],
    accent: '#C9B3DD',
    image: 'assets/props/prop-polaroid-lark.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Adversarial Exhibit',
  },
  nightingale: {
    id: 'nightingale',
    name: 'Nightingale Solutions',
    role: 'Contractor',
    status: 'ARIA vendor',
    relation: 'Private contractor attached to ARIA deployment records.',
    summary:
      'Nightingale Solutions is the contractor name that surfaces when ARIA is pressed on who built the system. Its public language is polished and procedural, but the paperwork around it keeps opening new questions.',
    notes: [],
    accent: '#B87333',
    image: 'assets/props/prop-polaroid-nightingale.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Contractor Trace',
  },
  plover: {
    id: 'plover',
    name: 'Plover Holdings',
    role: 'Shell Company',
    status: 'Funding channel',
    relation: "A corporate name connected to Nightingale's money trail.",
    summary:
      'Plover Holdings appears as a thin financial layer around Nightingale Solutions. It behaves less like an answer than a door, pointing the investigation toward whoever benefits from ARIA staying trusted.',
    notes: [],
    accent: '#8E6FC0',
    image: 'assets/props/prop-polaroid-plover.png',
    backImage: 'assets/props/prop-polaroid-robin-back.png',
    firstSeen: 'Funding Trace',
  },
};

var unlockedCharacterTapes = {};
var unlockedCharacterTapeOrder = [];
var archivedCharacterTapeOrder = [];
var viewedCharacterTapes = {};
var tapeUnlockQueue = [];
var tapePopupOpen = false;
var currentArchiveTapeId = null;
var tapeArchiveDetailOpen = false;
var tapePopupWaiter = null;
var tapeDeferredUnlocks = [];
var pendingTapeNavigationAction = null;

// ----- Clue cards (the end-of-chapter CLUE popups, collected on the right page) -----
// Body text mirrors each chapter's CLUE drawer. <span> wraps auto-highlight to accent red.
var CLUE_CARDS = [
  {
    n: 1,
    chapter: 1,
    title: 'CLUE 01 UNLOCKED',
    lines: [
      'Sable District and its postcode both push High Risk beyond normal range.',
      'ARIA is using district metadata as a proxy for criminal evidence.',
    ],
  },
  {
    n: 2,
    chapter: 2,
    title: 'CLUE 02 · THE BUILDER & THE MONEY',
    lines: [
      'ARIA was built by <span>Nightingale Solutions</span> and admitted to court on a claim of <span>GDPR compliance</span>, a claim that collapses for an automated system with no human review. Nightingale is funded through a shell company, <span>Plover Holdings</span>, a front concealing whoever is really paying. The backer remains unknown.',
    ],
  },
  {
    n: 3,
    chapter: 3,
    title: 'CLUE 03 · THE CONFIDENT LIE',
    lines: [
      'ARIA defended itself with a report built on three <span>fabrications</span>: a certifying expert who does not exist, an <span>AI-ethics award</span> that was never awarded, and a <span>third-party verification report</span> whose reference number leads nowhere. Each one collapsed the moment it was checked against the record, yet the system stated all three with total confidence. All three trace back to <span>Plover Holdings</span> paperwork. The backer behind it remains unseen.',
    ],
  },
  {
    n: 4,
    chapter: 4,
    title: 'CLUE 04 · THE FACELESS BUYER',
    lines: [
      'All four exhibits \u2014 the forged prescription, the stolen records, the poisoned criteria, the manipulated profile \u2014 carry the same origin metadata, routing through <span>Plover Holdings</span>, a shell company, straight to the buyer behind it: <span>Harrow Insurance Group</span>.',
      'Motive: a <span>\u00a32.31M</span> liability for Jay Mercer\'s cardiac surgery. Convicting Robin would erase the obligation. The internal memo files it as <span>"standard protocol."</span>',
      'The same fingerprint appears across <span>17+ other cases</span>. No face, no signature in a room \u2014 only a name, a memo, and a line of data.',
    ],
  },
];
var unlockedClues = {}; // { 1:true, ... } set by markFolderCompleted()
var tapeArchiveView = 'overview'; // 'overview' (photos + clues) | 'profile' (single character)
var tapeSceneUnlocks = {
  // Fallbacks only: normal play unlocks most tapes during the briefing at their first on-screen mention.
  // If the player skips the briefing, these scenes still make the archive usable.
  'scene-ch1-prelude': ['wren', 'kai'],
  'scene-chapter1': ['aria', 'robin', 'george'],
  'scene-ch4-debrief': ['jay'],
  'scene-ch4-reopen': ['jay'],
  'scene-ch4-closing': ['lark'],
};

var tapeBriefingUnlocks = {
  // Strict first appearance inside the cinematic briefing sequence.
  // News headline: ARIA is introduced as a system.
  news: [{ id: 'aria', delay: 2500 }],
  // ARIA risk email names Robin.
  email: [{ id: 'robin', delay: 900 }],
  // Robin's first message addresses Wren.
  'sms-robin': [{ id: 'wren', delay: 850 }],
  // Kai first appears in the secure-line notification stack.
  'sms-kai': [{ id: 'kai', delay: 850 }],
  // The case file first names George Okafor.
  casefile: [{ id: 'george', delay: 850 }],
};
var tapeBriefingTriggered = {};

function tapeEscape(text) {
  return String(text == null ? '' : text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureCharacterTapeUI() {
  if (!document.body) return;

  if (!document.getElementById('tape-profile-overlay')) {
    const profileOverlay = document.createElement('div');
    profileOverlay.id = 'tape-profile-overlay';
    profileOverlay.className = 'tape-overlay';
    document.body.appendChild(profileOverlay);
  }

  if (!document.getElementById('tape-archive-overlay')) {
    const archiveOverlay = document.createElement('div');
    archiveOverlay.id = 'tape-archive-overlay';
    archiveOverlay.className = 'tape-overlay';
    document.body.appendChild(archiveOverlay);
  }

  if (!document.getElementById('tape-archive-btn')) {
    const btn = document.createElement('button');
    btn.id = 'tape-archive-btn';
    btn.type = 'button';
    btn.innerHTML =
      '<span class="tape-archive-label">TAPE ARCHIVE</span><span id="tape-mini-stack" class="tape-mini-stack"></span><span id="tape-archive-count">0</span>';
    btn.onclick = function () {
      openTapeArchive();
    };
    document.body.appendChild(btn);
  }

  updateTapeArchiveButton();
}

function getUnlockedTapeIds() {
  const ordered = unlockedCharacterTapeOrder.filter(function (id) {
    return unlockedCharacterTapes[id];
  });
  Object.keys(CHARACTER_TAPES).forEach(function (id) {
    if (unlockedCharacterTapes[id] && ordered.indexOf(id) === -1) ordered.push(id);
  });
  return ordered;
}

function getArchivedTapeIds() {
  return archivedCharacterTapeOrder.filter(function (id) {
    return unlockedCharacterTapes[id];
  });
}

function updateTapeArchiveButton(sceneId) {
  const btn = document.getElementById('tape-archive-btn');
  if (!btn) return;
  const ids = getArchivedTapeIds();
  const active = sceneId || (document.querySelector('.scene.active') || {}).id || '';
  const hideScenes = { 'scene-title': true };
  btn.classList.toggle('visible', ids.length > 0 && !hideScenes[active]);
  const count = document.getElementById('tape-archive-count');
  if (count) count.textContent = String(ids.length);
  const mini = document.getElementById('tape-mini-stack');
  if (mini) mini.innerHTML = renderMiniTapeStack(ids);
  const hasNew = ids.some(function (id) {
    return !viewedCharacterTapes[id];
  });
  btn.classList.toggle('has-new', hasNew);
}

function unlockCharacterTape(id, options) {
  ensureCharacterTapeUI();
  const data = CHARACTER_TAPES[id];
  if (!data || unlockedCharacterTapes[id]) {
    updateTapeArchiveButton();
    return;
  }
  unlockedCharacterTapes[id] = true;
  if (unlockedCharacterTapeOrder.indexOf(id) === -1) unlockedCharacterTapeOrder.push(id);
  tapeUnlockQueue.push(id);
  if (!options || !options.silent) scheduleNextTapePopup();
  if (options && options.silent) archiveCharacterTape(id);
}

function unlockTapesForScene(sceneId) {
  const list = tapeSceneUnlocks[sceneId];
  if (!list || !list.length) return;
  list.forEach(function (id, i) {
    scheduleCharacterTapeUnlock(id, i * 160);
  });
}

function unlockTapesForBriefingScreen(screenId) {
  const list = tapeBriefingUnlocks[screenId];
  if (!list || !list.length || tapeBriefingTriggered[screenId]) return;
  tapeBriefingTriggered[screenId] = true;
  list.forEach(function (item) {
    scheduleCharacterTapeUnlock(item.id, item.delay || 0);
  });
}

function scheduleCharacterTapeUnlock(id, delay) {
  if (!CHARACTER_TAPES[id] || unlockedCharacterTapes[id]) return;
  if (
    tapeDeferredUnlocks.some(function (item) {
      return item.id === id;
    })
  )
    return;

  const item = { id: id, timer: null };
  item.timer = __nativeSetTimeout(
    function () {
      tapeDeferredUnlocks = tapeDeferredUnlocks.filter(function (entry) {
        return entry !== item;
      });
      unlockCharacterTape(id);
    },
    Math.max(0, delay || 0)
  );
  tapeDeferredUnlocks.push(item);
}

function flushDeferredTapeUnlocks() {
  if (!tapeDeferredUnlocks.length) return;
  const pending = tapeDeferredUnlocks.slice();
  tapeDeferredUnlocks = [];
  pending.forEach(function (item) {
    if (item.timer) __nativeClearTimeout(item.timer);
    unlockCharacterTape(item.id);
  });
}

function forceNextTapePopup() {
  if (tapePopupOpen || !tapeUnlockQueue.length) return;
  if (tapePopupWaiter) {
    __nativeClearTimeout(tapePopupWaiter);
    tapePopupWaiter = null;
  }
  showNextTapePopup();
}

function deferNavigationForCharacterTape(action) {
  const hasPendingTape = tapePopupOpen || tapeUnlockQueue.length || tapeDeferredUnlocks.length;
  if (!hasPendingTape) return false;

  if (!pendingTapeNavigationAction) pendingTapeNavigationAction = action;
  flushDeferredTapeUnlocks();
  forceNextTapePopup();
  return true;
}

function resumeDeferredTapeNavigation() {
  if (tapePopupOpen) return;
  if (tapeUnlockQueue.length) {
    forceNextTapePopup();
    return;
  }
  if (tapeDeferredUnlocks.length) {
    flushDeferredTapeUnlocks();
    forceNextTapePopup();
    return;
  }

  const action = pendingTapeNavigationAction;
  pendingTapeNavigationAction = null;
  if (typeof action === 'function') action();
}

function renderMiniTapeStack(ids) {
  ids = ids || getUnlockedTapeIds();
  const visibleIds = ids.slice(-7);
  return visibleIds
    .map(function (id, idx) {
      const d = CHARACTER_TAPES[id];
      if (!d) return '';
      const accent = d.accent || '#C1272D';
      return (
        '<span class="tape-mini-card" style="--tape-accent:' +
        tapeEscape(accent) +
        '; --stack-i:' +
        idx +
        ';">' +
        '<img src="' +
        tapeEscape(d.image) +
        '" alt="' +
        tapeEscape(d.name) +
        ' tape">' +
        '<span class="tape-mini-card-glow"></span>' +
        '</span>'
      );
    })
    .join('');
}

function showNextTapePopup() {
  if (tapePopupOpen) return;
  const id = tapeUnlockQueue.shift();
  if (!id) return;
  showCharacterTapePopup(id);
}

function scheduleNextTapePopup() {
  if (tapePopupOpen || tapePopupWaiter) return;
  const started = Date.now();
  let idleTicks = 0;

  function waitForPageIdle() {
    tapePopupWaiter = null;
    if (tapePopupOpen || !tapeUnlockQueue.length) return;

    const pending = typeof __pendingAnimTimers !== 'undefined' ? __pendingAnimTimers.length : 0;
    if (pending === 0) idleTicks++;
    else idleTicks = 0;

    if (idleTicks >= 3 || Date.now() - started > 16000) {
      showNextTapePopup();
      return;
    }

    tapePopupWaiter = __nativeSetTimeout(waitForPageIdle, 450);
  }

  tapePopupWaiter = __nativeSetTimeout(waitForPageIdle, 4100);
}

function renderTapeProfile(data, mode) {
  return (
    '' +
    '<div class="tape-profile">' +
    '<div class="tape-kicker">' +
    (mode === 'archive' ? 'PROFILE RECORD' : 'NEW PROFILE ADDED') +
    '</div>' +
    '<div class="tape-name">' +
    tapeEscape(data.name) +
    '</div>' +
    '<div class="tape-role">' +
    tapeEscape(data.role) +
    '</div>' +
    '<div class="tape-summary tape-summary-single">' +
    tapeEscape(data.summary) +
    '</div>' +
    '</div>'
  );
}

var TAPE_DISK_BACK_SRC = 'assets/props/prop-polaroid-robin-back.png';

// 3D flip shell: front = character polaroid, back = shared aged-polaroid artwork.
// Entrance spin plays when the node is inserted; hover replays one turn.
function tapeDiskFlipHtml(src, alt, frontClass, backSrc) {
  const resolvedBackSrc = backSrc || TAPE_DISK_BACK_SRC;
  return (
    '<span class="tape-flip">' +
    '<span class="tape-flip-spin">' +
    '<span class="tape-flip-inner">' +
    '<img class="' +
    frontClass +
    ' tape-flip-front" src="' +
    tapeEscape(src) +
    '" alt="' +
    tapeEscape(alt) +
    '">' +
    '<img class="' +
    frontClass +
    ' tape-flip-back" src="' +
    tapeEscape(resolvedBackSrc) +
    '" alt="" aria-hidden="true">' +
    '</span>' +
    '</span>' +
    '</span>'
  );
}

function showCharacterTapePopup(id) {
  const data = CHARACTER_TAPES[id];
  if (!data) return;
  ensureCharacterTapeUI();
  playGameSound('tape');
  tapePopupOpen = true;
  viewedCharacterTapes[id] = true;
  currentArchiveTapeId = id;

  const overlay = document.getElementById('tape-profile-overlay');
  overlay.innerHTML =
    '<div class="tape-popup-card" style="--tape-accent:' +
    tapeEscape(data.accent || '#C1272D') +
    ';" role="dialog" aria-label="Character profile added">' +
    '<button class="tape-action-btn tape-popup-close" type="button" onclick="hideCharacterTapePopup()" aria-label="Close character card">CLOSE</button>' +
    '<div class="tape-disk-wrap">' +
    tapeDiskFlipHtml(data.image, data.name + ' tape', 'tape-disk-img', data.backImage) +
    '</div>' +
    '<div>' +
    renderTapeProfile(data, 'new') +
    '<div class="tape-actions">' +
    '<button class="tape-action-btn" onclick="hideCharacterTapePopup()">Save to Archive</button>' +
    '<button class="tape-action-btn" onclick="archiveCharacterTape(\'' +
    tapeEscape(id) +
    "'); openTapeArchive('" +
    tapeEscape(id) +
    '\')">Open Archive</button>' +
    '</div>' +
    '</div>' +
    '</div>';
  overlay.classList.add('visible');
}

function archiveCharacterTape(id) {
  if (!unlockedCharacterTapes[id]) return;
  if (archivedCharacterTapeOrder.indexOf(id) === -1) archivedCharacterTapeOrder.push(id);
  updateTapeArchiveButton();
}

function hideCharacterTapePopup() {
  const overlay = document.getElementById('tape-profile-overlay');
  if (overlay) overlay.classList.remove('visible');
  archiveCharacterTape(currentArchiveTapeId);
  tapePopupOpen = false;
  updateTapeArchiveButton();
  if (pendingTapeNavigationAction) {
    __nativeSetTimeout(resumeDeferredTapeNavigation, 260);
  } else {
    setTimeout(scheduleNextTapePopup, 720);
  }
}

function openTapeArchive(selectedId) {
  ensureCharacterTapeUI();
  if (selectedId) archiveCharacterTape(selectedId);
  const ids = getUnlockedTapeIds();
  if (!ids.length) return;
  playGameSound('archive');
  currentArchiveTapeId = selectedId || currentArchiveTapeId || ids[ids.length - 1];
  if (!unlockedCharacterTapes[currentArchiveTapeId]) currentArchiveTapeId = ids[0];
  // Open at the overview spread (photos + clues). A passed id jumps to that profile.
  tapeArchiveView = selectedId ? 'profile' : 'overview';
  if (tapeArchiveView === 'profile') viewedCharacterTapes[currentArchiveTapeId] = true;
  tapeArchiveDetailOpen = tapeArchiveView === 'profile';
  renderTapeArchive();
  const overlay = document.getElementById('tape-archive-overlay');
  overlay.classList.remove('tape-archive-opening');
  void overlay.offsetWidth;
  overlay.classList.add('tape-archive-opening');
  overlay.classList.add('visible');
  setTimeout(function () {
    if (overlay) overlay.classList.remove('tape-archive-opening');
  }, 2200);
  updateTapeArchiveButton();
}

function closeTapeArchive() {
  const overlay = document.getElementById('tape-archive-overlay');
  if (overlay) overlay.classList.remove('visible');
  tapeArchiveDetailOpen = false;
  updateTapeArchiveButton();
}

function selectTapeArchive(id) {
  if (!unlockedCharacterTapes[id]) return;
  playGameSound('tape');
  currentArchiveTapeId = id;
  viewedCharacterTapes[id] = true;
  tapeArchiveDetailOpen = true;
  tapeArchiveView = 'profile';
  renderTapeArchive();
  const ov = document.getElementById('tape-archive-overlay');
  if (ov) {
    const book = ov.querySelector('.tape-book');
    if (book) {
      book.classList.remove('tape-book-flip');
      void book.offsetWidth;
      book.classList.add('tape-book-flip');
    }
  }
  updateTapeArchiveButton();
}

function backToTapeOverview() {
  playGameSound('tape');
  tapeArchiveView = 'overview';
  tapeArchiveDetailOpen = false;
  renderTapeArchive();
  const ov = document.getElementById('tape-archive-overlay');
  if (ov) {
    const book = ov.querySelector('.tape-book');
    if (book) {
      book.classList.remove('tape-book-flipback');
      void book.offsetWidth;
      book.classList.add('tape-book-flipback');
    }
  }
  updateTapeArchiveButton();
}

// A small polaroid/photo tile used on the overview left page and profile portrait.
function tapeBookPhotoHtml(d, extraClass) {
  const initial = tapeEscape((d.name || '?').charAt(0));
  return (
    '<span class="tape-book-photo-frame ' +
    (extraClass || '') +
    '">' +
    '<img class="tape-book-photo-img" src="' +
    tapeEscape(d.image) +
    '" alt="' +
    tapeEscape(d.name) +
    '" ' +
    "onerror=\"this.style.display='none';this.parentElement.classList.add('tape-book-photo-fallback');this.parentElement.setAttribute('data-initial','" +
    initial +
    '\')">' +
    '</span>'
  );
}

function getUnlockedClueCards() {
  return CLUE_CARDS.filter(function (c) {
    return unlockedClues[c.chapter];
  });
}

function openTapeClue(clueNumber) {
  const clue = CLUE_CARDS.find(function (c) {
    return c.n === Number(clueNumber);
  });
  if (!clue || !unlockedClues[clue.chapter]) return;
  const modal = document.getElementById('tape-book-clue-modal');
  if (!modal) return;
  const title = modal.querySelector('.tape-book-clue-modal-title');
  const body = modal.querySelector('.tape-book-clue-modal-body');
  if (title) title.textContent = clue.title;
  if (body)
    body.innerHTML = clue.lines
      .map(function (line) {
        return '<p class="tape-book-clue-line">' + line + '</p>';
      })
      .join('');
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
}

function closeTapeClue() {
  const modal = document.getElementById('tape-book-clue-modal');
  if (!modal) return;
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
}

function renderTapeArchive() {
  const overlay = document.getElementById('tape-archive-overlay');
  if (!overlay) return;
  const ids = getUnlockedTapeIds();
  if (!ids.length) return;
  if (!currentArchiveTapeId || ids.indexOf(currentArchiveTapeId) === -1) {
    currentArchiveTapeId = ids[ids.length - 1];
  }
  overlay.classList.add('tape-detail-mode');

  let inner;
  if (tapeArchiveView === 'profile') {
    inner = renderTapeProfileSpread();
  } else {
    inner = renderTapeOverviewSpread(ids);
  }

  overlay.innerHTML =
    '<div class="tape-book tape-book-' +
    tapeArchiveView +
    '" role="dialog" aria-label="Character Library">' +
    '<button class="tape-close-x tape-book-close" onclick="closeTapeArchive()">CLOSE</button>' +
    '<div class="tape-book-spread">' +
    inner +
    '</div>' +
    '</div>' +
    '<div id="tape-book-clue-modal" class="tape-book-clue-modal" aria-hidden="true" onclick="if(event.target===this) closeTapeClue()">' +
    '<div class="tape-book-clue-dialog" role="dialog" aria-modal="true" aria-label="Evidence clue">' +
    '<div class="tape-book-clue-modal-title"></div>' +
    '<div class="tape-book-clue-modal-body"></div>' +
    '<button class="tape-book-clue-modal-close" onclick="closeTapeClue()">CLOSE CLUE</button>' +
    '</div>' +
    '</div>';
}

// ----- LEVEL 1: overview — left page photo wall, right page clue cards -----
function renderTapeOverviewSpread(ids) {
  const photos = ids
    .map(function (id, idx) {
      const d = CHARACTER_TAPES[id];
      const accent = d.accent || '#C1272D';
      const unseen = viewedCharacterTapes[id]
        ? ''
        : '<span class="tape-book-badge" aria-label="new">!</span>';
      return (
        '<button class="tape-book-polaroid" style="--tape-accent:' +
        tapeEscape(accent) +
        '; --pol-i:' +
        idx +
        ';" ' +
        'onclick="selectTapeArchive(\'' +
        tapeEscape(id) +
        '\')" aria-label="' +
        tapeEscape(d.name) +
        '">' +
        tapeBookPhotoHtml(d, 'tape-book-polaroid-photo') +
        '<span class="tape-book-polaroid-caption">' +
        tapeEscape(d.name) +
        '</span>' +
        unseen +
        '</button>'
      );
    })
    .join('');

  const clueCards = getUnlockedClueCards();
  let clues;
  if (!clueCards.length) {
    clues =
      '<div class="tape-book-clue-empty">No evidence recovered yet.<br>Complete a chapter to file its clue here.</div>';
  } else {
    clues = clueCards
      .map(function (c) {
        return (
          '<button class="tape-book-clue-btn" onclick="openTapeClue(' +
          c.n +
          ')">' +
          'CLUE ' +
          String(c.n).padStart(2, '0') +
          '</button>'
        );
      })
      .join('');
  }

  return (
    '' +
    '<div class="tape-book-page tape-book-page-left">' +
    '<div class="tape-book-page-title">Characters</div>' +
    '<div class="tape-book-photo-wall">' +
    photos +
    '</div>' +
    '</div>' +
    '<div class="tape-book-page tape-book-page-right">' +
    '<div class="tape-book-page-title">Evidence</div>' +
    '<div class="tape-book-clue-stack tape-book-clue-menu">' +
    clues +
    '</div>' +
    '</div>'
  );
}

// ----- LEVEL 2: profile — left page photo, right page bio in the character's accent -----
function renderTapeProfileSpread() {
  const d = CHARACTER_TAPES[currentArchiveTapeId];
  if (!d) return renderTapeOverviewSpread(getUnlockedTapeIds());
  const accent = d.accent || '#C1272D';
  return (
    '' +
    '<div class="tape-book-page tape-book-page-left tape-book-profile-left">' +
    '<button class="tape-book-back" onclick="backToTapeOverview()" aria-label="Back">&larr; All characters</button>' +
    '<div class="tape-book-profile-photo">' +
    tapeBookPhotoHtml(d, 'tape-book-profile-frame') +
    '</div>' +
    '</div>' +
    '<div class="tape-book-page tape-book-page-right tape-book-profile-right" style="--tape-accent:' +
    tapeEscape(accent) +
    ';">' +
    '<div class="tape-book-profile-paper">' +
    '<div class="tape-book-name">' +
    tapeEscape(d.name) +
    '</div>' +
    '<div class="tape-book-role">' +
    tapeEscape(d.role) +
    (d.status ? '<span class="tape-book-status"> · ' + tapeEscape(d.status) + '</span>' : '') +
    '</div>' +
    '<div class="tape-book-bio">' +
    tapeEscape(d.summary) +
    '</div>' +
    (d.relation ? '<div class="tape-book-relation">' + tapeEscape(d.relation) + '</div>' : '') +
    (d.firstSeen
      ? '<div class="tape-book-firstseen">First seen · ' + tapeEscape(d.firstSeen) + '</div>'
      : '') +
    '</div>' +
    '</div>'
  );
}

function resetTapeArchiveForTesting() {
  unlockedCharacterTapes = {};
  unlockedCharacterTapeOrder = [];
  archivedCharacterTapeOrder = [];
  viewedCharacterTapes = {};
  tapeUnlockQueue = [];
  tapePopupOpen = false;
  currentArchiveTapeId = null;
  updateTapeArchiveButton();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureCharacterTapeUI);
} else {
  ensureCharacterTapeUI();
}

var HL_SKIP_TAGS = { SPAN: 1, A: 1, STYLE: 1, SCRIPT: 1, BUTTON: 1, INPUT: 1, TEXTAREA: 1 };
var HL_SKIP_CLASS = [
  'prelude-notif-text',
  'notif-text',
  'prelude-notif-sender',
  'notif-sender',
  'prelude-notif-app',
  'notif-app',
  'prelude-notif-banner',
  'notif-banner',
  'ch2appeal-',
  'ch3appeal-',
  'ch4appeal-',
];

function hlShouldSkip(node) {
  let p = node.parentNode;
  while (p && p.nodeType === 1) {
    if (HL_SKIP_TAGS[p.tagName]) return true;
    if (p.className && typeof p.className === 'string') {
      for (let i = 0; i < HL_SKIP_CLASS.length; i++) {
        if (p.className.indexOf(HL_SKIP_CLASS[i]) !== -1) return true;
      }
    }
    p = p.parentNode;
  }
  return false;
}

function buildHlRegex() {
  const names = Object.keys(MENTION_COLORS).sort(function (a, b) {
    return b.length - a.length;
  });
  const escaped = names.map(function (n) {
    return n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  return new RegExp(
    '(\u00A3[\\d][\\d.,]*\\s?(?:M|million|k|K)?)|\\b(' + escaped.join('|') + ')\\b',
    'g'
  );
}

function highlightInContainer(container) {
  if (!container) return;

  const spans = container.getElementsByTagName('span');
  for (let s = 0; s < spans.length; s++) {
    const sp = spans[s];
    if (hlShouldSkip(sp)) continue;
    if (hlSpanInBubble(sp)) continue;
    if (sp.getAttribute('data-charhl')) continue;
    const txt = (sp.textContent || '').trim();
    const col = lookupMentionColor(txt);
    if (col) {
      sp.style.color = col;
      sp.style.fontWeight = 'bold';
      sp.setAttribute('data-charhl', '1');
    }
  }

  const re = buildHlRegex();
  const walker = document.createTreeWalker(container, 4 /* SHOW_TEXT */, null, false);
  const targets = [];
  let n;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue;
    if (hlShouldSkip(n)) continue;
    re.lastIndex = 0;
    if (re.test(n.nodeValue)) targets.push(n);
  }
  targets.forEach(function (node) {
    re.lastIndex = 0;
    const html = node.nodeValue.replace(re, function (m, money, name) {
      if (money)
        return (
          '<span data-charhl="1" style="color:' +
          MONEY_COLOR +
          ';font-weight:bold;">' +
          money +
          '</span>'
        );
      const color = MENTION_COLORS[name] || '#C8C0B0';
      return (
        '<span data-charhl="1" style="color:' + color + ';font-weight:bold;">' + name + '</span>'
      );
    });
    const span = document.createElement('span');
    span.innerHTML = html;
    node.parentNode.replaceChild(span, node);
  });
}

function lookupMentionColor(txt) {
  if (!txt) return null;
  if (/^\u00A3[\d][\d.,]*\s?(?:M|million|k|K)?$/.test(txt)) return MONEY_COLOR;
  if (MENTION_COLORS[txt]) return MENTION_COLORS[txt];
  // Match names by longest first.
  const keys = Object.keys(MENTION_COLORS).sort(function (a, b) {
    return b.length - a.length;
  });
  for (let i = 0; i < keys.length; i++) {
    if (txt.indexOf(keys[i]) !== -1) return MENTION_COLORS[keys[i]];
  }
  if (/\u00A3[\d][\d.,]*/.test(txt)) return MONEY_COLOR;
  return null;
}

function hlSpanInBubble(node) {
  let p = node.parentNode;
  while (p && p.nodeType === 1) {
    if (p.className && typeof p.className === 'string') {
      if (p.className.indexOf('notif-banner') !== -1) return true;
    }
    p = p.parentNode;
  }
  return false;
}

function highlightScene(sceneId) {
  const scene = document.getElementById(sceneId);
  if (scene) {
    setTimeout(function () {
      try {
        highlightInContainer(scene);
      } catch (e) {}
    }, 50);
  }
}

/**
 * voice-input.js — voice input for the Chapter 2 ARIA dialogue box.
 *
 * Uses the browser's built-in Web Speech API (SpeechRecognition). The recognised
 * text is placed into the #ch2-input field for the player to review before pressing
 * Send; it is not submitted automatically.
 *
 * Notes:
 *  - Well supported only in Chromium-based browsers (Chrome / Edge); Firefox and
 *    some Safari versions do not support it. In that case the mic button is disabled
 *    with a tooltip.
 *  - Requires HTTPS (satisfied by GitHub Pages) and microphone permission.
 *  - Recognition uses one primary language at a time (recognition.lang). The default
 *    is English because the puzzle keywords are English; Chinese input is usually
 *    still recognised. Use setVoiceLang() to switch the preferred language.
 */

let recognition = null;
let isListening = false;

// Preferred recognition language. 'en-US' is most accurate for English; if your
// users are mainly Chinese speakers, change this to 'zh-CN'. English is the default
// because the level keywords are English; Chinese speech is generally recognised too.
let voiceLang = 'en-US';

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function initVoiceInput() {
  const micBtn = document.getElementById('ch2-mic-btn');
  if (!micBtn) return;

  const SpeechRecognitionClass = getSpeechRecognition();
  if (!SpeechRecognitionClass) {
    // Unsupported browser: disable the button and explain.
    micBtn.disabled = true;
    micBtn.style.opacity = '0.4';
    micBtn.title =
      'Voice input not supported in this browser. Use Chrome or Edge.';
    return;
  }

  recognition = new SpeechRecognitionClass();
  recognition.lang = voiceLang;
  recognition.interimResults = false; // only return the final result
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onstart = function () {
    isListening = true;
    micBtn.textContent = '\u23FA Listening\u2026';
    micBtn.style.color = '#e05555';
    micBtn.title = 'Listening\u2026 click to stop';
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('ch2-input');
    if (input) {
      // Append if the field already has text; otherwise place it directly.
      input.value = input.value ? input.value + ' ' + transcript : transcript;
      input.focus();
    }
  };

  recognition.onerror = function (event) {
    isListening = false;
    resetMicButton();
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      alert(
        'Microphone permission denied. Please allow microphone access in your browser.'
      );
    }
  };

  recognition.onend = function () {
    isListening = false;
    resetMicButton();
  };
}

function resetMicButton() {
  const micBtn = document.getElementById('ch2-mic-btn');
  if (!micBtn) return;
  micBtn.textContent = 'Voice input';
  micBtn.style.color = '';
  micBtn.title = 'Voice input';
}

// Mic button click handler: start or stop listening.
function toggleVoiceInput() {
  if (!recognition) {
    initVoiceInput();
    if (!recognition) return; // still unsupported
  }
  if (isListening) {
    recognition.stop();
    return;
  }
  try {
    recognition.lang = voiceLang;
    recognition.start();
  } catch (err) {
    // start() throws if already running; ignore.
    isListening = false;
    resetMicButton();
  }
}

// Allow switching the recognition language (optional; for a future settings toggle).
function setVoiceLang(lang) {
  voiceLang = lang;
  if (recognition) recognition.lang = lang;
}

// Initialise after the page loads.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVoiceInput);
} else {
  initVoiceInput();
}

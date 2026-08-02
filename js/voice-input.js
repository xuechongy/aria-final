/**
 * voice-input.js — 第二章 ARIA 对话框的语音输入。
 *
 * 使用浏览器内置的 Web Speech API（SpeechRecognition）。识别结果会填入
 * #ch2-input 输入框，由玩家检查后再手动点 Send，不自动发送。
 *
 * 说明：
 *  - 仅 Chrome / Edge 等基于 Chromium 的浏览器支持良好；Firefox / 部分
 *    Safari 不支持，此时麦克风按钮会被禁用并提示。
 *  - 需要 HTTPS（GitHub Pages 满足）与麦克风权限。
 *  - 同时监听中文与英文：主识别语言设为英文，若结果疑似中文则不受影响
 *    （浏览器通常能容忍混合），玩家也可在设置里切换首选语言。
 */

let recognition = null;
let isListening = false;

// 首选识别语言。'en-US' 对英文最准；若你的用户以中文为主，改成 'zh-CN'。
// 这里默认英文，因为关卡关键词是英文；中文提问一般也能被识别。
let voiceLang = 'en-US';

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function initVoiceInput() {
  const micBtn = document.getElementById('ch2-mic-btn');
  if (!micBtn) return;

  const SpeechRecognitionClass = getSpeechRecognition();
  if (!SpeechRecognitionClass) {
    // 浏览器不支持：禁用按钮并提示。
    micBtn.disabled = true;
    micBtn.style.opacity = '0.4';
    micBtn.title =
      'Voice input not supported in this browser. Use Chrome or Edge. / 此浏览器不支持语音输入，请用 Chrome 或 Edge。';
    return;
  }

  recognition = new SpeechRecognitionClass();
  recognition.lang = voiceLang;
  recognition.interimResults = false; // 只在识别完成后返回最终结果
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onstart = function () {
    isListening = true;
    micBtn.textContent = '⏺ Listening…';
    micBtn.style.color = '#e05555';
    micBtn.title = 'Listening… click to stop / 正在聆听…点击停止';
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('ch2-input');
    if (input) {
      // 若输入框已有内容，追加；否则直接填入。
      input.value = input.value ? input.value + ' ' + transcript : transcript;
      input.focus();
    }
  };

  recognition.onerror = function (event) {
    isListening = false;
    resetMicButton();
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      alert(
        'Microphone permission denied. Please allow microphone access in your browser. / 麦克风权限被拒绝，请在浏览器中允许麦克风访问。'
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
  micBtn.title = 'Voice input / 语音输入';
}

// 麦克风按钮点击处理：开始或停止聆听。
function toggleVoiceInput() {
  if (!recognition) {
    initVoiceInput();
    if (!recognition) return; // 仍不支持
  }
  if (isListening) {
    recognition.stop();
    return;
  }
  try {
    recognition.lang = voiceLang;
    recognition.start();
  } catch (err) {
    // start() 在已运行时会抛错，忽略即可。
    isListening = false;
    resetMicButton();
  }
}

// 允许切换识别语言（可选，供将来做设置按钮用）。
function setVoiceLang(lang) {
  voiceLang = lang;
  if (recognition) recognition.lang = lang;
}

// 页面加载后初始化。
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVoiceInput);
} else {
  initVoiceInput();
}

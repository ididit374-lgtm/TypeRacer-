// Typing Test Text Arrays by Difficulty Level
const typingTexts = {
  easy: [
    "The cat sat on the mat. The dog ran in the park. Birds sing in the trees.",
    "I like to read books. The sun is bright today. We play games together.",
    "She has a red ball. He rides his bike fast. They eat lunch at noon."
  ],
  medium: [
    "Practice makes perfect, and typing speed improves with consistent effort and dedication. Focus on accuracy before speed.",
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.",
    "Technology has transformed the way we communicate and work. Learning to type efficiently is an essential skill in the modern world."
  ],
  hard: [
    "Sophisticated algorithms and computational paradigms facilitate unprecedented technological advancements, revolutionizing industries through artificial intelligence, machine learning, and quantum computing capabilities.",
    "The juxtaposition of contrasting philosophical perspectives illuminates fundamental questions about consciousness, epistemology, and the metaphysical nature of reality itself.",
    "Comprehensive analysis of macroeconomic indicators, including inflation rates, unemployment statistics, and fiscal policy implementations, requires meticulous examination of multifaceted interdependencies."
  ]
};

// Function to get random text based on difficulty
function getRandomText(difficulty) {
  const texts = typingTexts[difficulty];
  if (!texts || texts.length === 0) {
    return "Please select a difficulty level to begin.";
  }
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

// Function to update the sample text display
function updateSampleText(difficulty) {
  const sampleTextElement = document.getElementById('sampleText');
  const levelDisplayElement = document.getElementById('levelDisplay');
  
  if (sampleTextElement) {
    const newText = getRandomText(difficulty);
    renderSampleText(newText);
    clearTypingFeedback();
  }
  
  if (levelDisplayElement) {
    levelDisplayElement.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }
}

// Timer state
let testStartTime = null;
let testRunning = false;

// Disable/enable buttons
function setButtonStates(startDisabled, stopDisabled) {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  if (startBtn) startBtn.disabled = startDisabled;
  if (stopBtn) stopBtn.disabled = stopDisabled;
}

// Update the Time display in Results area
function updateTimeDisplay(seconds) {
  const timeDisplay = document.getElementById('timeDisplay');
  if (!timeDisplay) return;
  const rounded = Number(seconds).toFixed(2);
  timeDisplay.textContent = `${rounded}s`;
}

// Typing input helpers
function clearTypingInput() {
  const typingInput = document.getElementById('typingInput');
  if (typingInput) typingInput.value = '';
}

function enableTypingInput() {
  const typingInput = document.getElementById('typingInput');
  if (typingInput) typingInput.disabled = false;
}

function disableTypingInput() {
  const typingInput = document.getElementById('typingInput');
  if (typingInput) typingInput.disabled = true;
}

// WPM helpers
function getSelectedDifficulty() {
  const select = document.getElementById('difficultySelect');
  return select ? select.value : null;
}

function updateLevelDisplay() {
  const levelDisplay = document.getElementById('levelDisplay');
  if (!levelDisplay) return;
  const level = getSelectedDifficulty();
  levelDisplay.textContent = level
    ? level.charAt(0).toUpperCase() + level.slice(1)
    : '-';
}

function normalizeWord(word) {
  // remove punctuation (keep letters, digits, underscore, apostrophes) and lowercase
  return word.replace(/[^\w']+/g, '').toLowerCase();
}

function tokenizeText(text) {
  return (text || '')
    .trim()
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);
}

function calculateCorrectWords(sampleText, typedText) {
  const sampleWords = tokenizeText(sampleText);
  const typedWords = tokenizeText(typedText);
  let correct = 0;
  for (let i = 0; i < typedWords.length && i < sampleWords.length; i++) {
    if (typedWords[i] === sampleWords[i]) correct++;
  }
  return correct;
}

function calculateWPM(correctWords, elapsedSeconds) {
  if (!elapsedSeconds || elapsedSeconds <= 0) return 0;
  const wpm = (correctWords / elapsedSeconds) * 60;
  return Math.round(wpm);
}

function updateWPMDisplay(wpm) {
  const wpmDisplay = document.getElementById('wpmDisplay');
  if (wpmDisplay) wpmDisplay.textContent = String(wpm);
}

// --- Live accuracy feedback ---
let sampleWordSpans = [];
let sampleWordOriginals = [];
let sampleWordNormalized = [];

function renderSampleText(text) {
  const el = document.getElementById('sampleText');
  if (!el) return;
  const words = (text || '').trim().split(/\s+/);
  sampleWordOriginals = words;
  sampleWordNormalized = words.map(normalizeWord);
  const html = words.map((w, i) => `<span class="sample-word" data-index="${i}">${w}</span>`).join(' ');
  el.innerHTML = html;
  sampleWordSpans = Array.from(el.querySelectorAll('.sample-word'));
}

function clearTypingFeedback() {
  sampleWordSpans.forEach(span => span.classList.remove('word-correct', 'word-incorrect'));
}

function applyTypingFeedback(typedText) {
  const typedWords = (typedText || '').trim().split(/\s+/).map(normalizeWord);
  for (let i = 0; i < sampleWordSpans.length; i++) {
    const span = sampleWordSpans[i];
    span.classList.remove('word-correct', 'word-incorrect');
    if (i < typedWords.length) {
      const typed = typedWords[i];
      const expected = sampleWordNormalized[i];
      if (!typed) continue;
      if (typed === expected) {
        span.classList.add('word-correct');
      } else {
        span.classList.add('word-incorrect');
      }
    }
  }
}

// Start the test: record start time and update buttons
function startTest() {
  if (testRunning) return;
  testStartTime = performance.now();
  testRunning = true;
  setButtonStates(true, false); // disable Start, enable Stop

  clearTypingInput();
  enableTypingInput();
  clearTypingFeedback();

  const typingInput = document.getElementById('typingInput');
  if (typingInput) typingInput.focus();

  updateTimeDisplay(0);
}

// Stop the test: compute elapsed time and update UI
function stopTest() {
  if (!testRunning || testStartTime === null) return;
  const elapsedMs = performance.now() - testStartTime;
  const elapsedSeconds = elapsedMs / 1000;
  updateTimeDisplay(elapsedSeconds);

  // WPM calculation
  const sampleTextEl = document.getElementById('sampleText');
  const typingInputEl = document.getElementById('typingInput');
  const sampleText = sampleTextEl ? sampleTextEl.textContent || '' : '';
  const typedText = typingInputEl ? typingInputEl.value || '' : '';
  const correctWords = calculateCorrectWords(sampleText, typedText);
  const wpm = calculateWPM(correctWords, elapsedSeconds);
  updateWPMDisplay(wpm);
  updateLevelDisplay();

  testRunning = false;
  testStartTime = null;
  setButtonStates(false, true); // enable Start, disable Stop
  disableTypingInput();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const difficultySelect = document.getElementById('difficultySelect');
  
  // Event listener for difficulty selection
  if (difficultySelect) {
    difficultySelect.addEventListener('change', function() {
      const selectedDifficulty = this.value;
      
      // Only update if a valid difficulty is selected
      if (selectedDifficulty === 'easy' || selectedDifficulty === 'medium' || selectedDifficulty === 'hard') {
        updateSampleText(selectedDifficulty);
      }
    });
  }

  // Hook up Start/Stop buttons and initial state
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const typingInput = document.getElementById('typingInput');

  if (startBtn && stopBtn) {
    setButtonStates(false, true); // Stop disabled initially
    startBtn.addEventListener('click', startTest);
    stopBtn.addEventListener('click', stopTest);
  }

  // Live feedback while typing
  if (typingInput) {
    typingInput.addEventListener('input', function() {
      applyTypingFeedback(this.value);
    });
  }

  // Disable typing input until the test starts
  disableTypingInput();

  // Render initial sample text based on current selection (if any)
  const initialLevel = getSelectedDifficulty();
  if (initialLevel === 'easy' || initialLevel === 'medium' || initialLevel === 'hard') {
    updateSampleText(initialLevel);
  } else {
    // Fallback: render current text content into spans
    const sampleTextElement = document.getElementById('sampleText');
    if (sampleTextElement) {
      renderSampleText(sampleTextElement.textContent || '');
    }
  }
});

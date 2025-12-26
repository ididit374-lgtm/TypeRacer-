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
    sampleTextElement.textContent = newText;
  }
  
  if (levelDisplayElement) {
    levelDisplayElement.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }
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
});

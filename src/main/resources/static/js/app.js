import { ComplimentGenerator } from '/js/modules/compliments.js';
import { QuizManager } from '/js/modules/quiz.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Get the JSON data element
        const dataElement = document.getElementById('compliments-data');

        // Parse the JSON
        const compliments = dataElement ? JSON.parse(dataElement.textContent) : [];

        // Initialize modules
        new ComplimentGenerator('complimentBtn', 'complimentText', compliments);
        new QuizManager('quiz-answer', 'correct-answer', 'quizResult');
        new QuizManager('quiz-answer2', 'correct-answer2', 'quizResult2');
        new QuizManager('quiz-answer3', 'correct-answer3', 'quizResult3');
        new QuizManager('quiz-answer4', 'correct-answer4', 'quizResult4');
        new QuizManager('quiz-answer5', 'correct-answer5', 'quizResult5');
        new QuizManager('quiz-answer6', 'correct-answer6', 'quizResult6');


        console.log('Initialized successfully with compliments:', compliments);
    } catch (error) {
        console.error('Initialization error:', error);
        // Fallback compliments if there's an error
        new ComplimentGenerator('complimentBtn', 'complimentText', [
            "You're wonderful",
            "You're amazing"
        ]);
    }
});

// Reasons database
const reasons = [
  "How your eyes light up when you talk about things you love (climbing)",
  "The comforting sound of your heartbeat when we hug or touch",
  "You make me want to be a better man everyday",
  "You are the light in my life",
  "I Love you",
  "I'll always be here for you",
  "I'll always want you",
  "I'll always want to take care of you",
  "something about climbing here",
  "How happy am I to have you in my life",
  "How you make me want to kidnap you",
  "I Love you so much",
  "I am probably missing you now"
];

// Create stars
function createStars() {
  const sky = document.querySelector('.night-sky');
  const starCount = 100;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // Random positioning
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);

    // Random delay for twinkling
    star.style.animationDelay = `${Math.random() * 5}s`;

    // Click event
    star.addEventListener('click', () => {
      showRandomReason(star);
    });

    sky.appendChild(star);
  }
}

function showRandomReason(star) {
  const textElement = document.querySelector('.handwritten-text');
  const audio = document.getElementById('harpAudio');

  // Animate star
  star.style.transform = 'scale(3)';
  setTimeout(() => { star.style.transform = 'scale(1)'; }, 300);

  // Get random reason
  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

  // Display with typewriter effect
  let i = 0;
  textElement.textContent = '';
  const typing = setInterval(() => {
    if (i < randomReason.length) {
      textElement.textContent += randomReason.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, 50);

  // Play soft sound
  audio.currentTime = 0;
  audio.play();
}
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Add this function to handle scroll events
function handleScrollAnimation() {
    const constellation = document.querySelector('.constellation-container');
    if (isInViewport(constellation)) {
        constellation.classList.add('visible');
        // Remove the event listener after animation triggers
        window.removeEventListener('scroll', handleScrollAnimation);
    }
}
// Initialize on load
window.addEventListener('load', function() {
    createStars();
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
    // Check immediately in case the element is already in view
    handleScrollAnimation();
});
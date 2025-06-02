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
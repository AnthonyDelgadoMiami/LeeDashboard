export class QuizManager {
  constructor(answersClass, correctAnswerId, resultId) {
    this.answers = document.querySelectorAll(`.${answersClass}`);
    this.resultElement = document.getElementById(resultId);
    this.correctAnswerId = correctAnswerId;
    
    if (this.answers.length > 0 && this.resultElement) {
      this.setupQuiz();
    }
  }

  setupQuiz() {
    this.answers.forEach(button => {
      button.addEventListener('click', (e) => this.checkAnswer(e));
    });
  }

  checkAnswer(event) {
    const isCorrect = event.target.id === this.correctAnswerId;
    this.resultElement.textContent = isCorrect ? "Correct! 🎉" : "Try again!";
    this.resultElement.className = isCorrect ? "text-success" : "text-danger";
  }
}
export class ComplimentGenerator {
  constructor(buttonId, outputId, compliments) {
    this.button = document.getElementById(buttonId);
    this.output = document.getElementById(outputId);
    this.compliments = compliments;

    if (this.button && this.output) {
      this.button.addEventListener('click', () => this.generateCompliment());
    }
  }

  generateCompliment() {
    const randomCompliment = this.compliments[
      Math.floor(Math.random() * this.compliments.length)
    ];
    this.output.textContent = randomCompliment;
  }
}
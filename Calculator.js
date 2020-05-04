class Calculator {
    constructor() {
        this.buttons = document.querySelectorAll('.button');
        this.score = document.querySelector('.score');
        this.historyIcon = document.querySelector('.history-icon');
        this.history = document.querySelector('.history');
        this.eventListeners();
    }
    eventListeners = () => {
        this.historyIcon.addEventListener('click', () => {
            this.history.classList.toggle("--active");
        })
    }
}

const calculator = new Calculator;
class Calculator {
    constructor() {
        this.displayValue = '0';
        this.previousValue = null;
        this.selectedFunction = null;
        this.isFunctionDone = false;
        this.repeatedValue = 0;
        this.wasEqualClicked = false;
        this.bindToDisplay();
        this.bindToNumbers();
        this.bindToButtons();
        this.bindToHistory();
    }

    bindToDisplay() {
        const display = document.querySelector('.score');

        if (!display) {
            throw('cannot find display element');
        }

        display.textContent = this.displayValue;
        this.display = display;
    }

    bindToNumbers() {
        const numbers = document.querySelectorAll('.button__number');

        if (numbers.length !== 10) {
            console.warn('Missing numbers on keyboard');
        }

        numbers.forEach(number => number.addEventListener('click', event => this.concatenateNumber(event)));
    }

    bindToButtons() {
        this.bindFunctionToButton("[data-value='clear']", () => this.clear());
        this.bindFunctionToButton("[data-value='cancel']", () => this.cancel());
        this.bindFunctionToButton("[data-value='addition']", () => this.addition());
        this.bindFunctionToButton("[data-value='substraction']", () => this.substraction());
        this.bindFunctionToButton("[data-value='multiply']", () => this.multiplication());
        this.bindFunctionToButton("[data-value='divide']", () => this.divide());
        this.bindFunctionToButton("[data-value='equal']", () => this.equal());
        this.bindFunctionToButton("[data-value='back']", () => this.back());
        this.bindFunctionToButton("[data-value='invert']", () => this.inversion());
        this.bindFunctionToButton("[data-value='comma']", () => this.addComa());
        this.bindFunctionToButton("[data-value='percent']", () => this.percent());
        this.bindFunctionToButton("[data-value='square']", () => this.square());
        this.bindFunctionToButton("[data-value='power']", () => this.power());
        this.bindFunctionToButton("[data-value='fraction']", () => this.fraction());
    }

    bindFunctionToButton(id, callback) {
        const element = document.querySelector(id);
        if (!element) {
            return console.warn(`Cant find element ${element}`);
        }
        element.addEventListener('click', () => callback());
    }

    bindToHistory() {
        const historyIcon = document.querySelector('.history-icon');
        const history = document.querySelector('.history');

        historyIcon.addEventListener('click', () => {
            history.classList.toggle("history--active");
        })
    }

    displayHistory() {
        const history = document.querySelector('.history');
        history.textContent = this.displayValue;
    }


    concatenateNumber(event) {
        this.displayValue = this.displayValue === null || this.displayValue === '0' ?
            event.target.textContent : this.displayValue + event.target.textContent;
        if (this.wasEqualClicked) {
            this.previousValue = 0;
            this.repeatedValue = 0;
            this.wasEqualClicked = false;
        }
        this.isFunctionDone = false;
        this.display.textContent = this.displayValue;
    }

    clear() {
        this.previousValue = 0;
        this.selectedFunction = null;
        this.changeDisplayValue(null);
    }

    cancel() {
        this.changeDisplayValue(null);
    }

    addition(hasRepeatedValue) {
        this.callPreviousFunctionAndAssignNew(this.addition, hasRepeatedValue);

        if (this.isFunctionDone) {
            this.setValuesForIsFunctionDone();

            return;
        }

        const [displayValue, previousValue] = this.getDisplayAndPreviousValue(hasRepeatedValue);
        const newValue = displayValue + previousValue;


        this.getRepeatedValue(hasRepeatedValue, newValue);
        this.setValuesAfterSettingNewValue(newValue);

    }

    substraction(hasRepeatedValue) {
        this.callPreviousFunctionAndAssignNew(this.substraction, hasRepeatedValue);
        if (this.isFunctionDone) {
            this.setValuesForIsFunctionDone();

            return;
        }

        const [displayValue, previousValue] = this.getDisplayAndPreviousValue(hasRepeatedValue);
        let newValue;

        if (this.previousValue !== null) {
            newValue = hasRepeatedValue ? displayValue - this.repeatedValue : previousValue - displayValue;

            this.getRepeatedValue(hasRepeatedValue, newValue);
        }

        this.setValuesAfterSettingNewValue(newValue);


    }

    multiplication(hasRepeatedValue) {
        this.callPreviousFunctionAndAssignNew(this.multiplication, hasRepeatedValue);

        if (this.isFunctionDone) {
            this.setValuesForIsFunctionDone();

            return;
        }

        const [displayValue, previousValue] = this.getDisplayAndPreviousValue(hasRepeatedValue);
        const newValue = displayValue * previousValue;


        this.getRepeatedValue(hasRepeatedValue, newValue);
        this.setValuesAfterSettingNewValue(newValue);

    }

    divide(hasRepeatedValue) {
        this.callPreviousFunctionAndAssignNew(this.divide, hasRepeatedValue);
        if (this.isFunctionDone) {
            this.setValuesForIsFunctionDone();

            return;
        }

        const [displayValue, previousValue] = this.getDisplayAndPreviousValue(hasRepeatedValue);
        const newValue = hasRepeatedValue ? displayValue / this.repeatedValue : previousValue === 0 ? displayValue : previousValue / displayValue;


        this.getRepeatedValue(hasRepeatedValue, newValue);
        this.setValuesAfterSettingNewValue(newValue);
    }

    equal() {
        this.isFunctionDone = false;
        if (!this.wasEqualClicked) {
            this.selectedFunction(false);
        } else {
            this.selectedFunction(true);
        }
        this.wasEqualClicked = true;
    }

    percent() {
        this.callSpecialFunction(this.previousValue * this.displayValue / 100);

    }

    square() {
        this.callSpecialFunction(Math.sqrt(this.displayValue));
    }

    power() {
        this.callSpecialFunction(this.displayValue ** 2);
    }

    fraction() {
        this.callSpecialFunction(1 / this.displayValue);
    }

    callSpecialFunction(value) {
        this.wasEqualClicked = false;
        this.changeDisplayValue(value);
    }

    inversion() {
        this.changeDisplayValue(this.displayValue >= 0 ? -Math.abs(this.displayValue) : Math.abs(this.displayValue));
    }


    back() {
        this.changeDisplayValue(this.displayValue ? this.displayValue.slice(0, -1) : null);
    }

    addComa() {
        if (!this.display.textContent.includes('.')) {
            this.changeDisplayValue(`${this.displayValue ? this.displayValue : '0'}.`)
        }
    }

    callPreviousFunctionAndAssignNew(currentFunction, hasRepeatedValue) {
        if (this.selectedFunction !== currentFunction && this.selectedFunction) {
            this.selectedFunction(hasRepeatedValue);

        }
        this.selectedFunction = currentFunction;
    }

    setValuesForIsFunctionDone() {
        this.repeatedValue = Number(this.previousValue);
        this.displayValue = '0';
        this.wasEqualClicked = false;
    }

    getDisplayAndPreviousValue(hasRepeatedValue) {
        const displayValue = Number(this.display.textContent);
        const previousValue = hasRepeatedValue ? this.repeatedValue : Number(this.previousValue);
        return [displayValue, previousValue];
    }

    getRepeatedValue(hasRepeatedValue, newValue) {
        this.repeatedValue = hasRepeatedValue ? this.repeatedValue : this.wasEqualClicked ? newValue : Number(this.display.textContent);
    }

    setValuesAfterSettingNewValue(newValue) {
        this.isFunctionDone = true;
        this.wasEqualClicked = false;
        this.displayValue = null;
        this.display.textContent = this.previousValue !== null ? newValue : this.display.textContent;
        this.previousValue = this.previousValue !== null ? newValue : this.display.textContent;
    }

    changeDisplayValue(value) {
        const isNoValue = value === null || value === '';
        this.displayValue = value;
        this.display.textContent = isNoValue ? '0' : value.toString();
    }


}

new Calculator();
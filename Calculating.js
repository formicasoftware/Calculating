// © 2024 Formica Software. Not for commercial use. All rights reserved.
const display = document.getElementById('display');

let currentDisplay = '0';
let expression = '';
let firstValue = null;
let operator = null;

function updateDisplay() {
    if (expression) {
        display.textContent = expression + currentDisplay;
    } else {
        display.textContent = currentDisplay;
    }
}

function clearDisplay() {
    currentDisplay = '0';
    expression = '';
    firstValue = null;
    operator = null;
    updateDisplay();
}

function deleteLastCharacter() {
    if (currentDisplay.length > 1) {
        currentDisplay = currentDisplay.slice(0, -1);
    } else {
        currentDisplay = '0';
    }
    updateDisplay();
}

function appendToDisplay(value) {
    if (currentDisplay === '0' && value !== '.') {
        currentDisplay = value;
    } else {
        currentDisplay += value;
    }
    updateDisplay();
}

function handlePlusMinus() {
    if (currentDisplay !== '0') {
        if (currentDisplay.startsWith('-')) {
            currentDisplay = currentDisplay.slice(1);
        } else {
            currentDisplay = '-' + currentDisplay;
        }
        updateDisplay();
    }
}

function handleOperator(op) {
    if (firstValue === null) {
        firstValue = currentDisplay;
        operator = op;
        expression = firstValue + ' ' + operator + ' ';
        currentDisplay = '';
    }
    updateDisplay();
}

function handlePercent() {
    if (firstValue !== null) {
        let percentage = (parseFloat(currentDisplay) / 100) * parseFloat(firstValue);
        currentDisplay = percentage.toString();
        expression = firstValue + ' - ' + percentage + ' = ';
        updateDisplay();
        calculateResult();
    }
}

function calculateResult() {
    if (firstValue !== null && operator !== null) {
        let secondValue = currentDisplay;
        let result;

        try {
            switch (operator) {
                case '+':
                    result = parseFloat(firstValue) + parseFloat(secondValue);
                    break;
                case '-':
                    result = parseFloat(firstValue) - parseFloat(secondValue);
                    break;
                case '*':
                    result = parseFloat(firstValue) * parseFloat(secondValue);
                    break;
                case '/':
                    if (secondValue === '0') {
                        throw new Error("Cannot divide by zero");
                    }
                    result = parseFloat(firstValue) / parseFloat(secondValue);
                    break;
                default:
                    throw new Error("Invalid operator");
            }

            expression = '';
            currentDisplay = result.toString();
            firstValue = null;
            operator = null;
            updateDisplay();
        } catch (e) {
            currentDisplay = 'Error';
            updateDisplay();
            setTimeout(clearDisplay, 2000);
        }
    }
}

document.getElementById('clear').addEventListener('click', clearDisplay);
document.getElementById('delete').addEventListener('click', deleteLastCharacter);
document.getElementById('percent').addEventListener('click', handlePercent);
document.getElementById('divide').addEventListener('click', handleOperator.bind(null, '/'));
document.getElementById('seven').addEventListener('click', appendToDisplay.bind(null, '7'));
document.getElementById('eight').addEventListener('click', appendToDisplay.bind(null, '8'));
document.getElementById('nine').addEventListener('click', appendToDisplay.bind(null, '9'));
document.getElementById('multiply').addEventListener('click', handleOperator.bind(null, '*'));
document.getElementById('four').addEventListener('click', appendToDisplay.bind(null, '4'));
document.getElementById('five').addEventListener('click', appendToDisplay.bind(null, '5'));
document.getElementById('six').addEventListener('click', appendToDisplay.bind(null, '6'));
document.getElementById('subtract').addEventListener('click', handleOperator.bind(null, '-'));
document.getElementById('one').addEventListener('click', appendToDisplay.bind(null, '1'));
document.getElementById('two').addEventListener('click', appendToDisplay.bind(null, '2'));
document.getElementById('three').addEventListener('click', appendToDisplay.bind(null, '3'));
document.getElementById('add').addEventListener('click', handleOperator.bind(null, '+'));
document.getElementById('zero').addEventListener('click', appendToDisplay.bind(null, '0'));
document.getElementById('decimal').addEventListener('click', appendToDisplay.bind(null, '.'));
document.getElementById('equals').addEventListener('click', calculateResult);
document.getElementById('plus_minus').addEventListener('click', handlePlusMinus);

updateDisplay();
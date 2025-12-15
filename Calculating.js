// © 2025 Formica Software. Not for commercial use. All rights reserved.

const display = document.getElementById('display');

let expression = '';
let shouldClearOnNext = false;

function safeEvaluate(expr) {
    if (!expr) throw new Error('Empty expression');
    expr = expr.replace(/\s+/g, '');
    if (!/^[0-9+\-*/.]+$/.test(expr)) {
        throw new Error('Invalid characters');
    }
    const tokens = expr.match(/(?:\d+\.?\d*)|[-+*/]/g);
    if (!tokens || tokens.length === 0) throw new Error('Invalid tokens');
    if (tokens[0] === '-') {
        tokens.unshift('0');
    }
    for (let i = 1; i < tokens.length; i++) {
        if (tokens[i] === '-' && ['+', '-', '*', '/'].includes(tokens[i - 1])) {
            tokens.splice(i, 1, '0', '-');
        }
    }
    let i = 1;
    while (i < tokens.length) {
        if (tokens[i] === '*') {
            const left = parseFloat(tokens[i - 1]);
            const right = parseFloat(tokens[i + 1]);
            if (isNaN(left) || isNaN(right)) throw new Error('Invalid number');
            tokens.splice(i - 1, 3, (left * right).toString());
        } else if (tokens[i] === '/') {
            const left = parseFloat(tokens[i - 1]);
            const right = parseFloat(tokens[i + 1]);
            if (isNaN(left) || isNaN(right)) throw new Error('Invalid number');
            if (right === 0) throw new Error('Division by zero');
            tokens.splice(i - 1, 3, (left / right).toString());
        } else {
            i += 2;
        }
    }
    let result = parseFloat(tokens[0]);
    if (isNaN(result)) throw new Error('Invalid start');
    i = 1;
    while (i < tokens.length) {
        if (tokens[i] === '+') {
            result += parseFloat(tokens[i + 1]);
        } else if (tokens[i] === '-') {
            result -= parseFloat(tokens[i + 1]);
        }
        if (isNaN(parseFloat(tokens[i + 1]))) throw new Error('Invalid number');
        i += 2;
    }
    return result;
}

function updateDisplay() {
    if (expression === '' || expression.trim() === '-') {
        display.textContent = '0';
    } else {
        display.textContent = expression;
    }
}

function clearAll() {
    expression = '';
    shouldClearOnNext = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldClearOnNext) {
        clearAll();
        return;
    }
    expression = expression.slice(0, -1).trimEnd();
    if (expression.endsWith(' ')) {
        expression = expression.slice(0, -2).trimEnd();
    }
    updateDisplay();
}

function appendNumber(num) {
    if (shouldClearOnNext) {
        expression = '';
        shouldClearOnNext = false;
    }
    expression += num;
    updateDisplay();
}

function appendDecimal() {
    if (shouldClearOnNext) {
        expression = '0.';
        shouldClearOnNext = false;
        updateDisplay();
        return;
    }
    let parts = expression.split(/[\+\-\*\/]/);
    let lastNumber = parts[parts.length - 1].trim();
    if (lastNumber.includes('.')) return;
    expression += '.';
    updateDisplay();
}

function appendOperator(op) {
    if (shouldClearOnNext) {
        shouldClearOnNext = false;
    }
    expression = expression.trim();
    if (/[\+\-\*\/]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }
    expression += ' ' + op + ' ';
    updateDisplay();
}

function handlePercent() {
    if (shouldClearOnNext || expression.trim() === '') return;
    const match = expression.trim().match(/([+\-*\/])\s*([-\d.]+)$/);
    if (!match) return;
    const operator = match[1];
    const percentValue = parseFloat(match[2]);
    if (isNaN(percentValue)) return;
    const beforePart = expression.substring(0, match.index).trim();
    const baseMatch = beforePart.match(/([-\d.]+)$/);
    if (!baseMatch) return;
    const baseValue = parseFloat(baseMatch[1]);
    if (isNaN(baseValue)) return;
    const percentAmount = (baseValue * percentValue) / 100;
    const newExpr = beforePart.substring(0, baseMatch.index) + baseValue + operator + percentAmount;
    let result;
    try {
        result = safeEvaluate(newExpr);
        if (!isFinite(result)) throw new Error();
    } catch (e) {
        display.textContent = 'Error';
        setTimeout(clearAll, 1500);
        return;
    }
    expression = result.toString();
    shouldClearOnNext = true;
    updateDisplay();
}

function calculate() {
    const trimmed = expression.trim();
    if (trimmed === '' || trimmed === '-') return;
    let result;
    try {
        result = safeEvaluate(trimmed);
        if (!isFinite(result)) throw new Error();
    } catch (e) {
        display.textContent = 'Error';
        setTimeout(clearAll, 1500);
        return;
    }
    expression = result.toString();
    shouldClearOnNext = true;
    updateDisplay();
}

function handlePlusMinus() {
    if (shouldClearOnNext) {
        expression = '';
        shouldClearOnNext = false;
    }
    const parts = expression.split(/[\+\-\*\/]/);
    let lastNumStr = parts[parts.length - 1].trim();
    if (lastNumStr === '' || lastNumStr === '-' || lastNumStr === '0') {
        return;
    }
    let num = parseFloat(lastNumStr);
    num = -num;
    const newLastNumStr = num.toString();
    expression = expression.substring(0, expression.length - lastNumStr.length) + newLastNumStr;
    updateDisplay();
}

document.getElementById('clear').onclick = clearAll;
document.getElementById('delete').onclick = deleteLast;
document.getElementById('plus_minus').onclick = handlePlusMinus;
document.getElementById('percent').onclick = handlePercent;

document.getElementById('add').onclick = () => appendOperator('+');
document.getElementById('subtract').onclick = () => appendOperator('-');
document.getElementById('multiply').onclick = () => appendOperator('*');
document.getElementById('divide').onclick = () => appendOperator('/');

document.getElementById('seven').onclick = () => appendNumber('7');
document.getElementById('eight').onclick = () => appendNumber('8');
document.getElementById('nine').onclick = () => appendNumber('9');
document.getElementById('four').onclick = () => appendNumber('4');
document.getElementById('five').onclick = () => appendNumber('5');
document.getElementById('six').onclick = () => appendNumber('6');
document.getElementById('one').onclick = () => appendNumber('1');
document.getElementById('two').onclick = () => appendNumber('2');
document.getElementById('three').onclick = () => appendNumber('3');
document.getElementById('zero').onclick = () => appendNumber('0');
document.getElementById('decimal').onclick = appendDecimal;

document.getElementById('equals').onclick = calculate;

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendDecimal();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Delete' || e.key === 'Escape') clearAll();
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === '+') appendOperator('+');
    if (e.key === '-') appendOperator('-');
    if (e.key === '*') appendOperator('*');
    if (e.key === '/') { e.preventDefault(); appendOperator('/'); }
});

updateDisplay();

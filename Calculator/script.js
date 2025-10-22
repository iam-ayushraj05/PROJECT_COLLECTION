const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');
const calculatorData = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// --- CORE LOGIC FUNCTIONS ---

// Function to handle number and decimal input
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculatorData;

    if (waitingForSecondOperand === true) {
        // If we're starting a new calculation/operand
        calculatorData.displayValue = digit;
        calculatorData.waitingForSecondOperand = false;
    } else {
        // Ensure no multiple leading zeros
        if (digit === '.') {
             if (!displayValue.includes('.')) {
                calculatorData.displayValue += digit;
            }
        } else {
            // Append or replace '0'
            calculatorData.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }
}

// Function to perform the calculation
function performCalculation() {
    const { firstOperand, displayValue, operator } = calculatorData;
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null || operator === null) {
        return inputValue; // Nothing to calculate yet
    }
    
    const num1 = parseFloat(firstOperand);
    const num2 = inputValue;

    let result;
    if (operator === 'add') {
        result = num1 + num2;
    } else if (operator === 'subtract') {
        result = num1 - num2;
    } else if (operator === 'multiply') {
        result = num1 * num2;
    } else if (operator === 'divide') {
        // Division by zero error handling
        if (num2 === 0) {
            return 'Error'; 
        }
        result = num1 / num2;
    }
    
    // Limit result to a reasonable number of decimal places to prevent float errors
    return parseFloat(result.toFixed(10));
}

// Function to handle operator selection
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculatorData;
    const inputValue = parseFloat(displayValue);

    if (operator && calculatorData.waitingForSecondOperand) {
        // Allows changing the operator before the second number is entered (e.g., 5 + * -> 5 *)
        calculatorData.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        // Store the input value as the first operand
        calculatorData.firstOperand = inputValue;
    } else if (operator) {
        // Perform calculation for chaining operations (e.g., 5 + 3 +)
        const result = performCalculation();
        
        // Handle Error case
        if (result === 'Error') {
             display.value = result;
             resetCalculator();
             return;
        }

        calculatorData.displayValue = String(result);
        calculatorData.firstOperand = result;
    }

    calculatorData.waitingForSecondOperand = true;
    calculatorData.operator = nextOperator;
}

// Function to reset all calculator state
function resetCalculator() {
    calculatorData.displayValue = '0';
    calculatorData.firstOperand = null;
    calculatorData.waitingForSecondOperand = false;
    calculatorData.operator = null;
    // Clear any active state on the equal button
    keys.querySelector('[data-action="calculate"]').classList.remove('is-depressed');
}

// Function to handle backspace/delete
function deleteLast() {
    const { displayValue } = calculatorData;
    if (displayValue.length > 1) {
        calculatorData.displayValue = displayValue.slice(0, -1);
    } else {
        calculatorData.displayValue = '0';
    }
}

// Function to update the display
function updateDisplay() {
    display.value = calculatorData.displayValue;
}

// --- EVENT LISTENERS ---

// 1. Button Click Listener (Primary Input)
keys.addEventListener('click', (event) => {
    const { target } = event;
    const action = target.dataset.action;
    const value = target.value;

    if (!target.matches('button')) {
        return;
    }

    // Handle digit and decimal input
    if (!action) {
        inputDigit(value);
    } 
    // Handle specific actions (operators, clear, equals, delete)
    else if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {
        handleOperator(action);
    } else if (action === 'decimal') {
        inputDigit('.');
    } else if (action === 'calculate') {
        // Only calculate if an operator is set
        if(calculatorData.operator) {
            const result = performCalculation();

            if (result === 'Error') {
                 display.value = result;
                 resetCalculator();
                 return;
            }

            calculatorData.displayValue = String(result);
            calculatorData.firstOperand = null;
            calculatorData.operator = null;
            calculatorData.waitingForSecondOperand = true;
        }
    } else if (action === 'clear') {
        resetCalculator();
    } else if (action === 'delete') {
        deleteLast();
    }

    updateDisplay();
});


// 2. Keyboard Event Listener (For Desktop Usability)
window.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Prevent default browser actions for common calculator keys
    if (['+', '-', '*', '/', 'Enter', 'Escape', 'Backspace'].includes(key)) {
        event.preventDefault();
    }

    // Map keyboard keys to calculator actions
    if (key >= '0' && key <= '9') {
        inputDigit(key);
    } else if (key === '.') {
        inputDigit('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        // Map keyboard symbols to data-action names
        const actionMap = { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide' };
        handleOperator(actionMap[key]);
    } else if (key === 'Enter' || key === '=') {
        // Use 'calculate' action
        if(calculatorData.operator) {
            const result = performCalculation();
            if (result === 'Error') {
                 display.value = result;
                 resetCalculator();
                 return;
            }
            calculatorData.displayValue = String(result);
            calculatorData.firstOperand = null;
            calculatorData.operator = null;
            calculatorData.waitingForSecondOperand = true;
        }
    } else if (key === 'Escape') {
        // Use 'clear' action
        resetCalculator();
    } else if (key === 'Backspace') {
        // Use 'delete' action
        deleteLast();
    }

    updateDisplay();
});

// Initialize display on load
updateDisplay();
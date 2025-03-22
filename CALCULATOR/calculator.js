document.addEventListener('DOMContentLoaded', function() {
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('.btn');
    
    let currentInput = '';
    let currentOperation = null;
    let previousInput = '';
    let shouldResetScreen = false;
    
    // Add click event to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.value;
            
            if (value >= '0' && value <= '9') {
                handleNumberInput(value);
            } else if (value === '.') {
                handleDecimalInput();
            } else if (['+', '-', '*', '/'].includes(value)) {
                handleOperatorInput(value);
            } else if (value === '=') {
                handleEqualsInput();
            } else if (value === 'C') {
                clearCalculator();
            } else if (value === '←') {
                handleBackspace();
            }
            
            updateDisplay();
        });
    });
    
    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        if ((key >= '0' && key <= '9') || key === '.') {
            event.preventDefault();
            const button = [...buttons].find(btn => btn.value === key);
            if (button) button.click();
        } else if (['+', '-', '*', '/'].includes(key)) {
            event.preventDefault();
            const button = [...buttons].find(btn => btn.value === key);
            if (button) button.click();
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            const button = [...buttons].find(btn => btn.value === '=');
            if (button) button.click();
        } else if (key === 'Escape') {
            event.preventDefault();
            const button = [...buttons].find(btn => btn.value === 'C');
            if (button) button.click();
        } else if (key === 'Backspace') {
            event.preventDefault();
            const button = [...buttons].find(btn => btn.value === '←');
            if (button) button.click();
        }
    });
    
    function handleNumberInput(number) {
        if (currentInput === '0' || shouldResetScreen) {
            currentInput = number;
            shouldResetScreen = false;
        } else {
            currentInput += number;
        }
    }
    
    function handleDecimalInput() {
        if (shouldResetScreen) {
            currentInput = '0.';
            shouldResetScreen = false;
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput = currentInput === '' ? '0.' : currentInput + '.';
        }
    }
    
    function handleOperatorInput(operator) {
        if (currentInput === '' && previousInput === '') return;
        
        if (currentInput === '') {
            currentOperation = operator;
            return;
        }
        
        if (previousInput !== '') {
            calculate();
        }
        
        previousInput = currentInput;
        currentOperation = operator;
        shouldResetScreen = true;
    }
    
    function handleEqualsInput() {
        if (currentInput === '' || previousInput === '' || !currentOperation) return;
        
        calculate();
        currentOperation = null;
        previousInput = '';
        shouldResetScreen = true;
    }
    
    function calculate() {
        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (currentOperation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    currentInput = 'Error';
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Format the result to avoid long decimal numbers
        currentInput = computation.toString();
        if (currentInput.includes('.') && currentInput.split('.')[1].length > 8) {
            currentInput = computation.toFixed(8).toString().replace(/\.?0+$/, '');
        }
    }
    
    function clearCalculator() {
        currentInput = '';
        previousInput = '';
        currentOperation = null;
    }
    
    function handleBackspace() {
        currentInput = currentInput.toString().slice(0, -1);
    }
    
    function updateDisplay() {
        result.value = currentInput || '0';
    }
    
    // Initialize display
    updateDisplay();
});
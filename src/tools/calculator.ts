function isValidCalculation(calculation: string): boolean {
    const re = /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/;
    return re.test(calculation);
}

function calculate(calculation: string): number {
    return eval(calculation);
}

export function calculateExpression(expression: string): number {
    if (!isValidCalculation(expression)) {
        return null;
    }
    return calculate(expression) ?? undefined;
}
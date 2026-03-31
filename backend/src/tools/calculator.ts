export const calculator = async (expression: string) => {
  try {
    const result = eval(expression);
    return `Result: ${result}`;
  } catch (error) {
    return "Invalid mathematical expression.";
  }
};

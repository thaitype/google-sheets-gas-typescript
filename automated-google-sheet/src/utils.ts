function isValidA1Notation(input: string): boolean {
  const regex = /^[A-Za-z]+[0-9]+$/;
  return regex.test(input);
}

function validateString(value: unknown, title?: string): asserts value is string {
  if (typeof value !== 'string') throw new Error(`'${title ?? 'Value'}' must be a string.`);
}

function validateNumber(value: unknown, title?: string): asserts value is number {
  if (typeof value !== 'number') throw new Error(`'${title ?? 'Value'}' must be a number.`);
}

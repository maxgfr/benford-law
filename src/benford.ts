/**
 * Benford's Law expected probabilities for first digits (1-9)
 * Source: log10(1 + 1/d) where d is the digit
 */
const benfordProb: Record<string, number> = {
  '1': 0.301,
  '2': 0.176,
  '3': 0.125,
  '4': 0.097,
  '5': 0.079,
  '6': 0.067,
  '7': 0.058,
  '8': 0.051,
  '9': 0.046,
};

/**
 * Range for generating Benford-distributed numbers
 * Numbers between 1 and 1000 follow Benford's law well
 */
const MIN_BENFORD_RANGE = 1;
const MAX_BENFORD_RANGE = 1000;

const generateRandomNumber = (minimum: number, maximum: number) =>
  Math.random() * (maximum - minimum) + minimum;

/**
 * Extracts the first significant digit from a number
 * @param number - The number to extract the first digit from
 * @returns The first significant digit (1-9), or throws an error if invalid
 * @throws Error if the number is zero, negative, NaN, or infinite
 */
const getFirstDigit = (number: number): number => {
  if (!Number.isFinite(number)) {
    throw new Error('Number must be finite');
  }

  if (number <= 0) {
    throw new Error('Number must be positive and non-zero');
  }

  // Convert to string and remove decimal point to get first significant digit
  const absNumber = Math.abs(number);
  const normalized = absNumber >= 1 ? absNumber : absNumber * Math.pow(10, Math.ceil(-Math.log10(absNumber)));
  const firstDigit = parseInt(normalized.toString()[0], 10);

  if (firstDigit < 1 || firstDigit > 9) {
    throw new Error('Invalid first digit extracted');
  }

  return firstDigit;
};

/**
 * Generates a single random number that follows Benford's Law
 * Uses logarithmic distribution to ensure first digits follow Benford's Law
 * @returns A number between 1 and 1000 following Benford's Law
 */
export const generateBenfordLawNumber = (): number =>
  Math.exp(generateRandomNumber(Math.log(MIN_BENFORD_RANGE), Math.log(MAX_BENFORD_RANGE)));

/**
 * Generates an array of random numbers that follow Benford's Law
 * @param length - The number of random numbers to generate (must be > 0)
 * @returns An array of numbers following Benford's Law
 * @throws Error if length is not a positive integer
 */
export const generateBenfordLawNumbers = (length: number): number[] => {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Length must be a positive integer');
  }

  // Immutable approach: use Array.from instead of push
  return Array.from({ length }, () => generateBenfordLawNumber());
};

/**
 * Analyzes a dataset to determine if it follows Benford's Law
 * @param numbers - Array of positive numbers to analyze
 * @param threshold - Maximum acceptable deviation from Benford's probabilities (default: 0.01)
 * @param benfordProbabilities - Expected probabilities for each first digit (default: standard Benford)
 * @returns Analysis results including whether the dataset follows Benford's Law
 * @throws Error if the array is empty or contains invalid numbers
 */
export const processBenfordLaw = (
  numbers: number[],
  threshold = 0.01,
  benfordProbabilities = benfordProb,
): {
  isFollowingBenfordLaw: boolean;
  firstDigitCounts: Record<string, number>;
  firstDigitProbabilities: Record<string, number>;
  firstDigitAccuracies: Record<string, number>;
} => {
  // Validation
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Numbers array must be non-empty');
  }

  if (threshold <= 0 || threshold >= 1) {
    throw new Error('Threshold must be between 0 and 1');
  }

  // Extract first digits (will throw if any number is invalid)
  const firstDigits = numbers.map(getFirstDigit);

  // Count occurrences of each first digit
  // Use mutable approach within function scope for performance
  const firstDigitCounts: Record<string, number> = {};
  for (const digit of firstDigits) {
    const key = String(digit);
    firstDigitCounts[key] = (firstDigitCounts[key] || 0) + 1;
  }

  // Calculate probabilities
  const totalCount = numbers.length;
  const firstDigitProbabilities: Record<string, number> = {};
  for (const [digit, count] of Object.entries(firstDigitCounts)) {
    firstDigitProbabilities[digit] = count / totalCount;
  }

  // Calculate accuracy (deviation from Benford's law)
  const firstDigitAccuracies: Record<string, number> = {};
  for (const [digit, probability] of Object.entries(firstDigitProbabilities)) {
    const benfordProbability = benfordProbabilities[digit];
    if (benfordProbability !== undefined) {
      firstDigitAccuracies[digit] = Math.abs(benfordProbability - probability);
    }
  }

  // Check if dataset follows Benford's law
  const isBenford = Object.entries(benfordProbabilities).every(
    ([digit, probability]) => {
      const firstDigitProbability = firstDigitProbabilities[digit];
      // If a digit doesn't appear at all, probability is 0
      const actualProbability = firstDigitProbability || 0;
      return Math.abs(actualProbability - probability) < threshold;
    },
  );

  return {
    isFollowingBenfordLaw: isBenford,
    firstDigitProbabilities,
    firstDigitCounts,
    firstDigitAccuracies,
  };
};

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

const generateRandomNumber = (minimum: number, maximum: number) =>
  Math.random() * (maximum - minimum) + minimum;

const getFirstDigit = (number: number) => {
  const string = number.toString();
  return parseInt(string[0], 10);
};

export const generateBenfordLawNumber = () =>
  Math.exp(generateRandomNumber(Math.log(1), Math.log(1000)));

export const generateBenfordLawNumbers = (length: number) => {
  const numbers = [];
  for (let i = 0; i < length; i++) {
    numbers.push(generateBenfordLawNumber());
  }
  return numbers;
};

export const processBenfordLaw = (
  numbers: number[],
  threshold = 0.01,
  benfordProbabilities = benfordProb,
): {
  isFollowingBenfordLaw: boolean;
  firstDigitCounts: Record<string, number>;
  firstDigitProbabilities: Record<string, number>;
  firstDigitAccuracy: Record<string, number>;
} => {
  const firstDigits = numbers.map(getFirstDigit);
  const firstDigitCounts: Record<string, number> = firstDigits.reduce(
    (acc: Record<string, number>, digit: number) => ({
      ...acc,
      [digit]: (acc[digit] || 0) + 1,
    }),
    {},
  );
  const firstDigitProbabilities: Record<string, number> = Object.entries(
    firstDigitCounts,
  ).reduce(
    (acc, [digit, count]) => ({
      ...acc,
      [digit]: count / numbers.length,
    }),
    {},
  );

  const firstDigitAccuracy: Record<string, number> = Object.entries(
    firstDigitProbabilities,
  ).reduce((acc, [digit, probability]) => {
    const benfordProbability = benfordProbabilities[digit];
    const diff = Math.abs(benfordProbability - probability);
    return {
      ...acc,
      [digit]: diff,
    };
  }, {});

  const isBenford = Object.entries(benfordProbabilities).every(
    ([digit, probability]) => {
      const firstDigitProbability = firstDigitProbabilities[digit];
      return (
        firstDigitProbability &&
        Math.abs(firstDigitProbability - probability) < threshold
      );
    },
  );

  return {
    isFollowingBenfordLaw: isBenford,
    firstDigitProbabilities,
    firstDigitCounts,
    firstDigitAccuracy,
  };
};

# benford-law

Benford's law is an observation that in many real-life sets of numerical data, the leading digit is likely to be small. In sets that obey the law, the number 1 appears as the leading significant digit about 30% of the time, while 9 appears as the leading significant digit less than 5% of the time. If the digits were distributed uniformly, they would each occur about 11.1% of the time. Benford's law also makes predictions about the distribution of second digits, third digits, digit combinations, and so on.

To get a better understanding of Benford's law, check out [this article](https://en.wikipedia.org/wiki/Benford%27s_law).

## Installation

```bash
yarn add benford-law
```

## Usage

```ts
import {
  processBenfordLaw,
  generateBenfordLawNumbers,
  generateBenfordLawNumber,
} from 'benford-law';

// Generate a single random number that follows Benford's law (between 1 and 1000)
const randomNumber = generateBenfordLawNumber();
console.log(randomNumber);

// Generate an array of 10 random numbers that follow Benford's law
const randomNumbers = generateBenfordLawNumbers(10);
console.log(randomNumbers);

// Analyze an array of numbers to check if it follows Benford's law
// The second parameter (0.01) is the threshold for acceptable deviation
const result = processBenfordLaw(generateBenfordLawNumbers(50000), 0.01);
console.log(result);
// {
//   isFollowingBenfordLaw: true,
//   firstDigitProbabilities: {
//     '1': 0.29908,
//     '2': 0.17694,
//     '3': 0.1255,
//     '4': 0.09742,
//     '5': 0.0793,
//     '6': 0.06712,
//     '7': 0.0571,
//     '8': 0.05124,
//     '9': 0.0463
//   },
//   firstDigitCounts: {
//     '1': 14954,
//     '2': 8847,
//     '3': 6275,
//     '4': 4871,
//     '5': 3965,
//     '6': 3356,
//     '7': 2855,
//     '8': 2562,
//     '9': 2315
//   },
//   firstDigitAccuracies: {
//     '1': 0.0019199999999999773,
//     '2': 0.0009399999999999964,
//     '3': 0.0005000000000000004,
//     '4': 0.0004200000000000037,
//     '5': 0.0002999999999999947,
//     '6': 0.00011999999999999511,
//     '7': 0.000900000000000005,
//     '8': 0.0002400000000000041,
//     '9': 0.00030000000000000165
//   }
// }
```

## Error Handling

The library includes comprehensive input validation:

```ts
// ❌ These will throw errors:
generateBenfordLawNumbers(-5);     // Error: Length must be a positive integer
generateBenfordLawNumbers(0);      // Error: Length must be a positive integer
generateBenfordLawNumbers(5.5);    // Error: Length must be a positive integer

processBenfordLaw([]);             // Error: Numbers array must be non-empty
processBenfordLaw([-1, 2, 3]);     // Error: Number must be positive and non-zero
processBenfordLaw([0, 1, 2]);      // Error: Number must be positive and non-zero
processBenfordLaw([NaN, 1, 2]);    // Error: Number must be finite
processBenfordLaw([1, 2], -0.1);   // Error: Threshold must be between 0 and 1
processBenfordLaw([1, 2], 1);      // Error: Threshold must be between 0 and 1

// ✅ These are valid:
processBenfordLaw([1, 2, 3]);              // OK: positive integers
processBenfordLaw([1.5, 2.7, 3.9]);        // OK: positive decimals
processBenfordLaw([0.5, 0.7, 0.9]);        // OK: decimals < 1 (uses first significant digit)
processBenfordLaw([123456, 234567]);       // OK: large numbers
processBenfordLaw([1, 2, 3], 0.05);        // OK: custom threshold (5%)
```

## API

### `generateBenfordLawNumber(): number`

Generates a single random number that follows Benford's Law using logarithmic distribution.

**Returns:** A number between 1 and 1000 following Benford's Law

### `generateBenfordLawNumbers(length: number): number[]`

Generates an array of random numbers that follow Benford's Law.

**Parameters:**
- `length` - The number of random numbers to generate (must be a positive integer)

**Returns:** An array of numbers following Benford's Law

**Throws:** Error if length is not a positive integer

### `processBenfordLaw(numbers: number[], threshold?: number, benfordProbabilities?: Record<string, number>)`

Analyzes a dataset to determine if it follows Benford's Law.

**Parameters:**
- `numbers` - Array of positive numbers to analyze
- `threshold` - Maximum acceptable deviation from Benford's probabilities (default: 0.01 = 1%)
- `benfordProbabilities` - Expected probabilities for each first digit (default: standard Benford distribution)

**Returns:**
- `isFollowingBenfordLaw` - Boolean indicating if the dataset follows Benford's Law
- `firstDigitCounts` - Count of occurrences for each first digit (1-9)
- `firstDigitProbabilities` - Calculated probability for each first digit
- `firstDigitAccuracies` - Absolute deviation from expected Benford probabilities

**Throws:** Error if the array is empty, contains invalid numbers, or threshold is invalid

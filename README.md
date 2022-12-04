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

// to generate a random number that follows Benford's law
console.log(generateBenfordLawNumber());

// to generate an array of 10 random numbers that follow Benford's law
console.log(generateBenfordLawNumbers(10));

// to process an array of numbers and get the distribution
console.log(processBenfordLaw(generateBenfordLawNumbers(50000), 0.01));
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
//   firstDigitAccuracy: {
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

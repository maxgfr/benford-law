import {
  processBenfordLaw,
  generateBenfordLawNumbers,
  generateBenfordLawNumber,
} from '../benford';

describe('benford', () => {
  describe('generateBenfordLawNumber', () => {
    it('should generate a number greater or equal than 1', () => {
      const number = generateBenfordLawNumber();
      expect(number).toBeGreaterThanOrEqual(1);
    });

    it('should generate a number less than or equal to 1000', () => {
      const number = generateBenfordLawNumber();
      expect(number).toBeLessThanOrEqual(1000);
    });

    it('should generate finite numbers', () => {
      const number = generateBenfordLawNumber();
      expect(Number.isFinite(number)).toBe(true);
    });
  });

  describe('generateBenfordLawNumbers', () => {
    it('should generate an array of 5000 entries', () => {
      const numbers = generateBenfordLawNumbers(5000);
      expect(numbers).toHaveLength(5000);
    });

    it('should generate an array of 1 entry', () => {
      const numbers = generateBenfordLawNumbers(1);
      expect(numbers).toHaveLength(1);
    });

    it('should throw error for zero length', () => {
      expect(() => generateBenfordLawNumbers(0)).toThrow('Length must be a positive integer');
    });

    it('should throw error for negative length', () => {
      expect(() => generateBenfordLawNumbers(-5)).toThrow('Length must be a positive integer');
    });

    it('should throw error for non-integer length', () => {
      expect(() => generateBenfordLawNumbers(5.5)).toThrow('Length must be a positive integer');
    });

    it('should generate all positive numbers', () => {
      const numbers = generateBenfordLawNumbers(100);
      expect(numbers.every(n => n > 0)).toBe(true);
    });
  });

  describe('processBenfordLaw', () => {
    it('should return false for uniform distribution', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const benfordLaw = processBenfordLaw(numbers);
      expect(benfordLaw.isFollowingBenfordLaw).toBe(false);
      expect(benfordLaw.firstDigitProbabilities).toEqual({
        '1': 0.1111111111111111,
        '2': 0.1111111111111111,
        '3': 0.1111111111111111,
        '4': 0.1111111111111111,
        '5': 0.1111111111111111,
        '6': 0.1111111111111111,
        '7': 0.1111111111111111,
        '8': 0.1111111111111111,
        '9': 0.1111111111111111,
      });
      expect(benfordLaw.firstDigitCounts).toEqual({
        '1': 1,
        '2': 1,
        '3': 1,
        '4': 1,
        '5': 1,
        '6': 1,
        '7': 1,
        '8': 1,
        '9': 1,
      });
    });

    it('should return true for Benford-distributed numbers', () => {
      const numbers = generateBenfordLawNumbers(500);
      const benfordLaw = processBenfordLaw(numbers, 0.1);
      expect(benfordLaw.isFollowingBenfordLaw).toBe(true);
    });

    it('should return true with default accuracy for large dataset', () => {
      const numbers = generateBenfordLawNumbers(50000);
      const benfordLaw = processBenfordLaw(numbers);
      expect(benfordLaw.isFollowingBenfordLaw).toBe(true);
    });

    it('should throw error for empty array', () => {
      expect(() => processBenfordLaw([])).toThrow('Numbers array must be non-empty');
    });

    it('should throw error for negative numbers', () => {
      expect(() => processBenfordLaw([-1, 2, 3])).toThrow('Number must be positive and non-zero');
    });

    it('should throw error for zero', () => {
      expect(() => processBenfordLaw([0, 1, 2])).toThrow('Number must be positive and non-zero');
    });

    it('should throw error for NaN', () => {
      expect(() => processBenfordLaw([NaN, 1, 2])).toThrow('Number must be finite');
    });

    it('should throw error for Infinity', () => {
      expect(() => processBenfordLaw([Infinity, 1, 2])).toThrow('Number must be finite');
    });

    it('should throw error for invalid threshold (zero)', () => {
      expect(() => processBenfordLaw([1, 2, 3], 0)).toThrow('Threshold must be between 0 and 1');
    });

    it('should throw error for invalid threshold (>= 1)', () => {
      expect(() => processBenfordLaw([1, 2, 3], 1)).toThrow('Threshold must be between 0 and 1');
    });

    it('should throw error for invalid threshold (negative)', () => {
      expect(() => processBenfordLaw([1, 2, 3], -0.1)).toThrow('Threshold must be between 0 and 1');
    });

    it('should handle decimal numbers correctly', () => {
      const numbers = [1.5, 2.7, 3.9, 4.1, 5.2];
      const benfordLaw = processBenfordLaw(numbers);
      expect(benfordLaw.firstDigitCounts).toEqual({
        '1': 1,
        '2': 1,
        '3': 1,
        '4': 1,
        '5': 1,
      });
    });

    it('should handle decimal numbers less than 1', () => {
      const numbers = [0.5, 0.7, 0.9];
      const benfordLaw = processBenfordLaw(numbers);
      // 0.5 -> first significant digit is 5
      // 0.7 -> first significant digit is 7
      // 0.9 -> first significant digit is 9
      expect(benfordLaw.firstDigitCounts).toEqual({
        '5': 1,
        '7': 1,
        '9': 1,
      });
    });

    it('should handle large numbers', () => {
      const numbers = [123456, 234567, 345678];
      const benfordLaw = processBenfordLaw(numbers);
      expect(benfordLaw.firstDigitCounts).toEqual({
        '1': 1,
        '2': 1,
        '3': 1,
      });
    });

    it('should calculate accuracies correctly', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const benfordLaw = processBenfordLaw(numbers);

      // All digits have probability 1/9 ≈ 0.111
      // Accuracy for '1' should be |0.301 - 0.111| = 0.19
      expect(benfordLaw.firstDigitAccuracies['1']).toBeCloseTo(0.19, 2);
    });
  });
});

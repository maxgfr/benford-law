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
  });
  describe('generateBenfordLawNumbers', () => {
    it('should generate an array of 5000 entries', () => {
      const numbers = generateBenfordLawNumbers(5000);
      expect(numbers).toHaveLength(5000);
    });
  });

  describe('isFollowingBenfordLaw', () => {
    it('should return false', () => {
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

    it('should return true', () => {
      const numbers = generateBenfordLawNumbers(500);
      const benfordLaw = processBenfordLaw(numbers, 0.1);
      expect(benfordLaw.isFollowingBenfordLaw).toBe(true);
    });

    it('should return true with default accuracy', () => {
      const numbers = generateBenfordLawNumbers(50000);
      const benfordLaw = processBenfordLaw(numbers);
      expect(benfordLaw.isFollowingBenfordLaw).toBe(true);
    });
  });
});

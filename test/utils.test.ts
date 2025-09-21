import { describe, it, expect } from 'vitest';
import { 
  formatCurrency, 
  formatPercentage, 
  formatLargeNumber, 
  calcSlippage, 
  getEstimatedFillPrice,
  validateLeverage,
  validateSize,
  getPnLColor,
  getFundingColor
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1234.56, 4)).toBe('$1,234.5600');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0)).toBe('0.00%');
      expect(formatPercentage(0.1234, 4)).toBe('12.3400%');
    });
  });

  describe('formatLargeNumber', () => {
    it('should format large numbers with suffixes', () => {
      expect(formatLargeNumber(1000)).toBe('1.0K');
      expect(formatLargeNumber(1000000)).toBe('1.0M');
      expect(formatLargeNumber(1000000000)).toBe('1.0B');
      expect(formatLargeNumber(500)).toBe('500');
    });
  });

  describe('calcSlippage', () => {
    it('should calculate slippage correctly', () => {
      const slippage = calcSlippage(1000, 100);
      expect(slippage).toBeGreaterThan(100);
      expect(slippage).toBeLessThan(110);
    });
  });

  describe('getEstimatedFillPrice', () => {
    it('should calculate estimated fill price for long position', () => {
      const price = getEstimatedFillPrice(1000, true, 100, 3);
      expect(price).toBeGreaterThan(100);
    });

    it('should calculate estimated fill price for short position', () => {
      const price = getEstimatedFillPrice(1000, false, 100, 3);
      expect(price).toBeLessThan(100);
    });
  });

  describe('validateLeverage', () => {
    it('should validate leverage correctly', () => {
      expect(validateLeverage(1)).toBe(true);
      expect(validateLeverage(5)).toBe(true);
      expect(validateLeverage(10)).toBe(true);
      expect(validateLeverage(0)).toBe(false);
      expect(validateLeverage(11)).toBe(false);
      expect(validateLeverage(-1)).toBe(false);
    });
  });

  describe('validateSize', () => {
    it('should validate size correctly', () => {
      expect(validateSize(1)).toBe(true);
      expect(validateSize(1000)).toBe(true);
      expect(validateSize(1000000)).toBe(true);
      expect(validateSize(0)).toBe(false);
      expect(validateSize(-1)).toBe(false);
      expect(validateSize(1000001)).toBe(false);
    });
  });

  describe('getPnLColor', () => {
    it('should return correct colors for PnL', () => {
      expect(getPnLColor(100)).toBe('text-green-500');
      expect(getPnLColor(-100)).toBe('text-red-500');
      expect(getPnLColor(0)).toBe('text-gray-500');
    });
  });

  describe('getFundingColor', () => {
    it('should return correct colors for funding rate', () => {
      expect(getFundingColor(0.01)).toBe('text-red-500');
      expect(getFundingColor(-0.01)).toBe('text-green-500');
      expect(getFundingColor(0)).toBe('text-gray-500');
    });
  });
});

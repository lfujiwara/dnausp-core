import { CNPJ } from '@domain';

describe('CNPJ', () => {
  const validCNPJ = '05.292.531/0001-19';
  const invalidCNPJ = '05.292.531/0001-12';

  describe('Factory method (create)', () => {
    test('Success on valid CNPJ', () => {
      const result = CNPJ.create(validCNPJ);
      expect(result.isOk()).toBe(true);
    });

    test('Fail on invalid CNPJ', () => {
      const result = CNPJ.create(invalidCNPJ);
      expect(result.isFail()).toBe(true);
    });
  });

  describe('Constructor', () => {
    test('Success on valid CNPJ', () => {
      expect(() => new CNPJ(validCNPJ)).not.toThrow();
    });

    test('Throws on invalid CNPJ', () => {
      expect(() => new CNPJ(invalidCNPJ)).toThrow();
    });

    test('Stores value correctly', () => {
      const cnpj = new CNPJ(validCNPJ);
      expect(cnpj.get()).toMatch(CNPJ.unFormat(validCNPJ));
    });

    test('Normalizes value correctly', () => {
      const cnpj = new CNPJ(' ' + validCNPJ + ' ');
      expect(cnpj.get()).toMatch(CNPJ.unFormat(validCNPJ));
    });
  });

  describe('Formatting', () => {
    test('Formats CNPJ correctly', () => {
      const cnpj = new CNPJ(validCNPJ);
      expect(cnpj.format()).toMatch(validCNPJ);
    });

    test('Unformats CNPJ correctly', () => {
      const cnpj = new CNPJ(validCNPJ);
      expect(cnpj.unFormat()).toMatch('05292531000119');
    });
  });
});

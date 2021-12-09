import { CNAE } from '@domain';

describe('CNAE', () => {
  const validCNAE = '6202-3/00';
  const invalidCNAE = '62023000';

  describe('Factory method (create)', () => {
    test('Success on valid CNAE', () => {
      const result = CNAE.create(validCNAE);
      expect(result.isOk()).toBeTruthy();
    });

    test('Fail on invalid CNAE', () => {
      const result = CNAE.create(invalidCNAE);
      expect(result.isFail()).toBeTruthy();
    });
  });

  describe('Constructor', () => {
    test('Success on valid CNAE', () => {
      expect(() => new CNAE(validCNAE)).not.toThrow();
    });

    test('Fail on invalid CNAE', () => {
      expect(() => new CNAE(invalidCNAE)).toThrow();
    });

    test('Stores value correctly', () => {
      const cnae = new CNAE(validCNAE);
      expect(cnae.get()).toMatch(CNAE.unFormat(validCNAE));
    });

    test('Normalizes value correctly', () => {
      const cnae = new CNAE(' ' + validCNAE + ' ');
      expect(cnae.get()).toMatch(CNAE.unFormat(validCNAE));
    });
  });

  describe('Formatting', () => {
    test('Formats correctly', () => {
      const cnae = new CNAE(validCNAE);
      expect(cnae.format()).toBe(validCNAE);
    });

    test('Unformats correctly', () => {
      const cnae = new CNAE(validCNAE);
      expect(cnae.unFormat()).toBe(validCNAE.replace(/\D/g, ''));
    });
  });
});

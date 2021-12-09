import { Faturamento } from '@domain';

describe('Faturamento', () => {
  const validValue = 10000000;
  const invalidValue = 100000.32;
  const validYear = 2020;
  const invalidYear = -1;

  describe('Factory method (create)', () => {
    test('Success on valid values', () => {
      const result = Faturamento.create(validValue, validYear);
      expect(result.isOk());
    });

    test('Fail on invalid values', () => {
      let result = Faturamento.create(validValue, invalidYear);
      expect(result.isFail());

      result = Faturamento.create(invalidValue, validYear);
      expect(result.isFail());
    });
  });

  describe('Constructor', () => {
    test('Success on valid values', () => {
      expect(() => new Faturamento(validValue, validYear)).not.toThrow();
    });

    test('Fail on invalid values', () => {
      expect(() => new Faturamento(validValue, invalidYear)).toThrow();
      expect(() => new Faturamento(invalidValue, validYear)).toThrow();
    });

    test('Stores values correctly', () => {
      const faturamento = new Faturamento(validValue, validYear);
      expect(faturamento.valor).toBe(validValue);
      expect(faturamento.anoFiscal).toBe(validYear);
    });
  });
});

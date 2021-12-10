import { RegistrosAnuaisFactory, ValorMonetarioAnual } from '@domain';

describe('Valor monetario anual', () => {
  const validValue = 10000000;
  const invalidValue = 100000.32;
  const validYear = 2020;

  describe('Factory method (create)', () => {
    test('Success on valid values', () => {
      const result = RegistrosAnuaisFactory.valorMonetarioAnual(
        validYear,
        validValue,
      );
      expect(result.isOk());
    });

    test('Fail on invalid values', () => {
      const result = RegistrosAnuaisFactory.valorMonetarioAnual(
        validYear,
        invalidValue,
      );
      expect(result.isFail());
    });
  });

  describe('Constructor', () => {
    test('Success on valid values', () => {
      expect(
        () => new ValorMonetarioAnual(validYear, validValue),
      ).not.toThrow();
    });

    test('Fail on invalid values', () => {
      expect(() => new ValorMonetarioAnual(validYear, invalidValue)).toThrow();
    });

    test('Stores values correctly', () => {
      const faturamento = new ValorMonetarioAnual(validYear, validValue);
      expect(faturamento.valor).toBe(validValue);
      expect(faturamento.anoFiscal).toBe(validYear);
    });
  });
});

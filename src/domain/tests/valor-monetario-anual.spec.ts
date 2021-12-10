import { RegistrosAnuaisFactory, ValorMonetarioAnual } from '@domain';

describe('Valor monetario anual', () => {
  const validValue = 10000000;
  const invalidValue = 100000.32;
  const validYear = 2020;
  const invalidYear = -1;

  describe('Factory method (create)', () => {
    test('Success on valid values', () => {
      const result = RegistrosAnuaisFactory.valorMonetarioAnual(
        validValue,
        validYear,
      );
      expect(result.isOk());
    });

    test('Fail on invalid values', () => {
      let result = RegistrosAnuaisFactory.valorMonetarioAnual(
        validValue,
        invalidYear,
      );
      expect(result.isFail());

      result = RegistrosAnuaisFactory.valorMonetarioAnual(
        invalidValue,
        validYear,
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
      expect(() => new ValorMonetarioAnual(invalidYear, validValue)).toThrow();
      expect(() => new ValorMonetarioAnual(validYear, invalidValue)).toThrow();
    });

    test('Stores values correctly', () => {
      const faturamento = new ValorMonetarioAnual(validYear, validValue);
      expect(faturamento.valor).toBe(validValue);
      expect(faturamento.anoFiscal).toBe(validYear);
    });
  });
});

import { ValorInteiroPositivoAnual } from '@domain/valores-anuais/valor-inteiro-positivo-anual';

describe('Valor inteiro positivo anual', () => {
  const validValue = 10000000;
  const invalidValues = [-10000, NaN, 20000.32];
  const validYear = 2020;

  describe('Constructor', () => {
    test('Success on valid values', () => {
      expect(
        () => new ValorInteiroPositivoAnual(validYear, validValue),
      ).not.toThrow();
    });

    test('Fail on invalid values', () => {
      invalidValues.forEach((value) => {
        expect(() => new ValorInteiroPositivoAnual(validYear, value)).toThrow();
      });
    });

    test('Stores values correctly', () => {
      const faturamento = new ValorInteiroPositivoAnual(validYear, validValue);
      expect(faturamento.valor).toBe(validValue);
      expect(faturamento.anoFiscal).toBe(validYear);
    });
  });
});

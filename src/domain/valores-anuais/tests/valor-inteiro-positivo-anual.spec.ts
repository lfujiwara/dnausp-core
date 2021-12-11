import { ValorInteiroPositivoAnual } from '@domain/valores-anuais/valor-inteiro-positivo-anual';

describe('Valor inteiro positivo anual', () => {
  const validValue = 10000000;
  const invalidValue = -1000000;
  const validYear = 2020;

  describe('Constructor', () => {
    test('Success on valid values', () => {
      expect(
        () => new ValorInteiroPositivoAnual(validYear, validValue),
      ).not.toThrow();
    });

    test('Fail on invalid values', () => {
      expect(
        () => new ValorInteiroPositivoAnual(validYear, invalidValue),
      ).toThrow();
    });

    test('Stores values correctly', () => {
      const faturamento = new ValorInteiroPositivoAnual(validYear, validValue);
      expect(faturamento.valor).toBe(validValue);
      expect(faturamento.anoFiscal).toBe(validYear);
    });
  });
});

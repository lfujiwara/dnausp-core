import { Investimento, OrigemInvestimento } from '@domain';

describe('Valor monetario anual', () => {
  const validValue = 10000000;
  const invalidValue = 100000.32;
  const validOrigin = OrigemInvestimento.PE;
  const invalidOrigin = 'invalid';
  const validYear = 2020;

  describe('Constructor', () => {
    test('Success on valid values', () => {
      expect(
        () => new Investimento(validYear, validValue, validOrigin),
      ).not.toThrow();
    });

    test('Fail on invalid values', () => {
      expect(
        () => new Investimento(validYear, invalidValue, validOrigin),
      ).toThrow();
      expect(
        () => new Investimento(validYear, validValue, invalidOrigin as any),
      ).toThrow();
    });

    test('Stores values correctly', () => {
      const investimento = new Investimento(validYear, validValue, validOrigin);
      expect(investimento.valor).toBe(validValue);
      expect(investimento.anoFiscal).toBe(validYear);
      expect(investimento.origem).toBe(validOrigin);
    });
  });
});

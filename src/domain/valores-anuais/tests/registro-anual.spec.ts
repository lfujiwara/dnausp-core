import { RegistroAnual } from '@domain';

describe('Valor monetario anual', () => {
  const validYear = 2020;
  const invalidYear = -1;

  describe('Constructor', () => {
    test('Success on valid values', () => {
      expect(() => new RegistroAnual(validYear)).not.toThrow();
    });

    test('Fail on invalid values', () => {
      expect(() => new RegistroAnual(invalidYear)).toThrow();
    });

    test('Stores values correctly', () => {
      const registro = new RegistroAnual(validYear);
      expect(registro.anoFiscal).toBe(validYear);
    });
  });
});

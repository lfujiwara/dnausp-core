import { EstadoIncubacao, Incubacao, IncubadoraUSP } from '@domain/incubacao';

describe('Incubacao', () => {
  describe('Constructor', () => {
    const incubadora = IncubadoraUSP.ESALQTEC;
    const estado = EstadoIncubacao.INCUBADA;

    test('Success with valid values', () => {
      expect(() => new Incubacao(incubadora, estado)).not.toThrow();
    });

    test('Error with invalid incubadora', () => {
      expect(() => new Incubacao('', estado)).toThrow();
    });

    test('Error with invalid estado', () => {
      expect(() => new Incubacao(incubadora, 'PRONTA' as any)).toThrow();
    });
  });

  describe('Static method factory', () => {
    const incubadora = IncubadoraUSP.ESALQTEC;
    const estado = EstadoIncubacao.INCUBADA;

    test('OK with valid values', () => {
      const result = Incubacao.create(incubadora, estado);
      expect(result.isOk()).toBe(true);
    });

    test('Error with invalid incubadora', () => {
      const result = Incubacao.create('', estado);
      expect(result.isFail()).toBe(true);
    });

    test('Error with invalid estado', () => {
      const result = Incubacao.create(incubadora, 'PRONTA' as any);
      expect(result.isFail()).toBe(true);
    });
  });

  test('Stores valid values', () => {
    const incubadora = IncubadoraUSP.ESALQTEC;
    const estado = EstadoIncubacao.INCUBADA;
    const incubacao = new Incubacao(incubadora, estado);

    expect(incubacao.incubadora).toBe(incubadora);
    expect(incubacao.estado).toBe(estado);
  });
});

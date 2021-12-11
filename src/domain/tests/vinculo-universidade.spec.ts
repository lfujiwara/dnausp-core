import { VinculoUniversidade } from '@domain/vinculo-universidade';
import { TipoVinculo } from '@domain/enums/tipo-vinculo';
import { Instituto } from '@domain/enums/instituto';

describe('Vinculo universidade', () => {
  describe('Constructor', () => {
    test('Runs successfully with valid data', () => {
      expect(
        () =>
          new VinculoUniversidade(
            TipoVinculo.DOCENTE,
            '1234567',
            Instituto.ECA,
          ),
      ).not.toThrow();
    });

    test('Throws with invalid data', () => {
      expect(
        () =>
          new VinculoUniversidade(
            (TipoVinculo.DOCENTE + ' ') as TipoVinculo,
            '1234567',
            (Instituto.ECA + ' ') as Instituto,
          ),
      ).toThrow();
    });

    test('Stores data correctly', () => {
      const input = {
        tipo: TipoVinculo.DOCENTE,
        NUSP: '1234567',
        instituto: Instituto.ECA,
      };
      const vinculo = new VinculoUniversidade(
        input.tipo,
        input.NUSP,
        input.instituto,
      );

      expect(vinculo.tipo).toBe(input.tipo);
      expect(vinculo.NUSP).toBe(input.NUSP);
      expect(vinculo.instituto).toBe(input.instituto);
    });
  });

  describe('Static factory method', () => {
    test('Runs successfully with valid data', () => {
      const result = VinculoUniversidade.create(
        TipoVinculo.DOCENTE,
        '1234567',
        Instituto.ECA,
      );

      expect(result.isOk()).toBeTruthy();
    });

    test('Fails with invalid data', () => {
      const result = VinculoUniversidade.create(
        (TipoVinculo.DOCENTE + ' ') as TipoVinculo,
        '1234567',
        (Instituto.ECA + ' ') as Instituto,
      );
      expect(result.isFail()).toBeTruthy();
    });
  });
});

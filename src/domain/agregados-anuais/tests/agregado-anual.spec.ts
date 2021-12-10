import { AgregadoAnual, RegistroAnual } from '@domain';

describe('Agregado anual', () => {
  const valores: RegistroAnual[] = [
    { anoFiscal: 2017 },
    { anoFiscal: 2018 },
    { anoFiscal: 2019 },
  ];

  test('Stores the values correctly', () => {
    const agregado = new AgregadoAnual(valores);
    expect(agregado.valores).toEqual(valores);
  });

  test('Adds a value correctly', () => {
    const agregado = new AgregadoAnual();
    agregado.add(valores[0]);

    expect(agregado.valores).toEqual([valores[0]]);
  });

  test('Fails to add a value that already exists', () => {
    const agregado = new AgregadoAnual();
    const result = agregado.add(valores[0]);

    expect(result.isOk()).toBeTruthy();
  });

  test('Throws an error if values are set with an invalid array', () => {
    const invalidArr = valores.concat(valores[0]);

    expect(() => new AgregadoAnual(invalidArr)).toThrow();
  });
});

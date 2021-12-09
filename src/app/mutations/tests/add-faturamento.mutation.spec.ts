import { CNAE, CNPJ, Empresa } from '@domain';
import { v4 } from 'uuid';
import { Result } from 'typescript-monads';
import { AddFaturamentoMutation } from '@app';

describe('Add faturamento', () => {
  const makeSampleEmpresa = () =>
    new Empresa({
      id: v4(),
      estrangeira: false,
      nomeFantasia: 'Empresa Teste',
      razaoSocial: 'Empresa Teste Ltda',
      cnpj: new CNPJ('43.009.980/0001-04'),
      anoFundacao: 2010,
      atividadePrincipal: new CNAE('7020400'),
      atividadeSecundaria: [],
      faturamentos: [],
    });

  const deps = () => {
    const empresa = makeSampleEmpresa();
    const port = {
      addFaturamentoToEmpresa: jest.fn().mockResolvedValue(Result.ok(empresa)),
      getEmpresa: jest.fn().mockResolvedValue(Result.ok(empresa)),
    };

    const mutation = new AddFaturamentoMutation(port as any);

    return { port, mutation, empresa };
  };

  test('Handle invalid ID', async () => {
    const { mutation, port } = deps();

    port.getEmpresa.mockResolvedValueOnce(Result.fail('Invalid ID'));

    const result = await mutation.execute({
      empresaId: '1234',
      anoFiscal: 2005,
      valor: 6000000,
    });

    expect(result.isFail()).toBeTruthy();
    expect(port.addFaturamentoToEmpresa).not.toHaveBeenCalled();
  });

  test('Handle port failure', async () => {
    const { mutation, port, empresa } = deps();

    port.addFaturamentoToEmpresa.mockResolvedValueOnce(
      Result.fail('Port failure'),
    );

    const input = {
      empresaId: empresa.id,
      anoFiscal: 2005,
      valor: 6000000,
    };
    const result = await mutation.execute(input);

    expect(port.getEmpresa).toHaveBeenCalledWith(empresa.id);
    expect(port.getEmpresa).toHaveBeenCalledTimes(1);

    expect(port.addFaturamentoToEmpresa).toHaveBeenCalledTimes(1);
    expect(port.addFaturamentoToEmpresa).toHaveBeenCalledWith(
      input.empresaId,
      expect.arrayContaining([
        expect.objectContaining({
          anoFiscal: input.anoFiscal,
          valor: input.valor,
        }),
      ]),
    );

    expect(result.isFail()).toBeTruthy();
  });

  test('Calls the port correctly when inputs are OK', async () => {
    const { mutation, port, empresa } = deps();

    const input = {
      empresaId: empresa.id,
      anoFiscal: 2005,
      valor: 6000000,
    };
    const result = await mutation.execute(input);

    expect(result.isOk()).toBeTruthy();
    expect(port.getEmpresa).toHaveBeenCalledWith(input.empresaId);
    expect(port.addFaturamentoToEmpresa).toHaveBeenCalledWith(
      input.empresaId,
      expect.arrayContaining([
        expect.objectContaining({
          anoFiscal: input.anoFiscal,
          valor: input.valor,
        }),
      ]),
    );
  });
});
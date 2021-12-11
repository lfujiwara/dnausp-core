import {
  AgregadosAnuaisFactory,
  CNAE,
  CNPJ,
  Empresa,
  Faturamento,
} from '@domain';
import { v4 } from 'uuid';
import { Result } from 'typescript-monads';
import { RemoveFaturamentoMutation } from '@app';

describe('Remove faturamento', () => {
  const deps = () => {
    const faturamento = new Faturamento(60000, 2010);
    const empresa = new Empresa({
      id: v4(),
      estrangeira: false,
      nomeFantasia: 'Empresa Teste',
      razaoSocial: 'Empresa Teste Ltda',
      cnpj: new CNPJ('43.009.980/0001-04'),
      anoFundacao: 2010,
      atividadePrincipal: new CNAE('7020400'),
      atividadeSecundaria: [],
      historicoFaturamentos: AgregadosAnuaisFactory.historicoFaturamentos([
        faturamento,
      ]).unwrap(),
    });

    const port = {
      getEmpresa: jest.fn().mockResolvedValue(Result.ok(empresa)),
      save: jest.fn().mockImplementation((x) => Promise.resolve(Result.ok(x))),
    };

    const mutation = new RemoveFaturamentoMutation(port as any);

    return { port, mutation, empresa, faturamento };
  };

  test('Handle invalid ID', async () => {
    const { mutation, faturamento, port } = deps();

    port.getEmpresa.mockResolvedValueOnce(Result.fail('Invalid ID'));
    const result = await mutation.execute({
      empresaId: '1234',
      anoFiscal: faturamento.anoFiscal,
    });

    expect(result.isFail()).toBeTruthy();
    expect(port.save).not.toHaveBeenCalled();
  });

  test('Handle port failure', async () => {
    const { mutation, empresa, faturamento, port } = deps();
    port.save.mockResolvedValueOnce(Result.fail('Port failure'));
    const result = await mutation.execute({
      empresaId: empresa.id,
      anoFiscal: faturamento.anoFiscal,
    });

    expect(result.isFail()).toBeTruthy();
  });

  test('Calls the port correctly when inputs are OK', async () => {
    const { mutation, empresa, faturamento, port } = deps();

    const input = {
      empresaId: empresa.id,
      anoFiscal: faturamento.anoFiscal,
    };
    const result = await mutation.execute(input);

    expect(result.isOk()).toBeTruthy();
    expect(port.getEmpresa).toHaveBeenCalledWith(input.empresaId);
    expect(port.save).toHaveBeenCalledWith(
      expect.not.objectContaining({
        historicoFaturamentos: {
          _valores: expect.arrayContaining([
            expect.objectContaining({
              anoFiscal: input.anoFiscal,
            }),
          ]),
        },
      }),
    );
  });
});

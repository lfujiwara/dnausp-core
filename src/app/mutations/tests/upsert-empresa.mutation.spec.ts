import {
  EmpresaDbPort,
  UpsertEmpresaMutation,
  UpsertEmpresaMutationInput,
} from '@app';
import { Result } from 'typescript-monads';
import { CNPJ } from '@domain';

describe('Upsert empresa mutation', () => {
  describe('Inputs', () => {
    const port = {
      addFaturamentoToEmpresa: jest.fn(),
      getEmpresa: jest.fn(),
      upsertEmpresa: jest.fn(),
      removeFaturamentoFromEmpresa: jest.fn(),
    };
    const mutation = new UpsertEmpresaMutation(port as EmpresaDbPort);

    beforeEach(() => {
      Object.values(port).forEach((mockFn) => mockFn.mockClear());
    });

    test('OK Input w/o revenues', async () => {
      const input: UpsertEmpresaMutationInput = {
        cnpj: '43.009.980/0001-04',
        anoFundacao: 2010,
        atividadePrincipal: '7020400',
        atividadeSecundaria: [],
        faturamentos: [],
        nomeFantasia: 'Empresa Teste',
        razaoSocial: 'Empresa Teste Ltda',
      };

      port.upsertEmpresa.mockImplementationOnce((x) => Result.ok(x));

      const result = await mutation.mutate(input);
      expect(result.isOk()).toBeTruthy();

      const empresa = result.unwrap();
      expect(CNPJ.formatCNPJ(empresa.cnpj.get())).toBe(input.cnpj);
      expect(empresa.anoFundacao).toBe(input.anoFundacao);
      expect(empresa.atividadePrincipal.get()).toBe(input.atividadePrincipal);
    });

    test('OK Input w/ revenues', async () => {
      const input: UpsertEmpresaMutationInput = {
        cnpj: '43.009.980/0001-04',
        anoFundacao: 2010,
        atividadePrincipal: '7020400',
        atividadeSecundaria: [],
        faturamentos: [
          { valor: 6000000, anoFiscal: 2018 },
          { valor: 12000000, anoFiscal: 2019 },
          { valor: 2900000, anoFiscal: 2020 },
        ],
        nomeFantasia: 'Empresa Teste',
        razaoSocial: 'Empresa Teste Ltda',
      };

      port.upsertEmpresa.mockImplementationOnce((x) => Result.ok(x));

      const empresa = (await mutation.mutate(input)).unwrap();

      expect(empresa.faturamentos.length).toBe(3);
      empresa.faturamentos.forEach((f) => {
        const equivalent = input.faturamentos.find(
          (x) => x.anoFiscal === f.anoFiscal,
        );
        expect(f.valor).toBe(equivalent.valor);
      });
    });
  });
});

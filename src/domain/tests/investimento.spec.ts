import { Investimento, OrigemInvestimento } from '@domain';

describe('Investimento', () => {
  describe('Constructor', () => {
    test('Success on valid values', () => {
      expect(
        () => new Investimento(2021, 6000000, OrigemInvestimento.PIPEFAPESP),
      ).not.toThrow();
    });

    test('Fail on invalid origin', () => {
      expect(
        () =>
          new Investimento(
            2021,
            6000000,
            (OrigemInvestimento.PIPEFAPESP + '_') as any,
          ),
      ).toThrow();
    });
  });
});

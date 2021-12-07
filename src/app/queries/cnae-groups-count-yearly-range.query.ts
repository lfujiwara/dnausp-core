import { CnaeGroupsCountQueryInput, CnaeGroupsCountQueryOutput } from '@app';

export type CnaeGroupsCountYearlyRangeQueryOutput = {
  year: number;
  values: CnaeGroupsCountQueryOutput[];
};

export abstract class CnaeGroupsCountYearlyRangeQuery {
  abstract execute(
    input: CnaeGroupsCountQueryInput,
  ): Promise<CnaeGroupsCountYearlyRangeQueryOutput>;
}

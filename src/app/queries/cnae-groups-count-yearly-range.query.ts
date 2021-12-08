import { CnaeGroupsCountQueryInput, CnaeGroupsCountQueryOutput } from '@app';

export type CnaeGroupsCountYearlyRangeQueryOutput = {
  year: number;
  value: CnaeGroupsCountQueryOutput;
}[];

export abstract class CnaeGroupsCountYearlyRangeQuery {
  abstract execute(
    input: CnaeGroupsCountQueryInput,
  ): Promise<CnaeGroupsCountYearlyRangeQueryOutput>;
}

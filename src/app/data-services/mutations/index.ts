import { MutationDataService } from '../types';
import { BuildingMutationKeys, buildingMutations } from './building';
import { RentBuildingMutationKeys, rentBuildingMutations } from './rent-building';


export type AllMutationKeys =
  BuildingMutationKeys | RentBuildingMutationKeys;
export const allMutations: MutationDataService<AllMutationKeys> = {
  ...buildingMutations,
  ...rentBuildingMutations
};

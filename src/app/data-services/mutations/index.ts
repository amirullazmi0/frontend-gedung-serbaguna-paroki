import { MutationDataService } from '../types';
import { BuildingMutationKeys, buildingMutations } from './building';
import { RentBuildingMutationKeys, rentBuildingMutations } from './rent-building';
import { UserMutationKeys, userMutations } from './user';


export type AllMutationKeys =
  BuildingMutationKeys | RentBuildingMutationKeys | UserMutationKeys;
export const allMutations: MutationDataService<AllMutationKeys> = {
  ...buildingMutations,
  ...rentBuildingMutations,
  ...userMutations
};

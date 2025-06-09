import { MutationDataService } from '../types';
import { BuildingMutationKeys, buildingMutations } from './building';


export type AllMutationKeys =
  BuildingMutationKeys
export const allMutations: MutationDataService<AllMutationKeys> = {
  ...buildingMutations
};

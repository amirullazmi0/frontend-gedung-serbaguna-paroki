import { MutationDataService } from "../../types";

export type BuildingMutationKeys =
  | 'post-building'

export const buildingMutations: MutationDataService<BuildingMutationKeys> = {
  'post-building': {
    url: 'member',
    method: 'POST',
    refetchQueries: ['get-building'],
  },
};
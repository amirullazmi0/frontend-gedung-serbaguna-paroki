import { MutationDataService } from "../../types";

export type BuildingMutationKeys =
  | 'post-building' | 'post-building-photo'

export const buildingMutations: MutationDataService<BuildingMutationKeys> = {
  'post-building': {
    url: 'member',
    method: 'POST',
    refetchQueries: ['get-building'],
  },
  'post-building-photo': {
    url: 'building/image',
    method: 'POST',
  },
};
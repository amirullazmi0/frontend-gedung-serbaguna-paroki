import { MutationDataService } from "../../types";

export type BuildingMutationKeys =
  | 'post-building' | 'post-building-photo' | 'post-building-document';

export const buildingMutations: MutationDataService<BuildingMutationKeys> = {
  'post-building': {
    url: 'building',
    method: 'POST',
    refetchQueries: ['get-building'],
  },
  'post-building-photo': {
    url: 'building/image',
    method: 'POST',
  },
  'post-building-document': {
    url: 'building/document',
    method: 'POST',
  },
};
import { MutationDataService } from "../../types";

export type RentBuildingMutationKeys =
  | 'create-rent-building' | 'post-rent-document' | 'update-rent-building'

export const rentBuildingMutations: MutationDataService<RentBuildingMutationKeys> = {
  'create-rent-building': {
    url: 'rent-building',
    method: 'POST',
  },
  'post-rent-document': {
    url: 'rent-building/document',
    method: 'POST',
  },
  'update-rent-building': {
    url: 'rent-building',
    method: 'PATCH',
    refetchQueries: ['get-rent-building-by-admin']
  },
};
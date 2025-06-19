import { MutationDataService } from "../../types";

export type UserMutationKeys =
  | 'update-user-photo'
  | 'update-user-profile'
  | 'update-user-password'
  | 'update-user-address'

export const userMutations: MutationDataService<UserMutationKeys> = {
  'update-user-photo': {
    url: 'user/auth/photo',
    method: 'POST',
    refetchQueries: ['get-user-auth']
  },
  'update-user-profile': {
    url: 'user/auth',
    method: 'PATCH',
    refetchQueries: ['get-user-auth']
  },
  'update-user-password': {
    url: 'user/auth/password',
    method: 'PATCH',
    refetchQueries: ['get-user-auth']
  },
  'update-user-address': {
    url: 'user/auth/address',
    method: 'PATCH',
    refetchQueries: ['get-user-auth']
  }
};
import { QueriesDataService } from '../../types';

export type UserQueriesKeys = 'get-user-auth'

export const userQueries: QueriesDataService<UserQueriesKeys> = {
  'get-user-auth': 'user/auth',
};

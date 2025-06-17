import { QueriesDataService } from '../../types';

export type RentBuildingQueriesKeys = 'get-rent-building-by-user' | 'get-rent-building-by-admin';

export const rentBuildingQueries: QueriesDataService<RentBuildingQueriesKeys> = {
  'get-rent-building-by-user': 'rent-building/user',
  'get-rent-building-by-admin': 'rent-building/admin',
};

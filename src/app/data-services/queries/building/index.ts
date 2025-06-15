import { QueriesDataService } from '../../types';

export type BuildingQueriesKeys = 'get-building' | 'get-admin-building';

export const buildingQueries: QueriesDataService<BuildingQueriesKeys> = {
  'get-building': 'building',
  'get-admin-building': 'building/admin',
};

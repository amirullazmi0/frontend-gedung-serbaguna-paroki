import { QueriesDataService } from "../types";
import { buildingQueries, BuildingQueriesKeys } from "./building";
import { rentBuildingQueries, RentBuildingQueriesKeys } from "./rent-building";
import { userQueries, UserQueriesKeys } from "./user";

export type AllQueriesKeys = BuildingQueriesKeys | RentBuildingQueriesKeys | UserQueriesKeys

export const allQueries: QueriesDataService<AllQueriesKeys> = {
  ...buildingQueries,
  ...rentBuildingQueries,
  ...userQueries
}
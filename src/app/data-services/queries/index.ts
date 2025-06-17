import { QueriesDataService } from "../types";
import { buildingQueries, BuildingQueriesKeys } from "./building";
import { rentBuildingQueries, RentBuildingQueriesKeys } from "./rent-building";

export type AllQueriesKeys = BuildingQueriesKeys | RentBuildingQueriesKeys

export const allQueries: QueriesDataService<AllQueriesKeys> = {
  ...buildingQueries,
  ...rentBuildingQueries
}
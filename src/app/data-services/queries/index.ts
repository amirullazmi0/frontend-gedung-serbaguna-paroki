import { QueriesDataService } from "../types";
import { buildingQueries, BuildingQueriesKeys } from "./building";

export type AllQueriesKeys = BuildingQueriesKeys

export const allQueries: QueriesDataService<AllQueriesKeys> = {
  ...buildingQueries
}
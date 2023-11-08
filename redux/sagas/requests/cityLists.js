import { getCityLists } from "../../../graphql/queries/areaListsQueries";

export function requestGetCityLists() {
  return getCityLists();
}

import {
  getAreaByCityLists,
  getAreaLists,
} from "../../../graphql/queries/areaListsQueries";

export function requestGetAreaLists(city) {
  const query = city ? getAreaByCityLists(city) : getAreaLists();
  console.log("city", city);
  return query;
}

import {
  getAllShopsList,
  getShops,
} from "../../../graphql/queries/shopQueries";

export function requestGetShops(shop) {
  return getShops(shop);
}

export function requestGetAllShops(shop) {
  return getAllShopsList(shop);
}

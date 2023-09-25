import {
  getAllShopsList,
  getShops,
} from "../../../graphql/queries/shopQueries";

export function requestGetShops(shop) {
  return getShops(shop);
}

export function requestGetAllShops() {
  return getAllShopsList();
}

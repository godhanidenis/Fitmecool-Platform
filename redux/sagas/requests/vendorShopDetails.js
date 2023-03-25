import { getShopDetails } from "../../../graphql/queries/shopQueries";

export function requestGetVendorShopDetails(shopId) {
  return getShopDetails({ id: shopId });
}

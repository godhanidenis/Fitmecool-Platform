import { getVendorShopDetails } from "../../../graphql/queries/shopQueries";

export function requestGetVendorShopDetails(shopId) {
  return getVendorShopDetails({ id: shopId, forDashboard: true });
}

import { getProducts } from "../../../graphql/queries/productQueries";

export function requestGetShopProducts(product) {
  return getProducts(product);
}

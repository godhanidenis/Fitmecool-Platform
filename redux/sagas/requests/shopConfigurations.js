import { getShopConfigurations } from "../../../graphql/queries/shopConfigurationsQueries";

export function requestShopConfigurations() {
  return getShopConfigurations();
}

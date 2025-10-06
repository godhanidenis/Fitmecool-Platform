import { getSubscriptions } from "../../../graphql/queries/subscriptionsQueries";

export function requestGetSubscriptions(payload) {
  return getSubscriptions(payload);
}

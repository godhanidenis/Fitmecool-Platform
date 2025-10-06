import { getAllPlans } from "../../../graphql/queries/getAllPlansQueries";

export function requestGetAllPlans() {
  return getAllPlans();
}

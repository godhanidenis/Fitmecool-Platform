import { getImageVariants } from "../../../graphql/queries/imageVariantsQueries";

export function requestImageVariants() {
  return getImageVariants();
}

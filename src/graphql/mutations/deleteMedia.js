import { gql } from "@apollo/client";
import client from "../apollo-client";

export const deleteMedia = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation DeleteMedia($file: String, $fileType: String) {
        deleteMedia(file: $file, fileType: $fileType)
      }
    `,
    variables: {
      file: payload.file,
      fileType: payload.fileType,
    },
  });
  return results;
};

import { gql } from "@apollo/client";
import client from "../apollo-client";

export const deleteBranch = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation DeleteBranch($deleteBranchId: String) {
        deleteBranch(id: $deleteBranchId)
      }
    `,
    variables: {
      deleteBranchId: payload.id,
    },
  });
  return results;
};

export const createBranch = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation CreateBranch($branchInfo: branchInput) {
        createBranch(branchInfo: $branchInfo) {
          message
        }
      }
    `,
    variables: {
      branchInfo: payload.branchInfo,
    },
  });
  return results;
};

export const updateBranch = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation UpdateBranch($updateBranchId: String, $branchInfo: branchInput) {
        updateBranch(id: $updateBranchId, branchInfo: $branchInfo) {
          message
        }
      }
    `,
    variables: {
      updateBranchId: payload.id,
      branchInfo: payload.branchInfo,
    },
  });
  return results;
};

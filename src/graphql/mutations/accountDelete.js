import client from "../apollo-client";
import { gql } from '@apollo/client';

export const deleteAccount = async (payload) => {
    const results = await client.mutate({
        mutation: gql`
        mutation DeleteAccount($deleteAccountId: String) {
            deleteAccount(id: $deleteAccountId)
          }
      `,
        variables: {
            deleteAccountId: payload.id,
        },
    });
    return results;
};
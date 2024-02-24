import {gql} from '@apollo/client';
import client from '../apollo-client';

export const getBranchLists = async () => {
  const results = await client.query({
    query: gql`
      query BranchList {
        branchList {
          branch_address
          branch_city
          branch_pinCode
          branch_state
          branch_type
          flag
          id
          same_as
          manager_contact
          manager_email
          manager_name
          shop_id
        }
      }
    `,
    fetchPolicy: 'no-cache',
  });

  return results;
};

export const getSingleBranchDetails = async payload => {
  const results = await client.query({
    query: gql`
      query Branch($branchId: String) {
        branch(id: $branchId) {
          id
          shop_id
          same_as
          branch_address
          branch_pinCode
          branch_state
          branch_city
          manager_name
          manager_contact
          manager_email
          branch_type
          flag
        }
      }
    `,
    variables: {
      branchId: payload.id,
    },
    fetchPolicy: 'no-cache',
  });

  return results;
};

import {gql} from '@apollo/client';
import client from '../apollo-client';

export const getAppVersionLists = async () => {
  const results = await client.query({
    query: gql`
      query AppVersionList {
        appVersionList {
          id
          message
          version
        }
      }
    `,
    fetchPolicy: 'no-cache',
  });

  return results;
};

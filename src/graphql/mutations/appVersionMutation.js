import {gql} from '@apollo/client';
import client from '../apollo-client';

export const appVersionUpdate = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation UpdateAppVersion(
        $versionInfo: appVersionInput
        $updateAppVersionId: String
      ) {
        updateAppVersion(versionInfo: $versionInfo, id: $updateAppVersionId) {
          id
          message
          version
        }
      }
    `,
    variables: {
      versionInfo: {
        message: payload.message,
        version: payload.version,
      },
      updateAppVersionId: '651d3a2b7a2b8924e434219e',
    },
    fetchPolicy: 'no-cache',
  });
  return results;
};

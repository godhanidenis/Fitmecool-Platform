import {gql} from '@apollo/client';
import client from '../apollo-client';

export const signUp = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation signUp($userInfo: signUpInput) {
        signUp(userInfo: $userInfo) {
          token
          message
          user{
            id,
            userHaveAnyShop
          }
        }
      }
    `,
    variables: {
      userInfo: payload,
    },
  });
  return results;
};

export const signIn = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation signIn($userInfo: signInInput) {
        signIn(userInfo: $userInfo) {
          token
          message
          user{
            id,
            userHaveAnyShop
          }
        }
      }
    `,
    variables: {
      userInfo: payload,
    },
  });
  return results;
};

export const googleSignUp = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation googleSignUp(
        $first_name: String!
        $last_name: String!
        $user_email: String
      ) {
        googleSignUp(
          userInfo: {
            first_name: $first_name
            last_name: $last_name
            user_email: $user_email
          }
        ) {
          token
          message
          user{
            id,
            userHaveAnyShop
          }
        }
      }
    `,
    variables: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      user_email: payload.user_email
    },
  });
  return results;
};

export const googleSignIn = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation googleSignIn($username: String!, $type: String!) {
        googleSignIn(userInfo: {username: $username, type: $type}) {
          token
          message
          user{
            id,
            userHaveAnyShop
          }
        }
      }
    `,
    variables: {
      username: payload.username,
      type: payload.type,
    },
  });
  return results;
};

export const forgotPassword = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation forgotPassword($userInfo: forgotPasswordInput) {
        forgotPassword(userInfo: $userInfo)
      }
    `,
    variables: {
      userInfo: payload.userInfo,
    },
  });
  return results;
};

export const resetPassword = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation resetPassword($token: String, $userInfo: resetPasswordInput) {
        resetPassword(token: $token, userInfo: $userInfo)
      }
    `,
    variables: {
      token: payload.token,
      userInfo: payload.userInfo,
    },
  });
  return results;
};

import { gql } from "@apollo/client";
import client from "../apollo-client";

export const signUp = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation signUp(
        $first_name: String!
        $last_name: String!
        $user_email: String
        $user_contact: String!
        $user_password: String!
        $user_type: String!
      ) {
        signUp(
          userInfo: {
            first_name: $first_name
            last_name: $last_name
            user_email: $user_email
            user_contact: $user_contact
            user_password: $user_password
            user_type: $user_type
          }
        ) {
          token
          message
          user
        }
      }
    `,
    variables: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      user_email: payload.user_email,
      user_contact: payload.user_contact,
      user_password: payload.user_password,
      user_type: payload.user_type,
    },
  });
  return results;
};

export const signIn = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation signIn($username: String!, $password: String!, $type: String!) {
        signIn(
          userInfo: { username: $username, password: $password, type: $type }
        ) {
          token
          message
          user
        }
      }
    `,
    variables: {
      username: payload.username,
      password: payload.password,
      type: payload.type,
    },
  });
  return results;
};

export const googleSignUp = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation googleSignUp(
        $first_name: String!
        $last_name: String!
        $user_email: String
        $user_type: String!
      ) {
        googleSignUp(
          userInfo: {
            first_name: $first_name
            last_name: $last_name
            user_email: $user_email
            user_type: $user_type
          }
        ) {
          token
          message
          user
        }
      }
    `,
    variables: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      user_email: payload.user_email,
      user_type: payload.user_type,
    },
  });
  return results;
};

export const googleSignIn = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation googleSignIn($username: String!, $type: String!) {
        googleSignIn(userInfo: { username: $username, type: $type }) {
          token
          message
          user
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

export const forgotPassword = async (payload) => {
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

export const resetPassword = async (payload) => {
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

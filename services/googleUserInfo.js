import axios from "axios";

export const getGoogleUserInfo = async (token_type, access_token) => {
  const userInfoResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v2/userinfo`,
    {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    }
  );

  return userInfoResponse?.data;
};

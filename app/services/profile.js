import { AuthSession } from "expo";
import { baseUrl, scopes, spotifyUrl } from "../config";

const sendAuthCode = code => {
  return fetch(`${baseUrl}/api/code`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code
    })
  })
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

export const login = () => {
  return fetch(`${baseUrl}/api/credentials`)
    .then(response => response.json())
    .then(res => {
      const credentials = res;
      const returnUrl = AuthSession.getRedirectUrl();
      return AuthSession.startAsync({
        authUrl: `${spotifyUrl}?response_type=code&client_id=${
          credentials.clientId
        }&scope=${encodeURIComponent(scopes)}&redirect_uri=${returnUrl}`
      })
        .then(result => {
          if (result.type === "cancel" || result.type === "dismissed") {
            return "cancelled";
          }
          return sendAuthCode(result.params.code);
        })
        .catch(err => {
          return err;
        });
    });
};

export const getProfile = () => {
  return fetch(`${baseUrl}/api/profile`)
    .then(response => response.json())
    .then(res => {
      const profile = res;
      return profile;
    });
};

import { getProfile, login } from "../../services/profile";

SET_PROFILE = "SET_PROFILE";

const setProfileAction = payload => ({
  type: "SET_PROFILE",
  payload
});

const resetProfileAction = () => ({
  type: "RESET_PROFILE",
  payload: null
});

const setLoginAction = payload => ({
  type: "SET_LOGGED_IN",
  payload
});

export const getProfileAction = () => {
  return dispatch => {
    getProfile()
      .then(profile => {
        dispatch(setProfileAction(profile));
      })
      .catch(err => {
        if (err.message === "No Auth Token") {
          dispatch(resetProfileAction);
        }
      });
  };
};

export const loginAction = () => {
  return dispatch => {
    return login()
      .then(response => {
        if (response !== "cancelled") {
          dispatch(setLoginAction({ loggedIn: true }));
          return "success";
        } else {
          return "cancelled";
        }
      })
      .catch(err => {
        dispatch(setLoginAction({ loggedIn: false }));
        console.log(err);
        return "failed";
      });
  };
};

export const logoutAction = () => {
  return dispatch => {
    dispatch(resetProfileAction({ loggedIn: false }));
  };
};

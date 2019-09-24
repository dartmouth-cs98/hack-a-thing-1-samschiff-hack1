const SET_PROFILE = "SET_PROFILE";
const RESET_PROFILE = "RESET_PROFILE";
const SET_LOGGED_IN = "SET_LOGGED_IN";

export default profile = (state = {}, action) => {
  const { payload, type } = action;
  switch (type) {
    case SET_PROFILE:
      return {
        ...state,
        name: payload.display_name,
        email: payload.email,
        spotify: payload.external_urls.spotify,
        loggedIn: true
      };
    case RESET_PROFILE:
      return {
        ...state,
        name: null,
        email: null,
        spotify: null,
        loggedIn: false
      };
    case SET_LOGGED_IN:
      return {
        ...state,
        loggedIn: payload.loggedIn
      };
    default:
      return state;
  }
};

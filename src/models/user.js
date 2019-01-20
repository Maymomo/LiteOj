export default {
  namespace: "user",
  state: {
    isLogin: false,
  },
  reducers: {
    setLogin(state, {uid, username, token}) {
      console.log(uid + " " + username);
      state.isLogin = true;
      return {
        ...state,
        uid: uid,
        username: username,
        token: token,
      }
    },
  },
};

const navPages = {
  Main: "/",
  About: "/",
  Login: "/login",
  Group: (userId, groupId) => {
    return `/home/${userId}/group/${groupId}`;
  },
  Home: (userId) => {
    return `/home/${userId}`;
  },
  Instructions: "/instructions",
};

export default navPages;

const userService = () => {
  const user = {
    _id: '',
    providerId: '',
    name: 'test service user',
    img: '',
    email: '',
    accessToken: '',
  }

  const setUser = (userInfo) => {
    user.name = userInfo.name;
    user.img = userInfo.img;
    user.email = userInfo.email;
    user.accessToken = userInfo.accessToken;
    user.providerId = userInfo.providerId;
  }
  const setUserId = _id => {
    user._id = _id;
  }

  const getUserId = () => user._id;
  const getName = () => user.name;
  const getImg = () => user.img;
  const getEmail = () => user.email;
  const getAccessToken = () => user.accessToken;
  const getProviderId = () => user.providerId;

  return {
    setUserId,
    getUserId,
    setUser,
    getName,
    getImg,
    getEmail,
    getAccessToken,
    getProviderId,
  }
}

export default userService;
const chatBoxService = ($rootScope, $http, $userService) => {
  console.log($userService.getUserId())
  const scope = {
    listChatBox: [
      {
        _id: null,
        userIds: [],
        messages: [],
      },
      {
        _id: null,
        userIds: [],
        messages: [],
      },
    ],
    chatBoxCurrent: null,
    listFriend: [],
  }

  // methods call api
  function httpGetListChatBox() {
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/chatbox',
      data: {
        providerId: $userService.getProviderId(),
        accessToken: $userService.getAccessToken(),
        userId: $userService.getUserId(),
      }
    });
  }

  const addChatBox = chatBox => {
    scope.listChatBox.unshift(chatBox);
  }

  const addFriend = friend => {
    scope.listFriend.push(friend);
  }

  const setChatBoxCurrent = chatBox => {
    scope.chatBoxCurrent = chatBox;
  };

  const getList = () => scope.listChatBox;
  const getChatBoxCurrent = () => scope.chatBoxCurrent;
  const getListFriend = () => scope.listFriend;
  const getFriendById = (friendId) => {
    return scope.listFriend.filter(friend => {
      return friendId === friend._id;
    })[0];
  }
  const getChatBoxById = chatBoxId => {
    for (let chatBox of scope.listChatBox) {
      if (chatBoxId === chatBox._id) return chatBox;
    }
  }
  const getRecieverCurrent = () => {
    if (scope.chatBoxCurrent !== null) {
      for (let userId of scope.chatBoxCurrent.userIds) {
        if (userId !== $userService.getUserId()) return getFriendById(userId);
      }
    }
    return null;
  }

  const getFriendByChatBoxId = (chatBoxId) => {
    for (let chatBox of scope.listChatBox) {
      if (chatBoxId === chatBox._id) {
        for (let userId of chatBox.userIds) {
          if (userId !== $userService.getUserId()) {
            return getFriendById(userId);
          }
        }
        break;
      }
    }
    return null;
  }

  const getChatBoxByFriendId = friendId => {
    for (let chatBox of scope.listChatBox) {
      for (let userId of chatBox.userIds) {
        if (userId !== $userService.getUserId()) {
          if (userId === friendId) { return chatBox; }
        }
      }
    }
    return null;
  }

  const sortListChatBoxByTime = () => {
    scope.listChatBox.sort((a, b) => {
      const A = new Date(a.messages[a.messages.length - 1].createDate).getTime();
      const B = new Date(b.messages[b.messages.length - 1].createDate).getTime();
      return B - A;
    });
  }

  const loadData = () => httpGetListChatBox()
    .then(res => {
      if (res.data.auth) {
        // set list chat boxs
        scope.listChatBox.length = 0;
        res.data.listChatBox.map(chatBox => scope.listChatBox.push(chatBox));
        sortListChatBoxByTime();
        console.log(scope.listChatBox)

        // set list friend
        scope.listFriend.length = 0;
        res.data.listFriend.map(friend => scope.listFriend.push(friend));
      } else {
        alert(res.data.reason);
      }
    })
    .catch(err => console.log('Error:', err));

  return {
    getFriendByChatBoxId,
    addChatBox,
    setChatBoxCurrent,
    getList,
    getChatBoxCurrent,
    getListFriend,
    getFriendById,
    addFriend,
    getRecieverCurrent,
    getChatBoxById,
    getChatBoxByFriendId,
    sortListChatBoxByTime,
    loadData,
  }
}

export default chatBoxService;
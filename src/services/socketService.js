import io from 'socket.io-client';


const socketService = ($chatBoxService, $userService) => {
  const socket = io('http://localhost:8080');

  const connectServer = userId => socket.emit('add-user-connect', userId);

  const on = (eventName, callback) => socket.on(eventName, callback);

  const emit = (eventName, data) => socket.emit(eventName, data);

  const eventName = {
    getListUserById: 'get-list-user-by-id',
    sendMessageToServer: 'send-message-to-server',
    updateChatBox: 'update-chat-box',
    searchNewUser: 'search-new-user',
    getSearchNewUser: 'get-search-new-user',
    createChatBox: 'create-chat-box',
    updateNewChatBox: 'update-new-chat-box',
    changeChatBoxNotSeen: 'change-chat-box-not-seen',
    updateChatBoxNotSeen: 'update-chat-box-not-seen',
  }

  // chat realtime
  const notifyCreateMessage = data =>
    emit(eventName.sendMessageToServer, data);
  const subscribeGetUpdateChatBox = callback =>
    on(eventName.updateChatBox, chatBox => callback(chatBox));

  // search new user realtime
  const notifySearchNewUser = searchText =>
    emit(eventName.searchNewUser, searchText);
  const subscribeGetSearchNewUser = callback =>
    on(eventName.getSearchNewUser, users => callback(users))
  
  // create chat box
  const notifyCreateChatBox = chatBox =>
    emit(eventName.createChatBox, chatBox);
  const subscribeUpdateNewChatBox = callback =>
    on(eventName.updateNewChatBox, chatBox => callback(chatBox));

  // update not seen in chat box
  const notifyChangeChatBoxNotSeen = chatBox =>
    emit(eventName.changeChatBoxNotSeen, chatBox);
  const subscribeUpdateChatBoxNotSeen = callback =>
    on(eventName.updateChatBoxNotSeen, data => callback(data));
  return {
    on,
    emit,
    notifyCreateMessage,
    subscribeGetUpdateChatBox,
    notifySearchNewUser,
    subscribeGetSearchNewUser,
    notifyCreateChatBox,
    subscribeUpdateNewChatBox,
    notifyChangeChatBoxNotSeen,
    subscribeUpdateChatBoxNotSeen,
    connectServer,
  };
}

export default socketService;
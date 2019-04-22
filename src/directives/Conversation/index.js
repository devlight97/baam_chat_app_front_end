import template from './template.html';
import io from 'socket.io-client';
import chatBoxService from '../../services/chatBox';

class Conversation {
  constructor() {
    this.restrict = 'E';
    this.template = template;
    this.controllerAs = '$ctrl';
    this.transclude = true;
    this.scope = {};
  }

  controller($scope, $rootScope, $chatBoxService, $userService, $socketService) {

    // properties
    $scope.eventName = {
      getContentChattingInput: 'get-content-chatting-input',
    }

    $scope.receiver = {}
    $scope.userId = $userService.getUserId();
    $scope.listMessage = []
    $scope.chatBoxCurrent = $chatBoxService.getChatBoxCurrent();

    // $on
    $rootScope.$on('change-chat-box-current', (event, chatBoxCurrent) => {
      if (chatBoxCurrent !== null) {
        $scope.listMessage = chatBoxCurrent.messages;
        $scope.chatBoxCurrent = chatBoxCurrent;
        for (let userId of chatBoxCurrent.userIds) {
          if (userId !== $userService.getUserId()) {
            $scope.receiver = $chatBoxService.getFriendById(userId);
            return;
          }
        }
      }
    });
    $scope.$on($scope.eventName.getContentChattingInput, (event, contentChattingInput) => {
      if (contentChattingInput === '') return;
      const chatBoxCurrent = $chatBoxService.getChatBoxCurrent();

      if (chatBoxCurrent !== null) {

        // emit
        if (chatBoxCurrent._id === null) {
          $socketService.notifyCreateChatBox({
            userIds: chatBoxCurrent.userIds,
            firstMessageContent: contentChattingInput,
          });
        } else {
          $socketService.notifyCreateMessage({
            userId: $userService.getUserId(),
            content: contentChattingInput,
            chatBoxId: chatBoxCurrent._id,
            recieverId: $chatBoxService.getRecieverCurrent()._id,
          });
        }

      }
    });

    // ON
    // get new list message for chat box
    $socketService.subscribeGetUpdateChatBox(({ messages, notSeen, chatBoxId }) => {
      const chatBox = $chatBoxService.getChatBoxById(chatBoxId);
      const chatBoxCurrent = $chatBoxService.getChatBoxCurrent();
      chatBox.messages = messages;
      chatBox.notSeen = notSeen;
      $scope.$emit('set-not-seen-for-chat-box', { notSeen, chatBoxId, messages });

      if (chatBoxCurrent !== null) {
        if (chatBoxCurrent._id === chatBoxId) {
          $scope.listMessage = messages;
        }
      }
      $chatBoxService.sortListChatBoxByTime();
      $scope.$apply();
    })

    // update not seen
    $socketService.subscribeUpdateChatBoxNotSeen(({ messages, notSeen, chatBoxId }) => {
      const chatBox = $chatBoxService.getChatBoxById(chatBoxId);
      chatBox.notSeen = notSeen;
      $scope.$emit('set-not-seen-for-chat-box', { notSeen, chatBoxId, messages });
    });

    // update chat box socket
    $socketService.subscribeUpdateNewChatBox(({chatBox, receiver, firstMessageContent}) => {

      const chatBoxCurrent = $chatBoxService.getChatBoxCurrent();
      if (chatBoxCurrent !== null) {
        // is sender
        chatBoxCurrent._id = chatBox._id;
        $socketService.notifyCreateMessage({
          userId: $userService.getUserId(),
          content: firstMessageContent,
          chatBoxId: $chatBoxService.getChatBoxCurrent()._id,
          recieverId: $chatBoxService.getRecieverCurrent()._id,
        });
      } else {
        // is receiver
        for (let userId of chatBox.userIds) {
          if (userId !== $userService.getUserId()) {
            $chatBoxService.addFriend(receiver);
            $chatBoxService.addChatBox(chatBox);
            break;
          }
        }
      }
    });
  }

  link(scope, element, attrs) {
    const chatBoxContent = element[0].querySelector('#conversation');

    scope.$watch('listMessage', (newValue, oldValue) => {
      
      // console.log('message.createDate',scope.listMessage)
      for (let message of scope.listMessage) {
        if ( !(message.createDate instanceof Date) ) {
          message.createDate = new Date(message.createDate);
          // .toLocaleString('ca-chinese')
        } else {
          console.log('message.createDate',message.createDate)
        }
      }

      // when init list message
      if (oldValue.length === 0) {
        chatBoxContent.scrollTop = chatBoxContent.scrollHeight;
      } else {
        if (newValue.length !== 0) {
          if (newValue[newValue.length - 1].userId === scope.userId) {
            chatBoxContent.scrollTop = chatBoxContent.scrollHeight;
          } else {
            // emit event notify get new message for user
          }
        }
      }
    });

    scope.$watch('chatBoxCurrent', () => {
      chatBoxContent.scrollTop = chatBoxContent.scrollHeight;
    });
  }
}

export default Conversation;
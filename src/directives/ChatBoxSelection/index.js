import template from './template.html';

class ChatBoxSelection {
  constructor($userService, $chatBoxService, $socketService) {
    this.template = template;
    this.scope = {
      img: '@',
      user: '=',
      chatBox: '=',
      eventName: '=',
      closeAddFriendForm: '&',
    }
    this.controllerAs = '$ctrl';
    this.bindToController = true;
    this.$userService = $userService;
    this.$chatBoxService = $chatBoxService;
  }
  controller($scope, $userService, $chatBoxService, $rootScope, $socketService) {

    $scope.style = {}

    $scope.infoBox = {};

    $scope.chatBoxCurrent = $chatBoxService.getChatBoxCurrent();

    $scope.userId = $userService.getUserId();

    // method
    $scope.setChatBoxCurrent = (chatBoxCurrent) => {
      $chatBoxService.setChatBoxCurrent(chatBoxCurrent);
      $scope.chatBoxCurrent = $chatBoxService.getChatBoxCurrent();
      $scope.$emit('change-chat-box-current', chatBoxCurrent);
    }
    $scope.getDate = time => `${time.getDate()} - ${time.getMonth() + 1} - ${time.getFullYear()}`;
    $scope.getTime = time => `${time.getHours()} : ${time.getMinutes()}`;

    // $on

    $rootScope.$on('change-chat-box-current', (event, chatBoxCurrent) => {
      if (chatBoxCurrent !== null) {
        if ($scope.$ctrl.chatBox) {
          if ($scope.$ctrl.chatBox._id === chatBoxCurrent._id) {
            $scope.style['background-color'] = '#e6f0ff';
          } else {
            $scope.style['background-color'] = null;
          }
        }
      }

      let chatBox = {}
      if ($scope.$ctrl.user) {
        chatBox = $chatBoxService.getChatBoxByFriendId($scope.$ctrl.user._id);
      }
      if ($scope.$ctrl.chatBox) {
        chatBox = $scope.$ctrl.chatBox;
      }

      if (chatBox === null) return;

      if (chatBoxCurrent !== null) {
        if (chatBox._id === chatBoxCurrent._id) {
          if (typeof chatBoxCurrent.notSeen === 'number' && chatBoxCurrent.notSeen > 0) {
            $socketService.notifyChangeChatBoxNotSeen({
              chatBox: chatBoxCurrent,
              notSeen: 0,
            });
          }
        }
      }
    });

    $socketService.subscribeGetUpdateChatBox(({ messages, chatBoxId }) => {
      if ($scope.$ctrl.chatBox) {
        if ($scope.$ctrl.chatBox._id === chatBoxId) {
          $scope.infoBox.lastMessage = messages[messages.length - 1];
          const time = new Date($scope.infoBox.lastMessage.createDate);
          $scope.infoBox.lastDateMessage = $scope.getDate(time);
          $scope.infoBox.lastTimeMessage = $scope.getTime(time);
        }
      }
      $scope.$apply();
    })

    $rootScope.$on('set-not-seen-for-chat-box', (event, { notSeen, chatBoxId, messages }) => {

      $scope.notSeen = notSeen;

      const chatBoxCurrent = $chatBoxService.getChatBoxCurrent();

      console.log('notSeen',notSeen)

      let chatBox = {}

      // component is user
      if ($scope.$ctrl.user) {
        chatBox = $chatBoxService.getChatBoxByFriendId($scope.$ctrl.user._id);
      }

      // component is chat box
      if ($scope.$ctrl.chatBox) {
        chatBox = $scope.$ctrl.chatBox;
      }
      
      
      if (chatBox._id === chatBoxId) {
        if (typeof $scope.notSeen === 'number' && $scope.notSeen > 0) {
          if (messages[messages.length - 1].userId !== $userService.getUserId()) {
            if (chatBoxCurrent !== null) {
              if (chatBox._id === chatBoxCurrent._id) {
                $socketService.notifyChangeChatBoxNotSeen({
                  chatBox: chatBoxCurrent,
                  notSeen: 0,
                });
                return;
              }
            }
            $scope.isShowNotifyNewMessage = true;
          } else $scope.isShowNotifyNewMessage = false;
        } else $scope.isShowNotifyNewMessage = false;
      }
      $scope.$apply();
    });


    // on click
    $scope.clickChatBox = () => {

      // component is user
      if ($scope.$ctrl.user) {
        console.log('click vào user box');

        $scope.infoBox = $scope.$ctrl.user;

        const friend = $chatBoxService.getFriendById($scope.infoBox._id);
        if (friend === undefined) {
          const chatBoxCurrent = {
            _id: null,
            userIds: [$userService.getUserId(), $scope.infoBox._id],
            messages: [],
          }
          $chatBoxService.addChatBox(chatBoxCurrent);
          $chatBoxService.addFriend($scope.$ctrl.user);
          $scope.setChatBoxCurrent(chatBoxCurrent);
        } else {
          const chatBoxCurrent = $chatBoxService.getChatBoxByFriendId(friend._id);
          $scope.setChatBoxCurrent(chatBoxCurrent);
        }

        $scope.$ctrl.closeAddFriendForm();
      }

      // component is chat box
      if ($scope.$ctrl.chatBox) {
        console.log('click vào chat box')

        $scope.setChatBoxCurrent($scope.$ctrl.chatBox);
        $scope.$ctrl.chatBox.userIds.map(userId => {
          if (userId !== $userService.getUserId()) {
            $scope.infoBox = $chatBoxService.getFriendById(userId);
          }
        });
      }

      // run for 2 case
      $scope.$emit('conversation-scroll-to-bottom');
    };
  }

  // run after init all controller
  link(scope, element, attrs) {
    scope.$emit('change-chat-box-current', scope.chatBoxCurrent);
    scope.notSeen = 0;

    scope.infoBox = {};
    scope.isShowNotifyNewMessage = false;

    // component is user
    if (scope.$ctrl.user) {
      scope.infoBox = scope.$ctrl.user;
      const chatBox = this.$chatBoxService.getChatBoxByFriendId(scope.infoBox._id);

      if (chatBox !== null) {
        scope.infoBox.lastMessage = chatBox.messages[chatBox.messages.length - 1];
        const time = new Date(scope.infoBox.lastMessage.createDate);
        scope.infoBox.lastDateMessage = scope.getDate(time);
        scope.infoBox.lastTimeMessage = scope.getTime(time);

        // get not seen chat box
        if (typeof chatBox.notSeen === 'number' && chatBox.notSeen > 0) {
          if (scope.infoBox.lastMessage.userId !== this.$userService.getUserId()) {
            scope.isShowNotifyNewMessage = true;
            scope.notSeen = chatBox.notSeen;
          } else scope.isShowNotifyNewMessage = false;
        } else scope.isShowNotifyNewMessage = false;
      }
    }

    // component is chat box
    if (scope.$ctrl.chatBox) {
      const chatBox = scope.$ctrl.chatBox;

      chatBox.userIds.map(userId => {
        if (userId !== this.$userService.getUserId()) {
          scope.infoBox = this.$chatBoxService.getFriendById(userId);

          // set last message
          if (chatBox.messages.length > 0) {
            scope.infoBox.lastMessage = chatBox.messages[chatBox.messages.length - 1];
            const time = new Date(scope.infoBox.lastMessage.createDate);
            scope.infoBox.lastDateMessage = scope.getDate(time);
            scope.infoBox.lastTimeMessage = scope.getTime(time);

            // get not seen chat box
            if (typeof chatBox.notSeen === 'number' && chatBox.notSeen > 0) {
              if (scope.infoBox.lastMessage.userId !== this.$userService.getUserId()) {
                scope.isShowNotifyNewMessage = true;
                scope.notSeen = chatBox.notSeen;
              } else scope.isShowNotifyNewMessage = false;
            } else scope.isShowNotifyNewMessage = false;
          }

        }
      });

    }
  }
}

export default ChatBoxSelection;

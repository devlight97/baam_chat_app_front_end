import template from './template.html';
import io from 'socket.io-client';

class SideBar {
  constructor() {
    this.template = template;
    this.restrict = 'E';
    this.controllerAs = '$ctrl';
    this.bindToController = true;
  }
  controller($scope, $http, $userService, $chatBoxService, $socketService) {
    
    // test user
    $scope.user = {
      name: $userService.getName(),
      img: $userService.getImg(),
    }

    // event name
    $scope.eventName = {
      searchUser: 'get-text-search-user',
      searchChatBox: 'get-text-search-chat-box',
      addChatBox: 'add-chat-box',
    }

    // text search
    $scope.searchTextUser = '';
    $scope.searchTextChatBox = '';

    // list user and chat box
    $scope.listUser = [];
    $scope.listUserCurrent = [];
    $scope.listChatBox = $chatBoxService.getList();
    $scope.listChatBoxCurrent = $scope.listChatBox;
    
    $scope.isShowChatBoxForm = true;

    $scope.styleAddFriendForm = {
      'top': '-100%',
      'left': '-100%',
    }

    // methods
    $scope.openAddFriendForm = () => {
      $scope.isShowChatBoxForm = false;
      $scope.styleAddFriendForm['top'] = '0';
      $scope.styleAddFriendForm['left'] = '0';
    }
    $scope.closeAddFriendForm = () => {
      $scope.isShowChatBoxForm = true;
      $scope.styleAddFriendForm['top'] = '-100%';
      $scope.styleAddFriendForm['left'] = '-100%';
    }

    // on event
    $scope.$on($scope.eventName.searchChatBox, (event, searchText) => {
      $scope.searchTextUser = searchText;
      if (searchText === '') { return $scope.listChatBoxCurrent = $scope.listChatBox }
      $scope.listChatBoxCurrent = $chatBoxService.getList().filter(chatBox => {
        let friend = $chatBoxService.getFriendByChatBoxId(chatBox._id);
        if (friend !== null) {
          return friend.name.toLowerCase().includes(searchText.toLowerCase());
        } else return false;
      });
    });
    $scope.$on($scope.eventName.searchUser, (event, searchText) => {
      if (searchText !== '') {
        $socketService.notifySearchNewUser(searchText);
      } else {
        $scope.listUserCurrent = [];
      }
    });
    $socketService.subscribeGetSearchNewUser(users => {
      $scope.listUserCurrent = users;
      $scope.$apply();
    });

  }
}

export default SideBar;

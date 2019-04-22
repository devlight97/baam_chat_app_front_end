import template from './template.html';

class MessageRow {
  constructor() {
    this.template = template;
    this.bindings = {
      isReceiver: '<',
      testValue: '<',
      message: '=',
      receiver: '=',
    }
    this.scope = {}
  }

  controller($scope, $rootScope, $chatBoxService, $userService) {
    $scope.userImg = $userService.getImg()

    $scope.style = {
      rightMessage: {
        'width': '40px',
        'vertical-align': 'top',
        'float': 'right',
        'margin-left': '3%',
      },
      leftMessage: {
        'width': '40px',
        'vertical-align': 'top',
        'margin-right': '3%',
      }
    }
    
  }
}

export default MessageRow;

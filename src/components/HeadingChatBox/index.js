import template from './template.html';

class HeadingChatBox {
  constructor() {
    this.template = template;
    this.scope = {}
    this.bindings = {
      receiver: '=',
    }
  }
  controller($scope, $rootScope, $chatBoxService) {
    $scope.receiver = []
    $rootScope.$on('change-chat-box-current', (event, chatBox) => {
      $scope.reciever = $chatBoxService.getRecieverCurrent();
      $scope.chatBoxCurrent = $chatBoxService.getChatBoxCurrent();
    });
  }
}

export default HeadingChatBox;

import template from './template.html';

class HeadingSideBar {
  constructor() {
    this.template = template;
    this.scope = {}
    this.bindings = {
      openAddFriendForm: '&',
    }
  }
  controller($scope, $userService) {
    $scope.user = {
      name: $userService.getName(),
      img: $userService.getImg(),
    }
  }
}

export default HeadingSideBar;

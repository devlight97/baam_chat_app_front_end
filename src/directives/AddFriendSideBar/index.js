import template from './app.html';

class AddFriendSideBar {
  constructor() {
    this.template = template;
    this.restrict = 'E';
    this.controllerAs = '$ctrl';
    this.bindToController = true;
  }

  controller($scope) {}
}

export default AddFriendSideBar;

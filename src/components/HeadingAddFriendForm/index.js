import template from './template.html';

class HeadingAddFriendForm {
  constructor() {
    this.template = template;
    this.scope = {}
    this.bindings = {
      closeAddFriendForm: '&',
    }
  }
  controller($scope) {}
}

export default HeadingAddFriendForm;

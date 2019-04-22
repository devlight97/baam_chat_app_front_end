import template from './template.html';

class ChattingInput {
  constructor() {
    this.template = template;
    this.scope = {
      eventName: '=',
    }
    this.controllerAs = '$ctrl';
    this.bindToController = true;
  }

  controller($scope) {
    $scope.contentChattingInput = '';

    $scope.handleKeyPress = (event) => {
      if (event.shiftKey) {
        if (event.keyCode === 13) return;
      }
      if (event.keyCode === 13) {
        $scope.$emit($scope.$ctrl.eventName.getContentChattingInput, $scope.contentChattingInput);
        $scope.contentChattingInput = '';
      }
    }
  }

  link(scope, element, attrs) {
    // scope.$watch('contentChattingInput', value => {
    //   scope.$emit(scope.$ctrl.eventName.getContentChattingInput, value);
    // });
  }
}

export default ChattingInput;

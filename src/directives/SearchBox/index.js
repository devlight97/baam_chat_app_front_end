import template from './template.html';

class SearchBox {
  constructor() {
    this.template = template;
    this.scope = {
      eventName: '=',
      isSearchUser: '@',
      isSearchChatBox: '@',
    }
    this.controllerAs = '$ctrl';
    this.bindToController = true;
  }

  controller($scope) {
    $scope.searchTxt = '';
    $scope.showRemoveButton = false;
    $scope.styleInput = { 'width': '100%' }

    $scope.removeText = () => {
      $scope.searchTxt = '';
    }
  }

  link(scope, element, attrs) {
    scope.$watch('searchTxt', value => {
      if (scope.$ctrl.isSearchUser) {
        scope.$emit(scope.$ctrl.eventName.searchUser, value);
      }
      
      if (scope.$ctrl.isSearchChatBox) {
        scope.$emit(scope.$ctrl.eventName.searchChatBox, value);
      }

      if (value === '') {
        scope.styleInput['width'] = '100%';
      } else {
        scope.styleInput['width'] = '85%';
      }
    });
  }
}

export default SearchBox;

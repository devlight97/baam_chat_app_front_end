import angular from 'angular';
import App from './App';
import SideBar from './SideBar';
import Conversation from './Conversation';
import SearchBox from './SearchBox';
import ChatBoxSelection from './ChatBoxSelection';
import ChattingInput from './ChattingInput';

const directiveModule = angular.module('app.directives', []);

directiveModule.directive('app', () => new App());
directiveModule.directive('sideBar', () =>new SideBar());
directiveModule.directive('conversation', () => new Conversation());
directiveModule.directive('searchBox', () => new SearchBox());
directiveModule.directive('chattingInput', () => new ChattingInput());
directiveModule.directive('chatBoxSelection', ($userService, $chatBoxService) => new ChatBoxSelection($userService, $chatBoxService));

export default directiveModule;

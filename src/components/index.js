import angular from 'angular';
import MessageRow from './MessageRow';
import HeadingChatBox from './HeadingChatBox';
import HeadingSideBar from './HeadingSideBar';
import HeadingAddFriendForm from './HeadingAddFriendForm';
import ngMaterial from 'angular-material';

const componentModule = angular.module('app.components', [ngMaterial]);

componentModule.component('messageRow', new MessageRow());
componentModule.component('headingChatBox', new HeadingChatBox());
componentModule.component('headingSideBar', new HeadingSideBar());
componentModule.component('headingAddFriendForm', new HeadingAddFriendForm());


export default componentModule;

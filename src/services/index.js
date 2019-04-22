import angular from 'angular';
import userService from './user';
import chatBoxService from './chatBox';
import socketService from './socketService';

const serviceModule = angular.module('app.services', []);

serviceModule.factory('$userService', userService);
serviceModule.factory('$chatBoxService', chatBoxService);
serviceModule.factory('$socketService', socketService);
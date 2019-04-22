import angular from 'angular';
import ngRoute from 'angular-route';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';
import ngAria from 'angular-aria';
import loginPage from './pages/login.html';
import signinPage from './pages/signin.html';
import chatappPage from './pages/chat-app.html';

import './components';
import './directives';
import './services';

const requires = [
  ngMaterial,
  ngAnimate,
  ngAria,
  ngRoute,
  'app.components',
  'app.directives',
  'app.services',
];

angular
  .module('chatApp', requires)

  .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        template: loginPage,
        controller: 'signinController',
      })
      .when('/register', {
        template: loginPage,
        controller: 'registerController',
      })
      .when('/login', {
        template: signinPage,
        controller: 'signinController',
      })
      .when('/chatapp', {
        template: chatappPage,
        controller: 'appController',
      });
  }])

  .controller('landingController', () => { })
  .controller('registerController', () => { })
  .controller('signinController', ($chatBoxService, $scope, $http, $timeout, $location, $userService, $socketService) => {
    
    // on click login facebook
    $scope.FBLogin = () => {
      FB.login(res => {
        if (res.authResponse) {
          console.log('Welcom, Fetching your information...');
          FB.api('/me', { fields: 'id,email,name,link,picture' }, res => {

            $userService.setUser({
              providerId: res.id,
              name: res.name,
              img: res.picture.data.url,
              accessToken: FB.getAuthResponse().accessToken,
              email: res.email,
            });

            const dataLogin = {
              accessToken: FB.getAuthResponse().accessToken,
              providerId: res.id,
              provider: 'FACEBOOK',
              name: res.name,
              img: `http://graph.facebook.com/${res.id}/picture?type=square`,
            }

            // call api for login
            $http({
              method: 'POST',
              url: 'http://localhost:8080/users/login',
              data: dataLogin,
            })
              .then(res => {
                if (res.data.status === 'success') {
                  $location.url('/chatapp');
                  $userService.setUserId(res.data.userId);
		  $socketService.connectServer(res.data.userId);
		  $chatBoxService.loadData();
                } else {
                  alert('Có lỗi xảy ra vui lòng thử lại sau');
                }
              })
              .catch(err => console.log('Error:', err));
          });
        } else {
          alert('Có lỗi xảy ra !!');
        }
      }, {
          scope: ['email', 'public_profile'],
        });
    }

    // test auto login
    // $timeout(() => $scope.FBLogin(), 200);
  })
  .controller('appController', () => { });

// đăng nhập fb.
window.fbAsyncInit = function () {
  FB.init({
    appId: '603837210084882',
    cookie: true,
    xfbml: true,
    version: 'v2.4'
  });

  FB.AppEvents.logPageView();

};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
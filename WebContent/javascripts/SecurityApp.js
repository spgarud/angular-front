var app = angular.module('securityApp', ["ui.router"]);
app.config(function($stateProvider, $urlRouterProvider){
    
    // For any unmatched url, send to /home
    $urlRouterProvider.otherwise("/login")
    
    $stateProvider.state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
		controller: "LoginController"
    })
      .state('home', {
          url: "/home",
          templateUrl: "templates/home.html",
			controller: "HomeController", resolve: {
	            auth: function ($q, authenticationSvc) {
	                var userInfo = authenticationSvc.getUserInfo();
	                if (userInfo) {
	                    return $q.when(userInfo);
	                } else {
	                    return $q.reject({ authenticated: false });
	                }
	            }
	        }
      })
		.state('home.partner', {
          url: "/partner",
          templateUrl: "templates/partners.html",
			 resolve: {
	            auth: function ($q, authenticationSvc) {
	                var userInfo = authenticationSvc.getUserInfo();
	                if (userInfo) {
	                    return $q.when(userInfo);
	                } else {
	                    return $q.reject({ authenticated: false });
	                }
	            }
	        }
      })
		      .state('home.partner.option1', {
		              url: "/search",
		              templateUrl: "templates/partner.search.html",
		              controller: "PartnerSearchController"
		          })
					.state('home.partner.option2', {
		              url: "/list",
		              templateUrl: "templates/partner.list.html",
		              controller: "PartnerListController"
					})
      
		.state('home.issuer', {
          url: "/issuer",
          templateUrl: "templates/issuers.html",
			controller: "IssuerController", resolve: {
	            auth: function ($q, authenticationSvc) {
	                var userInfo = authenticationSvc.getUserInfo();
	                if (userInfo) {
	                    return $q.when(userInfo);
	                } else {
	                    return $q.reject({ authenticated: false });
	                }
	            }
	        }
      })
		      .state('home.issuer.option1', {
		              url: "/search",
		              templateUrl: "templates/issuer.search.html",
		              //controller: "IssuerSearchController"
		          })
					.state('home.issuer.option2', {
		              url: "/list",
		              templateUrl: "templates/issuer.list.html",
		              controller: "IssuerController"
					})
		      
      .state('home.account', {
          url: "/account",
          templateUrl: "templates/accounts.html" , resolve: {
              auth: function ($q, authenticationSvc) {
                  var userInfo = authenticationSvc.getUserInfo();
                  if (userInfo) {
                      return $q.when(userInfo);
                  } else {
                      return $q.reject({ authenticated: false });
                  }
              }
          }
      })
        .state('home.account.list', {
            url: "/list",
            templateUrl: "templates/account.list.html",
            controller: "AccountListController"
        })
        .state('home.account.search', {
            url: "/search",
            templateUrl: "templates/account.search.html",
            //controller: "AccountSearchController"
        })
      .state('home.report', {
          url: "/report",
          templateUrl: "templates/reports.html", resolve: {
              auth: function ($q, authenticationSvc) {
                  var userInfo = authenticationSvc.getUserInfo();
                  if (userInfo) {
                      return $q.when(userInfo);
                  } else {
                      return $q.reject({ authenticated: false });
                  }
              }
          }
      })
        .state('home.report.report1', {
            url: "/report",
            templateUrl: "templates/report.report1.html",
            controller: "Report1Controller"
        })
		  .state('home.report.report2', {
            url: "/report",
            templateUrl: "templates/report.report2.html",
            controller: function($scope){
              $scope.stuffs = ["some", "other", "list", "Of", "stuff"];
            }
        })
		  .state('home.report.report3', {
            url: "/report",
            templateUrl: "templates/report.report3.html",
            controller: function($scope){
              $scope.objects = ["can", "not", "think", "Of", "anything"];
            }
        })
  })





app.run(["$rootScope", "$location", function ($rootScope, $location) {

    $rootScope.$on("$stateChangeSuccess", function (userInfo) {
        console.log(userInfo);
    });

    $rootScope.$on("$stateChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/login");
        }
    });
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
     });
}]);
app.config(function($sceDelegateProvider){ $sceDelegateProvider.resourceUrlWhitelist([
                                                                                      // Allow same origin resource loads.
                                                                                      'self',
                                                                                      // Allow loading from our assets domain.  Notice the difference between * and **.
                                                                                      'http://localhost:3000/api/**'
                                                                                    ]);
});

app.factory("authenticationSvc", ["$http","$q","$window",function ($http, $q, $window) {
    var userInfo;

    function login(userName, password) {
        var deferred = $q.defer();

        $http.post("http://localhost:3000/api/login", { userName: userName, password: password })
            .then(function (result) {
                userInfo = {
                    accessToken: result.data.access_token,
                    userName: result.data.userName
                };
                $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                deferred.resolve(userInfo);
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();
        $http.post("http://localhost:3000/api/logout", { access_token: userInfo.accessToken, userName: userInfo.userName })
        .then(function (result)
        //$http({
          //  method: "POST",
           // url: "http://localhost:3000/api/logout",
           // headers: {
             //   "access_token": userInfo.accessToken
                
           // }
        //}).then(function (result) 
        		{
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }
    
function search (par) {

        

        var deferred = $q.defer();

        $http.post("http://localhost:3000/api/search",{id: par }).then(function (result) {

          //d=result;

               deferred.resolve(result);

          }, function (error) {

                deferred.reject(error);

          });

        console.log(deferred.promise);

        return deferred.promise;

 }


//function getV() {
 //   return v;
//}
    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    return {
    	search: search,
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);

app.controller("LoginController", ["$scope", "$location", "$window", "authenticationSvc",function ($scope, $location, $window, authenticationSvc) {
    $scope.userInfo = null;
    $scope.login = function () {
        authenticationSvc.login($scope.userName, $scope.password)
            .then(function (result) {
                $scope.userInfo = result;
                $location.path("/home");
            }, function (error) {
                $window.alert("Invalid credentials");
                console.log(error);
            });
    };

    $scope.cancel = function () {
        $scope.userName = "";
        $scope.password = "";
    };
}]);

app.controller("HomeController", ["$scope", "$location", "authenticationSvc", "auth",function ($scope, $location, authenticationSvc, auth) {
	$scope.message = {
			'm': 'welcome message'};
	$scope.userInfo = auth;

    $scope.logout = function () {

        authenticationSvc.logout()
            .then(function (result) {
                $scope.userInfo = null;
                $location.path("#");
            }, function (error) {
                console.log(error);
            });
    };
}]);

app.controller('Home', function HomeController($state,$scope){
	$scope.message = {
	'm': 'welcome message'};
	
	//document.write($state.current.name);
	//document.write(v);
 });
 //define controller to fetch partner data
app.controller('PartnerListController', ['$scope', '$http', function($scope, $http) {
  $http.post("http://localhost:3000/api/search",{id:'abc'}).success(function(data) {
   console.log(data);
	 $scope.partners = data;
	});

  }]);

//define controller to search partner
app.controller('PartnerSearchController', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {
	 // $http.post("http://localhost:3000/api/search",{id:'abc'}).success(function(data) {
	 //  console.log(data);
	//	 $scope.partners = data;
		//});
	//$scope.partners = null;
	 $scope.search = function ()

     {    //console.log($scope.partnerID);

          authenticationSvc.search($scope.partnerID).then(function (result) {

                // console.log(result);

               //  var v = [];

                 /*for(var i=0; i<=result.data.length; i++){

                 v = {name:result.data[i].name,

                              accountType:result.data[i].accountType,

                              status:result.data[i].status };};*/

            //deferred.resolve(result);

                 //for(var i=0; i<=result.data.length; i++){

               //  angular.forEach(result.data[i], function(value, key){this.push(key+': '+value);},v);}

               //  console.log(v);

                 $scope.partners = result.data;

                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };

	  }]);
  //issuer controller
app.controller('IssuerController', ['$scope', '$http', function($scope, $http) {
  $http.get('javascripts/ctr.json').success(function(data) {
    $scope.p = data;
	});
  }]); 
//accountLists controller
app.controller('AccountListController', ['$scope', '$http', function($scope, $http) {
	  $http.get('javascripts/acc.json').success(function(data) {
		    $scope.accounts = data;
		    
			});
		  }]);
 //reports controller
app.controller('Report1Controller', function ReportController($scope){
	$scope.report = {
	'r': 'Generate reports here'};
 });

/**app.config(["$routeProvider",function ($routeProvider) {
$routeProvider.when("/", {
    templateUrl: "templates/home.html",
    controller: "HomeController",
    resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }
}).when('/message', {templateUrl: 'templates/mesaage.html', controller: 'Home',resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }}).
when('/partners', {templateUrl: 'templates/partners.html', controller: 'PartnerListController',resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }}).
when('/issuers', {templateUrl: 'templates/issuers.html', controller: 'IssuerController',resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }}).
when('/accounts', {templateUrl: 'templates/accounts.html', controller: 'AccountController',resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }}).
when('/reports', {templateUrl: 'templates/reports.html', controller: 'ReportController',resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }}).
when("/login", {
    templateUrl: "templates/login.html",
    controller: "LoginController",
});

}]);*/

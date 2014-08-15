//new code with idle timeout
var app = angular.module('securityApp', ["ui.router", "ngIdle"]);
app.config(function($idleProvider, $stateProvider, $urlRouterProvider, $keepaliveProvider){
	$idleProvider.idleDuration(160); // in seconds

    $idleProvider.warningDuration(160); // in seconds

    $keepaliveProvider.interval(160); // in seconds
    
/*old code without idle timeout
 * var app = angular.module('securityApp', ["ui.router"]);
app.config(function($stateProvider, $urlRouterProvider){*/
    
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
					.state('home.partner.option3', {
					  url: "/security_q",
					  templateUrl: "templates/partner.security.html",
					  controller: "PartnerSecQsController"
					})
      
		.state('home.issuer', {
          url: "/issuer",
          templateUrl: "templates/issuers.html",
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
		      .state('home.issuer.option1', {
		              url: "/search",
		              templateUrl: "templates/issuer.search.html",
		              controller: "IssuerSearchController"
		          })
					.state('home.issuer.option2', {
		              url: "/list",
		              templateUrl: "templates/issuer.list.html",
		              controller: "IssuerListController"
					})
					.state('home.issuer.option3', {
		              url: "/security_q",
		              templateUrl: "templates/issuer.security.html",
		              controller: "IssuerSecQsController"
					})
					.state('home.issuer.option4', {
		            url: "/odsConfig",
		            templateUrl: "templates/issuer.ods.html",
		            controller: "IssuerODSController"
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
            controller: "AccountSearchController"
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
            url: "/report1",
            templateUrl: "templates/report.report1.html",
            controller: "Report1Controller"
        })
		  .state('home.report.report2', {
            url: "/report2",
            templateUrl: "templates/report.report2.html",
            controller: "Report2Controller"
            
        })
		  .state('home.report.report3', {
            url: "/report3",
            templateUrl: "templates/report.report3.html",
            controller: "Report3Controller"
        })
         .state('home.report.report4', {
            url: "/report4",
            templateUrl: "templates/report.report4.html",
            controller: function($scope){
              $scope.stops = ["some ", "random", "way", "Of", "things"];
            }
        })
        /* .state('home.report.report5', {
            url: "/report5",
            templateUrl: "templates/report.report5.html",
            controller: function($scope){
              $scope.configs = ["Omaha Host Configuration Values ", "IssuerID", "IssuerName", "Description", "AttributeName", "AttributeValue", "DateCreated"];
            }
        })*/
        .state('home.report.report5', {
            url: "/report5",
            templateUrl: "templates/report.report5.html",
            controller: function($scope){
              $scope.display = ["aggregator ", "health", "check", "will", "be"," here"];
            }
        })
  })


// new code with idle timeout
app.run(["$rootScope", "$location", "$idle", function ($rootScope, $location, $idle) {

    $idle.watch();
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

/*old code without idle timeout
 * app.run(["$rootScope", "$location", function ($rootScope, $location) {

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
}]);*/
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
//for account search
function search1 (par) {
    var deferred = $q.defer();
    $http.post("http://localhost:3000/api/search1",{id: par }).then(function (result) {
    deferred.resolve(result);
    }, function (error) {
            deferred.reject(error);
      		});
    console.log(deferred.promise);
    return deferred.promise;
}
//for issuer ODS values search
function search2 (par) {
    var deferred = $q.defer();
    $http.post("http://localhost:3000/api/search2",{id: par }).then(function (result) {
    deferred.resolve(result);
    }, function (error) {
            deferred.reject(error);
      		});
    console.log(deferred.promise);
    return deferred.promise;
}
//for issuer search
function search3 (par) {
    var deferred = $q.defer();
    $http.post("http://localhost:3000/api/search3",{id: par }).then(function (result) {
    deferred.resolve(result);
    }, function (error) {
            deferred.reject(error);
      		});
    console.log(deferred.promise);
    return deferred.promise;
}
//for transaction messages (report1) search and for delivery reciepts
function search4 (par) {
    var deferred = $q.defer();
    $http.post("http://localhost:3000/api/search4",{id: par }).then(function (result) {
    deferred.resolve(result);
    }, function (error) {
            deferred.reject(error);
      		});
    console.log(deferred.promise);
    return deferred.promise;
}
//for delivery reports(report2) search
function search5 (par) {
    var deferred = $q.defer();
    $http.post("http://localhost:3000/api/search5",{id: par }).then(function (result) {
    deferred.resolve(result);
    }, function (error) {
            deferred.reject(error);
      		});
    console.log(deferred.promise);
    return deferred.promise;
}
//for enrollment counts(report3) search
function search6 (par) {
    var deferred = $q.defer();
    $http.post("http://localhost:3000/api/search6",{id: par }).then(function (result) {
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
    	search1: search1,
    	search2: search2,
    	search3: search3,
    	search4: search4,
    	search5: search5,
    	search6: search6,
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);
//----------------------------------controllers-----------------------------------------------------------
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

//new home controller with idle timeout
app.controller("HomeController", ["$window","$scope", "$location", "authenticationSvc", "auth",function ($window,$scope, $location, authenticationSvc, auth,$idle,$modal) {
   
	/*-----------------idle timeout code START-------------------*/
   $scope.$on('$idleStart',function(){

    });
    $scope.$on('$idleWarn',function(){});
    $scope.$on('$idleTimeout',function(){//closeModals();
      $window.alert(' timeout ');  
      authenticationSvc.logout()
      .then(function (result) {
          $scope.userInfo = null;
          $location.path("#");
      }, function (error) {
          console.log(error);
      });
 
    });
    $scope.$on('$idleEnd',function(){//closeModals();
    });
    /*---------------------idle timeout code END--------------------------*/
    $scope.message = {
                  'm': 'Welcome message'};
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
/* old home controller without idle timeout
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
*/
app.controller('Home', function HomeController($state,$scope){
	$scope.message = {
	'm': 'welcome message'};

	//document.write($state.current.name);
	//document.write(v);
 });
 //define controller to fetch partner data
app.controller('PartnerListController', ['$scope', '$http', function($scope, $http) {
  $http.post("http://localhost:3000/api/search",{id:'abc'}).success(function(res) {
   console.log(res);
	 $scope.partners = res;
	});
  /*.then(function (data) {
  console.log(data);
	 $scope.partners = data;
}, function (error) {
  $window.alert("Resource Not Found");
  console.log(error);
});*/
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
app.controller('PartnerSecQsController', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {

	 $scope.search = function ()

   {    //console.log($scope.issuerID);

        authenticationSvc.search($scope.partnerID).then(function (result) {

        $scope.partners = result.data;

              
      }, function (error) {

          $window.alert("Invalid credentials");
         // console.log(error);
      });
   };

	  }]);
  //issuer controller
app.controller('IssuerListController', ['$scope', '$http', function($scope, $http) {
	 $http.post("http://localhost:3000/api/search3",{id:'abc'}).success(function(res) {
		   console.log(res);
			 $scope.issuers = res;
			});

		  }]);
//define controller to search issuer
app.controller('IssuerSearchController', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {

	 $scope.search = function ()

     {    //console.log($scope.issuerID);

          authenticationSvc.search3($scope.issuerID).then(function (result) {

          $scope.issuers = result.data;

                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };

	  }]);
app.controller('IssuerSecQsController', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {

	 $scope.search = function ()

    {    //console.log($scope.issuerID);

         authenticationSvc.search3($scope.issuerID).then(function (result) {

         $scope.issuers = result.data;

               
       }, function (error) {

           $window.alert("Invalid credentials");
          // console.log(error);
       });
    };

	  }]);
//issuer ODS controller
app.controller('IssuerODSController', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {
	 $scope.search = function ()

     {    console.log($scope.issuerID);

          authenticationSvc.search2($scope.issuerID).then(function (result) {

          $scope.configs = result.data;
                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };
}]);
//accountLists controller
app.controller('AccountListController', ['$scope', '$http', function($scope, $http) {
	$http.post("http://localhost:3000/api/search1",{id:'abc'}).success(function(acct) {
		   console.log(acct);
			 $scope.accounts = acct;
			 
			});

		  }]);
//define controller to search account
app.controller('AccountSearchController', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {

	 $scope.search = function ()

     {    console.log($scope.phoneNo);

          authenticationSvc.search1($scope.phoneNo).then(function (result) {

          $scope.accounts = result.data;
                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };

	  }]);
 //transaction messages report controller
app.controller('Report1Controller', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {
	$scope.report = {
	'r': 'Generate reports here'};
	 	$scope.fromValue = "";//new Date();2010, 11, 28, 14, 57
	    $scope.toValue = "";//new Date();//2014, 01, 22, 14, 57 -if this variable is instanciated to a value, ng-disabled will not work
	    $scope.comDate = function(){
	    					var FromDate = new Date($scope.fromValue);
						    var ToDate = new Date($scope.toValue);
						    //var valCurDate = new Date();
						   // valCurDate = valCurDate.getMonth()+1 + "/" + valCurDate.getDate() + "/" + valCurDate.getYear();
						    //var CurDate = getDate();
						    if(FromDate > ToDate)
						    {
						        alert(" From Date should be less than ToDate");
						        return false; 
						    }
						    // else if(FromDate > CurDate)
						    // {
							   //    alert("From date should be less than current date");
						    //     return false; 
						    //}
						    //else if(ToDate > CurDate)
						    //  {
						    //     alert("To date should be less than current date");
						    //    return false;
						    // }
						    return true;
						};
						
						 $scope.search = function ()

					     {    console.log($scope.partnerID);

					          authenticationSvc.search4($scope.partnerID).then(function (result) {

					          $scope.messages = result.data;
					                
					        }, function (error) {

					            $window.alert("Invalid credentials");
					           // console.log(error);
					        });
					     };
 
}]);

//delivery receipts report controller
app.controller('Report2Controller', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {
	 	$scope.fromValue = "";//new Date();2010, 11, 28, 14, 57
	    $scope.toValue = "";//new Date();//2014, 01, 22, 14, 57 -if this variable is instanciated to a value, ng-disabled will not work
	    $scope.comDate = function(){
	    					var FromDate = new Date($scope.fromValue);
						    var ToDate = new Date($scope.toValue);
						   	    if(FromDate > ToDate)
							    {
							        alert(" From Date should be less than ToDate");
							        return false; 
							    }
						   return true;
						};
						
						 $scope.search = function ()

					     {    console.log($scope.partnerID);

					          authenticationSvc.search5($scope.partnerID).then(function (result) {

					          $scope.receipts = result.data;
					                
					        }, function (error) {

					            $window.alert("Invalid credentials");
					           // console.log(error);
					        });
					     };
 
}]);
//enrollment count report controller
app.controller('Report3Controller', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {
	 	$scope.fromValue = "";
	    $scope.toValue = "";//if this variable is instanciated to a value, ng-disabled will not work
	    $scope.comDate = function(){
	    					var FromDate = new Date($scope.fromValue);
						    var ToDate = new Date($scope.toValue);
						   	    if(FromDate > ToDate)
							    {
							        alert(" From Date should be less than ToDate");
							        return false; 
							    }
						   return true;
						};
						
						 $scope.search = function ()

					     {    console.log($scope.partnerID);

					          authenticationSvc.search6($scope.issuerID).then(function (result) {

					          $scope.counts = result.data;
					                
					        }, function (error) {

					            $window.alert("Invalid credentials");
					           // console.log(error);
					        });
					     };
 
}]);
/*
app.controller('DateController', ['$scope', function($scope) {
    $scope.fromValue = new Date(2010, 11, 28, 14, 57);
    $scope.toValue = new Date(2014, 11, 22, 14, 57);
    
    $scope.compareDate = function(){
    					var FromDate = new Date(fromValue);
					    var ToDate = new Date(toValue);
					    var valCurDate = new Date();
					    valCurDate = valCurDate.getMonth()+1 + "/" + valCurDate.getDate() + "/" + valCurDate.getYear();
					    var CurDate = new Date(valCurDate);
					 
					    if(FromDate > ToDate)
					    {
					        alert(FromDate + " should be less than " + toinput);
					        return false; 
					    }
					    else if(FromDate > CurDate)
					    {
					        alert("From date should be less than current date");
					        return false; 
					    }
					    else if(ToDate > CurDate)
					    {
					        alert("To date should be less than current date");
					        return false;
					    }
					}
}]);*/


app.controller('SortController', function($scope){
	$scope.orderByField = "";
	$scope.reverseSort = false;
});
/*app.controller( 'PageController',
		function ($scope, $filter)
		{

	// init
    $scope.sort = {       
                sortingOrder : 'id',
                reverse : false
            };
    
    $scope.gap = 5;
    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sort.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    
  
    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
        
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };
    
    $scope.range = function (size,start, end) {
        var ret = [];        
        console.log(size,start, end);
                      
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }        
         console.log(ret);        
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
    $scope.search();

   

});


fessmodule.$inject = ['$scope', '$filter'];

fessmodule.directive("customSort", function() {
return {
    restrict: 'A',
    transclude: true,    
    scope: {
      order: '=',
      sort: '='
    },
    template : 
      ' <a ng-click="sort_by(order)" style="color: #555555;">'+
      '    <span ng-transclude></span>'+
      '    <i ng-class="selectedCls(order)"></i>'+
      '</a>',
    link: function(scope) {
                
    // change sorting order
    scope.sort_by = function(newSortingOrder) {       
        var sort = scope.sort;
        
        if (sort.sortingOrder == newSortingOrder){
            sort.reverse = !sort.reverse;
        }                    

        sort.sortingOrder = newSortingOrder;        
    };
    
   
    scope.selectedCls = function(column) {
        if(column == scope.sort.sortingOrder){
            return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
        }
        else{            
            return'icon-sort' 
        } 
    };      
  }// end link
}
});*/
		 
/* trial code
 app..config(function($datepickerProvider) {
	  angular.extend($datepickerProvider.defaults, {
		    dateFormat: 'dd/MM/yyyy',
		    startWeek: 1
		  });
		})
app.controller('DatepickerDemoCtrl', function($scope, $http) {

	  $scope.selectedDate = new Date();
	  $scope.selectedDateAsNumber = Date.UTC(1986, 1, 22);
	  // $scope.fromDate = new Date();
	  // $scope.untilDate = new Date();
	  $scope.getType = function(key) {
	    return Object.prototype.toString.call($scope[key]);
	  };

	  $scope.clearDates = function() {
	    $scope.selectedDate = null;
	  };

	});* 
 */
/*app.controller('PageController', function($scope){
function MyCtrl($scope) {
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];
    $scope.numberOfPages=function(){
        return Math.ceil($scope.data.length/$scope.pageSize);                
    }
    for (var i=0; i<45; i++) {
        $scope.data.push("Item "+i);
    }
}
});*/
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

/**
var app = angular.module('securityApp', ["ui.router", "ngIdle"]);
app.config(function($idleProvider, $stateProvider, $urlRouterProvider, $keepaliveProvider){
	$idleProvider.idleDuration(60); // in seconds

    $idleProvider.warningDuration(60); // in seconds

    $keepaliveProvider.interval(60); // in seconds


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
		      .state('home.issuer.option1', {
		              url: "/search",
		              templateUrl: "templates/issuer.search.html",
		              controller: "IssuerSearchController"
		          })
					.state('home.issuer.option2', {
		              url: "/list",
		              templateUrl: "templates/issuer.list.html",
		              controller: "IssuerListController"
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
            controller: "AccountSearchController"
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





app.run(["$rootScope", "$location", "$idle", function ($rootScope, $location, $idle) {

    $idle.watch();
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
function search1 (par) {
    var deferred = $q.defer();
    $http.post("http://localhost:3000/api/search1",{id: par }).then(function (result) {
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
    	search1: search1,
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);
//----------------------------------controllers-----------------------------------------------------------
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

/*app.controller("HomeController", ["$window", "$scope", "$location", "authenticationSvc", "auth",function ($window, $idle, $scope, $location, authenticationSvc, auth) {
	 $scope.$on('$idleStart',function(){

	        

     });

     $scope.$on('$idleWarn',function(){});

     $scope.$on('$idleTimeout',function(){

      $window.alert(' timeout ');  

      authenticationSvc.logout()

      .then(function (result) {

          $scope.userInfo = null;

          $location.path("#");

      }, function (error) {

          console.log(error);

      });

     

     });

     $scope.$on('$idleEnd',function(){

     });


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
}]);*/
/**app.controller("HomeController", ["$window","$scope", "$location", "authenticationSvc", "auth",function ($window,$scope, $location, authenticationSvc, auth,$idle,$modal) {
    /* function closeModals() {
            if ($scope.warning) {
            $scope.warning.close();
          	$scope.warning = null;
           	}

       		if ($scope.timedout) {
              	$scope.timedout.close();
             	$scope.timedout = null;
            }
          } */
	/*-----------------idle timeout code START-------------------*/
 /**   $scope.$on('$idleStart',function(){
           //closeModals();

// $scope.warning = $modal.open({
  // templateUrl: 'warning-dialog.html',
  // windowClass: 'modal-danger'
 //});
    });
    $scope.$on('$idleWarn',function(){});
    $scope.$on('$idleTimeout',function(){//closeModals();
      $window.alert(' timeout ');  
      authenticationSvc.logout()
      .then(function (result) {
          $scope.userInfo = null;
          $location.path("#");
      }, function (error) {
          console.log(error);
      });
           // $scope.timedout = $modal.open({
  //   templateUrl: 'timedout-dialog.html',
    // windowClass: 'modal-danger'
 //  });
    });
    $scope.$on('$idleEnd',function(){//closeModals();
    });
    /*---------------------idle timeout code END--------------------------*/
 /**   $scope.message = {
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
app.controller('PartnerListController', ['$window','$location', 'authenticationSvc','$scope', '$http', 'auth', function($scope, $http, $window, $location, authenticationSvc, auth,$idle,$modal) {

  $http.post("http://localhost:3000/api/search",{id:'abc'}).success(function(res) {
   console.log(res);
	 $scope.partners = res;
	});
	/*------------------idle timeout code START-----------------------*/
//	$scope.$on('$idleStart',function(){
      //closeModals();

//$scope.warning = $modal.open({
//templateUrl: 'warning-dialog.html',
//windowClass: 'modal-danger'
/*});
});
$scope.$on('$idleWarn',function(){});
$scope.$on('$idleTimeout',function(){//closeModals();
 $window.alert(' timeout ');  
 authenticationSvc.logout()
 .then(function (result) {
     $scope.userInfo = null;
     $location.path("#");
 }, function (error) {
     console.log(error);
 });
      // $scope.timedout = $modal.open({
// templateUrl: 'timedout-dialog.html',
// windowClass: 'modal-danger'
//});
});
$scope.$on('$idleEnd',function(){//closeModals();
});
/*---------------------idle timeout code END--------------------------*/
  /*.then(function (data) {
  console.log(data);
	 $scope.partners = data;
}, function (error) {
  $window.alert("Resource Not Found");
  console.log(error);
});*/
 // }]);


  
//define controller to search partner
/**app.controller('PartnerSearchController', ['$scope', '$http', 'authenticationSvc', '$window','$location', 'auth', function($scope, $http, $window, $location, authenticationSvc, auth,$idle,$modal) {
	/*------------------idle timeout code START-----------------------*/
//	$scope.$on('$idleStart',function(){
        //closeModals();

//$scope.warning = $modal.open({
// templateUrl: 'warning-dialog.html',
// windowClass: 'modal-danger'
//});
/* });
 $scope.$on('$idleWarn',function(){});
 $scope.$on('$idleTimeout',function(){//closeModals();
   $window.alert(' timeout ');  
   authenticationSvc.logout()
   .then(function (result) {
       $scope.userInfo = null;
       $location.path("#");
   }, function (error) {
       console.log(error);
   });
        // $scope.timedout = $modal.open({
//   templateUrl: 'timedout-dialog.html',
 // windowClass: 'modal-danger'
//  });
 });
 $scope.$on('$idleEnd',function(){//closeModals(); $scope.search = function ()

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

  /*               $scope.partners = result.data;

                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };
 });
 /*---------------------idle timeout code END--------------------------*/
	 // $http.post("http://localhost:3000/api/search",{id:'abc'}).success(function(data) {
	 //  console.log(data);
	//	 $scope.partners = data;
		//});
	//$scope.partners = null;
	/* $scope.search = function ()

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

           /*      $scope.partners = result.data;

                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };*/

//	  }]);


  //issuer controller
/*app.controller('IssuerListController', ['$window','$location', 'authenticationSvc','$scope', '$http', 'auth',function($scope, $http, $window, $location, authenticationSvc, auth,$idle,$modal) {
	/*------------------idle timeout code START-----------------------*/
/*	$scope.$on('$idleStart',function(){
        //closeModals();

//$scope.warning = $modal.open({
// templateUrl: 'warning-dialog.html',
// windowClass: 'modal-danger'
//});
 });
 $scope.$on('$idleWarn',function(){});
 $scope.$on('$idleTimeout',function(){//closeModals();
   $window.alert(' timeout ');  
   authenticationSvc.logout()
   .then(function (result) {
       $scope.userInfo = null;
       $location.path("#");
   }, function (error) {
       console.log(error);
   });
        // $scope.timedout = $modal.open({
//   templateUrl: 'timedout-dialog.html',
 // windowClass: 'modal-danger'
//  });
 });
 $scope.$on('$idleEnd',function(){//closeModals();
 });
 /*---------------------idle timeout code END--------------------------*/
/*	 $http.post("http://localhost:3000/api/search",{id:'abc'}).success(function(res) {
		   console.log(res);
			 $scope.issuers = res;
			});
		  
		  }]);


//define controller to search issuer
app.controller('IssuerSearchController', ['$scope', '$http', '$window','$location','auth','authenticationSvc', function($scope, $http, $window, $location, authenticationSvc, auth,$idle,$modal) {
	
	/*------------------idle timeout code START-----------------------*/
	/*$scope.$on('$idleStart',function(){
        //closeModals();

//$scope.warning = $modal.open({
// templateUrl: 'warning-dialog.html',
// windowClass: 'modal-danger'
//});
 });
 $scope.$on('$idleWarn',function(){});
 $scope.$on('$idleTimeout',function(){//closeModals();
   $window.alert(' timeout ');  
   authenticationSvc.logout()
   .then(function (result) {
       $scope.userInfo = null;
       $location.path("#");
   }, function (error) {
       console.log(error);
   });
        // $scope.timedout = $modal.open({
//   templateUrl: 'timedout-dialog.html',
 // windowClass: 'modal-danger'
//  });
 });
 $scope.$on('$idleEnd',function(){//closeModals();
 });
 /*---------------------idle timeout code END--------------------------*/
 /*$scope.search = function ()

     {    //console.log($scope.issuerID);

          authenticationSvc.search($scope.issuerID).then(function (result) {

          $scope.issuers = result.data;

                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };

	  }]);
//accountLists controller
app.controller('AccountListController', ['$scope', '$http', '$window','$location','auth','authenticationSvc', function($scope, $http, $window, $location, authenticationSvc, auth,$idle,$modal) {
	/*------------------idle timeout code START-----------------------*/
/*	$scope.$on('$idleStart',function(){
        //closeModals();

//$scope.warning = $modal.open({
// templateUrl: 'warning-dialog.html',
// windowClass: 'modal-danger'
//});
 });
 $scope.$on('$idleWarn',function(){});
 $scope.$on('$idleTimeout',function(){//closeModals();
   $window.alert(' timeout ');  
   authenticationSvc.logout()
   .then(function (result) {
       $scope.userInfo = null;
       $location.path("#");
   }, function (error) {
       console.log(error);
   });
        // $scope.timedout = $modal.open({
//   templateUrl: 'timedout-dialog.html',
 // windowClass: 'modal-danger'
//  });
 });
 $scope.$on('$idleEnd',function(){//closeModals();
 });
 /*---------------------idle timeout code END--------------------------*/
/*	$http.post("http://localhost:3000/api/search1",{id:'abc'}).success(function(acct) {
		   console.log(acct);
			 $scope.accounts = acct;
			});
		  
		  }]);


//define controller to search account
app.controller('AccountSearchController', ['$scope', '$http', '$window','$location','auth','authenticationSvc', function($scope, $http, $window, $location, authenticationSvc, auth,$idle,$modal) {
	/*------------------idle timeout code START-----------------------*/
/*	$scope.$on('$idleStart',function(){
        //closeModals();

//$scope.warning = $modal.open({
// templateUrl: 'warning-dialog.html',
// windowClass: 'modal-danger'
//});
 });
 $scope.$on('$idleWarn',function(){});
 $scope.$on('$idleTimeout',function(){//closeModals();
   $window.alert(' timeout ');  
   authenticationSvc.logout()
   .then(function (result) {
       $scope.userInfo = null;
       $location.path("#");
   }, function (error) {
       console.log(error);
   });
        // $scope.timedout = $modal.open({
//   templateUrl: 'timedout-dialog.html',
 // windowClass: 'modal-danger'
//  });
 });
 $scope.$on('$idleEnd',function(){//closeModals();
 });
 /*---------------------idle timeout code END--------------------------*/
/*	 $scope.search = function ()

     {    console.log($scope.phoneNo);

          authenticationSvc.search1($scope.phoneNo).then(function (result) {

          $scope.accounts = result.data;
                
        }, function (error) {

            $window.alert("Invalid credentials");
           // console.log(error);
        });
     };

	  }]);


 //reports controller
app.controller('Report1Controller', function ReportController($scope){
	$scope.report = {
	'r': 'Generate reports here'};
 });


//define date controller
app.controller('DateController', ['$scope', function($scope) {
    $scope.value = new Date(2014, 01, 28, 14, 00);
}]);


//define controller for sorting
app.controller('SortController', function($scope){
	$scope.orderByField = "";
	$scope.reverseSort = false;
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

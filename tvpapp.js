/**
 * Created by srinivasanm on 12/30/2014.
 */
(function() {
    angular.module("tvpapp",["smart-table", "ui.router"])
        .controller("tvpController",["$scope", "loadServices", function($scope, loadServices) {
            var vm = this;

            $scope.Contains = function (a, obj) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === obj) {
                        return true;
                    }
                }
                return false;
            }
            $scope.Range = function(n) {
                return new Array(n);
            }
        }])
        .config(["$urlRouterProvider", "$stateProvider", function($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.otherwise('/home');
            $stateProvider
                // HOME STATES AND NESTED VIEWS ========================================
                .state('home', {
                    url: '/home',
                    views: {
                        "": {
                            templateUrl: 'app/Plan/bView.html',
                            controller: 'bController as bc'
                        }
                    }
                })
        }]);
    }
)();
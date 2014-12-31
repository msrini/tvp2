/*
a service to fetch clients data from a local file. Demonstrates use of async method
*/
(function() {
    var trackapp = angular.module("tvpapp");
    trackapp.service("loadServices", ["$http", function($http) {
        this.fileData = function(fn) {
            $http({
                method: 'GET',
                //url: 'app/data/" + $scope.fname;   //entry.txt'
                url: 'app/data/entry.txt'
            }).success(function(data){
                fn(data);
            }).error(function(err){
                console.log("error:" + err);
            });
        }
    }]);
})();

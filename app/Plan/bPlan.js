/**
 * Created by srinivasanm on 12/30/2014.
 */
(function () {
    "use strict";
    angular.module("tvpapp")
        .controller("bController",["$scope", "loadServices", function($scope, loadServices) {
            var vm = this;
            loadServices.fileData(function(d) {
                //add code to process the data which is the parameter, d
                vm.gDetails = d;
                vm.nWeeks = d.weeks.length; //number of weeks
                vm.mWeeks = {};     //number of weeks in the month e.g. {"jan":5, "feb":4}
                vm.wStDay = [];     //week starting day (entries = number of weeks)
                vm.months = [];     //["Jan","Feb"]
                vm.wBursts = [];    //
                vm.bRows = [];
                for (var i=0; i < vm.nWeeks; i++) {
                    var currMonth = d.weeks[i].month;
                    if (!$scope.Contains(vm.months, currMonth)) {
                        vm.months.push(currMonth);
                        vm.mWeeks[currMonth] = 1;
                    } else {
                        vm.mWeeks[currMonth] = vm.mWeeks[currMonth] + 1;
                    }
                    vm.wStDay[i] = d.weeks[i].startDay;
                    vm.wBursts[i] = d.weeks[i].bursts;
                }
                for (var i=0; i < vm.wBursts[0].length; i++) {
                    vm.bRows.push(i);
                }
            });
        }]);
})();

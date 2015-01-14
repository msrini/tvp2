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
                vm.nWeeks = d.weeks.length; //total number of weeks
                vm.mWeeks = {};     //number of weeks in the month e.g. {"jan":5, "feb":4}
                vm.mWeeksList = {};  //"jan":[1,2,3,4], "feb":[5,6,7]...
                vm.wStDay = [];     //week starting day (entries = number of weeks)
                vm.months = [];     //["Jan","Feb"]
                vm.wBursts = [];    //
                vm.bRows = [];
                vm.selectCells = [];
                vm.editMode = false;
                for (var i=0; i < vm.nWeeks; i++) {
                    var currMonth = d.weeks[i].month;
                    var currWeek = i;
                    var weeknumbers = [];
                    if (!$scope.Contains(vm.months, currMonth)) {
                        vm.months.push(currMonth);
                        vm.mWeeks[currMonth] = 1;
                        weeknumbers.push(i);
                        vm.mWeeksList[currMonth] = weeknumbers;
                    } else {
                        vm.mWeeks[currMonth] = vm.mWeeks[currMonth] + 1;
                        weeknumbers = vm.mWeeksList[currMonth];
                        weeknumbers.push(i);
                        vm.mWeeksList[currMonth] = weeknumbers;
                    }
                    vm.wStDay[i] = d.weeks[i].startDay;
                    vm.wBursts[i] = d.weeks[i].bursts;
                }
                for (var i=0; i < vm.wBursts[0].length; i++) {
                    vm.bRows.push(i);
                }
                //now form the collection to be displayed
                vm.rowObjects = {};
                for (var row=0; row<vm.bRows.length; row++) {
                    var bursts = [];
                    var edits = [];
                    for (var i=0; i<vm.nWeeks; i++) {
                        bursts.push(vm.wBursts[i][row]);
                        edits.push(false);
                    }
                    vm.rowObjects[row] = {"amounts": bursts,"edits": edits, "origAmounts": bursts.slice(0)};
                }
                //rowObjects["0"].amounts = [57,867,5...]
                //Now get month rolled up totals
                vm.totals = {};
                vm.calcTotals();

            });
            vm.calcTotals = function() {
                //sum by month
                for (var i=0; i<vm.months.length; i++) {
                    var mth = vm.months[i];
                    var sum = 0;
                    for (var wn=0; wn<vm.mWeeksList[mth].length; wn++) {
                        var col = vm.mWeeksList[mth][wn];
                        for (var row=0; row<vm.wBursts[0].length; row++) {
                            sum = sum + vm.rowObjects[row].amounts[col];
                        }
                    }
                    vm.totals[mth] = sum;
                }
                //sum by week
                for (var i=0; i<vm.nWeeks.length; i++) {
                    var sum = 0;
                    for (var row=0; row<vm.wBursts[0].length; row++) {

                    }
                }
            }
            vm.cellClicked = function(row,idx) {
                //toggle - see if already existing in the selected array. if so remove else add
                if (vm.editMode) {
                    return;
                }
                var e = alreadySelected(row, idx);
                if (e >= 0) {
                    vm.selectCells.splice(e, 1);    //remove
                    vm.rowObjects[row].edits[idx] = false;
                } else {
                    vm.selectCells.push({"row":row, "col":idx, "amt":vm.rowObjects[row].amounts[idx]});
                    //vm.rowObjects[row].edits[idx] = true;
                }
            }
            //selected is for CSS shading
            vm.selected = function(row,idx) {
                if (alreadySelected(row,idx) >= 0) {
                    return("selected");
                } else {
                    return("xselected");
                }
            }
            var alreadySelected = function(row,idx){
                for (var i=0; i<vm.selectCells.length; i++) {
                    if (row == vm.selectCells[i].row && idx == vm.selectCells[i].col) {
                        return (i);
                    }
                }
                return (-1);
            }
            vm.editSel = function() {
                for (var i=0; i<vm.selectCells.length; i++) {
                    var r = vm.selectCells[i].row;
                    var c = vm.selectCells[i].col;
                    vm.rowObjects[r].edits[c] = true;
                    vm.editMode = true;
                }

                console.log (JSON.stringify(vm.selectCells));
            }
            vm.isEdit = function(row,idx) {
                if (vm.rowObjects[row].edits[idx]) {
                    return true;
                }
                return false;
            }
            vm.cancSel = function() {
                vm.editMode = false;
                for (var i=0; i<vm.selectCells.length; i++) {
                    var r = vm.selectCells[i].row;
                    var c = vm.selectCells[i].col;
                    vm.rowObjects[r].amounts[c] = vm.rowObjects[r].origAmounts[c];
                    vm.rowObjects[r].edits[c] = false;
                }
                vm.selectCells = [];
            }
            vm.saveSel = function() {
                vm.editMode = false;
                for (var i=0; i<vm.selectCells.length; i++) {
                    var r = vm.selectCells[i].row;
                    var c = vm.selectCells[i].col;
                    //vm.rowObjects[r].amounts[c] = vm.rowObjects[r].origAmounts[c];
                    vm.rowObjects[r].edits[c] = false;
                }
                vm.calcTotals();
            }
            vm.onDropComplete2 = function() {
                console.log("HIHIHI");
            }
        }]);

})();

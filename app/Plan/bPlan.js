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
                vm.wFormats = [];
                vm.wMonths = [];    //Jan,Jan...Feb,Feb,Feb - month to which the week belongs to
                vm.bRows = [];
                vm.selectCells = [];
                vm.editMode = false;
                vm.dragged = false;
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
                    vm.wMonths[i] = d.weeks[i].month;
                    vm.wBursts[i] = d.weeks[i].bursts;
                    vm.wFormats[i] = d.weeks[i].formats;
                }
                for (var i=0; i < vm.wBursts[0].length; i++) {
                    vm.bRows.push(i);
                }
                //now form the collection to be displayed
                vm.rowObjects = {};

                for (var row=0; row<vm.bRows.length; row++) {
                    var bursts = [];
                    var edits = [];
                    var classes = [];
                    var formats = [];
                    for (var i=0; i<vm.nWeeks; i++) {
                        bursts.push(vm.wBursts[i][row]);
                        edits.push(false);
                        classes.push("notselected");
                        formats.push(vm.wFormats[i][row]);
                    }
                    vm.rowObjects[row] = {"amounts": bursts, "edits": edits,
                        "origAmounts": bursts.slice(0), "classes":classes, "formats":formats};
                }
                //rowObjects["0"].amounts = [57,867,5...]
                //Now get month rolled up totals
                vm.totals = {};
                vm.calcTotals();
            });
            /*
            Calculate running totals. Right now it is by Month. Add anything else here.
            */
            vm.calcTotals = function() {
                //sum by month
                for (var i=0; i<vm.months.length; i++) {
                    var mth = vm.months[i];
                    var sum = 0;
                    for (var wn=0; wn<vm.mWeeksList[mth].length; wn++) {
                        var col = vm.mWeeksList[mth][wn];
                        for (var row=0; row<vm.wBursts[0].length; row++) {
                            sum = sum + parseInt(vm.rowObjects[row].amounts[col]);
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
            /*
            This is what happens when a cell is clicked or dblclicked! Toggles selected cells. Store them in the memory
            */
            vm.cellClicked = function(row,idx) {
                //toggle - see if already existing in the selected array. if so remove else add
                if (vm.editMode) {
                    return;
                }
                row = parseInt(row);
                idx = parseInt(idx);
                var e = alreadySelected(row, idx);
                if (e >= 0) {
                    vm.selectCells.splice(e, 1);    //remove
                    vm.rowObjects[row].edits[idx] = false;
                    vm.rowObjects[row].classes[idx] = "notselected";
                } else {
                    vm.selectCells.push({"row":parseInt(row), "col":parseInt(idx),
                        "format":parseInt(vm.rowObjects[row].formats[idx]),
                        "amt":parseInt(vm.rowObjects[row].amounts[idx])});
                    vm.rowObjects[row].classes[idx] = "selected";
                    //vm.rowObjects[row].edits[idx] = true;
                }
            }
            /*
            Return true or false depending on if any of the cells are selected or not. Useful in switching the display on or off in view
            */
            vm.ifAnyClickedCells = function() {
                if (vm.selectCells.length > 0) {
                    return (true);
                }
                return (false);
            }
            //selected is for CSS shading
            vm.selected = function(row,idx) {
                return ("CSSTableGenerator " + vm.rowObjects[row].classes[idx]);
            }
            /*
            After the data is Saved or Cancelled, good to reset cells
            */
            var resetClasses = function() {
                for (var r = 0; r < vm.bRows.length; r++) {
                    for (var c = 0; c < vm.nWeeks; c++) {
                        vm.rowObjects[r].classes[c] = "notselected";
                    }
                }
                vm.dropError = false;
                vm.editSelDataPanel = false;
            }
            var alreadySelected = function(row,idx){
                for (var i=0; i<vm.selectCells.length; i++) {
                    if (row === vm.selectCells[i].row && idx === vm.selectCells[i].col) {
                        return (i);
                    }
                }
                return (-1);
            }
            //this is for inline editing of a cell
            vm.editSel = function() {
                for (var i=0; i<vm.selectCells.length; i++) {
                    var r = vm.selectCells[i].row;
                    var c = vm.selectCells[i].col;
                    vm.rowObjects[r].edits[c] = true;
                    vm.editMode = true;
                }
                console.log (JSON.stringify(vm.selectCells));
            }
            vm.editSelData = function() {
                vm.editSelDataPanel = true;
            }
            vm.bCumAmountSelected = function() {
                var sum=0;
                for (var i=0; i<vm.selectCells.length; i++) {
                    sum += vm.selectCells[i].amt;
                }
                return (sum);
            }

            vm.editSelDataPanel = false;
            //find out if the edit selection panel is turned off or on (this is not inline edit)
            vm.editPanel = function() {
                return vm.editSelDataPanel;
            }
            //for inline edit
            vm.isEdit = function(row,idx) {
                if (vm.rowObjects[row].edits[idx]) {
                    return true;
                }
                return false;
            }
            //when cancel button is clicked
            vm.cancSel = function() {
                vm.editMode = false;
                for (var r=0; r<vm.bRows.length; r++) {
                    for (var c=0; c<vm.nWeeks; c++) {
                        vm.rowObjects[r].amounts[c] = vm.rowObjects[r].origAmounts[c];
                        vm.rowObjects[r].edits[c] = false;
                    }
                }
                vm.selectCells = [];
                vm.calcTotals();
                resetClasses();
            }

            vm.saveSel = function() {
                if (vm.editSelDataPanel) {
                    for (var i=0; i<vm.selectCells.length; i++) {
                        var r = vm.selectCells[i].row;
                        var c = vm.selectCells[i].col;
                        //vm.rowObjects[r].amounts[c] = vm.selectCells[i].amt;
                        vm.rowObjects[r].formats[c] = vm.selectCells[i].format;
                        //vm.editMode = true;
                    }
                }
                for (var r = 0; r < vm.bRows.length; r++) {
                    for (var c = 0; c < vm.nWeeks; c++) {
                        vm.rowObjects[r].origAmounts[c] = parseInt(vm.rowObjects[r].amounts[c]);
                        vm.rowObjects[r].edits[c] = false;
                    }
                }
                vm.editMode = false;
                vm.selectCells = [];
                vm.calcTotals();
                resetClasses();
            }

            vm.onDragSuccess = function(dat,evt) {
                vm.dropError = false;
                vm.dragged = true;
                console.log("---DragSuccess - DAT----:" + JSON.stringify(dat));
            }
            vm.onDropComplete2 = function(dat, evt, droppedRow, droppedCol) {
                vm.dragged = false;
                console.log("DAT:" + JSON.stringify(dat));
                console.log("ROW:" + droppedRow + ";COL:" + droppedCol);
                var extremes = validateDrop(droppedRow, droppedCol);
                if (!extremes) {
                    console.log("Failed Drop");
                    vm.dropError = true;
                    return;
                }
                console.log("EXTREMES:" + JSON.stringify(extremes));
                //
                //var offsetRow = droppedRow - vm.selectCells[0].row;
                //var offsetCol = droppedCol - vm.selectCells[0].col;
                var offsetRow = droppedRow - extremes.topleft.row;
                var offsetCol = droppedCol - extremes.topleft.col;
                for (var i=0; i<vm.selectCells.length; i++) {
                    var targetRow = vm.selectCells[i].row + offsetRow;
                    var targetCol = vm.selectCells[i].col + offsetCol;
                    console.log("OffsetRow:" + offsetRow + ";OffsetCol=" + offsetCol + "TargetRow:" + targetRow + ";TargetCol=" + targetCol);
                    vm.rowObjects[targetRow].amounts[targetCol] = vm.rowObjects[targetRow].amounts[targetCol] + vm.selectCells[i].amt;
                    vm.rowObjects[vm.selectCells[i].row].amounts[vm.selectCells[i].col] = 0;
                    vm.rowObjects[targetRow].classes[targetCol] = "dropped";
                    console.log("ROWOBJECT[" + targetRow + "].amounts[" + targetCol + "] changed to " + vm.rowObjects[targetRow].amounts[targetCol]);
                    console.log("ROWOBJECT[" + vm.selectCells[i].row + "].amounts[" + vm.selectCells[i].col + "] changed to " + vm.rowObjects[vm.selectCells[i].row].amounts[vm.selectCells[i].col]);

                }
                vm.calcTotals();

            }
            vm.cellsDragged = function() {
                return(vm.dragged);
            }
            var validateDrop = function(droppedRow, droppedCol) {
                var extremes = getExtremeSelectedCells();
                var ret = null;

                var offsetRow = droppedRow - extremes.topleft.row;
                var offsetCol = droppedCol - extremes.topleft.col;
                if (offsetRow == 0 && offsetCol == 0) {
                    console.log("DROPERR: offset row, col=" + offsetRow + ";" + offsetCol);
                    return (ret);
                }
                console.log("VAL: dropped row=" + droppedRow + ";droppedCol=" + droppedCol );
                for (var i=0; i<vm.selectCells.length; i++) {
                    console.log("  SelectCells[" + i + "]" + i + ".row=" + vm.selectCells[i].row + ";.col=" + vm.selectCells[i].col);
                    var targetRow = vm.selectCells[i].row + offsetRow;
                    var targetCol = vm.selectCells[i].col + offsetCol;
                    if (targetRow < 0 || targetCol < 0) {
                        console.log("DropERR: target row, col=" + targetRow + ";" + targetCol);
                        return (ret);
                    }
                    if (targetRow >= vm.bRows.length) {
                        console.log("DROPERR - Target Row " + targetRow + " exceeds limit");
                        return (ret);
                    }
                    if (targetCol >= vm.nWeeks) {
                        console.log("DROPERR - Target Col " + targetCol + " exceeds limit");
                        return (ret);
                    }
                }
                return(extremes);
            }
            var getExtremeSelectedCells = function() {
                var minCol = -1;
                var maxCol = 9999;
                for (var i=0; i<vm.selectCells.length; i++) {
                    if (vm.selectCells[i].col > minCol) {
                        minCol = vm.selectCells[i].col;     //rightmost selected col
                    }
                    if (vm.selectCells[i].col < maxCol) {
                        maxCol = vm.selectCells[i].col;     //leftmost selected col
                    }
                }
                var minRow4minCol = -1;
                var maxRow4maxCol = 9999;
                for (var i=0; i<vm.selectCells.length; i++) {
                    if (vm.selectCells[i].col == minCol) {
                        if (vm.selectCells[i].row > minRow4minCol) {
                            minRow4minCol = vm.selectCells[i].row;     //topmost selected row for rightmost col
                        }
                    }
                    if (vm.selectCells[i].col == maxCol) {
                        if (vm.selectCells[i].row < maxRow4maxCol) {
                            maxRow4maxCol = vm.selectCells[i].row;     //bottommost selected row for leftmost col
                        }
                    }
                }

                return ({"bottomright":{"row":minRow4minCol, "col":minCol}, "topleft":{"row":maxRow4maxCol, "col":maxCol}});
            }
        }]);

})();

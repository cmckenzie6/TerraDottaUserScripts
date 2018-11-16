// ==UserScript==
// @name         Combine Queries And Reports
// @namespace    http://powdercake.space/
// @version      0.1
// @description  Combines all checked queries and reports from the Admin Home page.
// @author       Colin McKenzie
// @match        https://passport.gwu.edu/index.cfm?FuseAction=Administration.Home*
// @match        https://passport.gwu.edu/index.cfm?FuseAction=Portal.Home*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //initialize the buttons and settings panel
    $("#widget-tds-admin-queries > form:nth-child(14) > div.panel-body.row > table > tbody > tr > td > div").append("<div class='pull-right'><a id='CQARbutton' class='btn btn-primary btn-xs'>Auto Combine</a> <button class='btn btn-default btn-xs' type='button' id='CQARsettings' data-container='body' data-toggle='popover' data-placement='bottom' data-html='true' data-content='Delay time in seconds: <input type=\"number\" min=\"0\" class=\"form-control\" id=\"CQARdelayTime\" value=\"3\">'><i class='fa fa-gear'></i></button></div>");
    $('#CQARsettings').popover();

    $('#CQARsettings').on('shown.bs.popover', function () { //bootstrap nonsense
        if (localStorage.getItem('CQARdelayTime')>0){
            $("#CQARdelayTime").val(localStorage.getItem('CQARdelayTime'));
        }
        $("#CQARdelayTime").change(function(){
            localStorage.setItem('CQARdelayTime', $("#CQARdelayTime").val());
        });
    })

    //initialize variables
    var CQARdelayTime = 3;
    var currentQuery = 0;
    var CQARqueries = [];
    var CQARreports = [];
    var CQARcombinations = [];

    function getCheckedQueriesAndReports(){
        //clear arrays and counter
        CQARqueries = [];
        CQARreports = [];
        CQARcombinations = [];
        currentQuery = 0;

        //check for user-defined delay time
        if (localStorage.getItem('CQARdelayTime')>0){
            console.log("Using user-specified delay time of "+localStorage.getItem('CQARdelayTime')+" seconds.");
            CQARdelayTime = localStorage.getItem('CQARdelayTime');
        } else {
            CQARdelayTime = 3;
            console.log("User did not specify a delay time. Using default 3 second delay.");
        }

        //get IDs for each query and report
        $("input[name='Staff_Query_IDs']:checked").each(function() {
            CQARqueries.push($(this).val());
        });
        $("input[name='Staff_Report_IDs']:checked").each(function() {
            CQARreports.push($(this).val());
        });

        if(CQARqueries.length < 1){
            if(CQARreports.length < 1){
                alert("Error: You must check the box next to at least one query and one report.");
            } else {
                alert("Error: You must check the box next to at least one query.");
            }
        } else if(CQARreports.length < 1){
            alert("Error: You must check the box next to at least one report.");
        }

        //download each combination
        if (CQARqueries.length>0 && CQARreports.length>0){
            // build an array containing all of the combinations of queries/reports
            for(var i=0; i<CQARqueries.length; i++){
                for(var j=0; j<CQARreports.length; j++){
                    CQARcombinations.push([CQARqueries[i],CQARreports[j]]);
                }
            }
            //download the reports
            combinationLoop(CQARcombinations.length);
        }
    }

    function combinationLoop (i) {
        setTimeout(function () {
            console.log("["+(currentQuery+1)+"/"+CQARcombinations.length+"]: Combining query "+CQARcombinations[i-1][0]+" with report "+CQARcombinations[i-1][1]+".");
            $("#selQry").val(CQARcombinations[i-1][0]);
            $("#selRpt").val(CQARcombinations[i-1][1]);
            exportAsExcel(); //built in TD function
            currentQuery++;
            if (--i) combinationLoop(i);      //repeat the loop for all items in the CQARcombinations array
        }, CQARdelayTime*1000)
    };

    $("#CQARbutton").click(function(){
        getCheckedQueriesAndReports();
    });
})();
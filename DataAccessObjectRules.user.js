// ==UserScript==
// @name         DataAccessObjectRules
// @namespace    https://powdercake.space/
// @version      0.1
// @description  Allows the saving of "rules" for Data Access Object permissions which can be applied to future users.
// @author       Colin McKenzie
// @match        https://*.edu/index.cfm?FuseAction=StaffAdmin.EditUserPermissions&iUserID=*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// ==/UserScript==
var daoRules;

(function() {
    'use strict';

    // ADD UI ELEMENTS
    // Apply Rule button
    $("<div style='margin:1em;'><span id='dao-apply-rule-button' class='btn btn-primary btn-xs'>Apply DAO Rule</span></div>").insertBefore($("#sa_content > div:nth-child(3) > table:nth-child(4) > tbody > tr.bg-primary > td").parent().parent().parent());

    // Rule Selection Dropdown Menu
    $("<span>&nbsp;:&nbsp;</span><select id='dao-apply-rule-select'></select>").insertAfter($("#dao-apply-rule-button"));

    // Save current DAO settings as rule button
    $("<div><button class='btn btn-default btn-xs' type='button' id='dao-save-new-rule'>Save Current DAO Settings as New Rule</button></div>").insertAfter($("#dao-apply-rule-select"));

    // Settings Button
    $('<div><button type="button" class="btn btn-default btn-xs" id="dao-rule-edit-button" data-toggle="modal" data-target="#daoRuleModal">View DAO Rules</button><div id="daoRuleModal" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">DAO Rules (click to expand)</h4></div><div class="modal-body" id="daoModalOutput"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div>').insertAfter($("#dao-save-new-rule"));

    // Initialize
    getDaoRules();

    // Once the promise has returned, load the data into the page
    daoRules.then(function(value) {
        daoRules = JSON.parse(value);
        loadDaoRules();
    });

    // BINDINGS
    $("#dao-save-new-rule").click(function() {
        saveNewRule();
    });

    $("#dao-apply-rule-button").click(function() {
        applyRule($("#dao-apply-rule-select").val()); //apply currently selected rule
    });

    function bindModalButtons(){ //this had to be abstracted out because it has to run after the rules have been loaded.
        //bind delete buttons
        var classname = document.getElementsByClassName("delete-dao-rule");

        var myFunction = function() {
            deleteDaoRule(this.getAttribute("data-daoid"));
        };

        for (var i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', myFunction, false);
        }

        //bind delete buttons
        var classname2 = document.getElementsByClassName("panel-title");

        var myFunction2 = function() {
            $(this).parent().next().toggle();
        };

        for (var j = 0; j < classname2.length; j++) {
            classname2[j].addEventListener('click', myFunction2, false);
        }
    }

    // FUNCTIONS
    function saveDaoRules() {
        // save to tampermonkey storage
        GM.setValue("customDaoRules", JSON.stringify(daoRules));
        loadDaoRules();
    }

    function getDaoRules() {
        // get from tampermonkey storage
        daoRules = (GM.getValue("customDaoRules"));
    }

    function deleteDaoRule(ruleID){
        if(confirm("Are you sure you want to delete "+daoRules[ruleID].name+"? This cannot be undone.")){
            delete daoRules[ruleID]
            saveDaoRules();
        }
    }

    function loadDaoRules() {
        // empty the dropdown
        $('#dao-apply-rule-select').find('option').remove();
        // Populate rule dropdown menu
        if($(".panel-group").length > 0){
            $(".panel-group").remove();
        }
        Object.entries(daoRules).forEach(function(element) {
            $('#dao-apply-rule-select').append($('<option>', {
                value: element[0]
            }).text(element[1]["name"]));
            $("#daoModalOutput").append('<div class="panel-group"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">'+element[1]["name"]+'</h4></div><div id="#dao'+element[0]+'" class="panel" style="display:none;"><div class="panel-body"><button class="delete-dao-rule btn btn-danger btn-xs pull-right" data-daoid="'+element[0]+'">Delete Rule: '+element[1]["name"]+'</button><br><br><pre>'+JSON.stringify(element, undefined, 2)+'</pre></div></div></div></div>');
        });
        GM.addStyle('.panel-title { cursor:pointer; }');
        GM.addStyle('.panel-title:hover { font-weight: bold; }');
        bindModalButtons();
    }

    function count(obj) { //count number of values in a JSON object
        var count=0;
        for(var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                ++count;
            }
        }
        return count;
    }


    function applyRule(ruleID) {
        if (confirm("Warning: Applying this rule will automatically overwrite any existing DAO restrictions. You will need to manually re-assign DAO restrictions if you want them back.\n\nDo you want to continue?")) {
            //disable submit button until rule application is complete
            $("button[name='btnSubmit']").prop('disabled', true);

            //get userid from URL
            var parsedUrl = new URL(window.location.href);
            var userid = parsedUrl.searchParams.get("iUserID");

            // Clear all permissions
            killObjPermission(userid, 1, 0, 'prg', true);
            killObjPermission(userid, 2, 0, 'grp', true);
            killObjPermission(userid, 5, 0, 'spon', true);
            killObjPermission(userid, 4, 0, 'fsc', true);
            killObjPermission(userid, 9, 0, 'spVal', true);
            removeAll();
            killObjPermission(userid, 8, 0, 'qst', true);
            killObjPermission(userid, 3, 0, 'sp', true);
            killObjPermission(userid, 6, 0, 'meta01', true);
            killObjPermission(userid, 7, 0, 'meta02', true);

            //Apply rule settings
            //////////////////
            // Program Name //
            //////////////////
            if(daoRules[ruleID]["rules"]["programName"].length > 0){
                if ($("#selPrograms").is(":hidden")) {
                    $('a').filter(function(index) { return $(this).text() === "Program Name:"; }).click();
                }
                    setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#selPrograms").val(daoRules[ruleID]["rules"]["programName"]);
                }, 1000);
            }

            ///////////////////
            // Program Group //
            ///////////////////
            if(daoRules[ruleID]["rules"]["programGroup"].length > 0){
                if ($("#selProgramGroups").is(":hidden")) {
                    $('a').filter(function(index) { return $(this).text() === "Program Group:"; }).click();
                }
                setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#selProgramGroups").val(daoRules[ruleID]["rules"]["programGroup"]);
                }, 1000);
            }

            /////////////
            // Sponsor //
            /////////////
            if(daoRules[ruleID]["rules"]["sponsor"].length > 0){
                if ($("#selSponsors").is(":hidden")) {
                    $('a').filter(function(index) { return $(this).text() === "Sponsor:"; }).click();
                }
                setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#selSponsors").val(daoRules[ruleID]["rules"]["sponsor"]);
                }, 1000);
            }

            //////////////////////
            // Home Institution // WARNING: Only the first school can be loaded. Any additional schools will be ignored.
            //////////////////////
            if(daoRules[ruleID]["rules"]["homeInstitution"].length > 0){
                if(daoRules[ruleID]["rules"]["homeInstitution"].length > 1){
                    alert("Warning: Only one home institution can be loaded by this script, due to Terra Dotta's implementation of the Home Institution DAO widget. Only the first institution will be loaded.");
                }
                if ($("#selInstitutions").is(":hidden")) {
                    $('a').filter(function(index) { return $(this).text() === "Home Institution:"; }).click();
                }
                setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#txtFSCCode").val(daoRules[ruleID]["rules"]["homeInstitution"][0]);
                    popInstitutions('fsc',daoRules[ruleID]["rules"]["homeInstitution"][0]);
                }, 1000);
                setTimeout(function () { //wait 1 second for list to load
                    $("#selInstitutions").val(daoRules[ruleID]["rules"]["homeInstitution"][0]);
                }, 1200);
            }

            ///////////////////////////////
            // Applicant Parameter Value // current issue is that it's an object instead of an array. easier to convert obj to arr? or iterate over obj?
            ///////////////////////////////
            if(count(daoRules[ruleID]["rules"]["applicantParameterValue"]) > 0){
                if ($("#selParamSelVal").is(":hidden")) {
                    $('a').filter(function(index) { return $(this).text() === "Applicant Parameter Value:"; }).click();
                }
                var tempAP_arr = [];
                var tempAPvalue_arr = [];
                for (i in daoRules[ruleID]["rules"]["applicantParameterValue"]) {
                    tempAP_arr.push(i);
                }
                var currParam;
                var myVar = setInterval(applicantParameterPoll, 100);
                function applicantParameterPoll() {
                    if (currParam == null){
                        try {
                            currParam = tempAP_arr.pop();
                        }
                        catch(err) {
                            stopApplicantParameterPolling();
                        }
                    }
                    if (currParam != null){
                        if($("#selParamSel").val()==null || $("#selParamSel").val()!=$('#selParamSel option:contains('+currParam+')').val()){
                            setTimeout(function () { //wait 1 second for list to load
                                $("#selParamSel").val($('#selParamSel option:contains('+currParam+')').val()).change();
                            }, 2000);
                        }
                        if($('#selParamSelVal').has('option').length > 0 && $("#selParamSel").val()==$('#selParamSel option:contains('+currParam+')').val()) {
                            $("#selParamSelVal").val(daoRules[ruleID]["rules"]["applicantParameterValue"][currParam]);
                            setParamValue();
                            currParam = null;
                            if (tempAP_arr.length == 0){
                                stopApplicantParameterPolling();
                            }
                        }
                    }
                }

                function stopApplicantParameterPolling() {
                    clearInterval(myVar);
                    //re-enable submit button
                    $("button[name='btnSubmit']").prop('disabled', false);
                }
            }

            ////////////////////
            // Questionnaires //
            ////////////////////
            if(daoRules[ruleID]["rules"]["questionnaires"].length > 0){
                if ($("#selQuestionnaires").is(":hidden")) {
                    $('a').filter(function(index) { return $(this).text() === "Questionnaires:"; }).click();
                }
                setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#selQuestionnaires").val(daoRules[ruleID]["rules"]["questionnaires"]);
                }, 1000);
            }


            //////////////////////////
            // Applicant Parameters //
            //////////////////////////
            if(daoRules[ruleID]["rules"]["applicantParameters"].length > 0){
                if ($("#selParams").is(":hidden")) {
                    $('a').filter(function(index) { return $(this).text() === "Applicant Parameters:"; }).click();
                }
                setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#selParams").val(daoRules[ruleID]["rules"]["applicantParameters"]);
                }, 1000);
            }

            ///////////
            // CER 1 //
            ///////////
            if(daoRules[ruleID]["rules"]["cer1"].length > 0){
                if ($("#selCDBMeta01").is(":hidden")) {
                    $("a:contains('CER')").click();
                }
                setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#selCDBMeta01").val(daoRules[ruleID]["rules"]["cer1"]);
                }, 1000);
            }


            ///////////
            // CER 2 //
            ///////////
            if(daoRules[ruleID]["rules"]["cer2"].length > 0){
                if ($("#selCDBMeta02").is(":hidden")) {
                    $("a:contains('CER')").click();
                }
                setTimeout(function () { //wait 1 second for list to load
                    // apply rule here
                    $("#selCDBMeta02").val(daoRules[ruleID]["rules"]["cer2"]);
                }, 1000);
            }
        }
    }

    function saveNewRule() {
        // Initialize variables for building the JSON object
        var arr_ProgramName = [];
        var arr_ProgramGroup = [];
        var arr_Sponsor = [];
        var arr_HomeInstitution = [];
        var obj_ApplicantParameterValue = {};
        var arr_Questionnaires = [];
        var arr_ApplicantParameters = [];
        var arr_CER1 = [];
        var arr_CER2 = [];
        var newRuleID;
        var newRuleName;

        //////////////////
        // Program Name //
        //////////////////
        if ($("#selPrograms").is(":visible")) {
            $('#selPrograms').val().forEach(function(element) {
                arr_ProgramName.push(element);
            });
        }
        if ($("#all-prg").is(":visible")) {
            $("#all-prg").children().each(function(index, element) {
                arr_ProgramName.push($(this).attr('id').split("-")[1]);
            });
        }

        ///////////////////
        // Program Group //
        ///////////////////
        if ($("#selProgramGroups").is(":visible")) {
            $('#selProgramGroups').val().forEach(function(element) {
                arr_ProgramGroup.push(element);
            });
        }
        if ($("#all-grp").is(":visible")) {
            $("#all-grp").children().each(function(index, element) {
                arr_ProgramGroup.push($(this).attr('id').split("-")[1]);
            });
        }

        /////////////
        // Sponsor //
        /////////////
        if ($("#selSponsors").is(":visible")) {
            $('#selSponsors').val().forEach(function(element) {
                arr_Sponsor.push(element);
            });
        }
        if ($("#all-spon").is(":visible")) {
            $("#all-spon").children().each(function(index, element) {
                arr_Sponsor.push($(this).attr('id').split("-")[1]);
            });
        }

        //////////////////////
        // Home Institution //
        //////////////////////
        if ($("#selInstitutions").is(":visible")) {
            $('#selInstitutions').val().forEach(function(element) {
                arr_HomeInstitution.push(element);
            });
        }
        if ($("#all-fsc").is(":visible")) {
            $("#all-fsc").children().each(function(index, element) {
                arr_HomeInstitution.push($(this).attr('id').split("-")[1]);
            });
        }

        ///////////////////////////////
        // Applicant Parameter Value //
        ///////////////////////////////
        if ($("#selParamSelVal").is(":visible") && $('#selParamSelVal').has('option').length > 0) {
            var tempArr = [];
            $('#selParamSelVal').val().forEach(function(element) {
                tempArr.push(unescape(element));
            });
            obj_ApplicantParameterValue[$("#selParamSel option:selected").text()] = tempArr;
        }
        if ($("#all-spVal").is(":visible")) {
            $("#all-spVal").children().each(function(index, element) {
                var tempArr = $(this).text().split(":")[1].split(",");
                for (var i = 0; i < tempArr.length; i++) {
                    tempArr[i] = tempArr[i].trim();
                    if (tempArr[i].indexOf(' - remove') !== -1) { // clean up the " - remove" at the end of the last value
                        tempArr[i] = tempArr[i].replace(' - remove', '');
                    }
                    //html encode
                    tempArr[i] = escape(tempArr[i]);
                }
                obj_ApplicantParameterValue[$(this).text().split(":")[0].trim()] = tempArr;
            });
        }

        ////////////////////
        // Questionnaires //
        ////////////////////
        if ($("#selQuestionnaires").is(":visible")) {
            $('#selQuestionnaires').val().forEach(function(element) {
                arr_Questionnaires.push(element);
            });
        }
        if ($("#all-qst").is(":visible")) {
            $("#all-qst").children().each(function(index, element) {
                arr_Questionnaires.push($(this).attr('id').split("-")[1]);
            });
        }

        //////////////////////////
        // Applicant Parameters //
        //////////////////////////
        if ($("#selParams").is(":visible")) {
            $('#selParams').val().forEach(function(element) {
                arr_ApplicantParameters.push(element);
            });
        }
        if ($("#all-sp").is(":visible")) {
            $("#all-sp").children().each(function(index, element) {
                arr_ApplicantParameters.push($(this).attr('id').split("-")[1]);
            });
        }

        ///////////
        // CER 1 //
        ///////////
        if ($("#selCDBMeta01").is(":visible")) {
            $('#selCDBMeta01').val().forEach(function(element) {
                arr_CER1.push(element);
            });
        }
        if ($("#all-meta01").is(":visible")) {
            $("#all-meta01").children().each(function(index, element) {
                arr_CER1.push($(this).attr('id').split("-")[1]);
            });
        }

        ///////////
        // CER 2 //
        ///////////
        if ($("#selCDBMeta02").is(":visible")) {
            $('#selCDBMeta02').val().forEach(function(element) {
                arr_CER2.push(element);
            });
        }
        if ($("#all-meta02").is(":visible")) {
            $("#all-meta02").children().each(function(index, element) {
                arr_CER2.push($(this).attr('id').split("-")[1]);
            });
        }

        // Get timestamp to use as an ID
        var date = new Date();
        newRuleID = date.getTime();

        // Prompt user for a name for the rule
        newRuleName = prompt("Please enter a name for this rule", "My DAO rule");

        if (newRuleName) {
            // Build JSON
            var daoRuleToSave = {
                "name": newRuleName,
                "rules": {
                    "programName": arr_ProgramName,
                    "programGroup": arr_ProgramGroup,
                    "sponsor": arr_Sponsor,
                    "homeInstitution": arr_HomeInstitution,
                    "applicantParameterValue": obj_ApplicantParameterValue,
                    "questionnaires": arr_Questionnaires,
                    "applicantParameters": arr_ApplicantParameters,
                    "cer1": arr_CER1,
                    "cer2": arr_CER2
                }
            } //end json
            daoRules[newRuleID] = daoRuleToSave;
            saveDaoRules();
        } // end if statement
    }
})();
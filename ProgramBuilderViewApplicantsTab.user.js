// ==UserScript==
// @name         Program Builder View Applicants Tab
// @namespace    https://passport.gwu.edu/
// @version      0.2
// @description  Adds a "View Applicants" tab to the Program Builder in TDS, allowing you to search for applicants directly from that program's settings.
// @author       Colin McKenzie
// @match        https://*.edu/index.cfm?FuseAction=ProgramAdmin.*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //add a new "View Applicants" button
    $("#sa_content > div.tabbed-nav.hidden-sm.hidden-xs").append('<marker><button id="viewApps" class="btn btn-primary btn-sm">View Applicants</button></marker>');

    //bind the search panel to the button
    $("#viewApps").click(function(){
        toggleApplicantSearchPanel();
    });

    function toggleApplicantSearchPanel(){
        if ($("#applicantSearchPanel").length == 0){
            loadApplicantSearchPanel();
        } else {
            if($("#applicantSearchPanel").is(":hidden")){
                $("#applicantSearchPanel").show();
            } else {
                $("#applicantSearchPanel").hide();
            }
        }
    }

    function loadApplicantSearchPanel(){
        //get the program ID for the ajax call later. see https://developer.mozilla.org/en-US/docs/Web/API/URL
        var url_string = window.location.href;
        var url = new URL(url_string);
        var progID = url.searchParams.get("Program_ID");

        //create the search panel
        $( "<div id='applicantSearchPanel' class='panel panel-primary'><div class='panel-heading'>View Applicants for Program</div><div class='panel-body'><strong>Select Term:</strong><div id='placeholder_appcycles'>Loading...</div><div style='width:30%; padding-bottom:1em;' id='container_appcycles'></div><button id='customAppSearchBtn' class='btn btn-primary' disabled>View Applications</button></div></div>" ).insertAfter( "#sa_content > div.tabbed-nav.hidden-sm.hidden-xs" );

        //bind the view applications button to the search function
        $("#customAppSearchBtn").click(function(){
            openApplicantSearchResults();
        });

        $('#container_appcycles').load('index.cfm?FuseAction=ProgramAdmin.Requirements&Program_ID=' + progID + ' #map', function(progName) { //load the app cycles via ajax from the requirements tab
            $("#placeholder_appcycles").remove(); //remove the "Loading" text
            $("#customAppSearchBtn").prop( "disabled", false ); //enable the search button
            $(document).ready(function(){cycleInit('map',progID,false,'',false);}); //this is a built-in TD function to fill the dropdown with available app cycles for this program
            $("#map").attr("onchange",""); //remove TD's onchange event
        });
    }

    function openApplicantSearchResults(){
        var progName = $("#sa_content > div.panel.panel-primary.tabbed-nav-header > div > h3 > b").text(); //get the program name
        var progTerm = $("#map").val(); //get the term/year combo (not required-- otherwise will search all terms)
        var encodedProgName = encodeURI(progName); //encode the program name for use in a url
        var searchURL = "index.cfm?FuseAction=StudentAdmin.SearchWizard_3&Program_Name=%27"+encodedProgName+"%27&searchType=simple&Program_Term="+progTerm; //build the url for the search
        window.open(searchURL); //open the search results in a new tab
    }

})();


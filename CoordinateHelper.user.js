// ==UserScript==
// @name         CoordinateHelper
// @namespace    http://powdercake.space/
// @version      0.1
// @description  Automatically splits lat/long into the correct boxes, auto-converts from degrees minutes seconds to decimal, and adds error checking.
// @author       Colin McKenzie
// @match        https://*.edu/index.cfm?FuseAction=SystemSettings.LocationEdit&Location_ID=*
// @match        https://*.edu/index.cfm?FuseAction=SystemSettings.LocationAdd
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $("<div style='display:none;' class='form-group' id='CoordinateHelperStatusPanel'><label class='config-form-label control-label'>CoordinateHelper:</label><div class='config-form-element' id='CoordinateHelperStatus'></div>").insertBefore("#sa_content > form > div > div.panel-body > div:nth-child(6)");

    if($('#ilatitudeEdit').length>0){
        bindCoordinateHelper('edit');
    } else {
        bindCoordinateHelper('add');
    }

    function bindCoordinateHelper(page){
        var latElement;
        var lngElement;
        switch(page) {
            case 'edit':
                latElement = $("#ilatitudeEdit");
                lngElement = $("#ilongitudeEdit");
                break;
            case 'add':
                latElement = $("#iLatitude");
                lngElement = $("#iLongitude");
                break;
        }
        latElement.change(function(){
            parseCoordinateInput(latElement,lngElement);
        });
    }

    function parseCoordinateInput(latElement,lngElement){
        var decimalCoord_regex = /^-*\d{1,2}\.?\d*,\s*-*\d{1,3}\.?\d*$/g;
        var dmsCoord_regex = /°/g;
        var dmsN_regex = /N\s*\d{1,3}°\s*\d{1,2}[′′']\s*\d{1,2}["″]/g;
        var dmsE_regex = /E\s*\d{1,3}°\s*\d{1,2}[′′']\s*\d{1,2}["″]/g;
        var dmsS_regex = /S\s*\d{1,3}°\s*\d{1,2}[′′']\s*\d{1,2}["″]/g;
        var dmsW_regex = /W\s*\d{1,3}°\s*\d{1,2}[′′']\s*\d{1,2}["″]/g;
        var dmsNumbersOnly_regex = /\d{1,3}°\s*\d{1,2}[′′']\s*\d{1,2}["″]/g;
        var dmsDigitStripFinal_regex = /\d\d*\d*/g;
        var input;
        var latitude;
        var longitude;

        switch (true) {
            case decimalCoord_regex.test(latElement.val()): //input matches decimal coordinates e.g. 25.64, -84.49
                input = latElement.val();
                latitude = input.split(",")[0].trim();
                longitude = input.split(",")[1].trim();
                lngElement.val(longitude);
                latElement.val(latitude);
                displayCoordinateConversionResults(input,latitude,longitude);
                break;
            case dmsCoord_regex.test(latElement.val()):
                input = latElement.val();
                var N,S,E,W;
                var dms_string;
                var dms_string_numbers;
                var dms_string_numbers_stripped;
                if (latElement.val().match(dmsN_regex)){
                    dms_string = latElement.val().match(dmsN_regex);
                    dms_string_numbers = dms_string[0].match(dmsNumbersOnly_regex);
                    dms_string_numbers_stripped = dms_string_numbers[0].match(dmsDigitStripFinal_regex);
                    latitude = parseFloat(dms_string_numbers_stripped[0]) + parseFloat(dms_string_numbers_stripped[1])/60 + parseFloat(dms_string_numbers_stripped[2])/3600;
                    latitude = latitude.toPrecision(7);
                }
                if (latElement.val().match(dmsS_regex)){
                    dms_string = latElement.val().match(dmsS_regex);
                    dms_string_numbers = dms_string[0].match(dmsNumbersOnly_regex);
                    dms_string_numbers_stripped = dms_string_numbers[0].match(dmsDigitStripFinal_regex);
                    latitude = parseFloat(dms_string_numbers_stripped[0]) + parseFloat(dms_string_numbers_stripped[1])/60 + parseFloat(dms_string_numbers_stripped[2])/3600;
                    latitude = "-"+latitude.toPrecision(7);
                }
                if (latElement.val().match(dmsE_regex)){
                    dms_string = latElement.val().match(dmsE_regex);
                    dms_string_numbers = dms_string[0].match(dmsNumbersOnly_regex);
                    dms_string_numbers_stripped = dms_string_numbers[0].match(dmsDigitStripFinal_regex);
                    longitude = parseFloat(dms_string_numbers_stripped[0]) + parseFloat(dms_string_numbers_stripped[1])/60 + parseFloat(dms_string_numbers_stripped[2])/3600;
                    longitude = longitude.toPrecision(7);
                }
                if (latElement.val().match(dmsW_regex)){
                    dms_string = latElement.val().match(dmsW_regex);
                    dms_string_numbers = dms_string[0].match(dmsNumbersOnly_regex);
                    dms_string_numbers_stripped = dms_string_numbers[0].match(dmsDigitStripFinal_regex);
                    longitude = parseFloat(dms_string_numbers_stripped[0]) + parseFloat(dms_string_numbers_stripped[1])/60 + parseFloat(dms_string_numbers_stripped[2])/3600;
                    longitude = "-"+longitude.toPrecision(7);
                }
                lngElement.val(longitude);
                latElement.val(latitude);
                displayCoordinateConversionResults(input,latitude,longitude);
                break;
        }
    };

    function displayCoordinateConversionResults(input,latitude,longitude){
        $("#CoordinateHelperStatusPanel").show();
        $("#CoordinateHelperStatus").html("Input <code>"+input+"</code> was converted into Latitude: <code>"+latitude+"</code> and Longitude: <code>"+longitude+"</code>");
        validateCoordinates(latitude,longitude);
    }

    function validateCoordinates(lat,lng){
        if (!(lat >= -90 && lat <= 90)){
            $("#CoordinateHelperStatus").append("<div class='alert alert-danger'><strong>Warning:</strong> <code>"+lat+"</code> is not a valid latitude (must be between -90 and 90). Check your input.</div>");
        }
        if (!(lng >= -180 && lng <= 180)){
            $("#CoordinateHelperStatus").append("<div class='alert alert-danger'><strong>Warning:</strong> <code>"+lng+"</code> is not a valid longitude (must be between -180 and 180). Check your input.</div>");
        }
    }
})();
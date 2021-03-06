
# Terra Dotta User Scripts
Tampermonkey userscripts for use in Terra Dotta Software.

## Disclaimer
These userscripts are not supported or endorsed by Terra Dotta in any way. Use them at your own risk.

## Requirements
You must have the [Tampermonkey extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) installed in the Google Chrome web browser. Scripts may work in Greasemonkey on Firefox with little tweaking, but there are no guarantees.

## Installation
1. Ensure you have the [Tampermonkey extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) installed in Google Chrome.
2. Click on the Installation link below for a script you want to install.
3. Click the Install button.

## Available Scripts
### Table of Contents
1. [DataAccessObjectRules](#DataAccessObjectRules)
2. <a href="#CoordinateHelper">CoordinateHelper</a>
3. [MassCombineQueriesAndReports](#MassCombineQueriesAndReports)
4. [ProgramBuilderViewApplicantsTab](#ProgramBuilderViewApplicantsTab)

### DataAccessObjectRules
<a href="https://github.com/cmckenzie6/TerraDottaUserScripts/raw/master/DataAccessObjectRules.user.js">Install via Tampermonkey</a><br>
<img src="https://raw.githubusercontent.com/cmckenzie6/TerraDottaUserScripts/master/screenshots/view-rules.PNG" width="400"/>
<p>This script adds a panel to the Data Access Objection restriction section of the Edit User Permissions page which allows you to save complicated Data Access Object restrictions as a "rule". For future admin users, you can select your rule and apply it automatically. Rules are saved using the Tampermonkey <a href="https://wiki.greasespot.net/GM.setValue">internal storage</a>, which will persist even after clearing cookies/cache. Every type of DAO is available to save <strong>except multiple home institutions</strong>. Due to how the Home Institution DAO selection was implemented, only a single home institution can be applied by a rule.</p>

#### How to Save a New Rule
1. Set the DAO settings for a user manually and then click <strong>Save Current DAO Settings as New Rule</strong>.
2. Enter a name for your rule and click OK.
<img src="https://raw.githubusercontent.com/cmckenzie6/TerraDottaUserScripts/master/screenshots/save-new-rule.PNG" width="400">

#### How to Apply a Rule
1. Select your rule from the dropdown menu and click <strong>Apply Rule</strong>
<img src="https://raw.githubusercontent.com/cmckenzie6/TerraDottaUserScripts/master/screenshots/apply-rule.PNG" max-width="400">

#### How to Delete a Rule
1. Click the <strong>View DAO Rules</strong> button to see a list of all of your DAO rules. Click on a rule's name to view details.
2. Click the <strong>Delete</strong> button to delete the specified rule.
<img src="https://raw.githubusercontent.com/cmckenzie6/TerraDottaUserScripts/master/screenshots/view-rules.PNG" width="400">

### CoordinateHelper
<a href="https://github.com/cmckenzie6/TerraDottaUserScripts/raw/master/CoordinateHelper.user.js">Install via Tampermonkey</a><br>
<img src="https://raw.githubusercontent.com/cmckenzie6/TerraDottaUserScripts/master/screenshots/CoordinateHelper.PNG" width="400"/>
<p>This script allows you to paste a full coordinate string (in either decimal or degrees/minutes/seconds formats) into the Latitude box when adding or editing a Location. The script will automatically split the latitude and longitude into the appropriate boxes, convert it to decimal (if necessary), and check for out of range errors.</p>
<p>Valid input formats:</p>
<ul><li><code>-34.4396082,150.7188232</code></li><li><code>S 34°25′26″ E 150°53′36″</code></li></ul>

### MassCombineQueriesAndReports
<a href="https://github.com/cmckenzie6/TerraDottaUserScripts/raw/master/MassCombineQueriesAndReports.user.js">Install via Tampermonkey</a><br>
<img src="https://raw.githubusercontent.com/cmckenzie6/TerraDottaUserScripts/master/screenshots/MassCombineQueriesAndReports.PNG" width="400"/>
<p>This script adds an "Auto Combine" button to the Admin Home page that will perform the "combine queries and reports" function for all checked queries and reports. You can check multiple queries and multiple reports. For example, say you have 3 queries for different programs that you need to combine into a STEP report and an insurance report. Simply check the boxes next to each query and report and the script will combine them all for you.</p>

### ProgramBuilderViewApplicantsTab
<a href="https://github.com/cmckenzie6/TerraDottaUserScripts/raw/master/ProgramBuilderViewApplicantsTab.user.js">Install via Tampermonkey</a><br>
<img src="https://github.com/cmckenzie6/TerraDottaUserScripts/blob/master/screenshots/ProgramBuilderViewApplicantsTab.png" alt="drawing" width="400"/>
<p>This script adds a "View Applicants" button to the Program Builder. Clicking on the button will open a panel allowing you to search for applicants on that program. You can optionally select a specific term you want to search for, otherwise it will search all terms.</p>

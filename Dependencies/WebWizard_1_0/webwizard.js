/*
 * JQuery API Documentation:
 *   http://api.jquery.com/ or http://api.jquery.com/category/css/
 *   
 * CSS Documentation:
 *   https://developer.mozilla.org/en-US/docs/Web/CSS/Reference or http://www.w3schools.com/cssref/
 *   
 * JavaScript Documentation:
 *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference or http://www.w3schools.com/jsref/
 *   
 * Chrome Browser Debugging select: Menu > More Tools > Developer Tools
 * From here you can view the and debug by inserting the following into your JavaScript code:
 *   a. alert('Display Alert Box');
 *   b. console.log('Log to the web browser console');
 *   c. debugger;  // Halt execution in the browser debugger, allowing you to view and change variables.
 * 
 * Hook the web wizard into WFO/AppShell:
 * 1. Add the following line into \Impact360\Software\ProductionServer\weblogic\Impact360\ProductionDomain\servers\ProductionServer\tmp\_WL_user\wfoSuite\i590j9\war\ui\index.html
 *    Around line 58, after the jquery script include:
 *    <script src="Dependencies/WebWizard_1_0/webwizard.js"></script>
 * 2. Copy your updated webwizard.js into the \Dependencies\WebWizard_1_0\ subdirectory
 * 3. Refresh your WFO browser to force it to reload your updated code.
 */

// Show Wizard Toast Notification
var wizardtoast = function(x, y, msg) {
     $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + msg + "</h3></div>")
     .css({ display: "block",
         background: "cyan",
         opacity: 0.90,
         position: "fixed",
         padding: "7px",
         "text-align": "center",
         width: "270px",
         left: x,
         top: y})
     .appendTo("body") // TODO Needs to be always on top. attach to document? or callback timer?
     .delay( 1500 ) 
     .fadeOut( 400, function(){
         $(this).remove();
     });
 }

// Show Wizard menu
var wizardmenu = function(x, y, msg) {
     $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + msg + "</h3></div>")
     .css({ display: "block",
         background: "yellow",
         opacity: 0.90,
         position: "fixed",
         padding: "7px",
         "text-align": "center",
         width: "270px",
         left: x,
         top: y })
     .appendTo("body")  // TODO Needs to be always on top. attach to document? or callback timer?
     .delay( 1500 )
     .fadeOut( 400, function(){
         $(this).remove();
     });
}

// Intercept all mouse clicks on body element
$('body').on('click', function(event) {
	
	// Display configuration work flow wizard if CTRL key is held during click
	if (event.ctrlKey === true) {
		// prevent default action of the event from being triggered.
		event.preventDefault();
		  
		// Custom click handler
		var x = ($(window).width() - 284)/2;
		var y = $(window).height()/2;
		// TODO Work flow should be loaded from a JSON file which should include:
		var msg = '<a href="#" onclick="wizardtoast(100, 120, \'Select Recording Management in the Menu\');">Configure Recorder</a></br><a href="#">Configure Archive</a></br><a href="#" onclick="wizardtoast(100, 120, \'Select Risk Management in the Menu\');">Configure Biometrics</a>';
		wizardmenu(x, y , msg);	
	}
});

/*
 * TODO's
 * 
 * 1. Ensure that menu and toast are always displayed on top in WFO/AppShell
 * 2. Update click interceptor to obtains AppShell element id to be used in work flow.  
 * 3. Configuration work flows should be read from a JSON file instead of hard coded.
 *    JSON file should include:
 *    a) Work flow menu items
 *    b) Toast locations
 *    c) Toast text
 *    d) Expected AppShell element click required to move onto next step in work flow.
 *    
 * 4. Make the wizard menu and toast more beautiful.
 * 5. Choose a configuration work flow and add to work flow JSON file. 
 * 
 */

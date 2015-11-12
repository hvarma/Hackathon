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

// TODO Load work flow JSON from file, managing cross domain security issues.
var wizardflows = $.parseJSON('{' +
         '"workflows": [{' +
             '"type": "menuitem",' +				// Configuration work flow menu item
             '"title": "Configure Recorder",' +
             '"steps": [{"step":1},{"step":2}]'+		// List of steps in the configuration work flow
         '},{' +
             '"type": "menuitem",' +
             '"title": "Configure Biometrics",' +
	         '"steps": [{"step":3},{"step":4}]'+
         '},{' +
             '"type": "menuitem",' +
             '"title": "Configure Archive",' +
	         '"steps": [{"step":1},{"step":2}]'+
         '},{' +
	         '"type": "step",' +			// Single Configuration step within a configuration work flow
	         '"id": 1,' +
	         '"title": "Select Recording Management Menu",' +
	         '"x": 100,' +
	         '"y": 120,' +
             '"proceed": {"type":"click","target":{"id": "toast"}}'+ // Condition that must be met to proceed to next step in work flow
         '},{' +
	         '"type": "step",' +
	         '"id": 2,' +
	         '"title": "Select Data Source Settings",' +
	         '"x": 500,' +
	         '"y": 120,' +
             '"proceed": {"type":"click","target":{"id": "toast"}}'+
	     '},{' + 
	         '"type": "step",' +
	         '"id": 3,' +
	         '"title": "Select Risk Management Menu",' +
	         '"x": 100,' +
	         '"y": 120,' +
             '"proceed": {"type":"click","target":{"id": "toast"}}'+
	      '}]' + 
	  '}');

// Show Wizard Toast Notification
var wizardtoast = function(wizardstep) {

    var msg = 'Configuration Complete';
	var x = ($(window).width() - 284)/2;
	var y = $(window).height()/2;
	
	// Configure steps complete
	if (wizardstep !== undefined && wizardstep !== null) { 
	    msg = wizardstep.title;
	    x =  wizardstep.x;
	    y =  wizardstep.y;
	}

	// Display next configuration step
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3 id='toast'>" + msg + "</h3></div>")
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
    .delay( 3000 ) 
    .fadeOut( 400, function(){
        $(this).remove();
    });
}

// Show Wizard menu
var wizardmenu = function(x, y, menu) {
     $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + menu + "</h3></div>")
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

// Populate Work flows Steps
var wizardsteps = [];
for (menuIdx in wizardflows.workflows) {
    if (wizardflows.workflows[menuIdx].type === 'step') {
    	wizardsteps.push(wizardflows.workflows[menuIdx]);
    }
}

// Return the current work flow step
var getwizardstep = function(stepIdx) {
	for (idx in wizardsteps) {
		if (wizardsteps[idx].id === stepIdx) {
			return wizardsteps[idx];
		}
	}
	return null;
}

// Selected work flow and current step in the wizard
var wizardflowselected = -1;
var wizardcurrentstep = -1;

// Handle next step in the wizard
var wizardnextstep = function() {
	
	wizardcurrentstep++;	
	var nextstep = wizardflows.workflows[wizardflowselected].steps[wizardcurrentstep];
	if (nextstep === undefined) {
		wizardtoast(undefined);
		wizardcurrentstep = -1;
	} else {
		wizardtoast(getwizardstep(nextstep.step));
	}
}

// Intercept all mouse clicks on body element
$('body').on('click', function(event) {
	
	// Display configuration work flow wizard if CTRL key is held during click
	if (event.ctrlKey === true) {
		
		// Prevent default action of the event from being triggered.
		event.preventDefault();
		  		
		// Custom click handler
		var x = ($(window).width() - 284)/2;
		var y = $(window).height()/2;

		var menu = '';
		for (menuIdx in wizardflows.workflows) {
		    if (wizardflows.workflows[menuIdx].type === 'menuitem') {
		    	menu += '<a href="#" onclick="wizardflowselected=' + menuIdx + ';wizardcurrentstep=-1;wizardnextstep();">' + wizardflows.workflows[menuIdx].title  + '</a></br>';
		    }
		}
		wizardmenu(x, y , menu);	
	} else {
		// Intercept application clicks to proceed onto the next wizard step
		if (wizardcurrentstep > -1) {
			
			var stepidx = wizardflows.workflows[wizardflowselected].steps[wizardcurrentstep].step;
			var step = getwizardstep(stepidx);
			if (event.type === step.proceed.type) {

				// Iterate target variables that need to be matched and check against event target properties
				var match = true;
				for (var name in step.proceed.target) {
					if (event.target[name] === step.proceed.target[name]) {
						match = true;
					} else {
						match = false;
					}
				}
				if (match === true) {
					wizardnextstep();
				}
			}			
		}
	}
});

/*
 * TODO's
 * 
 * 1. Ensure that menu and toast are always displayed on top in WFO/AppShell
 * 2. Update click interceptor to obtain AppShell element id to be used in work flow. 
 *    when work flow step 'proceed' condition is met, call wizardnextstep() 
 * 3. Make the wizard menu and toast more beautiful.
 * 4. Choose a configuration work flow and add to work flow JSON file. 
 */

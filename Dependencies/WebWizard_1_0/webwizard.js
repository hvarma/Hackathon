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
             '"steps": [{"step":3},{"step":4},{"step":5},{"step":6}]'+		// List of steps in the configuration work flow
         '},{' +
             '"type": "menuitem",' +
             '"title": "Configure Biometrics",' +
	         '"steps": [{"step":1},{"step":2}]'+
         '},{' +
             '"type": "menuitem",' +
             '"title": "Configure Archive",' +
	         '"steps": [{"step":1},{"step":2}]'+
         '},{' +
	         '"type": "step",' +			// Single Configuration step within a configuration work flow
	         '"id": 1,' +
	         '"title": "Select Risk Management Menu",' +
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
	         '"title": "Open the Menu",' +
	         '"x": 100,' +
	         '"y": 120,' +
             '"proceed": {"type":"click","target":{"className": "as-navdrawer-img"}}'+
    	 '},{' + 
	         '"type": "step",' +
	         '"id": 4,' +
	         '"title": "Hover over Recording Management and select DATA SOURCES Settings",' +
	         '"x": 200,' +
	         '"y": 200,' +
             '"proceed": {"type":"click","target":{"outerText": "Settings"}}'+
         '},{' + 
	         '"type": "step",' +
	         '"id": 5,' +
	         '"title": "Create a new Data Source",' +
	         '"x": 1300,' +
	         '"y": 620,' +
             '"proceed": {"type":"click","target":{"id": "toast"}}'+
         '},{' + 
	         '"type": "step",' +
	         '"id": 6,' +
	         '"title": "Select xxx",' +
	         '"x": 600,' +
	         '"y": 620,' +
             '"proceed": {"type":"click","target":{"id": "toast"}}'+
	      '}]' + 
	  '}');

// Show Wizard configuration Notification
var wizardtoast = function(wizardstep) {
		
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' id='divtoast'><h3 id='toast'>" + wizardstep.title + "</h3></div>")
    .css({ display: "block",
         background: "#FFFF00",
         opacity: 0.90,
         position: "fixed",
         padding: "7px",
         "text-align": "center",
         "z-index": "130010",		// Higher that the WFO navigation bar of 130000
         width: "270px",
         left: wizardstep.x,
         top: wizardstep.y})
    .appendTo("body")
    .fadeOut(0)
    .fadeIn(500, function() {
       // Animation complete.
    }); 
}

// Show Wizard configuration flow complete Notification
var wizardflowcomplete = function() {
	
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' id='divtoast'><h3 id='toast'>Configuration Complete</h3></div>")
    .css({ display: "block",
         background: "#FFFF00",
         opacity: 0.90,
         position: "fixed",
         padding: "7px",
         "text-align": "center",
         "z-index": "19020",		// Higher that the WFO navigation bar of 19000 & 19020
         width: "270px",
         left: ($(window).width() - 284)/2,
         top: $(window).height()/2})
    .appendTo("body")
    .fadeOut(0)
    .fadeIn(500, function() {
       // fadeIn Complete
    })    
    .delay(3000)
    .fadeOut(400, function(){
        $(this).remove();
    });
}

// Show Wizard menu
var wizardmenu = function(x, y, menu) {
	
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' id='divwizmenu'><h3>" + menu + "</h3></div>")
     .css({ display: "block",
         background: "#0C99C9",
         opacity: 0.90,
         position: "fixed",
         padding: "7px",
         "text-align": "center",
         width: "270px",
         left: x,
         top: y })
     .appendTo("body")
     .fadeOut(0)
     .fadeIn(300, function() {
        // fadeIn Complete
     })    
}

// Populate Work flows Steps
var wizardsteps = [];
for (menuIdx in wizardflows.workflows) {
    if (wizardflows.workflows[menuIdx].type === 'step') {
    	wizardsteps.push(wizardflows.workflows[menuIdx]);
    }
}

// Return the current step from the current wizard flow
var getwizardflowstep = function() {
	return wizardflows.workflows[wizardflowselected].steps[wizardcurrentstep];
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
	
	// Remove menu if displayed
	$('#divwizmenu').remove();
	
	// Remove any existing toast
	$('#divtoast').remove();

	// Move onto the next toast in the work flow
	wizardcurrentstep++;	
	var nextstep = getwizardflowstep();
	if (nextstep === undefined) {
		wizardflowcomplete();
		wizardcurrentstep = -1;
	} else {
		wizardtoast(getwizardstep(nextstep.step));
	}
}

//Wizard click intercept handler
var wizardclickhandler = function(event) {
	
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
		    	menu += '<a style="color:white;text-decoration:none" href="#" onclick="wizardflowselected=' + menuIdx + ';wizardcurrentstep=-1;wizardnextstep();">' + wizardflows.workflows[menuIdx].title  + '</a></br>';
		    }
		}
		wizardmenu(x, y , menu);	
	} else {
		
		if (console !== undefined) console.log(event);

		// Remove menu if displayed
		$('#divwizmenu').remove();

		// Intercept application clicks to proceed onto the next wizard step
		if (wizardcurrentstep > -1) {
			
			var step = getwizardstep(getwizardflowstep().step);
			if (event.type === step.proceed.type) {
				
				// Iterate target variables that need to be matched and check against event target properties
				var match = true;
				for (var name in step.proceed.target) {
					if (event.target[name].indexOf(step.proceed.target[name]) > -1) {
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
};

// Intercept all mouse clicks on all body elements
var wizardclickhook = function() {
	
	var handlerattached = false;

	// Query $._data(element,'events') to retrieve the events that are attached to element.	
	var bodyevents = $._data($('body').get(0),'events');
	if (bodyevents != undefined) {
		$.each(bodyevents.click, function(evtguid, funcobj) {
		    // Check if wizardclickhandler is already attached to body element
			if (funcobj.handler === wizardclickhandler) {
		    	handlerattached = true;
		    }
		});
	}
	
	console.log('Wizard attach click hook bodys:' + $('body').length + ' iframes:' + $('iframe').length);
	
	// If the wizard click handler is not already attached, attach it
	if (handlerattached === false) {
		$('body').on('click', wizardclickhandler);
	}
			
	setTimeout(function() {
		wizardclickhook();
	}, 2000);
}
wizardclickhook();

/*
 * TODO's
 * 1. Handle wizard click interceptor with body elements nested in iframes such as the Data Source Settings Screen.
 * 2. Make the wizard menu and toast more beautiful.
 * 3. Choose a configuration work flow and add to work flow JSON file.
 * 
 * Additionally required for productization
 * a. Encapsulate wizard code inside JavaScript object name space.
 * b. Allow toast notification locations be to determined relative to target UI item. 
 * c. Implement a more sophisticated proceed algorithm to use a CSS selector expression.
 * d. Update the code to read the JSON work flow configuration from the host web server. 
 * e. Consider creating a UI for the creation of the JSON work flow configuration.
 * f. Add additional configuration work flows.
 */

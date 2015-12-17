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
 * DOM and Event Documentation:
 *   http://www.w3schools.com/jsref/dom_obj_event.asp 
 *   
 * HTML charecter codes:
 *   http://www.ascii.cl/htmlcodes.htm
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

var WEBWIZ = {

	// TODO Load work flow JSON from file, managing cross domain security issues.
	wizflows: $.parseJSON('{' +
         '"workflows": [{' +
             '"type": "menuitem",' +				// Configuration work flow menu item
             '"title": "Configure Data Source",' +
             '"steps": [{"step":3},{"step":4},{"step":5},{"step":6},{"step":7},{"step":8},{"step":9},{"step":10}]'+		// List of steps in the configuration work flow
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
             '"proceed": {"type":"mousedown","target":{"id": "toast"}}'+ // Condition that must be met to proceed to next step in work flow
         '},{' +
	         '"type": "step",' +
	         '"id": 2,' +
	         '"title": "Select Data Source Settings",' +
	         '"x": 500,' +
	         '"y": 120,' +
             '"proceed": {"type":"mousedown","target":{"id": "toast"}}'+
	     '},{' + 
	         '"type": "step",' +
	         '"id": 3,' +
	         '"title": "Open the Menu",' +
	         '"x": 100,' +
	         '"y": 120,' +
             '"proceed": {"type":"mousedown","target":{"className": "as-navdrawer-img"}}'+
    	 '},{' + 
	         '"type": "step",' +
	         '"id": 4,' +
	         '"title": "Hover over Recording Management </br> &#8226;  Select DATA SOURCES Settings",' +
	         '"x": 200,' +
	         '"y": 200,' +
             '"proceed": {"type":"mousedown","target":{"outerText": "Settings"}}'+
         '},{' + 
	         '"type": "step",' +
	         '"id": 5,' +
	         '"title": "Create a new Data Source",' +
	         '"x": 1300,' +
	         '"y": 620,' +
             '"proceed": {"type":"mousedown","target":{"outerText": "Create Data Source"}}'+
         '},{' + 
	         '"type": "step",' +
	         '"id": 6,' +
	         '"title": "Select Phone type and Cisco Unified Call Manager Switch type</br> &#8226; Press Select",' +
	         '"x": 1200,' +
	         '"y": 400,' +
             '"proceed": {"type":"mousedown","target":{"id": "toolbar_CREATE_NEW_DSLabel"}}'+
         '},{' + 
	         '"type": "step",' +
	         '"id": 7,' +
	         '"title": "Enter your data source name",' +
	         '"x": 850,' +
	         '"y": 250,' +
             '"proceed": {"type":"keydown","target":{"id": "dataSourceName"}}' +
         '},{' + 
	         '"type": "step",' +
	         '"id": 8,' +
	         '"title": "Enter a data source description",' +
	         '"x": 850,' +
	         '"y": 290,' +
             '"proceed": {"type":"keydown","target":{"id": "description_0"}}' +
         '},{' + 
	         '"type": "step",' +
	         '"id": 9,' +
	         '"title": "Check Associated Integration Service Installations </br> &#8226; Your Recorder Integration Service",' +
	         '"x": 850,' +
	         '"y": 600,' +
             '"proceed": {"type":"mousedown","target":{"name": "checkedID"}}' +
         '},{' + 
	         '"type": "step",' +
	         '"id": 10,' +
	         '"title": "Select Save",' +
	         '"x": 1200,' +
	         '"y": 700,' +
             '"proceed": {"type":"mousedown","target":{"outerText": "Save"}}'+
         '}]' + 
	  '}'),

	// Selected work flow and current step in the wizard
	flowselected: -1,
    currentstep: -1,

	// MainWindow and wizard steps
    mainWin: null,
	wizsteps: [],

	// Initialize web wizard with this web application
	initialize: function(mainWindow) {
		
		// Save application main document window
		if (WEBWIZ.mainWin === null) {
			WEBWIZ.mainWin = mainWindow;
		}
		
		// Populate Work flows Steps
		for (var menuIdx in WEBWIZ.wizflows.workflows) {
    		if (WEBWIZ.wizflows.workflows[menuIdx].type === 'step') {
    			WEBWIZ.wizsteps.push(WEBWIZ.wizflows.workflows[menuIdx]);
    		}
		}
		
		// Add event listners to every <body> of every <iframe>
		WEBWIZ.wizhookevents();	
	},
		
	// Intercept all mouse/key down on all body elements
	wizhookevents: function() {
		
		var handlerattached = false;
	
		// Use $._data(element,'events') to retrieve existing events attached to the element.	
		var bodyevents = $._data($('body')[0],'events');
		if (bodyevents !== undefined) {
			// Iterate each attached mousedown event handler
			$.each(bodyevents.mousedown, function(evtguid, funcobj) {
				// Check if wizeventhandler is already attached to element
				if (funcobj.handler === WEBWIZ.wizeventhandler) {
					handlerattached = true;
				}
			});
		}
			
		// If the wizard mousedown handler is not already attached, attach it
		if (handlerattached === false) {
			$('body').on('mousedown', WEBWIZ.wizeventhandler);
			$('body').on('keydown', WEBWIZ.wizeventhandler);
			WEBWIZ.wizlog('Wizard attach event hooks to bodys:' + $('body').length);
		}
		
		WEBWIZ.wizeventhookiframes(WEBWIZ.mainWin.document);
				
		setTimeout(function() {
			WEBWIZ.wizhookevents();
		}, 1000);
	},
	
	// Handle next step in the wizard
	wiznextstep: function() {
		
		// Remove menu if displayed
		$('#divwizmenu').remove();
		
		// Remove any existing toast
		$('#divtoast').remove();
	
		// Move onto the next toast in the work flow
		WEBWIZ.wizcurrentstep++;	
		var nextstep = WEBWIZ.getwizflowstep();
		if (nextstep === undefined) {
			WEBWIZ.wizflowcomplete();
			WEBWIZ.wizcurrentstep = -1;
		} else {
			WEBWIZ.wiztoast(WEBWIZ.getwizstep(nextstep.step));
		}
	},
	
	// Wizard mouse/key down intercept handler
	wizeventhandler: function(event) {
		
		// Display configuration work flow wizard if CTRL key is held during mouse down
		if (event.ctrlKey === true && event.shiftKey === false && event.type === 'mousedown') {
			
			// Prevent default action of the event from being triggered.
			event.preventDefault();
					
			// Custom event handler
			var x = ($(window).width() - 284)/2;
			var y = $(window).height()/2;
	
			var menu = '';
			for (var menuIdx in WEBWIZ.wizflows.workflows) {
				if (WEBWIZ.wizflows.workflows[menuIdx].type === 'menuitem') {
					menu += '<a style="color:white;text-decoration:none" href="#" onmousedown="WEBWIZ.wizflowselected=' + menuIdx + ';WEBWIZ.wizcurrentstep=-1;WEBWIZ.wiznextstep();">' + WEBWIZ.wizflows.workflows[menuIdx].title  + '</a></br>';
				}
			}
			WEBWIZ.wizmenu(x, y , menu);
		
		// Display record events wizard menu
		} else if (event.ctrlKey === true && event.shiftKey === true && event.type === 'mousedown') {

			// Prevent default action of the event from being triggered.
			event.preventDefault();

			// Custom event handler
			var x = ($(window).width() - 284)/2;
			var y = $(window).height()/2;
	
			var recordmenu = 'Start New Recording\nShow Recorded Steps';
	
			WEBWIZ.wizrecordmenu(x, y, recordmenu);
		
		} else {
			
			if (event.ctrlKey === true) return;
			
			WEBWIZ.wizlog(event);
	
			// Remove menu if displayed
			$('#divwizmenu').remove();
			
			// Intercept application mousedown to proceed onto the next wizard step
			if (WEBWIZ.wizcurrentstep > -1) {
				
				var step = WEBWIZ.getwizstep(WEBWIZ.getwizflowstep().step);
				if (event.type === step.proceed.type) {
					
					// Iterate target variables that need to be matched and check against event target properties
					// All event target properties must be matched in AND comparison
					var match = true;
					for (var name in step.proceed.target) {
						if (event.target[name] !== undefined && event.target[name].indexOf(step.proceed.target[name]) > -1) {
							match = true;
						} else {
							match = false;
						}
					}
					if (match === true) {
						WEBWIZ.wiznextstep();
					}
				}			
			}
		}
	},
	
	// Add mouse/key down event listener to all nested iframe document elements
	wizeventhookiframes: function(myEle) {
	
		// Iterate each iframe nested in myEle
		$.each($(myEle).find("iframe"), function() {
	
			try {
				var iframedoc = $(this)[0].contentWindow.document; // may need to change this depending on browser
				var iframebody = $(iframedoc).find("body");
		
				var handlerattached = false;
				
				// Use $._data(element,'events') to retrieve existing events attached to the element.	
				var iframebodyevents = $._data(iframebody[0],'events');
				if (iframebodyevents !== undefined && iframebodyevents.mousedown !== undefined) {
					$.each(iframebodyevents.mousedown, function(evtguid, funcobj) {
						// Check if wizardeventhandler is already attached to element
						if (funcobj.handler === WEBWIZ.wizeventhandler) {
							handlerattached = true;
						}
					});
				} 
				
				// If event handler is not attached to iframe, attach it
				if (handlerattached === false) {
					$(iframebody).on('mousedown', WEBWIZ.wizeventhandler);
					$(iframebody).on('keydown', WEBWIZ.wizeventhandler);
					WEBWIZ.wizlog('Attached event handler to iframe id:' + this.id + ' body element');
				}
			
				// Recursivly call to hook into nested iframes 
				WEBWIZ.wizeventhookiframes(iframedoc);
			} catch(err) {
				// Ignore undefined exception race condition if iframe created but body does not yet exist
				// Handler attach will be retried next timeout
				WEBWIZ.wizlog('wizeventhookiframes.' + err);
			}
			
		});
	},	
	
	// Return the current step from the current wizard flow
	getwizflowstep: function() {
		return WEBWIZ.wizflows.workflows[WEBWIZ.wizflowselected].steps[WEBWIZ.wizcurrentstep];
	},

	// Return the current work flow step
	getwizstep: function(stepIdx) {
		for (var idx in WEBWIZ.wizsteps) {
			if (WEBWIZ.wizsteps[idx].id === stepIdx) {
				return WEBWIZ.wizsteps[idx];
			}
		}
		return null;
	},

	// Log only if console is available
	wizlog: function(obj) {
		if (window.console) {
			console.log(obj);
		}
	},

	// Show Wizard configuration Notification
	wiztoast: function(wizardstep) {
		$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' id='divtoast'><h3 id='toast'>" + wizardstep.title + "</h3></div>")
		.css({ display: "block",
			background: "#0C99C9",
			border: "2px solid black",
			"border-radius": "10px",
			"box-shadow": "10px 10px 5px #888888",
			opacity: 0.90,
			position: "fixed",
			padding: "7px",
			"text-align": "center",
			color:"white",
			"z-index": "130010",		// Higher that the WFO navigation bar of 130000
			width: "270px",
			left: wizardstep.x,
			top: wizardstep.y})
		.appendTo("body")
		.fadeOut(0)
		.fadeIn(500, function() {
		// Animation complete.
		});
	},

	// Show Wizard configuration flow complete Notification
	wizflowcomplete: function() {
		
		$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' id='divtoast'><h3 id='toast'>Configuration Complete</h3></div>")
		.css({ display: "block",
			background: "#0C99C9",
			border: "2px solid black",
			"border-radius": "10px",
			"box-shadow": "10px 10px 5px #888888",
			opacity: 0.90,
			position: "fixed",
			padding: "7px",
			"text-align": "center",
			"z-index": "19020",		// Higher that the WFO navigation bar of 19000 & 19020
			color:"white",
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
	},
	
	// Show Wizard menu
    wizmenu: function(x, y, menu) {
	
		$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' id='divwizmenu'><h3>" + menu + "</h3></div>")
		.css({ display: "block",
			background: "#0C99C9",
			border: "2px solid black",
			"border-radius": "10px",
			"box-shadow": "10px 10px 5px #888888",
			opacity: 0.90,
			position: "fixed",
			padding: "7px",
			"text-align": "center",
			color:"white",
			width: "270px",
			left: x,
			top: y })
		.appendTo("body")
		.fadeOut(0)
		.fadeIn(300, function() {
			// fadeIn Complete
		})    
	},
	
	// Show Wizard Record menu
    wizrecordmenu: function(x, y, recordmenu) {
		
		$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all' id='divwizmenu'><h3>" + recordmenu + "</h3></div>")
		.css({ display: "block",
			background: "#0C99C9",
			border: "2px solid black",
			"border-radius": "10px",
			"box-shadow": "10px 10px 5px #888888",
			opacity: 0.90,
			position: "fixed",
			padding: "7px",
			"text-align": "center",
			color:"white",
			width: "270px",
			left: x,
			top: y })
		.appendTo("body")
		.fadeOut(0)
		.fadeIn(300, function() {
			// fadeIn Complete
		})    
	}
	
	
}

// Hook the web wizard into this web application
WEBWIZ.initialize(this);

/*
 * Notes.
 * 1. The event interception in this project can also be used to track and report user workflows 
 *    independently of the wizard.
 *    This could be used to track useability / common work flows used by verints customers.
 *    
 * 2. The event interception in this project can also be used to create a user inteface for creating 
 *    the wizard flows, allowing wizard flows to be created or updated without requiring any coding skills.
 * 
 * Next Steps for Productization
 *   a. Allow toast notification locations be to determined relative to target UI item. 
 *   b. Implement a more sophisticated proceed algorithm to use a CSS selector expression.
 *   c. Consider creating a UI for the creation of the JSON work flow configuration. 
 *      i)  This should include CRUD of wizard workflows and steps.
 *      ii) Ability to identify an element to proceed to next step in workflow by simply selecting it.
 *      The two items above will greatly reduce the cost of having to manually code steps and element 
 *      identification that is assoicated with the high cost of developing RAF automation actions.
 *  
 *   d. Update the code to read the JSON work flow configuration from the host web server.
 */

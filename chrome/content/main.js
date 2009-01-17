
// Make a namespace.
if (typeof CenturionTimer == 'undefined') {
  var CenturionTimer = {};
}

/**
 * UI controller that is loaded into the main player window
 */
CenturionTimer.Controller = {

  /**
   * Called when the window finishes loading
   */
  onLoad: function() {

    // initialization code
    this._initialized = true;
    this._strings = document.getElementById("centurion-timer-strings");
    
    // Perform extra actions the first time the extension is run
    if (Application.prefs.get("extensions.centurion-timer.firstrun").value) {
      Application.prefs.setValue("extensions.centurion-timer.firstrun", false);
      this._firstRunSetup();
    }

  },
  

  /**
   * Called when the window is about to close
   */
  onUnLoad: function() {
    this._initialized = false;
  },
  

  /**
   * Perform extra setup the first time the extension is run
   */
  _firstRunSetup : function() {
	// Do nothing (yet)
  },
  
      
    
};

window.addEventListener("load", function(e) { CenturionTimer.Controller.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CenturionTimer.Controller.onUnLoad(e); }, false);

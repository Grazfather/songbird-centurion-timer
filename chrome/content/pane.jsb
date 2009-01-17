
// Make a namespace.
if (typeof CenturionTimer == 'undefined') {
  var CenturionTimer = {};
 }

CenturionTimer.PaneController = {
/*
	Game = {
		var duration;
		var frequency;
		var players;
		var starttime;
		var shotsdown;
	};*/
  /**
   * Called when the pane is instantiated
   */
  onLoad: function() {
    this._initialized = true;
    
    // Make a local variable for this controller so that
    // it is easy to access from closures.
    var controller = this;
    // Hook up the action button
    this._startButton = document.getElementById("start-button");
    this._startButton.addEventListener("command", 
         function() { controller.startGame(); }, false);
	this._pauseButton = document.getElementById("pause-button");
    this._pauseButton.addEventListener("command", 
         function() { controller.pauseGame(); }, false);
	this._stopButton = document.getElementById("stop-button");
    this._stopButton.addEventListener("command", 
         function() { controller.stopGame(); }, false);
	this._extendButton = document.getElementById("extend-button");
    this._extendButton.addEventListener("command", 
         function() { controller.extendGame(); }, false);
  },
  
  /**
   * Called when the pane is about to close
   */
  onUnLoad: function() {
	alert(1);
    this._initialized = false;
  },

  /**
   * Start the game using the defined settings
   */
  startGame : function() {
    alert(1);
	Game.duration=document.getElementById("duration-box").value
	Game.frequency=document.getElementById("frequency-box").value
	Game.players=document.getElementById("players-box").value
  },
  
  /**
   * Pause the timer, pause the music
   */
  pauseGame : function() {
	alert('Pause');
  },
  
  /**
   * Game over early
   */
  stopGame : function() {
	alert('Stop');
  },
  
  /**
   * Add 15 minutes or so
   */
  extendGame : function() {
	alert('Extend');
  },
  
  setGame : function(var game) {
    if (game != 0) {
	 document.getElementById("duration-box").value=game;
	 document.getElementById("frequency-box").value="60";
	}
  }
};

window.addEventListener("load", function(e) { CenturionTimer.PaneController.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CenturionTimer.PaneController.onUnLoad(e); }, false);

// Make a namespace.
if (typeof CenturionTimer == 'undefined') {
  var CenturionTimer = {};
}

function Game()
{
	this.players;
	this.duration;
	this.frequency;
	this.playlist;
	this.started = 0;
	this.consumed = 0;
}
//methods for our Student class
Game.prototype.setup = function(players, duration, frequency, playlist)
{
	this.players = players;
	this.duration = duration;
	this.frequency = frequency;
	this.playlist = playlist;
}

Game.prototype.start = function()
{
	//this.started = 1;
	alert("strd");
}
Game.prototype.pause = function()
{
	alert("pause");
}
Game.prototype.stop = function()
{
	alert("stop");
}
Game.prototype.extend = function()
{
	alert("extend");
}

Game.prototype.inProgress = function()
{
	return (this.start != 0);
}


/**
 * Controller for pane.xul
 */
CenturionTimer.PaneController = {


  /**
   * Called when the pane is instantiated
   */
  onLoad: function() {
    this._initialized = true;
	this._game = new Game();
    // Make a local variable for this controller so that
    // it is easy to access from closures.
    var controller = this;
    
    // Hook up the action buttons
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
	// Hook up the radio buttons
	
	this._game1 = document.getElementById("game1");
    this._game1.addEventListener("command", 
         function() { controller.setGame(100); }, false);
	this._game2 = document.getElementById("game2");
    this._game2.addEventListener("command", 
         function() { controller.setGame(60); }, false);
	this._game3 = document.getElementById("game3");
    this._game3.addEventListener("command", 
         function() { controller.setGame(30); }, false);
	this._game4 = document.getElementById("game3");
    this._game4.addEventListener("command", 
         function() { controller.setGame(30); }, false);
	this._customGame = document.getElementById("customGame");
    this._customGame.addEventListener("command", 
         function() { controller.setGame(0); }, false);
		 
	this.defaultGames = [[100, 60],[60,60],[30,60],[20,30]];
  },
  
  /**
   * Called when the pane is about to close
   */
  onUnLoad: function() {
    this._initialized = false;
  },
    /**
   * Start the game using the defined settings
   */
   
  startGame: function() {
	if (this._game.inProgress() != 0)
	{
		this._game.setup(document.getElementById("players-box").value,
						 document.getElementById("duration-box").value,
						 document.getElementById("frequency-box").value,
						 document.getElementById("playlist-select").value);
		this._game.start();
		document.getElementById("start-button").disabled="true";
	}
	else
	{
		alert('oops');
	}
  },
  
  /**
   * Pause the timer, pause the music
   */
  pauseGame: function() {
	this._game.pause();
  },
  
  /**
   * Game over early
   */
  stopGame: function() {
	this._game.stop();
  },
  
  /**
   * Add 15 minutes or so
   */
  extendGame: function() {
	this._game.extend();
  },
  
  
  setGame: function(game) {
    if (game != 0) {
	 document.getElementById("duration-box").value=this.defaultGames[(game-1)][0];
	 document.getElementById("frequency-box").value=this.defaultGames[(game-1)][1];
	}

  }
  
};

window.addEventListener("load", function(e) { CenturionTimer.PaneController.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CenturionTimer.PaneController.onUnLoad(e); }, false);
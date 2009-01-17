
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
	this.started = false;
	this.consumed = 0;
	this.paused = false;
	var gMM = Components.classes["@songbirdnest.com/Songbird/Mediacore/Manager;1"]
						.getService(Components.interfaces.sbIMediacoreManager); 
}
//methods for our Student class
Game.prototype.setup = function(players, duration, frequency, playlist)
{
	this.players = players;
	this.duration = duration;
	this.frequency = frequency;
	if (!playlist)
	{
		this.playlist = 0;
	}
	else
	{
		this.playlist = playlist;
	}
}

Game.prototype.start = function()
{
	this.started = true;
	alert(this.players+" "+this.duration+" "+this.frequency+" "+this.playlist);
}

Game.prototype.pause = function()
{
	this.paused = true;
	alert("pause");
}

Game.prototype.resume = function()
{
	this.paused = false;
	alert("resume");
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
	return (this.started != 0);
}

Game.prototype.isPaused = function()
{
	return (this.paused != 0);
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
         function() { controller.setGame(1); }, false);
	this._game2 = document.getElementById("game2");
    this._game2.addEventListener("command", 
         function() { controller.setGame(2); }, false);
	this._game3 = document.getElementById("game3");
    this._game3.addEventListener("command", 
         function() { controller.setGame(3); }, false);
	this._game4 = document.getElementById("game4");
    this._game4.addEventListener("command", 
         function() { controller.setGame(4); }, false);
	this._customGame = document.getElementById("customGame");
    this._customGame.addEventListener("command", 
         function() { controller.setGame(0); }, false);
		 
	this.defaultGames = new Array(4);
	this.defaultGames[0] = [100, 60];
	this.defaultGames[1] = [60, 60];
	this.defaultGames[2] = [30, 60];
	this.defaultGames[3] = [20, 30];
	
	//Load up playlists
	var pls = document.getElementById("playlist-select");
	var pl = document.createElement("listitem");
	pl.setAttribute("value", 1);
	pl.setAttribute("label", "PL1");
	pls.appendChild(pl);
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
	if (this._game.inProgress() == 0 ) // if the game hasn't started yet.
	{
		this._game.setup(document.getElementById("players-box").value,
						 document.getElementById("duration-box").value,
						 document.getElementById("frequency-box").value,
						 document.getElementById("playlist-select").value);
		this._game.start();
		document.getElementById("start-button").setAttribute("disabled","true");
		document.getElementById("pause-button").setAttribute("disabled","false");
		document.getElementById("stop-button").setAttribute("disabled","false");
		document.getElementById("extend-button").setAttribute("disabled","false");
	}
	else if (this._game.isPaused() == 1) // Game is started but paused
	{
		this._game.resume();
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
	if (this._game.isPaused() == 0) // Game is started and running
	{
		this._game.pause();
		document.getElementById("start-button").setAttribute("disabled","false");
	}
	else // Game is paused
	{
		this._game.resume();
		document.getElementById("start-button").setAttribute("disabled","true");
	}
  },
  
  /**
   * Game over early
   */
  stopGame: function() {
	this._game.stop();
	document.getElementById("start-button").setAttribute("disabled","false");
	document.getElementById("pause-button").setAttribute("disabled","true");
	document.getElementById("stop-button").setAttribute("disabled","true");
	document.getElementById("extend-button").setAttribute("disabled","true");
  },
  
  /**
   * Add 15 minutes or so
   */
  extendGame: function() {
	this._game.extend();
  },
  
  
  setGame: function(game) {
    if (game != 0) {
		document.getElementById("duration-box").disabled="true";
		document.getElementById("frequency-box").disabled="true";
		document.getElementById("duration-box").value = this.defaultGames[(game-1)][0];
		document.getElementById("frequency-box").value = this.defaultGames[(game-1)][1];
		//document.getElementById("duration-box").setAttribute("value",this.defaultGames[(game-1)][0]);
		//document.getElementById("frequency-box").setAttribute("value",this.defaultGames[(game-1)][1]);

	}
	else // custom game selected
	{
		document.getElementById("duration-box").setAttribute("disabled","false");
		document.getElementById("frequency-box").setAttribute("disabled","false");
	}

  }
  
};

window.addEventListener("load", function(e) { CenturionTimer.PaneController.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CenturionTimer.PaneController.onUnLoad(e); }, false);
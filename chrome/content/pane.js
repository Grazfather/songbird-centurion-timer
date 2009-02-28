/**
 * Centurion Timer
 * Created by: Graziano Misuraca
 * e-mail: grazfather@gmail.com
 * 
 * pane.js: Handles interface interaction and game properties.
 */

// Make sure we have the javascript modules we're going to use  
var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
var Cr = Components.results;

if (!window.SBProperties)   
  Cu.import("resource://app/jsmodules/sbProperties.jsm");  
if (!window.LibraryUtils)   
  Cu.import("resource://app/jsmodules/sbLibraryUtils.jsm");  

// Messages used in observer
UPDATE_CONSUMED = 0;
FINISH_GAME = 1;
FORCE_SHUFFLE = 2;
  
// Make a namespace.
if (typeof CenturionTimer == 'undefined') {
  var CenturionTimer = {};
}

function Game() {
	this.players = 0;
	this.duration;
	this.frequency;
	this.playlist;
	this.shots = 0;
	this.started = false;
	this.consumed = 0;
	this.paused = false;
	this.timer;
	this.mm;
	this.mediaview;
	this.shuffle = false;
	this.preindex = 0;
	this.index = 0;
	this.observers = [];

}
//methods for our Game class
Game.prototype.setup = function(parent, players, duration, frequency, playlistguid, shuffle) {
	this.players = parseInt(players);
	this.duration = duration;
	this.frequency = frequency;
	this.consumed = 0;
	this.mm = Cc["@songbirdnest.com/Songbird/Mediacore/Manager;1"]
			.getService(Components.interfaces.sbIMediacoreManager);
	if (!playlistguid || playlistguid == 0)
	{
		this.playlist = 0;
		this.media = LibraryUtils.mainLibrary;
		this.mediaview = this.media.createView();
		shuffle = true;
		this.notifyObservers(FORCE_SHUFFLE, 0);
	}
	else
	{
		this.playlist = playlistguid;
		this.media = LibraryUtils.mainLibrary.getMediaItem(this.playlist);
		this.mediaview = this.media.createView();
	}
	
	if (shuffle)
	{
		this.shuffle = true;
		this.index = parseInt(Math.random() * (this.mediaview.length - 1));
		this.preindex = this.index;
	}
	else
	{
		this.shuffle = false;
		this.index = 0;
		this.preindex = 0;
	}
}

Game.prototype.start = function() {
	var self = this;
	this.started = true;
	this.timer = window.setInterval(function() { self.drink(); }, 1000);
	this.mm.sequencer.playView(this.mediaview, this.index);
	this.consumed += this.players;
	this.notifyObservers(UPDATE_CONSUMED, this.consumed);
	this.shots = 1;
}

Game.prototype.pause = function() {
	this.paused = true;
	this.mm.playbackControl.pause();
}

Game.prototype.resume = function() {
	this.paused = false;
	this.mm.playbackControl.play();
}

Game.prototype.stop = function() {
    this.started = false;
	this.mm.playbackControl.stop();
	window.clearInterval(this.timer);
	this.notifyObservers(UPDATE_CONSUMED, 0);
}
Game.prototype.extend = function() {
	this.duration = parseInt(this.duration)+15;
}

Game.prototype.inProgress = function() {
	return (this.started != 0);
}

Game.prototype.isPaused = function() {
	return (this.paused != 0);
}

Game.prototype.drink = function() {
	if (this.mm.playbackControl.position >= (this.frequency*1000))
	{
		this.shots += 1;
		this.consumed += this.players;
		
		this.notifyObservers(UPDATE_CONSUMED, this.consumed);
		
		if ( this.shots < this.duration )
		{
			this.preindex = this.index;
			if (this.shuffle)
			{
				while (this.index == this.preindex)
				{
					this.index = parseInt(Math.random() * (this.mediaview.length - 1));
				}
			}
			else
			{
				this.preindex = this.index
				this.index = ( this.index + 1 ) % this.mediaview.length
			}
			this.mm.sequencer.playView(this.mediaview, this.index);
		} else {
			// Game is complete!
			this.mm.sequencer.stop();
			this.notifyObservers(FINISH_GAME, null);
		}
	}
}

Game.prototype.register = function(listener) {
	this.observers.push(listener);
}

Game.prototype.unregister = function(listener) {
	this.observers = this.observers.filter(
		function(el) {
			if ( el !== listener ) {
				return el;
			}
		}
	);
}

Game.prototype.notifyObservers = function(msg, data) {
	this.observers.forEach(
		function(el) {
			el.notify(msg, data);
		}
	);
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
	this._stopButton = document.getElementById("end-button");
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
		 	 
	// Default game settings
	this.defaultGames = new Array(4);
	this.defaultGames[0] = [100, 60];
	this.defaultGames[1] = [60, 60];
	this.defaultGames[2] = [30, 60];
	this.defaultGames[3] = [20, 30];
	
	//Load up playlists
	controller.playlistHandling();
	},
	
	// Taken from MorningPeeps by Yves Van Goethem
	playlistHandling : function() {
        var that = this;
        var playlists = [];
        var bt_shuffle = document.getElementById('shuffle-check');
        var menulist = document.getElementById('playlist-select');
	
		(getSongbirdPlaylists = function() {
			var propArray = Cc["@songbirdnest.com/Songbird/Properties/MutablePropertyArray;1"]
						 .createInstance(Ci.sbIMutablePropertyArray);
			propArray.appendProperty(SBProperties.isList, "1"); // Is a playlist
			propArray.appendProperty(SBProperties.hidden, "0"); // Isn't hidden
			var libraryItems = LibraryUtils.mainLibrary.getItemsByProperties(propArray);
			var enumerator = libraryItems.enumerate();
			var i = 0;
			while (enumerator.hasMoreElements()) {
				var enumeratorItem = enumerator.getNext();
				var guid = enumeratorItem.toString().substring(17, 53);
				var item = LibraryUtils.mainLibrary.getMediaItem(guid);
				playlists.push(item.name+'::x0::'+guid);
				i++;
			}
		})();
		
		(setPlaylists = function() {
            playlists  = playlists.toString().split(',');
            var labels = [];
            var guids  = [];
            var selected = null;
            var createMenuItem = function(label, guid, param) {
                var menuitem = document.createElement('listitem');
                menuitem.setAttribute('label', label);
                menuitem.setAttribute('value', guid);
                menulist.appendChild(menuitem);
                if (param) {
                    selected = true;
                    menulist.parentNode.selectedIndex = param;
                }
            };
            for (i = 0; i < playlists.length; i++) {
                playlist = playlists[i].split('::x0::');
                labels.push(playlist[0]);
                guids.push(playlist[1]);
            }
            for (i = 0; i < labels.length; i++) {
                if (i == 0) {
                    // Do nothing
                }
                else if (that._status 
                && guids[i].toString() == that._playlistOptions.toString()) {
                    createMenuItem(labels[i], guids[i], i);                    
                }
                else {
                    createMenuItem(labels[i], guids[i]);
                }
            }
            if (!selected) {
                menulist.parentNode.selectedIndex = 0;
                //bt_shuffle.setAttribute('disabled', true);
                selected = null;
            }    
            
        })();
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
			//Register as a game observer
			this._game.register(this);
			
			this._game.setup(this,
							 document.getElementById("players-box").value,
							 document.getElementById("duration-box").value,
							 document.getElementById("frequency-box").value,
							 document.getElementById("playlist-select").value,
							 document.getElementById("shuffle-check").checked);
			this._game.start();
			document.getElementById("start-button").setAttribute("disabled","true");
			document.getElementById("pause-button").setAttribute("disabled","false");
			document.getElementById("end-button").setAttribute("disabled","false");
			document.getElementById("extend-button").setAttribute("disabled","false");
			document.getElementById("players-box").setAttribute("disabled","true");
			document.getElementById("frequency-box").setAttribute("disabled","true");
			document.getElementById("duration-box").setAttribute("disabled","true");
			document.getElementById("game-choose").setAttribute("disabled","true");
			document.getElementById("playlist-select").setAttribute("disabled","true");
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
		//Deregister as a game observer
		this._game.unregister(this);
	  
		this._game.stop();
		document.getElementById("start-button").setAttribute("disabled","false");
		document.getElementById("pause-button").setAttribute("disabled","true");
		document.getElementById("end-button").setAttribute("disabled","true");
		document.getElementById("extend-button").setAttribute("disabled","true");
		document.getElementById("players-box").removeAttribute("disabled");
		document.getElementById("game-choose").removeAttribute("disabled");
		document.getElementById("playlist-select").removeAttribute("disabled");
		if ( document.getElementById("customGame").selected == true ) {
			document.getElementById("frequency-box").removeAttribute("disabled");
			document.getElementById("duration-box").removeAttribute("disabled");
		}
	},
  
	finishGame: function(players, consumed, duration, frequency) {
		this.stopGame();
		time = (duration*frequency/60);
		timeminutes = parseInt(duration*frequency/60);
		timeseconds = (time-timeminutes)*60;
		window.openDialog('finished.xul', '', 'chrome=yes, centerscreen=yes, resizable=no', players, consumed, timeminutes, timeseconds);
	},
  
	/**
	 * Add 15 minutes or so
	 */
	extendGame: function() {
		alert("Adding 15 more shots!");
		document.getElementById("duration-box").value = parseInt(this._game.duration)+15;
		this._game.extend();
	},
  
	setGame: function(game) {
		if (game != 0) {
			document.getElementById("duration-box").disabled="true";
			document.getElementById("frequency-box").disabled="true";
			document.getElementById("duration-box").value = this.defaultGames[(game-1)][0];
			document.getElementById("frequency-box").value = this.defaultGames[(game-1)][1];
		}
		else // custom game selected
		{
			document.getElementById("duration-box").removeAttribute("disabled");
			document.getElementById("frequency-box").removeAttribute("disabled");
		}
	},
  
	updateConsumed: function(consumed) {
		document.getElementById("consumed-text").setAttribute("value","Alcohol consumed (oz.): " + consumed);
	},
  
	notify: function(msg, data) {
		switch(msg)
		{
			case UPDATE_CONSUMED:
			{
				this.updateConsumed(data);
				break;
			}
			case FINISH_GAME:
			{
				this.finishGame(this._game.players, this._game.consumed, this._game.duration, this._game.frequency);
				break;
			}
			case FORCE_SHUFFLE:
			{
				document.getElementById("shuffle-check").setAttribute("checked","true");
				break;
			}
			default:
			{
				alert("Bad notification");
				break;
			}
		}
	}
    
};

window.addEventListener("load", function(e) { CenturionTimer.PaneController.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CenturionTimer.PaneController.onUnLoad(e); }, false);
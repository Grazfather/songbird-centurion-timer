# News #
  * Dec 11, 2009: Updated to 0.2.3
  * Jun 14, 2009: Updated to 0.2.2
  * Feb 27, 2009: Updated to 0.2.1 [Get it here](http://addons.songbirdnest.com/addon/1442).
  * Feb 14, 2009: Updated to 0.2.0 You can [get it here](http://addons.songbirdnest.com/xpis/3150?source=download) but you should use the newest version.
  * Feb 8, 2009: Version 0.1.0 has been released for Songbird! You can [get it here](http://addons.songbirdnest.com/xpis/3112?source=download) but you should use the newest version.


# Introduction #

Welcome to the project wiki for the centurion timer.

The centurion timer is a simple add-on for [Songbird](http://www.getsongbird.com) that makes it easy to keep track of a game of centurion, power hour, or any drinking game (hell, any game for that matter) that has an event (i.e. a shot) a specific period of time for a specific amount of iteration (i.e. A shot a minute for 100 minutes).


# Details #

Most important functionality is working properly, including custom games, playing from a playlist, shuffle and replaying a playlist (if it's too short).

There are a couple known bugs, nothing critical though:
  * If a song's total duration is less than the length of time between shots, it will play to completion, and the timer won't fire until the NEXT song reaches the correct point. If it is the last song in the playlist that is too short, the game will stall.
  * If no playlist is selected/Entire Library is selected, and shuffle is unchecked, it will play shuffled regardless. This is because a songbird library is technically **unordered.**
  * Only looks good in the bottom content pane.
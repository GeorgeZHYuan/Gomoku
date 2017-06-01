#pragma strict

// Class for the Ai
class GomokuAi {

// Variables
	public var isWhite : boolean;
	public var aiLevel : int;
	
	private var recursionDepth : int;
	private var ownColor : Occupation;
	private var enemyColor : Occupation;
	
	private var scanList = {};
	private var outList = {};

// Contructors
	public function GomokuAi (){
		aiLevel = 1;
		isWhite = true;
	}
	public function GomokuAi (_GomokuAi : GomokuAi){
		aiLevel = _GomokuAi.aiLevel;
		isWhite = _GomokuAi.isWhite;
	}
	public function GomokuAi (_aiLevel : int, _isWhite : boolean){
		aiLevel = _aiLevel;
		isWhite = _isWhite;
	}
	
	
// Manual Setup Funcitons
	public function setGomokuAi (_aiLevel : int, _isWhite : boolean){
		aiLevel = _aiLevel;
		isWhite = _isWhite;
	}
	public function setLevel (_aiLevel : int) {
		aiLevel = _aiLevel;
		if (aiLevel >= 3) {
			recursionDepth = 1;
			aiLevel = 3;
		}
		else if (aiLevel < 3) {
			aiLevel = 1;
			recursionDepth = 1;
		}
	}
	public function setColor (_isWhite : boolean) {
		if (_isWhite == true){
			ownColor = Occupation.white;
			enemyColor = Occupation.black;
		}
		else {
			ownColor = Occupation.black;
			enemyColor = Occupation.white;
		}
	}
	
	
// Setup funciton needed for the Ai' decsions in finding a move to make
	// tell the ai what level it is and how hard it should try
	private function initializeAi (theBoard : GomokuBoard, whitesTurn : boolean, level : int) {
		setColor (whitesTurn);
		setLevel (level);
	}
								
// Ai makes a decision for it's next move
	// Choose to block or build its own plan
	public function chooseMove (theBoard : GomokuBoard, whitesTurn : boolean, level : int) {
		var bestMove : Coordinate = new Coordinate ();
		initializeAi (theBoard, whitesTurn, level);
		updateLists (theBoard.lastMoveMade, theBoard, scanList, outList);
		
		var score : double = -Mathf.Infinity;
		if (ownColor == Occupation.black) score = Mathf.Infinity;
		var newScore : double;
		
				
		for(var nextNode in scanList){
			var location = new Coordinate (nextNode.Value);
			if (ownColor == Occupation.white){
				theBoard.coordinates [location.x, location.y].setPiece (ownColor);
				var newList = new Boo.Lang.Hash (scanList);
				newList.Remove(generateKey(location));
				newScore = findBestScore (newList, outList, theBoard, location, recursionDepth-1, -Mathf.Infinity, Mathf.Infinity, ownColor);
				if (newScore >= score) {
					score = newScore;
					bestMove.setCoordinates (location);
				}
				theBoard.coordinates [location.x, location.y].clearSpot();
			}
			else {
				theBoard.coordinates [location.x, location.y].setPiece (ownColor);
				var newList2 = new Boo.Lang.Hash (scanList);
				newScore = findBestScore (newList2, outList, theBoard, location, recursionDepth-1, -Mathf.Infinity, Mathf.Infinity, ownColor);
				if (newScore <= score) {
					score = newScore;
					bestMove.setCoordinates (location);
				}
				theBoard.coordinates [location.x, location.y].clearSpot();		
			}
		}
		
		if (aiLevel < 3){
			var rand = Random.value*100;
			if (rand < (3-aiLevel)*15) {
				while (true){
					var spare = new Coordinate ((Random.value*100)%19, (Random.value*100)%19);
					if (scanList.ContainsKey(generateKey (spare))){
						bestMove.setCoordinates (spare);
						break;
					}
				}
			}
		}
		updateLists (bestMove, theBoard, scanList, outList);
				
		return bestMove;
	}
	
	function findBestScore (_scanningList : Boo.Lang.Hash, _outtedList : Boo.Lang.Hash, _theBoard : GomokuBoard, _location : Coordinate, depth : int, a : double, b : double, playerColor : Occupation) : double {
		var scanningList = new Boo.Lang.Hash (_scanningList);
		var outtedList = new Boo.Lang.Hash (_outtedList);
		var theBoard = new GomokuBoard (_theBoard);
		var theLocation = new Coordinate (_location);
		
		var scoreCount = new Array ();
		scoreCount.push (findChain(theLocation ,theBoard, 1, 0));
		scoreCount.push (findChain(theLocation ,theBoard, 0, 1));
		scoreCount.push (findChain(theLocation ,theBoard, 1, 1));
		scoreCount.push (findChain(theLocation ,theBoard, -1, 1));
		
		var scoreSelf : double = calculateScore (scoreCount);
		var scoreOpponent : double = findEnemyPotenialScore (theLocation, theBoard);
		if (aiLevel > 2) scoreOpponent *= 0.9;
		var currentScore : double = scoreSelf - (scoreOpponent*0.9);
		
//Debug.Log ("put a " + playerColor + " piece at " + theLocation.x + ", " + theLocation.y + " depth of " + depth);
		
		if (depth == 0 || currentScore >= 1000000000 || currentScore <= -1000000000) {
//Debug.Log ("at a terminal end with score: " + currentScore + ". " + scoreSelf + "/" + scoreOpponent);

			return currentScore;
		}
		else {
			var score : double;
			var newScore : double;
			if (ownColor == Occupation.white){
				score = -Mathf.Infinity;
				for(var nextNode in scanningList){
					var location = new Coordinate (nextNode.Value);
					theBoard.coordinates [location.x, location.y].setPiece (ownColor);
					var newList = new Boo.Lang.Hash (scanningList);
					newList.Remove(generateKey(location));
					updateLists(location, theBoard, newList, outtedList);
					newScore = findBestScore (newList, outtedList, theBoard, location, depth-1, -Mathf.Infinity, Mathf.Infinity, enemyColor);
					score = max (score, newScore);
					a = max (a, score);
					if (b <= a) break;
					theBoard.coordinates [location.x, location.y].clearSpot();
				}
			}
			else {
				score = Mathf.Infinity;
				for(var nextNode2 in scanningList){
					var location2 = new Coordinate (nextNode2.Value);
					theBoard.coordinates [location2.x, location2.y].setPiece (ownColor);
					var newList2 = new Boo.Lang.Hash (scanningList);
					newList2.Remove(generateKey(location));
					updateLists(location, theBoard, newList2, outtedList);
					newScore = findBestScore (newList2, outtedList, theBoard, location2, depth-1, -Mathf.Infinity, Mathf.Infinity, enemyColor);
					score = min(score, newScore);
					b = min (b, score);
					if (b <= a) break;
					theBoard.coordinates [location2.x, location2.y].clearSpot();
				}	
			}
			return score;
		}
		
	}
	
	public function findEnemyPotenialScore (_current : Coordinate, _theBoard : GomokuBoard) {
		var theBoard : GomokuBoard = new GomokuBoard (_theBoard);
		var current : Coordinate = new Coordinate (_current);
		var pebbleChain = new Array ();
		var playerColor : Occupation = theBoard.coordinates[current.x, current.y].getState();
		var opponentColor : Occupation = Occupation.black;
		if (playerColor == Occupation.black) opponentColor = Occupation.white;
			
		theBoard.coordinates[current.x, current.y].clearSpot();
		theBoard.coordinates[current.x, current.y].setPiece(opponentColor);
		
		pebbleChain.push (findChain(current ,theBoard, 1, 0));
		pebbleChain.push (findChain(current ,theBoard, 0, 1));
		pebbleChain.push (findChain(current ,theBoard, 1, 1));
		pebbleChain.push (findChain(current ,theBoard, -1, 1));
		
		return calculateScore (pebbleChain);;
	}
	
	public function calculateScore (pebbleChain : Array){
		var totalScore : double = 0;
		var blockedFour : int = 0;
		var unblockedThree : int = 0;
		var color : Occupation;
		
		for (var i = 0; i < pebbleChain.length; i++){
			var theChain : PieceChain = new PieceChain (pebbleChain[i]);
			theChain.determineChainType ();
			var curScore : double = 0;
			if (i == 0) color = theChain.ownColor;

			if (theChain.length > 4){
				curScore += 1000000000;
			}
			else if (theChain.length == 4){
				if (theChain.state == ChainState.unblocked) curScore += 100000000;
				if (theChain.state == ChainState.blocked) {
					curScore += 500000;
					blockedFour++;
				}
			}
			else if (theChain.length == 3){
				if (theChain.state == ChainState.unblocked) {
					curScore += 400000;
					unblockedThree ++;
				}
				else if (theChain.state == ChainState.blocked) {
					curScore += 1500;
				}
			}
			else if (theChain.length == 2){
				if ((theChain.state == ChainState.unblocked)) curScore += 1200;
				else if (theChain.state == ChainState.blocked) curScore += 100;
			}
			else if (theChain.length == 1) {
				if ((theChain.state == ChainState.unblocked)) curScore += 2;
				else if (theChain.state == ChainState.blocked) curScore += 1;
			}
			if (aiLevel > 1){
				if (theChain.detached) curScore *= 3/4;
			}
			totalScore += curScore;
			
		}
		if (blockedFour > 1){
			totalScore = totalScore - (2*500000) + 100000000;
		}
		else if (blockedFour > 0 && unblockedThree > 0){
			totalScore = totalScore - 400000 - 500000 + 10000000;
		}
		else if (unblockedThree > 1){
			totalScore = totalScore - (2*400000) + 1000000;
		}
		
		if (color == Occupation.black) totalScore *= -1;
		return totalScore;
	}
	
	private function findChain (current : Coordinate, _theBoard : GomokuBoard, xI : int, yI : int){
		var theBoard : GomokuBoard = new GomokuBoard (_theBoard);
		var cur_Coord : Coordinate = new Coordinate (current);
		var playerColor : Occupation = theBoard.coordinates [cur_Coord.x, cur_Coord.y].getState ();
		var opponnentColor : Occupation = Occupation.black;
		if (playerColor == Occupation.black) opponnentColor = Occupation.white;
		
		var pieceChain : PieceChain = new PieceChain ();
		
		pieceChain.ownColor = playerColor;
		pieceChain.enemyColor = opponnentColor;
		pieceChain.length = 0;

		if (theBoard.coordinates[cur_Coord.x, cur_Coord.y].getState() != playerColor) return pieceChain;
		for (var i = 0; i < 2; i++){
			cur_Coord.setCoordinates (current);
			if (i == 1){
				xI *= -1;
				yI *= -1;
				pieceChain.length--;
			}
			while (true) {
				if ((cur_Coord.x < 0 || cur_Coord.y < 0 || cur_Coord.x > 18 || cur_Coord.y > 18) ||
					theBoard.coordinates[cur_Coord.x, cur_Coord.y].getState() == opponnentColor){
					if (i == 0) pieceChain.positiveCap.setCap (cur_Coord, opponnentColor);
					else pieceChain.negativeCap.setCap (cur_Coord, opponnentColor);
					break;
				}
				else if (theBoard.coordinates [cur_Coord.x, cur_Coord.y].getState () == Occupation.none){
					if ((cur_Coord.x+xI >= 0 && cur_Coord.y+yI >= 0 && cur_Coord.x+xI <= 18 && cur_Coord.y+yI <= 18) && 
						theBoard.coordinates [cur_Coord.x+xI, cur_Coord.y+yI].getState () == playerColor && !pieceChain.detached) {
						pieceChain.neutralCap.setCap (cur_Coord, Occupation.none);
						cur_Coord.increment (xI, yI);
						pieceChain.detached = true;
					}
					else {
						if (i == 0) pieceChain.positiveCap.setCap (cur_Coord, Occupation.none);
						else pieceChain.negativeCap.setCap (cur_Coord, Occupation.none);
						break;
					}
				}
				else {
					pieceChain.length++;
					cur_Coord.increment (xI, yI);
				}
			}
		}
		return pieceChain;
	}
	
	public function updateLists (_currentLocation : Coordinate, _theBoard : GomokuBoard, theScanList : Boo.Lang.Hash, theOutList : Boo.Lang.Hash){
		var currentLocation = new Coordinate (_currentLocation);
		var theBoard = new GomokuBoard (_theBoard);
		
		var northBorder = new Coordinate ();
		var southBorder = new Coordinate ();
		var fieldSize : int = 1;
		
		if (theScanList.ContainsKey(generateKey(currentLocation))){
			theScanList.Remove(generateKey(currentLocation));
		}
		if (!theOutList.ContainsKey(generateKey(currentLocation))){
			theOutList.Add(generateKey(currentLocation), currentLocation);		
		}
		
		for (var i = fieldSize; i >= 0; i--) {
			if (currentLocation.x + i < theBoard.size) {
				northBorder.x = currentLocation.x + i;
				break;
			}
		}
		for (i = fieldSize; i >= 0; i--) {
			if (currentLocation.y + i < theBoard.size) {
				northBorder.y = currentLocation.y + i;
				break;
			}
		}
		for (i = fieldSize; i >= 0; i--) {
			if (currentLocation.x - i >= 0) {
				southBorder.x = currentLocation.x - i;
				break;
			}
		}
		for (i = fieldSize; i >= 0; i--) {
			if (currentLocation.y - i >= 0) {
				southBorder.y = currentLocation.y - i;
				break;
			}
		}
		for (var y = southBorder.y; y <= northBorder.y; y++) {
			for (var x = southBorder.x; x <= northBorder.x; x++) {
				var location = new Coordinate (x,y);
				if (theBoard.coordinates [x,y].getState() == Occupation.none) {
					if (!theOutList.ContainsKey(generateKey(location))) {
						theScanList.Add(generateKey(location), location);
						theOutList.Add(generateKey(location), location);
					}
				}
				else {
					if (!theOutList.ContainsKey(generateKey(location))) {
						theOutList.Add(generateKey(location), location);
					}
				}
			}
		}
	}
	
	function generateKey (location : Coordinate) {		
		return location.y*19 + location.x;
	}
	
	function max (a : double, b : double){
		if (b >= a) return b;
		else return a;
	}
	
	function min (a : double, b : double){
		if (b <= a) return b;
		else return a;
	}
}
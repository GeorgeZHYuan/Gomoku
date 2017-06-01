#pragma strict

public class CoordinateDetectorInfo {
	public var coordinates : Coordinate = new Coordinate ();
	public var state : Occupation;
	
	public function CoordinateDetectorInfo (spare : CoordinateDetectorInfo) {
		coordinates.setCoordinates(spare.coordinates);
		state = spare.state;
	}
	public function CoordinateDetectorInfo (numberX : int, numberY : int, spotState : Occupation) {
		coordinates.x = numberX;
		coordinates.y = numberY;
		state = spotState;
	}
}

public class BoardCoordinate {
	private var stateOfSpot : Occupation;
	
	public function clearSpot (){
		stateOfSpot = Occupation.none;
	}
	
	public function setPiece (state : Occupation){
		if (stateOfSpot == Occupation.none){
			stateOfSpot = state;
		}
	}
	
	public function getState () {
		return stateOfSpot;
	}
}

public class GomokuBoard {
	public var coordinates : BoardCoordinate [,];
	public var lastMoveMade : Coordinate = new Coordinate();
	public var size : int;
	
	public var spacesLeft : int;
	
	public function GomokuBoard () {
		size = 19;
		spacesLeft = size*size;
		coordinates = new BoardCoordinate [size,size];
		for (var i = 0; i < size; i++){
			for (var j = 0; j < size; j++){
				coordinates[i,j] = new BoardCoordinate ();
				coordinates[i,j].clearSpot();
			}
		}
	}
	
	public function GomokuBoard (theBoard : GomokuBoard) {
		size = 19;
		spacesLeft = size*size;
		coordinates = new BoardCoordinate [size,size];
		for (var i = 0; i < size; i++){
			for (var j = 0; j < size; j++){
				coordinates[i,j] = new BoardCoordinate ();
				coordinates[i,j].setPiece(theBoard.coordinates[i,j].getState());
			}
		}
		spacesLeft = theBoard.spacesLeft;
		lastMoveMade = theBoard.lastMoveMade;
	}
	
	public function updateBoard (theObject : CoordinateDetectorInfo) {
		var theInfo : CoordinateDetectorInfo = new CoordinateDetectorInfo (theObject);
		coordinates[theInfo.coordinates.x, theInfo.coordinates.y].setPiece(theInfo.state);
		lastMoveMade.setCoordinates (theInfo.coordinates);
		spacesLeft--;
	}
	
	public function setEndGame (){
		spacesLeft = 0;
		endOfGame();
	}
	
	public function endOfGame () {
		if (spacesLeft < 1){
			return true;
		}
		return false;
	}
	
	public function showBoardArray (){
		for (var y = 0; y < size; y++){
			for (var x = 0; x < size; x++){
				if (coordinates[x,y].getState() == Occupation.none){
					Debug.Log(x + " " + y + " none");
				}
				else if (coordinates[x,y].getState() == Occupation.black){
					Debug.Log(x + " " + y + " black");
				}
				else{
					Debug.Log(x + " " + y + " white");
				}	
			}
		}
	}
}
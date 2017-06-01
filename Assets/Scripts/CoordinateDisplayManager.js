#pragma strict
public var columnNumber : int;
public var rowNumber : int;

private var blackPiece : GameObject;
private var whitePiece : GameObject;

public var hostCoordinate : GameObject;
public var stateOfSpot : Occupation;

function Awake () {
	blackPiece = this.gameObject.transform.Find("BlackPiece").gameObject;
	whitePiece = this.gameObject.transform.Find("WhitePiece").gameObject;
}

function removePiece (){
	whitePiece.renderer.enabled = false;
	blackPiece.renderer.enabled = false;
	stateOfSpot = Occupation.none;
}


function placePiece (placeWhite : boolean) {
	// Debug.Log("got the message");
	if (stateOfSpot == Occupation.none){
		if (placeWhite){
			whitePiece.renderer.enabled = true;
			stateOfSpot = Occupation.white;
		}else {
			blackPiece.renderer.enabled = true;
			stateOfSpot = Occupation.black;
		}
		var info : CoordinateDetectorInfo = new CoordinateDetectorInfo(columnNumber, rowNumber ,stateOfSpot);
		hostCoordinate.SendMessageUpwards("update_theBoard", info, SendMessageOptions.RequireReceiver);
	}
}

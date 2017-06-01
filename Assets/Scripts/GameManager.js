#pragma strict

public var theBoard : GomokuBoard = new GomokuBoard ();
public var computerAi : GomokuAi = new GomokuAi ();

public var whitesTurn : boolean = false;
public var players : Player [];

public var gameStart : boolean;
public var gameOver : boolean;
public var canMove : boolean;

private var aiLevel : int;
private var theTime : float = 0;
private	var userName : String = "";
private	var theScore : int;
private var aiName : String = "";
private var endMessage : String = "";
private var submitted : boolean;
private var enteringNewScore : boolean;
private var highScores : boolean;

private var hard : boolean = false;
private var med : boolean = false;
private var easy : boolean = false;
private var highScoreList = new Array();
private var padding : int = 0;
private var temp : String;

private var showAccount : boolean;

private var searchName : String = "George";

function  Awake () {
	for (var i = 0; i < 2; i++){
		players[i] = new Player ();
	}
	submitted = false;
	gameStart = true;
	gameOver = false;
	canMove = false;
	players[1].isHuman = false;
	enteringNewScore = false;
	highScores = false;
	showAccount = false;
}

function OnGUI() {

	if(highScores){
		 GUI.Box(Rect(Screen.width/2 - 150, Screen.height/2 - (Screen.height/3)/2 - 100 , 300, 400),"\nHighscores");
		 GUI.Box(Rect(Screen.width/2 - 150, Screen.height/2 - (Screen.height/3)/2 - 100 , 300, 400),"\nHighscores");
//		 
//		if (GUI.Button(Rect(Screen.width/2 - 140, Screen.height/2 - (Screen.height/3)/2 - 40, 80, 20),"Easy Ai")){
//			hard = false;
//			med = false;
//			easy = true;
//		}
//		if (GUI.Button(Rect(Screen.width/2 - 40, Screen.height/2 - (Screen.height/3)/2 - 40, 80, 20),"Medium Ai")){
//			hard = false;
//			med = true;
//			easy = false;
//		}
//		if (GUI.Button(Rect(Screen.width/2 + 60, Screen.height/2 - (Screen.height/3)/2 - 40, 80, 20),"Hard Ai")){
//			hard = true;
//			med = false;
//			easy = false;
//		}
		userName = GUI.TextArea (Rect (Screen.width/2 - 75, Screen.height/2 - (Screen.height/3)/2 + 25 + 75, 100, 20), userName, 200);
		if (GUI.Button(Rect(Screen.width/2 + 30, Screen.height/2 - (Screen.height/3)/2 + 25 + 75, 55, 20),"Find")){
			if (PlayerPrefs.HasKey(userName)){
				searchName = userName;
			}
		}
		
		GUI.Box(Rect(Screen.width/2 - 80, Screen.height/2 - (Screen.height/3)/2 + 10, 160, 20), "current account info");
		GUI.Box(Rect(Screen.width/2 - 60, Screen.height/2 - (Screen.height/3)/2 + 50, 120, 20), searchName + " score:" + PlayerPrefs.GetInt(searchName));
			
		
		 
		if (GUI.Button(Rect(Screen.width/2 - 40, Screen.height/2 - (Screen.height/3 - 530)/2, 80, 20),"Back")){
			gameStart = true;
			highScores = false;
		}
	}
	
	if(gameStart){
		GUI.Box(Rect(Screen.width/2 - 100, Screen.height/2 - (Screen.height/3)/2 , 200, 200),"\nGomoku");
		GUI.Box(Rect(Screen.width/2 - 100, Screen.height/2 - (Screen.height/3)/2 , 200, 200),"\nGomoku");
		 
		GUI.Box(Rect(Screen.width/2 - 50, Screen.height/2 - (Screen.height/3)/2 + 50, 100, 20),"Choose level");
		if (GUI.Button(Rect(Screen.width/2 - 50, Screen.height/2 - (Screen.height/3)/2 + 80, 20, 20),"1")){
			aiName = "Easy Ai";
			aiLevel = 1;
		 	canMove = true;
		 	gameStart = false;
		}
		if (GUI.Button(Rect(Screen.width/2 - 10, Screen.height/2 - (Screen.height/3)/2 + 80, 20, 20),"2")){
		 	aiName = "Medium Ai";
		 	aiLevel = 2;
		 	canMove = true;
		 	gameStart = false;
		}
		if (GUI.Button(Rect(Screen.width/2 + 30, Screen.height/2 - (Screen.height/3)/2 + 80, 20, 20),"3")){
		 	aiName = "Hard Ai";
		 	aiLevel = 3;
		 	canMove = true;
		 	gameStart = false;
		}
		
		if (GUI.Button(Rect(Screen.width/2 - 40, Screen.height/2 - (Screen.height/3)/2 + 120, 80, 20),"Highscores")){
				gameStart = false;
				highScores = true;
		}
		 
		if (GUI.Button(Rect(Screen.width/2 - 40, Screen.height/2 - (Screen.height/3)/2 + 160, 80, 20),"quit")){
		 	Application.Quit();
		}
	}

	if(gameOver && !enteringNewScore){
		var winner = "Black";
		if (!whitesTurn) winner = "White";
		GUI.Box(Rect(Screen.width/2 - 100, Screen.height/2 - (Screen.height/3)/2 , 200, 200), "\n" + winner + " wins!");
		GUI.Box(Rect(Screen.width/2 - 100, Screen.height/2 - (Screen.height/3)/2 , 200, 200), "\n" + winner + " wins!");
		 
		if (whitesTurn){
			GUI.Box(Rect(Screen.width/2 - 50, Screen.height/2 - (Screen.height/3)/2 + 25 + 20, 100, 20),"You won in " + theScore + "s");
			if (!submitted){
				GUI.Box(Rect(Screen.width/2 - 50, Screen.height/2 - (Screen.height/3)/2 + 25 + 45, 100, 20),"Enter Username");
				userName = GUI.TextArea (Rect (Screen.width/2 - 75, Screen.height/2 - (Screen.height/3)/2 + 25 + 75, 100, 20), userName, 200);
				if (GUI.Button(Rect(Screen.width/2 + 30, Screen.height/2 - (Screen.height/3)/2 + 25 + 75, 55, 20),"Submit")){
					enteringNewScore = true;
				}
			}
		}
		else {
			GUI.Box(Rect(Screen.width/2 - 75, Screen.height/2 - (Screen.height/3)/2 + 25 + 20, 150, 60), aiName + " beat you in " + theScore + "s\n\n" + endMessage);
		}

		
		if (GUI.Button(Rect(Screen.width/2 - 40, Screen.height/2 - (Screen.height/3)/2 + 25 + 110, 80, 20),"to menu")){
			Application.LoadLevel("AtTheBoard");
		}
		if (GUI.Button(Rect(Screen.width/2 - 40, Screen.height/2 - (Screen.height/3)/2 + 25 + 140, 80, 20),"quit")){
			Application.Quit();
		}
	}
	
	if (enteringNewScore) {
		Debug.Log (userName);
		if (!PlayerPrefs.HasKey(userName)) {
		Debug.Log ("got here");
			GUI.Box(Rect(Screen.width/2 - 100, Screen.height/2 - (Screen.height/3)/2, 200, 120),"\nCreate Account '" + userName + "'?");
			GUI.Box(Rect(Screen.width/2 - 100, Screen.height/2 - (Screen.height/3)/2, 200, 120),"\nCreate Account '" + userName + "'?");
			if (GUI.Button(Rect(Screen.width/2 - 50, Screen.height/2 - (Screen.height/3)/2 + 25 + 25, 100, 20),"yes")){
			Debug.Log ("Account Made");
				PlayerPrefs.SetInt(userName, 1);
				submitted = true;
				enteringNewScore = false;
			}
			if (GUI.Button(Rect(Screen.width/2 - 50, Screen.height/2 - (Screen.height/3)/2 + 25 + 50, 100, 20),"no")){
			Debug.Log ("Quit");
				submitted = false;
				enteringNewScore = false;
			}
		}
		else {
			var org : int = PlayerPrefs.GetInt(userName);
			PlayerPrefs.DeleteKey(userName);
			PlayerPrefs.SetInt(userName, org+1);
			submitted = true;
			enteringNewScore = false;
		}
		
	}
}

function Update () {
	theTime += Time.deltaTime;
	if (Input.GetKeyDown(KeyCode.Space)){
		Debug.Log ("showing Board");
		theBoard.showBoardArray();
	}
	if (canMove){
		if (players [identifyPlayer(whitesTurn)].isHuman){
			if (Input.GetMouseButtonDown(0)){
				// determining place the mouse clicked
				var hit : RaycastHit;
				var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
				var select = GameObject.FindWithTag("BoardCoordinate").transform;
				
				// When the mouse clicked a button
				if (Physics.Raycast (ray, hit, 100.0)){
					// Check if clicka board coordinate
					if (hit.collider.tag == "BoardCoordinate"){
						clickMove(hit);
					}
				}
			}
		}
		else {
			coordinateMove(computerAi.chooseMove(theBoard, whitesTurn, aiLevel));
		}
	}	
}

function coordinateMove (thePlace : Coordinate){
	// send message to the click detector to spawn a piece and send the location to the array coordinate
	var theBoardCoordinate : Transform = transform.Find("Row" + (thePlace.y+1) + "/Detector" + (thePlace.x+1));
	theBoardCoordinate.SendMessage("placePiece", whitesTurn, SendMessageOptions.DontRequireReceiver);	
}

function clickMove (hit : RaycastHit){
	// update coordinate which a piece was placed
	hit.collider.SendMessage("placePiece", whitesTurn, SendMessageOptions.DontRequireReceiver);	
}

function update_theBoard (info : CoordinateDetectorInfo){
	theBoard.updateBoard(info); // tell the computer where the piece was played
	
	if (checkWin (info.coordinates)) {
		theScore = theTime;
		
		if (theScore < 15 || theBoard.spacesLeft > 361-20) endMessage = "'close game buddy'";
		else if (aiLevel == 1) endMessage = "'Easy mode too hard?'";
		else if (aiLevel == 2 || theBoard.spacesLeft < 361-50) endMessage = "'Good Game'";
		else if (aiLevel == 3) endMessage = "'Good Effort!'";
		
		canMove = false;
		gameOver = true;
		// Debug.Log("Player " + (identifyPlayer(whitesTurn)+1) + " wins!");
	}
	
	whitesTurn = !whitesTurn; // set next player's turn
}

function identifyPlayer (turn : boolean){
	if (turn) {
		return 1;
	}
	else {
		return 0;
	}
}

function maxLength (xI : int, yI : int, coord : Coordinate){
	var totalLength : int = 0;
	var c_Coor : Coordinate = new Coordinate (coord);
	var currentID : Occupation;
	
	if (whitesTurn){
		currentID = Occupation.white;
	}
	else {
		currentID = Occupation.black;
	}
	//Debug.Log ("advancing by " + xI + ", " + yI);
	while (c_Coor.x >= 0 && c_Coor.x < 19 && c_Coor.y >= 0 && c_Coor.y < 19){
		//Debug.Log ("at :" + (c_Coor.x+xI) + ", " + (c_Coor.y+yI) + " it is: " + theBoard.coordinates[c_Coor.x+xI, c_Coor.y+yI].getState() + " and we are: " + currentID);
		if (theBoard.coordinates[c_Coor.x, c_Coor.y].getState() == currentID){
			//Debug.Log ("length increased by 1");
			totalLength++;
			c_Coor.x += xI;
			c_Coor.y += yI;
		}
		else {
			//Debug.Log ("abort length scan");
			break;
		}
	}
	//Debug.Log("aaaaaaaannnnndddddd the Final length for " + xI + ", " + yI + " advancement is " + totalLength);
	return totalLength;
}

function checkWin (coordinates : Coordinate){
	//Debug.Log ("aaaaaaaannnnndddddd the check starts at coordinate: " + coordinates.x + ", " + coordinates.y);
	if (maxLength (0, 1, coordinates) + maxLength (0, -1, coordinates) - 1 > 4){
		return true;
	}
	
	//Debug.Log ("aaaaaaaannnnndddddd the check starts at coordinate: " + coordinates.x + ", " + coordinates.y);
	if (maxLength (1, 1, coordinates) + maxLength (-1, -1, coordinates) - 1 > 4){
		return true;
	}
	
	//Debug.Log ("aaaaaaaannnnndddddd the check starts at coordinate: " + coordinates.x + ", " + coordinates.y);
	if (maxLength (-1, 1, coordinates)+ maxLength (1, -1, coordinates) - 1 > 4){
		return true;
	}
	
	//Debug.Log ("aaaaaaaannnnndddddd the check starts at coordinate: " + coordinates.x + ", " + coordinates.y);
	if (maxLength (1, 0, coordinates) + maxLength (-1, 0, coordinates) - 1 > 4){
		return true;
	}
	
	//Debug.Log("no winner");
	return false;
}
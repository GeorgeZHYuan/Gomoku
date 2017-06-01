#pragma strict

public class Player {
	public var isHuman : boolean;
	public function Player (){
		isHuman = true;
	}
}

public class PlayerAccount {
	private var username : String;
	private var score : int;
	
	public function player (){}
	public function player (_username : String, _score : int){
		username = _username;
		score = _score;
	}
	public function setScore (_score : int) {
		score = _score;
	}
	public function getScore () {
		return score;
	}
	public function setName (_username : String){
		username = _username;
	}
	public function getName () {
		return username;
	}
	
}
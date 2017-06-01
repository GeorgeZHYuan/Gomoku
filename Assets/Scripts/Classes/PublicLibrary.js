#pragma strict

enum Occupation {none, black, white};
enum ChainState {blocked, unblocked, dead};

public class Coordinate {
	public var x : int;
	public var y : int;
	
	public function Coordinate (){}
	public function Coordinate (a : int, b : int){
		x = a;
		y = b;
	}
	public function Coordinate (spare : Coordinate){
		x = spare.x;
		y = spare.y;
	}
	
	public function setCoordinates (spare : Coordinate){
		x = spare.x;
		y = spare.y;
	}
	public function setCoordinates (a : int, b : int){
		x = a;
		y = b;
	}
	public function increment (xI : int, yI : int){
		x += xI;
		y += yI;
	}
}

class ChainCap {
	public var coordinate : Coordinate = new Coordinate ();
	public var color : Occupation = Occupation.none;
	
	public function ChainCap (){}
	public function setCap (_coordinate : Coordinate, _color : Occupation) {
		color = _color;
		coordinate.setCoordinates(_coordinate);
	}
	public function setCap (valueHolder : ChainCap) {
		color = valueHolder.color;
		coordinate.setCoordinates(valueHolder.coordinate);
	}
}

class PieceChain {
	public var detached : boolean = false;
	public var positiveCap : ChainCap = new ChainCap ();
	public var neutralCap : ChainCap = new ChainCap ();
	public var negativeCap : ChainCap = new ChainCap ();
	
	public var ownColor : Occupation = Occupation.none;
	public var enemyColor : Occupation = Occupation.none;
	public var length : int = 0;
	
	var state : ChainState = ChainState.dead;
	
	public function doSomething () {}
	
	public function PieceChain () {
		ownColor = Occupation.white;
		setEnemyColor ();
	}
	public function PieceChain (_valueHolder : PieceChain) {
		detached = _valueHolder.detached;
		positiveCap.setCap (_valueHolder.positiveCap);
		neutralCap.setCap (_valueHolder.neutralCap);
		negativeCap.setCap (_valueHolder.negativeCap);
		
		ownColor = _valueHolder.ownColor;
		setEnemyColor ();
		length = _valueHolder.length;
		state = _valueHolder.state;
		
	}
	
	public function setChain (_valueHolder : PieceChain) {
		ownColor = _valueHolder.ownColor;
		positiveCap.setCap (_valueHolder.positiveCap);
		neutralCap.setCap (_valueHolder.neutralCap);
		negativeCap.setCap (_valueHolder.negativeCap);
		setEnemyColor ();
		determineChainType ();
	}
	
	private function setEnemyColor () {
		if (ownColor == Occupation.white) enemyColor = Occupation.black;
		else enemyColor = Occupation.white;
	}
	
	public function determineChainType () {
		if (positiveCap.color != Occupation.none && negativeCap.color != Occupation.none) state = ChainState.dead;
		else if (positiveCap.color == Occupation.none && negativeCap.color == Occupation.none) state = ChainState.unblocked;
		else if (positiveCap.color != Occupation.none && negativeCap.color == Occupation.none || 
				positiveCap.color == Occupation.none && negativeCap.color != Occupation.none) state = ChainState.blocked;
	}
}

class RefDouble {
	var theValue : double;
	function RefDouble (a : double){
		theValue = a;
	}
}

var window : int := Window.Open ("graphics: 800;621, title:Gomoku")

type pieceID : enum (black, white, none)

type LocationType :
    record
	x : int
	y : int
	ID : pieceID
    end record
    
type status :
    record
	pieceLength : int
	danger : boolean
    end record

var whitePiece : int := Pic.FileNew ("Pictures/WhitePiece.bmp")
var blackPiece : int := Pic.FileNew ("Pictures/BlackPiece.bmp")
var board : int := Pic.FileNew ("Pictures/Board.bmp")
var boardPadding : LocationType
boardPadding.x := 15
boardPadding.y := 14

var whiteTurn : boolean := true

var boardPoints : array 1 .. 361 of LocationType
for y : 1 .. 19
    for i : 1 .. 19
	boardPoints ((y - 1) * 19 + i).x := boardPadding.x + round ((i - 1) * 32.85)
	boardPoints ((y - 1) * 19 + i).y := boardPadding.y + round ((y - 1) * 32.85)
	boardPoints ((y - 1) * 19 + i).ID := pieceID.none
    end for
end for

function Distance (x1, y1, x2, y2 : int) : int
    var distance : int := round (sqrt (round ((x1 - x2) ** 2 + (y1 - y2) ** 2)))
    result distance
end Distance

proc PlacePiece (player : boolean)
    var location : LocationType
    var btnNumber, btnUpDown, buttons : int
    loop
	Mouse.ButtonWait ("down", location.x, location.y, btnNumber, btnUpDown)
	Mouse.ButtonWait ("up", location.x, location.y, btnNumber, btnUpDown)
	Mouse.Where (location.x, location.y, buttons)
	var distance : int := 999999
	var place : int
	for i : 1 .. 361
	    var newDistance : int := Distance (boardPoints (i).x, boardPoints (i).y, location.x, location.y)
	    if newDistance < distance then
		distance := newDistance
		place := i
	    end if
	end for
	location.x := boardPoints (place).x - Pic.Width (whitePiece) div 2
	location.y := boardPoints (place).y - Pic.Height (whitePiece) div 2
	if boardPoints (place).ID = pieceID.none then
	    if player then
		Pic.Draw (whitePiece, location.x, location.y, picMerge)
		boardPoints (place).ID := pieceID.white
	    else
		Pic.Draw (blackPiece, location.x, location.y, picMerge)
		boardPoints (place).ID := pieceID.black
	    end if

	    exit
	end if
    end loop
end PlacePiece
/*
function Count (amount : int, ) : status
    for pieceNumber : 1 .. 361
	for scanNumber : 1 .. 361

	end for
    end for
end Count
*/
Pic.Draw (board, 0, 0, picMerge)
loop
    whiteTurn := not whiteTurn
    locate (2, 65)
    if whiteTurn then
	put "White's Turn"
    else
	put "Black's Turn"
    end if
    PlacePiece (whiteTurn)
end loop
Window.Close (window)

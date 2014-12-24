#pragma strict

public var background : Texture;
public var title : Texture;
public var playButtonNormal : Texture;
public var playButtonHover : Texture;
public var playButtonActive : Texture;
public var exitButtonNormal : Texture;
public var exitButtonHover : Texture;
public var exitButtonActive : Texture;

function OnGUI() {

	var gs = new GUIStyle(GUI.skin.button);
	//gs.fontSize = 50;
	//gs.fontStyle = FontStyle.Bold;
	gs.normal.background = playButtonNormal;
	gs.hover.background = playButtonHover;
	gs.active.background = playButtonActive;
	var originalColor: Color = GUI.color;
	GUI.color = new Color(originalColor.r, originalColor.g, originalColor.b, 0.6);
	GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), background);
	GUI.color = originalColor;
	
	var labWidth: float = Screen.width/2;
	var labHeight: float = Screen.height/3;
	var xPos: float = Screen.width/4;
	var yPos: float = Screen.height/9; 
	GUI.DrawTexture(new Rect(xPos, yPos, labWidth, labHeight),title);
	

	var buttonWidth: float = Screen.width/3;
	var buttonHeight: float = Screen.height/3;

	xPos = Screen.width/9;
	yPos = Screen.height*5/9;
	
	var gsExit = new GUIStyle(GUI.skin.button);
	gsExit.normal.background = exitButtonNormal;
	gsExit.hover.background = exitButtonHover;
	gsExit.active.background = exitButtonActive;
	
	
	if(GUI.Button(Rect(xPos,yPos, buttonWidth,buttonHeight),"", gs)) {
		Application.LoadLevel("Zone0");
	}
		
	xPos = 5*Screen.width/9;
	if(GUI.Button(Rect(xPos,yPos, buttonWidth,buttonHeight), "", gsExit)) {
		Application.Quit();
	}

}
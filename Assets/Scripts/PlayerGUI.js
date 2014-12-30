#pragma strict

public var arrowTop: Texture;
public var arrowBottom : Texture;
private var FPSScript: FPSInputController;

function Start(){
	FPSScript = GetComponent(FPSInputController);
}

function OnGUI() {
	
	/* Visual metaphors to help the player find his stability*/
	var x: int;
	var y: int;
	var originalColor: Color = GUI.color;

	GUI.color = new Color(originalColor.r, originalColor.g, originalColor.b, 0.5);
	if(FPSScript.isOnTightRope()){
		if(FPSScript.getBalance() >= 5) {
			x = 0;//Screen.width*0.25 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowBottom, ScaleMode.ScaleToFit, true, 0);
			x = Screen.width - Screen.height/4;//Screen.width*0.75 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowTop,ScaleMode.ScaleToFit, true, 0);
		}
		if(FPSScript.getBalance() <= -5) {
			x = 0;//Screen.width*0.25 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowTop,ScaleMode.ScaleToFit, true, 0);
			x = Screen.width - Screen.height/4;//Screen.width*0.75 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowBottom, ScaleMode.ScaleToFit, true, 0);
		}
		
		
	}
	GUI.color = originalColor;
	if(FPSScript.isFinish()){
		y = Screen.height/2 - Screen.height/4;
		x = Screen.width/2 - Screen.width/4;
		var centeredStyle = GUI.skin.GetStyle("Label");
		centeredStyle.alignment = TextAnchor.UpperCenter;
		centeredStyle.fontSize = 72;
		
		var buttStyle = GUI.skin.GetStyle("Button");
		buttStyle.alignment = TextAnchor.MiddleCenter;
		buttStyle.fontSize = 72;
		GUI.Label(Rect(x,y, Screen.width/2, Screen.height/4),"VICTORY",centeredStyle);
		y = Screen.height/2 ;
		x = Screen.width/9;
		if(GUI.Button(Rect(x, y, Screen.width/3, Screen.height/4), "PLAY AGAIN")){
			Application.LoadLevel("Zone0");
		}
		x =  5*Screen.width/9;
		if(GUI.Button(Rect(x, y, Screen.width/3, Screen.height/4), "QUIT")){
			Application.Quit();
		}
		
		
	}
	
	

}
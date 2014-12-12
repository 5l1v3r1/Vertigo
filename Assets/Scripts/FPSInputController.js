	/*
Modified version of the FPSInputController from CharacterController
*/

private var motor : CharacterMotor;
private var inTightRopeArea : boolean = false;//is the player in a tight rope module ?
public var balance : float = 0f;//arm balance of the player (negative: leaning left, positive: leaning right)
public var tightRopeSpeed : float = 0.1f;//movement speed while on a tight rope
public var VREnabled : boolean = true;//use VR controllers ?

private var balanceStep : float = 10f;//one press on A or E will modify the global balance by this amount

private var isBirdGenerationStarted : boolean = false;
public var birdPrefab : GameObject;
private var birdRotation;
private var currentTightRope : GameObject;
private var birdStartPoint;
private var isSameDir : boolean;
private var razerHydra;
private var razerJumpAccel : float = 2;
private var footstepDelay : float = 0f;

public var footsteps : AudioSource;

public var arrowTop: Texture;
public var arrowBottom: Texture;

private var canGraspJavelin: boolean = false;
private var javelin = null;
public var javelinPrefab : GameObject;
private var index:float;

private var canGraspRope: boolean = false;
private var oneHand: boolean = false;
private var twoHand: boolean =false;
private var areSavedPos : boolean = false;
private var leftY;
private var rightY;

private var CamPosInit: Vector3;
/*
updates the player's arm balancing
*/
function calculateBalance(){

	//razer hydra emulation
	/*if(Input.GetKeyDown(KeyCode.A)) {
		balance += -balanceStep;
	}
	if(Input.GetKeyDown(KeyCode.E)) {
		balance += balanceStep;
	}*/
	
	//update current rotation according to the balance
	transform.localEulerAngles.z = -razerHydra.balance;
	//simulate dizziness
	transform.Rotate(Vector3.up * Time.deltaTime * razerHydra.balance);
}

// Use this for initialization
function Awake () {
	CamPosInit = GameObject.Find("Main Camera").transform.position;
	motor = GetComponent(CharacterMotor);
	razerHydra = GetComponent("RazerHydra");
}

// Update is called once per frame
function Update () {
	// Get the input vector from keyboard or analog stick
	var directionVector : Vector3;
	var directionLength : float;
	
	if(inTightRopeArea) {
	index += Time.deltaTime;
		directionVector = Vector3.forward * tightRopeSpeed;
		GameObject.Find("Main Camera").transform.localPosition= new Vector3(0,0.02*Mathf.Abs (5*Mathf.Sin (2*index)),0);
		calculateBalance();
	}
	
	else {
		if(GameObject.Find("Main Camera").transform.localPosition != CamPosInit)
			GameObject.Find("Main Camera").transform.localPosition = CamPosInit;
		
		if(!VREnabled) {
			directionVector = new Vector3(Input.GetAxis("MovementX"), 0, Input.GetAxis("MovementY"));
		}
		
		else {
			directionVector = new Vector3(razerHydra.leftJoyInput.x, 0, razerHydra.leftJoyInput.y);
		}

		if(!VREnabled){
			motor.inputJump = Input.GetButton("Jump");
		}
		
		else {
			motor.inputJump = razerHydra.leftTrackerAccel.x > razerJumpAccel && razerHydra.rightTrackerAccel.y > razerJumpAccel;
		}
	}
		
	var leftPos = razerHydra.leftTrackerPos;
	var rightPos = razerHydra.rightTrackerPos;
		
	if(canGraspRope) {
		if(razerHydra.gachetteGauche && razerHydra.gachetteDroite) {
			twoHand = true;
			if(areSavedPos == true && oneHand == true) {
				areSavedPos = false;
				oneHand = false;

				if((leftPos.y - leftY.y) > 0.3) {

					transform.position = transform.position +Vector3.up;
					
					//GetComponent(CharacterController).Move(Vector3.up*5);
					GetComponent(CharacterController).movement.gravity = 0;
				}
				if((rightPos.y - rightY.y) > 0.3) {

					transform.position = transform.position +Vector3.up;
					GetComponent(CharacterController).movement.gravity = 0;

					//GetComponent(CharacterController).Move(Vector3.up*5);
					//GetComponent(CharacterController).movement.gravity = 0;
				}
				
			}
		}
			
		if((razerHydra.gachetteGauche || razerHydra.gachetteDroite)&& (razerHydra.gachetteGauche != razerHydra.gachetteDroite)) {
				
			oneHand = true;
			if(twoHand){
				twoHand = false;
				if(areSavedPos == false){
					leftY = leftPos;
					rightY = rightPos;
					areSavedPos = true;
				}
			}
			else{
				Debug.LogWarning("Une seule main attachee");
			}
		}
		if(!razerHydra.gachetteGauche && ! razerHydra.gachetteDroite) {
			oneHand = false;
			twoHand = false;
		} 
	}
	
	if (directionVector != Vector3.zero) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		
		// Make sure the length is no bigger than 1
		directionLength = Mathf.Min(1, directionLength);
		
		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;
		
		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
	}
	
	
	if(!inTightRopeArea && motor.grounded && directionVector != Vector3.zero && !footsteps.isPlaying) {
		footstepDelay += Time.deltaTime;
		if(footstepDelay > 0.5f) {
			footsteps.Play();
			//adapt to player speed when using Razer Hydra controllers
			//footsteps.pitch = directionVector.z * 2;
			footstepDelay = 0f;
		}
	}
	
	else if(inTightRopeArea || !motor.grounded || directionVector == Vector3.zero && footsteps.isPlaying) {
		footsteps.Stop();
	}
	
	// Apply the direction to the CharacterMotor
	motor.inputMoveDirection = transform.rotation * directionVector;
	
}

function OnTriggerEnter(trigger : Collider) {
	if(trigger.tag == "TightRopeArea") {
		inTightRopeArea = true;
	}
	if(trigger.tag == "BirdTrigger"){
		trigger.GetComponent("GenerateBird").GenerateBirds();
	}
	if(trigger.tag == "WindTrigger"){
		trigger.GetComponentInChildren(ParticleSystem).Play();
	}
	if(trigger.tag == "Javelin") {
		javelin = trigger.gameObject;
		canGraspJavelin = true;
	}
	
	if(trigger.tag == "Rope") {
		canGraspRope = true;
	}
}

function OnTriggerExit(trigger : Collider) {
	if(trigger.tag == "TightRopeArea") {
		inTightRopeArea = false;
		razerHydra.balance = 0;
		transform.localEulerAngles.z = 0;
		transform.localEulerAngles.x = 0;
	}
	if(trigger.tag == "WindTrigger"){
		trigger.GetComponentInChildren(ParticleSystem).Stop();
	}
	if(trigger.tag == "Javelin") {
		javelin = null;
		canGraspJavelin = false;
	}
	if(trigger.tag == "Rope") {
		canGraspRope = false;
	}
	
}


function OnGUI() {

	/* Visual metaphors to help the player find his stability*/
	var x: int;
	var y: int;
	var originalColor: Color = GUI.color;

	GUI.color = new Color(originalColor.r, originalColor.g, originalColor.b, 0.5);
	if(inTightRopeArea){
		if(razerHydra.balance >= 10) {
			x = 0;//Screen.width*0.25 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowBottom, ScaleMode.ScaleToFit, true, 0);
			x = Screen.width - Screen.height/4;//Screen.width*0.75 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowTop,ScaleMode.ScaleToFit, true, 0);
		}
		if(razerHydra.balance <= -10) {
			x = 0;//Screen.width*0.25 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowTop,ScaleMode.ScaleToFit, true, 0);
			x = Screen.width - Screen.height/4;//Screen.width*0.75 - Screen.height/6;
			y = Screen.height/2 - Screen.height/8;
			GUI.DrawTexture(Rect(x,y,Screen.height/4,Screen.height/4), arrowBottom, ScaleMode.ScaleToFit, true, 0);
		}
	} 
	GUI.color = originalColor;
	var labWidth: float = Screen.width/2;
	var labHeight: float = Screen.height/4;
	var xPos: float = Screen.width/4;
	var yPos: float = Screen.height/8;
	var gs = new GUIStyle(GUI.skin.label);
	gs.fontSize = 24;
	gs.fontStyle = FontStyle.Bold;
	gs.alignment = TextAnchor.MiddleCenter;

	if(canGraspJavelin) {
		GUI.Label(new Rect(xPos, yPos, labWidth, labHeight),"Appuyer sur la touche 1 de la manette gauche pour saisir le javelot", gs);
	}
}


function OnControllerColliderHit(hit: ControllerColliderHit){

	if(hit.gameObject.name == "Sol")
	 	transform.position = Vector3(-42.62825, 49.11555, -147.6305);
}


// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")

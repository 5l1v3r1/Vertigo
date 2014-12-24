	/*
Modified version of the FPSInputController from CharacterController
*/

public var VREnabled : boolean = true;//use VR controllers ?
public var birdPrefab : GameObject;
public var footsteps : AudioSource;
public var arrowTop: Texture;
public var arrowBottom : Texture;
public var metalSound : AudioSource;

private var motor : CharacterMotor;
private var inTightRopeArea : boolean = false;//is the player in a tight rope module ?
 /*private var balance : float = 0f;//arm balance of the player (negative: leaning left, positive: leaning right) */
private var tightRopeSpeed : float = 0.5f;//movement speed while on a tight rope

private var balanceStep : float = 10f;//one press on A or E will modify the global balance by this amount

private var isBirdGenerationStarted : boolean = false;
private var birdRotation;
private var currentTightRope : GameObject;
private var birdStartPoint;
private var isSameDir : boolean;
private var razerHydra;
private var razerJumpAccel : float = 7f;
private var footstepDelay : float = 0f;
private var	canGraspJavelin: boolean = false;
private var javelin = null;

private var index:float;

private var inClimbingArea: boolean = false;
private var oneHand: boolean = false;
private var twoHand: boolean =false;
private var areSavedPos : boolean = false;
private var leftY;
private var rightY;

private var inMonkeyBarArea: boolean = false;


private var CamPosInit: Vector3;
private var climbDistance : float = 0.8f;
private var climbDelta : float = 30f;
private var nextBalance :float = climbDelta;
private var justClimbed : boolean = false;
/*
updates the player's arm balancing
*/
function calculateBalance(){

	//update current rotation according to the balance
	transform.localEulerAngles.z = -razerHydra.balance;
	//simulate dizziness
	transform.Rotate(Vector3.up * Time.deltaTime * razerHydra.balance);
}

// Use this for initialization
function Awake () {
	CamPosInit = GameObject.Find("CamPos").transform.localPosition;
	motor = GetComponent(CharacterMotor);
	razerHydra = GetComponent("RazerHydra");
}

function playerMovement() {
	var directionVector : Vector3;
	var directionLength : float;
	
	// Movement
	if(inTightRopeArea) {
		// The player holds the hydras correctly
		if(razerHydra.armsApart()) {
			index += Time.deltaTime;
			directionVector = Vector3.forward * tightRopeSpeed;
			GameObject.Find("CamPos").transform.localPosition= CamPosInit + Vector3(0,0.03*Mathf.Abs (5*Mathf.Sin (2*index)),0);
			calculateBalance();
		}
		// The player holds the hydras too close from each other, we make him slide to the side of the tight rope area where he is currently leaning to
		else {
			if (razerHydra.balance < 0)
				directionVector = Vector3.left * tightRopeSpeed;
			else
				directionVector = Vector3.right * tightRopeSpeed;
		}
		
	}
	
	else {
		if(GameObject.Find("CamPos").transform.localPosition != CamPosInit)
			GameObject.Find("CamPos").transform.localPosition = CamPosInit;
		
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
	
	// Apply the direction to the CharacterMotor
	motor.inputMoveDirection = transform.rotation * directionVector;
	
	if(!inTightRopeArea && motor.grounded && directionVector != Vector3.zero) {
		footstepDelay += Time.deltaTime;
		if(footstepDelay > 0.3f) {
			footsteps.Play();
			footstepDelay = 0f;
		}
	}
}

function climbing() {
	// Climbing
	var leftPos = razerHydra.leftTrackerPos;
	var rightPos = razerHydra.rightTrackerPos;
		
	if(inClimbingArea){
		if(justClimbed) {
			justClimbed = false;
		}
		else if(nextBalance > 0 && razerHydra.balance >= nextBalance ||
			nextBalance < 0 && razerHydra.balance <= nextBalance) {
			nextBalance = -nextBalance;
			transform.Translate(climbDistance * Vector3.up);
			justClimbed = true;
			metalSound.Play();
		}
	}
}

private var grasp : boolean = false;
function monkeyMoving(){

	var leftPos = razerHydra.leftTrackerPos;
	var rightPos = razerHydra.rightTrackerPos;
	//var rightBut = razerHydra.gachetteGauche;
	//var leftBut = razerHydra.gachetteDroite;
		
	if(inMonkeyBarArea){
		
		if(justClimbed) {
			GetComponent(CharacterMotor).movement.gravity = 0;
			justClimbed = false;
		}
		else if((nextBalance > 0 && razerHydra.balanceZ >= nextBalance ||
			nextBalance < 0 && razerHydra.balanceZ <= nextBalance) && grasp) {
			nextBalance = -nextBalance;
			for(var i=0; i < 10; i++){
				transform.Translate(4 * climbDistance * Vector3.forward* Time.deltaTime);
				yield(0.1);
			}
			justClimbed = true;
			metalSound.Play();
		}
		else{
			
			if(razerHydra.gachetteGauche && razerHydra.gachetteDroite)
				grasp = true;
			if(!razerHydra.gachetteGauche && !razerHydra.gachetteDroite && grasp) {
				GetComponent(CharacterMotor).movement.gravity = 20;
				grasp = false;
			}
		}
	}
}

// Update is called once per frame
function Update () {
	
	// handles running, jumping and footsteps
	if(!grasp) {
		playerMovement();
	}
	// handles ladder climbing 
	climbing();
	
	//handles monkey bar movements
	monkeyMoving();
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
		trigger.GetComponentInChildren(AudioSource).Play();
		Debug.Log("entred");	
	}	
	if(trigger.tag == "ClimbingArea") {
		inClimbingArea = true;
		GetComponent(CharacterMotor).movement.gravity = 0;
	}
	
	// reached the top of the climbing area: teleport to the roof
	if(trigger.tag == "TopOfClimbingArea" && inClimbingArea) {
		transform.position = trigger.transform.position;
	}
	if(trigger.tag == "MonkeyBarArea") {
		inMonkeyBarArea = true;
		GetComponent(CharacterMotor).movement.gravity = 0;
	}
	
	if(trigger.tag == "FallingObject") {
		var barrels : GameObject = trigger.gameObject.Find("BarrelGroup");
		var child = barrels.Find("mixingbarrel01_prp");
		child.rigidbody.AddForce(Vector3.forward*1000);
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
	
	if(trigger.tag == "ClimbingArea") {
		inClimbingArea = false;
		GetComponent(CharacterMotor).movement.gravity = 20;
	}
	if(trigger.tag == "MonkeyBarArea") {
		inMonkeyBarArea = false;
		grasp = false;
		GetComponent(CharacterMotor).movement.gravity = 20;

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
	 	transform.localPosition = Vector3(0, 0, 0);
}


// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")

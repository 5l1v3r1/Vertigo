/*
Modified version of the FPSInputController from CharacterController
*/

private var motor : CharacterMotor;
private var inTightRopeArea : boolean = false;//is the player in a tight rope module ?
public var balance : float = 0f;//arm balance of the player (negative: leaning left, positive: leaning right)
public var tightRopeSpeed : float = 0.5f;//movement speed while on a tight rope
private var balanceStep : float = 10f;//one press on A or E will modify the global balance by this amount

private var isBirdGenerationStarted : boolean = false;
public var birdPrefab : GameObject;
private var birdRotation;
private var currentTightRope : GameObject;
private var birdStartPoint;
private var isSameDir : boolean;

public var arrowTop: Texture;
public var arrowBottom: Texture;

/*
updates the player's arm balancing
*/
function calculateBalance(){

	//razer hydra emulation
	if(Input.GetKeyDown(KeyCode.A)) {
		balance += -balanceStep;
	}
	if(Input.GetKeyDown(KeyCode.E)) {
		balance += balanceStep;
	}
	
	//update current rotation according to the balance
	transform.localEulerAngles.z = -balance;
	//simulate dizziness
	transform.Rotate(Vector3.up * Time.deltaTime * balance*balance/10);
}

// Use this for initialization
function Awake () {
	motor = GetComponent(CharacterMotor);
}

// Update is called once per frame
function Update () {
	// Get the input vector from keyboard or analog stick
	var directionVector : Vector3;
	var directionLength : float;
	
	if(inTightRopeArea) {
		directionVector = Vector3.forward * tightRopeSpeed;	
		calculateBalance();
	}
	
	else {
		directionVector = new Vector3(-Input.GetAxis("MovementX"), 0, Input.GetAxis("MovementY"));
		motor.inputJump = Input.GetButton("Jump");
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
	
}

function OnTriggerEnter(trigger : Collider) {
	if(trigger.tag == "TightRopeArea") {
		inTightRopeArea = true;
	}
	if(trigger.tag == "BirdTrigger"){
		trigger.GetComponent("GenerateBird").GenerateBirds();
	}
}

function OnTriggerExit(trigger : Collider) {
	if(trigger.tag == "TightRopeArea") {
		inTightRopeArea = false;
		balance = 0;
		transform.localEulerAngles.z = 0;
		transform.localEulerAngles.x = 0;
	}
	
}

function OnGUI() {

	/* Visual metaphors to help the player find his stability*/
	var x: int;
	var y: int;
	if(balance >= 10 && balance <= 30) {
		x = Screen.width*0.25 - arrowBottom.width/2;
		y = Screen.height/2 - arrowBottom.height/2;
		GUI.DrawTexture(Rect(x,y,arrowBottom.width,arrowBottom.height), arrowBottom);
		x = Screen.width*0.75 - arrowTop.width/2;
		y = Screen.height/2 - arrowTop.height/2;
		GUI.DrawTexture(Rect(x,y,arrowTop.width,arrowTop.height), arrowTop);
	}
	if(balance <= -10 && balance >= -30) {	
		x = Screen.width*0.25 - arrowTop.width/2;
		y = Screen.height/2 - arrowTop.height/2;
		GUI.DrawTexture(Rect(x,y,arrowTop.width,arrowTop.height), arrowTop);
		x = Screen.width*0.75 - arrowBottom.width/2;
		y = Screen.height/2 - arrowBottom.height/2;
		GUI.DrawTexture(Rect(x,y,arrowBottom.width,arrowBottom.height), arrowBottom);

	}
}


// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")

	/*
Modified version of the FPSInputController from CharacterController
*/

public var victorySound : AudioClip;
public var listCheckPoints : GameObject[];
private var currentCheckPoint : int = -1;

public var VREnabled : boolean = true;//use VR controllers ?
public var birdPrefab : GameObject;
public var footsteps : AudioSource;
public var metalSound : AudioSource;

private var motor : CharacterMotor;
private var inTightRopeArea : boolean = false;//is the player in a tight rope module ?
private var tightRopeSpeed : float = 0.5f;//movement speed while on a tight rope

private var razerHydra;
private var razerJumpAccel : float = 7f;
private var footstepDelay : float = 0f;

private var index:float;

private var inClimbingArea: boolean = false;

private var grasp : boolean = false;
private var inMonkeyBarArea: boolean = false;
private var theMonkeyBar : GameObject = null;


private var CamPosInit: Vector3;
private var climbDistance : float = 0.8f;
private var climbDelta : float = 30f;
private var nextBalance :float = climbDelta;
private var justClimbed : boolean = false;

private var finish: boolean = false;
/*
updates the player's arm balancing
*/
function calculateBalance(){

	//update current rotation according to the balance
	transform.localEulerAngles.z = -razerHydra.balance;
	//simulate dizziness
	transform.Rotate(Vector3.up * Time.deltaTime * (2*razerHydra.balance));
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
				directionVector = (0.5*Vector3.left+Vector3.forward) * tightRopeSpeed;
			else
				directionVector = (0.5*Vector3.right+Vector3.forward) * tightRopeSpeed;
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
			
			for(var i=0; i < 10; i++){
				transform.Translate((climbDistance/10) * Vector3.up);
				yield(0.1);
			}
			
			transform.Translate(climbDistance * Vector3.up);
			justClimbed = true;
			metalSound.Play();
		}
	}
}

function monkeyMoving(){

	var leftPos = razerHydra.leftTrackerPos;
	var rightPos = razerHydra.rightTrackerPos;
		
	if(inMonkeyBarArea){
		
		if(justClimbed) {
			justClimbed = false;
		}
		else if((nextBalance > 0 && razerHydra.balanceZ >= nextBalance ||
			nextBalance < 0 && razerHydra.balanceZ <= nextBalance) && grasp) {
			nextBalance = -nextBalance;
			for(var i=0; i < 10; i++){
				transform.Translate((climbDistance/10) * Vector3.forward);
				yield(0.1);
			}
			justClimbed = true;
			metalSound.Play();
		}
		else{
			
			if(razerHydra.gachetteGauche && razerHydra.gachetteDroite) {
				if(!grasp){
					GetComponent(CharacterMotor).movement.gravity = 0;
					for(var j=0; j<10; j++){
						transform.Translate(Vector3.up/20);
					}
				}
				grasp = true;
				
			}
			if(!razerHydra.gachetteGauche && !razerHydra.gachetteDroite && grasp) {
				GetComponent(CharacterMotor).movement.gravity = 20;
				grasp = false;
			}
		}
	}
}

// Update is called once per frame
function Update () {
	
	if(grasp || finish){
		if(GetComponent(CharacterMotor).enabled == true) {
			GetComponent(CharacterMotor).enabled = false;
		}
		if(finish) {
			if(GetComponent("MouseLook").enabled == true) {
				GetComponent("MouseLook").enabled = false;
			}
			if(!GameObject.Find("StartPos/Player/CamPos/VRRootNode").activeSelf)
				GameObject.Find("StartPos/Player/CamPos/VRRootNode").SetActive(false);
		
			if(!GameObject.Find("StartPos/Player/Main Camera").GetComponent("Camera").enabled)
				GameObject.Find("StartPos/Player/Main Camera").GetComponent("Camera").enabled = true;
		}
	}
	else {
		if(GetComponent(CharacterMotor).enabled == false) {
			GetComponent(CharacterMotor).enabled = true;
		}
	}

	// handles running, jumping and footsteps
	playerMovement();
	
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
		theMonkeyBar = trigger.gameObject;
		//GetComponent(CharacterMotor).movement.gravity = 0;
	}
	
	if(trigger.tag == "FallingObject") {
		var barrels = trigger.gameObject.transform.Find("BarrelGroup");
		var child = barrels.transform.Find("mixingbarrel01_prp");
		child.rigidbody.AddRelativeForce(Vector3.right*1000);
	}
	if(trigger.tag == "CheckPoint") {
		if(currentCheckPoint < listCheckPoints.Length-1 && listCheckPoints[(currentCheckPoint+1)] == trigger.gameObject){
			currentCheckPoint++;
		}
	}
	if(trigger.tag == "FinalDest") {
		audio.PlayOneShot(victorySound);
		finish = true;
		//Application.LoadLevel
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
		theMonkeyBar = null;
		GetComponent(CharacterMotor).movement.gravity = 20;

	}
}

function OnControllerColliderHit(hit: ControllerColliderHit){

	if(hit.gameObject.name == "Sol") {
		if(currentCheckPoint < 0) {
	 		transform.localPosition = Vector3(0, 0, 0);
	 	}
	 	else {
	 		transform.position = listCheckPoints[currentCheckPoint].transform.position;
	 	}
	 }
}

public function getBalance(){
	return razerHydra.balance;
}

public function isFinish(){
	return finish;
}

public function isOnTightRope(){
	return inTightRopeArea;
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")

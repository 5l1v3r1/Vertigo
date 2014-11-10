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
		if(!isBirdGenerationStarted){
		
			// generate birds while players on the tight rope area
			StartCoroutine(GenerateBirds());
			// to launch the coroutine only once
			isBirdGenerationStarted = true;
		}
	}
	
	else {
		directionVector = new Vector3(-Input.GetAxis("MovementX"), 0, Input.GetAxis("MovementY"));
		motor.inputJump = Input.GetButton("Jump");
		if(isBirdGenerationStarted)
		{
			StopCoroutine(GenerateBirds());
			isBirdGenerationStarted = false;
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
	
}

function OnTriggerEnter(trigger : Collider) {
	if(trigger.tag == "TightRopeArea") {
		inTightRopeArea = true;
		
		currentTightRope = trigger.gameObject;
		birdRotation = currentTightRope.transform.rotation;
		birdStartPoint = currentTightRope.transform.position;
		var areaScaleZ = currentTightRope.transform.localScale.z;
		
		// determine the angle between the player and the Passage
		var angle =  Quaternion.Angle(transform.rotation, trigger.transform.rotation);
		
		//if they don't have the same Direction
		if(angle < 90){
			birdRotation = currentTightRope.transform.rotation * Quaternion.AngleAxis(180, Vector3.up);;
			isSameDir = false;
		}
		else{
			isSameDir = true;
		}
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
/*
 * Generate wave of a random number of bird flying near the player
 */
function GenerateBirds(){
	
	while(inTightRopeArea){
		var difficulty:int = Random.Range(1, 4); //between 1 and 3

		// generate a wave
		for(var i: int=1; i<=difficulty; i++) 
		{
			// random altitude
			var alt:int = Random.Range(1, 4);
			//alt /=2;	// alt between 0.5 and 1.5
			
			// random side (left or right)
			var arrayLeftOrRight = new Array(-0.5, 0.5);			
			var leftOrRight = arrayLeftOrRight[Random.Range(0, arrayLeftOrRight.length)];
			
			// z dimension of the TightRopeArea
			var areaScaleZ = currentTightRope.transform.parent.transform.localScale.z;
			// rotation of the TightRopeArea
			var rot = currentTightRope.transform.rotation.eulerAngles;
			
			// deltaPos to Instatiate Birds from the middle of the TightRopeArea + this deltaPos
			var deltaPos = Vector3((areaScaleZ/2)*( Mathf.Cos(rot.x*Mathf.Deg2Rad)*-Mathf.Sin(rot.y*Mathf.Deg2Rad)),
				     			   		(areaScaleZ/2)*( Mathf.Sin(rot.x*Mathf.Deg2Rad)) ,
				     			   		(areaScaleZ/2)*(Mathf.Cos(rot.x*Mathf.Deg2Rad)*(-Mathf.Cos(rot.y*Mathf.Deg2Rad)))
				     			   	);
			//some operations if the TightRopeArea and the player don't have the same orientation
			if(!isSameDir){
				deltaPos.z = -deltaPos.z;
				deltaPos.y = -deltaPos.y;
				deltaPos.x = -deltaPos.x;
			}
			
			// some operations to instantiate birds at random positions
			deltaPos.y +=alt;
			deltaPos.x += leftOrRight;
			deltaPos.z += leftOrRight;
			
			// creation of an instance of a bird
			var instance : GameObject = Instantiate(	birdPrefab, 
				     			   	currentTightRope.transform.parent.transform.position 
				     			   	+ deltaPos
				     			   	,birdRotation);
			// generation of a bird every 0.2 seconds
			yield WaitForSeconds(0.2);
		}
		
		// generation of a wave about every 1,5 seconds
		yield WaitForSeconds(1.5);
	}
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")

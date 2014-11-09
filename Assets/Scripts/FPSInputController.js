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
		var rotPlayer = transform.rotation;
		var rotTightRopeArea = trigger.transform.rotation;
		var rotationY =  Quaternion.Angle(rotPlayer, rotTightRopeArea);
		
		currentTightRope = trigger.gameObject;
		birdRotation = currentTightRope.transform.rotation;
		birdStartPoint = currentTightRope.transform.position;
		var areaScaleZ = currentTightRope.transform.parent.transform.localScale.z;
		if(rotationY < 90){
			birdRotation = currentTightRope.transform.rotation * Quaternion.AngleAxis(180, Vector3.up);;
			birdStartPoint += Vector3(0,0,areaScaleZ + 1);
		}
		else{
			birdStartPoint += Vector3(0,0,-(areaScaleZ + 1));


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
			alt /=2;	// alt between 0.5 and 1.5
			
			// random side (left or right)
			var arrayLeftOrRight = new Array(-0.5, 0.5);			
			var leftOrRight = arrayLeftOrRight[Random.Range(0, arrayLeftOrRight.length)];
			
			// creation of an instance of a bird
			var instance : GameObject = Instantiate(birdPrefab, 
													birdStartPoint + Vector3(leftOrRight,0,0) + Vector3(0,alt,0),
													birdRotation);
			// generation of a bird every 0.2 seconds
			yield WaitForSeconds(0.2);
		}
		
		// generation of a wave about every 2-3 seconds
		yield WaitForSeconds(2);
	}
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")

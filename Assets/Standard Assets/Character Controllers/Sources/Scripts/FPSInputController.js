private var motor : CharacterMotor;
private var inTightRopeArea : boolean = false;
public var nextWaypoint : Transform;

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
		directionVector = Vector3.forward * 0.5f;
	}
	
	else {
		directionVector = new Vector3(-Input.GetAxis("MovementX"), 0, Input.GetAxis("MovementY"));
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
	
	Debug.Log(directionVector);
	// Apply the direction to the CharacterMotor
	motor.inputJump = Input.GetButton("Jump");
	motor.inputMoveDirection = transform.rotation * directionVector;
}

function OnTriggerEnter(trigger : Collider) {
	if(trigger.tag == "TightRopeArea") {
		inTightRopeArea = true;
		nextWaypoint = GameObject.Find("WayPoint").transform;
	}
}

function OnTriggerExit(trigger : Collider) {
	if(trigger.tag == "TightRopeArea") {
		inTightRopeArea = false;
	}
}
// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")

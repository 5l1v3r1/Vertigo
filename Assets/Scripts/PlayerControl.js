#pragma strict

public var speed : float = 10f;
public var turnSpeed : float = 10f;
public var jump : float = 10f;
public var grounded : boolean;

function Start () {

}

function Update() {
	if(Input.GetButtonDown("Jump")) {
		rigidbody.AddForce(Vector3.up * jump, ForceMode.Acceleration);
	}
}

function FixedUpdate () {
	
	transform.Translate(Vector3.forward * speed * Input.GetAxis("MovementY"));
	transform.Translate(Vector3.left * speed * Input.GetAxis("MovementX"));
	transform.Rotate(Vector3.up * Input.GetAxis("Horizontal") * turnSpeed);
}

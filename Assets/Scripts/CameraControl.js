#pragma strict

public var turnSpeed : float = 10f;
public var minimumY : float = -60f;
public var maximumY : float = 60f;

public var rotationY : float = 0f;

function Start () {

}

function Update () {
	
}

function FixedUpdate () {
	rotationY += Input.GetAxis("Vertical") * turnSpeed;
	rotationY = Mathf.Clamp(rotationY, minimumY, maximumY);
	transform.localEulerAngles.x = -rotationY;
}
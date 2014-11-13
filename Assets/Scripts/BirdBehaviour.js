#pragma strict

// the life duration of the bird
public var timer: int = 10;

function Start () {
	audio.Play();
	StartCoroutine(WaitAndDestroy());
}

function Update () {
}


/*
 *	Destroy the bird after 'timer' seconds
 */
function WaitAndDestroy(){
	yield WaitForSeconds(timer);
	Destroy (gameObject);
}

function FixedUpdate(){
	transform.Translate(Vector3.forward*0.1);
}






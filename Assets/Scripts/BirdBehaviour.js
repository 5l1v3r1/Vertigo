#pragma strict

// the life duration of the bird
var timer: int = 10;

function Start () {

	//instance.transform.parent = currentTightRope.transform;

	//transform.rotation(p.rotation);
	StartCoroutine(WaitAndDestroy());
}

function Update () {

	transform.Translate(Vector3.forward*0.1);

}

/*
 *	Destroy the bird after 'timer' seconds
 */
function WaitAndDestroy(){
	yield WaitForSeconds(timer);
	Destroy (gameObject);
}






#pragma strict

// the life duration of the bird
public var timer: int = 10f;
public var birdSpeed : float = 0.1f;

function Start () {
	audio.Play();
	Destroy(gameObject, timer);
}

function FixedUpdate(){
	transform.Translate(Vector3.forward * birdSpeed);
}

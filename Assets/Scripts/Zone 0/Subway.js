#pragma strict

public var track : Transform[];
private var way : int = 0;
private var speed : float = 0.3f;
private var running : boolean = false;

function Start () {
	transform.LookAt(track[way]);
}

function activate() {
	running = true;
}

function Update() {
	if(Vector3.Distance(transform.position, track[way].position) < 1f) {
		way = (way + 1) % track.Length;
		transform.LookAt(track[way]);
	}
}

function FixedUpdate () {
	if(running) {
		transform.Translate(Vector3.Normalize(track[way].position - transform.position) * speed, Space.World);
	}
}
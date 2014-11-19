#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter(collision : Collider) {
	if(collision.tag == "SubwayTrigger") {
		var train : GameObject[] = GameObject.FindGameObjectsWithTag("Subway");
		var script : Subway;
		for(var i = 0; i < train.Length; i++) {
			script = train[i].GetComponent("Subway");
			script.activate();
		}
	}
}	
#pragma strict

public var nbBirdType: int;
//public var arrayBird : GameObject[nbBirdType];
public var birdPrefab: GameObject;
public var isGenerating: boolean = false;
public var isGenerationStarted : boolean = false;
function Start () {

}

function Update () {

	if(isGenerationStarted){
		GenerateBirds();
		isGenerationStarted = false;
	}
}


public function GenerateBirds(){
	
	while(isGenerating){
		var difficulty:int = Random.Range(1, 4); //between 1 and 3

		// generate a wave
		for(var i: int=1; i<=difficulty; i++) 
		{
			// random altitude
			var alt:int = Random.Range(2, 5);
			alt /=2;	// alt between 0.5 and 1.5
			
			// random side (left or right)
			var arrayLeftOrRight = new Array(-1,-0.5, 0.5, 1);			
			var leftOrRight = arrayLeftOrRight[Random.Range(0, arrayLeftOrRight.length)];
			
			
			
			// deltaPos to Instatiate Birds from the Bird Generator prefab + this deltaPos
			var deltaPos = Vector3(leftOrRight,alt,0);
			deltaPos = transform.rotation * deltaPos;
			
			
			// creation of an instance of a bird
			var instance : GameObject = Instantiate(birdPrefab, transform.position + deltaPos, transform.rotation);

			// generation of a bird every 0.2 seconds
			yield WaitForSeconds(0.2);
		}
		
		// generation of a wave about every 1,5 seconds
		yield WaitForSeconds(2);
	}
}

public function startGeneration(){
	isGenerating = true;
}

public function stopGeneration(){
	isGenerating = false;
}

public function launchGeneration(){
	isGenerationStarted = true;
	startGeneration();
}
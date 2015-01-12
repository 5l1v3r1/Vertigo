#pragma strict

// Bird prefab
public var birdPrefab: GameObject;

// Bird generation interval
public var generationInterval = 0.2f;

// Birds per wave
public var birdNbToGenerate : int;

public function GenerateBirds(){
	// generate a wave
	for(var i: int=1; i<=birdNbToGenerate; i++) 
	{
		// random altitude
		var alt:int = Random.Range(1, 4);
		alt /= 2;	// alt between 0.5, 1, 2
		
		// random side (left or right)
		var arrayLeftOrRight = new Array(-1,-0.5, 0.5, 1);			
		var leftOrRight = arrayLeftOrRight[Random.Range(0, arrayLeftOrRight.length)];
		
		// deltaPos to Instatiate Birds from the Bird Generator prefab + this deltaPos
		var deltaPos = Vector3(leftOrRight,alt,0);
		var source: Transform = transform.Find("Source");
		deltaPos = source.rotation * deltaPos;
		// creation of an instance of a bird at the parent position
		var instance : GameObject = Instantiate(birdPrefab, 
												source.position + deltaPos, 
												source.rotation);
		// generation of a bird every "generationInterval" seconds
		yield WaitForSeconds(generationInterval);
	}
}

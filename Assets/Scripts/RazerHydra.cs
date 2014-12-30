using UnityEngine;
using System.Collections;
using MiddleVR_Unity3D;


public class RazerHydra : MonoBehaviour {

	//left and right joysticks' axes
	public Vector2 leftJoyInput, rightJoyInput;

	//left and right controllers' position
	public Vector3 leftTrackerPos, rightTrackerPos;

	//left and right trackers' acceleration
	public Vector3 leftTrackerAccel, rightTrackerAccel;

	//equilibrium between both trackers
	public float balance;
	public float balanceZ;

	public bool gachetteGauche = false;
	public bool gachetteDroite = false;

	vrJoystick leftJoystick, rightJoystick;
	vrTracker leftTracker, rightTracker;
	Vector3 lastLeftTrackerPos, lastRightTrackerPos;


	void Start() {
		leftJoystick = MiddleVR.VRDeviceMgr.GetJoystickByIndex (0);
		rightJoystick = MiddleVR.VRDeviceMgr.GetJoystickByIndex (1);
		leftTracker = MiddleVR.VRDeviceMgr.GetTracker (0);
		rightTracker = MiddleVR.VRDeviceMgr.GetTracker (1);
		gachetteGauche = leftJoystick.IsButtonPressed (0);
		gachetteDroite = rightJoystick.IsButtonPressed (0);


	}

	void Update () {
		leftJoyInput.x = leftJoystick.GetAxisValue (0);
		leftJoyInput.y = leftJoystick.GetAxisValue (1);
		
		rightJoyInput.x = rightJoystick.GetAxisValue (0);
		rightJoyInput.y = rightJoystick.GetAxisValue (1);
		
		leftTrackerPos = MiddleVRTools.ToUnity (leftTracker.GetPosition ());
		rightTrackerPos = MiddleVRTools.ToUnity (rightTracker.GetPosition ());
		
		leftTrackerAccel = (leftTrackerPos - lastLeftTrackerPos) * Time.deltaTime * 100000f;
		rightTrackerAccel = (rightTrackerPos - lastRightTrackerPos) * Time.deltaTime * 100000f;
		
		balance = Mathf.Clamp ((leftTrackerPos.y - rightTrackerPos.y) * 100f, -30f, 30f);

		balanceZ = Mathf.Clamp ( (leftTrackerPos.z - rightTrackerPos.z)* 100f, -30f, 30f);

		lastLeftTrackerPos = leftTrackerPos;
		lastRightTrackerPos = rightTrackerPos;
		gachetteGauche = leftJoystick.IsButtonPressed (0);
		gachetteDroite = rightJoystick.IsButtonPressed (0);

	}

	// Checks if player holds the Hydras far enough from each other
	bool armsApart() {
		Vector2 leftPos = new Vector2 (leftTrackerPos.x, leftTrackerPos.z);
		Vector2 rightPos = new Vector2 (rightTrackerPos.x, rightTrackerPos.z);
		return Vector3.Distance (leftPos, rightPos) > 0.5f;
	}
}

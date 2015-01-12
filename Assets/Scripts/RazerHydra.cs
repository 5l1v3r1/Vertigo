using UnityEngine;
using System.Collections;
using MiddleVR_Unity3D;

/*
This class is an interface between Razer Hydra and the game
*/

public class RazerHydra : MonoBehaviour {

	// Left and right joystick axes
	public Vector2 leftJoyInput, rightJoyInput;

	// Left and right controllers' position
	public Vector3 leftTrackerPos, rightTrackerPos;

	// Left and right trackers' acceleration
	public Vector3 leftTrackerAccel, rightTrackerAccel;

	// Equilibrium between both trackers
	public float balance;
	public float balanceZ;

	// Triggers
	public bool leftTrigger = false;
	public bool rightTrigger = false;

	private vrJoystick leftJoystick, rightJoystick;
	private vrTracker leftTracker, rightTracker;
	private Vector3 lastLeftTrackerPos, lastRightTrackerPos;

	void Start() {
		// Grab all controlers...
		leftJoystick = MiddleVR.VRDeviceMgr.GetJoystickByIndex (0);
		rightJoystick = MiddleVR.VRDeviceMgr.GetJoystickByIndex (1);
		leftTracker = MiddleVR.VRDeviceMgr.GetTracker (0);
		rightTracker = MiddleVR.VRDeviceMgr.GetTracker (1);
		leftTrigger = leftJoystick.IsButtonPressed (0);
		rightTrigger = rightJoystick.IsButtonPressed (0);
	}

	// Grab latest controller data
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
		leftTrigger = leftJoystick.IsButtonPressed (0);
		rightTrigger = rightJoystick.IsButtonPressed (0);

	}

	// Checks if player holds the Hydras far enough from each other
	bool armsApart() {
		Vector2 leftPos = new Vector2 (leftTrackerPos.x, leftTrackerPos.z);
		Vector2 rightPos = new Vector2 (rightTrackerPos.x, rightTrackerPos.z);
		return Vector3.Distance (leftPos, rightPos) > 0.5f;
	}
}

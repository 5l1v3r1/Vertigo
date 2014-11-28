using UnityEngine;
using System.Collections;
using MiddleVR_Unity3D;


public class RazerHydra : MonoBehaviour {

	vrJoystick leftJoystick, rightJoystick;
	public Vector2 leftJoyInput, rightJoyInput;

	bool isPlugged() {
		return leftJoystick != null && rightJoystick != null;
	}

	void Start() {
		leftJoystick = MiddleVR.VRDeviceMgr.GetJoystickByIndex (0);
		rightJoystick = MiddleVR.VRDeviceMgr.GetJoystickByIndex (1);
	}

	// Update is called once per frame
	void Update () {
		leftJoyInput.x = leftJoystick.GetAxisValue (0);
		leftJoyInput.y = leftJoystick.GetAxisValue (1);
		rightJoyInput.x = rightJoystick.GetAxisValue (0);
		rightJoyInput.y = rightJoystick.GetAxisValue (1);
	}
}

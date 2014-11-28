using UnityEngine;
using System.Collections;
using MiddleVR_Unity3D;


public class GamePad : MonoBehaviour {
	private GameObject headNode = null;
	private GameObject handNode2 = null;
	private Vector3 handDir = Vector3.zero;
	private Vector3 handDirLat = Vector3.zero;

	public float deadZone = .3f;	
	public float mainSpeed = 2; //regular speed
	public float camSens = 1; //How sensitive it with mouse
	
	bool buttonDown = true;
	Vector3 firstXZHeadDir = new Vector3(0, 0, 0);

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

		if (handNode2 == null) handNode2 = GameObject.Find("RightHand");
		if (headNode == null) headNode = GameObject.Find("LeftHand");
		
		if (handNode2 == null || headNode == null)
			return;
		
		handDir = handNode2.transform.forward;
		handDir.y = 0;
		handDir = handDir.normalized;
		
		handDirLat = new Vector3(handDir.z,0,-handDir.x);
		
		if (MiddleVR.VRDeviceMgr != null)
		{
			if (MiddleVR.VRDeviceMgr.GetJoysticksNb() > 0)
			{
				vrJoystick joy = MiddleVR.VRDeviceMgr.GetJoystickByIndex(0);

				vrButtons but = joy.GetButtonsDevice();
				
				if (joy != null)
				{
					float x = joy.GetAxisValue(0);
					float y = joy.GetAxisValue(1);
					float fourth = joy.GetAxisValue(3);
					float deltaTime = (float)MiddleVR.VRKernel.GetDeltaTime();
					
					if (but.IsPressed(5))
					{
						var currentXZHeadDir = headNode.transform.forward;
						currentXZHeadDir.y = 0;
						currentXZHeadDir = currentXZHeadDir.normalized;
						
						if (buttonDown)
						{
							firstXZHeadDir = currentXZHeadDir;
							buttonDown = false;
						}
						else
						{
							var cosAlpha = Vector3.Dot(firstXZHeadDir,currentXZHeadDir);
							var sinAlpha = Vector3.Cross(firstXZHeadDir,currentXZHeadDir).y;
							var alpha = Mathf.Atan2(sinAlpha, cosAlpha);

							transform.RotateAround(headNode.transform.position, new Vector3(0,1,0), - alpha * Mathf.Rad2Deg);
						}
					}
					else
					{
						buttonDown = true;	
					}
					
					if (fourth > deadZone|| fourth < -deadZone)
					{
						transform.RotateAround(headNode.transform.position, new Vector3(0,1,0), camSens*deltaTime*fourth);
					}
					if(x * x + y * y > deadZone * deadZone)
					{
						transform.Translate(-handDir*mainSpeed*deltaTime*y, Space.World);
						transform.Translate(handDirLat*mainSpeed*deltaTime*x, Space.World);
					}
				}
					

			}
		}
	}
}

<?xml version="1.0" ?>
<MiddleVR>
    <Kernel LogLevel="2" LogInSimulationFolder="0" EnableCrashHandler="0" Version="1.4.2.f2" />
    <DeviceManager>
        <Driver Type="vrDriverDirectInput" />
        <Driver Type="vrDriverRazerHydra" />
        <Driver Type="vrDriverOculusRift" />
        <Wand Name="Wand0" Driver="0" Axis="RazerHydra.Joystick0.Axis" HorizontalAxis="0" HorizontalAxisScale="1" VerticalAxis="1" VerticalAxisScale="1" Buttons="RazerHydra.Joystick0.Buttons" Button0="0" Button1="1" Button2="2" Button3="3" Button4="4" Button5="5" />
    </DeviceManager>
    <DisplayManager Fullscreen="0" WindowBorders="0" ShowMouseCursor="0" VSync="1" AntiAliasing="0" ForceHideTaskbar="0" SaveRenderTarget="0">
        <Node3D Name="CenterNode" Parent="VRRootNode" Tracker="0" IsFiltered="0" Filter="0" PositionLocal="0.000000,0.000000,0.000000" OrientationLocal="0.000000,0.000000,0.000000,1.000000" />
        <Node3D Name="RightHand" Tag="Hand" Parent="CenterNode" Tracker="RazerHydra.Tracker1" IsFiltered="0" Filter="0" UseTrackerX="1" UseTrackerY="1" UseTrackerZ="1" UseTrackerYaw="1" UseTrackerPitch="1" UseTrackerRoll="1" />
        <Node3D Name="HeadNode" Tag="Head" Parent="CenterNode" Tracker="OculusRift.Tracker" IsFiltered="0" Filter="0" UseTrackerX="1" UseTrackerY="1" UseTrackerZ="1" UseTrackerYaw="1" UseTrackerPitch="1" UseTrackerRoll="1" />
        <CameraStereo Name="CameraStereo0" Parent="HeadNode" Tracker="OculusRift.Tracker" IsFiltered="0" Filter="0" UseTrackerX="1" UseTrackerY="1" UseTrackerZ="1" UseTrackerYaw="1" UseTrackerPitch="1" UseTrackerRoll="1" VerticalFOV="111.211" Near="0.1" Far="1000" Screen="0" ScreenDistance="1" UseViewportAspectRatio="0" AspectRatio="0.8" InterEyeDistance="0.065" LinkConvergence="0" />
        <Node3D Name="LeftHand" Parent="CenterNode" Tracker="RazerHydra.Tracker0" IsFiltered="0" Filter="0" UseTrackerX="1" UseTrackerY="1" UseTrackerZ="1" UseTrackerYaw="1" UseTrackerPitch="1" UseTrackerRoll="1" />
        <Viewport Name="Viewport0" Left="0" Top="0" Width="1280" Height="800" Camera="CameraStereo0" Stereo="1" StereoMode="3" CompressSideBySide="0" StereoInvertEyes="0" OculusRiftWarping="1" UseHomography="0" />
    </DisplayManager>
    <ClusterManager NVidiaSwapLock="0" DisableVSyncOnServer="1" ForceOpenGLConversion="0" BigBarrier="0" SimulateClusterLag="0" />
</MiddleVR>

import React, { EventHandler, SyntheticEvent, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { ScaleLoader } from 'react-spinners';

import styles from './CameraView.module.css';
import { useWindowDimensions } from '../../../src/hooks/';

export function CameraView() {
  const { width } = useWindowDimensions();
  const [deviceId, setDeviceId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    if (devices.length === 0) {
      navigator.mediaDevices.enumerateDevices().then((mediaDevices: MediaDeviceInfo[]) => {
        setDevices(mediaDevices.filter((device) => device.kind === 'videoinput'))
        setLoading(false);
      });
    }
    console.log(devices)
  });

  useEffect(() => {
    if (devices.length > 0) {
      setDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDeviceId(devices.find((device) => device.deviceId === event.target.value).deviceId);
    console.log(deviceId);
  }

  if (loading) {
    return (
      <div className={styles.CameraViewLoading}>
        <ScaleLoader width={5} color={"#22d3ee"}/>
      </div>
    )
  }
  
  if (devices.length === 0 || !deviceId) {
    return (
      <div className={styles.CameraViewLoading}>
        <h1>No video inputs found</h1>
      </div>
    )
  }

  const videoConstraints: MediaTrackConstraints = {
    width: width * .80,
    facingMode: 'user',
    aspectRatio: 16/9,
    deviceId: deviceId,
    frameRate: 60,
  }

  return (
    <div className={styles.CameraView}>
      <select onChange={handleDeviceChange}>
        {devices.map((mediaDevice) => {
          return (
            <option
              key={mediaDevice.deviceId}
              value={mediaDevice.deviceId}
            >
              {mediaDevice.label}
            </option>
          )
        })}
      </select>
      <Webcam 
        videoConstraints={videoConstraints}
        mirrored
      />
    </div>
  );
}

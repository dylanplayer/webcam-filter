import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ScaleLoader } from 'react-spinners';
import { io } from 'socket.io-client';

import styles from './CameraView.module.css';
import { useWindowDimensions } from '../../../src/hooks/';

export function CameraView() {
  const webcamRef = useRef<Webcam | null>(null);
  const { width } = useWindowDimensions();
  const [deviceId, setDeviceId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [active, setActive] = useState(false);
  const [socketloop, setSocketloop] = useState<any>();

  const socket = io('http://localhost:8001', {
    path: '/',
  });

  useEffect(() => {
    if (devices.length === 0) {
      navigator.mediaDevices.enumerateDevices().then((mediaDevices: MediaDeviceInfo[]) => {
        setDevices(mediaDevices.filter((device) => device.kind === 'videoinput'))
        setLoading(false);
      });
    }
  });

  useEffect(() => {
    if (devices.length > 0) {
      setDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDeviceId(devices.find((device) => device.deviceId === event.target.value).deviceId);
  }

  const startStream = async () => {
    if (!active) {
      setSocketloop(setInterval(() => {
      socket.emit('stream', getFrame())
      }));
    } else {
      clearInterval(socketloop);
    }
    setActive(!active);
  }

  const getFrame = () => {
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const frame = canvas.toDataURL('image/webp');
    return frame;
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
        ref={webcamRef}
        mirrored
      />
      <button onClick={startStream}>{ active ? "Stop" : "Start" }</button>
    </div>
  );
}

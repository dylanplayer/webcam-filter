import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import { Camera, CameraDevice, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';
import { CameraView } from './components';

declare const global: {HermesInternal: null | {}};

const App = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>('not-determined');
  const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>('not-determined');

  useEffect(() => {
    if (cameraPermission === 'not-determined') {
      Camera.getCameraPermissionStatus().then((status) => {
        if (status === 'not-determined') {
          Camera.requestCameraPermission().then((newStatus) => {
            setCameraPermission(newStatus);
          });
        } else {
          setCameraPermission(status);
        }
      });
    }

    if (microphonePermission === 'not-determined') {
      Camera.getMicrophonePermissionStatus().then((status) => {
        if (status === 'not-determined') {
          Camera.requestMicrophonePermission().then((newStatus) => {
            setMicrophonePermission(newStatus);
          });
        } else {
          setMicrophonePermission(status);
        }
      });
    }
  });

  return (
    <>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView>
          <Text>Hello</Text>
          <CameraView />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "#374151",
    width: "100%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
});

export default App;

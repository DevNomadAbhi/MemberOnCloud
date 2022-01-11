import TouchID from 'react-native-touch-id';
import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Language} from '../translations/I18n';
export const optionalConfigObject = {
  title: Language.t('fingerPrint.header'), // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText:  Language.t('alert.cancel'), // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

export const _pressHandler = async () => {
  let result = false;
  await TouchID.authenticate(
    Language.t('fingerPrint.header'),
    optionalConfigObject,
  )
    .then((success) => {
      Alert.alert('การตรวจสอบถูกต้อง');
      result = true;
      console.log('success',success);
    })
    .catch((error) => {
      //Alert.alert('Authentication Failed');
      result = false;
      console.log('error',error);
    });
  return result;
};

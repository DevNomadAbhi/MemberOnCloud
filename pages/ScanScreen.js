import React, {useState, useEffect} from 'react';

import {StyleSheet, View, Text, Alert, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import {decode} from 'jpeg-js';
import jsQR from 'jsqr';
import {FontSize} from '../components/FontSizeHelper';
import {Language} from '../translations/I18n';
import {QRreader} from 'react-native-qr-decode-image-camera';
import {useSelector, useDispatch} from 'react-redux';
import * as loginActions from '../src/actions/loginActions';
const ScanScreen = ({navigation, route}) => {
  const onSuccess = (e) => {
    console.log(e);
    if (e && e.type != 'QR_CODE' && e.type != 'org.iso.QRCode') {
      Alert.alert(Language.t('alert.errorTitle'), 'ไม่พบ QR_CODE');
    } else {
      if (e && e.data && e.data.indexOf('name:') == -1) {
        Alert.alert(Language.t('alert.errorTitle'), 'QR_CODE ไม่ถูกต้อง');
        navigation.goBack();
      } else {
        let result = e.data.split('name:');
        let newObj = {label: result[0], value: result[1]};
        navigation.navigate('SelectBaseScreen', {post: newObj});
      }
    }
  };
  const chooseFile = () => {
    let options = {
      title: Language.t('selectBase.SelectImg'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('response.didCancel');
      } else if (response.error) {
        console.log('response.error');
      } else {
        let path = response.path;
        if (!path) {
          path = response.uri;
        }

        QRreader(path)
          .then((data) => {
            let result = data.split('name:');
            let newObj = {label: result[0], value: result[1]};
            navigation.navigate('SelectBaseScreen', {post: newObj});
          })
          .catch((error) => {
            console.log(error);
            Alert.alert(Language.t('alert.errorTitle'), 'ไม่พบ QR_CODE');
          });
      }
    });
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      cameraType={'back'}
      fadeIn={true}
      topContent={
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.buttonTouchable1}>
            <Icon name="angle-left" size={30} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={chooseFile}
            style={styles.buttonTouchable2}>
            <Text style={styles.buttonText}>
              {Language.t('selectBase.SelectImg')}
            </Text>
          </TouchableOpacity>
        </View>
      }
      topViewStyle={{
        backgroundColor: 'black',
        alignItems: 'flex-start',
        flexDirection: 'row',
      }}
      bottomViewStyle={{backgroundColor: 'black'}}
    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: FontSize.medium,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: FontSize.medium,
    color: 'rgb(255,255,255)',
  },
  buttonTouchable1: {
    alignSelf: 'flex-start',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    //padding: 16,
  },
  buttonTouchable2: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 5,
    //flex:1
    //padding: 16,
  },
});
const mapStateToProps = (state) => {
  return {
    serviceID: state.loginReducer.serviceID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxServiceID: (payload) => dispatch(serviceID(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);

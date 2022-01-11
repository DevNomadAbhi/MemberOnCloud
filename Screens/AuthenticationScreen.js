import React, {useState, useEffect} from 'react';
import Colors from '../src/Colors';
import OtpInput from '../components/OtpInput';
import {StyleSheet, Alert, View, KeyboardAvoidingView} from 'react-native';
import {Button, Text} from 'native-base';
import {useSelector, useDispatch, connect} from 'react-redux';
import NumberPad from '../components/NumberPad';
import {Language} from '../translations/I18n';
import {useNavigation} from '@react-navigation/native';
import {FontSize} from '../components/FontSizeHelper';
import RNRestart from 'react-native-restart';
import * as Constants from '../src/Constants';
import * as registerActions from '../src/actions/registerActions';
const AuthenticationScreen = ({route}) => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState();
  let clockCall = null;
  const registerReducer = useSelector(({registerReducer}) => registerReducer);
  const phoneNumWO = registerReducer.phoneNum.slice(1);
  const [OTPpassword, setOTPpassword] = useState('');
  const defaultCountDown = 120;
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(defaultCountDown);
  const {navi} = route.params;
  const [enableResend, setEnableResend] = useState(false);

  const handlePinCode = (code) => {
    let arr = registerReducer.pinCode.split('');
    if (code === 'del') {
      arr.pop();
    } else {
      arr.push(code);
    }

    dispatch(registerActions.pinCode(arr.join('')));

    if (arr.join('').length == 4) {
      if (arr.join('') == OTPpassword) {
        if (navi == 'PersonalInfoScreen') {
          Alert.alert(
            Language.t('profile.headerPersonalInformation'),
            Language.t('profile.alert'),
          );
          dispatch(registerActions.pinCode(''));
          navigation.navigate(navi);
        } else if (navi == 'LoginScreen') {
          Alert.alert(Language.t('register.confirmRegistration'));
          dispatch(registerActions.pinCode(''));
          navigation.navigate(navi);
        } else if (navi == 'Menu') {
          Alert.alert(Language.t('register.confirmRegistration'));
          dispatch(registerActions.pinCode(''));
          navigation.navigate(navi);
        } else if (navi == 'RESTART') {
          setTimeout(() => {
            RNRestart.Restart();
          }, 1000);
        }
      } else {
        Alert.alert(Language.t('register.alertOtpFail'));
        setTimeout(() => {
          dispatch(registerActions.pinCode(''));
        }, 100);
      }
    }
  };
  const _PressResend = () => {
    if (enableResend) {
      setCountdown(defaultCountDown);
      setEnableResend(false);
      clearInterval(clockCall);
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);
      otpRequest();
    }
  };

  const otpRequest = async () => {
    dispatch(registerActions.pinCode(''));
    console.log('otp Request');
    Alert.alert(Language.t('register.informOtp'));

    let otpPassword = Math.floor(1000 + Math.random() * 9000);
    setOTPpassword(otpPassword);
    console.log(otpPassword);
    await fetch(Constants.API_ENDPOINT + 'RegisterNotify', {
      method: 'POST',
      headers: JSON.stringify({
        'Content-Type': 'application/json',
        'User-Agent': '.NET Foundation Repository Reporter',
      }),
      body: JSON.stringify({
        NTFU_OTP_MESSAGE:
          'รหัสยืนยันการยืนยันตน Member' + 'OTP-Ref: ' + otpPassword,
        NTFU_CNTRY_CODE: '66',
        NTFU_MOBILE: registerReducer.phoneNum,
        NTFU_DISPLAY: 'Display',
        NTFU_NAME: registerReducer.phoneNum,
        NTFU_MAC_ADDRESS: registerReducer.machineNum,
        NTFU_PASSWORD: registerReducer.password,
        NTFU_SVID: Constants.NTFU_SVID,
        NTFU_USERID: Constants.BPLUS_APPID + '-' + '66' + phoneNumWO,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('json' + json);
        if (json[0].NTFU_GUID) {
          console.log('otp Request Success');
        }
      })
      .catch((error) => {
        console.log('ERROR otpRequest :' + error);
      });
  };
  const decrementClock = () => {
    if (countdown === 0) {
      setEnableResend(true);
      setCountdown(0);
      clearInterval(clockCall);
    } else {
      setCountdown(countdown - 1);
    }
  };
  useEffect(() => {
    clockCall = setInterval(() => {
      decrementClock();
    }, 1000);
    return () => {
      clearInterval(clockCall);
    };
  });

  useEffect(() => {
    otpRequest();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.containerAvoidingView}>
        <View style={{flex: 1, marginTop: 60, justifyContent: 'center'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: FontSize.large,
              alignSelf: 'center',
              color: Colors.textColor,
            }}>
            {Language.t('register.confirmRegistration')}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              textAlign: 'center',
              fontSize: FontSize.medium,
              alignSelf: 'center',
              color: Colors.textColor,
            }}>
            {Language.t('register.informOtp')}{' '}
            {Language.t('register.mobilePhoneNumber')} +66
            {phoneNumWO}
          </Text>
          <View style={{marginTop: 20}}>
            <OtpInput digit={4} pinCode={registerReducer.pinCode} />
          </View>
          <View style={{marginTop: 20}}>
            <Button
              hasText
              transparent
              onPress={_PressResend}
              style={{alignSelf: 'center'}}>
              <Text
                allowFontScaling={false}
                style={[
                  {
                    fontSize: FontSize.medium,
                    alignSelf: 'center',
                    color: Colors.linkColor,
                    textDecorationLine: 'underline',
                  },
                  {color: enableResend ? '#234DB7' : 'gray'},
                ]}>
                {Language.t('register.resendOtp')} ({countdown})
              </Text>
            </Button>
          </View>
        </View>
      </View>
      <View style={{flex: 0.4}}>
        <NumberPad handlePinCode={handlePinCode} />
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    pinCode: state.registerReducer.pinCode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {reduxPinCode: (payload) => dispatch(pinCode(payload))};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthenticationScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAvoidingView: {
    flex: 0.6,
    backgroundColor: Colors.backgroundColor,
  },
  textTitle: {
    marginBottom: 50,
    marginTop: 50,
  },
  containerInput: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomColor: 1.5,
  },
  openDialogView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInputStyle: {
    marginLeft: 5,
    flex: 1,
    height: 50,
  },
  viewBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
    alignItems: 'center',
  },
  btnContinue: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  textContinue: {color: '#ffffff', alignItems: 'center'},
});

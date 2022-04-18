import React, { useState, useEffect } from 'react';
import Colors from '../src/Colors';
import OtpInput from '../components/OtpInput';
import { StyleSheet, Alert, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Text } from 'native-base';
import { useSelector, useDispatch, connect } from 'react-redux';
import NumberPad from '../components/NumberPad';
import { Language } from '../translations/I18n';
import { useNavigation } from '@react-navigation/native';
import { FontSize } from '../components/FontSizeHelper';
import RNRestart from 'react-native-restart';
import * as Constants from '../src/Constants';
import * as registerActions from '../src/actions/registerActions';
import * as userActions from '../src/actions/userActions';
import { startSmsHandling } from '@eabdullazyanov/react-native-sms-user-consent';

const AuthenticationScreen = ({ route }) => {
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState();
  const [resultJson, setResultJson] = useState('');
  let clockCall = null;
  const interestReducer = useSelector(({ interestReducer }) => interestReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const [phoneNumWO, setphoneNumWO] = useState('');
  const [code, setCode] = useState('')
  const [OTPpassword, setOTPpassword] = useState('');
  const defaultCountDown = 120;
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(defaultCountDown);

  const { navi } = route.params;
  const [enableResend, setEnableResend] = useState(false);

  const userReducer = useSelector(({ userReducer }) => userReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);

  let tempUser = userReducer.userData;
  let otpPassword = '';

  const handlePin = (code) => {
    console.log(`handlePin >> ${otpPassword}`)
    dispatch(registerActions.pinCode(code));
    if (code == otpPassword) {
      if (navi.navi == 'PersonalInfoScreen') {
        Alert.alert(Language.t('profile.headerPersonalInformation'),
          Language.t('profile.alert'), [{
            text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
              navigation.replace(navi.navi)
            )
          }]);
        dispatch(registerActions.pinCode(''));
      } else if (navi.navi == 'LoginScreen') {
        Alert.alert('', Language.t('register.confirmRegistration'), [{ text: Language.t('alert.ok'), onPress: () => _onPressRegis() }]);
        dispatch(registerActions.pinCode(''));
      } else if (navi.navi == 'Menu') {
        Alert.alert('', Language.t('register.confirmRegistration'), [{ text: Language.t('alert.ok'), onPress: () => dispatch(registerActions.pinCode('')) }]);
        let tempUser = navi.tempUser
        fetch(databaseReducer.Data.urlser+ '/MbUsers', {
          method: 'POST',
          body: JSON.stringify({
            'BPAPUS-BPAPSV': Constants.SERVICE_ID,
            'BPAPUS-LOGIN-GUID': loginReducer.guid,
            'BPAPUS-FUNCTION': 'LoginByMobile',
            'BPAPUS-PARAM':
              '{"MB_CNTRY_CODE": "66", "MB_REG_MOBILE": "' +
              userReducer.userData[userIndex].phoneNum +
              '",    "MB_PW": "' +
              1234 +
              '"}',
          }),
        })
          .then((response) => response.json())
          .then(async (json) => {
            let responseData = JSON.parse(json.ResponseData);
            let NEW_GUID = responseData.MB_LOGIN_GUID;

            console.log(NEW_GUID)
            fetch(databaseReducer.Data.urlser+ '/MbUsers', {
              method: 'POST',
              body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': NEW_GUID,
                'BPAPUS-FUNCTION': 'UpdateMember',
                'BPAPUS-PARAM':
                  '{"MB_INTL": "' +
                  tempUser[userIndex].title +
                  '","MB_NAME": "' +
                  tempUser[userIndex].firstName +
                  '","MB_LOGIN_GUID": "' +
                  NEW_GUID +
                  '","MB_SURNME": "' +
                  tempUser[userIndex].lastName +
                  '","MB_SEX": "' +
                  tempUser[userIndex].sex +
                  '","MB_BIRTH": "' +
                  tempUser[userIndex].birthDate +
                  '","MB_ADDR_1": "' +
                  tempUser[userIndex].ADDR_1 +
                  '","MB_POST": "' +
                  tempUser[userIndex].postCode +
                  '","MB_EMAIL": "' +
                  tempUser[userIndex].email +
                  '","MB_CNTRY_CODE": "66", "MB_REG_MOBILE": "' +
                  tempUser[userIndex].phoneNum +
                  '","MB_PW": "' +
                  1234 +
                  '","MB_E_NAME": "","MB_ADDR_2": "' +
                  tempUser[userIndex].ADDR_2 +
                  '","MB_ADDR_3": "' +
                  tempUser[userIndex].ADDR_3 +
                  '","MB_MT": "","MB_COLOR": "", "MB_ACTIVITY": "", "MB_HOBBY": "",  "MB_INTEREST": ""}',
              }),
            })
              .then((response) => response.json())
              .then(async (json) => {
                if (json && json.ResponseCode == '200') {
                 await dispatch(userActions.setUserData(tempUser));
                  RNRestart.Restart();
                } else {
                  console.log('ERROR : ' + json.ReasonString);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          });

      } else if (navi.navi == 'RESTART') {
        setTimeout(() => {
          RNRestart.Restart();
        }, 1000);
      }
    } else {
      Alert.alert('', Language.t('register.alertOtpFail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);

    }
  }


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
        if (navi.navi == 'PersonalInfoScreen') {
          Alert.alert(Language.t('profile.headerPersonalInformation'),
            Language.t('profile.alert'), [{ text: Language.t('alert.ok'), onPress: () => navigation.navigate(navi.navi) }]);
          dispatch(registerActions.pinCode(''));
        } else if (navi.navi == 'LoginScreen') {

          Alert.alert('', Language.t('register.confirmRegistration'), [{ text: Language.t('alert.ok'), onPress: () => _onPressRegis() }]);
          dispatch(registerActions.pinCode(''));
        } else if (navi.navi == 'Menu') {
          Alert.alert('', Language.t('register.confirmRegistration'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          dispatch(registerActions.pinCode(''));
          let tempUser = navi.tempUser
          fetch(databaseReducer.Data.urlser+ '/MbUsers', {
            method: 'POST',
            body: JSON.stringify({
              'BPAPUS-BPAPSV': Constants.SERVICE_ID,
              'BPAPUS-LOGIN-GUID': loginReducer.guid,
              'BPAPUS-FUNCTION': 'LoginByMobile',
              'BPAPUS-PARAM':
                '{"MB_CNTRY_CODE": "66", "MB_REG_MOBILE": "' +
                userReducer.userData[userIndex].phoneNum +
                '",    "MB_PW": "' +
                1234 +
                '"}',
            })
          })
            .then((response) => response.json())
            .then(async (json) => {
              let responseData = JSON.parse(json.ResponseData);
              let NEW_GUID = responseData.MB_LOGIN_GUID;

              fetch(databaseReducer.Data.urlser+ '/MbUsers', {
                method: 'POST',
                body: JSON.stringify({
                  'BPAPUS-BPAPSV': loginReducer.serviceID,
                  'BPAPUS-LOGIN-GUID': NEW_GUID,
                  'BPAPUS-FUNCTION': 'UpdateMember',
                  'BPAPUS-PARAM':
                    '{"MB_INTL": "' +
                    tempUser[userIndex].title +
                    '","MB_NAME": "' +
                    tempUser[userIndex].firstName +
                    '","MB_LOGIN_GUID": "' +
                    NEW_GUID +
                    '","MB_SURNME": "' +
                    tempUser[userIndex].lastName +
                    '","MB_SEX": "' +
                    tempUser[userIndex].sex +
                    '","MB_BIRTH": "' +
                    tempUser[userIndex].birthDate +
                    '","MB_ADDR_1": "' +
                    tempUser[userIndex].ADDR_1 +
                    '","MB_POST": "' +
                    tempUser[userIndex].postCode +
                    '","MB_EMAIL": "' +
                    tempUser[userIndex].email +
                    '","MB_CNTRY_CODE": "66", "MB_REG_MOBILE": "' +
                    tempUser[userIndex].phoneNum +
                    '","MB_PW": "' +
                    1234 +
                    '","MB_E_NAME": "","MB_ADDR_2": "' +
                    tempUser[userIndex].ADDR_2 +
                    '","MB_ADDR_3": "' +
                    tempUser[userIndex].ADDR_3 +
                    '","MB_MT": "","MB_COLOR": "", "MB_ACTIVITY": "", "MB_HOBBY": "",  "MB_INTEREST": ""}',
                })
              })
                .then((response) => response.json())
                .then(async (json) => {
                  if (json && json.ResponseCode == '200') {
                    dispatch(userActions.setUserData(tempUser));
                    RNRestart.Restart();
                  } else {
                    console.log('ERROR : ' + json.ReasonString);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            });

        } else if (navi.navi == 'RESTART') {
          setTimeout(() => {
            RNRestart.Restart();
          }, 1000);
        }
      } else {
        Alert.alert('', Language.t('register.alertOtpFail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        setTimeout(() => {
          dispatch(registerActions.pinCode(''));
        }, 100);
      }
    }
  };

  const _PressResend = () => {

    setCountdown(defaultCountDown);
    setEnableResend(false);
    clearInterval(clockCall);
    clockCall = setInterval(() => {
      decrementClock();
    }, 1000);
    otpRequest();

    // if (enableResend) {
    //   setCountdown(defaultCountDown);
    //   setEnableResend(false);
    //   clearInterval(clockCall);
    //   clockCall = setInterval(() => {
    //     decrementClock();
    //   }, 1000);
    //   otpRequest();
    // }

  };

  const _onPressRegis = async () => {

    let MB_LOGIN_GUID = navi.MB_LOGIN_GUID;
    let GUID = navi.GUID;
    console.log("MB_LOGIN_GUID : " + MB_LOGIN_GUID)
    console.log("GUID : " + GUID)
    await fetch(databaseReducer.Data.urlser+ '/Member', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': Constants.SERVICE_ID,
        'BPAPUS-LOGIN-GUID': GUID,
        'BPAPUS-FUNCTION': 'ShowMemberInfo',
        'BPAPUS-PARAM':
          '{ "MB_LOGIN_GUID": "' + MB_LOGIN_GUID + '"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        let responseData2 = JSON.parse(json.ResponseData);

        if (json.ResponseCode == '200') {
          setResultJson(responseData2.ShowMemberInfo[0]);
          let xresult = responseData2.ShowMemberInfo[0];
          let temp = userReducer.userData;
          let gender = '';
          if (xresult.MB_SEX == '1') {
            gender = 'M';
          } else {
            gender = 'F';
          }
          let newUser = {
            title: xresult.MB_INTL,
            firstName: xresult.MB_NAME,
            lastName: xresult.MB_SURNME,
            birthDate: xresult.MB_BIRTH,
            ADDR_1: xresult.MB_ADDR_1,
            sex: gender,
            ADDR_2: xresult.MB_ADDR_2,
            ADDR_3: xresult.MB_ADDR_3,
            postCode: xresult.MB_POST,
            phoneNum: xresult.MB_PHONE,
            email: xresult.MB_EMAIL,
            password: navi.newData.password,
            type: xresult.MT_NAME,
            card: xresult.MB_CARD,
            Ename: xresult.MB_E_NAME,
            MB_SINCE: xresult.MB_SINCE,
            MB_EXPIRE: xresult.MB_EXPIRE,
            MB_RENEW: xresult.MB_RENEW,
            SH_POINT: xresult.MB_SH_POINT,
            CNTTPT: xresult.MB_CNTTPT,
            interestImg: [],
            userImg: '',
            machineNo: registerReducer.machineNum,
            loggedIn: false,
            language: 'th',
          };
          if (temp.length == 0) {
            temp.push(newUser);
            dispatch(userActions.setUserData(temp));
            Alert.alert('', Language.t('register.alertRegisterSuccess'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
            navigation.dispatch(
              navigation.replace(navi.navi)
            )

          } else {
            for (let i in temp) {
              /* old user*/
              if (newUser.card == temp[i].card) {
                temp[i] = newUser;
                Alert.alert('', Language.t('register.alertRegisterSuccess'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                navigation.dispatch(
                  navigation.replace(navi.navi)
                )
                return;
              }
            }
            temp.push(newUser);
            dispatch(userActions.setUserData(temp));
            Alert.alert('', Language.t('register.alertRegisterSuccess'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
            navigation.dispatch(
              navigation.replace(navi.navi)
            )
          }
        }
        if (json.ResponseCode == '635') {
        } else {
          console.log("json.ReasonString");
        }
      })
      .catch((error) => {
        console.log('ERROR FETCH ShowMemberInfo: ' + error);
        if (databaseReducer.Data.urlser== '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }  

      });
    //New user
  }
  const otpRequest = async () => {
    otpPassword = Math.floor(1000 + Math.random() * 9000)
    setOTPpassword(otpPassword);

    dispatch(registerActions.pinCode(''));
    console.log('otp Request');
    console.log(otpPassword)
    Alert.alert('', Language.t('register.informOtp'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);

    if (navi.newData) {
      let phoneNum = navi.newData.phoneNum
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
          NTFU_MOBILE: phoneNum,
          NTFU_DISPLAY: 'Display',
          NTFU_NAME: phoneNum,
          NTFU_MAC_ADDRESS: registerReducer.machineNum,
          NTFU_PASSWORD: registerReducer.password,
          NTFU_SVID: Constants.NTFU_SVID,
          NTFU_USERID: Constants.BPLUS_APPID + '-' + '66' + phoneNumWO,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json[0].NTFU_GUID) {
            console.log('otp Request Success');
          }
        })
        .catch((error) => {
          console.log('ERROR otpRequest :' + error);
          if (databaseReducer.Data.urlser== '') {
            Alert.alert(
              Language.t('alert.errorTitle'),
              Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => setCountdown(0) }]);
          }  
        });
    } else {
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
          NTFU_MOBILE: userReducer.userData[userIndex].phoneNum,
          NTFU_DISPLAY: 'Display',
          NTFU_NAME: userReducer.userData[userIndex].phoneNum,
          NTFU_MAC_ADDRESS: registerReducer.machineNum,
          NTFU_PASSWORD: registerReducer.password,
          NTFU_SVID: Constants.NTFU_SVID,
          NTFU_USERID: Constants.BPLUS_APPID + '-' + '66' + phoneNumWO,
        }),
      })
        .then((response) => response.json())
        .then((json) => {

          if (json[0].NTFU_GUID) {

            console.log('otp Request Success');

          }
        })
        .catch((error) => {
          console.log('ERROR otpRequest :' + error);
          if (databaseReducer.Data.urlser== '') {
            Alert.alert(
              Language.t('alert.errorTitle'),
              Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => setCountdown(0) }]);
          }  
        });
    }
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

  const retrieveVerificationCode = (sms) => {
    const codeRegExp = /\d{4}/m;
    const code = sms?.match(codeRegExp)?.[0];
    return code ?? null;
  }


  useEffect(() => {
    console.log(navi.navi)
    const stopSmsHandling = startSmsHandling((event) => {
      const retrievedCode = retrieveVerificationCode(event?.sms);
      setCode(setCode)
      handlePin(retrievedCode)

    });
    return stopSmsHandling;
  }, []);

  useEffect(() => {
    clockCall = setInterval(() => {
      decrementClock();
    }, 1000);
    return () => {
      clearInterval(clockCall);
    };
  });

  useEffect(() => {

    if (navi.newData) {
      console.log(navi.newData.phoneNum)
      setphoneNumWO(navi.newData.phoneNum)
    }
    else {
      console.log(userReducer.userData[userIndex].phoneNum)
      setphoneNumWO(userReducer.userData[userIndex].phoneNum)
    }

    otpRequest()
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.containerAvoidingView}>
        <View style={{ flex: 1, marginTop: 60, justifyContent: 'center' }}>
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
            {Language.t('register.mobilePhoneNumber')} (+66){'  '}
            {phoneNumWO[0] + phoneNumWO[1] + phoneNumWO[2] + '-' + phoneNumWO[3] + phoneNumWO[4] + phoneNumWO[5] + '-XXX' + phoneNumWO[9]}
          </Text>
          <View style={{ marginTop: 20 }}>
            <OtpInput digit={4} pinCode={code ? registerReducer.pinCode : registerReducer.pinCode} />
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              hasText
              transparent
              onPress={_PressResend}
              style={{ alignSelf: 'center' }}>
              <Text
                allowFontScaling={false}
                style={[
                  {
                    fontSize: FontSize.medium,
                    alignSelf: 'center',
                    color: Colors.fontColor2,
                    textDecorationLine: 'underline',
                  },
                 
                ]}>
                {Language.t('register.resendOtp')} ({countdown})
              </Text>
            </Button>
          </View>
        </View>
      </View>
      <View style={{ flex: 0.4 }}>
        <NumberPad handlePinCode={handlePinCode} />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {

    pinCode: state.registerReducer.pinCode,

    title: state.registerReducer.title,
    firstName: state.registerReducer.firstName,
    lastName: state.registerReducer.lastName,
    birthDate: state.registerReducer.birthDate,
    phoneNum: state.registerReducer.phoneNum,
    password: state.registerReducer.password,
    machineNum: state.loginReducer.machineNo,
    userData: state.userReducer.userData,
    sex: state.registerReducer.sex,
    ADDR_1: state.registerReducer.ADDR_1,
    ADDR_2: state.registerReducer.ADDR_2,
    ADDR_3: state.registerReducer.ADDR_3,
    postcode: state.registerReducer.postcode,
    email: state.registerReducer.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    reduxPinCode: (payload) => dispatch(pinCode(payload)),
    reduxTitle: (payload) => dispatch(nameTitle(payload)),
    reduxFirstName: (payload) => dispatch(firstName(payload)),
    reduxLastName: (payload) => dispatch(lastName(payload)),
    reduxBirthDate: (payload) => dispatch(birthDate(payload)),
    reduxMachineNum: (payload) => dispatch(machine(payload)),
    reduxPhoneNum: (payload) => dispatch(phoneNum(payload)),
    reduxPassword: (payload) => dispatch(password(payload)),
    reduxSex: (payload) => dispatch(sex(payload)),
    reduxADDR_1: (payload) => dispatch(ADDR_1(payload)),
    reduxADDR_2: (payload) => dispatch(ADDR_2(payload)),
    reduxADDR_3: (payload) => dispatch(ADDR_3(payload)),
    reduxPostcode: (payload) => dispatch(postcode(payload)),
    reduxEmail: (payload) => dispatch(email(payload)),
    reduxSetUserData: (payload) => dispatch(setUserData(payload)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthenticationScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLoginColor,
  },
  containerAvoidingView: {
    flex: 0.6,
   
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
  textContinue: { color: '#ffffff', alignItems: 'center' },
});
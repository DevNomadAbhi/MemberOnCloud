import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
  BackHandler,
  StatusBar,
} from 'react-native';
import {
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";


import { useStateIfMounted } from 'use-state-if-mounted';
import * as TouchId from '../components/TouchId';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import * as loginActions from '../src/actions/loginActions';
import * as activityActions from '../src/actions/activityActions';
import * as userActions from '../src/actions/userActions';
import * as interestActions from '../src/actions/interestActions';
import * as registerActions from '../src/actions/registerActions';
import { TERM_CONDITION } from '../src/Constants';
import { Language, changeLanguage } from '../translations/I18n';
import Colors from '../src/Colors';
import RNFetchBlob from 'rn-fetch-blob';
import { fetchTsMember } from '../components/fetchTsMember';
import { FontSize } from '../components/FontSizeHelper';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = ({ route }) => {
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const interestReducer = useSelector(({ interestReducer }) => interestReducer);
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;

  const [userIndex, setUserIndex] = useStateIfMounted(loginReducer.index);
  const [username, setUsername] = useStateIfMounted('');
  const [password, setPassword] = useStateIfMounted('');
  const [check, setCheck] = useStateIfMounted();
  const [GUID, setGUID] = useStateIfMounted('');
  const [uLogin, setuLogin] = useStateIfMounted(loginReducer.userloggedIn);
  const [showFingerprint, setShowFingerprint] = useStateIfMounted(
    loginReducer.isFingerprint,
  );
  const dispatch = useDispatch();

  let tempUser = userReducer.userData;
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useStateIfMounted(loginReducer.loggedIn);
  const [loading, setLoading] = useStateIfMounted(false);
  const [resultJson, setResultJson] = useState([]);
  const [marker, setMarker] = useState(false);
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
  let arrayFinal = [];
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const closeLoading = () => {
    setLoading(false);
  };
  const letsLoading = () => {
    setLoading(true);
  }

  useEffect(() => {
    if (registerReducer.machineNum.length == 0)
      getMac()
  }, [])

  useEffect(() => {
    if (route.params?.language) {
      changeLanguage(route.params.language)
      dispatch(loginActions.setLanguage(itemValue))
    }

  }, [route.params?.language])

  useEffect(() => {
    console.log(loginReducer.language)

    letsLoading()

    _Checkstate()
    return () => {
      isLogin;
    }
  }, [])
  useEffect(() => {


  }, [])


  const getMac = async () => {
    var lodstr = ''
    for (var i = 0; i < 100; i++) {
      lodstr += '_'
    }
    await DeviceInfo.getMacAddress().then((mac) => {
      var a = Math.floor(100000 + Math.random() * 900000);
      console.log(DeviceInfo.getDeviceName())
      console.log('\nmachine > > ' + mac + ':' + a)
      if (mac.length > 0) dispatch(registerActions.machine(mac + ':' + a));
      else NetworkInfo.getBSSID().then(macwifi => {
        console.log('\nmachine(wifi) > > ' + macwifi + ':' + a)
        if (macwifi.length > 0) dispatch(registerActions.machine(macwifi + ':' + a));
        else dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e' + ':' + a));
      }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e' + ':' + a)));
    }).catch((e) => dispatch(registerActions.machine('9b911981-afbf-42d4-9828-0924a112d48e' + ':' + a)));
  }


  const _Checkstate = async () => {
    console.log(`userloggedIn >> ${loginReducer.userloggedIn}`)
    console.log(`userName >> ${loginReducer.userName}`)
    console.log(`password >> ${loginReducer.password}`)
    console.log(loginReducer.jsonResult)

    if (loginReducer.userloggedIn == true) {
      await _onPressLogin(loginReducer.userName, loginReducer.password)
    } else {
      closeLoading()
    }

  }
  const _onPressLogin = async (username, password) => {
    let GUIDr = '';
    setShowFingerprint(false);
    setGUID((r) => (GUIDr = r));
    if (userReducer.userData.length == 0) {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.alertRegister'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else if (username.trim() === '') {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.validationEmptyPhoneNumber'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else if (password.trim() === '') {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.validationEmptyPassword'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else {
      letsLoading();
      await _fetchGuidLogin(username, password);
    }
  }

  const regisMacAdd = async (username, password) => {
    console.log('REGIS MAC ADDRESS');
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE":"' +
          registerReducer.machineNum +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "' +
          username +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          await _fetchGuidLog(username);
        } else {
          console.log('REGISTER MAC FAILED');
        }
        _fetchGuidLogin(username, password)
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);
        console.log('http', databaseReducer.Data.urlser);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)
      });
  };


  const _fetchGuidLog = async (username) => {
    console.log('FETCH GUID LOGIN');
    let GUID = '';
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Login',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "' +
          loginReducer.userNameSer +
          '","BPAPUS-PASSWORD": "' +
          loginReducer.passwordSer +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);
        dispatch(loginActions.guid(responseData.BPAPUS_GUID));
        setGUID(responseData.BPAPUS_GUID);
        GUID = responseData.BPAPUS_GUID;
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);

        } else {

          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError') + "1", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)

      });
    await fetchUserData(GUID, username);
  };

  const fetchUserData = async (GUID, username) => {
    console.log('FETCH /LookupErp');
    await fetch(databaseReducer.Data.urlser + '/LookupErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': GUID,
        'BPAPUS-FUNCTION': 'Mb000130',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        let responseData = JSON.parse(json.ResponseData);
        let c = false;
        for (let i in responseData.Mb000130) {
          if (
            responseData.Mb000130[i].MB_PHONE == username
          ) {
            console.log('FETCH /MbUsers');
            await fetch(databaseReducer.Data.urlser + '/MbUsers', {
              method: 'POST',
              body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': GUID,
                'BPAPUS-FUNCTION': 'LoginByMobile',
                'BPAPUS-PARAM':
                  '{"MB_CNTRY_CODE": "66",    "MB_REG_MOBILE": "' +
                  username +
                  '",    "MB_PW": "' +
                  '1234' +
                  '"}',
              }),
            })
              .then((response) => response.json())
              .then(async (json) => {
                if (json.ResponseCode == '635') {
                  console.log('NOT FOUND MEMBER');
                  Alert.alert('', Language.t('login.errorNotfoundUsername'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                  //_fetchNewMember(GUID);
                } else if (json.ResponseCode == '629') {
                  console.log('Function Parameter Required');
                } else if (json.ResponseCode == '200') {
                  let responseData = JSON.parse(json.ResponseData);
                  let MB_LOGIN_GUID = responseData.MB_LOGIN_GUID;

                  _onPressRegis(MB_LOGIN_GUID, GUID);
                } else {
                  console.log(json.ReasonString);
                }
                setLoading(false)
              })
              .catch((error) => {
                if (databaseReducer.Data.urlser == '') {
                  Alert.alert(
                    Language.t('alert.errorTitle'),
                    Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                } else {
                  Alert.alert(
                    Language.t('alert.errorTitle'),
                    Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                }
                console.log('ERROR FETCH LoginByMobile : ' + error)
                setLoading(false)
              }
              );
            c = false;
            break;
          } else {
            c = true;
          }
        }
        if (c) {

          setLoading(false)
        }
      });
  };
  const _addGUID_proJ = async (c, guid) => {
    console.log(guid)
    await fetch(databaseReducer.Data.urlser + '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': guid,
        'BPAPUS-FUNCTION': 'Ec000400',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': "AND SHWJH_CODE='MEMBER ON CLOUD'",
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0'
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.ResponseCode == 200) {
          let responseData = JSON.parse(json.ResponseData);
          if (responseData.Ec000400[0].SHWJH_GUID) {
            console.log(`new project ID >> ${responseData.Ec000400[0].SHWJH_GUID}`)
            _FetchDataProject(c, guid, responseData.Ec000400[0].SHWJH_GUID)
            dispatch(loginActions.projectId(responseData.Ec000400[0].SHWJH_GUID))

          } else {
            Alert.alert(
              Language.t('alert.errorTitle'),
              "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
            setuLogin(false)
            closeLoading()
          }
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          setuLogin(false)
          closeLoading()
        }
      })
      .catch((error) => {
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        console.log('checkIPAddress', error);
        setuLogin(false)
        closeLoading()

      });
  };
  const _onPressRegis = async (MB_LOGIN_GUID, GUID) => {
    console.log(`_onPressRegis`)

    await fetch(databaseReducer.Data.urlser + '/Member', {
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
        console.log('responseData2 ### ' + responseData2);
        if (json.ResponseCode == '200') {
          setResultJson(responseData2.ShowMemberInfo[0]);
          let xresult = responseData2.ShowMemberInfo[0];
          console.log('xresult ==> ' + JSON.stringify(xresult));
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
            navigation.navigate(navi.navi);


          } else {

            for (let i in temp) {
              /* old user*/
              if (newUser.card == temp[i].card) {

                temp[i] = newUser;
                Alert.alert('', Language.t('register.alertRegisterSuccess'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                navigation.navigate(navi.navi);
                return;

              }
            }

            temp.push(newUser);
            dispatch(userActions.setUserData(temp));
            Alert.alert('', Language.t('register.alertRegisterSuccess'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
            navigation.navigate(navi.navi);

          }
        }
        setLoading(false)
      })
      .catch((error) => {

        console.log('ERROR FETCH ShowMemberInfo: ' + error);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } console.log('ERROR FETCH LoginByMobile : ' + error)
      });
    //New user
  }

  const _fetchGuidLogin = async (username, password) => {
    let BPAPUS_GUID
    await fetch(databaseReducer.Data.urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Login',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "' +
          loginReducer.userNameSer +
          '","BPAPUS-PASSWORD": "' +
          loginReducer.passwordSer +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);
        console.log('GET GUID Already');

        dispatch(loginActions.guid(responseData.BPAPUS_GUID));
        dispatch(loginActions.userName(username));
        dispatch(loginActions.password(password));
        dispatch(loginActions.userlogin(true));
        BPAPUS_GUID = responseData.BPAPUS_GUID
        setGUID(responseData.BPAPUS_GUID);

      })
      .catch((error) => {
        console.error('_fetchGuidLogin ' + error);
      });

    let GUIDResult = '';

    setGUID((item) => {
      GUIDResult = item;
    });

    let count = false;
    let temp = userReducer.userData;
    for (let i in userReducer.userData) {
      if (
        username.trim() == userReducer.userData[i].phoneNum &&
        password.trim() == userReducer.userData[i].password &&
        userReducer.userData[i].loggedIn == true
      ) {
        let xresult = await fetchTsMember(
          databaseReducer.Data.urlser,
          username.trim(),
          password.trim(),
          GUIDResult,
        );

        if (xresult != '') {
          dispatch(interestActions.interestImg(userReducer.userData[i].interestImg));
          dispatch(activityActions.ConResult(userReducer.userData[i].userImg));
          dispatch(loginActions.index(i));
          let gender = '';
          if (xresult && xresult.MB_SEX == '1') {
            gender = 'M';
          } else {
            gender = 'F';
          }
          (temp[i].title = xresult.MB_INTL),
            (temp[i].firstName = xresult.MB_NAME),
            (temp[i].lastName = xresult.MB_SURNME),
            (temp[i].birthDate = xresult.MB_BIRTH),
            (temp[i].ADDR_1 = xresult.MB_ADDR_1),
            (temp[i].sex = gender),
            (temp[i].ADDR_2 = xresult.MB_ADDR_2),
            (temp[i].ADDR_3 = xresult.MB_ADDR_3),
            (temp[i].postCode = xresult.MB_POST),
            (temp[i].email = xresult.MB_EMAIL),
            (temp[i].type = xresult.MT_NAME),
            (temp[i].card = xresult.MB_CARD),
            (temp[i].Ename = xresult.MB_E_NAME),
            (temp[i].MB_SINCE = xresult.MB_SINCE),
            (temp[i].MB_EXPIRE = xresult.MB_EXPIRE),
            (temp[i].MB_RENEW = xresult.MB_RENEW),
            (temp[i].SH_POINT = xresult.MB_SH_POINT),
            (temp[i].CNTTPT = xresult.MB_CNTTPT),
            dispatch(userActions.setUserData(temp));

          await _FetchNav(true, BPAPUS_GUID);
          count = true;
          break;

        } else {
          count = true;
          await regisMacAdd(username, password)
        }

      } else if (
        username.trim() == userReducer.userData[i].phoneNum &&
        password.trim() == userReducer.userData[i].password &&
        userReducer.userData[i].loggedIn == false
      ) {
        dispatch(loginActions.index(i));
        temp[i].loggedIn = true;
        dispatch(userActions.setUserData(temp));
        await _FetchNav(false, BPAPUS_GUID);
        count = true;
        break;
      }

    }

    if (count == false) {
      closeLoading();
      dispatch(loginActions.userName(''));
      dispatch(loginActions.password(''));
      setuLogin(false);
      dispatch(loginActions.userlogin(false));

      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.error614'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    }
  };

  const _FetchNav = async (c, GUID) => {
    console.log(`_FetchNav`)
    await _addGUID_proJ(c, GUID)





  }
  const _FetchDataProject = async (c, guid, projectID) => {
    await fetch(databaseReducer.Data.urlser  + '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': guid,
        'BPAPUS-FUNCTION': 'GetProject',
        'BPAPUS-PARAM':
          '{"SHWJ_GUID": "' +
          projectID +
          '","SHWJ_IMAGE": "N", "SHWL_IMAGE": "N"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == 200) {
          let tempArray = [];
          let responseData = JSON.parse(json.ResponseData);

          for (let i in responseData.SHOWLAYOUT) {
            console.log(`  ${responseData.SHOWLAYOUT[i].SHWLH_CODE}`)
            let newObj = {
              SHWLH_CODE: responseData.SHOWLAYOUT[i].SHWLH_CODE,
              name: responseData.SHOWLAYOUT[i].SHWLH_NAME,
              ename: responseData.SHOWLAYOUT[i].SHWLH_E_NAME,
              guid: responseData.SHOWLAYOUT[i].SHWLH_GUID,
              img: 'file://' + (await fetchActivityImg(responseData.SHOWLAYOUT[i].SHWLH_GUID)),
              explain: responseData.SHOWLAYOUT[i].SHWLH_EXPLAIN,
            };
            tempArray.push(newObj);
          }
          let sortTempLAYOUT = []
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("REDEEM_01") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("REDEEM_02") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("MYCARD") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("CONTACT") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("CONDION") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("NOTI") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("CAMPAIGN") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("TNT") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("ABOUTCARD") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("ACTIVITY") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("SPLASH") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("BANNER") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('..')
          await tempArray.map(async (item) => {
            if (item.SHWLH_CODE.search("INSTRUCTION") > -1)
              await sortTempLAYOUT.push(item)
          })
          console.log('V')
          for (var i in sortTempLAYOUT) {
            console.log(sortTempLAYOUT[i].SHWLH_CODE)
          }

          if (sortTempLAYOUT.length == 13) {
            dispatch(loginActions.jsonResult(sortTempLAYOUT));
            if (c == true) {
              if (tempUser[userIndex].interestImg.length > 0)
                navigation.dispatch(
                  navigation.replace('BottomTabs'))
              else
                navigation.dispatch(
                  navigation.replace('InterestScreen'))
            } else if (c == false) navigation.dispatch(
              navigation.replace('InterestScreen')
            );
            else {
              Alert.alert(
                Language.t('alert.errorTitle'),
                "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
              setuLogin(false)
              closeLoading()
            }
          } else {
            Alert.alert(
              Language.t('alert.errorTitle'),
              "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
            setuLogin(false)
            closeLoading()
          }

        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          setuLogin(false)
          closeLoading()
        }

      })
      .catch((error) => {

        console.error('_FetchDataProject >> ' + error);
        Alert.alert(
          Language.t('alert.errorTitle'),
          "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        setuLogin(false)
        closeLoading()
      })
  }

  const fingerPrint = () => {
    let index = loginReducer.index;
    TouchId._pressHandler().then((x) => {
      if (x) {
        _onPressLogin(
          userReducer.userData[index].phoneNum,
          userReducer.userData[index].password,
        );
      } else {
        setShowFingerprint(x);
      }
    });
  };
  const _onPressGo = () => {
    setIsLogin(true);
    dispatch(loginActions.login(true));
    closeLoading();
    navigation.navigate('SelectScreen');
  };
  const fetchActivityImg = async (url) => {
    let imgbase64 = null;
    await RNFetchBlob.config({ fileCache: true, appendExt: 'png' })
      .fetch(
        'GET',
        'http://192.168.0.110:8906/Member/BplusErpDvSvrIIS.dll/DownloadFile',
        {
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-GUID': loginReducer.guid,
          FilePath: 'ShowLayout',
          FileName: url + '.png',
        },
      )
      .then((res) => {
        imgbase64 = res.path();
      })
      .catch((error) => {
        console.error('fetchMenuImg: ' + error);
      });
    return imgbase64;
  };
  return (
    <>
      {uLogin == true || loading ? (
        <>
          <SafeAreaView style={container1}>
            <StatusBar hidden={true} />
            <ScrollView>
              <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
                <View style={tabbar}>
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: FontSize.medium,
                      color: Colors.fontColor2,
                    }}></Text>
                </View>
                <TouchableNativeFeedback>
                  <Image
                    style={topImage}
                    resizeMode={'contain'}
                    source={require('../img/2.5.png')}
                  />
                </TouchableNativeFeedback>

              </KeyboardAvoidingView>
            </ScrollView>
          </SafeAreaView>
          <View
            style={{
              width: deviceWidth,
              height: deviceHeight,
              opacity: 0.5,

              alignSelf: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              position: 'absolute',
            }}>
            <ActivityIndicator
              style={{
                borderRadius: 15,
                backgroundColor: null,
                width: 100,
                height: 100,
                alignSelf: 'center',
              }}
              animating={loading}
              size="large"
              color={Colors.lightPrimiryColor}
            />
          </View>

        </>
      ) : (
        <SafeAreaView style={container1}>
          <StatusBar hidden={true} />
          <ScrollView>
            <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
              <View style={tabbar}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SelectScreen')}>
                  <Icon name="gear" size={30} color={'white'} />
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 12,
                    fontSize: FontSize.medium,
                    color: Colors.fontColor2,
                  }}></Text>
              </View>
              <TouchableNativeFeedback>
                <Image
                  style={topImage}
                  resizeMode={'contain'}
                  source={require('../img/2.5.png')}
                />
              </TouchableNativeFeedback>
              <View
                style={{
                  backgroundColor: Colors.backgroundLoginColorSecondary,
                  margin: 20,
                  flexDirection: 'column',
                  borderRadius: 20,
                  padding: 20,
                }}>
                <View style={{ height: 40, flexDirection: 'row' }}>
                  <Icon name="user" size={30} color={'black'} />
                  <TextInput
                    style={{
                      flex: 8,
                      marginLeft: 10,
                      borderBottomColor: Colors.borderColor,
                      color: Colors.fontColor,
                      paddingVertical: 7,
                      fontSize: FontSize.medium,
                      borderBottomWidth: 0.7,
                    }}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.fontColorSecondary}
                    maxLength={10}
                    placeholder={Language.t('login.mobileNo')}
                    onChangeText={(val) => {
                      setUsername(val);
                    }}></TextInput>
                </View>
                <View style={{ height: 40, marginTop: 20, flexDirection: 'row' }}>
                  <Icon name="lock" size={30} color={'black'} />
                  <TextInput
                    style={{
                      flex: 8,
                      marginLeft: 10,
                      color: Colors.fontColor,
                      paddingVertical: 7,
                      fontSize: FontSize.medium,
                      borderBottomColor: Colors.borderColor,
                      borderBottomWidth: 0.7,
                    }}
                    secureTextEntry={data.secureTextEntry ? true : false}
                    keyboardType="default"
                    placeholderTextColor={Colors.fontColorSecondary}
                    placeholder={Language.t('login.password')}
                    onChangeText={(val) => {
                      setPassword(val);
                    }}
                  />
                  <TouchableOpacity onPress={updateSecureTextEntry}>
                    {data.secureTextEntry ? (
                      <Icon
                        name="eye-slash"
                        size={25}
                        color={Colors.buttonColorPrimary}
                      />
                    ) : (
                      <Icon
                        name="eye"
                        size={25}
                        color={Colors.buttonColorPrimary}></Icon>
                    )}
                  </TouchableOpacity>
                </View>
                {loginReducer.isFingerprint ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableNativeFeedback
                      style={{
                        width: deviceWidth - 125,
                        paddingVertical: 10,
                        borderRadius: 18,
                        backgroundColor: Colors.buttonColorPrimary,
                      }}
                      onPress={() => _onPressLogin(username, password)}>
                      <Text
                        style={{
                          color: Colors.fontColor2,
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold',
                        }}>
                        {Language.t('login.buttonLogin')}
                      </Text>
                    </TouchableNativeFeedback>
                    <TouchableOpacity
                      onPress={fingerPrint}
                      style={{ padding: 2, marginLeft: 10 }}>
                      <MaterialIcons name="fingerprint" size={30} color={'black'} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableNativeFeedback
                    onPress={() => _onPressLogin(username, password)}>
                    <View
                      style={{
                        paddingVertical: 10,
                        borderRadius: 18,
                        marginTop: 15,
                        backgroundColor: Colors.buttonColorPrimary,
                      }}>
                      <Text
                        style={{
                          color: Colors.fontColor2,
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold',
                        }}>
                        {Language.t('login.buttonLogin')}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                )}
                <TouchableNativeFeedback
                  onPress={() => {
                    navigation.navigate('RegisterScreen');
                  }}>
                  <View>
                    <Text
                      style={{
                        color: Colors.buttonColorPrimary,
                        textDecorationLine: 'underline',
                        fontSize: FontSize.medium,
                        alignSelf: 'center',
                        marginTop: 10,
                      }}>
                      {Language.t('login.buttonRegister')}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>

            </KeyboardAvoidingView>

          </ScrollView>

          {showFingerprint ? fingerPrint() : null}

          {isLogin ? null : (
            <View style={container2}>
              <ScrollView>
                <View style={{ padding: 10 }}>

                  <Text
                    style={{
                      flex: 1,
                      fontSize: FontSize.medium,
                      backgroundColor: Colors.fontColor2,
                      padding: 10,
                    }}>
                    {TERM_CONDITION}
                  </Text>
                  <View style={buttonContainer}>
                    <TouchableNativeFeedback onPress={_onPressGo}>
                      <View style={button}>
                        <Text style={textButton}>{Language.t('alert.confirm')}</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundLoginColor,
    flex: 1,
    flexDirection: 'column',
  },
  container2: {
    width: deviceWidth,
    height: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    flex: 1,
  },
  tabbar: {
    height: 70,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textTitle2: {
    alignSelf: 'center',
    flex: 2,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  imageIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: undefined,
    height: Platform.OS === 'ios' ? 300 : deviceWidth / 1.5,
  },
  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  textButton: {
    fontSize: FontSize.large,
    color: Colors.fontColor2,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    guid: state.loginReducer.guid,
    jsonResult: state.loginReducer.jsonResult,
    loggedIn: state.loginReducer.loggedIn,
    title: state.registerReducer.title,
    firstName: state.registerReducer.firstName,
    lastName: state.registerReducer.lastName,
    birthDate: state.registerReducer.birthDate,
    phoneNum: state.registerReducer.phoneNum,
    password: state.registerReducer.password,
    machineNum: state.loginReducer.machineNo,
    userName: state.loginReducer.userName,
    password: state.loginReducer.userName,
    card: state.loginReducer.card,
    type: state.loginReducer.type,
    Ename: state.loginReducer.Ename,
    index: state.loginReducer.index,
    conResult: state.activityReducer.conResult,
    interestImg: state.interestReducer.interestImg,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxGUID: (payload) => dispatch(guid(payload)),
    reduxJsonResult: (payload) => dispatch(jsonResult(payload)),
    reduxLogin: (payload) => dispatch(login(payload)),
    reduxTitle: (payload) => dispatch(nameTitle(payload)),
    reduxFirstName: (payload) => dispatch(firstName(payload)),
    reduxLastName: (payload) => dispatch(lastName(payload)),
    reduxBirthDate: (payload) => dispatch(birthDate(payload)),
    reduxMachineNum: (payload) => dispatch(machine(payload)),
    reduxPhoneNum: (payload) => dispatch(phoneNum(payload)),
    reduxuserName: (payload) => dispatch(userName(payload)),
    reduxpassword: (payload) => dispatch(password(payload)),
    reduxType: (payload) => dispatch(type(payload)),
    reduxCard: (payload) => dispatch(card(payload)),
    reduxEname: (payload) => dispatch(eName(payload)),
    reduxIndex: (payload) => dispatch(index(payload)),
    reduxConResult: (payload) => dispatch(ConResult(payload)),
    reduxInterestImg: (payload) => dispatch(interestImg(payload)),
    reduxSetUserData: (payload) => dispatch(setUserData(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

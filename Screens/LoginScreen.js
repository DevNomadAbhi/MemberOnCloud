import React, { useEffect } from 'react';
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
  StatusBar,
} from 'react-native';
import {
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Language } from '../translations/I18n';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
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
import { changeLanguage } from '../translations/I18n';
import Colors from '../src/Colors';
import ImagePicker from 'react-native-image-picker';
import SelectBase from '../pages/SelectBase';
import { fetchTsMember } from '../components/fetchTsMember';
import { FontSize } from '../components/FontSizeHelper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const interestReducer = useSelector(({ interestReducer }) => interestReducer);
  const [userIndex, setUserIndex] = useStateIfMounted(loginReducer.index);
  const [username, setUsername] = useStateIfMounted('');
  const [password, setPassword] = useStateIfMounted('');
  const [check, setCheck] = useStateIfMounted();
  const [GUID, setGUID] = useStateIfMounted('');
  const [showFingerprint, setShowFingerprint] = useStateIfMounted(
    loginReducer.isFingerprint,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useStateIfMounted(loginReducer.loggedIn);
  const [loading, setLoading] = useStateIfMounted(false);
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
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
  };

  useEffect(() => {
    setCheck(isLogin);
    if (userIndex === '-1') {
      changeLanguage('th');
    } else {
      changeLanguage(userReducer.userData[userIndex].language);
    }
    return () => {
      isLogin;
    };
  }, []);
  useEffect(async () => {

    for (var i in loginReducer.jsonResult) {

      await fetch(userReducer.http + 'ECommerce', {
        method: 'POST',
        body: JSON.stringify({
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-LOGIN-GUID': loginReducer.guid,
          'BPAPUS-FUNCTION': 'GetLayout',
          'BPAPUS-PARAM':
            '{"SHWL_GUID": "' +
            loginReducer.jsonResult[i].guid +
            '","SHWL_IMAGE": "N", "SHWP_IMAGE": "N"}',
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          let responseData = JSON.parse(json.ResponseData);
          if (i == 0) {
            console.log(` `)
            console.log(`loginReducer.jsonResult`)
            console.log(` `)
          }
          console.log(` loginReducer.jsonResult[${i}].guid >> ${loginReducer.jsonResult[i].guid}`)
          console.log(` > > Code :: ${responseData.SHOWLAYOUT.SHWLH_CODE}`)
          console.log(` > > Name :: ${responseData.SHOWLAYOUT.SHWLH_NAME}`)
        })
        .catch((error) => {
          console.error('fetchDataPopUpImg: ' + error);
        });

      console.log(` `)
    }
    console.log(` `)
  }, [])

  const _onPressLogin = async (username, password) => {
    let GUIDr = '';
    setShowFingerprint(false);
    setGUID((r) => (GUIDr = r));
    if (userReducer.userData.length == 0) {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.alertRegister'),
      );
    } else if (username.trim() === '') {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.validationEmptyPhoneNumber'),
      );
    } else if (password.trim() === '') {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.validationEmptyPassword'),
      );
    } else {
      letsLoading();
      await _fetchGuidLogin(username, password);
    }
  };

  const _fetchGuidLogin = async (username, password) => {
    await fetch(userReducer.http + 'DevUsers', {
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
        userReducer.userData[i].interestImg.length > 0
      ) {
        let xresult = await fetchTsMember(
          userReducer.http,
          username.trim(),
          password.trim(),
          GUIDResult,
        );
        if (xresult != '') {
          dispatch(
            interestActions.interestImg(userReducer.userData[i].interestImg),
          );
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

          await _FetchDataProject(GUIDResult, true);
          count = true;
          break;
        }
      } else if (
        username.trim() == userReducer.userData[i].phoneNum &&
        password.trim() == userReducer.userData[i].password

      ) {
        dispatch(loginActions.index(i));
        temp[i].loggedIn = true;
        dispatch(userActions.setUserData(temp));
        await _FetchDataProject(GUIDResult, false);
        count = true;
        break;
      }
    }
    if (count == false) {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('register.error614'),
      );
      closeLoading();
    }
  };
  const _FetchDataProject = async (GUIDResult, c) => {
    await fetch(userReducer.http + 'ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': GUIDResult,
        'BPAPUS-FUNCTION': 'GetProject',
        'BPAPUS-PARAM':
          '{"SHWJ_GUID": "' +
          loginReducer.projectID +
          '","SHWJ_IMAGE": "Y", "SHWL_IMAGE": "Y"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        let tempArray = [];
        let responseData = JSON.parse(json.ResponseData);
        console.log(JSON.stringify(responseData));
        for (let i in responseData.SHOWLAYOUT) {
          let newObj = {
            name: responseData.SHOWLAYOUT[i].SHWLH_NAME,
            ename: responseData.SHOWLAYOUT[i].SHWLH_E_NAME,
            guid: responseData.SHOWLAYOUT[i].SHWLH_GUID,
            imageext: responseData.SHOWLAYOUT[i].IMAGEEXT,
            img:
              'file://' +
              (await fetchMenuImg(responseData.SHOWLAYOUT[i].SHWLH_GUID, responseData.SHOWLAYOUT[i].IMAGEEXT)),
            explain: responseData.SHOWLAYOUT[i].SHWLH_EXPLAIN,
          };
          tempArray.push(newObj);
        }
        dispatch(loginActions.jsonResult(tempArray));
        closeLoading();
        if (c == true) {
          navigation.navigate('BottomTabs');
        } else if (c == false) navigation.navigate('InterestScreen');
        else console.log('ERROR SOMETHING AT FETCH_DATAPROJECT');
      })
      .catch((error) => {
        console.error('_FetchDataProject ' + error);
      });
  };
  const fetchMenuImg = async (url, imageext) => {
    let imgbase64 = null;
    await RNFetchBlob.config({ fileCache: true, appendExt: imageext })
      .fetch(
        'GET',
        'http://192.168.0.110:8906/Member/BplusErpDvSvrIIS.dll/DownloadFile',
        {
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-GUID': loginReducer.guid,
          FilePath: 'ShowLayout',
          FileName: url + '.' + imageext,
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
    navigation.navigate('SelectBaseScreen');
    setIsLogin(true);
    closeLoading();
    dispatch(loginActions.login(true));
  };
  return (
    <SafeAreaView style={container1}>
      <StatusBar hidden={true} />
      <ScrollView>
        <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
          <View style={tabbar}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectBaseScreen')}>
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
              resizeMode="contain"
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
                maxLength={8}
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
          </ScrollView>
        </View>
      )}
      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            opacity: 0.5,
            backgroundColor: 'black',
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
          }}>
          <ActivityIndicator
            style={{
              borderRadius: 15,
              width: 100,
              height: 100,
              alignSelf: 'center',
            }}
            animating={loading}
            size="large"
            color={Colors.lightPrimiryColor}
          />
        </View>
      )}
    </SafeAreaView>
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
    padding: 10,
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
    reduxPassword: (payload) => dispatch(password(payload)),
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

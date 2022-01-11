import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import DatePicker from '../components/DatePicker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header, Button, Body, Picker, Left, Right, Title} from 'native-base';
import {Language} from '../translations/I18n';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {FontSize} from '../components/FontSizeHelper';
import {DateHelper} from '../components/DateHelper';
import DeviceInfo from 'react-native-device-info';
import Icons from 'react-native-vector-icons/FontAwesome';
import * as Constants from '../src/Constants';
import Colors from '../src/Colors';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import * as registerActions from '../src/actions/registerActions';
import * as userActions from '../src/actions/userActions';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
const RegisterScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(moment().format('YYYYMMDD'));
  const [rePass, setRePass] = useState('');
  const [resultJson, setResultJson] = useState('');
  const [GUID, setGUID] = useState('');
  const [machineNo, setMachineNo] = useState('');
  const registerReducer = useSelector(({registerReducer}) => registerReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(Language.t('register.select'));

  const [data, setData] = useState({
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const [data2, setdata2] = useState(false);
  const [data3, setdata3] = useState(false);

  const [newData, setNewData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    password: '',
    birthDate: moment().format('YYYYMMDD'),
    phoneNum: '',
    idCard: '',
  });
  const textInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const regisMacAdd = async () => {
    console.log('REGIS MAC ADDRESS');
    await fetch(userReducer.http + 'DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE":"' +
          registerReducer.machineNum +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "' +
          newData.phoneNum +
          '"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          await _fetchGuidLogin();
        } else {
          console.log('REGISTER MAC FAILED');
        }
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);
        console.log('http', userReducer.http);
        if (userReducer.http == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'),
          );
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'),
          );
        }
      });
  };

  const _fetchGuidLogin = async () => {
    console.log('FETCH GUID LOGIN');
    let GUID = '';
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
        setGUID(responseData.BPAPUS_GUID);
        GUID = responseData.BPAPUS_GUID;
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
      });
    await fetchUserData(GUID);
  };

  const fetchUserData = async (GUID) => {
    console.log('FETCH LookupErp');
    let xresult = '';

    await fetch(userReducer.http + 'LookupErp', {
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
            // Check User ID Card & Phone Number
            responseData.Mb000130[i].MB_I_CARD == newData.idCard &&
            responseData.Mb000130[i].MB_PHONE == newData.phoneNum
          ) {
            console.log('FETCH MbUsers');
            console.log(
              JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': GUID,
                'BPAPUS-FUNCTION': 'LoginByMobile',
                'BPAPUS-PARAM':
                  '{"MB_CNTRY_CODE": "66",    "MB_REG_MOBILE": "' +
                  newData.phoneNum +
                  '",    "MB_PW": "' +
                  '1234' +
                  '"}',
              }),
            );
            await fetch(userReducer.http + 'MbUsers', {
              method: 'POST',
              body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': GUID,
                'BPAPUS-FUNCTION': 'LoginByMobile',
                'BPAPUS-PARAM':
                  '{"MB_CNTRY_CODE": "66",    "MB_REG_MOBILE": "' +
                  newData.phoneNum +
                  '",    "MB_PW": "' +
                  '1234' +
                  '"}',
              }),
            })
              .then((response) => response.json())
              .then(async (json) => {
                if (json.ResponseCode == '635') {
                  console.log('NOT FOUND MEMBER');
                  Alert.alert(Language.t('login.errorNotfoundUsername'));
                  //_fetchNewMember(GUID);
                } else if (json.ResponseCode == '629') {
                  console.log('Function Parameter Required');
                } else if (json.ResponseCode == '200') {
                  let responseData = JSON.parse(json.ResponseData);
                  let MB_LOGIN_GUID = responseData.MB_LOGIN_GUID;
                  console.log('FETCH ShowMemberInfo');
                  await fetch(userReducer.http + 'Member', {
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
                    .then((json) => {
                      let responseData2 = JSON.parse(json.ResponseData);
                      console.log('responseData2 ### ' + responseData2);
                      if (json.ResponseCode == '200') {
                        setResultJson(responseData2.ShowMemberInfo[0]);

                        xresult = responseData2.ShowMemberInfo[0];
                        console.log('xresult ==> ' + JSON.stringify(xresult));
                        _onPressYes(responseData2.ShowMemberInfo[0]);
                      }
                      if (json.ResponseCode == '635') {
                      } else {
                        console.log(json.ReasonString);
                      }
                    })
                    .catch((error) => {
                      console.log('ERROR FETCH ShowMemberInfo: ' + error);
                    });
                } else {
                  console.log(json.ReasonString);
                }
              })
              .catch((error) =>
                console.log('ERROR FETCH LoginByMobile : ' + error),
              );
            c = false;
            break;
          } else {
            c = true;
          }
        }
        if (c) {
          Alert.alert(Language.t('login.errorNotfoundUsername'));
        }
      });
  };

  const getMacAddress = async () => {
    await DeviceInfo.getMacAddress().then((androidId) => {
      dispatch(registerActions.machine(androidId));
      setMachineNo(androidId);
    });
  };

  useEffect(() => {
    getMacAddress();
  }, []);

  const checKPassword = () => {
    if (newData.password !== rePass) {
      Alert.alert(Language.t('register.validationNotMatchPassword'));
    } else _setDispatch();
  };

  const _setDispatch = () => {
    let check = false;
    if (newData.title == '-') {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('profile.title'),
      );
      check = true;
    } else {
      dispatch(registerActions.nameTitle(newData.title));
      let sex = '';
      if (newData.title == 'นาย') {
        sex = 'M';
      } else if (newData.title == 'นาง' || newData.title == 'นางสาว') {
        sex = 'F';
      }
      setNewData({...newData, sex: sex});
    }
    if (newData.firstName == '' && !check) {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('profile.name'),
      );
      check = true;
    } else {
      dispatch(registerActions.firstName(newData.firstName));
    }
    if (newData.lastName == '' && !check) {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('profile.name'),
      );
      check = true;
    } else {
      dispatch(registerActions.lastName(newData.lastName));
    }
    if (newData.birthDate == '') {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('profile.birthday'),
      );
    } else {
      dispatch(registerActions.birthDate(newData.birthDate));
    }
    if (newData.idCard == '' && !check) {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('register.validationEmptyIdCard'),
      );
      check = true;
    } else if (newData.idCard.length >= 1 && newData.idCard.length < 13) {
      check = true;
      Alert.alert(Language.t('register.validationIncorrectIdCard'));
    }

    if (newData.phoneNum == '' && !check) {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('register.mobileNo'),
      );
      check = true;
    } else {
      dispatch(registerActions.phoneNum(newData.phoneNum));
    }

    if (newData.password == '' && !check) {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('register.password'),
      );
      check = true;
    } else if (newData.password.length >= 1 && newData.password.length < 6) {
      check = true;
      Alert.alert(Language.t('register.validationLessPassword'));
    } else {
      dispatch(registerActions.password(newData.password));
    }
    if (!check) {
      regisMacAdd();
    }
  };

  const _onPressYes = async (xresult) => {
    console.log('ON PRESS YES');
    const navi = 'LoginScreen';
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
      password: newData.password,
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
    //New user
    if (temp.length == 0) {
      temp.push(newUser);
      dispatch(userActions.setUserData(temp));

      //Alert.alert(Language.t('register.alertRegisterSuccess'));

      navigation.navigate('AuthenticationScreen', {navi: navi});
    } else {
      for (let i in temp) {
        /* old user*/
        if (newUser.card == temp[i].card) {
          temp[i] = newUser;
          //Alert.alert(Language.t('register.alertRegisterSuccess'));
          navigation.navigate('AuthenticationScreen', {navi: navi});
          return;
        }
      }

      temp.push(newUser);
      dispatch(userActions.setUserData(temp));
      //Alert.alert(Language.t('register.alertRegisterSuccess'));
      navigation.navigate('AuthenticationScreen', {navi: navi});
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        style={{
          backgroundColor: Colors.backgroundColorSecondary,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icons size={35} name="angle-left" />
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'black'}}>
            {Language.t('register.header')}
          </Title>
        </Body>
        <Right />
      </Header>
      <View style={styles.container1}>
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={100}
            enabled>
            <ScrollView>
              <Text
                style={{
                  fontSize: FontSize.large,
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                  color: Colors.textColor,
                }}>
                {Language.t('register.titleHeader')}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.textTitle2}>
                  {Language.t('profile.title')}
                </Text>
                {Platform.OS === 'ios' ? (
                  <View
                    style={{
                      borderWidth: 0.7,
                      borderColor: 'gray',
                      marginLeft: 5,
                      flex: 1,
                    }}>
                    <Picker
                      headerBackButtonText={Language.t('button.back')}
                      iosHeader={Language.t('profile.title')}
                      mode="dropdown"
                      style={{
                        width: deviceWidth,
                      }}
                      placeholder={title}
                      selectedValue={title}
                      onValueChange={(item) => {
                        let M = 'M';
                        let F = 'F';
                        if (item == 'นาย') {
                          setNewData({...newData, sex: M});
                        } else if (item == 'นาง' || item == 'นางสาว') {
                          setNewData({...newData, sex: F});
                        } else {
                          setNewData({...newData, sex: '-'});
                        }
                        setNewData({...newData, title: item});
                        setTitle(item);
                      }}>
                      <Picker.Item
                        label={Language.t('register.select')}
                        value="-"
                      />
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาย" value="นาย" />
                      ) : (
                        <Picker.Item label="Mr." value="นาย" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาง" value="นาง" />
                      ) : (
                        <Picker.Item label="Mrs" value="นาง" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นางสาว" value="นางสาว" />
                      ) : (
                        <Picker.Item label="Miss" value="นางสาว" />
                      )}
                    </Picker>
                  </View>
                ) : (
                  <View
                    style={{
                      borderWidth: 0.7,
                      borderColor: 'gray',
                      marginLeft: 5,
                      flex: 1,
                    }}>
                    <Picker
                      selectedValue={title}
                      mode="dropdown"
                      onValueChange={(item) => {
                        let M = 'M';
                        let F = 'F';
                        if (item == 'นาย') {
                          setNewData({...newData, sex: M});
                        } else if (item == 'นาง' || item == 'นางสาว') {
                          setNewData({...newData, sex: F});
                        } else {
                          setNewData({...newData, sex: '-'});
                        }
                        setNewData({...newData, title: item});
                        setTitle(item);
                      }}
                      itemStyle={{
                        width: 30,
                      }}>
                      <Picker.Item
                        label={Language.t('register.select')}
                        value="-"
                      />

                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาย" value="นาย" />
                      ) : (
                        <Picker.Item label="Mr." value="นาย" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาง" value="นาง" />
                      ) : (
                        <Picker.Item label="Mrs" value="นาง" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นางสาว" value="นางสาว" />
                      ) : (
                        <Picker.Item label="Miss" value="นางสาว" />
                      )}
                    </Picker>
                  </View>
                )}
              </View>
              <Text style={styles.textTitle}>
                {Language.t('profile.firstName')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  keyboardType="default"
                  maxLength={15}
                  placeholder={Language.t('register.titleHeader')}
                  placeholderTextColor={Colors.fontColorSecondary}
                  onChangeText={(val) => {
                    textInputChange(val);
                    setNewData({...newData, firstName: val});
                  }}
                />
                {data.check_textInputChange ? (
                  <Icons name="check-circle" size={25} color="#0288D1" />
                ) : null}
              </View>

              <Text style={styles.textTitle}>
                {Language.t('profile.lastName')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor={Colors.fontColorSecondary}
                  keyboardType="default"
                  maxLength={13}
                  placeholder={Language.t('register.titleHeader')}
                  onChangeText={(val) => {
                    setNewData({...newData, lastName: val});

                    if (val === '') {
                      setdata2(false);
                    } else {
                      setdata2(true);
                    }
                  }}
                />
                {data2 ? (
                  <Icons name="check-circle" size={25} color="#0288D1" />
                ) : null}
              </View>
              <Text style={styles.textTitle}>
                {Language.t('profile.birthday')}
              </Text>
              <DatePicker
                date={date}
                onChange={(date) => {
                  if (date) {
                    let arr = moment(date).format('L').split('/');
                    console.log(arr[2].concat(arr[1]).concat(arr[0]));
                    setDate(arr[2].concat(arr[1]).concat(arr[0]));
                    setNewData({
                      ...newData,
                      birthDate: arr[2].concat(arr[1]).concat(arr[0]),
                    });
                  }
                }}
              />

              <Text style={styles.textTitle}>
                {Language.t('register.mobileNo')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.fontColorSecondary}
                  maxLength={10}
                  dataDetectorTypes="phoneNumber"
                  placeholder={Language.t(
                    'register.validationEmptyPhoneNumber',
                  )}
                  onChangeText={(val) => {
                    setNewData({...newData, phoneNum: val});
                    setdata3(true);
                    if (val === '') {
                      setdata3(false);
                    }
                  }}
                />
                {data3 ? (
                  <Icons
                    name="check-circle"
                    size={25}
                    color={Colors.buttonColorPrimary}></Icons>
                ) : null}
              </View>
              <Text style={styles.textTitle}>
                {Language.t('register.idCard')}
              </Text>
              <TextInput
                placeholderTextColor={Colors.fontColorSecondary}
                maxLength={13}
                placeholder={Language.t('register.validationEmptyIdCard')}
                onChangeText={(val) => {
                  setNewData({...newData, idCard: val});
                }}
                style={styles.textInput}></TextInput>

              <Text style={styles.textTitle}>
                {Language.t('register.password')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  placeholderTextColor={Colors.fontColorSecondary}
                  keyboardType="default"
                  maxLength={8}
                  placeholder={Language.t('register.validationEmptyPassword')}
                  autoCapitalize="none"
                  onChangeText={(val) => {
                    handlePasswordChange(val);
                    setNewData({...newData, password: val});
                  }}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Icons
                      name="eye-slash"
                      size={25}
                      color={Colors.buttonColorPrimary}
                    />
                  ) : (
                    <Icons
                      name="eye"
                      size={25}
                      color={Colors.buttonColorPrimary}></Icons>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.textTitle}>
                {Language.t('register.confirmPassword')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  placeholderTextColor={Colors.fontColorSecondary}
                  keyboardType="default"
                  autoCapitalize="none"
                  onChangeText={(val) => {
                    handlePasswordChange(val);
                    setRePass(val);
                  }}
                  maxLength={8}
                  placeholder={Language.t(
                    'register.validationEmptyConfirmPassword',
                  )}
                />
              </View>

              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                }}>
                <TouchableNativeFeedback onPress={checKPassword}>
                  <View style={styles.button}>
                    <Text style={styles.textButton}>
                      {Language.t('register.buttonRegister')}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <ScrollView enabled={true}>
            <KeyboardAvoidingView
              behavior={'padding'}
              enabled
              keyboardVerticalOffset={-170}>
              <Text
                style={{
                  fontSize: FontSize.large,
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                  color: Colors.textColor,
                }}>
                {Language.t('register.titleHeader')}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.textTitle2}>
                  {Language.t('profile.title')}
                </Text>
                {Platform.OS === 'ios' ? (
                  <View
                    style={{
                      borderWidth: 0.7,
                      borderColor: 'gray',
                      marginLeft: 5,
                      flex: 1,
                    }}>
                    <Picker
                      headerBackButtonText={Language.t('button.back')}
                      iosHeader={Language.t('profile.title')}
                      mode="dropdown"
                      style={{
                        width: deviceWidth,
                      }}
                      placeholder={title}
                      selectedValue={title}
                      onValueChange={(item) => {
                        let M = 'M';
                        let F = 'F';
                        if (item == 'นาย') {
                          setNewData({...newData, sex: M});
                        } else if (item == 'นาง' || item == 'นางสาว') {
                          setNewData({...newData, sex: F});
                        } else {
                          setNewData({...newData, sex: '-'});
                        }
                        setNewData({...newData, title: item});
                        setTitle(item);
                      }}>
                      <Picker.Item
                        label={Language.t('register.select')}
                        value="-"
                      />
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาย" value="นาย" />
                      ) : (
                        <Picker.Item label="Mr." value="นาย" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาง" value="นาง" />
                      ) : (
                        <Picker.Item label="Mrs" value="นาง" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นางสาว" value="นางสาว" />
                      ) : (
                        <Picker.Item label="Miss" value="นางสาว" />
                      )}
                    </Picker>
                  </View>
                ) : (
                  <View
                    style={{
                      borderWidth: 0.7,
                      borderColor: 'gray',
                      marginLeft: 5,
                      flex: 1,
                    }}>
                    <Picker
                      selectedValue={title}
                      mode="dropdown"
                      onValueChange={(item) => {
                        let M = 'M';
                        let F = 'F';
                        if (item == 'นาย') {
                          setNewData({...newData, sex: M});
                        } else if (item == 'นาง' || item == 'นางสาว') {
                          setNewData({...newData, sex: F});
                        } else {
                          setNewData({...newData, sex: '-'});
                        }
                        setNewData({...newData, title: item});
                        setTitle(item);
                      }}
                      itemStyle={{
                        width: 30,
                      }}>
                      <Picker.Item
                        label={Language.t('register.select')}
                        value="-"
                      />

                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาย" value="นาย" />
                      ) : (
                        <Picker.Item label="Mr." value="นาย" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นาง" value="นาง" />
                      ) : (
                        <Picker.Item label="Mrs" value="นาง" />
                      )}
                      {Language.getLang() === 'th' ? (
                        <Picker.Item label="นางสาว" value="นางสาว" />
                      ) : (
                        <Picker.Item label="Miss" value="นางสาว" />
                      )}
                    </Picker>
                  </View>
                )}
              </View>
              <Text style={styles.textTitle}>
                {Language.t('profile.firstName')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  keyboardType="default"
                  maxLength={15}
                  placeholder={Language.t('register.titleHeader')}
                  placeholderTextColor={Colors.fontColorSecondary}
                  onChangeText={(val) => {
                    textInputChange(val);
                    setNewData({...newData, firstName: val});
                  }}
                />
                {data.check_textInputChange ? (
                  <Icons name="check-circle" size={25} color="#0288D1" />
                ) : null}
              </View>

              <Text style={styles.textTitle}>
                {Language.t('profile.lastName')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor={Colors.fontColorSecondary}
                  keyboardType="default"
                  maxLength={13}
                  placeholder={Language.t('register.titleHeader')}
                  onChangeText={(val) => {
                    setNewData({...newData, lastName: val});

                    if (val === '') {
                      setdata2(false);
                    } else {
                      setdata2(true);
                    }
                  }}
                />
                {data2 ? (
                  <Icons name="check-circle" size={25} color="#0288D1" />
                ) : null}
              </View>
              <Text style={styles.textTitle}>
                {Language.t('profile.birthday')}
              </Text>
              <DatePicker
                date={date}
                onChange={(date) => {
                  if (date) {
                    let arr = moment(date).format('L').split('/');
                    console.log(arr[2].concat(arr[1]).concat(arr[0]));
                    setDate(arr[2].concat(arr[1]).concat(arr[0]));
                    setNewData({
                      ...newData,
                      birthDate: arr[2].concat(arr[1]).concat(arr[0]),
                    });
                  }
                }}
              />

              <Text style={styles.textTitle}>
                {Language.t('register.mobileNo')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.fontColorSecondary}
                  maxLength={10}
                  dataDetectorTypes="phoneNumber"
                  placeholder={Language.t(
                    'register.validationEmptyPhoneNumber',
                  )}
                  onChangeText={(val) => {
                    setNewData({...newData, phoneNum: val});
                    setdata3(true);
                    if (val === '') {
                      setdata3(false);
                    }
                  }}
                />
                {data3 ? (
                  <Icons
                    name="check-circle"
                    size={25}
                    color={Colors.buttonColorPrimary}></Icons>
                ) : null}
              </View>
              <Text style={styles.textTitle}>
                {Language.t('register.idCard')}
              </Text>
              <TextInput
                placeholderTextColor={Colors.fontColorSecondary}
                maxLength={13}
                placeholder={Language.t('register.validationEmptyIdCard')}
                onChangeText={(val) => {
                  setNewData({...newData, idCard: val});
                }}
                style={styles.textInput}></TextInput>

              <Text style={styles.textTitle}>
                {Language.t('register.password')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  placeholderTextColor={Colors.fontColorSecondary}
                  keyboardType="default"
                  maxLength={8}
                  placeholder={Language.t('register.validationEmptyPassword')}
                  autoCapitalize="none"
                  onChangeText={(val) => {
                    handlePasswordChange(val);
                    setNewData({...newData, password: val});
                  }}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Icons
                      name="eye-slash"
                      size={25}
                      color={Colors.buttonColorPrimary}
                    />
                  ) : (
                    <Icons
                      name="eye"
                      size={25}
                      color={Colors.buttonColorPrimary}></Icons>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.textTitle}>
                {Language.t('register.confirmPassword')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  alignItems: 'center',
                }}>
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  placeholderTextColor={Colors.fontColorSecondary}
                  keyboardType="default"
                  autoCapitalize="none"
                  onChangeText={(val) => {
                    handlePasswordChange(val);
                    setRePass(val);
                  }}
                  maxLength={8}
                  placeholder={Language.t(
                    'register.validationEmptyConfirmPassword',
                  )}
                />
              </View>

              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                }}>
                <TouchableNativeFeedback onPress={checKPassword}>
                  <View style={styles.button}>
                    <Text style={styles.textButton}>
                      {Language.t('register.buttonRegister')}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundColorSecondary,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 20,
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  textTitle: {
    marginTop: Platform.OS === 'ios' ? 15 : 7,
    fontSize: FontSize.medium,
    color: Colors.fontColor,
  },
  textTitle2: {
    alignSelf: 'center',
    fontSize: FontSize.medium,
    color: Colors.fontColor,
  },
  textButton: {
    color: Colors.fontColor2,
    fontSize: FontSize.medium,
    padding: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  textInput: {
    flex: 8,
    borderColor: 'gray',
    color: Colors.inputText,
    marginTop: Platform.OS === 'ios' ? 10 : 5,
    fontSize: FontSize.medium,
    borderWidth: 0.7,
    paddingVertical: Platform.OS === 'ios' ? 15 : undefined,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : undefined,
  },
});
const mapStateToProps = (state) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

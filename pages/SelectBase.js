import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Text,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import { Picker, } from 'native-base';
import { useStateIfMounted } from 'use-state-if-mounted';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNRestart from 'react-native-restart';

import { connect } from 'react-redux';
import Icons from 'react-native-vector-icons/FontAwesome';
import Colors from '../src/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FontSize } from '../components/FontSizeHelper';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog';
import { Language, changeLanguage } from '../translations/I18n';

import DeviceInfo from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';

const SelectBase = ({ route }) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
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
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);

  const [selectedValue, setSelectedValue] = useState('');
  const [selectbaseValue, setSelectbaseValue] = useState('-1');
  const [selectlanguage, setlanguage] = useState(Language.getLang() == 'th' ? 'th' : 'en');
  const [basename, setBasename] = useState('');
  const [baseurl, setBsaeurl] = useState('');
  const [username, setUsername] = useState('BUSINESS');
  const [password, setPassword] = useState('SYSTEM64');
  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);
  const [loading_backG, setLoading_backG] = useStateIfMounted(true);
  const [machineNo, setMachineNo] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(loginReducer.ipAddress.length > 0 ? loginReducer.ipAddress : '');
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });
  const [updateindex, setUpdateindex] = useState(null)
  const image = '../images/UI/endpoint/4x/Asset12_4x.png';
  const setlanguageState = (itemValue) => {
    setLoading(true)
    dispatch(loginActions.setLanguage(itemValue))
    navigation.dispatch(
      navigation.replace('LoginScreen', { Language: itemValue })
    )
    console.log(itemValue)
  }
  var a = 0

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const fetchData = () => {
    navigation.dispatch(
      navigation.replace('SelectScreen', { data: a })
    )
  }
  useEffect(() => {
    if (databaseReducer.Data.nameser)
      _onPressSelectbaseValue(databaseReducer.Data.nameser)
    console.log(username)
    console.log(password)
  }, []);

  useEffect(() => {
    if (route.params?.post) {
      setBasename(route.params.post.value)
      setBsaeurl(route.params.post.label)
    }
  }, [route.params?.post]);
  useEffect(() => {
    if (loginReducer.language && loginReducer.language != Language.getLang()) {
      console.log('loginReducer.Language >> ', loginReducer.language)
      changeLanguage(loginReducer.language);
      setlanguage(loginReducer.language)
    }
    //backsakura 
  }, [loginReducer.language]);
  const _onPressSelectbaseValue = async (itemValue) => {
    console.log(itemValue)
    setSelectbaseValue(itemValue)
    if (itemValue != '-1') {
      for (let i in items) {
        if (items[i].nameser == itemValue) {
          setBasename(items[i].nameser)
          setBsaeurl(items[i].urlser)
          setUsername(items[i].usernameser)
          setPassword(items[i].passwordser)
          setUpdateindex(i)
        }
      }
    } else {
      setBasename('')
      setBsaeurl('')

    }
  }

  const _onPressSelected = async () => {
    setLoading(true)
    for (let i in items) {
      if (items[i].nameser == selectbaseValue) {
        dispatch(databaseActions.setData(items[i]));
        Alert.alert(
          Language.t('alert.succeed'),
          Language.t('selectBase.connect') + ' ' + selectbaseValue + ' ' + Language.t('alert.succeed'), [{
            text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
              navigation.replace('LoginScreen', {})
            )
          }]);

      }
    }
  }
  const _onPressEdit = () => {
    a = Math.floor(100000 + Math.random() * 900000);
    console.log(a)
    console.log(databaseReducer.Data.nameser)
    console.log(selectbaseValue)
    if (databaseReducer.Data.nameser == selectbaseValue) {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('selectBase.cannotEdit'), [{
          text: Language.t('alert.ok'), onPress: () => { }
        }]);
    } else {
      navigation.navigate('EditBase', {
        selectbaseValue: selectbaseValue,
        data: a
      });
    }

  }

  const checkValue = () => {
    let c = true
    if (basename == '') {

      c = false
    }
    else if (baseurl == '') {

      c = false
    }
    else if (username == '') {

      c = false
    }
    else if (password == '') {

      c = false
    }
    return c
  }
  const _onPressUpdate = async (basename, newurl) => {
    setLoading(true)

    if (checkValue() == true) {
      await checkIPAddress('-1')
    }
  }
  const _onPressDelete = async () => {
    setLoading(true)

    let temp = loginReducer.ipAddress;
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    if (baseurl == databaseReducer.Data.urlser) {
      Alert.alert('', Language.t('selectBase.cannotDelete'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else {
      if (temp.length == 1) {
        Alert.alert('', Language.t('selectBase.cannotDelete'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      } else {
        for (let i in loginReducer.ipAddress) {
          if (loginReducer.ipAddress[i].urlser == baseurl) {
            Alert.alert('', Language.t('selectBase.questionDelete'), [{
              text: Language.t('alert.ok'), onPress: () => {
                temp.splice(i, 1);
                dispatch(loginActions.ipAddress(temp));
                fetchData()
              }
            }, { text: Language.t('alert.cancel'), onPress: () => { } }]);
            break;
          }
        }

      }
    }
    setLoading(false)
  }

  const _onPressAddbase = async () => {
    setLoading(true)
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    let temp = []
    let check = false;
    let checktest = false;

    if (checkValue() == true) {
      temp = items;
      for (let i in items) {
        if (i != updateindex) {
          if (items[i].nameser != basename && items[i].urlser == newurl) {
            checktest = true
          } else if (items[i].nameser == basename && items[i].urlser != newurl) {
            checktest = true
          }
        }
      }
      if (!checktest) {
        for (let i in items) {
          if (items[i].nameser == basename && items[i].urlser == newurl) {
            checkIPAddress('0')
            check = true;
          } else {
            if (
              items[i].nameser == basename
            ) {
              Alert.alert(Language.t('selectBase.Alert'), Language.t('selectBase.Alert2') + Language.t('selectBase.url'), [{
                text: Language.t('selectBase.yes'), onPress: () => _onPressUpdate(basename, newurl)
              }, { text: Language.t('selectBase.no'), onPress: () => console.log('cancel Pressed') }]);
              check = true;
              break;
            } else if (
              items[i].urlser == newurl
            ) {
              Alert.alert(Language.t('selectBase.Alert'), Language.t('selectBase.Alert2') + Language.t('selectBase.name'), [{
                text: Language.t('selectBase.yes'), onPress: () => _onPressUpdate(basename, newurl)
              }, { text: Language.t('selectBase.no'), onPress: () => console.log('cancel Pressed') }]);
              check = true;
              break;
            }
          }
        }
        if (!check) {
          checkIPAddress('1')
        } else {
          setLoading(false)
        }
      } else {
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('selectBase.Alert3'), [{ text: Language.t('alert.ok'), onPress: () => _onPressSelectbaseValue(selectbaseValue) }]);
        setLoading(false)
      }
      setLoading(false)
    } else {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      setLoading(false)
    }

  }



  const checkIPAddress = async (state) => {
    let tempurl = baseurl.split('.dll')
    let newurl = tempurl[0] + '.dll'
    let temp = []

    await fetch(baseurl + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{ "BPAPUS-MACHINE": "11111122","BPAPUS-CNTRY-CODE": "66", "BPAPUS-MOBILE": "0828845662"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          fetch(newurl + '/DevUsers', {
            method: 'POST',
            body: JSON.stringify({
              'BPAPUS-BPAPSV': loginReducer.serviceID,
              'BPAPUS-LOGIN-GUID': '',
              'BPAPUS-FUNCTION': 'Login',
              'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE": "11111122","BPAPUS-USERID": "' +
                username +
                '","BPAPUS-PASSWORD": "' +
                password +
                '"}',
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              if (json && json.ResponseCode == '200') {
                let newObj = {
                  nameser: basename,
                  urlser: newurl,
                  usernameser: username,
                  passwordser: password
                }
                console.log(json.ResponseCode)
                if (state == '-1') {
                  for (let i in loginReducer.ipAddress) {
                    if (i == updateindex) {
                      temp.push(newObj)
                    } else {
                      temp.push(loginReducer.ipAddress[i])
                    }
                  }
                  dispatch(loginActions.ipAddress(temp))
                  dispatch(databaseActions.setData(newObj))
                } else if (state == '1') {
                  if (items.length > 0) {
                    for (let i in items) {
                      temp.push(items[i])
                    }
                  }
                  temp.push(newObj)
                  dispatch(loginActions.ipAddress(temp))
                  dispatch(databaseActions.setData(newObj))
                } else if (state == '0') {
                  dispatch(databaseActions.setData(newObj))
                }

                Alert.alert(
                  Language.t('alert.succeed'),
                  Language.t('selectBase.connect') + ' ' + basename + ' ' + Language.t('alert.succeed'), [{
                    text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
                      navigation.replace('LoginScreen', {})
                    )
                  }]);
              } else {
                console.log('Function Parameter Required');
                let temp_error = 'error_ser.' + json.ResponseCode;
                console.log('>> ', temp_error)
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => _onPressSelectbaseValue(selectbaseValue) }]);
              }
              setLoading(false)
            })
            .catch((error) => {
              Alert.alert(
                Language.t('alert.errorTitle'),
                Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => _onPressSelectbaseValue(selectbaseValue) }]);
              console.error('_fetchGuidLogin ' + error);
              setLoading(false)
            });
        } else {
          console.log('Function Parameter Required');
          let temp_error = 'error_ser.' + json.ResponseCode;
          console.log('>> ', temp_error)
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t(temp_error), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)
      })
      .catch((error) => {
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        console.log('checkIPAddress');
        setLoading(false)
      });


  };

  return (
    <View style={container1}>


      <View style={tabbar}>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Icons size={FontSize.large} name="angle-left" style={{ color: 'black' }} />

          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 12,
              fontSize: FontSize.medium,
              color: 'black'
            }}> {Language.t('selectBase.header')}</Text>
        </View>
        <View>
          <Picker
            selectedValue={selectlanguage}
            style={{ color: Colors.backgroundLoginColor, width: 100 }}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => Alert.alert('', Language.t('menu.changeLanguage'), [{ text: Language.t('alert.ok'), onPress: () => setlanguageState(itemValue) }, { text: Language.t('alert.cancel'), onPress: () => { } }])}
          >
            <Picker.Item color={Colors.backgroundLoginColor} label="TH" value="th" />
            <Picker.Item color={Colors.backgroundLoginColor} label="EN" value="en" />
          </Picker>
        </View>
      </View>

      <ScrollView>
        <SafeAreaView >
          <KeyboardAvoidingView >
            <View style={styles.body}>
              <View style={styles.body1}>
                <Text style={styles.textTitle}>
                  {Language.t('selectBase.title')} :
                </Text>
              </View>
              <View style={{
                marginTop: 10, flexDirection: 'row',
                justifyContent: 'center', borderColor: items.length > 0 ? Colors.borderColor : '#979797', backgroundColor: Colors.backgroundColorSecondary, borderWidth: 1, padding: 10, borderRadius: 10,
              }}>
                <Text style={{ fontSize: FontSize.large }}></Text>
                {items.length > 0 ? (
                  <Picker
                    selectedValue={selectbaseValue}
                    enabled={true}
                    mode="dropdown"
                    state={{ color: Colors.backgroundLoginColor  }}
                    onValueChange={(itemValue, itemIndex) => _onPressSelectbaseValue(itemValue)}>
                    {items.map((obj, index) => {
                      return (
                        <Picker.Item label={obj.nameser} color={Colors.backgroundLoginColor} value={obj.nameser} />
                      )
                    })}
                    {
                      <Picker.Item
                        value="-1"
                        color={"#979797"}
                        label={Language.t('selectBase.lebel')}
                      />
                    }
                  </Picker>
                ) : (
                  <Picker
                    selectedValue={selectbaseValue}
                    state={{ color: Colors.borderColor, backgroundColor: Colors.borderColor }}
                    onValueChange={(itemValue, itemIndex) => _onPressSelectbaseValue(itemValue)}
                    enabled={false}
                    mode="dropdown"

                  >
                    {
                      <Picker.Item
                        value="-1"
                        color={"#979797"}
                        label={Language.t('selectBase.lebel')}
                      />
                    }
                  </Picker>
                )}
              </View>


              <View style={{ marginTop: 10 }}>
                <Text style={styles.textTitle}>
                  {Language.t('selectBase.name')} :
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    backgroundColor: Colors.backgroundColorSecondary,
                    flexDirection: 'column',
                    height: 50,
                    borderRadius: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderColor: 'gray',
                    borderWidth: 0.7,

                  }}>
                  <View style={{ height: 30, flexDirection: 'row', }}>
                    <Image
                      style={{ height: 30, width: 30 }}
                      resizeMode={'contain'}
                      source={require('../images/UI/endpoint/4x/Asset18_4x.png')}
                    />
                    <TextInput
                      style={{
                        flex: 8,
                        marginLeft: 10,
                        borderBottomColor: Colors.borderColor,
                        color: Colors.fontColor,
                        paddingVertical: 3,
                        fontSize: FontSize.medium,
                        borderBottomWidth: 0.7,
                      }}

                      placeholderTextColor={Colors.fontColorSecondary}

                      placeholder={Language.t('selectBase.name') + '..'}
                      value={basename}
                      onChangeText={(val) => {
                        setBasename(val);
                      }}></TextInput>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('ScanScreen', { route: 'SelectScreen' })}>

                      <Icons
                        name="qrcode"
                        size={25}
                        color={Colors.backgroundLoginColor}

                      />

                    </TouchableOpacity>

                  </View>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.textTitle}>
                  {Language.t('selectBase.url')} :
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    backgroundColor: Colors.backgroundColorSecondary,
                    flexDirection: 'column',
                    height: 50,
                    borderRadius: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    height: 'auto',
                    paddingBottom: 10,
                    borderColor: 'gray',
                    borderWidth: 0.7,
                  }}>
                  <View style={{ height: 'auto', flexDirection: 'row' }}>
                    <Image
                      style={{ height: 30, width: 30 }}
                      resizeMode={'contain'}
                      source={require('../images/UI/endpoint/4x/Asset19_4x.png')}
                    />
                    <TextInput
                      style={{
                        flex: 8,
                        marginLeft: 10,
                        borderBottomColor: Colors.borderColor,
                        color: Colors.fontColor,
                        paddingVertical: 3,
                        fontSize: FontSize.medium,
                        height: 'auto',
                        borderBottomWidth: 0.7,
                      }}
                      multiline={true}
                      placeholderTextColor={Colors.fontColorSecondary}

                      value={baseurl}
                      placeholder={Language.t('selectBase.url') + '..'}
                      onChangeText={(val) => {
                        setBsaeurl(val);
                      }}></TextInput>

                  </View>
                </View>
              </View>



              <View style={styles.body1e}>
                <TouchableNativeFeedback
                  onPress={() => _onPressAddbase()}>
                  <View
                    style={{
                      borderRadius: 10,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: 50,
                      marginRight: 10, width: deviceWidth - 200,
                      backgroundColor: Colors.backgroundLoginColor,
                    }}>
                    <Text
                      style={{
                        color: Colors.backgroundColorSecondary,
                        alignSelf: 'center',
                        fontSize: FontSize.medium,
                        fontWeight: 'bold',
                      }}>
                      {Language.t('selectBase.saveandconnect')}
                    </Text>
                  </View>
                </TouchableNativeFeedback>

                {items.length > 0 ? (

                  <TouchableNativeFeedback
                    onPress={() => _onPressDelete()}>
                    <View
                      style={{
                        borderRadius: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: 50,
                        width: deviceWidth - 250,
                        backgroundColor: Colors.alert,
                      }}>
                      <Text
                        style={{
                          color: Colors.backgroundColorSecondary,
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold',
                        }}>
                        {Language.t('selectBase.delete')}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>

                ) : (

                  <TouchableNativeFeedback
                    onPress={() => null}>
                    <View
                      style={{
                        borderRadius: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: 50,
                        width: deviceWidth - 250,
                        backgroundColor: '#979797',
                      }}>
                      <Text
                        style={{
                          color: Colors.fontColor,
                          alignSelf: 'center',
                          fontSize: FontSize.medium,
                          fontWeight: 'bold',

                        }}>
                        {Language.t('selectBase.delete')}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                )}

              </View>
            </View>

          </KeyboardAvoidingView>

        </SafeAreaView>
      </ScrollView>


      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            opacity: 0.5,
            backgroundColor: Colors.backgroundColorSecondary,
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
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container1: {

    flex: 1,

  },
  body: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  body1e: {
    marginTop: 20, marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center'

  },
  body1: {
    marginTop: 10,
    flexDirection: "row",
  },
  tabbar: {

    padding: 5,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColorSecondary,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  dorpdown: {
    justifyContent: 'center',
    fontSize: FontSize.medium,
  },
  dorpdownTop: {
    justifyContent: 'flex-end',
    fontSize: FontSize.medium,
  },
  textTitle: {
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
    height: deviceHeight / 3,
    width: deviceWidth,

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
  checkboxContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
    borderBottomColor: '#ffff',
    color: '#ffff',
  },
  label: {
    margin: 8,
    color: '#ffff',
  },
});
const mapStateToProps = (state) => {
  return {


  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    reduxMachineNum: (payload) => dispatch(registerActions.machine(payload)),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectBase);

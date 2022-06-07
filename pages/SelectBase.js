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
import RNFetchBlob from 'rn-fetch-blob';
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

  const _addGUID_proJ = async (guid) => {
    await fetch(baseurl + '/ECommerce', {
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
          if (responseData.Ec000400.length>0) {
            console.log(`new project ID >> ${responseData.Ec000400[0].SHWJH_GUID}`)
            dispatch(loginActions.projectId(responseData.Ec000400[0].SHWJH_GUID))
            _FetchDataProject(guid, responseData.Ec000400[0].SHWJH_GUID)
            return true
          } else {
            Alert.alert(
              Language.t('alert.errorTitle'),
              "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
            return false
          }
        } else {
          return false
        }
        

      })
      .catch((error) => {
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        console.log('checkIPAddress>>', error);
        return false
      });
  };
  const _FetchDataProject = async (guid, projectID) => {
    await fetch(baseurl + '/ECommerce', {
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
            Alert.alert(
              Language.t('alert.succeed'),
              Language.t('selectBase.connect') + ' ' + basename + ' ' + Language.t('alert.succeed'), [{
                text: Language.t('alert.ok'), onPress: () => navigation.dispatch(
                  navigation.replace('LoginScreen', {})
                )
              }]);
          } else {
            Alert.alert(
              Language.t('alert.errorTitle'),
              "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          }

        } else {
          Alert.alert(
              Language.t('alert.errorTitle'),
              "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }

      })
      .catch((error) => {

        console.error('_FetchDataProject >> ' + error);
        Alert.alert(
          Language.t('alert.errorTitle'),
          "ไม่พบรหัสโครงการ MEMBER ON CLOUD", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      })
  }
  const getsortTempLAYOUT = async (TempLAYOUT) => {
    let sortTempLAYOUT = []
    console.log(sortTempLAYOUT)
    // TempLAYOUT.map((items, index) => console.log(items.SHWLH_CODE))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_REDEEM_01') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_REDEEM_02') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_MYCARD') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_CONTACT') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_CONDION') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_NOTI') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_CAMPAIGN') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_TNT') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_ABOUTCARD') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_ACTIVITY') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_SPLASH') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_BANNER') }).map((items) => console.log(items))
    // await TempLAYOUT.filter((item) => { return (item.SHWLH_CODE == 'MB_LO_INSTRUCTION') }).map((items) => console.log(items))

    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_REDEEM_01') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_REDEEM_02') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_MYCARD') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_CONTACT') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_CONDION') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_NOTI') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_CAMPAIGN') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_TNT') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_ABOUTCARD') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_ACTIVITY') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_SPLASH') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_BANNER') sortTempLAYOUT.push(item) })
    await TempLAYOUT.map((item) => { if (item.SHWLH_CODE == 'MB_LO_INSTRUCTION') sortTempLAYOUT.push(item) })

    return sortTempLAYOUT

  }


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
            .then(async(json) => {
              if (json && json.ResponseCode == '200') {
                let responseData = JSON.parse(json.ResponseData);
           
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
                  _addGUID_proJ(responseData.BPAPUS_GUID)
                
              
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
        console.log('checkIPAddress>>', error);
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
                    state={{ color: Colors.backgroundLoginColor }}
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

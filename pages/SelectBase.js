import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Text,
  Platform,
  Alert,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import RNRestart from 'react-native-restart';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  Container,
  Header,
  Content,
  Left,
  Right,
  Title,
  Body,
  Button,
  Picker,
  Form,
} from 'native-base';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../src/Colors';
import {useSelector, useDispatch} from 'react-redux';
import {FontSize} from '../components/FontSizeHelper';
import * as loginActions from '../src/actions/loginActions';
import * as userActions from '../src/actions/userActions';
import Dialog from 'react-native-dialog';
import {Language} from '../translations/I18n';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const SelectBase = ({navigation, route}) => {
  const [titleName, setTitleName] = useState('');
  const [isShowDialog, setShowDialog] = useState(false);
  const [isShowDialog2, setShowDialog2] = useState(false);
  const [isShowDialog3, setShowDialog3] = useState(false);
  const [ipAddress, setIpAddress] = useState('IP Address:');
  const dispatch = useDispatch();
  const userReducer = useSelector(({userReducer}) => userReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const [title, setTitle] = useState(() => {
    if (userReducer.http == '' && userReducer.userData.length == 0) {
      return '-1';
    } else {
      return userReducer.http;
    }
  });
  const handleYes = async () => {
    let temp = [];
    temp = loginReducer.ipAddress;
    if (route.params) {
      temp.push(route.params.post);
      dispatch(loginActions.ipAddress(temp));
      dispatch(userActions.setUserHttp(route.params.post.label));
      setShowDialog(false);
      setTimeout(() => {
        RNRestart.Restart();
      }, 1000);
    } else {
      let x = await checkIPAddress(titleName);
      if (!x) {
        Alert.alert('ไม่สามารถเชื่อมต่อระบบได้');
        setShowDialog(false);
      } else {
        let check = false;
        for (let i in loginReducer.ipAddress) {
          if (
            loginReducer.ipAddress[i].value == titleName ||
            loginReducer.ipAddress[i].label == titleName
          ) {
            setShowDialog(false);
            Alert.alert(Language.t('selectBase.Alert'));
            check = true;

            break;
          }
        }
        if (!check) {
          let newObj = {label: titleName, value: titleName};
          temp.push(newObj);
          dispatch(loginActions.ipAddress(temp));
          dispatch(userActions.setUserHttp(newObj.label));
          setShowDialog(false);
          setTimeout(() => {
            RNRestart.Restart();
          }, 1000);
        }
      }
    }
  };
  const handleYes2 = () => {
    for (let i in loginReducer.ipAddress) {
      if (loginReducer.ipAddress[i].label == title) {
        dispatch(userActions.setUserHttp(loginReducer.ipAddress[i].label));
        setTimeout(() => {
          RNRestart.Restart();
        }, 1000);
      }
    }
    setShowDialog2(false);
  };
  const handleYes3 = () => {
    let temp = loginReducer.ipAddress;
    console.log('title', title);
    console.log('userReducer.http', userReducer.http);
    if (title == userReducer.http) {
      Alert.alert(Language.t('selectBase.cannotDelete'));
    } else {
      if (temp.length == 1) {
        temp = [];
      } else {
        for (let i in loginReducer.ipAddress) {
          if (loginReducer.ipAddress[i].label == title) {
            temp.splice(i, 1);
            Alert.alert(Language.t('selectBase.questionDelete'));
            break;
          }
        }
      }
    }

    dispatch(loginActions.ipAddress(temp));
    setShowDialog3(false);
  };
  const handleNo = () => {
    setShowDialog(false);
    setShowDialog2(false);
    setShowDialog3(false);
  };

  const _OnClickConnect = () => {
    setShowDialog2(true);
  };
  const _OnClickDelete = () => {
    setShowDialog3(true);
  };
  const checkIPAddress = async (url) => {
    let result = false;
    await fetch(url + 'DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': '{167f0c96-86fd-488f-94d1-cc3169d60b1a}',
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{ "BPAPUS-MACHINE": "11111122","BPAPUS-CNTRY-CODE": "66", "BPAPUS-MOBILE": "0828845662"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          result = true;
        } else {
          console.log('checkIPAddress FAILED');
          result = false;
        }
      })
      .catch((error) => {
        result = false;
        console.log('checkIPAddress', error);
      });
    return result;
  };
  useEffect(() => {
    let check = false;
    if (route.params?.post) {
      setTitleName(
        Language.t('selectBase.questionAdd') + route.params.post.value + '?',
      );
      for (let i in loginReducer.ipAddress) {
        if (loginReducer.ipAddress[i].value === route.params.post.value) {
          Alert.alert(Language.t('selectBase.Alert'));
          check = true;
          break;
        }
      }
      if (check == false) {
        setIpAddress(route.params.post.value);
      }
    }
  }, [route.params?.post]);

  return (
    <View style={styles.container2}>
      <Header
        style={{
          backgroundColor: 'white',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} />
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'black', width: 250}}>
            {Language.t('selectBase.header')}
          </Title>
        </Body>
        <Right />
      </Header>
      <View style={styles.container1}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              flex: 0.5,
              fontSize: FontSize.medium,
            }}>
            {Language.t('selectBase.title')}
          </Text>
          <View
            style={{
              marginLeft: Platform.OS === 'android' ? 5 : 1,
              borderWidth: 0.5,
              flex: 1,
            }}>
            <Picker
              selectedValue={title}
              style={{
                width: deviceWidth,
              }}
              onValueChange={(item) => {
                setTitle(item);
              }}
              mode="dropdown"
              itemStyle={{}}>
              {loginReducer.ipAddress.length > 0 ? (
                loginReducer.ipAddress.map((obj, index) => {
                  return (
                    <Picker.Item
                      key={obj.label}
                      label={obj.value}
                      value={obj.label}
                    />
                  );
                })
              ) : (
                <Picker.Item
                  value="-1"
                  label={Language.t('selectBase.lebel')}
                />
              )}
            </Picker>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignContent: 'flex-end',
            justifyContent: 'flex-end',
            marginTop: Platform.OS === 'ios' ? 15 : 10,
          }}>
          <TouchableOpacity
            onPress={_OnClickConnect}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginEnd: 5,
              backgroundColor: Colors.buttonColorPrimary,
            }}>
            <Text style={{color: 'white', fontWeight: '500'}}>
              {Language.t('selectBase.connect')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={_OnClickDelete}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: 'red',
            }}>
            <Text style={{color: 'white', fontWeight: '500'}}>
              {Language.t('selectBase.delete')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: FontSize.medium,
          }}>
          {Language.t('selectBase.add')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
            marginTop: Platform.OS === 'ios' ? 15 : 10,
            borderColor: Colors.borderColor,
            borderWidth: 0.7,
          }}>
          <TextInput
            style={{
              flex: 1,
              color: Colors.fontColor,
              fontSize: FontSize.medium,
            }}
            keyboardType="default"
            placeholderTextColor={Colors.fontColorSecondary}
            placeholder={titleName == 'IP Address:' ? titleName : ipAddress}
            onChangeText={(val) => {
              if (val == '') {
                setTitleName('IP Address:');
              } else {
                setTitleName(val);
              }
            }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')}>
            <Icon name="qrcode" size={25} color={'black'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (titleName == '') {
              Alert.alert(Language.t('selectBase.Alert3'));
            } else {
              setShowDialog(true);
            }
          }}>
          <View style={styles.button}>
            <Text style={styles.textButton}>
              {Language.t('selectBase.add')}
            </Text>
          </View>
        </TouchableOpacity>
        <Dialog.Container visible={isShowDialog}>
          <Dialog.Title>{titleName}</Dialog.Title>
          <Dialog.Description>
            {Language.t('selectBase.Alert2')}
          </Dialog.Description>
          <Dialog.Button
            label={Language.t('alert.cancel')}
            onPress={handleNo}
          />
          <Dialog.Button label={Language.t('alert.ok')} onPress={handleYes} />
        </Dialog.Container>
        <Dialog.Container visible={isShowDialog2}>
          <Dialog.Title>{Language.t('selectBase.Alert2')}</Dialog.Title>
          <Dialog.Description>
            {Language.t('selectBase.Alert2')}
          </Dialog.Description>
          <Dialog.Button
            label={Language.t('alert.cancel')}
            onPress={handleNo}
          />
          <Dialog.Button label={Language.t('alert.ok')} onPress={handleYes2} />
        </Dialog.Container>
        <Dialog.Container visible={isShowDialog3}>
          <Dialog.Title>{Language.t('selectBase.questionDelete')}</Dialog.Title>
          <Dialog.Button
            label={Language.t('alert.cancel')}
            onPress={handleNo}
          />
          <Dialog.Button label={Language.t('alert.ok')} onPress={handleYes3} />
        </Dialog.Container>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundColorSecondary,
    padding: 20,

    flexDirection: 'column',
  },
  container2: {
    backgroundColor: 'white',
    flex: 1,
  },
  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  textTitle: {
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  textTitle2: {
    alignSelf: 'center',
    flex: 2,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  textButton: {
    fontSize: FontSize.medium,
    color: Colors.fontColor2,
  },
  textInput: {
    flex: 8,
    borderBottomColor: Colors.borderColor,
    color: Colors.inputText,
    marginTop: Platform.OS === 'ios' ? 18 : 1,
    fontSize: FontSize.medium,
    borderBottomWidth: 0.7,
  },
});

const mapStateToProps = (state) => {
  return {
    http: state.userReducer.http,
    ipAddress: state.loginReducer.ipAddress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetUserHttp: (payload) => dispatch(setUserHttp(payload)),
    reduxIpAddress: (payload) => dispatch(ipAddress(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectBase);

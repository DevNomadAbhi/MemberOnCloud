import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';

import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Dialog from 'react-native-dialog';
import {FontSize} from '../components/FontSizeHelper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header, Button, Body, Left, Right, Title} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Picker} from 'native-base';
import DatePicker from '../components/DatePicker';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../src/Colors';
import * as InterestActions from '../src/actions/interestActions';
import * as userActions from '../src/actions/userActions';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Language} from '../translations/I18n';
import * as Constants from '../src/Constants';

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const interestReducer = useSelector(({interestReducer}) => interestReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const [selectedId, setSelectedId] = useState(null);
  const [isShowDialog, setShowDialog] = useState(false);
  const [data, setData] = useState({
    title: userReducer.userData[userIndex].title,
    firstName: userReducer.userData[userIndex].firstName,
    lastName: userReducer.userData[userIndex].lastName,
    birthDate: userReducer.userData[userIndex].birthDate,
    ADDR_1: userReducer.userData[userIndex].ADDR_1,
    ADDR_2: userReducer.userData[userIndex].ADDR_2,
    ADDR_3: userReducer.userData[userIndex].ADDR_3,
    postCode: userReducer.userData[userIndex].postCode,
    email: userReducer.userData[userIndex].email,
  });
  const dispatch = useDispatch();
  const [newData, setNewData] = useState({
    title: data.title,
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate,
    ADDR_1: data.ADDR_1,
    ADDR_2: data.ADDR_2,
    ADDR_3: data.ADDR_3,
    postCode: data.postCode,
    email: data.email,
  });
  const [gender, setGender] = useState('');
  const addGender = () => {
    console.log(
      'userReducer.userData[userIndex].sex' +
        userReducer.userData[userIndex].title,
    );
    if (userReducer.userData[userIndex].title == 'นาย') {
      Language.getLang() == 'th' ? setGender('ชาย') : setGender('Male');
    } else if (
      userReducer.userData[userIndex].title == 'นาง' ||
      userReducer.userData[userIndex].title == 'นางสาว'
    ) {
      Language.getLang() == 'th' ? setGender('หญิง') : setGender('Female');
    }
  };
  const _PressEnter = () => {
    setShowDialog(true);
  };
  const handleYes = () => {
    setShowDialog(false);
    _setDispatch();
  };
  const handleNo = () => {
    setShowDialog(false);
  };

  const _setDispatch = async () => {
    let tempUser = userReducer.userData;

    if (newData.title == data.title) {
      tempUser[userIndex].title = data.title;
    } else {
      tempUser[userIndex].title = newData.title;
    }
    if (newData.firstName == '') {
      tempUser[userIndex].firstName = data.firstName;
    } else {
      tempUser[userIndex].firstName = newData.firstName;
    }
    if (newData.lastName == '') {
      tempUser[userIndex].lastName = data.lastName;
    } else {
      tempUser[userIndex].lastName = newData.lastName;
    }
    if (newData.birthDate == '') {
      tempUser[userIndex].birthDate = data.birthDate;
    } else {
      console.log(newData.birthDate.replace(/-/gi, ''));
      tempUser[userIndex].birthDate = newData.birthDate.replace(/-/gi, '');
    }
    if (newData.ADDR_1 == '') {
      tempUser[userIndex].ADDR_1 = data.ADDR_1;
    } else {
      tempUser[userIndex].ADDR_1 = newData.ADDR_1;
    }
    if (newData.ADDR_2 == '') {
      tempUser[userIndex].ADDR_2 = data.ADDR_2;
    } else {
      tempUser[userIndex].ADDR_2 = newData.ADDR_2;
    }
    if (newData.ADDR_3 == '') {
      tempUser[userIndex].ADDR_3 = data.ADDR_3;
    } else {
      tempUser[userIndex].ADDR_3 = newData.ADDR_3;
    }
    if (newData.postCode == '') {
      tempUser[userIndex].postCode = data.postCode;
    } else {
      tempUser[userIndex].postCode = newData.postCode;
    }
    if (newData.email == '') {
      tempUser[userIndex].email = data.email;
    } else {
      tempUser[userIndex].email = newData.email;
    }

    tempUser[userIndex].interestImg = interestReducer.interestImg;
    if (gender == 'ชาย') {
      tempUser[userIndex].sex = 'M';
    } else {
      tempUser[userIndex].sex = 'F';
    }

    await fetch(userReducer.http + 'MbUsers', {
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
        let sex = '';
        if (tempUser[userIndex].title == 'นาย') {
          sex = 'M';
        } else if (
          tempUser[userIndex].title == 'นาง' ||
          tempUser[userIndex].title == 'นางสาว'
        ) {
          sex = 'F';
        }
        await fetch(userReducer.http + 'MbUsers', {
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
              sex +
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
              dispatch(userActions.setUserData(tempUser));
              navigation.navigate('AuthenticationScreen', {navi: 'Menu'});
            } else {
              console.log('ERROR : ' + json.ReasonString);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
  };
  const onChangeData = (date) => {
    setNewData({...newData, birthDate: date});
  };

  const _onClick = (i, index) => {
    let temp = interestReducer.interestImg;
    if (temp && temp[index][i].check === true) {
      temp[index][i].check = false;
    } else {
      temp[index][i].check = true;
    }

    dispatch(InterestActions.interestImg(temp));
  };
  useEffect(() => {
    addGender();

    dispatch(
      InterestActions.interestImg(
        JSON.parse(JSON.stringify(userReducer.userData[userIndex].interestImg)),
      ),
    );
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View>
        {item.length > 1 ? (
          <View style={[styles.item]}>
            <TouchableOpacity
              onPress={() => _onClick(0, index)}
              style={{
                flex: 1,
                height: 100,
                width: 90,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <Image
                style={{
                  width: 70,
                  height: 70,
                }}
                resizeMode="cover"
                source={{
                  uri: item[0].img,
                }}></Image>
              {item[0].check ? (
                <Icon
                  style={{position: 'absolute'}}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{color: 'black', textAlign: 'center', marginBottom: 5}}>
                {Language.getLang() === 'th' ? item[0].CPTN : item[0].ECPTN}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => _onClick(1, index)}
              style={{
                flex: 1,
                height: 100,
                width: 90,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <Image
                style={{
                  width: 70,
                  height: 70,
                }}
                resizeMode="cover"
                source={{
                  uri: item[1].img,
                }}></Image>
              {item[1].check ? (
                <Icon
                  style={{position: 'absolute'}}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{color: 'black', textAlign: 'center', marginBottom: 5}}>
                {Language.getLang() === 'th' ? item[1].CPTN : item[1].ECPTN}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => _onClick(2, index)}
              style={{
                flex: 1,
                height: 100,
                width: 90,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <Image
                style={{
                  width: 70,
                  height: 70,
                }}
                resizeMode="cover"
                Í
                source={{
                  uri: item[2].img,
                }}></Image>
              {item[2].check ? (
                <Icon
                  style={{position: 'absolute'}}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{color: 'black', textAlign: 'center', marginBottom: 5}}>
                {Language.getLang() === 'th' ? item[2].CPTN : item[2].ECPTN}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
      }}>
      <Header
        style={{
          backgroundColor: Colors.backgroundColorSecondary,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <Left>
          <Button
            transparent
            onPress={() => {
              //dispatch(InterestActions.interestImg([]));
              navigation.goBack();
            }}>
            <Icon size={35} name="angle-left" />
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'black'}}>{Language.t('profile.header')}</Title>
        </Body>
        <Right />
      </Header>
      <FlatList
        ListHeaderComponentStyle={{padding: 15}}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
              }}>
              <Icon name="user" size={25} color="#0288D1" />
              <Text style={{marginLeft: 10, fontSize: FontSize.medium}}>
                {Language.t('profile.headerPersonalInformation')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'space-between',
                marginTop: 10,
              }}>
              <Text style={styles.textTitle1}>
                {Language.t('profile.title')}
              </Text>

              {Platform.OS === 'ios' ? (
                <View
                  style={{
                    marginLeft: 20,
                    borderWidth: 0.5,
                    flex: 1,
                  }}>
                  <Picker
                    mode="dropdown"
                    style={{
                      width: 250,
                    }}
                    placeholder={newData.title}
                    selectedValue={newData.title}
                    onValueChange={(item) => {
                      setNewData({...newData, title: item});
                      if (item == 'นาย') {
                        Language.getLang() == 'th' ? setGender('ชาย') : setGender('Male');
                      } else if (
                        item == 'นาง' ||
                        item == 'นางสาว'
                      ) {
                        Language.getLang() == 'th' ? setGender('หญิง') : setGender('Female');
                      }
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
                    flex: 1,
                  }}>
                  <Picker
                    selectedValue={newData.title}
                    mode="dropdown"
                    onValueChange={(item) => {
                      setNewData({...newData, title: item});
                      if (item == 'นาย') {
                        Language.getLang() == 'th' ? setGender('ชาย') : setGender('Male');
                      } else if (
                        item == 'นาง' ||
                        item == 'นางสาว'
                      ) {
                        Language.getLang() == 'th' ? setGender('หญิง') : setGender('Female');
                      }
                    }}
                    itemStyle={{
                      width: 50,
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
            <TextInput
              value={newData.firstName}
              placeholder={data.firstName}
              onChangeText={(val) => {
                setNewData({...newData, firstName: val});
              }}
              style={styles.textInput}></TextInput>

            <Text style={styles.textTitle}>
              {Language.t('profile.lastName')}
            </Text>
            <TextInput
              value={newData.lastName}
              placeholder={data.lastName}
              onChangeText={(val) => {
                setNewData({...newData, lastName: val});
              }}
              style={styles.textInput}></TextInput>

            <Text style={styles.textTitle}>{Language.t('profile.gender')}</Text>
            <Text style={styles.textInput}>{gender}</Text>

            <Text style={styles.textTitle}>
              {Language.t('profile.birthday')}
            </Text>
            <DatePicker date={newData.birthDate} onChange={onChangeData} />
            <Text style={styles.textTitle}>
              {Language.t('profile.address')}
              {Language.t('login.and')}
              {Language.t('profile.road')}
            </Text>
            <TextInput
              value={newData.ADDR_1}
              placeholder={data.ADDR_1}
              onChangeText={(val) => {
                setNewData({...newData, ADDR_1: val});
              }}
              style={styles.textInput}></TextInput>

            <Text style={styles.textTitle}>
              {Language.t('profile.subdistrict')}
              {Language.t('login.and')}
              {Language.t('profile.district')}
            </Text>
            <TextInput
              value={newData.ADDR_2}
              placeholder={data.ADDR_2}
              onChangeText={(val) => {
                setNewData({...newData, ADDR_2: val});
              }}
              style={styles.textInput}></TextInput>
            <Text style={styles.textTitle}>
              {Language.t('profile.province')}
            </Text>
            <TextInput
              value={newData.ADDR_3}
              placeholder={data.ADDR_3}
              onChangeText={(val) => {
                setNewData({...newData, ADDR_3: val});
              }}
              style={styles.textInput}></TextInput>

            <Text style={styles.textTitle}>
              {Language.t('profile.postCode')}
            </Text>
            <TextInput
              maxLength={5}
              keyboardType="number-pad"
              value={newData.postCode}
              placeholder={data.postCode}
              onChangeText={(val) => {
                setNewData({...newData, postCode: val});
              }}
              style={styles.textInput}></TextInput>
            <Text style={styles.textTitle}>{Language.t('profile.email')}</Text>
            <TextInput
              value={newData.email}
              placeholder={data.email}
              keyboardType="email-address"
              onChangeText={(val) => {
                setNewData({...newData, email: val});
              }}
              style={styles.textInput}></TextInput>

            <Text
              style={{marginTop: 10, fontSize: FontSize.medium, padding: 5}}>
              {Language.t('interested.header')}
            </Text>
          </>
        }
        showsHorizontalScrollIndicator={false}
        data={interestReducer.interestImg}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        extraData={selectedId}
        ListFooterComponent={
          <View
            style={{
              padding: 15,
              justifyContent: 'flex-end',
              flexDirection: 'column',
            }}>
            <TouchableNativeFeedback onPress={_PressEnter}>
              <View style={styles.button}>
                <Text style={styles.textButton}>
                  {Language.t('profile.save')}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        }
      />
      <Dialog.Container visible={isShowDialog}>
        <Dialog.Title>{Language.t('profile.confirmEditProfile')}</Dialog.Title>
        <Dialog.Button label={Language.t('alert.cancel')} onPress={handleNo} />
        <Dialog.Button
          label={Language.t('alert.confirm')}
          onPress={handleYes}
        />
      </Dialog.Container>
    </SafeAreaView>
  );
};
const mapStateToProps = (state) => {
  return {
    interestImg: state.interestReducer.interestImg,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxInterestImg: (payload) => dispatch(interestImg(payload)),
    reduxSetUserData: (payload) => dispatch(setUserData(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 10,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  item: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: FontSize.large,
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: window.height / 2,
  },
  textInput: {
    borderColor: 'gray',
    padding: Platform.OS === 'ios' ? 15 : 11,
    borderWidth: 0.7,
  },
  textTitle: {
    fontSize: FontSize.medium,
    padding: 5,
  },
  textButton: {
    color: Colors.fontColor2,
    fontSize: FontSize.medium,
    padding: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  textTitle1: {
    fontSize: FontSize.medium,
    padding: 5,
    alignSelf: 'center',
  },
  itemView: {
    flex: 1,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  imageIcon: {
    width: 70,
    height: 70,
  },
  textIcon: {
    color: 'black',
    textAlign: 'center',
  },
});

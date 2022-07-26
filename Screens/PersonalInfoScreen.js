import React, { useState, useEffect } from 'react';
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
import { FontSize } from '../components/FontSizeHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  Button,
  Body,
  Left,
  Right,
  Title,
  Picker,
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

import DatePicker from '../components/DatePicker';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../src/Colors';
import * as InterestActions from '../src/actions/interestActions';
import * as userActions from '../src/actions/userActions';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Language } from '../translations/I18n';
import * as Constants from '../src/Constants';

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const interestReducer = useSelector(({ interestReducer }) => interestReducer);
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
  useEffect(() => {
    let birthDate = ''
    console.log(`newData.birthDate > ${newData.birthDate}`)
    console.log(`data.birthDate > ${data.birthDate}`)
    if (newData.birthDate == '') {
      birthDate = data.birthDate
      console.log(`birthDate > ${birthDate}`)
    } else {
      birthDate = new Date(newData.birthDate)
      birthDate = `${birthDate.getFullYear()}${(birthDate.getMonth() + 1) >= 10 ? (birthDate.getMonth() + 1) : '0' + (birthDate.getMonth() + 1)}${birthDate.getDate() >= 10 ? birthDate.getDate() : '0' + birthDate.getDate()}`;
      console.log(`newData.birthDate > ${birthDate}`)
    }


  }, [newData.birthDate])
  const addGender = () => {

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
    if (newData.birthDate == data.birthDate ) {

      tempUser[userIndex].birthDate = data.birthDate
    } else {
      let birthDate = new Date(newData.birthDate)
      tempUser[userIndex].birthDate = `${birthDate.getFullYear()}${(birthDate.getMonth() + 1) >= 10 ? (birthDate.getMonth() + 1) : '0' + (birthDate.getMonth() + 1)}${birthDate.getDate() >= 10 ? birthDate.getDate() : '0' + birthDate.getDate()}`;
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
    const navi = 'Menu';

    const newnvi = { navi, tempUser };
    navigation.navigate('AuthenticationScreen', { navi: newnvi });
  };
  const onChangeData = (date) => {
    setNewData({ ...newData, birthDate: date });
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

  const renderItem = ({ item, index }) => {
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
                  style={{ position: 'absolute' }}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{ color: 'black', textAlign: 'center', marginBottom: 5 }}>
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
                  style={{ position: 'absolute' }}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{ color: 'black', textAlign: 'center', marginBottom: 5 }}>
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
                  style={{ position: 'absolute' }}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{ color: 'black', textAlign: 'center', marginBottom: 5 }}>
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
          <Title style={{ color: 'black' }}>{Language.t('profile.header')}</Title>
        </Body>
        <Right />
      </Header>
      <FlatList
        ListHeaderComponentStyle={{ padding: 15 }}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
              }}>
              <Icon name="user" size={25} color="#0288D1" />
              <Text style={{ marginLeft: 10, fontSize: FontSize.medium }}>
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
                    borderBottomWidth: 0.5,
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
                      setNewData({ ...newData, title: item });
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
                    borderBottomWidth: 0.7,
                    borderColor: 'gray',
                    flex: 1,
                  }}>
                  <Picker
                    selectedValue={newData.title}
                    mode="dropdown"
                    onValueChange={(item) => {
                      setNewData({ ...newData, title: item });
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
                setNewData({ ...newData, firstName: val });
              }}
              style={styles.textInput}></TextInput>

            <Text style={styles.textTitle}>
              {Language.t('profile.lastName')}
            </Text>
            <TextInput
              value={newData.lastName}
              placeholder={data.lastName}
              onChangeText={(val) => {
                setNewData({ ...newData, lastName: val });
              }}
              style={styles.textInput}></TextInput>

            <Text style={styles.textTitle}>{Language.t('profile.gender')}</Text>
            <Text style={styles.textunInput} >{gender}</Text>

            <Text style={styles.textTitle}>
              {Language.t('profile.birthday')}
            </Text>
            <View style={styles.textInput}>
              <DatePicker date={newData.birthDate} onChange={onChangeData} />
            </View>

            <Text style={styles.textTitle}>
              {Language.t('profile.address')}
              {Language.t('login.and')}
              {Language.t('profile.road')}
            </Text>
            <TextInput
              value={newData.ADDR_1}
              placeholder={data.ADDR_1}
              onChangeText={(val) => {
                setNewData({ ...newData, ADDR_1: val });
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
                setNewData({ ...newData, ADDR_2: val });
              }}
              style={styles.textInput}></TextInput>
            <Text style={styles.textTitle}>
              {Language.t('profile.province')}
            </Text>
            <TextInput
              value={newData.ADDR_3}
              placeholder={data.ADDR_3}
              onChangeText={(val) => {
                setNewData({ ...newData, ADDR_3: val });
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
                setNewData({ ...newData, postCode: val });
              }}
              style={styles.textInput}></TextInput>
            <Text style={styles.textTitle}>{Language.t('profile.email')}</Text>
            <TextInput
              value={newData.email}
              placeholder={data.email}
              keyboardType="email-address"
              onChangeText={(val) => {
                setNewData({ ...newData, email: val });
              }}
              style={styles.textInput}></TextInput>

            <Text
              style={{ marginTop: 20, fontSize: FontSize.medium, padding: 5, borderBottomWidth: 1 }}>
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
    backgroundColor: Colors.backgroundColorSecondary,
    marginTop: 5,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    height: 'auto',
    paddingBottom: 10,
    borderColor: 'gray',
    borderWidth: 0.7,
    flexDirection: 'row',
  },
  textunInput: {
    backgroundColor: Colors.backgroundColorSecondary,
    marginTop: 5,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    height: 'auto',
    paddingBottom: 10,
    borderColor: 'gray',
    borderWidth: 0.7,
    flexDirection: 'row',
    color: Colors.borderColor
  },
  textTitle: {
    marginTop: 5,
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

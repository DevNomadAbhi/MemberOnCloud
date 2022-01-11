import React, {useState, useEffect} from 'react';
import {BackHandler, Platform} from 'react-native';
import Dialog from 'react-native-dialog';
import {Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Header, Body, Left, Right, Title} from 'native-base';
import {Language, changeLanguage} from '../translations/I18n';
import {DateHelper} from '../components/DateHelper';
const DetailScreen = () => {
  const userReducer = useSelector(({userReducer}) => userReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const navigation = useNavigation();
  const [isShowDialog, setShowDialog] = useState(false);

  const handleYes = () => {
    setShowDialog(false);
    navigation.navigate('LoginScreen');

    //dispatch(SignoutActions.isLogout());
  };
  const handleNo = () => {
    setShowDialog(false);
  };

  const _PressLogout = () => {
    setShowDialog(true);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#E6EBFF',

        flex: 1,
        flexDirection: 'column',
      }}>
      <Header
        style={{
          backgroundColor: '#E6EBFF',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <Left />
        <Body>
          <Title style={{color: 'black'}}>{Language.t('menu.header')}</Title>
        </Body>
        <Right />
      </Header>
      <View style={{padding: 30}}>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FontAwesome
            name="user"
            size={25}
            style={{marginRight: 20}}
            color="black"></FontAwesome>
          {userReducer.userData.length ? (
            <Text>
              {userReducer.userData[userIndex].title}{' '}
              {userReducer.userData[userIndex].firstName}{' '}
              {userReducer.userData[userIndex].lastName}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <FontAwesome
            name="mobile"
            size={35}
            style={{marginRight: 20}}
            color="black"></FontAwesome>
          {userReducer.userData.length ? (
            <Text>{userReducer.userData[userIndex].phoneNum}</Text>
          ) : null}
        </View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FontAwesome
            name="birthday-cake"
            size={25}
            style={{marginRight: 20}}
            color="black"></FontAwesome>
          {userReducer.userData.length ? (
            <Text>
              {DateHelper.getDate(userReducer.userData[userIndex].birthDate)}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PersonalInfoScreen')}
          style={{
            height: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text>{Language.t('profile.header')}</Text>
          <FontAwesome
            name="arrow-right"
            size={Platform.OS === 'ios' ? 20 : 25}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <Dialog.Container visible={isShowDialog}>
        <Dialog.Title>{Language.t('menu.alertLogoutMessage')}</Dialog.Title>
        <Dialog.Button label={Language.t('alert.cancel')} onPress={handleNo} />
        <Dialog.Button label={Language.t('alert.ok')} onPress={handleYes} />
      </Dialog.Container>
      {/* <TouchableOpacity
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <View
          style={{
            height: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text>ประวัติการซื้อ/แลกแต้ม</Text>
          <FontAwesome name="arrow-right" size={Platform.OS === "ios" ? 20 :25} color="gray" />
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SelectLanguageScreen')}
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <View
          style={{
            height: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text>{Language.t('changeLanguage.header')}</Text>
          {Language.getLang() === 'th' ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{marginRight: 15}}>ภาษาไทย</Text>
              <FontAwesome
                name="arrow-right"
                size={Platform.OS === 'ios' ? 20 : 25}
                color="gray"
              />
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{marginRight: 15}}>English</Text>
              <FontAwesome
                name="arrow-right"
                size={Platform.OS === 'ios' ? 20 : 25}
                color="gray"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('FingerPrintScreen');
        }}
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <View
          style={{
            height: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text>{Language.t('fingerPrint.header')}</Text>
          <FontAwesome
            name="arrow-right"
            size={Platform.OS === 'ios' ? 20 : 25}
            color="gray"
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_PressLogout}
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <View
          style={{
            height: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: 'red', fontWeight: 'normal'}}>
            {Language.t('menu.logout')}
          </Text>
          <FontAwesome
            name="arrow-right"
            size={Platform.OS === 'ios' ? 20 : 25}
            color="gray"
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetUserData: (payload) => dispatch(setUserData(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen);

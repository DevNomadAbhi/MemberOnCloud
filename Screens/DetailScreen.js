import React, { useState, useEffect } from 'react';
import { BackHandler, Dimensions, ActivityIndicator, Platform } from 'react-native';
import Dialog from 'react-native-dialog';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Header, Body, Left, Right, Title } from 'native-base';
import { Language, changeLanguage } from '../translations/I18n';
import { DateHelper } from '../components/DateHelper';
import { useStateIfMounted } from 'use-state-if-mounted';
import Colors from '../src/Colors';
import RNRestart from 'react-native-restart';
import * as loginActions from '../src/actions/loginActions';
const DetailScreen = ({ route }) => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const navigation = useNavigation();
  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);
  const [uLogin, setuLogin] = useStateIfMounted(loginReducer.userloggedIn);
  const dispatch = useDispatch();

  useEffect(() => {

  }, []);

  const logOut = () => {
    setLoading(true)
    dispatch(loginActions.userName(''))
    dispatch(loginActions.password(''))
    dispatch(loginActions.userlogin(false))
    navigation.dispatch(
      navigation.replace('LoginScreen')
    )
    setLoading(false)
  };



  return (
    <>
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
          <Body >
            <Title style={{ color: 'black' }}>{Language.t('menu.header')}</Title>
          </Body>
          <Right />
        </Header>
        <View style={{ padding: 30 }}>
          <View
            style={{
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FontAwesome
              name="user"
              size={25}
              style={{ marginRight: 20 }}
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
              style={{ marginRight: 20 }}
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
              style={{ marginRight: 20 }}
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
            height: 50,
            justifyContent: 'center',
            paddingRight: 15,
            paddingLeft: 15,
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
              size={Platform.OS === 'ios' ? 10 : 15}
              color="gray"
            />
          </TouchableOpacity>
        </View>


        <TouchableOpacity
          onPress={() => navigation.navigate('SelectLanguageScreen')}
          style={{
            backgroundColor: 'white',
            height: 50,
            justifyContent: 'center',
            paddingRight: 15,
            paddingLeft: 15,
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 15 }}>ภาษาไทย</Text>
                <FontAwesome
                  name="arrow-right"
                  size={Platform.OS === 'ios' ? 10 : 15}
                  color="gray"
                />
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 15 }}>English</Text>
                <FontAwesome
                  name="arrow-right"
                  size={Platform.OS === 'ios' ? 10 : 15}
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
            height: 50,
            justifyContent: 'center',
            paddingRight: 15,
            paddingLeft: 15,
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
              size={Platform.OS === 'ios' ? 10 : 15}
              color="gray"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Alert.alert('', Language.t('menu.alertLogoutMessage'), [{ text: Language.t('alert.ok'), onPress: () => logOut() }, { text: Language.t('alert.cancel'), onPress: () => { } }])}
          style={{
            backgroundColor: 'white',
            height: 50,
            justifyContent: 'center',
            paddingRight: 15,
            paddingLeft: 15,
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
            <Text style={{ color: 'red', fontWeight: 'normal' }}>
              {Language.t('menu.logout')}
            </Text>
            <FontAwesome
              name="arrow-right"
              size={Platform.OS === 'ios' ? 10 : 15}
              color="gray"
            />
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight - 50,
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
    </>

  );

};
const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    loggedIn: state.loginReducer.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetUserData: (payload) => dispatch(setUserData(payload)),
    reduxLogin: (payload) => dispatch(login(payload)),
    reduxLoggedIn: (payload) => dispatch(loggedIn(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen);

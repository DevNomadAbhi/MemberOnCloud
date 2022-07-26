import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import * as userActions from '../src/actions/userActions';
import * as loginActions from '../src/actions/loginActions';
import {
  Text,
  Icon,
  Left,
  Right,
  List,
  ListItem,
  Button,
  Container,
} from 'native-base';
import { FontSize } from '../components/FontSizeHelper';
import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { Language, changeLanguage } from '../translations/I18n';
import RNRestart from 'react-native-restart';
import Colors from '../src/Colors';
import { useNavigation } from '@react-navigation/native';
const SelectLanguageScreen = () => {
  const navigation = useNavigation();
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  let languageNow = Language.getLang() == 'th' ? 'th' : 'en';
  const [language, setLanguage] = useState({
    th: false,
    en: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('languageNow :' + languageNow);
  }, []);

  const _PressChangeLanguage = async (newLanguage) => {
    let tempUser = userReducer.userData;
    changeLanguage(newLanguage);
    tempUser[userIndex].language = newLanguage;
    dispatch(loginActions.setLanguage(newLanguage))
    dispatch(userActions.setUserData(tempUser));
    navigation.dispatch(
      navigation.replace('LoginScreen', { Language: newLanguage })
    )
    console.log(itemValue)

  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <List style={{ backgroundColor: Colors.backgroundColorSecondary }}>
          <ListItem noIndent onPress={() => _PressChangeLanguage('th')}>
            <Left>
              <View style={{ paddingRight: 10 }}>
                {languageNow == 'th' ? (
                  <Icon
                    ios="ios-radio-button-on"
                    android="md-radio-button-on"
                  />
                ) : (
                  <Icon
                    ios="ios-radio-button-off"
                    android="md-radio-button-off"
                  />
                )}
              </View>
              <Text style={{ fontSize: FontSize.medium, color: Colors.fontColor }}>
                ภาษาไทย
              </Text>
            </Left>
            <Right />
          </ListItem>
          <ListItem noIndent onPress={() => _PressChangeLanguage('en')}>
            <Left>
              <View style={{ paddingRight: 10 }}>
                {languageNow == 'en' ? (
                  <Icon
                    ios="ios-radio-button-on"
                    android="md-radio-button-on"
                  />
                ) : (
                  <Icon
                    ios="ios-radio-button-off"
                    android="md-radio-button-off"
                  />
                )}
              </View>
              <Text style={{ fontSize: FontSize.medium, color: Colors.fontColor }}>
                English
              </Text>
            </Left>
            <Right />
          </ListItem>
        </List>
      </ScrollView>
    </Container>
  );
};
const styles = StyleSheet.create({});
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectLanguageScreen);

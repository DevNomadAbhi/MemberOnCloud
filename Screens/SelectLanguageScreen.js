import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import * as userActions from '../src/actions/userActions';
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
import {FontSize} from '../components/FontSizeHelper';
import {connect} from 'react-redux';
import {useSelector, useDispatch} from 'react-redux';
import {Language, changeLanguage} from '../translations/I18n';
import RNRestart from 'react-native-restart';
import Colors from '../src/Colors';

const SelectLanguageScreen = () => {
  const userReducer = useSelector(({userReducer}) => userReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  let languageNow = userReducer.userData.length ?  userReducer.userData[userIndex].language : 'th';
  const [language, setLanguage] = useState({
    th: false,
    en: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('languageNow :' + languageNow);
    if (languageNow) {
      if (languageNow === 'th') {
        setLanguage({
          language: {th: true},
        });
      } else if (languageNow === 'en') {
        setLanguage({
          language: {en: true},
        });
      }
    }
  }, []);

  const _PressChangeLanguage = async (newLanguage) => {
    let tempUser = userReducer.userData;
    await changeLanguage(newLanguage);
    tempUser[userIndex].language = newLanguage;
    dispatch(userActions.setUserData(tempUser));
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <List style={{backgroundColor: Colors.backgroundColorSecondary}}>
          <ListItem noIndent onPress={() => _PressChangeLanguage('th')}>
            <Left>
              <View style={{paddingRight: 10}}>
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
              <Text style={{fontSize: FontSize.medium, color: Colors.textColor}}>
                ภาษาไทย
              </Text>
            </Left>
            <Right />
          </ListItem>
          <ListItem noIndent onPress={() => _PressChangeLanguage('en')}>
            <Left>
              <View style={{paddingRight: 10}}>
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
              <Text style={{fontSize: FontSize.medium, color: Colors.textColor}}>
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

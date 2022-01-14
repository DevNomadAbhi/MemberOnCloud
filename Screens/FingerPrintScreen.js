import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert, Text, View, Platform, Switch} from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../src/Colors';
import * as TouchId from '../components/TouchId';
import {connect} from 'react-redux';
import * as loginActions from '../src/actions/loginActions';
import {useSelector, useDispatch} from 'react-redux';
import {Language} from '../translations/I18n';
import {FontSize} from '../components/FontSizeHelper';

const FingerPrintScreen = () => {
  const dispatch = useDispatch();
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const [isShowDialog, setShowDialog] = useState(false);
  const [isEnabled, setIsEnabled] = useState(loginReducer.isFingerprint);
  const [dialogTitle, setDialogTitle] = useState(
    Language.t('fingerPrint.alert'),
  );
  const toggleSwitch = () => {
    if (isEnabled) {
      let re = undefined;
      setIsEnabled((previousState) => {
        !previousState;
        re = !previousState;
      });
      dispatch(loginActions.setFingerprint(re));
    } else {
      setIsEnabled((previousState) => !previousState);
      setShowDialog(true);
    }
  };
  const handleNo = () => {
    setShowDialog(false);
    setIsEnabled((previousState) => !previousState);
  };
  const handleYes = async () => {
    setShowDialog(false);
    let re = await TouchId._pressHandler();
    dispatch(loginActions.setFingerprint(re));
    if (!re) {
      toggleSwitch();
      Alert.alert(
       '', Language.t('alert.errorTitle'),[{text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed')},]);
    }
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.textTitle}>{Language.t('fingerPrint.header')}</Text>
      <Text style={styles.textTitle2}>
        {Language.t('fingerPrint.description')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
        }}>
        <Text
          style={{
            marginTop: Platform.OS === 'ios' ? 20 : 10,
            fontSize: FontSize.medium,
            fontWeight: 'bold',
            color: Colors.fontColor,
          }}>
          {Language.t('fingerPrint.description2')}
        </Text>
        <Switch
          style={{marginTop: 10, marginLeft: 5}}
          trackColor={{false: Colors.borderColor, true: Colors.itemColor}}
          thumbColor={
            isEnabled
              ? Colors.buttonColorSecondary
              : Colors.backgroundColorSecondary
          }
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <Dialog.Container visible={isShowDialog}>
        <Dialog.Title> {dialogTitle}</Dialog.Title>
        <Dialog.Button label={Language.t('alert.cancel')} onPress={handleNo} />
        <Dialog.Button label={Language.t('alert.ok')} onPress={handleYes} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundColorSecondary,
    padding: 20,
    flex: 1,
    flexDirection: 'column',
  },
  textTitle: {
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: Colors.fontColor,
  },
  textTitle2: {
    alignSelf: 'center',
    fontSize: FontSize.medium,
    color: Colors.fontColor,
  },
});

const mapStateToProps = (state) => {
  return {
    isFingerprint: state.loginReducer.isFingerprint,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxSetFingerprint: (payload) => dispatch(setFingerprint(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FingerPrintScreen);

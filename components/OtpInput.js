import React, {PureComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../src/Colors';
import {FontSize} from './FontSizeHelper';

class OtpInput extends PureComponent {
  constructor(props) {
    super(props);
    this.digit = this.props.digit;
    this.code = [];
  }

  render() {
    const {pinCode} = this.props;
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {[...Array(this.digit).keys()].map((v, i) => {
          if (pinCode[i]) {
            return (
              <View key={i}>
                {this.props.hiddenCode ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 40,
                      width: 40,
                      marginRight: 10,
                      marginLeft: 10,
                      
                    }}>
                    <Icon
                      style={{
                        fontSize: FontSize.large,
                        color: Colors.textColor,
                      }}
                      type="Ionicons"
                      android="md-radio-button-on"
                      ios="ios-radio-button-on"
                    />

                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderColor: Colors.textColor,
                      height: 40,
                      width: 40,
                      marginRight: 10,
                      marginLeft: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: FontSize.large,
                        color: Colors.textColor,
                      }}>
                      {pinCode[i]}
                    </Text>
                  </View>
                )}
              </View>
            );
          } else {
            return (
              <View key={i}>
                {this.props.hiddenCode ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 40,
                      width: 40,
                      marginRight: 10,
                      marginLeft: 10,
                    }}>
                    <Icon
                      type="Ionicons"
                      android="md-radio-button-off"
                      ios="ios-radio-button-off"
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderColor: Colors.textColor,
                      height: 40,
                      width: 40,
                      marginRight: 10,
                      marginLeft: 10,
                    }}
                  />
                )}
              </View>
            );
          }
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {},
  icon: {
    margin: 10,
    fontSize: FontSize.large,
    color: 'white',
  },
});

export default OtpInput;

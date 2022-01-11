import React, {PureComponent} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FontSize} from './FontSizeHelper';

class NumberPad extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {handlePinCode, fingerPrint} = this.props;
    return (
      <View style={{flex: 1}}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{...styles.box}}
            onPress={() => handlePinCode('1')}>
            <Text allowFontScaling={false} style={styles.text}>
              1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.box}}
            onPress={() => handlePinCode('2')}>
            <Text allowFontScaling={false} style={styles.text}>
              2
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.box}}
            onPress={() => handlePinCode('3')}>
            <Text allowFontScaling={false} style={styles.text}>
              3
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePinCode('4')}>
            <Text allowFontScaling={false} style={styles.text}>
              4
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePinCode('5')}>
            <Text allowFontScaling={false} style={styles.text}>
              5
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePinCode('6')}>
            <Text allowFontScaling={false} style={styles.text}>
              6
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePinCode('7')}>
            <Text allowFontScaling={false} style={styles.text}>
              7
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePinCode('8')}>
            <Text allowFontScaling={false} style={styles.text}>
              8
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePinCode('9')}>
            <Text allowFontScaling={false} style={styles.text}>
              9
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          {fingerPrint ? (
            <TouchableOpacity style={styles.box} onPress={this.props.onPress}>
              <Icon
                type={'Ionicons'}
                ios="ios-finger-print"
                android="md-finger-print"
                style={styles.text}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.box} />
          )}
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePinCode('0')}>
            <Text allowFontScaling={false} style={styles.text}>
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderRightWidth: 0, ...styles.box}}
            onPress={() => handlePinCode('del')}>
            <Icon
              type="MaterialIcons"
              name="backspace"
              style={{fontSize: hp('3%')}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 0.25,
    backgroundColor: 'white',
  },
  box: {
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 0.3,
    // borderColor: "#BDBDBD"
  },
  text: {
    fontSize: FontSize.large,
  },
});

export default NumberPad;

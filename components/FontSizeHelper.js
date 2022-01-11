import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';

const widthDevices = Dimensions.get('window').width;
export const FontSize = {
  mini:
    widthDevices >= 960
      ? wp('1%')
      : widthDevices >= 768
      ? wp('1%')
      : widthDevices >= 480
      ? wp('1.5%')
      : widthDevices >= 320
      ? wp('1.5%')
      : wp('2.5%'),
  small:
    widthDevices >= 960
      ? wp('1.5%')
      : widthDevices >= 768
      ? wp('1.5%')
      : widthDevices >= 480
      ? wp('2%')
      : widthDevices >= 320
      ? wp('2%')
      : wp('3%'),
  medium:
    widthDevices >= 960
      ? wp('2%')
      : widthDevices >= 768
      ? wp('2.5%')
      : widthDevices >= 480
      ? wp('3.5%')
      : widthDevices >= 320
      ? wp('4%')
      : wp('5%'),
  large:
    widthDevices >= 960
      ? wp('4%')
      : widthDevices >= 768
      ? wp('4.5%')
      : widthDevices >= 480
      ? wp('5.5%')
      : widthDevices >= 320
      ? wp('6%')
      : wp('7%'),
  xlarge:
    widthDevices >= 960
      ? wp('5%')
      : widthDevices >= 768
      ? wp('5.5%')
      : widthDevices >= 480
      ? wp('6.5%')
      : widthDevices >= 320
      ? wp('7%')
      : wp('8%'),
};

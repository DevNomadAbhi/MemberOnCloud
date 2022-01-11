import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Language} from '../translations/I18n';
import {FontSize} from '../components/FontSizeHelper';
import Colors from '../src/Colors';
const ActivityPage = ({route}) => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [explains, setExplains] = useState([]);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const [show, setShow] = useState(false);
  const {item} = route.params;
  const expandImg = () => {
    setShow(true);
  };

  const _PressCancle = () => {
    setShow(false);
  };
  useEffect(() => {
    setExplains(item.details.split('EN:'));
  }, []);
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <TouchableOpacity onPress={expandImg}>
        <Image
          style={{
            width: deviceWidth,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          resizeMode="contain"
          source={{
            uri: item.img,
          }}></Image>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: FontSize.medium,
          marginHorizontal: 15,
          paddingVertical: 15,
          fontWeight: 'bold',
          borderBottomWidth: 2,
          borderColor: 'gray',
        }}>
        {Language.getLang() === 'th' ? item.name : item.eName}
      </Text>
      <Text style={{fontSize: FontSize.medium, padding: 15}}>
        {Language.getLang() === 'th' ? explains[0] : explains[1]}
      </Text>
      {show ? (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight - 100,
            position: 'absolute',
            justifyContent: 'center',
            alignContent: 'center',
            alignItem: 'center',
            backgroundColor: 'black',
            flexDirection: 'column',
          }}>
          <TouchableOpacity onPress={_PressCancle}>
            <Icon
              name="times-circle"
              size={25}
              color={Colors.fontColor2}
              style={{
                right: 10,
                alignSelf: 'flex-end',
              }}
            />
          </TouchableOpacity>

          <Image
            style={{
              width: deviceWidth,
              height: 200,
            }}
            resizeMode="contain"
            source={{
              uri: item.img,
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default ActivityPage;

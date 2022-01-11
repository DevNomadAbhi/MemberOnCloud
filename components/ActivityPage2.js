import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../src/Colors';
import {FontSize} from '../components/FontSizeHelper';
import {useNavigation} from '@react-navigation/native';
import {
  Container,
  Header,
  Content,
  Accordion,
  Body,
  Button,
  Icon,
  Left,
  Right,
  Title,
} from 'native-base';
import {Language} from '../translations/I18n';
const ActivityPage2 = ({route}) => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [explains, setExplains] = useState([]);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
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
      <Header
        style={{
          backgroundColor: '#E6EBFF',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <Left>
          <Button transparent onPress={() => navigation.navigate('HomeScreen')}>
            <FontAwesome name="arrow-left" size={20} />
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'black'}}>{Language.t('main.feeds')}</Title>
        </Body>
        <Right />
      </Header>
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
            <FontAwesome
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

export default ActivityPage2;

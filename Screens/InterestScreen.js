import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import {Header, Button, Body, Picker, Left, Right, Title} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Colors from '../src/Colors';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {FontSize} from '../components/FontSizeHelper';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as InterestActions from '../src/actions/interestActions';
import * as userActions from '../src/actions/userActions';
import RNFetchBlob from 'rn-fetch-blob';
import {Language} from '../translations/I18n';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const InterestScreen = () => {
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const interestReducer = useSelector(({interestReducer}) => interestReducer);
  const [selectedId, setSelectedId] = useState(null);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const [loading, setLoading] = useState(true);
  const [marker, setMarker] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  let arrayFinal = [];
  const [resultJson, setResultJson] = useState([]);

  const _onPressHome = () => {
    for (let i in interestReducer.interestImg) {
      for (let j in interestReducer.interestImg[i]) {
        if (interestReducer.interestImg[i][j] == true) {
          setMarker(true);
          break;
        }
      }
    }
    if (marker) {
      Alert.alert(Language.t('register.alertNextInterested'));
    } else {
      let tempUser = userReducer.userData;
      tempUser[userIndex].interestImg = resultJson;
      dispatch(userActions.setUserData(tempUser));
      navigation.navigate('BottomTabs');
    }
  };
  const closeLoading = () => {
    setLoading(false);
  };
  const fetchImg = async (url) => {
    let rt = null;

    await RNFetchBlob.config({fileCache: true, appendExt: 'png'})
      .fetch(
        'GET',
        'http://192.168.0.110:8906/Member/BplusErpDvSvrIIS.dll/DownloadFile',
        {
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-GUID': loginReducer.guid,
          FilePath: 'ShowPage',
          FileName: url + '.png',
        },
      )
      .then((res) => {
        rt = res.path();
      });
    return rt;
  };

  const fetchData = async () => {
    await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[7].guid +
          '","SHWL_IMAGE": "N", "SHWP_IMAGE": "N"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        let responseData = JSON.parse(json.ResponseData);
        let h = [];
        for (let i in responseData.SHOWPAGE) {
          await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
            method: 'POST',
            body: JSON.stringify({
              'BPAPUS-BPAPSV': loginReducer.serviceID,
              'BPAPUS-LOGIN-GUID': loginReducer.guid,
              'BPAPUS-FUNCTION': 'GetPage',
              'BPAPUS-PARAM':
                '{"SHWP_GUID": "' +
                responseData.SHOWPAGE[i].SHWPH_GUID +
                '","SHWP_IMAGE": "N", "SHWC_IMAGE": "N"}',
              'BPAPUS-FILTER': '',
              'BPAPUS-ORDERBY': '',
              'BPAPUS-OFFSET': '0',
              'BPAPUS-FETCH': '0',
            }),
          })
            .then((response) => response.json())
            .then(async (json) => {
              let responseData = JSON.parse(json.ResponseData);
              let jsonObj = {
                id: responseData.SHOWPAGE.SHWPH_GUID,
                CPTN: responseData.SHOWPAGE.SHWPH_TTL_CPTN,
                ECPTN: responseData.SHOWPAGE.SHWPH_TTL_ECPTN,
                GUID: responseData.SHOWPAGE.SHWPH_GUID,
                img:
                  'file://' +
                  (await fetchImg(responseData.SHOWPAGE.SHWPH_GUID)),
                check: false,
              };
              h.push(jsonObj);
            });
        }

        while (h.length > 0) {
          arrayFinal.push(h.splice(0, 3));
        }
        setResultJson(arrayFinal);
        dispatch(InterestActions.interestImg(arrayFinal));
        closeLoading();
      })
      .catch((error) => {
        console.log('fetchData ' + error);
      });
  };
  const _onClick = (i, index) => {
    let temp = interestReducer.interestImg;
    if (temp && temp[index][i].check === true) {
      temp[index][i].check = false;
    } else {
      temp[index][i].check = true;
    }
    dispatch(InterestActions.interestImg(temp));
  };

  useEffect(() => {
    fetchData();
    Alert.alert(Language.t('register.alertNextInterestedTitle'));
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View>
        {item.length > 1 ? (
          <View style={[styles.item]}>
            <TouchableOpacity
              onPress={() => _onClick(0, index)}
              style={{
                flex: 1,
                padding: 5,
                width: deviceWidth / 3.5,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <Image
                style={{
                  width: deviceWidth / 5.5,
                  height: 60,
                }}
                resizeMode="cover"
                source={{
                  uri: item[0].img,
                }}></Image>
              {item[0].check ? (
                <Icon
                  style={{position: 'absolute'}}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: FontSize.medium,
                  marginBottom: 2,
                  padding: 5,
                }}>
                {Language.getLang() === 'th' ? item[0].CPTN : item[0].ECPTN}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => _onClick(1, index)}
              style={{
                flex: 1,
                width: deviceWidth / 3.5,
                padding: 2,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <Image
                style={{
                  width: deviceWidth / 5.5,
                  height: 60,
                }}
                resizeMode="cover"
                source={{
                  uri: item[1].img,
                }}></Image>
              {item[1].check ? (
                <Icon
                  style={{position: 'absolute'}}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  marginBottom: 2,
                  fontSize: FontSize.medium,
                  padding: 2,
                }}>
                {Language.getLang() === 'th' ? item[1].CPTN : item[1].ECPTN}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => _onClick(2, index)}
              style={{
                flex: 1,
                width: deviceWidth / 3.5,
                padding: 2,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <Image
                style={{
                  width: deviceWidth / 5.5,
                  height: 60,
                }}
                resizeMode="cover"
                source={{
                  uri: item[2].img,
                }}></Image>
              {item[2].check ? (
                <Icon
                  style={{position: 'absolute'}}
                  name="check-circle"
                  size={25}
                  color="#0288D1"
                />
              ) : null}
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  marginBottom: 2,
                  fontSize: FontSize.medium,
                  padding: 5,
                }}>
                {Language.getLang() === 'th' ? item[2].CPTN : item[2].ECPTN}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
      }}>
      <Header
        style={{
          backgroundColor: Colors.backgroundColorSecondary,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon size={35}  name="angle-left" />
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'black', fontSize: FontSize.medium,
}}>
            {Language.t('interested.header')}
          </Title>
        </Body>
        <Right />
      </Header>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={resultJson}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        extraData={selectedId}
      />
      <View>
        <TouchableNativeFeedback onPress={_onPressHome}>
          <View
            style={{
              margin: 20,
              padding: 12,
              alignItems: 'center',
              borderRadius: 18,
              backgroundColor: '#0288D1',
            }}>
            <Text style={{color: 'white', fontSize: 15}}>
              {Language.t('alert.next')}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            opacity: 0.5,
            backgroundColor: 'gray',
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
          }}>
          <ActivityIndicator
            style={{
              alignSelf: 'center',
            }}
            animating={loading}
            size="large"
            color="white"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: FontSize.large,
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: window.height / 2,
  },
});
const mapStateToProps = (state) => {
  return {
    interestImg: state.interestReducer.interestImg,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxInterestImg: (payload) => dispatch(interestImg(payload)),
    reduxSetUserData: (payload) => dispatch(setUserData(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InterestScreen);

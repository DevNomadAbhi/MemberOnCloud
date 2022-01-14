import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  FlatList,
  Platform,
  ImageBackground,
  StatusBar
} from 'react-native';
import { FontSize } from '../components/FontSizeHelper';
import { useStateIfMounted } from 'use-state-if-mounted';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { Language } from '../translations/I18n';
import * as loginActions from '../src/actions/loginActions';
import * as activityActions from '../src/actions/activityActions';
import * as userActions from '../src/actions/userActions';
import Colors from '../src/Colors';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const HomeScreen = () => {
  const navigation = useNavigation();
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const activityReducer = useSelector(({ activityReducer }) => activityReducer);
  const [selectedId, setSelectedId] = useStateIfMounted(null);
  const [bannerImg, setBannerImg] = useStateIfMounted('');
  const [popUpImg, setPopUpImg] = useStateIfMounted([]);
  const [active, setActive] = useStateIfMounted(0);
  const [active2, setActive2] = useStateIfMounted(0);
  const [userIndex, setUserIndex] = useStateIfMounted(
    loginReducer ? loginReducer.index : '-1',
  );
  const [arrayObj, setArrayObj] = useStateIfMounted(
    activityReducer ? activityReducer.LOname : [],
  );
  let arrayImg = [];
  const [menuImg, setMenuImg] = useStateIfMounted(
    loginReducer ? loginReducer.jsonResult : [],
  );
  const dispatch = useDispatch();
  const [showPopUp, setShowPopUp] = useStateIfMounted(
    activityReducer ? activityReducer.conName : [],
  );
  const [popUpCheck, setPopUpCheck] = useStateIfMounted({ check: true });
  const [loading, setLoading] = useStateIfMounted(true);
  const [imageUser, setImageUser] = useStateIfMounted(true);
  const [filePath, setFilePath] = useStateIfMounted(
    userReducer.userData[userIndex]
      ? userReducer.userData[userIndex].userImg
      : '',
  );

  useEffect(() => {
    stack();
  }, []);
  useEffect(() => {
    console.log(` `)
    console.log(`loginReducer.jsonResult ${databaseReducer.Data.urlser}`)
    for (var i in loginReducer.jsonResult){
      console.log(` loginReducer.jsonResult[${i}].guid >> ${loginReducer.jsonResult[i].guid}`)
      console.log(` ${loginReducer.jsonResult[i].img}`)
      console.log(` `)
    }
    console.log(` `)
  }, [])

  const updatePopUpCheck = () => {
    setPopUpCheck({
      ...popUpCheck,
      check: !popUpCheck.check,
    });
  };

  const chooseFile = () => {
    let options = {
      title: 'ตัวเลือกรูปภาพ',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        let source = response.uri;
        setFilePath(source);
        let tempUser = userReducer.userData;
        if (Platform.OS === 'ios') {
          tempUser[userIndex].userImg = response.uri;
          console.log('response.origURL ' + response.uri);
        } else {
          tempUser[userIndex].userImg = response.path;
          console.log('response.path ' + response.path);
        }

        dispatch(userActions.setUserData(tempUser));
        setImageUser(false);
      }
    });
  };

  const fetchDataPopUpImg = async () => {
    let ra = [];
    await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[10].guid +
          '","SHWL_IMAGE": "Y", "SHWP_IMAGE": "Y"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);
        for (let i in responseData.SHOWPAGE) {
          let jsonObj = { id: i, img: responseData.SHOWPAGE[i].IMAGE64 };
          ra.push(jsonObj);
        }
      })
      .catch((error) => {
        console.error('fetchDataPopUpImg: ' + error);
      });
    return ra;
  };

  const fetchActivityData = async () => {
    let arrayName = [];
    let arrayGuid = [];
    await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[9].guid +
          '","SHWJ_IMAGE": "N", "SHWL_IMAGE": "N"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);
        for (var i in responseData.SHOWPAGE) {
          if (
            responseData.SHOWPAGE[i].SHWPH_TTL_CPTN.includes(
              'MB_ACTIVITY_DETAIL',
            )
          ) {
            arrayName.push(responseData.SHOWPAGE[i].SHWPH_EXPLAIN);
            arrayGuid.push(responseData.SHOWPAGE[i].SHWPH_GUID);
          }
        }
        dispatch(activityActions.LOguid(arrayGuid));
        dispatch(activityActions.LOresult(responseData));
      })
      .catch((error) => {
        console.error('fetchActivityData: ' + error);
      });
    return arrayGuid;
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <Item
          item={item}
          onPress={() => {
            setSelectedId(item.id);
            navigation.navigate('ActivityPage2', { item });
          }}
        />
      </View>
    );
  };

  const renderItem2 = ({ item }) => {
 
    return (
      <View>
        <TouchableOpacity onPress={() => setSelectedId(item.id)}>
          <Image
            style={{
              width: deviceWidth,
              height: 320,
            }}
            resizeMode="contain"
            source={{
              uri: `data:image/png;base64,${item.img}`,
            }}></Image>
        </TouchableOpacity>
      </View>
    );
  };

  const closeLoading = () => {
    setLoading(false);
  };

  const fetchBanner = async (url) => {
    await RNFetchBlob.fetch(
      'GET',
      'http://192.168.0.110:8906/Member/BplusErpDvSvrIIS.dll/DownloadFile',
      {
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-GUID': loginReducer.guid,
        FilePath: 'ShowLayout',
        FileName: url + '.png',
      },
    )
      .then((res) => res.base64())
      .then((base64str) => {
        setBannerImg(base64str);
      })
      .catch((error) => {
        console.error('FetchBanner' + error);
      });
    closeLoading();
  };

  const fetchActivityImg = async (url) => {
    let imgbase64 = null;
    await RNFetchBlob.config({ fileCache: true, appendExt: 'png' })
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
        imgbase64 = res.path();
      })
      .catch((error) => {
        console.error('fetchActivityImg: ' + error);
      });
    return imgbase64;
  };

  const stackMenuImg = async (ra4) => {
    let arrayResult = [];
    for (let i in ra4) {
      if (i < 3) {
        let jsonObj = {
          id: ra4[i] + 1,
          guid: ra4[i].guid,
          name: ra4[i].name,
          eName: ra4[i].eName,
          details: ra4[i].details,
          img: 'file://' + (await fetchActivityImg(ra4[i].guid)),
        };
        arrayResult.push(jsonObj);
      }
    }
    setArrayObj(arrayResult);
    dispatch(activityActions.LOname(arrayResult));
  };

  const stack = async () => {
    let ra = await fetchDataPopUpImg();
    setPopUpImg(ra);
    let ra3 = await fetchActivityData();
    let ra4 = await fetchActivityPage(ra3);
    await stackMenuImg(ra4);
    await fetchBanner(loginReducer.jsonResult[11].guid);
  };

  const fetchActivityPage = async (ra3) => {
    let redeemGuid = [];
    for (let i in ra3) {
      await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
        method: 'POST',
        body: JSON.stringify({
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-LOGIN-GUID': loginReducer.guid,
          'BPAPUS-FUNCTION': 'GetPage',
          'BPAPUS-PARAM':
            '{"SHWP_GUID": "' +
            ra3[i] +
            '","SHWP_IMAGE": "N", "SHWC_IMAGE": "N"}',
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          let responseData = JSON.parse(json.ResponseData);

          let jsonObj = {
            id: i,
            guid: responseData.SHOWPAGE.SHWPH_GUID,
            name: responseData.SHOWPAGE.SHWPH_TTL_CPTN,
            eName: responseData.SHOWPAGE.SHWPH_TTL_ECPTN,
            details: responseData.SHOWPAGE.SHWPH_EXPLAIN,
            img: '',
          };
          redeemGuid.push(jsonObj);
        })
        .catch((error) => {
          console.error('fetchPage: ' + error);
        });
      dispatch(activityActions.PageGuid(redeemGuid));
    }
    return redeemGuid;
  };

  const _onPressRedeem = () => {
    navigation.navigate('Redeem');
  };

  return (
    <View
      style={{ backgroundColor: '#E6EBFF', flex: 1, flexDirection: 'column' }}>
      <StatusBar hidden={false} />
      <View
        style={{
          height: 70,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        {filePath == '' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {imageUser ? (
              <TouchableOpacity
                onPress={chooseFile}
                style={{ height: 40, width: 40 }}>
                <Icon name="user-circle" size={35} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={chooseFile}
                style={{ height: 40, width: 40 }}>
                <Image
                  style={{
                    borderRadius: 20,
                    backgroundColor: 'gray',
                    width: 45,
                    height: 45,
                    borderWidth: 0.5,
                  }}
                  resizeMode="cover"
                  source={{ uri: `data:image/png;base64,${filePath}` }}></Image>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate('PersonalInfo')}>
              <Text style={{ fontSize: FontSize.medium }}>
                {Language.t('main.member')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={chooseFile}
              style={{ height: 40, width: 40 }}>
              <Image
                style={{
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  borderWidth: 0.5,
                }}
                resizeMode="cover"
                source={{
                  uri:
                    Platform.OS === 'ios'
                      ? userReducer.userData[userIndex].userImg
                      : 'file://' + userReducer.userData[userIndex].userImg,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('PersonalInfo')}>
              <Text style={{ marginLeft: 12, fontSize: FontSize.medium }}>
                {Language.t('main.member')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Image
          resizeMode="contain"
          source={require('../img/LogoBplusMember.png')}
          style={{
            marginRight: 55,
            width: 150,
            height: 200,
            alignContent: 'center',
            alignItems: 'center',
          }}></Image>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Icon name="bell" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
          <Image
            resizeMode="contain"
            source={{
              uri: `data:image/png;base64,${bannerImg}`,
            }}
            style={{ width: undefined, height: 200 }}></Image>
        </View>

        <View
          style={{
            marginTop: 20,
            alignItems: 'stretch',
            paddingLeft: 24,
            paddingRight: 24,
            height: 90,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyCard')}
            style={{
              flex: 1,
              height: 90,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              borderRightWidth: 0.5,
              borderBottomWidth: 0.7,
              borderBottomColor: '#000000',
              borderRightColor: '#000000',
            }}>
            <Image
              style={{
                width: Platform.OS === 'ios' ? 70 : 50,
                height: 50,
                marginBottom: 10,
              }}
              resizeMode="contain"
              source={{
                uri: menuImg.length
                  ? Platform.OS === 'ios'
                    ? menuImg[2].img
                    : 'file://' +menuImg[2].img
                  : null,
              }}></Image>
            <Text style={{ color: 'black' }}>
              {menuImg.length
                ? Language.getLang() == 'th'
                  ? menuImg[2].name
                  : menuImg[2].ename
                : null}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Campaign')}
            style={{
              flex: 1,
              height: 90,
              borderBottomWidth: 0.7,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',

              borderBottomColor: '#000000',
            }}>
            <Image
              style={{
                width: Platform.OS === 'ios' ? 70 : 50,
                height: 50,
                marginBottom: 10,
              }}
              resizeMode="contain"
              source={{
                uri: menuImg.length
                  ? Platform.OS === 'ios'
                    ? menuImg[6].img
                    : 'file://' + menuImg[6].img
                  : null,
              }}></Image>
            <Text style={{ color: 'black' }}>
              {menuImg.length
                ? Language.getLang() == 'th'
                  ? menuImg[6].name
                  : menuImg[6].ename
                : null}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            alignItems: 'stretch',
            paddingLeft: 24,
            paddingRight: 24,
            height: 90,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AboutCard')}
            style={{
              flex: 1,
              height: 90,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              borderRightWidth: 0.5,
              borderBottomWidth: 0.7,
              borderBottomColor: '#000000',
              borderRightColor: '#000000',
            }}>
            <Image
              style={{
                width: Platform.OS === 'ios' ? 70 : 50,
                height: 50,
                marginBottom: 10,
              }}
              resizeMode="contain"
              source={{
                uri: menuImg.length
                  ? Platform.OS === 'ios'
                    ? menuImg[8].img
                    : 'file://' + menuImg[8].img
                  : null,
              }}></Image>
            <Text style={{ color: 'black' }}>
              {menuImg.length
                ? Language.getLang() == 'th'
                  ? menuImg[8].name
                  : menuImg[8].ename
                : null}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Activity')}
            style={{
              flex: 1,
              height: 90,
              borderBottomWidth: 0.7,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              borderBottomColor: '#000000',
            }}>
            <Image
              style={{
                width: Platform.OS === 'ios' ? 70 : 50,
                height: 50,
                marginBottom: 10,
              }}
              resizeMode="contain"
              source={{
                uri: menuImg.length
                  ? Platform.OS === 'ios'
                    ? menuImg[9].img
                    : 'file://' + menuImg[9].img
                  : null,
              }}></Image>
            <Text style={{ color: 'black' }}>
              {menuImg.length
                ? Language.getLang() == 'th'
                  ? menuImg[9].name
                  : menuImg[9].ename
                : null}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            alignItems: 'stretch',
            paddingLeft: 24,
            paddingRight: 24,
            height: 90,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ContactUs')}
            style={{
              flex: 1,
              height: 90,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              borderRightWidth: 0.5,
              borderRightColor: '#000000',
            }}>
            <Image
              style={{
                width: Platform.OS === 'ios' ? 70 : 50,
                height: 50,
                marginBottom: 10,
              }}
              resizeMode="contain"
              source={{
                uri: menuImg.length
                  ? Platform.OS === 'ios'
                    ? menuImg[3].img
                    : 'file://' + menuImg[3].img
                  : null,
              }}></Image>
            <Text style={{ color: 'black' }}>
              {menuImg.length
                ? Language.getLang() == 'th'
                  ? menuImg[3].name
                  : menuImg[3].ename
                : null}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={_onPressRedeem}
            style={{
              flex: 1,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <Image
              style={{
                width: Platform.OS === 'ios' ? 70 : 50,
                height: 50,
                marginBottom: 10,
              }}
              resizeMode="contain"
              source={{
                uri: menuImg.length
                  ? Platform.OS === 'ios'
                    ? menuImg[0].img
                    : 'file://' + menuImg[0].img
                  : null,
              }}></Image>
            <Text style={{ color: 'black' }}>
              {menuImg.length
                ? Language.getLang() == 'th'
                  ? menuImg[0].name
                  : menuImg[0].ename
                : null}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: FontSize.medium,
            padding: 10,
            borderColor: 'gray',
            borderTopWidth: 0.7,
            marginLeft: 24,
            marginRight: 24,
          }}>
          {Language.t('main.feeds')}
        </Text>
        <FlatList
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          data={arrayObj}
          onMomentumScrollEnd={({ nativeEvent }) => {
            const active = Math.round(
              nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
            );
            setActive(active);
          }}
          renderItem={renderItem}
          keyExtractor={(item) => item.guid}
          extraData={selectedId}
        />
        <View
          style={{ flexDirection: 'row', justifyContent: 'center' }} // this will layout our dots horizontally (row) instead of vertically (column)
        >
          {arrayObj.map((_, i) => {
            return (
              <Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
                key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: i === active ? '#0288D1' : 'gray',
                  margin: 8,
                  borderRadius: 5,
                }}
              />
            );
          })}
        </View>
      </ScrollView>
      {showPopUp ? (
        <View
          style={{
            justifyContent: 'center',
            position: 'absolute',
            width: deviceWidth,
            height: deviceHeight,
          }}>
          <View
            style={{
              width: deviceWidth,
              height: deviceHeight,
              backgroundColor: 'black',
              position: 'absolute',
              opacity: 0.6,
            }}></View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 340,
                width: undefined,
                justifyContent: 'flex-end',
              }}>
              <Icon
                onPress={() => {
                  setShowPopUp(false);
                  dispatch(activityActions.ConName(popUpCheck.check));
                }}
                name="times-circle"
                size={25}
                color="white"
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 12,
                }}
              />
              <FlatList
                style={{ position: 'absolute' }}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                data={popUpImg}
                onMomentumScrollEnd={({ nativeEvent }) => {
                  const active = Math.round(
                    nativeEvent.contentOffset.x /
                    nativeEvent.layoutMeasurement.width,
                  );
                  setActive2(active);
                }}
                renderItem={renderItem2}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
              />
            </View>
            <View
              style={{ flexDirection: 'row', marginHorizontal: 10, padding: 5 }}>
              <TouchableOpacity onPress={updatePopUpCheck}>
                {popUpCheck.check ? (
                  <Icon name="square" size={25} color="white" />
                ) : (
                  <Icon name="check-square" size={25} color="white" />
                )}
              </TouchableOpacity>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  alignSelf: 'center',

                  marginLeft: 5,
                  color: 'white',
                }}>
                {Language.t('main.closePopUp')}
              </Text>
            </View>

            <View
              style={{
                height: 22,
                flexDirection: 'row',
                justifyContent: 'center',
              }} // this will layout our dots horizontally (row) instead of vertically (column)
            >
              {popUpImg.length
                ? popUpImg.map((_, i) => {
                  return (
                    <Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
                      key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                      style={{
                        height: 10,
                        width: 10,
                        backgroundColor: i === active2 ? '#42a5f5' : 'white',
                        margin: 8,
                        borderRadius: 5,
                      }}
                    />
                  );
                })
                : null}
            </View>
          </View>
        </View>
      ) : null}
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
    </View>
  );
};

const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Image
      style={{
        width: deviceWidth,
        height: 200,
      }}
      resizeMode="contain"
      source={{
        uri: item.img,
      }}></Image>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.large,
  },
});
const mapStateToProps = (state) => {
  return {
    LOguid: state.activityReducer.LOguid,
    LOname: state.activityReducer.LOname,
    LOresult: state.activityReducer.LOresult,
    pageResult: state.activityReducer.pageResult,
    pageGuid: state.activityReducer.pageGuid,
    conName: state.activityReducer.conName,
    conResult: state.activityReducer.conResult,
    userData: state.userReducer.userData,
    jsonResult: state.loginReducer.jsonResult,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxLOguid: (payload) => dispatch(LOguid(payload)),
    reduxLOname: (payload) => dispatch(LOname(payload)),
    reduxLOresult: (payload) => dispatch(LOresult(payload)),
    reduxPageResult: (payload) => dispatch(PageResult(payload)),
    reduxPageGuid: (payload) => dispatch(PageGuid(payload)),
    reduxConName: (payload) => dispatch(ConName(payload)),
    reduxConResult: (payload) => dispatch(ConResult(payload)),
    reduxSetUserData: (payload) => dispatch(setUserData(payload)),
    reduxJsonResult: (payload) => dispatch(jsonResult(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

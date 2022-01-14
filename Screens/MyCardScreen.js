import React, { useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { FontSize } from '../components/FontSizeHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStateIfMounted } from 'use-state-if-mounted';
import Feather from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { Language } from '../translations/I18n';
import { DateHelper } from '../components/DateHelper';
import { fetchTsMember } from '../components/fetchTsMember';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const MyCardScreen = () => {
  const [loading, setLoading] = useStateIfMounted(true);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const [userIndex, setUserIndex] = useStateIfMounted(loginReducer.index);
  const [cardImg, setCardImg] = useStateIfMounted('');
  const [redeemImg, setRedeemImg] = useStateIfMounted('');
  const [data, setData] = useStateIfMounted({
    title: '',
    firstName: '',
    lastName: '',
    idCard: '',
    expDate: '',
    point: '',
  });
  const closeLoading = () => {
    setLoading(false);
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
          loginReducer.jsonResult[2].guid +
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
        //ตอนนี้รูป Card ยังมีรูปเดียว ถ้ารูปเพิ่มต้องมาแก้ !!
        setCardImg(responseData.SHOWPAGE[0].IMAGE64);
      });

    await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[1].guid +
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
        //ตอนนี้ยังมีรูปเดียว ถ้ารูปเพิ่มต้องมาแก้ !!
        setRedeemImg(responseData.SHOWPAGE[0].IMAGE64);
      });

    let xresult = await fetchTsMember(
      databaseReducer.Data.urlser ,
      userReducer.userData[userIndex].phoneNum,
      userReducer.userData[userIndex].password,
      loginReducer.guid,
    );
    
    if (xresult) {
      setData({
        title: xresult.MB_INTL,
        firstName: xresult.MB_NAME,
        lastName: xresult.MB_SURNME,
        idCard: xresult.MB_CARD,
        expDate: xresult.MB_EXPIRE,
        point: xresult.MB_SH_POINT,
      });
    } else console.log('xresult was not fetchTsMember');
    closeLoading();
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',

        flex: 1,
        flexDirection: 'column',
      }}>
      <ScrollView>
        <View style={{ padding: 10 }} >
          <View
            style={{
              height: 35,

              borderBottomColor: '#000000',
              borderBottomWidth: 0.2,
              flexDirection: 'row',
              alignItems: 'stretch',
            }}>
            <Feather name="address-card" size={25} color="black"></Feather>
            <Text style={{ marginLeft: 10 }}>
              {Language.t('profileCard.headerMemberCard')}
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Image
              style={{
                height: 200,
                width: undefined,
                alignSelf: 'stretch',
              }}
              resizeMode="stretch"
              source={{
                uri: `data:image/png;base64,${cardImg}`,
              }}></Image>
            <View
              style={{
                flexDirection: 'column',
                position: 'absolute',
                top: 0,
                left: 30,
                right: 0,
                bottom: 20,
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  shadowColor: 'black',
                  fontWeight: 'bold',
                  shadowOpacity: 0.8,
                  shadowRadius: 3,
                  elevation: 5,
                  fontSize: FontSize.medium,
                  textShadowOffset: { width: 3, height: 3 },
                  textShadowRadius: 1,
                  color: 'white',
                }}>
                {data.idCard}
              </Text>
              <Text
                style={{
                  shadowColor: 'black',
                  shadowOpacity: 0.8,
                  shadowRadius: 3,
                  elevation: 5,
                  fontSize: FontSize.medium,
                  textShadowOffset: { width: 3, height: 3 },
                  textShadowRadius: 1,
                  color: 'white',
                }}>
                {data.title} {data.firstName} {data.lastName}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: FontSize.medium }}>
              {Language.t('profileCard.code')}
            </Text>
            <Text style={{ fontSize: FontSize.medium }}>{data.idCard}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: FontSize.medium }}>
              {Language.t('profileCard.rewardPoint')}
            </Text>
            <Text style={{ fontSize: FontSize.medium }}>{data.point}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: FontSize.medium }}>
              {Language.t('profileCard.rewardPointToday')}
            </Text>
            {/* <Text
            style={{
              color: '#0288D1',
              textDecorationLine: 'underline',
              fontSize: FontSize.medium,
            }}>
            {Language.t('profileCard.detail')}
          </Text> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
              borderBottomColor: 'black',
              borderBottomWidth: 0.7,
              paddingBottom: 15,
            }}>
            <Text style={{ fontSize: FontSize.medium }}>
              {Language.t('profileCard.dateOfExpiry')}
            </Text>
            <Text style={{ fontSize: FontSize.medium }}>
              {DateHelper.getDate(data.expDate)}
            </Text>
          </View>

          <Image
            style={{
              marginTop: 20,
              height: 200,
              width: deviceWidth,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={{
              uri: `data:image/png;base64,${redeemImg}`,
            }}
          />
        </View>
      </ScrollView>
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
              backgroundColor:null
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

export default MyCardScreen;

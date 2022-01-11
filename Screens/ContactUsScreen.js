import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  Linking,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import * as ContactUsActions from '../src/actions/contactUsActions';
import {Language} from '../translations/I18n';
import {FontSize} from '../components/FontSizeHelper';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ContactUsScreen = () => {
  const dispatch = useDispatch();
  const [explains, setExplains] = useState([]);
  const contactUsReducer = useSelector(
    ({contactUsReducer}) => contactUsReducer,
  );
  const [loading, setLoading] = useState(true);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [longitude, setLongitude] = useState(100.4592939);
  const [latitude, setLatitude] = useState(13.7841711);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const {container} = styles;
  const closeLoading = () => {
    setLoading(false);
  };

  const goMap = (latitude, longitude) => {
    console.log('latitude => ', latitude);
    console.log('longitude => ', longitude);
    if (latitude && longitude) {
      const position = `${latitude},${longitude}`;
      const url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${position}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            console.log(`Can't handle url => `, url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.log('An error occurred ', err));
    }
  };
  const fetchData = async () => {
    let arrayGuid = [];
    await fetch(userReducer.http + 'ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[3].guid +
          '","SHWJ_IMAGE": "Y", "SHWL_IMAGE": "Y"}',
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
          arrayGuid.push(responseData.SHOWPAGE[i].SHWPH_GUID);
        }
        dispatch(ContactUsActions.LOguid(arrayGuid));
      })
      .catch((error) => {
        console.error(error);
      });
    await fetchPageData(arrayGuid);
  };
  const fetchPageData = async (guid) => {
    let arrayName = [];
    let arrayExplain = [];
    for (let i in guid) {
      await fetch(userReducer.http + 'ECommerce', {
        method: 'POST',
        body: JSON.stringify({
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-LOGIN-GUID': loginReducer.guid,
          'BPAPUS-FUNCTION': 'GetPage',
          'BPAPUS-PARAM':
            '{"SHWP_GUID": "' +
            guid[i] +
            '","SHWP_IMAGE": "Y", "SHWC_IMAGE": "Y"}',
          'BPAPUS-FILTER': '',
          'BPAPUS-ORDERBY': '',
          'BPAPUS-OFFSET': '0',
          'BPAPUS-FETCH': '0',
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          let responseData = JSON.parse(json.ResponseData);
          if (Language.getLang() === 'th') {
            arrayName.push(responseData.SHOWPAGE.SHWPH_TTL_CPTN);
          } else {
            arrayName.push(responseData.SHOWPAGE.SHWPH_TTL_ECPTN);
          }
          arrayExplain.push(responseData.SHOWPAGE.SHWPH_EXPLAIN.split('EN:'));
        })
        .catch((error) => {
          console.error(error);
        });
    }

    let strings = '';
    if (Language.getLang() === 'th') {
      strings = JSON.stringify(arrayExplain[0][0]);
    } else {
      strings = JSON.stringify(arrayExplain[0][1]);
    }

    console.log('strings :' + strings);
    dispatch(ContactUsActions.PageResult(strings.split('\\r\\n')));
    dispatch(ContactUsActions.LOname(arrayName));
    dispatch(ContactUsActions.LOresult(arrayExplain));
    setExplains(arrayExplain[1]);
    closeLoading();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={container}>
      <ScrollView>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            fontSize: FontSize.medium,
          }}>
          {Language.t('contact.headQuarter')}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {contactUsReducer.pageResult[1]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            fontSize: FontSize.medium,
          }}>
          {contactUsReducer.pageResult[2]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {contactUsReducer.pageResult[3]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            fontSize: FontSize.medium,
          }}>
          {contactUsReducer.pageResult[4]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {contactUsReducer.pageResult[5]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            fontSize: FontSize.medium,
          }}>
          {contactUsReducer.pageResult[6]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {contactUsReducer.pageResult[7]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            fontSize: FontSize.medium,
          }}>
          {contactUsReducer.pageResult[8]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {contactUsReducer.pageResult[9]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
            fontSize: FontSize.medium,
          }}>
          {contactUsReducer.pageResult[10]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {contactUsReducer.pageResult[11]}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {contactUsReducer.pageResult[12]}
        </Text>
        <Text
          style={{flex: 1, backgroundColor: '#fff', padding: 10, fontSize: FontSize.medium}}>
          {Language.t('contact.map')}
        </Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{width: deviceWidth, height: 200}}
          onPress={() => goMap(latitude, longitude)}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}>
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          />
        </MapView>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,

            fontSize: FontSize.medium,
          }}>
          {Language.t('contact.branch')}
        </Text>
        
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,

            fontSize: FontSize.medium,
          }}>
          {Language.t('profileCard.detail')}
        </Text>
        <Text
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 10,
          }}>
          {Language.getLang() === 'th' ? explains[0] : explains[1]}
        </Text>
        <Text
          style={{flex: 1, backgroundColor: '#fff', padding: 10, fontSize: FontSize.medium}}>
          {Language.t('contact.map')}
        </Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{width: deviceWidth, height: 200}}
          onPress={() => goMap(latitude, longitude)}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}>
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          />
        </MapView>
      </ScrollView>
      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight - 50,
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
            color="#0288D1"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    LOguid: state.contactUsReducer.LOguid,
    LOname: state.contactUsReducer.LOname,
    LOresult: state.contactUsReducer.LOresult,
    pageResult: state.contactUsReducer.pageResult,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxLOguid: (payload) => dispatch(LOguid(payload)),
    reduxLOname: (payload) => dispatch(LOname(payload)),
    reduxLOresult: (payload) => dispatch(LOresult(payload)),
    reduxPageResult: (payload) => dispatch(PageResult(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
});

import React, { useState, useEffect } from 'react';
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native';
import { FontSize } from '../components/FontSizeHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import * as NotiActions from '../src/actions/notiActions';
import { useNavigation } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import Colors from '../src/Colors';
const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Image
      style={{
        width: undefined,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      resizeMode="contain"
      source={{
        uri: item.img,
      }}></Image>
  </TouchableOpacity>
);

const NotiScreen = () => {
  const notiReducer = useSelector(({ notiReducer }) => notiReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const [arrayObj, setArrayObj] = useState([]);
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const [isloading, setIsLoading] = useState(true);
  const interestReducer = useSelector(({ interestReducer }) => interestReducer);
  const Cdata = () => {
    let tempUser = userReducer.userData[userIndex].interestImg
    for (var i in tempUser)
      for (var j in tempUser[i])
        console.log(`tempUser[userIndex].interestImg >> ${tempUser[i][j].GUID}`)
    for (let i in interestReducer.interestImg)
      for (let j in interestReducer.interestImg[i])
        console.log(`interestReducer.interestImg>> ${interestReducer.interestImg[i][j].CODE} ${interestReducer.interestImg[i][j].check}`)

  }
  const closeLoading = () => {
    setIsLoading(false);
  };
  const fetchImg = async (url, imageext) => {
    console.log(`fetchImg >> ${url} >> ${imageext}`)
    let imgbase64 = null;
    await RNFetchBlob.config({ fileCache: true, appendExt: imageext })
      .fetch(
        'GET',
        'http://192.168.0.110:8906/Member/BplusErpDvSvrIIS.dll/DownloadFile',
        {
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-GUID': loginReducer.guid,
          FilePath: 'ShowPage',
          FileName: url + '.' + imageext,
        },
      )
      .then((res) => {
        imgbase64 = res.path();
      })
      .catch((error) => {
        console.error('fetchImg: ' + error);
      });
    return imgbase64;
  };

  const fetchData = async () => {
    var arrayName = [];
    var arrayGuid = [];
    await fetch(databaseReducer.Data.urlser + '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[5].guid +
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
        let tempUser = userReducer.userData[userIndex].interestImg
        for (var i in responseData.SHOWPAGE)

          for (let j in tempUser)
            for (let k in tempUser[j]) {
              console.log(responseData.SHOWPAGE[i].SHWPH_TTL_CPTN)
              if (responseData.SHOWPAGE[i].SHWPH_TTL_CPTN.search(tempUser[j][k].CODE.split('MB_')[1]) > -1 && tempUser[j][k].check == true) {
                arrayName.push(responseData.SHOWPAGE[i].SHWPH_EXPLAIN);
                arrayGuid.push(responseData.SHOWPAGE[i].SHWPH_GUID);
              }
              else if (responseData.SHOWPAGE[i].SHWPH_TTL_CPTN.search('ALL') > -1) {
                arrayName.push(responseData.SHOWPAGE[i].SHWPH_EXPLAIN);
                arrayGuid.push(responseData.SHOWPAGE[i].SHWPH_GUID);
              }

            }
        dispatch(NotiActions.LOguid(arrayGuid));
        dispatch(NotiActions.LOname(arrayName));
        dispatch(NotiActions.LOresult(json));
      })
      .catch((error) => {
        console.error(error);
      });

    return arrayGuid;
  };
  const fetchPage = async (ra) => {
    let redeemGuid = [];
    for (let i in ra) {
      await fetch(databaseReducer.Data.urlser + '/ECommerce', {
        method: 'POST',
        body: JSON.stringify({
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-LOGIN-GUID': loginReducer.guid,
          'BPAPUS-FUNCTION': 'GetPage',
          'BPAPUS-PARAM':
            '{"SHWP_GUID": "' +
            ra[i] +
            '","SHWP_IMAGE": "Y", "SHWC_IMAGE": "Y"}',
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
            id: i,
            guid: responseData.SHOWPAGE.SHWPH_GUID,
            name: responseData.SHOWPAGE.SHWPH_TTL_CPTN,
            eName: responseData.SHOWPAGE.SHWPH_TTL_ECPTN,
            details: responseData.SHOWPAGE.SHWPH_EXPLAIN,
            imageext: responseData.SHOWPAGE.IMAGEEXT,

            img: 'file://' + (await fetchImg(responseData.SHOWPAGE.SHWPH_GUID, responseData.SHOWPAGE.IMAGEEXT)),
          };
          redeemGuid.push(jsonObj);
        })
        .catch((error) => {
          console.error(error);
        });

      dispatch(NotiActions.PageGuid(redeemGuid));
    }

    return redeemGuid;
  };

  const wow = async () => {
    let ra = await fetchData();
    let ra2 = await fetchPage(ra);
    setArrayObj(ra2);
    closeLoading();
  };

  useEffect(() => {

    wow();
    setIsLoading(true);

  }, []);

  const renderItem = ({ item }) => {
    return (
      <View>
        <Item
          item={item}
          onPress={() => {
            setSelectedId(item.id);
            navigation.navigate('ActivityPage', { item });
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <TouchableNativeFeedback
        onPress={() => {
          Cdata()
        }}>
        <View>
          <Text
            style={{
              color: Colors.buttonColorPrimary,
              backgroundColor: 'red',
              textDecorationLine: 'underline',
              fontSize: FontSize.medium,
              alignSelf: 'center',
              padding: 10,
            }}>
            555555
          </Text>
        </View>
      </TouchableNativeFeedback> */}

      <FlatList
        data={arrayObj}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
      <ActivityIndicator
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: deviceHeight / 2,
        }}
        transparent={true}
        animating={isloading}
        size="large"
        color="#0288D1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {},
  title: {
    fontSize: FontSize.large,
  },
});
const mapStateToProps = (state) => {
  return {
    LOguid: state.notiReducer.LOguid,
    LOname: state.notiReducer.LOname,
    LOresult: state.notiReducer.LOresult,
    pageGuid: state.notiReducer.pageGuid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxLOguid: (payload) => dispatch(LOguid(payload)),
    reduxLOname: (payload) => dispatch(LOname(payload)),
    reduxLOresult: (payload) => dispatch(LOresult(payload)),
    reduxPageGuid: (payload) => dispatch(PageGuid(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NotiScreen);

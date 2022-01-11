import React, {useState, useEffect} from 'react';
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CardView from 'react-native-cardview';
import {useSelector, useDispatch} from 'react-redux';
import {Language} from '../translations/I18n';
import {FontSize} from '../components/FontSizeHelper';
import {connect} from 'react-redux';
import * as campaignActions from '../src/actions/campaignActions';

const Item = ({item, onPress, style}) => {
  let details = item.detail.split('EN:');
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <CardView>
        <View
          style={{
            borderBottomColor: '#000000',
            borderBottomWidth: 0.2,
            flexDirection: 'row',
            alignItems: 'stretch',
          }}>
          <Image
            style={{
              width: 130,
              height: 130,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
            resizeMode="center"
            source={{
              uri: `data:image/png;base64,${item.img}`,
            }}></Image>
          <View
            style={{
              paddingLeft: 10,
              flex: 1,
              flexDirection: 'column',
              padding: 5,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: FontSize.medium}}>
              {Language.getLang() === 'th'
                ? item.title
                : item.etitle}
            </Text>
            <View
              style={{
                marginTop: 5,
              }}>
              <Text>
                {Language.getLang() === 'th'
                  ? details[0]
                  : details[1]}
              </Text>
            </View>
          </View>
        </View>
      </CardView>
    </TouchableOpacity>
  );
};
const CampaignScreen = () => {
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [arrayObj, setArrayObj] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const [isloading, setIsLoading] = useState(true);
  const [tempA, setTempA] = useState([]);
  const [tempB, setTempB] = useState([]);
  const [tempC, setTempC] = useState([]);
  let arrayResult = [];

  const closeLoading = () => {
    setIsLoading(false);
  };

  const fetchData = async () => {
    let arrayName = [];
    let arrayGuid = [];
    await fetch(userReducer.http + 'ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[6].guid +
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
        for (var i in responseData.SHOWPAGE) {
          arrayName.push(responseData.SHOWPAGE[i].SHWPH_EXPLAIN);
          arrayGuid.push(responseData.SHOWPAGE[i].SHWPH_GUID);
        }

        dispatch(campaignActions.LOguid(arrayGuid));
        dispatch(campaignActions.LOname(arrayName));
        dispatch(campaignActions.LOresult(json));
      })
      .catch((error) => {
        console.error(error);
      });
    return arrayGuid;
  };

  const fetchContent = async (i, data) => {
    let a = '';
    let b = '';
    let c = '';
    setTempA((item) => (a = item));
    setTempB((item) => (b = item));
    setTempC((item) => (c = item));

    await fetch(userReducer.http + 'ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetPage',
        'BPAPUS-PARAM':
          '{"SHWP_GUID": "' +
          data[i] +
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
        a.push(responseData.SHOWPAGE.SHWPH_GUID);
        b.push(responseData.SHOWPAGE.SHWPH_TTL_CPTN);
        c.push(responseData.SHOWPAGE.SHWPH_EXPLAIN);
        let jsonObj = {
          id: i,
          title: responseData.SHOWPAGE.SHWPH_TTL_CPTN,
          etitle: responseData.SHOWPAGE.SHWPH_TTL_ECPTN,
          detail: responseData.SHOWPAGE.SHWPH_EXPLAIN,
          img: responseData.SHOWPAGE.IMAGE64,
        };
        arrayResult.push(jsonObj);
      })
      .catch((error) => {
        console.error('ERROR at fetchContent' + error);
      });

    setTempA(a);
    setTempB(b);
    setTempC(c);
  };

  const wow = async () => {
    const rGuidArray = await fetchData();

    for (let x in rGuidArray) {
      await fetchContent(x, rGuidArray);
    }

    let tA = '';
    let tB = '';
    let tC = '';
    setTempA((item) => (tA = item));
    setTempB((item) => (tB = item));
    setTempC((item) => (tC = item));
    dispatch(campaignActions.PageGuid(tA));
    dispatch(campaignActions.PageName(tB));
    dispatch(campaignActions.PageResult(tC));

    setArrayObj(arrayResult);
    closeLoading();
  };
  useEffect(() => {
    wow();
  }, []);
  const renderItem = ({item}) => {
    return (
      <View>
        <Item item={item} onPress={() => setSelectedId(item.id)} />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
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
    </SafeAreaView>
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
    LOguid: state.campaignReducer.LOguid,
    LOname: state.campaignReducer.LOname,
    LOresult: state.campaignReducer.LOresult,
    pageGuid: state.campaignReducer.pageGuid,
    pageName: state.campaignReducer.pageName,
    pageResult: state.campaignReducer.pageResult,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxPageGuid: (payload) => dispatch(PageGuid(payload)),
    reduxPageName: (payload) => dispatch(PageName(payload)),
    reduxPageResult: (payload) => dispatch(PageResult(payload)),
    reduxLOguid: (payload) => dispatch(LOguid(payload)),
    reduxLOname: (payload) => dispatch(LOname(payload)),
    reduxLOresult: (payload) => dispatch(LOresult(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CampaignScreen);

import 'react-native-gesture-handler';
import {
  Container,
  Header,
  Tab,
  Tabs,
  ScrollableTab,
  Text,
  TabHeading,
} from 'native-base';
import {Dimensions} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Language} from '../translations/I18n';
import React, {useState, useEffect} from 'react';
import * as RedeemActions from '../src/actions/redeemActions';
import {connect} from 'react-redux';
import RedeemPage from '../pages/RedeemPage';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import {FontSize} from '../components/FontSizeHelper';

const RedeemTabStack = () => {
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const redeemReducer = useSelector(({redeemReducer}) => redeemReducer);
  const dispatch = useDispatch();
  const [userIndex, setUserIndex] = useState(loginReducer.index);

  const fetchData = async () => {
    var arrayGuid = [];

    await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[0].guid +
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

        dispatch(RedeemActions.LOguid(arrayGuid));
        dispatch(RedeemActions.LOresult(responseData.SHOWPAGE));
      })
      .catch((error) => {
        console.error(error);
      });

    return arrayGuid;
  };

  const fetchAPI = async (ra) => {
    let redeemGuid = [];
    var arrayName = [];
    for (let i in ra) {
      await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
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
        .then((json) => {
          let responseData = JSON.parse(json.ResponseData);
          let jsonObj = null;
          if (Language.getLang() === 'th') {
            arrayName.push(responseData.SHOWPAGE.SHWPH_TTL_CPTN);
            jsonObj = {
              id: i,
              loName: responseData.SHOWPAGE.SHWPH_TTL_CPTN,
              in: [],
            };
          } else {
            arrayName.push(responseData.SHOWPAGE.SHWPH_TTL_ECPTN);
            jsonObj = {
              id: i,
              loName: responseData.SHOWPAGE.SHWPH_TTL_ECPTN,
              in: [],
            };
          }

          for (let j in responseData.SHOWCONTENT) {
            let jsonObj2 = {
              guid: responseData.SHOWCONTENT[j].SHWC_GUID,
              name: responseData.SHOWCONTENT[j].SHWC_ALIAS,
              eName: responseData.SHOWCONTENT[j].SHWC_EALIAS,
              details: responseData.SHOWCONTENT[j].SHWC_EDIT_FEATURE,
              img: '',
            };

            jsonObj.in.push(jsonObj2);
          }
          redeemGuid.push(jsonObj);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    dispatch(RedeemActions.LOname(arrayName));
    return redeemGuid;
  };
  const wow = async () => {
    let ra = await fetchData();
    let x = await fetchAPI(ra);
    dispatch(RedeemActions.PageGuid(x));
  };

  useEffect(() => {
    wow();
  }, []);

  return (
    <Container style={{backgroundColor: 'white'}}>
      {redeemReducer.LOresult && (
        <Tabs
          renderTabBar={() => (
            <ScrollableTab
              underlineStyle={{backgroundColor: 'white', height: 2}}
            />
          )}>
          {redeemReducer.pageGuid.map((obj, index) => {
            return (
              <Tab
                key={obj.id + '' + obj.loName}
                heading={
                  <TabHeading style={{width: deviceWidth / 3 ,borderRightWidth:0.3}} >
                    <Text
                      style={{
                        fontSize: FontSize.medium-3,
                        textAlign: 'center',
                      }}>
                      {obj.loName}
                    </Text>
                  </TabHeading>
                }>
                <RedeemPage obj={obj} />
              </Tab>
            );
          })}
        </Tabs>
      )}
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    pageGuid: state.redeemReducer.pageGuid,
    pageName: state.redeemReducer.pageName,
    pageResult: state.redeemReducer.pageResult,
    LOguid: state.redeemReducer.LOguid,
    LOname: state.redeemReducer.LOname,
    LOresult: state.redeemReducer.LOresult,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxpageGuid: (payload) => dispatch(PageGuid(payload)),
    reduxpageName: (payload) => dispatch(PageName(payload)),
    reduxpageResult: (payload) => dispatch(PageResult(payload)),
    reduxLOguid: (payload) => dispatch(LOguid(payload)),
    reduxLOname: (payload) => dispatch(LOname(payload)),
    reduxLOresult: (payload) => dispatch(LOresult(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RedeemTabStack);

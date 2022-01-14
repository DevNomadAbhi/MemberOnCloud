import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  Container,
  Header,
  Content,
  Icon,
  Accordion,
  Body,
  Left,
  Right,
  Title,
} from 'native-base';
import {Language} from '../translations/I18n';
import {useSelector, useDispatch} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
const InstructionScreen = () => {
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [bannerImg, setBannerImg] = useState('');
  const [text, setText] = useState('');
  const fetchData = async () => {
    await fetch(databaseReducer.Data.urlser+ '/ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[12].guid +
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
        setBannerImg(responseData.SHOWLAYOUT.IMAGE64);
        setText(responseData.SHOWLAYOUT.SHWLH_EXPLAIN);
      })
      .catch((error) => {
        console.error('fetchData: ' + error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        style={{
          backgroundColor: '#E6EBFF',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.7,
        }}>
        <Left />
        <Body>
          <Title style={{color: 'black'}}>
            {Language.t('instruction.header')}
          </Title>
        </Body>
        <Right />
      </Header>
      <ScrollView>
        {text == '' ? null : (
          <Text style={{margin: 10, fontSize: 18}}>{text}</Text>
        )}

        <Image
          resizeMode="contain"
          style={{
            margin: 10,
            width: undefined,
            height: 750,
          }}
          source={{
            uri: `data:image/png;base64,${bannerImg}`,
          }}></Image>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InstructionScreen;

const styles = StyleSheet.create({});

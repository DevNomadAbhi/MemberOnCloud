import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Language } from '../translations/I18n';
import { FontSize } from '../components/FontSizeHelper';

const AboutCardScreen = () => {
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const userReducer = useSelector(({ userReducer }) => userReducer);
  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const [resultJson, setResultJson] = useState([]);

  const fetchData = async () => {
    await fetch(userReducer.http + 'ECommerce', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': loginReducer.guid,
        'BPAPUS-FUNCTION': 'GetLayout',
        'BPAPUS-PARAM':
          '{"SHWL_GUID": "' +
          loginReducer.jsonResult[8].guid +
          '","SHWL_IMAGE": "N", "SHWP_IMAGE": "N"}',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);
        setResultJson(responseData.SHOWPAGE[0].SHWPH_EXPLAIN.split('EN:'));
      })
      .catch((error) => {
        console.error(error);
        //setResultJson(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 2 }}>
        <Text>
          {Language.getLang() === 'th'
            ? resultJson[0]
            : resultJson[1]}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'column',
  },
  textHeader: {
    marginBottom: 5,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
  },
});

export default AboutCardScreen;

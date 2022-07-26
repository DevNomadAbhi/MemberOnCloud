import React, { useState, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import { useSelector } from 'react-redux';
import { FontSize } from '../components/FontSizeHelper';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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

const RedeemPage = ({ obj }) => {
  const [selectedId, setSelectedId] = useState(null);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const [arrayObj, setArrayObj] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const closeLoading = () => {
    setLoading(false);
  };

  const fetchImg = async (url) => {

    let imgbase64 = null;
    await RNFetchBlob.config({ fileCache: true, appendExt: 'png' })
      .fetch(
        'GET',
        'http://192.168.0.110:8906/Member/BplusErpDvSvrIIS.dll/DownloadFile',
        {
          'BPAPUS-BPAPSV': loginReducer.serviceID,
          'BPAPUS-GUID': loginReducer.guid,
          FilePath: 'ShowContent',
          FileName: url + '.png',
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

  const wow = async () => {
    for (let i in obj.in) {
      const resulImg = await fetchImg(obj.in[i].guid);

      obj.in[i].img = 'file://' + resulImg;
    }
    setArrayObj(obj);
    closeLoading();
  };

  useEffect(() => {
    if (obj)
      wow();
    else setLoading(true)
  }, []);
  useEffect(() => {

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
    <SafeAreaView style={styles.container}>
      <ActivityIndicator
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: deviceHeight / 2,
        }}
        transparent={true}
        animating={loading}
        size="large"
        color="#0288D1"
      />
      <FlatList
        data={arrayObj.in}
        renderItem={renderItem}
        keyExtractor={(item) => item.guid}
        extraData={selectedId}
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

export default RedeemPage;

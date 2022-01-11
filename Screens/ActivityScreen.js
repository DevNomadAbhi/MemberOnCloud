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
import {useSelector, useDispatch} from 'react-redux';
import {connect} from 'react-redux';
import {FontSize} from '../components/FontSizeHelper';
import RNFetchBlob from 'rn-fetch-blob';
import * as ActivityActions from '../src/actions/activityActions';
import {useNavigation} from '@react-navigation/native';

const Item = ({item, onPress, style}) => (
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
const window = Dimensions.get('window');

const ActivityScreen = () => {
  const activityReducer = useSelector(({activityReducer}) => activityReducer);
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const [arrayObj, setArrayObj] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isloading, setIsLoading] = useState(true);
  const what = activityReducer.pageGuid;
  const closeLoading = () => {
    setIsLoading(false);
  };

  const fetchImg = async (url) => {
    let imgbase64 = null;
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
        imgbase64 = res.path();
      })
      .catch((error) => {
        console.error('fetchImg: ' + error);
      });
    return imgbase64;
  };
  const wow = async () => {
    for (let i in activityReducer.LOguid) {
      const resulImg = await fetchImg(activityReducer.LOguid[i]);
      what[i].img = 'file://' + resulImg;
    }
    setArrayObj(what);
    closeLoading();
  };

  useEffect(() => {
    wow();
  }, []);

  const renderItem = ({item}) => {
    return (
      <View>
        <Item
          item={item}
          onPress={() => {
            setSelectedId(item.id);
            navigation.navigate('ActivityPage', {item});
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
       <ActivityIndicator
        style={styles.indicator}
        transparent={true}
        animating={isloading}
        size="large"
        color="#0288D1"
      />
      <FlatList
        data={arrayObj}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: window.height / 2,
  },
});
const mapStateToProps = (state) => {
  return {
    pageResult: state.activityReducer.pageResult,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reduxPageResult: (payload) => dispatch(PageResult(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityScreen);

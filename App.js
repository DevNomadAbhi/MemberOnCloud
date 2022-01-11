import React, {useState, useEffect} from 'react';
import {PersistGate} from 'redux-persist/es/integration/react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderBackground} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button, Text, View, Image} from 'react-native';
import PersonalInfoScreen from './Screens/PersonalInfoScreen';
import RegisterScreen from './Screens/RegisterScreen';
import InstructionScreen from './Screens/InstructionScreen';
import HomeScreen from './Screens/HomeScreen';
import {useStateIfMounted} from 'use-state-if-mounted';
import Mycard from './Screens/MyCardScreen';
import Campaign from './Screens/CampaignScreen';
import AboutCard from './Screens/AboutCardScreen';
import Activity from './Screens/ActivityScreen';
import DetailScreen from './Screens/DetailScreen';
import SelectLanguageScreen from './Screens/SelectLanguageScreen';
import HelperScreen from './Screens/HelperScreen';
import {store, persistor} from './src/store/store';
import {Language, changeLanguage} from './translations/I18n';
import {useSelector} from 'react-redux';
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

//import Contact from './Screens/ContactScreen';
import Redeem from './Screens/RedeemScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import LoginScreen from './Screens/LoginScreen';
import InterestScreen from './Screens/InterestScreen';
import NotiScreen from './Screens/NotiScreen';
import FingerPrintScreen from './Screens/FingerPrintScreen';
import ContactUs from './Screens/ContactUsScreen';
import ActivityPage from './components/ActivityPage';
import ActivityPage2 from './components/ActivityPage2';
import SelectBase from './pages/SelectBase';
import ScanScreen from './pages/ScanScreen';
import AuthenticationScreen from './Screens/AuthenticationScreen';

const DetailStack = createStackNavigator();
function DetailsStackScreen() {
  return (
    <DetailStack.Navigator>
      <DetailStack.Screen
        options={{headerTitle: Language.t('menu.header'), headerShown: false}}
        name="DetailScreen"
        component={DetailScreen}
      />
      <DetailStack.Screen
        options={{headerShown: false}}
        name="PersonalInfoScreen"
        component={PersonalInfoStackScreen}
      />
      <DetailStack.Screen
        options={{headerTitle: Language.t('changeLanguage.header')}}
        name="SelectLanguageScreen"
        component={SelectLanguageScreen}
      />
      <DetailStack.Screen
        options={{headerTitle: Language.t('fingerPrint.header')}}
        name="FingerPrintScreen"
        component={FingerPrintScreen}
      />
    </DetailStack.Navigator>
  );
}

const PersonalInfoStack = createStackNavigator();
function PersonalInfoStackScreen() {
  return (
    <PersonalInfoStack.Navigator>
      <PersonalInfoStack.Screen
        options={{headerShown: false}}
        name="PersonalInfoScreen"
        component={PersonalInfoScreen}
      />
      <PersonalInfoStack.Screen
        options={{headerShown: false}}
        name="AuthenticationScreen"
        component={AuthenticationScreen}
      />
    </PersonalInfoStack.Navigator>
  );
}

const LoginStack = createStackNavigator();
function LoginStackScreen() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        options={{headerShown: false}}
        name="LoginScreen"
        component={LoginScreen}
      />
      <LoginStack.Screen
        options={{headerShown: false}}
        name="SelectBaseScreen"
        component={SelectBase}
      />
      <LoginStack.Screen
        options={{title: Language.t('selectBase.scanQR'), headerLeft: ''}}
        name="ScanScreen"
        component={ScanScreen}
      />
    </LoginStack.Navigator>
  );
}

const RegisterStack = createStackNavigator();
function RegisterStackScreen() {
  return (
    <RegisterStack.Navigator mode="modal">
      <RegisterStack.Screen
        options={{headerShown: false}}
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <RegisterStack.Screen
        options={{headerShown: false}}
        name="AuthenticationScreen"
        component={AuthenticationScreen}
      />
    </RegisterStack.Navigator>
  );
}

const RedeemStack = createStackNavigator();
function RedeemStackScreen() {
  return (
    <RedeemStack.Navigator>
      <RedeemStack.Screen
        options={{headerShown: false}}
        name="RedeemScreen"
        component={Redeem}
      />
      <RedeemStack.Screen
        options={{headerShown: false}}
        name="ActivityPage"
        component={ActivityPage}
      />
    </RedeemStack.Navigator>
  );
}

const NotiStack = createStackNavigator();
function NotiStackScreen() {
  return (
    <NotiStack.Navigator>
      <NotiStack.Screen
        options={{headerShown: false}}
        name="NotiScreen"
        component={NotiScreen}
      />
      <NotiStack.Screen
        options={{headerShown: false}}
        name="ActivityPage"
        component={ActivityPage}
      />
    </NotiStack.Navigator>
  );
}

const ActivityStack = createStackNavigator();
function ActivityStackScreen() {
  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen
        options={{headerShown: false}}
        name="ActivityScreen"
        component={Activity}
      />
      <ActivityStack.Screen
        options={{headerShown: false}}
        name="ActivityPage"
        component={ActivityPage}
      />
    </ActivityStack.Navigator>
  );
}

const ActivityHomeStack = createStackNavigator();
function ActivityHomeStackScreen() {
  return (
    <ActivityHomeStack.Navigator>
      <ActivityHomeStack.Screen
        options={{headerShown: false}}
        name="HomeScreen"
        component={HomeScreen}
      />
      <ActivityHomeStack.Screen
        options={{headerShown: false}}
        name="ActivityPage2"
        component={ActivityPage2}
      />
    </ActivityHomeStack.Navigator>
  );
}
const MenuStack = createStackNavigator();
function MenusStackScreen() {
  return (
    <MenuStack.Navigator>
      <MenuStack.Screen
        options={{headerShown: false}}
        name="Menu"
        component={ActivityHomeStackScreen}
      />

      <MenuStack.Screen
        options={{
          headerBackTitle: ' ',
          headerTitle: Language.t('profileCard.header'),
        }}
        name="MyCard"
        component={Mycard}
      />
      <MenuStack.Screen
        options={{
          headerBackTitle: ' ',
          headerTitle: Language.t('main.campaign'),
        }}
        name="Campaign"
        component={Campaign}
      />
      <MenuStack.Screen
        options={{
          headerBackTitle: ' ',
          headerTitle: Language.t('privilageForMember.header'),
        }}
        name="AboutCard"
        component={AboutCard}
      />
      <MenuStack.Screen
        options={{headerShown: false}}
        name="PersonalInfo"
        component={PersonalInfoStackScreen}
      />

      <MenuStack.Screen
        options={{headerBackTitle: ' ', headerTitle: Language.t('main.feeds')}}
        name="Activity"
        component={ActivityStackScreen}
      />
      <MenuStack.Screen
        options={{
          headerBackTitle: ' ',
          headerTitle: Language.t('main.contact'),
        }}
        name="ContactUs"
        component={ContactUs}
      />
      <MenuStack.Screen
        options={{headerBackTitle: ' ', headerTitle: Language.t('main.redeem')}}
        name="Redeem"
        component={RedeemStackScreen}
      />
      <MenuStack.Screen
        options={{
          headerBackTitle: ' ',
          headerTitle: Language.t('notiAlert.header'),
        }}
        name="Notification"
        component={NotiStackScreen}
      />
    </MenuStack.Navigator>
  );
}

const BottomTabs = createBottomTabNavigator();
const tabs = () => (
  <BottomTabs.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused}) => {
        if (route.name === 'Home') {
          return (
            <Image
              source={
                focused
                  ? require('./img/iconsMenu/home.png')
                  : require('./img/iconsMenu/home-b.png')
              }
              style={{
                width: 25,
                height: 20,
              }}
            />
          );
        } else if (route.name === 'Settings') {
          return (
            <Image
              source={
                focused
                  ? require('./img/iconsMenu/member.png')
                  : require('./img/iconsMenu/member-b.png')
              }
              style={{
                width: 25,
                height: 20,
              }}
            />
          );
        } else if (route.name === 'Instruction') {
          return (
            <Image
              source={
                focused
                  ? require('./img/iconsMenu/instruction.png')
                  : require('./img/iconsMenu/instruction-b.png')
              }
              style={{
                width: 25,
                height: 20,
              }}
            />
          );
        } else if (route.name === 'Helper') {
          return (
            <Image
              source={
                focused
                  ? require('./img/iconsMenu/helper.png')
                  : require('./img/iconsMenu/helper-b.png')
              }
              style={{
                width: 25,
                height: 20,
              }}
            />
          );
        }
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      showLabel: false,
    }}>
    <BottomTabs.Screen name="Home" component={MenusStackScreen} />
    <BottomTabs.Screen name="Settings" component={DetailsStackScreen} />
    <BottomTabs.Screen name="Instruction" component={InstructionScreen} />
    <BottomTabs.Screen name="Helper" component={HelperScreen} />
  </BottomTabs.Navigator>
);
const MainStack = createStackNavigator();
const App = () => {
  const loginReducer = useSelector(({loginReducer}) => loginReducer);
  const userReducer = useSelector(({userReducer}) => userReducer);
  const [userIndex, setUserIndex] = useStateIfMounted(loginReducer.index);
  useEffect(() => {
    if (userIndex == '-1') {
      changeLanguage('th');
    } else {
      changeLanguage(userReducer.userData[userIndex].language);
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <SafeAreaView style={{flex: 1}}>
            <MainStack.Navigator>
              <MainStack.Screen
                options={{headerShown: false}}
                name="LoginScreen"
                component={LoginStackScreen}
              />
              <MainStack.Screen
                options={{headerShown: false}}
                name="RegisterScreen"
                component={RegisterStackScreen}
              />
              <MainStack.Screen
                options={{headerShown: false}}
                name="InterestScreen"
                component={InterestScreen}
              />
              <MainStack.Screen
                options={{headerShown: false}}
                name="BottomTabs"
                component={tabs}
              />
            </MainStack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;

import React from 'react';
import {View, Text, Image} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import {FontSize} from '../components/FontSizeHelper';
import {Language} from '../translations/I18n';

const HelperScreen = () => {
  const dataArray = [
    {
      title:
        'โปรแกรม App Bplus Member สามารถติดตั้งบนระบบ Android และ IOS เวอร์ชั่นอะไรได้บ้าง',

      content:
        '   สามารถติดตั้งบน Android เวอร์ชั่น 6 ขึ้นไป และ IOS เวอร์ชั่น 10 ขึ้นไป',
    },
    {
      title: 'สามารถสมัครสมาชิกบน App Bplus Member ได้หรือไม่',
      content:
        '   ไม่สามารถสมัครบน App Bplus Member ได้ ต้องทำการสมัครสมาชิกและบันทึกข้อมูลที่บนโปรแกรม Businessplus ERP ก่อน เนื่องจากการติดตั้ง App Bplus Member  แล้วจะต้องทำการ Register โดยใช้ข้อมูลเลขบัตรประชาชน และเบอร์โทรที่ได้มีการสมัครแล้ว เพื่อเป็นการยืนยันตัวตนเข้าใช้งาน App Bplus Member',
    },
    {
      title:
        'ถ้าลืมรหัส Password สำหรับ Log in เข้า App Bplus Member ต้องทำอย่างไร',
      content:
        '   ขั้นตอนการลืมรหัส Password  สำหรับ Log in มีขั้นตอนดังนี้' +
        '\n' +
        '1. ทำการ Register โดยกำหนดรหัส Password ได้ใหม่ พร้อมกำหนดกลุ่มความสนใจ' +
        '\n' +
        '2. ยืนยันรหัส OTP ที่ได้รับ ' +
        '\n' +
        '3. Log in เข้าใช้งานตามรหัส Password ใหม่ได้ ',
    },
    {
      title: 'ถ้ามีการเปลี่ยนมือถือ ยังสามารถเข้า App Bplus Member ได้หรือไม่',
      content:
        '    สามารถเข้าใช้งานได้ ในกรณีที่มือถือใหม่เป็นเบอร์เดิม ในกรณีที่มีการเปลี่ยนเบอร์ต้องแจ้งทางผู้ประกอบการร้านค้าเพื่อเปลี่ยนแปลงข้อมูลในแฟ้มสมาชิก' +
        'ขั้นตอนการเข้าใช้งาน App Bplus Member กรณีมีการเปลี่ยนเครื่องมือถือ มีขั้นตอนดังนี' +
        '\n' +
        '1. ทำการดาวน์โหลดติดตั้ง App Bplus Member ใหม่ ' +
        '\n' +
        '2. ทำการ Register ใหม่ (จะเป็นรหัส Password เดิม หรือใหม่ก็ได้) พร้อมกำหนดกลุ่มความสนใจ' +
        '\n' +
        '3. ยืนยันรหัส OTP ที่ได้รับ ' +
        '\n' +
        '4. Log in เข้าใช้งานตามเบอร์โทร และรหัส Password ที่ได้ Register',
    },

    {
      title: 'มีการแก้ไขข้อมูลส่วนตัวของสมาชิก แล้วข้อมูลไม่ได้ปรับให้ทันที',
      content:
        'ข้อมูลจะปรับให้ภายใน 7 วันหลังจากมีการแก้ไขข้อมูล กรณีเกิน 7 วันแล้วข้อมูลไม่เปลี่ยน ให้ติดต่อทางบริษัทเจ้าของกิจการโดยตรงเพื่อให้เจ้าหน้าที่ตรวจสอบการปรับข้อมูล',
    },
    {
      title:
        'ยอดแต้มสะสม และประวัติการซื้อของวันปัจจุบันไม่มีการเปลี่ยนแปลงหลังจากการซื้อ',
      content:
        'ยอดแต้มสะสม และประวัติการซื้อจะมีผลการปรับยอดให้ในวันถัดไป กรณีวันถัดไปยอดยังไม่มีการปรับ ให้ติดต่อทางบริษัทเจ้าของกิจการโดยตรงเพื่อให้เจ้าหน้าที่ตรวจสอบการปรับข้อมูล',
    },
    {
      title: 'การแลกแต้มสามารถกดแลกที่บน App ได้หรือไม่',
      content:
        'ในส่วนของการแลกแต้ม (แลกฟรี, แลกซื้อ, แลกเป็นคูปองส่วนลด) สามารถแลกได้ที่จุดประชาสัมพันธ์ หรือจุดแลกของสมนาคุณของทางบริษัทเจ้าของกิจการโดยตรงเท่านั้น',
    },
    {
      title: 'การแจ้งเตือนไม่ขึ้นเตือน',
      content:
        'ให้ตรวจสอบข้อมูลส่วนตัวของสมาชิกได้กำหนด เพศ วันเกิด และข้อมูลความสนใจหรือไม่ การแจ้งเตือนจะขึ้นตามเงื่อนไข 3 อย่าง พร้อมช่วงวันที่จัดกิจกรรมต่าง ๆ',
    },
    {
      title: 'ต้องการตรวจสอบสาขาที่ใกล้สามารถตัวจสอบได้ที่ใด',
      content:
        'แนะนำกดปุ่มติดต่อเราที่หน้าจอหลักของ App Bplus Member จะแสดงข้อมูลสำนักงานใหญ่ และสาขาทั้งหมด พร้อมช่องทางการติดต่อต่าง ๆ ',
    },
    {
      title: 'แคมเปญที่แสดงบน App Bplus Member สามารถใช้สิทธิ์ได้ทันทีหรือไม่',
      content:
        'แคมเปญที่แสดงจะเป็นแคมเปญที่จัดรายการอยู่ในช่วงนั้น สามารถไปใช้สิทธิ์ได้',
    },
  ];

  const _renderHeader = (item, expanded) => {
    return (
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            padding: 15,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#E6EBFF',
            borderBottomColor: 'gray',
            borderBottomWidth: 0.7,
          }}>
          <Text style={{fontWeight: '600', flex: 1, marginEnd: 5}}>
            {item.title}
          </Text>
          {expanded ? (
            <FontAwesome style={{flex: 0.1, fontSize: FontSize.medium}} name="minus" />
          ) : (
            <FontAwesome style={{flex: 0.1, fontSize: FontSize.medium}} name="plus" />
          )}
        </View>
      </SafeAreaView>
    );
  };

  const _renderContent = (item) => {
    return (
      <Text
        style={{
          backgroundColor: 'white',
          padding: 15,
        }}>
        {item.content}
      </Text>
    );
  };

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
          <Title style={{color: 'black'}}> {Language.t('qa.header')}</Title>
        </Body>
        <Right />
      </Header>
      <Container>
        <Content>
          <Accordion
            dataArray={dataArray}
            expanded={true}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
          />
        </Content>
      </Container>
    </SafeAreaView>
  );
};

export default HelperScreen;

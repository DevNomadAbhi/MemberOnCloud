import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Language} from '../translations/I18n';
import {Alert} from 'react-native';
import * as Constants from '../src/Constants';

export const fetchTsMember = async (http, phoneNum, password, GUIDResult) => {
  let xresult = '';

  await fetch(http + '/MbUsers', {
    method: 'POST',
    body: JSON.stringify({
      'BPAPUS-BPAPSV': Constants.SERVICE_ID,
      'BPAPUS-LOGIN-GUID': GUIDResult,
      'BPAPUS-FUNCTION': 'LoginByMobile',
      'BPAPUS-PARAM':
        '{"MB_CNTRY_CODE": "66", "MB_REG_MOBILE": "' +
        phoneNum +
        '",    "MB_PW": "' +
        1234 +
        '"}',
    }),
  })
    .then((response) => response.json())
    .then(async (json) => {
      if (json && json.ResponseCode == '635') {
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'),
        );
        console.log('NOT FOUND MEMBER');
      } else if (json && json.ResponseCode == '629') {
        console.log('Function Parameter Required');
      } else if (json && json.ResponseCode == '200') {
        let responseData = JSON.parse(json.ResponseData);
        let MB_LOGIN_GUID = responseData.MB_LOGIN_GUID;
        await fetch(http + '/Member', {
          method: 'POST',
          body: JSON.stringify({
            'BPAPUS-BPAPSV': Constants.SERVICE_ID,
            'BPAPUS-LOGIN-GUID': GUIDResult,
            'BPAPUS-FUNCTION': 'ShowMemberInfo',
            'BPAPUS-PARAM': '{ "MB_LOGIN_GUID": "' + MB_LOGIN_GUID + '"}',
            'BPAPUS-FILTER': '',
            'BPAPUS-ORDERBY': '',
            'BPAPUS-OFFSET': '0',
            'BPAPUS-FETCH': '0',
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            let responseData2 = JSON.parse(json.ResponseData);
            console.log('responseData2 ### ' + 200);
            if (json && json.ResponseCode == '200') {
              xresult = responseData2.ShowMemberInfo[0];
            } else {
              console.log(json.ReasonString);
            }
          })
          .catch((error) => {
            console.log('ERROR FETCH ShowMemberInfo: ' + error);
          });
      } else {
        console.log(json.ReasonString);
      }
    })
    .catch((error) => console.log('ERROR FETCH LoginByMobile : ' + error));
  return xresult;
};

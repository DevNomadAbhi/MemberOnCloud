import 'moment/locale/th';
import moment from 'moment';
import {Language} from '../translations/I18n';

export const DateHelper = {
  getDate: (date) => {
    return moment(date).locale(Language.getLang()).add(543, 'years').format('ll');
  },
};

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Dimensions, Picker} from 'react-native';
import 'moment/locale/th';
import moment from 'moment';
import Colors from '../src/Colors';
import {FontSize} from '../components/FontSizeHelper';
import {View, Input, Icon, Text, Button, List, ListItem} from 'native-base';
import Modal from 'react-native-modal';
import {Language} from '../translations/I18n';
import DropdownList from './DropdownList';
const YEAR = 'Y';
const MONTH = 'M';
const DAY = 'D';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    
    let currentYear =
      Language.getLang() == 'th'
        ? moment().add(543, 'years').format('YYYY')
        : moment().format('YYYY');
    let currentMonth =
      Language.getLang() == 'th'
        ? this.props.date
          ? moment(this.props.date).add(543, 'years').get('month')
          : moment().add(543, 'years').get('month')
        : this.props.date
        ? moment(this.props.date).get('month')
        : moment().get('month');
    let currentDay = this.props.date
      ? moment(this.props.date).add(543, 'years').format('D')
      : moment().add(543, 'years').format('D');
    const defaultListYear = Array.from(new Array(100).keys()).map(
      (v, i) => currentYear * 1 - i,
    );
    const defaultListMonth = moment.months().map((v, i) => {
      return moment().locale(Language.getLang()).month(i).format('MMMM');
    });
    const defaultListDay = Array.from(
      new Array(
        moment().year(currentYear).month(currentMonth).daysInMonth(),
      ).keys(),
    ).map((v, i) => v + 1);

    this.state = {
      date: this.props.date
        ? this.props.date
        : moment()
            .locale(Language.getLang())
            .year(currentYear * 1 - 543)
            .month(currentMonth)
            .date(currentDay * 1)
            .toDate()
            .toUTCString(),
      selectedYear: currentYear,
      selectedMonth: currentMonth * 1,
      selectedDay: currentDay,
      listYear: defaultListYear,
      listMonth: defaultListMonth,
      listDay: defaultListDay,
      modalVisible: false,
    };
    console.log('this State => ', this.state);
  }

  onPickerSelectDay = (value) => {
    const {selectedYear, selectedMonth, selectedDay} = this.state;
    this.setState({
      selectedDay: value,
    });
  };
  onPickerSelectMonth = (value) => {
    const {selectedYear, selectedMonth, selectedDay} = this.state;
    const defaultListDay = Array.from(
      new Array(
        Language.getLang() == 'th'
          ? moment()
              .locale(Language.getLang())
              .year(selectedYear - 543)
              .month(value)
              .daysInMonth()
          : moment().locale(Language.getLang()).month(value).daysInMonth(),
      ).keys(),
    ).map((v, i) => v + 1);
    this.setState({
      selectedDay: 1,
      selectedMonth: value,
      listDay: defaultListDay,
    });
  };
  onPickerSelectYear = (value) => {
    const {selectedYear, selectedMonth, selectedDay} = this.state;
    const defaultListDay = Array.from(
      new Array(
        Language.getLang() == 'th'
          ? moment()
              .year(value - 543)
              .month(selectedMonth)
              .daysInMonth()
          : moment().month(selectedMonth).daysInMonth(),
      ).keys(),
    ).map((v, i) => v + 1);
    this.setState({
      selectedYear: value,
      listDay: defaultListDay,
    });
  };
  _onChange = () => {
    if (this.props.onChange) {
      const {selectedYear, selectedMonth, selectedDay} = this.state;
      this.setState(
        {
          date:
            Language.getLang() == 'th'
              ? moment()
                  .year(selectedYear - 543)
                  .month(selectedMonth)
                  .date(selectedDay)
                  .toDate()
                  .toUTCString()
              : moment()
                  .month(selectedMonth)
                  .date(selectedDay)
                  .toDate()
                  .toUTCString(),
        },
        () => this.props.onChange(this.state.date),
      );
    }
  };
  _onPress = (visible) => {
    let currentYear =
      Language.getLang() == 'th'
        ? moment().add(543, 'years').format('YYYY')
        : moment().format('YYYY');
    let currentMonth =
      Language.getLang() == 'th'
        ? this.props.date
          ? moment(this.props.date).add(543, 'years').get('month')
          : moment().add(543, 'years').format('M')
        : this.props.date
        ? moment(this.props.date).get('month')
        : moment().format('M');
    let currentDay =
      Language.getLang() == 'th'
        ? this.props.date
          ? moment(this.props.date).add(543, 'years').format('D')
          : moment().add(543, 'years').format('D')
        : this.props.date
        ? moment(this.props.date).format('D')
        : moment().format('D');

    const defaultListYear = Array.from(new Array(100).keys()).map(
      (v, i) => currentYear * 1 - i,
    );
    const defaultListMonth = moment
      .months()
      .map((v, i) =>
        moment().locale(Language.getLang()).month(i).format('MMMM'),
      );
    const defaultListDay = Array.from(
      new Array(
        moment().year(currentYear).month(currentMonth).daysInMonth(),
      ).keys(),
    ).map((v, i) => v + 1);
    this.setState(
      {
        date: this.props.date
          ? this.props.date
          : moment()
              .year(currentYear * 1 - 543)
              .month(currentMonth)
              .date(currentDay * 1)
              .toDate()
              .toUTCString(),
        selectedYear:
          Language.getLang() == 'th'
            ? moment(this.props.date).add(543, 'years').format('YYYY') * 1
            : moment(this.props.date).format('YYYY') * 1,
        selectedMonth: currentMonth * 1,
        selectedDay: currentDay * 1,
        listYear: defaultListYear,
        listMonth: defaultListMonth,
        listDay: defaultListDay,
        modalVisible: visible,
      },
      () => this.props.onChange(this.state.date),
    );
  };

  _onSubmit = (visible) => {
    this.setState(
      {
        modalVisible: visible,
      },
      () => this.props.onChange(this.state.date),
    );
  };

  render() {
    const {date} = this.props;
    const {modalVisible} = this.state;
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => this._onPress(true)}>
          <Text
            style={{
              fontSize: FontSize.medium,
              color: Colors.fontColor,
              marginRight: 5,
              paddingVertical: 10,
            }}>
            {Language.getLang() == 'th'
              ? moment(this.props.date).locale(Language.getLang()).add(543, 'years').format('D MMMM YYYY')
              : moment(this.props.date).locale(Language.getLang()).format('D MMMM YYYY')}
          </Text>
          <View
            style={{
              flex: 1,
              marginRight: 5,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Icon
              type="Ionicons"
              ios="ios-calendar"
              android="md-calendar"
              style={{
                fontSize: FontSize.large,
                color: Colors.fontColor,
              }}
            />
          </View>
        </TouchableOpacity>
        {modalVisible ? (
          <View
            style={{
              flex: 1,
            }}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                <Button
                  style={{backgroundColor: Colors.borderColor}}
                  full
                  onPress={() => {
                    let currentYear =
                      Language.getLang() == 'th'
                        ? moment().add(543, 'years').format('YYYY')
                        : moment().format('YYYY');
                    let currentMonth =
                      Language.getLang() == 'th'
                        ? this.props.date
                          ? moment(this.props.date)
                              .add(543, 'years')
                              .format('MMMM')
                          : moment().add(543, 'years').format('MMMM')
                        : this.props.date
                        ? moment(this.props.date).format('MMMM')
                        : moment().format('MMMM');
                    let currentDay = this.props.date
                      ? moment(this.props.date).add(543, 'years').format('D')
                      : moment().add(543, 'years').format('D');
                    const defaultListYear = Array.from(
                      new Array(100).keys(),
                    ).map((v, i) => currentYear * 1 - i);
                    const defaultListMonth = moment
                      .months()
                      .map((v, i) =>
                        moment()
                          .locale(Language.getLang())
                          .month(i)
                          .format('MMMM'),
                      );
                    const defaultListDay = Array.from(
                      new Array(
                        moment()
                          .year(currentYear)
                          .month(currentMonth)
                          .daysInMonth(),
                      ).keys(),
                    ).map((v, i) => v + 1);
                    this.setState(
                      {
                        date: this.props.date
                          ? this.props.date
                          : moment()
                              .year(currentYear * 1 - 543)
                              .month(currentMonth)
                              .date(currentDay * 1)
                              .toDate()
                              .toUTCString(),
                        selectedYear:
                          Language.getLang() == 'th'
                            ? this.props.date
                              ? moment(this.props.date)
                                  .add(543, 'years')
                                  .format('YYYY')
                              : currentYear
                            : this.props.date
                            ? moment(this.props.date).format('YYYY')
                            : currentYear,
                        selectedMonth: currentMonth,
                        selectedDay: currentDay,
                        listYear: defaultListYear,
                        listMonth: defaultListMonth,
                        listDay: defaultListDay,
                      },
                      () => this._onPress(false),
                    );
                  }}>
                  <Text>{Language.t('alert.cancel')}</Text>
                </Button>
              </View>
              <View style={{flex: 0.5}}>
                <Button
                  full
                  style={{
                    flex: 0.5,
                    backgroundColor: Colors.buttonColorPrimary,
                  }}
                  onPress={() => {
                    this._onChange();
                    this._onSubmit(false);
                  }}>
                  <Text>{Language.t('alert.ok')}</Text>
                </Button>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1 / 3}}>
                <DropdownList
                  title={Language.t('register.day')}
                  value={this.state.selectedDay}
                  data={this.state.listDay}
                  onSelect={this.onPickerSelectDay}
                />
                {/* <Picker
                  selectedValue={this.state.selectedDay}
                  onValueChange={value => this.onPickerSelect(DAY, value)}>
                  {this.state.listDay.map((value, i) => (
                    <Picker.Item label={value + ''} value={value} key={i} />
                  ))}
                </Picker> */}
              </View>
              <View style={{flex: 2 / 3}}>
                <DropdownList
                  title={Language.t('register.month')}
                  value={moment().locale(Language.getLang())
                    .month(this.state.selectedMonth)
                    .format('MMMM')}
                  data={this.state.listMonth}
                  onSelect={this.onPickerSelectMonth}
                />
                {/* <Picker
                  selectedValue={this.state.selectedMonth}
                  onValueChange={value => this.onPickerSelect(MONTH, value)}>
                  {this.state.listMonth.map((value, i) => {
                    return (
                      <Picker.Item
                        style={styles.picker}
                        label={moment()
                          .month(value)
                          .format('MMMM')}
                        value={moment()
                          .month(value)
                          .get('month')}
                        key={i}
                      />
                    );
                  })}
                </Picker> */}
              </View>
              <View style={{flex: 1 / 3}}>
                <DropdownList
                  title={Language.t('register.year')}
                  value={this.state.selectedYear}
                  data={this.state.listYear}
                  onSelect={this.onPickerSelectYear}
                />
                {/* <Picker
                  selectedValue={this.state.selectedYear}
                  onValueChange={value => this.onPickerSelect(YEAR, value)}>
                  {this.state.listYear.map((value, i) => (
                    <Picker.Item label={value + ''} value={value} key={i} />
                  ))}
                </Picker> */}
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    color: Colors.fontColor,
  },
  picker: {
    fontSize: FontSize.small,
    backgroundColor: Colors.lightPrimiryColor,
  },
});
export default DatePicker;

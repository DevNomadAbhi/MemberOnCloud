import React, {Component} from 'react';
import {
  View,
  Input,
  Text,
  Button,
  List,
  ListItem,
  Item,
  Content,
  Container,
  Header,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../src/Colors';
import {FontSize} from '../components/FontSizeHelper';

export class DropdownList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  onPress = () => {
    this.setState({modalVisible: true});
  };
  onSelect = (value) => {
    this.props.onSelect(value);
    this.setState({modalVisible: false});
  };
  toggleModal = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };
  render() {
    const {title, value, data, label} = this.props;
    return (
      <View style={[{flex: 1}, this.props.style]}>
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'center'}}
          onPress={data && this.onPress}>
          <Input
            style={{fontSize: FontSize.medium}}
            onChange={(value) => {
              console.log('test =>', value);
            }}
            value={`${value}`}
            disabled
          />
          <Icon
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginRight: 5,
            }}
            name="caret-down-outline"
            size={25}
            color="black"
          />
        </TouchableOpacity>
        <Modal visible={this.state.modalVisible}>
          <Container>
            <Header style={{backgroundColor: Colors.backgroundColor}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Text>{title}</Text>
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={this.toggleModal}>
                <Icon
                  name="close-circle-outline"
                  style={{
                    fontSize: FontSize.xlarge,
                    color: 'black',
                  }}
                  size={25}
                  color="black"
                />
              </TouchableOpacity>
            </Header>

            <Content>
              <View style={{flex: 0.5, backgroundColor: 'white'}}>
                <List>
                  {data &&
                    data.map((value, i) => {
                      let vLabel = value;
                      if (label) {
                        if (typeof value === 'object') {
                          vLabel = value[label];
                        }
                      }
                      return (
                        <ListItem
                          onPress={() =>
                            this.props.onSelect && this.onSelect(value)
                          }
                          key={i}>
                          <Text>{vLabel}</Text>
                        </ListItem>
                      );
                    })}
                </List>
              </View>
            </Content>
          </Container>
        </Modal>
      </View>
    );
  }
}

export default DropdownList;

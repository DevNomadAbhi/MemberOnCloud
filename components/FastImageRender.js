import React, {Component} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

const defaultImage = require('../img/defaultimage.jpg');
export default class FastImageRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  onLoadEnd() {
    this.setState({loaded: true});
  }

  render() {
    return (
      <View style={this.props.style}>
        {!this.state.loaded && (
          <FastImage
            source={defaultImage}
            style={this.props.style}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
        <FastImage
          source={this.props.source}
          style={[
            this.props.style,
            this.state.loaded ? {} : {width: 0, height: 0},
          ]}
          onLoadEnd={this.onLoadEnd.bind(this)}
        />
      </View>
    );
  }
}

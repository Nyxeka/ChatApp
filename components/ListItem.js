import React, {Component} from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { styles } from '../styles';

export default class ListItem extends Component {

    /*_onPress = () => {
        this.props.onPressItem(this.props.id);
    };*/

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.li}>
          <Text style={styles.liText}>{this.props.item.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

module.exports = ListItem;
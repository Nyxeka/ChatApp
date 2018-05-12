import React, { Component } from 'react';
//import { ListView, View, Platform, Text, TextInput, KeyboardAvoidingView,ScrollView} from 'react-native';
import { Button, View, Text } from 'react-native';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
import { createStackNavigator , } from 'react-navigation';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  databaseURL: "https://codingchallengetest.firebaseio.com/",
  storageBucket: "<your-storage-bucket>",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const RootStack = createStackNavigator({
  Chat: ChatScreen,
  Contacts: ContactsListScreen,
})

const styles = require('./styles.js');

class ChatScreen extends Component{
  static navigationOptions = {
    title: 'Chat Screen',
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Chat Screen</Text>
      </View>
    );
  }
}

class ContactsListScreen extends Component{
  static navigationOptions = {
    title: 'Contacts List',
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>List of Contacts</Text>
      </View>
    );
  }
}

//Main component with main render loop
export default class App extends Component {
  render() {
    return (
      <RootStack/>
    );
  }
}

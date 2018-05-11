import React, { Component } from 'react';
import { ListView, View, Platform, Text, TextInput, KeyboardAvoidingView,ScrollView} from 'react-native';
import ReactNative from 'react-native';
import * as firebase from 'firebase';

const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');

const styles = require('./styles.js')

// Initialize Firebase
const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  databaseURL: "https://codingchallengetest.firebaseio.com/",
  storageBucket: "<your-storage-bucket>",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);



export default class App extends Component {

  constructor(props) {
    super(props);
    
    console.ignoredYellowBox = ['Setting a timer']; // keep getting this error on android, apparently it's not that important.
    //console.log("testing");
    this.state = {
      dataSource: new ListView.DataSource( { rowHasChanged: (row1, row2) => row1 !== row2, } ),
      chatTextToSend: ""
    };

    //set up a way for us to access the database.
    this.itemsRef = firebaseApp.database().ref();
  }

  componentDidMount() {
    /*setInterval( () => {
      this.setState({
        curTime : new Date().toLocaleString()
      })
    },1000)*/
    this.listenForItems(this.itemsRef);
    //this.setState({ dataSource: this.state.dataSource.cloneWithRows([{ title: "Pizza" }]) })
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      
      // get children as an array  
      var items = [];
      snap.forEach((child) => {
        // we're iterating through each entry at the given database url, and we're adding it to the array of items 
        items.push({ title: child.val(), _key: child.key });
        //console.log(child.val());
      });
      
      // now we're going to add the items to the dataSource ListView.
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  _addItem() {
    //console.log('Sent a Message.');

    this.itemsRef.push("[" + Date().toLocaleString() + "]: " + this.state.chatTextToSend);

    this.state.chatTextToSend = "";
  }

  _renderItem(item){
    return (
      <ListItem item={item} onpress={() => {}}/>
    );
  }


  render() {
    return (
      
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar title="Chat With: "/>
        <ScrollView ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight)=>{this.scrollView.scrollToEnd({animated: true});}}>
          
          <ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview}/>
        </ScrollView>
        <TextInput 
          style={
            {
              height: 40,
              borderColor: 'gray', 
              borderWidth: 1,
              paddingLeft: 16,
            }
          }
          placeholder="send a message"
          onChangeText={(chatTextToSend) => this.setState({chatTextToSend})}
          value={this.state.chatTextToSend}
        />

        <ActionButton title="Add" onPress={this._addItem.bind(this)}>
        </ActionButton>

      </KeyboardAvoidingView>
    );
  }
}

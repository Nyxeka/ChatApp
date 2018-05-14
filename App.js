import React, { Component } from 'react';
//import { ListView, View, Platform, Text, TextInput, KeyboardAvoidingView,ScrollView} from 'react-native';
import { ListView, Button, View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator, ScrollView, Platform } from 'react-native';
import ReactNative from 'react-native';
import firebase from 'firebase';
import { createStackNavigator, } from 'react-navigation';
import { TitledInput } from './components/TitledInput';
import { styles } from './styles';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvzHB6b-V8TA5hmiUSlZZVPt9HpfA-mEk",
  authDomain: "codingchallengetest.firebaseapp.com",
  databaseURL: "https://codingchallengetest.firebaseio.com/",
  projectId: "codingchallengetest",
  storageBucket: "codingchallengetest.appspot.com",
  messagingSenderId: "218896155221",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

//const styles = require('./styles.js');


class LoggedOutScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = { email: '', password: '', error: '', loading: false };

  constructor(props) {
    super(props);
    //this.state = { }

  }

  componentWillMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }


  onLoginPress() {
    this.setState({ error: '', loading: true });

    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ error: '', loading: false });
        this.props.navigation.navigate('Contacts');
      })
      .catch(() => {
        this.setState({ error: 'Authentication failed.', loading: false });
      });
  }

  OnCreateAccount() {
    const { email, password } = this.state;
    var x = false;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ error: '', loading: false }); // turn off the loading spinner
        x = true;
        this.props.navigation.navigate('Contacts');
      })
      .catch(() => {
        this.setState({ error: 'Authentication failed.', loading: false });
      });

    if (firebase.auth().currentUser) { // check if current user is logged in
      userId = firebase.auth().currentUser.uid; // grab the new user uid
      if (userId) { // check if userId is null
        firebase.database().ref('users/' + userId).set({
          email: email,
        }); // add new user to the database.
      }
    }

  }

  LoginAsTester() {
    firebase.auth().signInWithEmailAndPassword('test99@test.com', 'password')
      .then(() => {
        this.setState({ error: '', loading: false });
        this.props.navigation.navigate('Contacts');
      })
      .catch(() => {
        this.setState({ error: 'Trying to login as tester failed..', loading: false });
      });
  }



  renderButtonOrLoading() {
    if (this.state.loading) {
      return (
        <View>
          <Text>Loading...</Text>
          <ActivityIndicator size="large" />
        </View>);
    }
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.horizontallyAlignedButtonsContainer}>
          <View style={styles.horizontalButtonResizer}>
            <Button
              onPress={this.OnCreateAccount.bind(this)}
              title="Sign Up"
              style={styles.horizontallyAlignedButtons} />
          </View>
          <View style={styles.horizontalButtonResizer}>
            <Button
              onPress={this.onLoginPress.bind(this)}
              title="Log in"
              style={styles.horizontallyAlignedButtons} />
          </View>
        </View>
        <View style={styles.buttonResizer}>
          <Button
            onPress={this.LoginAsTester.bind(this)}
            title="Log in as Tester"
            style={styles.buttonStyle} />
        </View>
      </View>
    );
  }

  renderLoginScreen() {
    return (
      <View style={styles.loginBoxContainer}>{/* We want to align the text inputs in the middle of the screen */}
        <View style={styles.topSpace}>
          <Text style={styles.loginTitleText}>Login</Text>
        </View>
        <View style={styles.smallSpace} />

        <View style={styles.inputFieldsContainer}>{/*this is the grey box*/}

          <View style={styles.textBoxesContainer}>
            <TitledInput
              placeholder='you@domain.com'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            <TitledInput
              autoCorrect={false}
              placeholder='password'
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
          </View>
          <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          {this.renderButtonOrLoading()}
        </View>

        <View style={styles.bottomSpace} />
      </View>
    );
  }


  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}>

        {this.renderLoginScreen()}

      </KeyboardAvoidingView >
    );
  }

}

class HomeScreen extends Component {
  static navigationOptions = {
    title: '.nyxeka_chat-v0.01a',
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Chat Screen</Text>
        <Button
          title="Go to Contacts"
          onPress={() => this.props.navigation.navigate('Contacts')}
        />
      </View>
    );
  }
}

class ChatScreen extends Component {
  static navigationOptions = {
    title: 'Chat With: ',
  };
  constructor(props) {
    super(props);

    console.ignoredYellowBox = ['Setting a timer']; // keep getting this error on android, apparently it's not that important.
    //console.log("testing");
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2, }),
      chatTextToSend: ""
    };
    this.userId = firebase.auth().currentUser.uid;

    this.chatId = this.props.navigation.getParam('chatId', 'default');

    //set up a way for us to access the database.
    this.chatLogRef = firebaseApp.database().ref('chats/' + this.chatId + "/chatlog");
    console.log('Set chatlog url to: ' + 'chats/' + this.props.navigation.getParam('chatId', 'default') + "/chatlog");
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snapshot) => {

      // get children as an array  
      var items = [];
      snapshot.forEach((child) => {
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
  componentDidMount() {
    //console.log('starting component did mount stuff');
    this.listenForItems(this.chatLogRef);
  }

  _renderItem(item) {
    return (
      <ListItem item={item} onpress={() => { }} />
    );
  }

  _addItem() {
    this.chatLogRef.push("[" + Date().toLocaleString() + "]: " + this.state.chatTextToSend);
    this.state.chatTextToSend = "";

  }

  //props.navigation.state.params.chatId is the chat ID.

  render() {
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
          <ScrollView ref={ref => this.scrollView = ref} style={{flex:1}} onContentSizeChange={(contentWidth, contentHeight) => { this.scrollView.scrollToEnd({ animated: true }); }}>

            <ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview} />
          </ScrollView>
          <View style={{
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
            <TextInput
              style={
                {
                  height: 60,
                  borderColor: 'gray',
                  borderWidth: 1,
                  flex: 8,
                  padding: 10,
                  color: '#262626',
                  fontSize: 18,
                  fontWeight: '200',
                }
              }
              underlineColorAndroid={'transparent'}
              placeholder="send a message"
              onChangeText={(chatTextToSend) => this.setState({ chatTextToSend })}
              value={this.state.chatTextToSend}
            />
            <ActionButton title="Send" onPress={this._addItem.bind(this)} />
          </View>
        </KeyboardAvoidingView>
    );
  }
}

const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');

class ContactsListScreen extends Component {
  static navigationOptions = {
    title: 'Contacts List',
    headerLeft: null
  };

  constructor(props) {
    super(props);

    console.ignoredYellowBox = ['Setting a timer']; // keep getting this error on android, apparently it's not that important.
    //console.log("testing");
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2, }),
      chatTextToSend: "",
      targetChatID: ''
    };
    this.userId = firebase.auth().currentUser.uid;
    //set up a way for us to access the database.

    this.contactsRef = firebaseApp.database().ref('users/' + this.userId + '/private/contacts');

    console.log('setting contacts ref url to: users/' + this.userId + '/private/contacts');

  }

  componentDidMount() {
    this.listenForItems(this.contactsRef);
  }

  listenForItems(contactsRef) {
    contactsRef.on('value', (snapshot) => {

      // get children as an array  
      var items = [];
      snapshot.forEach((child) => {
        // we're iterating through each entry at the given database url, and we're adding it to the array of items 
        items.push({ title: child.child('/name').val(), uid: child.key });
        //console.log('contact found:' + child.child('/name').val());
      });

      // now we're going to add the items to the dataSource ListView.
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  _renderItem(item) {

    return (
      <ListItem item={item} onPress={
        () => {
          this.contactsRef.child(item.uid + "/ChatID").once('value', (snapshot) => {
            console.log('Pressed a contacts button for: ' + snapshot.val());
            //this.props.navigation.navigate('Chat', { chatId: snapshot.val() });
            this.props.navigation.setParams({ chatId: snapshot.val() });
            console.log('targetChatID is: ' + snapshot.val());
            this.props.navigation.navigate('Chat', { chatId: snapshot.val() });
          });
          /*
          this.props.navigation.setParams({chatId: this.state.targetChatID});
          console.log('targetChatID is: ' + this.state.targetChatID);
          this.props.navigation.navigate('Chat', {chatId: this.state.targetChatID});
          */

        }
      } />
    );
  }

  renderContacts() {
    /*return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text>Does this show up?</Text>
        <ScrollView ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight) => { this.scrollView.scrollToEnd({ animated: true }); }}
          style={{ borderWidth: 1, borderColor: '#3F3F3F' }}>

          <ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview} />
        </ScrollView>
      </KeyboardAvoidingView>
    );*/
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview} />
      </KeyboardAvoidingView>
    );
  }

  render() {
    return (
      this.renderContacts()
    );
  }
}

const RootStack = createStackNavigator({
  Chat: ChatScreen,
  Contacts: ContactsListScreen,
  Home: HomeScreen,
  Login: LoggedOutScreen,
},
  {
    initialRouteName: 'Login',
  })

//Main component with main render loop
export default class App extends Component {
  render() {
    return (
      <RootStack />
    );
  }
}

import React, { Component } from 'react';
//import { ListView, View, Platform, Text, TextInput, KeyboardAvoidingView,ScrollView} from 'react-native';
import { ListView, Button, View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator, ScrollView, Platform, ToastAndroid } from 'react-native';
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
    firebase.auth().signOut();
    console.log('At log-in screen, signed out any users.');
  }

  componentWillMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false
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
        this.props.navigation.navigate('Contacts', { 'email': email, title: email + '\'s Contact List:' });
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
        this.props.navigation.navigate('Contacts', { 'email': email, title: email + '\'s Contact List:' });
        if (firebase.auth().currentUser) { // check if current user is logged in
          userId = firebase.auth().currentUser.uid; // grab the new user uid
          if (userId) { // check if userId is null
            var newUserLayout = {
              [userId]: {
                'email': email
              }
            }
            firebase.database().ref('users/').update(newUserLayout); // add new user to the database.
            firebase.database().ref('uidrefs').update({ [email.replace(/[^a-zA-Z\_0-9]/g, '-')]: userId });
          }
        }
      })
      .catch(() => {
        this.setState({ error: 'Authentication failed.', loading: false });
      });



  }

  LoginAsTester() {
    firebase.auth().signInWithEmailAndPassword('test99@test.com', 'password')
      .then(() => {
        this.setState({ error: '', loading: false });
        this.props.navigation.navigate('Contacts', { 'email': 'test99@test.com' });
      })
      .catch(() => {
        this.setState({ error: 'Trying to login as tester 1 failed..', loading: false });
      });
  }

  LoginAsTester2() {
    firebase.auth().signInWithEmailAndPassword('njhylands@gmail.com', 'password')
      .then(() => {
        this.setState({ error: '', loading: false });
        this.props.navigation.navigate('Contacts', { 'email': 'njhylands@gmail.com', title: 'njhylands@gmail.com\'s Contact List:' });
      })
      .catch(() => {
        this.setState({ error: 'Trying to login as tester 2 failed..', loading: false });
      });
  }



  renderButtonOrLoading() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1 }}>
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
            title="Log in as Tester 1"
            style={styles.buttonStyle} />
        </View>
        <View style={styles.buttonResizer}>
          <Button
            onPress={this.LoginAsTester2.bind(this)}
            title="Log in as Tester 2"
            style={styles.buttonStyle} />
        </View>
      </View>
    );
  }

  logout() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      if (Platform.OS == 'android')
        ToastAndroid.showWithGravity('signed out', ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  }

  renderLoginScreen() {
    if (firebase.auth().currentUser) {
      return (<View style={styles.loginBoxContainer}>{/* We want to align the text inputs in the middle of the screen */}
        <View style={styles.topSpace}>
          <Text style={styles.loginTitleText}>Login</Text>
        </View>
        <View style={styles.smallSpace} />

        <View style={styles.inputFieldsContainer}>{/*this is the grey box*/}
          <View style={styles.topSpace} />
          <View style={{ flex: 1.5 }}>
            <View style={styles.horizontalButtonResizer}>
              <Button
                onPress={this.logout.bind(this)}
                title="Sign Out"
                style={styles.horizontallyAlignedButtons} />
            </View>
          </View>
          <View style={styles.topSpace} />
        </View>
        <View style={styles.bottomSpace} />
      </View>
      );
    } else {
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
            <View style={styles.smallSpace} />
          </View>

          <View style={styles.bottomSpace} />
        </View>
      );
    }
  }


  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }} keyboardVerticalOffset={80}>

        {this.renderLoginScreen()}

      </KeyboardAvoidingView >
    );
  }

}

class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.title) === 'undefined' ? 'chat window' : navigation.state.params.title,
  });
  constructor(props) {
    super(props);

    console.ignoredYellowBox = ['Setting a timer']; // keep getting this error on android, apparently it's not that important.
    //console.log("testing");
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2, }),
      chatTextToSend: ""
    };
    this.userId = firebase.auth().currentUser.uid;

    this.chatId = this.props.navigation.getParam('chatId', 'default'); // set the chat ChatID so we can get to it.

    this.userEmail = this.props.navigation.getParam('email', 'name');

    this.contactName = this.props.navigation.getParam('contactName', '<contact name>');

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
      if (items.length > 0) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        });
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows([{ title: 'No messages found on server.', _key: '' }])
        });
      }

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
    this.chatLogRef.push("[" + Date().toLocaleString().substring(16, 24) + '] ' + this.userEmail + ': ' + this.state.chatTextToSend);
    this.state.chatTextToSend = "";
  }

  //props.navigation.state.params.chatId is the chat ID.

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
        <ScrollView ref={ref => this.scrollView = ref} style={{ flex: 1 }} onContentSizeChange={(contentWidth, contentHeight) => { this.scrollView.scrollToEnd({ animated: true }); }}>

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
  static navigationOptions = ({ navigation }) => ({
    title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.title) === 'undefined' ? 'Contacts List' : navigation.state.params.title,
  });

  constructor(props) {
    super(props);

    console.ignoredYellowBox = ['Setting a timer']; // keep getting this error on android, apparently it's not that important.
    //console.log("testing");
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2, }),
      dataSource2: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2, }),
      chatTextToSend: "",
      targetChatID: '',
      buttonState: 'default',
      contactRequestUID: ''
    };
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = this.props.navigation.getParam('email', 'userEmail');

    //set up a way for us to access the database.

    this.contactsRef = firebaseApp.database().ref('users/' + this.userId + '/private/contacts');
    this.contactRequestsRef = firebaseApp.database().ref('users/' + this.userId + '/public/ContactRequests');
    console.log('setting contacts ref url to: users/' + this.userId + '/private/contacts');

    this.deletionQueue = [];

  }

  componentDidMount() {
    this.listenForItems(this.contactsRef, this.contactRequestsRef);
  }

  listenForItems(contactsRef, contactRequestsRef) {
    contactsRef.on('value', (snapshot) => {

      // get children as an array  
      var items = [];
      snapshot.forEach((child) => {
        // we're iterating through each entry at the given database url, and we're adding it to the array of items 
        items.push({ title: child.child('/name').val(), uid: child.key });
        //console.log('contact found:' + child.child('/name').val());
      });

      // now we're going to add the items to the dataSource ListView.
      if (items.length > 0) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        });
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows([{ title: 'No Contacts Found', uid: '' }])
        });
      }

    });
    // now check for new contact requests
    var contactRequests = [];
    contactRequestsRef.on('value', (snapshot) => {

      // get children as an array  
      var contactRequests = [];
      snapshot.forEach((child) => {
        // we're iterating through each entry at the given database url, and we're adding it to the array of items 
        contactRequests.push({ title: child.val(), uid: child.key });
        //console.log('contact found:' + child.child('/name').val());
      });

      // now we're going to add the items to the dataSource ListView.
      if (contactRequests.length > 0) {
        this.setState({
          dataSource2: this.state.dataSource2.cloneWithRows(contactRequests)
        });
      } else {
        this.setState({
          dataSource2: this.state.dataSource2.cloneWithRows([{ title: 'No New Requests', uid: '' }])
        });
      }

    });
  }

  openChat(chatInfo) {
    console.log('attempting to open chat at: ' + chatInfo.chatId);

    if (chatInfo.chatId == 'uninitiated' && chatInfo.chatExists == '') {

      console.log('uninitiated chat, going to attempt to start a new one.');
      var newChatLayout = { // layout the 'new chat' structure
        'users': { //navigate to users
          [this.userId]: this.userEmail, // throw in our UID and email
          [chatInfo.contactUID]: '', // add other uid.
        }
      };

      // now add new chat to the database
      var newChatIdRef = firebaseApp.database().ref('chats').push(newChatLayout, (error) => {
        if (error) {
          console.log('ERROR: unable to create chat with user - invalid permissions.')
        } else {
          this.addChatId(chatInfo.contactUID, newChatIdRef.key)// add the Chat-id for future reference
          console.log('created new chat ID at: ' + newChatIdRef.key);
          this.props.navigation.navigate('Chat', { chatId: newChatIdRef.key, title: 'Chat with: ' + chatInfo.contactName, 'email': this.props.navigation.getParam('email', 'userEmail') });
        }
      });

      //let the user know we opened up a new chat.
      firebaseApp.database().ref('users/' + chatInfo.contactUID + '/restricted/newChats/').update({ [newChatIdRef.key]: this.userId });

    } else if (chatInfo.chatExists != '') { // there is a new chat for us to use with this contact already

      console.log('chat already exists at: ' + chatInfo.chatExists);
      firebaseApp.database().ref('users/' + this.userId + '/restricted/newChats/' + chatInfo.chatExists).set({},
        (error) => {
          if (error) {
            console.log("new chat reference not removed." + error);
          } else {
            console.log("new chat reference removed successfully.");
          }
        }); // remove the notification from the "inbox", in this case the database location that's restricted to the other contact.
      this.addChatId(chatInfo.contactUID, chatInfo.chatExists); // update our contact with the chat id for future reference.
      this.props.navigation.navigate('Chat', { 'chatId': chatInfo['chatExists'], title: 'Chat with: ' + chatInfo.contactName, 'email': this.userEmail });// open a new chat window with the contact
    }
    else {
      this.props.navigation.navigate('Chat', { 'chatId': chatInfo['chatId'], title: 'Chat with: ' + chatInfo.contactName, 'email': this.userEmail }); // everything's set, open a new chat window with the contact.
    }

  }

  addChatId(contactUID, newChatID) {
    this.contactsRef.child(contactUID).update({ 'ChatID': newChatID }); // add the Chat-id for future reference
  }

  addContact(contactInfo) {
    var contactLayout = { // start by creating the layout for the new contact.
      [contactInfo.contactUID]: {
        ChatID: 'uninitiated',
        name: contactInfo.contactName
      }
    }

    this.contactsRef.update(contactLayout); // update server with new contact.
    this.removeContactRequest(contactInfo.contactUID);
  }

  removeContactRequest(contactID) {
    firebaseApp.database().ref('users/' + this.userId + '/public/ContactRequests/' + contactID).set({},
      (error) => {
        if (error) {
          console.log("Could not remove contact request." + error);
        } else {
          console.log("Contact request removed from database.");
        }
      }); // remove the contact request.
  }

  findContactUIDByEmail(email) {
    //convert email to key
    var emailKey = this.stringToDatabaseKey(email);
    this.setState({ contactRequestUID: 'waiting' });
    //console.log('searching for: ' + 'uidrefs/' + emailKey + '/');

    firebaseApp.database().ref('uidrefs/' + emailKey + '/').once('value', (snapshot) => {
      this.sendContactRequest(snapshot.val(), email);
      this.setState({ contactRequestUID: '' });
    });
  }

  stringToDatabaseKey(myString) { //firebase does not seem to support having '.' or '@', so we convert them to '-'
    return (myString.replace(/[^a-zA-Z\_0-9]/g, '-'));
  }


  /**
   * @description
* @param {List} contactInfo formatted as {type: <string: 'email','uid'>, searchQuery: <string: uid or email>}
    */
  trySendContactRequest(contactInfo) {
    this.findContactUIDByEmail(contactInfo.searchQuery);
  }

  /**
   * @summary asks the database if a contact exists, then puts the contact request in their contactRequests public node.
* @param {string}} contactUID
* @returns {bool}
  */
  sendContactRequest(contactUID, email) {
    if (!(contactUID == null)) {
      if (!(contactUID == '')) {
        firebaseApp.database().ref('users/' + contactUID + '/email').once('value').then((snapshot) => {
          console.log('Attempting to add contact:' + contactUID);
          if (snapshot.val() != null) {
            var contactRequestLayout = { [this.userId]: this.userEmail };

            firebaseApp.database().ref('users/' + contactUID + '/public/ContactRequests').update(contactRequestLayout);
            this.addContact({ contactUID: contactUID, contactName: email })
            if (Platform.OS == 'android')
              ToastAndroid.showWithGravity('Request sent successfully!', ToastAndroid.SHORT, ToastAndroid.CENTER);
          } else {
            if (Platform.OS == 'android')
              ToastAndroid.showWithGravity('Could not find user.', ToastAndroid.SHORT, ToastAndroid.CENTER);
          }
        });
      }
    }
  }

  _renderContact(item) {
    if (item.uid === '') {
      return (
        <View>
          <ListItem item={item} onPress={() => { }} />
        </View>
      );
    }
    if (this.state.buttonState == 'delete') {
      return (
        <ListItem item={item} onPress={
          () => {
            addToDeletionQueue(item.uid);
            item.title = item.title + '(delete)';
          }} />);
    } else {
      return (
        <View>
          <ListItem item={item} onPress={
            () => {
              this.contactsRef.child(item.uid).once('value', (snapshot) => {
                console.log('Pressed a contacts button for: ' + snapshot.child('ChatID').val());
                //this.props.navigation.navigate('Chat', { chatId: snapshot.val() });

                firebaseApp.database().ref('users/' + firebase.auth().currentUser.uid + '/restricted/newChats').on('value', (snap) => {
                  var doesChatExist = '';
                  snap.forEach((child) => {
                    if (child.val() == item.uid) {
                      doesChatExist = child.key;
                      console.log('chatExists: ' + doesChatExist);
                    }
                  })
                  this.openChat({
                    chatId: snapshot.child('ChatID').val(),
                    contactUID: item.uid,
                    contactName: snapshot.child('name').val(),
                    chatExists: doesChatExist
                  });
                });
              });
            }
          } />
        </View>
      );
    }
  }



  _renderRequest(item) { // for drawing from the list of contact requests.
    if (item.uid === '') {
      return (
        <View>
          <ListItem item={item} onPress={() => { }} />
        </View>
      );
    }
    return (
      <View>
        <ListItem item={item} onPress={
          () => {
            this.addContact({
              contactUID: item.uid,
              contactName: item.title
            });
          }
        } />
      </View>
    );
  }

  addToDeletionQueue(uid) {
    this.deletionQueue.push(uid);
  }

  deleteAllInDeletionQueue() {
    this.deletionQueue.forEach((i) => {
      deleteContact(i);
    })
  }

  deleteContact(uid) {
    this.contactsRef.child(uid).set({},
      (error) => {
        if (error) {
          console.log("Could not remove contact request." + error);
        } else {
          console.log("Contact request removed from database.");
        }
      }); // remove the contact request.
  }

  clearDeletionQueue() {
    this.deletionQueue = [];
  }

  renderButtonsOrAddNewContactBox() {
    if (this.state.buttonState == 'delete') {
      return (
        <View style={styles.contactButtonsContainer}>
          <View style={styles.horizontalButtonResizer}>
            <Button
              onPress={() => {
                this.clearDeletionQueue.bind(this);
                this.setState({ buttonState: 'default' });
              }}
              title="Cancel"
              style={styles.horizontallyAlignedButtons} />
          </View>
          <View style={styles.horizontalButtonResizer}>
            <Button
              onPress={this.deleteAllInDeletionQueue.bind(this)}
              title="Confirm"
              style={styles.horizontallyAlignedButtons} />
          </View>
        </View>);
    } else if (this.state.buttonState == 'addNew') {
      if (this.state.contactRequestUID === 'waiting') {
        return (<View style={{
          justifyContent: 'flex-start',
          flexDirection: 'column',
          alignItems: 'center',
          width: '90%',
          alignSelf: 'center',
          flex: 1,
          backgroundColor: '#BABABA',
          padding: 10,
          marginBottom: 20,
          minHeight: 90
        }}>
          <Text>Searching for contact... </Text>
          <ActivityIndicator size="large" color="#808080" />
        </View>);
      } else {
        return (
          <View style={{
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90%',
            alignSelf: 'center',
            flex: 1,
            backgroundColor: '#BABABA',
            padding: 10,
            marginBottom: 20,
            minHeight: 90
          }}>
            <View >
              <View style={styles.smallSpace} />
              <View style={styles.buttonResizer}>
                <TitledInput
                  autoCorrect={false}
                  placeholder='contact email...'
                  value={this.state.contactRequestText}
                  onChangeText={contactRequestText => this.setState({ contactRequestText })}
                />
              </View>
              <View style={styles.contactButtonsContainer}>
                <View style={styles.horizontalButtonResizer}>
                  <Button
                    onPress={() => {
                      this.trySendContactRequest({
                        type: 'email',
                        searchQuery: this.state.contactRequestText
                      });
                      this.setState({ contactRequestText: '' });
                      this.setState({ buttonState: 'default' });
                    }}
                    title="Send Request"
                    style={styles.horizontallyAlignedButtons} />
                </View>
                <View style={styles.horizontalButtonResizer}>
                  <Button
                    onPress={() => {
                      this.setState({ contactRequestText: '' });
                      this.setState({ buttonState: 'default' });
                    }}
                    title="Cancel"
                    style={styles.horizontallyAlignedButtons} />
                </View>
              </View>
            </View>
          </View>
        );
      }
    } else if (this.state.buttonState == 'default') {
      return (
        <View style={styles.contactButtonsContainer}>
          <View style={styles.horizontalButtonResizer}>
            <Button
              onPress={() => { this.setState({ buttonState: 'addNew' }); }}
              title="Add New"
              style={styles.horizontallyAlignedButtons} />
          </View>
          <View style={styles.horizontalButtonResizer}>
            <Button
              onPress={() => { this.setState({ buttonState: 'delete' }); }}
              title="Delete Mode"
              style={styles.horizontallyAlignedButtons} />
          </View>
        </View>);
    }
  }



  renderContacts() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
        <Text>Contacts:</Text>
        <ListView dataSource={this.state.dataSource} renderRow={this._renderContact.bind(this)} style={styles.contactsListView} />
        <Text>Requests:</Text>
        <ListView dataSource={this.state.dataSource2} renderRow={this._renderRequest.bind(this)} style={styles.contactsRequestView} />
        {this.renderButtonsOrAddNewContactBox()}
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

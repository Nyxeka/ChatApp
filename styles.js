import { Platform } from 'react-native';
import Expo from 'expo';

const React = require('react-native')
const { StyleSheet } = React
const constants = {
  actionColor: '#24CE84'
};

const styles = {
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listview: {
    flex: 1,
    //borderWidth: 1,
    //borderColor: '#FF0000', // debug colour for border

  },
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    //borderColor: '#00FF00', // debug colour for border
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
    flexDirection: 'row'
  },
  navbarTitle: {
    color: '#444',
    fontSize: 16,
    fontWeight: "500"
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  },
  center: {
    textAlign: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  action: {
    backgroundColor: constants.actionColor,
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent:'center',
    alignItems:'center',
    flex:2,
  },
  errorTextStyle: {
    color: '#E64A19',
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },

  textBoxesContainer: {
    //borderColor: '#FF0000', // red border for debug
    //borderWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    width: '80%',
    flex: 3
  },
  // holds all the buttons
  buttonContainer: {
    //borderColor: '#FF0000',
    //borderWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    flex: 2
  },
  // child object of buttonContainer
  horizontallyAlignedButtonsContainer: {
    //borderColor: '#00FF00', // green border for debug
    //borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: "space-evenly",
    width: '100%',
    flex: 1,
  },
  // individual button style stuff
  buttonStyle: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
  // views that hold individual full-wide buttons
  buttonResizer: {
    alignSelf: 'stretch',
    flex: 1,
    //height:60,
    marginLeft: 5,
    marginRight: 5,
  },
  // views that hold individual horizontally spaced buttons
  horizontalButtonResizer: {
    width: '45%',
    alignSelf: 'center',
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    //height:60,
  },
  // individual buttons that are horizontally aligned
  horizontallyAlignedButtons: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  // holds the text boxes and buttons. has grey bg
  inputFieldsContainer: {
    justifyContent: 'center',
    flex: 4,
    flexDirection: 'column',
    width: '95%',
    alignItems: 'center', // centered horizontally
    //justifyContent: 'center', // centered vertically
    //borderColor: '#00FF00', // green debug border
    //borderWidth: 1,
    backgroundColor: '#BABABA', // soft grey for the background
  },
  // the overall "window"
  loginBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor: '#0000FF', // blue border for debug
    //borderWidth: 1,
    margin: 10,
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    height: '100%',
    marginTop: Platform.OS === 'ios' ? 10 : Expo.Constants.statusBarHeight + 10,
  },

  loginTitleText: {
    color: '#CCCCCC',
    fontSize: 90,
    fontWeight: '200',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // just a spacer
  topSpace: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // anbother spacer.
  bottomSpace: {
    flex: 0.5,
  },
  smallSpace: {
    flex: 0.25,
  },
};

export { styles, constants };
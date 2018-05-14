import React, { Component } from 'react';
import { Platform, View, Text, Button, ActivityIndicator, StatusBar } from 'react-native';
import Expo from 'expo';
import firebase from 'firebase';
import { TitledInput } from './TitledInput';

class LoginForm extends Component {

    state = { email: '', password: '', error: '', loading: false };
    onLoginPress() {
        this.setState({ error: '', loading: true });

        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => { this.setState({ error: '', loading: false }); })
            .catch(() => {
                this.setState({ error: 'Authentication failed.', loading: false });
            });
    }

    OnCreateAccount() {
        const { email, password } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => { this.setState({ error: '', loading: false }); })
            .catch(() => {
                this.setState({ error: 'Authentication failed.', loading: false });
            });
    }

    LoginAsTester() {
        firebase.auth().signInWithEmailAndPassword('tester@a.com', 'password')
            .then(() => { this.setState({ error: '', loading: false }); })
            .catch(() => {
                this.setState({ error: 'Authentication failed.', loading: false });
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
                        onPress={this.onLoginPress.bind(this)}
                        title="Log in as Tester"
                        style={styles.buttonStyle} />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.loginBoxContainer}>{/* We want to align the text inputs in the middle of the screen */}
                <View style={styles.topSpace}>
                    <Text style={styles.loginTitleText}>Login</Text>
                </View>
                <View style={styles.smallSpace} />
                <View style={styles.inputFieldsContainer}>{/*Need another View, since we're gonna be putting it in the middle.*/}
                    <View style={styles.smallSpace} />
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
}
export default LoginForm;
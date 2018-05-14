import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';


const TitledInput = ({value, onChangeText, placeholder, secureTextEntry }) => {

    const { inputStyle, labelStyle, containerStyle } = styles;

    return (
        <View style={containerStyle}>
            <TextInput
                autoCorrect={false}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                style={inputStyle}
                underlineColorAndroid={'transparent'}
            />
        </View>
    );
};

const styles = {
    inputStyle: {
        padding:10,
        color: '#262626',
        fontSize: 18,
        fontWeight: '200',
        flex: 1,
        width:'100%',
        height: 45,
        
    },
    containerStyle: { 
        alignSelf:'center',
        height: 50,
        padding:2,
        //flexDirection: 'column',
        width:'100%',
        alignItems: 'flex-start',
        borderColor: '#D4D4D4',
        borderWidth: 1,
        backgroundColor: '#FCFCFC',
    }
};

export { TitledInput };
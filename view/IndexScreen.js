import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { Animated, StyleSheet, Image, Text, View, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, Clipboard, ImageBackground, I18nManager} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import { Icon } from 'react-native-elements';
import {AnimateButton} from '../component/AnimateButton'

const screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;

export default function IndexScreen({navigation}) {

    const onStart = ()=>{
        navigation.push("Mode");
    }
    const onLoad = ()=>{
        navigation.push("Load");
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.main,{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={styles.title}>TIC TAC TOE</Text>
                <AnimateButton 
                    text="Start"
                    offViewValue={1}
                    onViewValue={1.2}
                    offTextValue={0}
                    onTextValue={6}
                    call={onStart}
                />
                <AnimateButton 
                    text="Load"
                    offViewValue={1}
                    onViewValue={1.2}
                    offTextValue={0}
                    onTextValue={6}
                    call={onLoad}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1123',
        alignItems: 'center',
        // justifyContent: 'center',
        justifyContent: "space-between",
    },
    main:{
        
    },
    title:{
        fontSize:45,
        color: "#FFF",
        marginBottom: 50,
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
});
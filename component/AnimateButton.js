import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;

export const AnimateButton = memo(({text,offViewValue,onViewValue,offTextValue,onTextValue,call})=>{
    const viewAnim = useRef(new Animated.Value(offViewValue)).current;
    const textAnim = useRef(new Animated.Value(offTextValue)).current;
    return (
        <TouchableWithoutFeedback 
            onPressIn={()=>{
                Animated.parallel([
                    Animated.timing(viewAnim, {
                        toValue: onViewValue,
                        useNativeDriver: false, 
                        duration: 100
                    }),
                    Animated.timing(textAnim, {
                        toValue: onTextValue,
                        useNativeDriver: false, 
                        duration: 100
                    })
                  ]).start();
            }}
            onPressOut={()=>{
                Animated.parallel([
                    Animated.timing(viewAnim, {
                        toValue: offViewValue,
                        useNativeDriver: false, 
                        duration: 100
                    }),
                    Animated.timing(textAnim, {
                        toValue: offTextValue,
                        useNativeDriver: false, 
                        duration: 100
                    })
                  ]).start();
            }}
            onPress={()=>{
                call();
            }}
            delayLongPress={10000}
            >
            <Animated.View style={[styles.button, {transform: [{scale:viewAnim}]}]}>
                <Animated.Text style={[styles.buttonText,{textShadowRadius:textAnim}]}>
                    {text}
                </Animated.Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    ); 
});
const styles = StyleSheet.create({
    button:{
        marginBottom:15,
        marginTop:15,
        alignItems:"center",
        borderWidth:2,
        borderColor:"#FFF",
        width: (screenW<320)?300:screenW/2,
    },
    buttonText:{
        fontSize:35,
        color:"#e2e2e2",
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        // textShadowRadius: 5,
        textAlign:"center",
        padding: 10,
    },
});
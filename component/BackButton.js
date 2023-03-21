import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import { Icon } from 'react-native-elements';

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;

export const BackButton = memo(({text,call,delayDisplay})=>{
    const Anim1 = useRef(new Animated.Value(0)).current;
    Animated.sequence([
        Animated.delay(delayDisplay),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 333
            }),
        ]),
    ]).start();
    return (
        <Animated.View style={[styles.backBtnView,{opacity:Anim1}]}>
            <TouchableOpacity style={styles.backBtn} onPress={()=>{call()}}>
                <Icon name='angle-left' type='font-awesome' size={30} color="#FFF"/>
                <Text style={styles.backBtnText}>{text}</Text>
            </TouchableOpacity>
        </Animated.View>
    ); 
});
const styles = StyleSheet.create({
    backBtnView:{
        position:"absolute",
        top:0,
        left:0,
    },
    backBtn:{
        paddingLeft:10,
        flexDirection:"row",
        alignItems:"center"
    },
    backBtnText:{
        color:"#fff",
        fontSize:20,
        paddingLeft:5,
    }
});
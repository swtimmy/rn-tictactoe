import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import {TictactoeCellCell} from './TictactoeCellCell'
import {SelectTicTacToeCellButton} from './SelectTicTacToeCellButton'
import {TictactoeCellResult} from './TictactoeCellResult'
import { set } from 'react-native-reanimated';

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
    
const com = 0;
const vs = 1;
const comLevel = 3;
const player1 = 1;
const player2 = 2;
const padding = 15;

export const AnimateTictactoeStart = memo(({player1Img,player2Img,player1Name,player2Name,setStartGame})=>{
    const Anim1 = useRef(new Animated.Value(-screenH)).current;
    const Anim2 = useRef(new Animated.Value(0)).current;
    const Anim3 = useRef(new Animated.Value(-screenW)).current;
    const Anim4 = useRef(new Animated.Value(screenW)).current;
    const Anim5 = useRef(new Animated.Value(screenH)).current;
    const Anim6 = useRef(new Animated.Value(0)).current;
    Animated.sequence([
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 0,
                useNativeDriver: false, 
                duration: 222,
            }),
            Animated.timing(Anim2, {
                toValue: 0,
                useNativeDriver: false, 
                duration: 222,
            }),
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: -100,
                useNativeDriver: false, 
                duration: 200,
            }),
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: -0,
                useNativeDriver: false, 
                duration: 200,
            }),
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: -50,
                useNativeDriver: false, 
                duration: 200,
            }),
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: -0,
                useNativeDriver: false, 
                duration: 200,
            }),
        ]),
        Animated.parallel([
            Animated.timing(Anim3, {
                toValue: 0,
                useNativeDriver: false, 
                duration: 200,
            }),
            Animated.timing(Anim4, {
                toValue: 0,
                useNativeDriver: false, 
                duration: 200,
            }),
            Animated.timing(Anim5, {
                toValue: screenH,
                useNativeDriver: false, 
                duration: 200,
            }),
        ]),
        Animated.delay(1000),
        Animated.parallel([
            Animated.timing(Anim3, {
                toValue: -screenW,
                useNativeDriver: false, 
                duration: 200,
            }),
            Animated.timing(Anim4, {
                toValue: screenW,
                useNativeDriver: false, 
                duration: 200,
            }),
            Animated.timing(Anim6, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 200,
            }),
        ]),
        Animated.parallel([
            Animated.timing(Anim5, {
                toValue: 0,
                useNativeDriver: false, 
                duration: 200,
            }),
            Animated.timing(Anim2, {
                toValue: -screenH,
                useNativeDriver: false, 
                duration: 333,
            }),
        ]),
        Animated.delay(1000),
        Animated.parallel([
            Animated.timing(Anim5, {
                toValue: -screenH,
                useNativeDriver: false, 
                duration: 200,
            }),
            Animated.timing(Anim6, {
                toValue: 0,
                useNativeDriver: false, 
                duration: 200,
            }),
            Animated.timing(Anim1, {
                toValue: -screenH,
                useNativeDriver: false, 
                duration: 200,
            }),
        ]),
    ]).start(({ finished }) => {
        setStartGame(true);
    });
    return(
        <Animated.View style={[styles.group,{transform:[{translateY:Anim1}]}]}>
            <Animated.Image style={[styles.readyImage,{transform:[{translateY:Anim2}]}]} resizeMode="contain" source={require('../assets/image/ready.png')} />
            <Animated.Image style={[styles.startImage,{opacity:Anim6,transform:[{translateY:Anim5}]}]} resizeMode="contain" source={require('../assets/image/start.png')} />
            <Animated.View style={[styles.player1,{transform:[{translateX:Anim3}]}]}>
                <View style={[styles.playerGroup,{flexDirection:"row",}]}>
                    <Image style={[styles.playerImage]} source={player1Img} />
                    <Text style={[styles.playerName]}>{player1Name}</Text>
                </View>
            </Animated.View>
            <Animated.View style={[styles.player2,{transform:[{translateX:Anim4}]}]}>
                <View style={[styles.playerGroup,{flexDirection:"row-reverse",}]}>
                    <Image style={[styles.playerImage]} source={player2Img} />
                    <Text style={[styles.playerName,{textAlign:"right"}]}>{player2Name}</Text>
                </View>
            </Animated.View>
        </Animated.View>
    )
});
const styles = StyleSheet.create({
    group:{
        position:"absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        zIndex:20,
        backgroundColor:"rgba(15, 17, 35, 0.6)"
    },
    readyImage:{
        position:"absolute",
        top:0,
        left:0,
        width:screenW,
        height:screenH
    },
    startImage:{
        position:"absolute",
        top:0,
        left:0,
        width:screenW,
        height:screenH,
    },
    playerGroup:{
        padding:padding,
        alignItems:"center",
    },
    playerImage:{
        width:100,
        height:100,
    },
    playerName:{
        color:"#fff",
        fontSize:30,
        flex:0.8,
        padding:padding,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    player1:{
        position:"absolute",
        top:0,
        left:0,
        width:screenW,
        height:screenH/2,
        justifyContent:"center"
    },
    player2:{
        position:"absolute",
        bottom:0,
        right:0,
        width:screenW,
        height:screenH/2,
        justifyContent:"center"
    }
});
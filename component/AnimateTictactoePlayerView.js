import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import {TictactoeCellCell} from './TictactoeCellCell'
import {SelectTicTacToeCellButton} from './SelectTicTacToeCellButton'
import {TictactoeCellResult} from './TictactoeCellResult'

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
    
const com = 0;
const vs = 1;
const comLevel = 3;
const player1 = 1;
const player2 = 2;
const padding = 15;

export const AnimateTictactoePlayerView = memo(({player1Score,player2Score,player1Name,player2Name,player1Img,player2Img,playerTurn,endGame,animateSpeed})=>{
    const Anim1 = useRef(new Animated.Value(0.3)).current;
    const Anim2 = useRef(new Animated.Value(0.3)).current;
    let player1Opacity = 0.3;
    let player2Opacity = 0.3;
    if(endGame||playerTurn==player1){
        player1Opacity = 1;
    }
    if(endGame||playerTurn==player2){
        player2Opacity = 1;
    }
    Animated.sequence([
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: player1Opacity,
                useNativeDriver: false, 
                duration: animateSpeed,
            }),
        ]),
        Animated.parallel([
            Animated.timing(Anim2, {
                toValue: player2Opacity,
                useNativeDriver: false, 
                duration: animateSpeed,
            }),
        ]),
    ]).start();
    return(
        <View style={{width:screenW,alignItems: 'center',justifyContent: 'center',marginTop:30}}>
            <View style={styles.playersView}>
                <Animated.View style={[{flex:1,flexDirection:"row",alignItems:"center",opacity:Anim1}]}>
                    <Image style={{width:50,height:50,borderColor:"#fff",borderWidth:1,borderRadius:0}} source={player1Img} />
                    <Text style={{color:"#fff",fontSize:20,paddingLeft:padding,paddingRight:padding,flex:1}}>{player1Name}</Text>
                </Animated.View>
                <Text style={{alignSelf:"center",fontSize:30,color:"#fff"}}>VS</Text>
                <Animated.View style={[{flex:1,flexDirection:"row-reverse",alignItems:"center",opacity:Anim2}]}>
                    <Image style={{width:50,height:50,borderColor:"#fff",borderWidth:1,borderRadius:0}} source={player2Img} />
                    <Text style={{color:"#fff",fontSize:20,paddingLeft:padding,paddingRight:padding,flex:1,textAlign:"right"}}>{player2Name}</Text>
                </Animated.View>
            </View>
            <View style={styles.playersView}>
                <Animated.Text style={[{color:"#fff",fontSize:40,paddingLeft:padding,paddingRight:padding,opacity:Anim1}]}>{player1Score}</Animated.Text>
                <Text style={{color:"#fff",fontSize:40,paddingLeft:padding,paddingRight:padding}}>:</Text>
                <Animated.Text style={[{color:"#fff",fontSize:40,paddingLeft:padding,paddingRight:padding,opacity:Anim2}]}>{player2Score}</Animated.Text>
            </View>
        </View>
    )
});
const styles = StyleSheet.create({
    playersView:{
        flexDirection:"row",
        paddingLeft:padding/2,
        paddingRight:padding/2,
        // paddingBottom:padding,
    },
});
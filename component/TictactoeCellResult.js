import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;

export const TictactoeCellResult = memo(({index,player1History,player2History,round,player1Img,player2Img,tictactoeViewWidth,tictactoeRow,lastSelectGameLevel})=>{
    if(player1History&&player1History.includes(index)){
        return(
            <View
                key={index}
                style={[styles.tictactoeCellResult]}>
                <Image style={[styles.tictactoeCellResultImage,{width:tictactoeViewWidth/tictactoeRow,height:tictactoeViewWidth/tictactoeRow},(lastSelectGameLevel==1)?{opacity:0.15}:{}]} source={player1Img} />
            </View>
        );
    }else if(player2History&&player2History.includes(index)){
        return(
            <View
                key={index}
                style={[styles.tictactoeCellResult]}>
                <Image style={[styles.tictactoeCellResultImage,{width:tictactoeViewWidth/tictactoeRow,height:tictactoeViewWidth/tictactoeRow},(lastSelectGameLevel==1)?{opacity:0.15}:{}]} source={player2Img} />
            </View>
        );
    }else if(round&&round.includes(index)){
        return(
            <View
                key={index}
                style={[styles.tictactoeCellResult]}>
                <Image style={[styles.tictactoeCellResultImage,{width:tictactoeViewWidth/tictactoeRow,height:tictactoeViewWidth/tictactoeRow},(lastSelectGameLevel==1)?{opacity:0.15}:{}]} source={require('../assets/image/draw.png')} />
            </View>
        );
    }else{
        return (
            <View>
                
            </View>
        )
    }
});
const styles = StyleSheet.create({
    tictactoeCellResult:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        zIndex:8,
    },
    tictactoeCellResultImage:{
        opacity:0.8,
    },
    drawTxt:{
        alignSelf:"center",
        fontSize:50,
        color:"#000",
    }
});
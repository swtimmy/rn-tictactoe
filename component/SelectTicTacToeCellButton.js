import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;

export const SelectTicTacToeCellButton = memo(({selectCell,index,lastSelectGameLevel,lastSelectCell,canSelect,gameLevel,end})=>{
    let borderStyle = {};
    const width = 2;
    if(index==0){
        borderStyle = {borderBottomWidth:width,borderRightWidth:width};
    }else if(index==1){
        borderStyle = {borderBottomWidth:width,borderRightWidth:width,borderLeftWidth:width};
    }else if(index==2){
        borderStyle = {borderBottomWidth:width,borderLeftWidth:width};
    }else if(index==3){
        borderStyle = {borderTopWidth:width,borderBottomWidth:width,borderRightWidth:width};
    }else if(index==4){
        borderStyle = {borderTopWidth:width,borderBottomWidth:width,borderRightWidth:width,borderLeftWidth:width};
    }else if(index==5){
        borderStyle = {borderTopWidth:width,borderBottomWidth:width,borderLeftWidth:width};
    }else if(index==6){
        borderStyle = {borderTopWidth:width,borderRightWidth:width};
    }else if(index==7){
        borderStyle = {borderTopWidth:width,borderRightWidth:width,borderLeftWidth:width};
    }else if(index==8){
        borderStyle = {borderTopWidth:width,borderLeftWidth:width};
    }
    if(gameLevel==1){
        borderStyle = {};
    }
    return (
        <TouchableOpacity 
            key={selectCell+index}
            onPress={()=>{
                if(canSelect){
                    selectCell(index)
                }
            }}
            delayLongPress={10000}
            style={[styles.selectTictactoeCell,borderStyle,(lastSelectGameLevel==1&&lastSelectCell==index)?{display:"none"}:{}]}
            >
            <View style={[styles.selectTictactoeCellView,(end)?{opacity:0}:{}]}></View>
        </TouchableOpacity>
    ); 
});
const styles = StyleSheet.create({
    selectTictactoeCell:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        borderColor:"#fff",
        zIndex:9
    },
    selectTictactoeCellView:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        backgroundColor:"gray",
        opacity:0.5,
    }
});
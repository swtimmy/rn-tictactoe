import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Easing, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';

var screen = Dimensions.get("window");
const screenH = screen.height;
const screenW = (screenH<=667)?screen.width/1.5:screen.width;
const padding = 15;
const tictactoeRow = 3;

const RenderTicTacToeCell = (Props) =>{
    const row = (Props.gameLevel!=2)?Props.row:tictactoeRow;
    const viewWidth = (Props.width!==undefined)?Props.width:(screenW-padding*2)/2;
    let cellWidth = viewWidth/row;
    let cell = [];

    for(let i = 0; i<row*row; i++){
        cell.push(i);
    }
    if(Props.gameLevel==2){
        return(
            <View style={[styles.tictactoeOutputView,{width:viewWidth,height:viewWidth}]}>
                {
                    cell.map((index)=>{
                        return(
                            <RenderTicTacToeCell
                                gameLevel={0}
                                row={Props.row}
                                width={cellWidth}
                                color={(index%2==0)?"gray":""}
                            />
                        )
                    })
                }
            </View>
        );
    }else{
        return(
            <View style={[styles.tictactoeOutputView,{width:viewWidth,height:viewWidth}]}>
                {
                    cell.map((index)=>{
                        return(
                            <View key={index} style={[styles.cell,{backgroundColor:Props.color,width:cellWidth,height:cellWidth}]}>
                                
                            </View>
                        )
                    })
                }
            </View>
        );
    }
}

export const AnimateTictactoeStructureOutput = memo(({gameLevel,row})=>{
    const Anim1 = useRef(new Animated.Value(0)).current;
    Animated.loop(
        Animated.sequence([
            Animated.parallel([
                Animated.timing(Anim1, {
                    toValue: 2,
                    useNativeDriver: false, 
                    duration: 4000,
                    easing: Easing.linear
                }),
            ]),
            Animated.parallel([
                Animated.timing(Anim1, {
                    toValue: 0,
                    useNativeDriver: false, 
                    duration: 4000,
                    easing: Easing.linear
                }),
            ]),
            Animated.parallel([
                Animated.timing(Anim1, {
                    toValue: -2,
                    useNativeDriver: false, 
                    duration: 4000,
                    easing: Easing.linear
                }),
            ]),
            Animated.parallel([
                Animated.timing(Anim1, {
                    toValue: 0,
                    useNativeDriver: false, 
                    duration: 4000,
                    easing: Easing.linear
                }),
            ]),
        ])
    ).start();
    return (
        <Animated.View style={[styles.tictactoeOutput,{transform:[{rotateX:"55deg"},{rotateZ:Anim1}]}]}>
            <View style={styles.tictactoeOutputViewBorder}>
                <RenderTicTacToeCell
                    gameLevel={gameLevel}
                    row={row}
                />
            </View>
        </Animated.View>
    )
});
const styles = StyleSheet.create({
    tictactoeOutput:{
        width:screenW,
        paddingLeft:padding,
        paddingRight:padding,
        alignItems:"center"
    },
    tictactoeCellResultImage:{
        opacity:0.6,
    },
    cell:{
        borderWidth:0.5,
        borderColor:"#fff",
    },
    tictactoeOutputViewBorder:{
        borderColor:"#fff",
        borderWidth:3,
    },
    tictactoeOutputView:{
        flexDirection:"row",
        flexWrap:"wrap",
    }
});
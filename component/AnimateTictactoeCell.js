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

export const AnimateTictactoeCell = memo(({index,selectCell,gameLevel,lastSelectGameLevel,lastSelectCell,player1GameHistory,player2GameHistory,round,player1Img,player2Img,tictactoeViewWidth,tictactoeRow,mode,cellCell,row,lastSelect,clickTictactoeCell,playerTurn,display,displaying,zoomInCell,zoomInDuration,cellCollected})=>{
    const ViewStyle={width:tictactoeViewWidth/tictactoeRow,
                    height:tictactoeViewWidth/tictactoeRow,
                    flexWrap:"wrap"};
    const Anim1 = useRef(new Animated.Value((!display&&!zoomInCell)?display:displaying)).current;
    Animated.sequence([
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: display,
                useNativeDriver: false, 
                duration: (!display)?0:zoomInDuration
            }),
        ]),
    ]).start();
    return(
        <Animated.View style={[ViewStyle,{opacity:Anim1}]}>
            <SelectTicTacToeCellButton 
                index={index}
                selectCell={selectCell}
                lastSelectGameLevel={lastSelectGameLevel}
                lastSelectCell={lastSelectCell}
                canSelect={(lastSelectGameLevel==2)?true:false}
                gameLevel={gameLevel}
                end={(round.includes(index))?true:false}
            />
            <TictactoeCellResult
                index={index}
                player1History = {player1GameHistory["win"]}
                player2History = {player2GameHistory["win"]}
                round = {round}
                player1Img = {player1Img}
                player2Img = {player2Img}
                tictactoeViewWidth = {tictactoeViewWidth}
                tictactoeRow = {tictactoeRow}
                lastSelectGameLevel={lastSelectGameLevel}
            />
            <TictactoeCellCell
                mode = {mode}
                cellID = {index}
                cell = {cellCell}
                player1History = {player1GameHistory[index]}
                player2History = {player2GameHistory[index]}
                player1Img = {player1Img}
                player2Img = {player2Img}
                tictactoeViewWidth = {tictactoeViewWidth}
                tictactoeRow = {tictactoeRow}
                row = {row}
                lastSelect = {lastSelect}
                selectedCell = {(index==lastSelectCell)?true:false}
                clickTictactoeCell = {clickTictactoeCell}
                playerTurn = {playerTurn}
                cellCollected = {(cellCollected&&cellCollected[index])?cellCollected[index]:false}
            />
        </Animated.View>
    )
});
const styles = StyleSheet.create({
    image:{
        borderRadius:999,
    },
    animateView:{
        zIndex:9
    }
});
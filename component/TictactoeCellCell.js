import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import {AnimateTictactoeCellCell} from './AnimateTictactoeCellCell'

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
    
const com = 0;
const vs = 1;
const comLevel = 3;
const player1 = 1;
const player2 = 2;

export const TictactoeCellCell = memo(({mode,cellID,cell,player1History,player2History,player1Img,player2Img,tictactoeRow,tictactoeViewWidth,row,lastSelect,selectedCell,playerTurn,clickTictactoeCell,cellCollected})=>{
    const RenderCellCell = (Props) =>{
        return (
            cell.map((index)=>{
                if(player1History.includes(index)){
                    return(
                        <AnimateTictactoeCellCell
                            index={index}
                            img_src={player1Img}
                            tictactoeViewWidth={tictactoeViewWidth/tictactoeRow}
                            row={row}
                            selected={(index==lastSelect)?true:false}
                            selectedCell={selectedCell}
                            cellCollected={cellCollected}
                        />
                    );
                }else if(player2History.includes(index)){
                    return(
                        <AnimateTictactoeCellCell
                            index={index}
                            img_src={player2Img}
                            tictactoeViewWidth={tictactoeViewWidth/tictactoeRow}
                            row={row}
                            selected={(index==lastSelect)?true:false}
                            selectedCell={selectedCell}
                            cellCollected={cellCollected}
                        />
                    );
                }else{
                    return(
                        <View key={index}>
                            <TouchableOpacity style={[Props.tictactoeCell,{width:tictactoeViewWidth/tictactoeRow/row,height:tictactoeViewWidth/tictactoeRow/row}]} onPress={()=>{if(playerTurn==player2&&mode==com){return false};clickTictactoeCell(index)}}>
                                {/* <Image style={styles.image} source={require('../assets/image/test.png')} /> */}
                            </TouchableOpacity>
                        </View>
                    );
                }
            })
        )
    }
    return(
        <View style={styles.cellCellView}>
            <RenderCellCell
                tictactoeCell = {styles.tictactoeCell}
            />
        </View>
    )
});
const styles = StyleSheet.create({
    tictactoeCell:{
        // backgroundColor:"gray",
        borderColor:"#FFF",
        borderWidth:1,
    },
    cellCellView:{
        flexDirection:"row",
        flexWrap:"wrap",
    }
});
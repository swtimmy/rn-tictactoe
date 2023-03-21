import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;

export const AnimateTictactoeCellCell = memo(({index,img_src,tictactoeViewWidth,row,selected,selectedCell,cellCollected})=>{
    const Anim1 = useRef(new Animated.Value(5)).current;
    const Anim2 = useRef(new Animated.Value(0.7)).current;
    Animated.sequence([
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 5,
                useNativeDriver: false, 
                duration: 111
            }),
            Animated.timing(Anim2, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 111
            })
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            }),
            Animated.timing(Anim2, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            })
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 1.5,
                useNativeDriver: false, 
                duration: 222
            }),
            Animated.timing(Anim2, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            })
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            }),
            Animated.timing(Anim2, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            })
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 1.2,
                useNativeDriver: false, 
                duration: 222
            }),
            Animated.timing(Anim2, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            })
        ]),
        Animated.parallel([
            Animated.timing(Anim1, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            }),
            Animated.timing(Anim2, {
                toValue: 1,
                useNativeDriver: false, 
                duration: 222
            })
        ])
    ]).start();

    const RenderHorizontalLine=(Props)=>{
        if(Props.cellCollected&&Props.cellCollected['horizontal']&&Props.cellCollected['horizontal'].includes(Props.index)){
            return(
                <View style={[styles.lineView,{width:Props.width,height:Props.width}]}>
                    <View style={[styles.line,{width:Props.width*2,height:3,marginLeft:-Props.width/2,marginTop:(Props.width-3)/2,transform:[{rotate:"0deg"}]}]}></View>
                </View>
            )
        }else{
            return(
                <View></View>
            );
        }
    }

    const RenderVerticalLine=(Props)=>{
        if(Props.cellCollected&&Props.cellCollected['vertical']&&Props.cellCollected['vertical'].includes(Props.index)){
            return(
                <View style={[styles.lineView,{width:Props.width,height:Props.width}]}>
                    <View style={[styles.line,{width:Props.width*2,height:3,marginLeft:-Props.width/2,marginTop:(Props.width-3)/2,transform:[{rotate:"90deg"}]}]}></View>
                </View>
            )
        }else{
            return(
                <View></View>
            );
        }
    }

    const RenderLeftSlashLine=(Props)=>{
        if(Props.cellCollected&&Props.cellCollected['left_slash']&&Props.cellCollected['left_slash'].includes(Props.index)){
            return(
                <View style={[styles.lineView,{width:Props.width,height:Props.width}]}>
                    <View style={[styles.line,{width:Props.width*2,height:3,marginLeft:-Props.width/2,marginTop:(Props.width-3)/2,transform:[{rotate:"135deg"}]}]}></View>
                </View>
            )
        }else{
            return(
                <View></View>
            );
        }
    }

    const RenderRightSlashLine=(Props)=>{
        if(Props.cellCollected&&Props.cellCollected['right_slash']&&Props.cellCollected['right_slash'].includes(Props.index)){
            return(
                <View style={[styles.lineView,{width:Props.width,height:Props.width}]}>
                    <View style={[styles.line,{width:Props.width*2,height:3,marginLeft:-Props.width/2,marginTop:(Props.width-3)/2,transform:[{rotate:"45deg"}]}]}></View>
                </View>
            )
        }else{
            return(
                <View></View>
            );
        }
    }

    return (
        <View key={index} style={[((selected)?styles.animateView:{}),styles.tictactoeCell,{width:tictactoeViewWidth/row,height:tictactoeViewWidth/row}]}>
            <Animated.View key={index+"-"+index} style={[(selected&&selectedCell)?{transform: [{scale:Anim1}],opacity:Anim2}:{}]}>
            {/* <Animated.View style={[]}> */}
                <Image style={[styles.image,{width:tictactoeViewWidth/row-2,height:tictactoeViewWidth/row-2}]} 
                    source={img_src} />
                <RenderHorizontalLine
                    cellCollected={cellCollected}
                    index={index}
                    width={tictactoeViewWidth/row-2}
                />
                <RenderVerticalLine
                    cellCollected={cellCollected}
                    index={index}
                    width={tictactoeViewWidth/row-2}
                />
                <RenderLeftSlashLine
                    cellCollected={cellCollected}
                    index={index}
                    width={tictactoeViewWidth/row-2}
                />
                <RenderRightSlashLine
                    cellCollected={cellCollected}
                    index={index}
                    width={tictactoeViewWidth/row-2}
                />
            </Animated.View>
        </View>
    ); 
});
const styles = StyleSheet.create({
    tictactoeCell:{
        // backgroundColor:"gray",
        borderColor:"#FFF",
        borderWidth:1,
    },
    lineView:{
        overflow:"hidden",
        position:"absolute",
        top:0,
        left:0,
    },
    line:{
        backgroundColor:"#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
    },
    image:{
        borderRadius:999,
    },
    animateView:{
        zIndex:1
    }
});
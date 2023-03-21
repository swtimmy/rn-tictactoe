import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { Animated, StyleSheet, FlatList, Image, Text, View, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, Clipboard, ImageBackground, I18nManager} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import { Icon } from 'react-native-elements';
import {AnimateButton} from '../component/AnimateButton'
import {BackButton} from '../component/BackButton'
import {ColumnAnimateButton} from '../component/ColumnAnimateButton'

import * as Analytics from 'expo-firebase-analytics';

const screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
const padding = 15;

export default function LoadScreen({navigation}) {
    const [history,setHistory] = useState([]);
    const [lastSelectCell,setLastSelectCell] = useState({});
    const [cellCollected,setCellCollected] = useState({});
    const [playerScore,setPlayerScore] = useState({});
    const [playerStickerPath,setPlayerStickerPath] = useState({});
    const [itemSelected,setItemSelected] = useState(null);

    async function asyncCall(){
        await Analytics.setCurrentScreen('LoadScreen');
    }
    // AsyncStorage.removeItem('history');
    // AsyncStorage.removeItem('lastSelectCell');
    // AsyncStorage.removeItem('cellCollected');
    const getRecord=()=>{
        let record = [];
        AsyncStorage.getItem('history', (err, result) => {
            if (result !== null) {
                var obj = JSON.parse(result);
                Object.keys(obj).map((key)=>{
                    record.push(obj[key]);
                    console.log(key)
                })
            } else {
                
            }
            setHistory(record);
        });
        AsyncStorage.getItem('lastSelectCell', (err, result) => {
            if (result !== null) {
                setLastSelectCell(JSON.parse(result));
            }
        });
        AsyncStorage.getItem('cellCollected', (err, result) => {
            if (result !== null) {
                setCellCollected(JSON.parse(result));
            }
        });
        AsyncStorage.getItem('playerScore', (err, result) => {
            if (result !== null) {
                setPlayerScore(JSON.parse(result));
            }
        });
        AsyncStorage.getItem('playerStickerPath', (err, result) => {
            if (result !== null) {
                setPlayerStickerPath(JSON.parse(result));
            }
        });
    }

    const deleteRecord=()=>{
        // AsyncStorage.removeItem('history');
        let newObj = history.filter((v)=>(v.id!==itemSelected));
        AsyncStorage.setItem('history', JSON.stringify(newObj));
        setHistory(newObj);
    }

    useEffect(()=>{
        asyncCall();
        getRecord();
    },[])

    useEffect(()=>{
        // console.log(history)
    },history);

    const onStart = ()=>{
        // if(mode==com){
        //     navigation.push("Computer",{mode:mode});
        // }else{
        //     navigation.push("Player",{mode:mode});
        // }
    }

    const onBack = ()=>{
        navigation.pop();
    }

    const onSelect = (id) =>{
        setItemSelected(id);
    }

    const onDelete = ()=>{
        deleteRecord();
    }

    const onLoad = ()=>{
        if(itemSelected){
            let obj = history.filter((v)=>(v.id==itemSelected))[0];
            obj['game']['lastSelectCell']=lastSelectCell[obj.id];
            obj['game']['zoomingCell']=lastSelectCell[obj.id];
            obj['game']['lastSelectGameLevel']=(lastSelectCell[obj.id]==null)?2:1;
            obj['game']['cellCollected']=cellCollected[obj.id];
            obj['p1']['score']=playerScore[obj.id]['p1'];
            obj['p2']['score']=playerScore[obj.id]['p2'];
            navigation.push("Game",{
                mode:obj.mode,
                ai:obj.ai,
                p1:obj.p1,
                p2:obj.p2,
                game:obj.game,
                id:obj.id,
                turn:obj.turn,
                p1History:obj.player1GameHistory,
                p2History:obj.player2GameHistory,
                gamedRound:obj.gamedRound,
            });
        }
    }

    const ItemView=({ id, p1, p2, itemSelected, onSelect })=>{
      return (
        <TouchableOpacity
            onPress={() => onSelect(id)}
            style={[
                styles.flatlistitem,
                { backgroundColor: itemSelected ? '#bee5eb' : '#e2e2e2' },
            ]}
        >
            <View style={styles.flatlistView}>
                <View style={styles.side}>
                    <Image style={[styles.flatlistImg]} source={p1.img} />
                    <View>
                        <Text style={styles.flatlistTitle}>{p1.name}</Text>
                        <Text style={styles.flatlistDetail}>{(playerScore[id])?playerScore[id]['p1']:p1.score}</Text>
                    </View>
                </View>
                <View style={styles.vs}><Text>VS</Text></View>
                <View style={[styles.side,{justifyContent:"flex-end"}]}>
                    <View>
                        <Text style={[styles.flatlistTitle,{textAlign:"right"}]}>{p2.name}</Text>
                        <Text style={[styles.flatlistDetail,{textAlign:"right"}]}>{(playerScore[id])?playerScore[id]['p2']:p2.score}</Text>
                    </View>
                    <Image style={[styles.flatlistImg]} source={p2.img} />
                </View>
            </View>
        </TouchableOpacity>
      );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.main]}>
                <Text style={styles.title}>
                    Load
                </Text>
                <FlatList
                    style={styles.flatlist}
                    data={history}
                    renderItem={({ item }) =>{
                        return <ItemView
                            id={item.id}
                            p1={item.p1}
                            p2={item.p2}
                            itemSelected={(itemSelected==item.id)?true:false}
                            onSelect={onSelect}
                        /> 
                    }}
                    keyExtractor={item => item.id}
                    extraData={itemSelected}
                />
                <View style={[styles.gameButtonView,(itemSelected==null)?{opacity:0}:{}]}>
                    <ColumnAnimateButton
                        text="Delete"
                        offViewValue={1}
                        onViewValue={1.1}
                        offTextValue={0}
                        onTextValue={6}
                        call={onDelete}
                    />
                    <View style={{width:padding}}></View>
                    <ColumnAnimateButton
                        text="Load"
                        offViewValue={1}
                        onViewValue={1.1}
                        offTextValue={0}
                        onTextValue={6}
                        call={onLoad}
                    />
                </View>
                <BackButton
                    text="Back"
                    call={onBack}
                    delayDisplay={500}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1123',
        alignItems: 'center',
        // justifyContent: 'center',
        justifyContent: "space-between",
    },
    flatlist:{
        width:screenW,
        padding:padding,
        flex:1,
    },
    flatlistitem:{
        
    },
    vs:{
        alignSelf:"center"
    },
    flatlistView:{
        paddingTop:padding,
        paddingBottom:padding,
        flexDirection:"row",
        borderBottomColor:"#0f1123",
        borderBottomWidth:10,
    },
    side:{
        flex:1,
        flexDirection:"row"
    },
    flatlistTitle:{
        fontSize:22,
    },
    flatlistDetail:{
        fontSize:22,
    },
    flatlistImg:{
        width:50,
        height:50,
        backgroundColor:"#0f1123",
        marginLeft:padding,
        marginRight:padding,
    },
    image:{
        width:(screenW<screenH)?screenW-padding*2:screenH-padding*2,
        height:(screenW<screenH)?screenW-padding*2:screenH-padding*2,
    },
    gameButtonView:{
        flexDirection:"row",
        paddingLeft:padding,
        paddingRight:padding,
    },
    main:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
        fontSize:45,
        color: "#FFF",
        marginTop: 50,
    },
    prevBtn:{
        position:"absolute",
        left:0,
    },
    nextBtn:{
        position:"absolute",
        right:0,
    },
    scrollPage:{
        flex:1,
        width:screenW,
        justifyContent:"center",
        alignItems:"center",
    }
});
import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { Animated, StyleSheet, Image, Text, View, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, Clipboard, ImageBackground, I18nManager} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import { Icon } from 'react-native-elements';
import {AnimateButton} from '../component/AnimateButton'
import {BackButton} from '../component/BackButton'
import {AnimateTictactoeStructureOutput} from '../component/AnimateTictactoeStructureOutput'

import SwitchSelector from 'react-native-switch-selector';
import * as Analytics from 'expo-firebase-analytics';

const screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
const padding = (screenH<=667)?8:15;
const fontSize = (screenH<=667)?22:28;

export default function SelectScreen({navigation,route}) {
    const { mode,ai,p1,p2 } = route.params;
    const [rowOption,setRowOption] = useState([]);
    const [winOption,setWinOption] = useState([]);
    const [gameLevelOption,setGameLevelOption] = useState([]);
    const [row,setRow] = useState(3);
    const [collect,setCollect] = useState(3);
    const [gameLevel,setGameLevel] = useState(1);
    const minRow = 3;
    const rowSwitchRef = useRef(null);
    const winSwitchRef = useRef(null);
    const player1 = 1;
    const player2 = 2;
    const gameLevelSwitchRef = useRef(null);
    const [pressed,setPressed] = useState(false);

    async function asyncCall(){
        await Analytics.setCurrentScreen('SettingScreen');
    }
    
    useEffect(()=>{
        asyncCall();

        const gameLevelOption = [
            {label:"1",value:1},
            {label:"2",value:2},
        ]
        setGameLevelOption([...gameLevelOption]);
        const rowOption = [
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
            { label: '6', value: 6 },
            { label: '7', value: 7 },
            { label: '8', value: 8 },
            { label: '9', value: 9 },
        ];
        setRowOption([...rowOption]);
        const winOption = [
            { label: '3', value: 3 },
        ];
        setWinOption([...winOption]);
        setRow(3);
        setCollect(3);
        setGameLevel(1);
    },[])

    const onStart = ()=>{
        if(!pressed){
            setPressed(true);
            const id = new Date().getTime();
            AsyncStorage.getItem('playerScore', (err, result) => {
                var objData = {[id]:{'p1':0,'p2':0,}};
                if (result !== null) {
                    var obj = JSON.parse(result);
                    var newObj = {...obj,...objData};
                    AsyncStorage.setItem('playerScore', JSON.stringify(newObj));
                } else {
                    AsyncStorage.setItem('playerScore', JSON.stringify(objData));
                }
            });
            navigation.push("Game",{
                mode:mode,
                ai:ai,
                p1:p1,
                p2:p2,
                game:{
                    row:row,
                    collect:collect,
                    gameLevel:gameLevel,
                    lastSelectCell:null,
                    lastSelectGameLevel:gameLevel,
                    zoomingCell:null,
                    endGame:false,
                    cellCollected:{},
                },
                gamedRound:[],
                cellCollected:{},
                id:id,
                turn:player1,
            });
        }
    }

    const onBack = ()=>{
        navigation.pop();
    }

    const updateRow = (index)=>{
        setRow(index);
        if(index>minRow){
            let min = 4;
            let max = index-1;
            if(max<min){
                max=min;
            }
            let newWinOption = [];
            for(let i=min; i<=max; i++){
                newWinOption.push(
                    {
                        "label":i,
                        "value":i
                    }
                );
            }
            setWinOption([...newWinOption]);
            setCollect(min);
        }else{
            const winOption = [
                { label: '3', value: '3' },
            ];
            setWinOption([...winOption]);
        }
        winSwitchRef.current?.toggleItem(0);
    }

    useEffect(()=>{
        if(row==3){
            setCollect(3);
        }
    },[winOption]);

    const updateCollect = (index)=>{
        setCollect(index);
    }

    const updateGameLevel = (index)=>{
        setGameLevel(index);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.main]}>
                <Text style={styles.title}>
                    Setting
                </Text>
                <View style={styles.push}></View>
                <View style={styles.settingGroup}>
                    <Text style={styles.settingTitle}>Row & Column</Text>
                    <SwitchSelector ref={rowSwitchRef} style={styles.switch} selectedColor={"#0c5460"} buttonColor={"#bee5eb"} borderRadius={0} options={rowOption} fontSize={fontSize} initial={0} onPress={value => updateRow(value)} />
                </View>
                <View style={styles.settingGroup}>
                    <Text style={styles.settingTitle}>Collect to Win</Text>
                    <SwitchSelector ref={winSwitchRef} style={styles.switch} selectedColor={"#0c5460"} buttonColor={"#bee5eb"} borderRadius={0} options={winOption} fontSize={fontSize} initial={0} onPress={value => updateCollect(value)} />
                </View>
                <View style={styles.settingGroup}>
                    <Text style={styles.settingTitle}>Game Level</Text>
                    <SwitchSelector ref={gameLevelSwitchRef} style={styles.switch} selectedColor={"#0c5460"} buttonColor={"#bee5eb"} borderRadius={0} options={gameLevelOption} fontSize={fontSize} initial={0} onPress={value => updateGameLevel(value)} />
                </View>
                <View style={styles.push}></View>
                <View style={styles.output}>
                    <AnimateTictactoeStructureOutput
                        row={row}
                        gameLevel={gameLevel}
                    />
                </View>
                <View style={styles.push}></View>
                <AnimateButton
                    text="Next"
                    offViewValue={1}
                    onViewValue={1.2}
                    offTextValue={0}
                    onTextValue={6}
                    call={onStart}
                />
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
    switch:{
        backgroundColor:"#fff",
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
    settingGroup:{
        width:screenW,
        padding:padding,
    },
    settingTitle:{
        color:"#fff",
        fontSize:fontSize,
        paddingBottom:padding/2
    },
    output:{

    },
    push:{
        flex:1
    },
});
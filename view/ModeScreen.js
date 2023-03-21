import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { Animated, StyleSheet, Image, Text, View, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, Clipboard, ImageBackground, I18nManager} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import { Icon } from 'react-native-elements';
import {AnimateButton} from '../component/AnimateButton'
import {BackButton} from '../component/BackButton'

import * as Analytics from 'expo-firebase-analytics';

const screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
const padding = 15;

export default function ModeScreen({navigation}) {
    const com = 0;
    const vs = 1;
    const [mode,setMode] = useState(com);
    const selectScrollView = useRef(null);

    async function asyncCall(){
        await Analytics.setCurrentScreen('ModeScreen');
    }

    useEffect(()=>{
        asyncCall();
    },[])

    const onStart = ()=>{
        if(mode==com){
            navigation.push("Computer",{mode:mode});
        }else{
            navigation.push("Player",{mode:mode});
        }
    }

    const onBack = ()=>{
        navigation.pop();
    }

    const updatePage=(page,updateScrollView)=>{
        setMode(page);
        if(updateScrollView){
            selectScrollView.current.scrollTo({x:page*screenW,animated: true});
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.main]}>
                <Text style={styles.title}>
                    Select
                </Text>
                <ScrollView 
                    pagingEnabled={true} 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={event => { 
                        let page = (event.nativeEvent.contentOffset.x/screenW);
                        updatePage(page,false);
                    }}
                    ref={selectScrollView}>
                    <View style={styles.scrollPage}>
                        <Image style={styles.image} resizeMode='contain' source={require('../assets/image/vs_com_white_v2.png')} />
                    </View>
                    <View style={styles.scrollPage}>
                        <Image style={styles.image} resizeMode='contain' source={require('../assets/image/vs_people_white_v2.png')} />
                    </View>
                </ScrollView>
                <TouchableOpacity style={[styles.prevBtn,(mode==com)?{"display":"none"}:{}]} onPress={()=>{updatePage(mode-1,true)}}>
                    <Icon name='angle-left' type='font-awesome' size={150} color="#FFF"/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.nextBtn,(mode==vs)?{"display":"none"}:{}]} onPress={()=>{updatePage(mode+1,true)}}>
                    <Icon name='angle-right' type='font-awesome' size={150} color="#FFF"/>
                </TouchableOpacity>
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
    image:{
        width:(screenW<screenH)?screenW-padding*2:screenH-padding*2,
        height:(screenW<screenH)?screenW-padding*2:screenH-padding*2,
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
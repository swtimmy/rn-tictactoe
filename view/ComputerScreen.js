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

export default function ComputerScreen({navigation,route}) {
    const { mode } = route.params;
    const scrollMinPage = 0;
    const scrollMaxPage = 3;
    const [comLevel,setComLevel] = useState(scrollMinPage);
    const selectScrollView = useRef(null);

    async function asyncCall(){
        await Analytics.setCurrentScreen('ComputerScreen');
    }

    useEffect(()=>{
        asyncCall();
    },[])

    const onStart = ()=>{
        navigation.push("Player",{
            mode:mode,
            ai:{
                level:(comLevel)?comLevel:0
            },
        });
    }

    const onBack = ()=>{
        navigation.pop();
    }

    const updatePage=(page,updateScrollView)=>{
        const level = page;
        setComLevel(level);
        if(updateScrollView){
            selectScrollView.current.scrollTo({x:page*screenW,animated: true});
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.main]}>
                <Text style={styles.title}>
                    Computer Level
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
                        <Image style={styles.image} resizeMode='contain' source={require('../assets/image/com_beginner_white.png')} />
                        <Text style={styles.levelText}>Beginner</Text>
                    </View>
                    <View style={styles.scrollPage}>
                        <Image style={styles.image} resizeMode='contain' source={require('../assets/image/com_easy_white.png')} />
                        <Text style={styles.levelText}>Easy</Text>
                    </View>
                    <View style={styles.scrollPage}>
                        <Image style={styles.image} resizeMode='contain' source={require('../assets/image/com_normal_white.png')} />
                        <Text style={styles.levelText}>Normal</Text>
                    </View>
                    <View style={styles.scrollPage}>
                        <Image style={styles.image} resizeMode='contain' source={require('../assets/image/com_hard_white.png')} />
                        <Text style={styles.levelText}>Hard</Text>
                    </View>
                </ScrollView>
                <TouchableOpacity style={[styles.prevBtn,(comLevel==scrollMinPage)?{"display":"none"}:{}]} onPress={()=>{updatePage(comLevel-1,true)}}>
                    <Icon name='angle-left' type='font-awesome' size={150} color="#FFF"/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.nextBtn,(comLevel==scrollMaxPage)?{"display":"none"}:{}]} onPress={()=>{updatePage(comLevel+1,true)}}>
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
    main:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        width:(screenW<screenH)?screenW-padding*2:screenH-padding*2,
        height:(screenW<screenH)?screenW-padding*2:screenH-padding*2,
    },
    title:{
        fontSize:45,
        color: "#FFF",
        marginTop: 50,
    },
    levelText:{
        color:"#e2e2e2",
        fontSize:40,
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
        alignItems:"center"
    },
});
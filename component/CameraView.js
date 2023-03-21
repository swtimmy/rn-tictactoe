import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import { StyleSheet, Animated, Image, Slider, Text, View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, SnapshotViewIOS} from 'react-native';
import {Dimensions, Platform, AsyncStorage} from "react-native";
import {isTablet} from 'react-native-device-detection';
import { Icon } from 'react-native-elements';
import { Camera } from 'expo-camera';

import * as media from '../utility/manipulator';

var screen = Dimensions.get("window");
const screenW = screen.width;
const screenH = screen.height;
const padding = 15;

const _changeCameraType = (setCameraType,cameraType)=>{
    setCameraType(
        cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
}

const _snap = async (cameraRef,cameraReady,setImage,cameraType) => {
    if (cameraRef && cameraReady) {
        const option = {
            quality:0.5,//0 to 1 
            // base64:true,
            // exif:false,
        }
        let photo = await cameraRef.current.takePictureAsync(option);
        const manipulator = new media.manipulator(photo.uri);
        let res;
        if(cameraType === Camera.Constants.Type.back){
            res = await manipulator.resize({ width: 256, height: 256 }).saveJPG();
        }else{
            res = await manipulator.flip("horizontal").resize({ width: 256, height: 256 }).saveJPG();
        }
        // console.log(res)
        let data = {};
        data['uri']=`data:image/jpeg;base64,${res.base64}`;
        setImage(data);
    }
}

const _zoom = (value,setCameraZoom) => {
    setCameraZoom(value);
}


export const CameraView = memo(({hasCameraPermission,cameraType,setCameraType,cameraRef,cameraReady,setCameraReady,cameraZoom,setCameraZoom,setImage,outerPadding})=>{
    if (hasCameraPermission === null) {
        return <Text style={styles.title}>Waiting Allow Camera Permission to Active Capture Function</Text>;
    }
    if (hasCameraPermission === false) {
        return <Text style={styles.title}>Please Allow Camera Permission to Active Capture Function</Text>;
    }
    return (
        <View style={{}}>
            <Camera 
            ref={cameraRef} 
            style={{ height:screenW-outerPadding*2}} 
            type={cameraType}
            zoom={cameraZoom}
            onCameraReady={(evt)=>{setCameraReady(true)}}
            >
                <View
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    justifyContent:"flex-end",
                }}>
                </View>
            </Camera>
            <View style={styles.cameraToolView}>
                <View style={styles.cameraZoom}>
                    <Icon name='search' style={{marginRight:padding/2}} type='font-awesome' size={30} color="#FFF"/>
                    <Slider style={{flex:1}} minimumValue={0} maximumValue={1} value={cameraZoom} onValueChange={(value)=>{_zoom(value,setCameraZoom)}}/>
                </View>
                <TouchableOpacity style={styles.cameraFlip} onPress={() => {_changeCameraType(setCameraType,cameraType)}}>
                    <Image style={{width:50,height:50,}} source={require('../assets/image/flip_camera.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.cameraToolView}>
                <TouchableOpacity style={styles.cameraSnap} onPress={() => {
                    _snap(cameraRef,cameraReady,setImage,cameraType)
                }}>
                    <Image style={{width:100,height:100,}} source={require('../assets/image/snap_camera.png')} />
                </TouchableOpacity>
            </View>
        </View>
    ); 
});
const styles = StyleSheet.create({
    title:{
        color:"#fff",
        fontSize:22,
    },
    cameraToolView:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:padding/2
    },
    cameraFlip:{
        paddingLeft:padding*2,
        alignSelf:"center"
    },
    cameraZoom:{
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        alignItems:"center"
    },
    cameraSnap:{
        
    }
});
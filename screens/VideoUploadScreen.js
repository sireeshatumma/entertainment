import React, { Component, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Platform,Linking,ActivityIndicator
} from "react-native";
import { ListItem } from "react-native-elements";
import { WebView } from 'react-native-webview';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from '../config'
import MyHeader from '../components/MyHeader'

// const VideoUploadScreen=()=>{
  export default class VideoUploadScreen extends Component{
// const[imageUrl,setImageUrl] =useState("#");
// const[videoLinksList,setVideoLinksList] =useState([]);
constructor(){
  super();
  this.state={
    userId : firebase.auth().currentUser.email,
    videoName:"",
    description:"",
    uri:"#",
    videoLinksList:[],
    uploading:false,
    uploadTaskSnapshot:{}
  }
  this.requestRef = null;
}


selectPicture = async () => {
    const { cancelled, uri } =  await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.setState({uploading:true})
        console.log("not cancelled")
        var randomRequestId = this.createUniqueId()
        this.uploadImage(uri, randomRequestId);
    }
  };
  
  createUniqueId=()=>{
    return Math.random().toString(36).substring(7);
  }

  uploadImage = async (uri, imageName) => {
    console.log("uploadImage: "+imageName)
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    console.log("fetchImage: "+imageName)
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ uri: url });
        console.log("url: "+imageName)
        // setImageUrl(url)
        // this.writeToDB(url)
      })
      .catch((error) => {
        this.setState({ uri: "#" });
      });
      this.setState({uploading:false})
      return Alert.alert("video link uploaded Successfully")
  };
 
  addRequest =(videoName,description)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    // db.collection('uploaded_video_links').add({
      db.collection('video_names').add({
        "user_id": userId,
        "video_link":videoName,
        "description":description,
        "request_id"  : randomRequestId,
        "likes" :0,
        "disLikes":0
    })

    this.setState({
        videoName :'',
        description : ''
    })

    return Alert.alert("video link submitted Successfully")
  }
  
    
 render(){
  return(
    <View style={styles.screen}>
   <MyHeader title="Upload Video" navigation ={this.props.navigation}/>

  <View style={{ flex: 1,}}>
        <TextInput
                // style ={[styles.formTextInput,{height:300}]}
                style ={styles.formTextInput}                
                placeholder={"About video"}
                onChangeText ={(text)=>{
                    this.setState({
                        description:text
                    })
                }}
                value ={this.state.description}
              />
              <Text>click to upload video</Text>
    <TouchableOpacity style={styles.button}
     onPress={()=>{this.selectPicture()}}
     >
      <Text style={styles.buttonText}>Upload</Text>
    </TouchableOpacity>

    <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.uri,this.state.description)}}
                >
                <Text>Submit</Text>
              </TouchableOpacity>
    
  </View>

  <View>
  {this.state.uploading && (
  <View style={styles.uploading}>
    <ActivityIndicator size={60} color="#47477b"></ActivityIndicator>
    <Text style={styles.statusText}>Uploading</Text>
    <Text style={styles.statusText}>

      {/* {`${((uploadTaskSnapshot.bytesTransferred / uploadTaskSnapshot.totalBytes) * 100).toFixed(2)}% / 100%`} */}
    </Text>
  </View>
)}
  </View>
  
</View>
)
 }

   
}
const styles = StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center',
      // border:"solid"
    },
    title: {
      fontSize: 35,
      marginVertical: 40,
    },
    formTextInput:{
      width:"100%",
      height:40,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:100,
      marginBottom:50,
      padding:5,
    },
    button: {
      backgroundColor: '#47477b',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 50,
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
    },
    mediaButton: {
      position: 'absolute',
      bottom: 0,
      marginBottom: 50,
      width: 300,
    },
    center: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 50,
    },
    uploading: {
      marginTop: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusText: {
      marginTop: 20,
      fontSize: 20,
    },
  });
// export default VideoUploadScreen;
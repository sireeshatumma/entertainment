// https://firebasestorage.googleapis.com/v0/b/krish-app-c48d5.appspot.com/o/user_profiles%2Fblxfl9?alt=media&token=e9214714-a382-4b43-9485-107cca3cd9f7

import React, { Component, useEffect } from "react";
import {Text,View,StyleSheet,TouchableOpacity,Image, ActivityIndicator} from 'react-native'
import { Video, AVPlaybackStatus } from 'expo-av';
import db from '../config'
import firebase from 'firebase'

 const MediaPlay=(item)=> {
    //  console.log("linkId: "+item.linkId.video_link)
    const[userId,setUserId]=React.useState(firebase.auth().currentUser.email)
     const[like,setLike]=React.useState(item.linkId.likes)
     const[disLike,setDisLike]=React.useState(item.linkId.disLikes)
     const[docId,setDocId]=React.useState('0')
    const video = React.useRef(null);
const uri=item.linkId.video_link
const description=item.linkId.description
const targetedUid=item.linkId.user_id
//'https://firebasestorage.googleapis.com/v0/b/krish-app-c48d5.appspot.com/o/user_profiles%2Fblxfl9?alt=media&token=e9214714-a382-4b43-9485-107cca3cd9f7' 
// userId liked ur video
sendNotification=(status)=>{
  //to get the first name and last name
  console.log("send notification")
  db.collection('users').where('email_id','==',userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name
      var uploadedUser = doc.data().user_id

      db.collection('all_notifications').add({
        "targeted_user_id" : targetedUid,
        "message" : name +" " + lastName + " "+status+" your video" ,
        "notification_status" : "unread",
      })
    })
  })
}
updateLikesInDB=()=>{
    console.log(updateLikesInDB)
    db.collection('video_names')
  .where('video_link','==',uri)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
        setDocId(doc.id)   
        setLike(doc.data().likes)
    })
  })
  console.log(docId)
  db.collection('video_names').doc(docId)
  .update({
    likes : like
  })
  console.log("updated LikesInDB")
  sendNotification("liked")
}
updateDisLikesInDB=()=>{
    db.collection('video_names')
  .where('video_link','==',uri)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
        setDocId(doc.id)   
        setDisLike(doc.data().disLikes)
    })
  })
  console.log(docId)
  db.collection('video_names').doc(docId)
  .update({
    disLikes : disLike
  })
  sendNotification("disliked");
}

    return(
        <View style={styles.container}>        

            <View style={styles.subContainer}> 
                <Video
                    ref={video}
                    style={styles.video}
                    source={{uri:uri}}
                    useNativeControls
                    resizeMode="cover"
                    isLooping
                // onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                <Text>{description}</Text>
            </View>
            <View style={styles.likeButton}>
                <TouchableOpacity 
                onPress ={()=>{
                    setLike(like+1)
                    updateLikesInDB()}}>       
                    <Image
                        style={styles.imageStyle}
                        source={require('../assets/thumbs-up.png')}
                    />
                    <Text style={{color:"green"}}>{like}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.disLikeButton}>
                <TouchableOpacity onPress ={()=>{
                    setDisLike(disLike+1)
                    updateDisLikesInDB()}}>
                <Image
                    style={styles.imageStyle}
                    source={require('../assets/thumbs-down.png')}
                />
                <Text style={{color:"red"}}>{disLike }</Text>
                </TouchableOpacity>
            </View>
      </View>
    )

}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    subContainer: {
        flex: 1,
        fontSize: 20,
        justifyContent: "center",
        alignItems: "center",
      },
    video: {
      alignSelf: 'center',
      width: 320,
      height: 200,
    },
    likeButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    //   alignItems: 'flex-start',
      margin:20,
      padding:10,
    //   borderStyle:"solid"
    },
    disLikeButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // alignItems: 'flex-end',
        marginTop:-90,
        padding:10
      },
    imageStyle:{
        width: 20,
        height: 20,   
        alignItems: 'flex-end',          
    }
  });
export default MediaPlay






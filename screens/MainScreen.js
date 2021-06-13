import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";
import PlayVideo from './PlayVideo'
import MediaPlay from '../components/MediaPlay'

export default class MainScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      videoLinksList: [],
    };
    this.requestRef = null;
  }

  getVideoLinksList = () => {
    this.requestRef = db
      // .collection("uploaded_video_links")
      .collection("video_names")
      .onSnapshot((snapshot) => {
        var videoLinksList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          videoLinksList: videoLinksList,
        });
      });
  };

  componentDidMount() {
    this.getVideoLinksList();
  }

  componentWillUnmount() {
  this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        //linkId
        // MediaPlay
        title={<MediaPlay linkId={item} />}
        // title={<PlayVideo linkId={item} />}
        // subtitle={item.description}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="Main Screen" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.videoLinksList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Videos</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.videoLinksList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  view:{
    flex: 1,
    backgroundColor: "#fff"
  }
});

import React, { Component } from 'react';
import {
  Text,
  Alert,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';

import ModalExample from './Modal';

import io from 'socket.io-client';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import like from '../assets/like.png';
import comment from '../assets/comment.png';
import send from '../assets/send.png';

import api from "./../services/api";

export default class Feed extends Component {

  state = {
  feed: []
  };

  showModal(idPost) {
    return (
      <ModalExample />
    );    
    // Alert.alert(
    //   'Remover postagem',
    //   'Deseja remover o post?',
    //   [{
    //     text: 'cancelar',
    //     style: 'cancel'
    //   }, {
    //     text: 'remover',
    //     onPress: () => {
    //       const response = api.delete(`posts/${idPost}`);
    //       if (!response.error) {
    //         this.setState({ feed: this.state.feed.filter(post => post._id !== idPost) })
    //       }
    //     }
    //   }]
    // );
  }

  async componentDidMount() {
    this.registerToSocket();
    const response = await api.get('posts');
    this.setState({
      feed: response.data
    })
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => { navigation.navigate('New') }}>
        <Image source={camera} />
      </TouchableOpacity>
    )
  });

  registerToSocket = () => {
    const socket = io(`http://192.168.54.32:3333`);
    socket.on(`post`, newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] })
    });

    socket.on(`like`, likedPost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === likedPost._id ? likedPost : post
        )
      })
    })
  }

  handleLike = async id => {
    await api.post(`/posts/${id}/like`);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.author}</Text>
                  <Text style={styles.name}>{item.place}</Text>
                </View>

                <TouchableOpacity style={styles.moreButton} onPress={() => { this.showModal(item._id) }} >
                  <Image source={more} style={styles.more} />
                </TouchableOpacity>
              </View>

              <Image
                style={styles.feedImage}
                source={{ uri: `http://192.168.54.32:3333/files/${item.image}` }} />

              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.action} onPress={() => { this.handleLike(item._id) }}>
                    <Image source={like} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => { }}>
                    <Image source={comment} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => { }}>
                    <Image source={send} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.likes}>{item.likes} curtidas</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          )} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  feedItem: {
    marginTop: 20
  },
  feedItemHeader: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: 14,
    color: '#000'
  },
  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  moreButton: {
    padding: 5,
  },
  more: {
    transform: [{ rotate: '90deg' }]
  },
  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15
  },
  feedItemFooter: {
    paddingHorizontal: 15
  },
  actions: {
    flexDirection: 'row'
  },
  action: {
    marginRight: 8
  },
  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000'
  },
  description: {
    lineHeight: 16,
    color: '#000'
  },
  hashtags: {
    color: '#7159c1'
  }
});
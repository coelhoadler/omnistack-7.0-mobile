import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import api from '../services/api';

import ImagePicker from 'react-native-image-picker'

export default class New extends Component {
  
  state = {
    author: '',
    place: '',
    description: '',
    hashtags: '',
    preview: null,
    image: null
  }

  handleSelectImage = () => {
    ImagePicker.showImagePicker({
      title: 'Selecionar imagem',
      takePhotoButtonTitle: 'Tire uma foto...',
      chooseFromLibraryButtonTitle: 'Escolha uma foto do aparelho...'
    }, upload => {
      console.log(`upload`, upload);
      
      if (upload.error) {
        console.log('Error');
      } else if (upload.didCancel) {
        console.log('User cancelled the photo!');
      } else {
        const preview = {
          uri: `data:image/jpeg;base64,${upload.data}`,
        };

        const image = {
          uri: upload.uri,
          type: upload.type,
          name: (upload.filename) ? upload.fileName : `${new Date().getTime()}.jpg`
        };

        this.setState({ preview, image });
      }
    });
  }

  handleSubmit = async () => {
    const data = new FormData();
    data.append('image', this.state.image)
    data.append('author', this.state.author);
    data.append('place', this.state.place);
    data.append('description', this.state.description);
    data.append('hashtags', this.state.hashtags);

    await api.post('posts', data);
    this.props.navigation.navigate('Feed');
  }

  static navigationOptions = {
    headerTitle: 'Nova Publicação'
  };
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.selectButton} onPress={ this.handleSelectImage }>
          <Text style={styles.selectButtonText}>
            Selecionar Imagem
          </Text>
        </TouchableOpacity>

        { this.state.preview && <Image style={styles.preview} source={this.state.preview}></Image> }

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Nome do autor'
          placeholderTextColor='#999'
          value={this.state.author}
          onChangeText={author => this.setState({author})}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Local da foto'
          placeholderTextColor='#999'
          value={this.state.place}
          onChangeText={place => this.setState({place})}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Descricao da foto'
          placeholderTextColor='#999'
          value={this.state.description}
          onChangeText={description => this.setState({description})}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Hashtags'
          placeholderTextColor='#999'
          value={this.state.hashtags}
          onChangeText={hashtags => this.setState({hashtags})}
        />

        <TouchableOpacity style={styles.shareButton} onPress={ this.handleSubmit }>
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>                  

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  }
})

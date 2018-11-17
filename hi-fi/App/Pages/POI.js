
import React from 'react';
import {  Modal, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';

import { Images, Colors, Metrics, GooglePlacesInput } from '../Themes';


export default class POI extends React.Component {

constructor(props){
    super(props);
  }
    
state = {
            imageIndex: 0,
            isImageViewVisible: false,
    // likes go here
        };
    
static navigationOptions = ({navigation}) => {
   const poi = navigation.getParam('poi', {header: 'POI'});
   return {
        headerTitle: poi.header,
    }
  };

addToTrip = (poi) => {
    console.log(poi);
}

_toggleModal = (state) => {
    console.log(state);
    this.setState({isImageViewVisible: state})
}


render() {
      
      const { navigation } = this.props;
      const poi = navigation.getParam('poi', null);
    
      const images = poi.images.map( image => {
          const object = {
            url: image.uri,
            };             
          return object;
      });
    
      return (
         
                        
         <ScrollView>
           <Button
                    onPress={() => this.addToTrip(poi)}
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='Add to plan' style={{marginTop: 20}}/>
          
            <TouchableOpacity onPress={() => this._toggleModal(true)}>
                <Card image={poi.images[0]} >
              
                <Text style={{marginBottom: 10}}>
                    {poi.text}
                </Text>
                
                </Card> 
            </TouchableOpacity>

          <Modal visible={this.state.isImageViewVisible} transparent={true}>
            <ImageViewer imageUrls={images}
                         enableSwipeDown="true" 
                         onCancel={() => this._toggleModal(false)} saveToLocalByLongPress="false"
                         renderFooter={ () => <Text style={{color: 'white', top: -40, left: 40,}}>Swipe down to exit</Text>}
             />
           </Modal>
         </ScrollView>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

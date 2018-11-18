
import React from 'react';
import {  Modal, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';
import StarRating from 'react-native-star-rating';

import { Images, Colors, Metrics, GooglePlacesInput } from '../Themes';

export default class POI extends React.Component {

constructor(props){
    super(props);
  }
    
state = {
            imageIndex: 0,
            isModalVisible: false,
        };
    
static navigationOptions = ({navigation}) => {
   const poi = navigation.getParam('poi', {header: 'POI'});
   return {
        headerTitle: poi.header,
    }
  };

addToTrip = (poi) => {
    //console.log(poi);
}

_toggleModal = (state) => {
    this.setState({isModalVisible: state})
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
         
        <SafeAreaView styles={styles.container}>                
         <ScrollView styles={styles.scroll}>
           
          
            <View style = {styles.propContainer}>
               <View style = {styles.rateContainer}>
                    <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={3.5}
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    fullStarColor={poi.pinColor}
                    starSize={20}
                    />
                    <Text style={{fontFamily: 'Helvetica Neue'}}>/{poi.derived}</Text>
                </View>
                <Text>from trip by {poi.author} </Text>    
            </View>

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
            
            
          <Modal visible={this.state.isModalVisible} transparent={true}>
            <ImageViewer imageUrls={images}
                         enableSwipeDown="true" 
                         onCancel={() => this._toggleModal(false)} saveToLocalByLongPress="false"
                         renderFooter={ () => <Text style={{color: 'white', top: -40, left: 40,}}>Swipe down to exit</Text>}
             />
           </Modal>
         </ScrollView>
       </SafeAreaView> 
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
    scroll: {
    backgroundColor: '#fff',
  },
  propContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 30,
      marginTop: 10,
      marginLeft: 20,
      marginRight: 20,
  },
  rateContainer: {
      flexDirection: 'row',
      height: 30,
  },
  rating: {
  }
});

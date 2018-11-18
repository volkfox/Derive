
import React from 'react';
import {  Modal, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';

import { addPlanPOI, rateTrip } from '../Store/Actions';
import { Images, Colors, Metrics} from '../Themes';

class Trip extends React.Component {
    
constructor(props) {
    super(props);        
 }
    
 state = {   
    trip: this.props.navigation.getParam('trip', false),     
 }
    
static navigationOptions = ({navigation}) => {
    
   const trip = navigation.getParam('trip', {title: 'My Trip'});
   return {
        headerTitle: trip.title,
    }
};


render() {
/*
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
                    onPress={() => this.addToTrip(poi.id)}
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
            </ScrollView>
       </SafeAreaView> 
    }
    */
    return(null);
    }

}

function mapStateToProps(storeState) {
  
  return {
    allpois: storeState.allpois,
   };
}

function mapDispatchToProps(dispatch, props) {
  return {
    addPlan: (id) => dispatch(addPlanPOI(id)),
    rateTrip: (id, rating) => dispatch(rateTrip(id, rating)),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(Trip);

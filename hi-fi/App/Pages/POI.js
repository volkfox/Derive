
import React from 'react';
import {  Modal, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';

import { addPlanPOI, delPlanPOI } from '../Store/Actions';
import { Images, Colors, Metrics, GooglePlacesInput } from '../Themes';

class POI extends React.Component {

constructor(props){
    super(props);
  }

state = {
            imageIndex: 0,
            isModalVisible: false,
            plan: this.props.navigation.getParam('plan', null),
        };

static navigationOptions = ({navigation}) => {
   const poi = navigation.getParam('poi', {header: 'POI'});
   return {
        headerTitle: poi.header,
    }
  };

addToTrip = (poiID) => {
    this.props.addPlan(poiID);
}

delFromTrip = (poiID) => {
    this.props.delPlan(poiID);
}

_toggleModal = (state) => {
    this.setState({isModalVisible: state})
}

componentDidMount() {
}


render() {
      const { navigation } = this.props;

      const poi = navigation.getParam('poi', {});
      if (!Object.keys(poi).length) return null;

      const trip = this.props.alltrips.find(item => item.id === poi.tripID);
      console.log(`Trip test:`);
      console.log(trip);

      const images = poi.images.map( image => {
          const object = {
            url: image.uri,
            };
          return object;
      });

      const derived = this.props.allpois.find(item => item.id === poi.id).derived;
      const planned = this.props.plannedTrip.find(item => item.poi  === poi.id);

      return (

        <SafeAreaView styles={styles.container}>
         <ScrollView styles={styles.scroll}>


            <View style = {styles.propContainer}>

                { !this.state.plan && <TouchableOpacity onPress={() => this.props.navigation.navigate('Trip',{trip: trip, rightIcon: 'map-outline'})} >
                <Text style={{color: Colors.buttonBlue}}>from trip by {poi.author} </Text>
                </TouchableOpacity>}

                {/* disable navigation to Trip screen if called from Plan task */}
                { this.state.plan && <Text>from trip by {poi.author} </Text>}
            </View>

          { !planned && <Button
                    onPress={() => this.addToTrip(poi.id)}
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='Add to plan' style={{marginTop: 20}}/> }

            { planned && <Button
                              onPress={() => this.delFromTrip(poi.id)}
                              backgroundColor='#F44E03'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                              title='Drop from plan' style={{marginTop: 20}}/> }

            <TouchableWithoutFeedback onPress={() => this._toggleModal(true)}>

                <Card image={poi.images[0]} >


                <View style = {styles.rateContainer}>
                    <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={poi.authorRating}
                    emptyStar={'ios-heart-empty'}
                    fullStar={'ios-heart'}
                    halfStar={'ios-heart-half'}
                    iconSet={'Ionicons'}
                    fullStarColor={'lightgray'}
                    starSize={20}
                    />
                    <Text style={{fontFamily: 'Helvetica Neue'}}>/{derived}</Text>
                </View>
                <Text style={{marginBottom: 10}}>
                    {poi.text}
                </Text>

                </Card>
            </TouchableWithoutFeedback>


          <Modal visible={this.state.isModalVisible} transparent={true}>
            <ImageViewer imageUrls={images}
                         enableSwipeDown="true"
                         onCancel={() => this._toggleModal(false)} saveToLocalByLongPress="false"
                         renderIndicator={ () => <View></View>}
                         renderFooter={ () => <Text style={{color: 'white', top: -40, left: 40,}}>Swipe down to exit</Text>}
             />
           </Modal>
         </ScrollView>
       </SafeAreaView>
    );
  }

}

function mapDispatchToProps(dispatch, props) {
  return {
    addPlan: (id) => dispatch(addPlanPOI(id)),
    delPlan: (id) => dispatch(delPlanPOI(id)),
  };
}

function mapStateToProps(storeState) {
  return {
    allpois: storeState.allpois,
    plannedTrip: storeState.plannedTrip,
    alltrips: storeState.alltrips,
   };
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

export default connect(mapStateToProps, mapDispatchToProps)(POI);

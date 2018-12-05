
import React from 'react';
import {  Modal, StyleSheet, Text, View, TextInput, ScrollView, Switch, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { MapView, Marker, Polyline} from 'expo';

import { addPlanPOI, delPlanPOI, rateTrip } from '../Store/Actions';
import { Images, Colors, Metrics} from '../Themes';

class Trip extends React.Component {

constructor(props) {
    super(props);
    this.mapRef = null;
 }

 state = {
    showMap: false,
    sleepFilter: true,
    foodFilter: true,
    todoFilter: true,
    activeMarker: {},
    trip: this.props.navigation.getParam('trip', null),
 }

static navigationOptions = ({navigation}) => {

   const trip = navigation.getParam('trip', {title: 'My Trip'});
   return {
        headerTitle: trip.title,

        headerRight: <Icon
          type='material-community'
          name={navigation.getParam('rightIcon')}
          size={30}
          containerStyle={{marginRight: 5}}
          color={Colors.appleBlue}
          onPress={navigation.getParam('toggleShowMap')}
         />
    }
}

addTrip = (poiSet) => {
  poiSet.forEach( item => this.props.addPlan(item));
}

delTrip = (poiSet) => {
  poiSet.forEach( item => this.props.delPlan(item));
}

isSuperset = (set, subset)  => {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

toggleShowMap = () => {

  this.props.navigation.setParams({rightIcon: this.state.showMap?'map-outline':'format-list-bulleted'});
  this.setState((prevstate) => {return {showMap: !prevstate.showMap}});

}

sendToNav = (e) => {

      const navUrl = 'http://maps.apple.com/maps?saddr=Current%20Location&daddr='

      let coord = {};
      if (Object.keys(this.state.activeMarker).length) {
              coord = this.state.activeMarker.coordinate;
      } else {
              coord = e.nativeEvent.coordinate;
      }
      Linking.openURL(navUrl+coord.latitude+','+coord.longitude).catch(err => console.error('Could not open Apple maps', err));
  }

toggleFilter = async (key) => {

    await this.setState((prevstate) => {
    return {[key]: !prevstate[key]};
    });
}

navigateToMarker = (event) => {
        console.log(this.state.activeMarker);
        if (!this.state.activeMarker || !this.state.activeMarker.coordinate) return;

        const poi = this.props.allpois.find(marker =>
  this.state.activeMarker.coordinate.latitude === marker.coordinate.latitude &&
  this.state.activeMarker.coordinate.longitude === marker.coordinate.longitude);
        if (!poi) return;
        this.props.navigation.navigate('POI',{poi: poi})
  }

  renderNavBar = () => {
      return (

      <View style={styles.navbar}>
        <View style={styles.actiontab}>
          <Icon
            name='ios-bed'
            type='ionicon'
            onPress={() => this.toggleFilter('sleepFilter')}
            size = {40}
            underlayColor = 'transparent'
            color={this.state.sleepFilter?Colors.sleep3:'lightgray'}
          />
        <Text>sleep</Text>
       </View>

       <View style={styles.actiontab}>
         <Icon
           name='ios-restaurant'
           type='ionicon'
           onPress={() => this.toggleFilter('foodFilter')}
           size = {40}
           underlayColor = 'transparent'
           color={this.state.foodFilter?Colors.food3:'lightgray'}
         />
       <Text>eat</Text>
      </View>

      <View style={styles.actiontab}>
        <Icon
          name='ios-image'
          type='ionicon'
          onPress={() => this.toggleFilter('todoFilter')}
          size = {40}
          underlayColor = 'transparent'
          color={this.state.todoFilter?Colors.todo3:'lightgray'}
        />
      <Text>do</Text>
     </View>
     </View>
   )
  }

componentDidMount() {
  this.props.navigation.setParams({ toggleShowMap: this.toggleShowMap });
}

render() {

  const trip = this.state.trip;

  if (!trip) {
    console.log("Bummer! Empty trip passed into a trip screen")
    return (null);
  }
  //const trip = this.props.alltrips.find(item => item.id===passedTrip.id);
  //if (!trip) return (null);

  const poiSet = new Set(trip.pois);
  const pois = this.props.allpois.filter(item => poiSet.has(item.id)&&((this.state.sleepFilter && item.category==='sleep') || (this.state.foodFilter && item.category==='food') || (this.state.todoFilter && item.category==='todo')));

  const plannedSet = new Set(this.props.plannedTrip.map(item => item.poi));

  const tripAlreadyIncluded = this.isSuperset(plannedSet, poiSet);

  return (
      <SafeAreaView style={styles.container}>

       <View style={styles.switchContainer}>


          <View style = {styles.rateContainer}>
               <StarRating
               disabled={false}
               maxStars={5}
               rating={trip.communityRating}
               selectedStar={(rating) => this.props.rateTrip(trip.id, rating)}
               emptyStar={'ios-star-outline'}
               fullStar={'ios-star'}
               halfStar={'ios-star-half'}
               iconSet={'Ionicons'}
               fullStarColor={Colors.gold}
               starSize={20}
               />
             <Text style={{fontFamily: 'Helvetica Neue'}}>/{trip.derived}</Text>
           </View>
           <Text>by {trip.author} </Text>

       </View>
       {!this.state.showMap && <ScrollView style ={styles.scroll}>

            {pois.map(item => (
                     <TouchableOpacity key={item.id} onPress={() => this.props.navigation.navigate('POI',{poi: item})}  >

                       <Card image={item.images[0]} imageStyle={styles.image} imageProps={{resizeMode: 'cover'}} wrapperStyle={styles.innerBox} title={item.header}>

                       <Text style={{marginBottom: 10}}>
                           {item.text}
                       </Text>

                       </Card>
                   </TouchableOpacity>
             ))}

          { tripAlreadyIncluded && <Button
                     onPress={() => this.delTrip(poiSet)}
                     backgroundColor='#F44E03'
                     buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 20}}
                     title='Drop trip from plan' style={{marginTop: 20}} /> }

          { !tripAlreadyIncluded && <Button
                  onPress={() => this.addTrip(poiSet)}
                  backgroundColor='#03A9F4'
                  buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 20}}
                  title='Add trip to plan' style={{marginTop: 20}} /> }

        </ScrollView>
      }


      {this.state.showMap && this.renderNavBar() }

      {this.state.showMap && <MapView
          style={styles.map}
          onLongPress={this.sendToNav}
          onMarkerDeselect={ () => this.setState({activeMarker: {}})}
          ref={(ref) => { this.mapRef = ref }}
          onLayout={() => this.mapRef.fitToElements(true)}
         >

        {pois.map(marker => (
          <MapView.Marker
              mapType={"mutedStandard"}
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.header}
              description={"❤".repeat(Math.round(parseFloat(marker.authorRating)))}
              pinColor={marker.pinColor}
              onCalloutPress={e => this.navigateToMarker(e.nativeEvent)}
              onPress={e => this.setState({activeMarker: e.nativeEvent})}
              onSelect={e => this.setState({activeMarker: e.nativeEvent})}
          />
        ))}
        <MapView.Polyline
             coordinates={pois.map(item => ({latitude: item.coordinate.latitude, longitude: item.coordinate.longitude}))}
             strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
             strokeColors={pois.map(item => item.pinColor)}
             strokeWidth={2}
           />
      </MapView>
    }



       </SafeAreaView>
     )
    }
}

function mapStateToProps(storeState) {

  return {
    allpois: storeState.allpois,
    alltrips: storeState.alltrips,
    plannedTrip: storeState.plannedTrip,
   };
}

function mapDispatchToProps(dispatch, props) {
  return {
    addPlan: (id) => dispatch(addPlanPOI(id)),
    delPlan: (id) => dispatch(delPlanPOI(id)),
    rateTrip: (id, rating) => dispatch(rateTrip(id, rating)),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

rateContainer: {
    flexDirection: 'row',
    height: 30,
    marginLeft: 10,
},
switchContainer: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    height: 50,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
},
switch: {
    marginRight: 10,
},
navbar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  position: 'absolute',
  top: Metrics.screenHeight*0.7,
  width: Metrics.screenWidth,
  zIndex: 100,
  backgroundColor: Colors.glassOverlay,
},
actiontab: {
  alignItems: 'center',
},
image: {

},
innerBox: {
  width: Metrics.screenWidth*0.9,
},
map: {
  flex:1,
  alignSelf: 'stretch',
},
});


export default connect(mapStateToProps, mapDispatchToProps)(Trip);

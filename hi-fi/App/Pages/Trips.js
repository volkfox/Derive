
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Switch, Linking, FlatList, ScrollView, TouchableOpacity, Image  } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { MapView, Marker} from 'expo';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';

import { Images, Colors, Metrics } from '../Themes';

class Trips extends React.Component {
    constructor(props) {
    super(props);
}

 state = {
    geodata: {
        "description": "Stanford",
        "geometry": {
             "location": {
                 "lat": 37.42410599999999,
                  "lng": -122.1660756,
             },
            "viewport": {
                "northeast": {
                    "lat": 37.47020599999999,
                    "lng": -122.1199756,
                },
                "southwest": {
                    "lat": 37.378005999999985,
                    "lng": -122.2121756,
                },
          },
        },
   },

   markers : [],

   sleepFilter: true,
   foodFilter: true,
   todoFilter: true,
   activeMarker: {},
   showMap: this.props.navigation.getParam('startWithMap', false),
}

static navigationOptions = ({navigation}) => {

   return {
        headerTitle: 'Explore Trips',
        headerRight: <Icon
          type='material-community'
          name={navigation.getParam('rightIcon')}
          size={30}
          containerStyle={{marginRight: 5}}
          color={Colors.appleBlue}
          onPress={navigation.getParam('toggleShowMap')}
         />
    }
};



_keyExtractor = (item, index) => item.id;

_renderTrip = ({item}) => {

   const poilist = item.pois;

   return (

   <TouchableOpacity onPress={() => this.props.navigation.navigate('Trip',{trip: item, rightIcon: 'map-outline'})}>

       <View style = {styles.tripContainer}>
           <View style= {styles.rating}>
                <StarRating
                    maxStars={5}
                    disabled={true}
                    rating={item.communityRating}
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    fullStarColor={'lightgray'}
                    starSize={20}
                    />
                  <Text style={{fontFamily: 'Helvetica Neue'}}>/{item.derived} </Text>
            </View>
           <View style = {styles.tripPropertiesContainer}>

            <Text style={styles.tripTitle} numberOfLines={1}> {item.title} </Text>
            <Text numberOfLines={1}> by {item.author} </Text>

          </View>
          <View style = {styles.photoContainer}>
           {poilist.map(id => (
                    <Image style={styles.thumbnail}
                        source={this.props.allpois.find(poi => poi.id === id).images[0]}
                        key={id}
                    />
            ))}
           </View>

       </View>
    </TouchableOpacity>

   );
};

_renderSeparator = () => {
    return (
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          width: Metrics.screenwidth,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

toggleFilter = async (key) => {

  await this.setState((prevstate) => {
  return {[key]: !prevstate[key]};
  });

  this.filterMarkersByViewport(this.state.geodata.geometry.viewport);
}


navigateToMarker = (event) => {

      if (!this.state.activeMarker || !this.state.activeMarker.coordinate) return;
      const poi = this.state.markers.find(marker =>
this.state.activeMarker.coordinate.latitude === marker.coordinate.latitude &&
this.state.activeMarker.coordinate.longitude === marker.coordinate.longitude);
      if (!poi) return;
      this.props.navigation.navigate('POI',{poi: poi})
}

updateViewport = (region) => {

    const geo = {location:
                    {lat: region.latitude,
                     lng: region.longitude},
                 viewport:
                   {northeast:
                        {lat: region.latitude+region.latitudeDelta/2,
                         lng:region.longitude+region.longitudeDelta/2},
                    southwest:
                        {lat: region.latitude-region.latitudeDelta/2,
                        lng:region.longitude-region.longitudeDelta/2}
                    }
            };

  this.setState({geodata: {geometry: geo}});
  this.filterMarkersByViewport(geo.viewport);
}

filterMarkersByViewport = (vp) => {
   const markers = this.props.allpois.filter(
       poi =>
       poi.coordinate.latitude > vp.southwest.lat &&
       poi.coordinate.latitude < vp.northeast.lat &&
       poi.coordinate.longitude > vp.southwest.lng &&
       poi.coordinate.longitude < vp.northeast.lng &&
    ((this.state.sleepFilter && poi.category==='sleep') || (this.state.foodFilter && poi.category==='food') || (this.state.todoFilter && poi.category==='todo'))
   );
   this.setState({markers: markers});
}

toggleShowMap = () => {

   this.props.navigation.setParams({rightIcon: this.state.showMap?'map-outline':'format-list-bulleted'});
   this.setState((prevstate) => {return {showMap: !prevstate.showMap}});

}



// logic: if there is an active marker double clicking always sends to marker position
// otherwise navigate to the clicked point in the map

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


componentDidMount() {
    const geodata = this.props.navigation.getParam('geodata');
    // title change to search param - not sure why does not work
    //this.props.navigation.setParams({headerTitle: geodata.description});

    // need to create markers even if starting with a list to find matching trips
    this.filterMarkersByViewport(geodata.geometry.viewport);
    this.setState({geodata: geodata});

    this.props.navigation.setParams({ toggleShowMap: this.toggleShowMap });
}

  render() {
      const {location, viewport} = this.state.geodata.geometry;


      // find active trips for the viewport
      const trips = [];
      this.state.markers.forEach(marker => trips.push(marker.tripID));
      const uniqueTrips = new Set(trips);

      const activeTrips = this.props.alltrips.filter(trip => uniqueTrips.has(trip.id));

      // render map view
      if (this.state.showMap)
      return (

        <SafeAreaView style={styles.container}>

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

        <MapView
            style={styles.map}
            onLongPress={this.sendToNav}
            onMarkerDeselect={e => this.setState({activeMarker: {}})}
            onRegionChangeComplete={this.updateViewport}
            region={{
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: viewport.northeast.lat-viewport.southwest.lat,
            longitudeDelta: viewport.northeast.lng-viewport.southwest.lng,
            }}
           >

          {this.state.markers.map(marker => (
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
        </MapView>

        </SafeAreaView>
      );

       const triplist = <FlatList
                            data={activeTrips}
                            extraData={this.state.markers}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderTrip}
                            ItemSeparatorComponent={this._renderSeparator}
                         />

       const nodata = <View style = {styles.bummer}>
           <Text> Bummer! No trips in this area. </Text>
        </View>
       // render list view
       if (!this.state.showMap) return (

         <SafeAreaView style={styles.container}>

           { activeTrips.length ? triplist : nodata }

          </SafeAreaView>
      );
    }
}

function mapStateToProps(storeState) {

  return {
    allpois: storeState.allpois,
    alltrips: storeState.alltrips,
   };
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      backgroundColor: '#fff',
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      position: 'absolute',
      top: Metrics.screenHeight*0.7,
      alignSelf: 'stretch',
      width: Metrics.screenWidth,
      zIndex: 100,
      backgroundColor: Colors.glassOverlay,
    },
    actiontab: {
      alignItems: 'center',
    },
    switch: {
        alignSelf: 'flex-end',
        position: 'relative',
        top: 10,
        left: -10,
    },
    thumbnail: {
        height: Metrics.screenWidth/5,
        width: Metrics.screenWidth/5,
        resizeMode: 'cover',
        margin: 4,
    },
    trips: {

    },
    tripTitle: {
        fontWeight: 'bold',
        maxWidth: 200,
    },
    tripContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 20,
        marginBottom: 20,
    },
    photoContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tripPropertiesContainer: {
        flexDirection: 'row',
    },
    bummer: {
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    rating: {
        marginLeft: 5,
        width: 120,
        flexDirection: 'row',
    },
    map: {

    ...StyleSheet.absoluteFillObject,
    top: 0,

    },
});

export default connect(mapStateToProps)(Trips);

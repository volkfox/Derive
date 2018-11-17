
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Switch, Linking  } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { MapView, Marker} from 'expo';
import { connect } from 'react-redux';

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
   allpois: [],
     
   sleepFilter: true,
   foodFilter: true,
   todoFilter: true,
   activeMarker: {},
   showMap: this.props.navigation.getParam('startWithMap', false),
}

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

toggleShowMap = () => 
  this.setState((prevstate) => {return {showMap: !prevstate.showMap}});
   
static navigationOptions = ({navigation}) => {
   return {
        headerTitle: 'Explore Trips',
    }
};

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
    this.setState({geodata: geodata});  
}

  render() {
      const {location, viewport} = this.state.geodata.geometry;

      //console.log("render filtered markers:"+this.state.markers.length);
      
      if (this.state.showMap)
      return (

        <SafeAreaView style={styles.container}>

          <Switch style={styles.switch}
            onValueChange = {this.toggleShowMap}
            value = {this.state.showMap}/>
          
   
          <View style={styles.navbar}>
          <Icon
            name='ios-bed' 
            type='ionicon'
            onPress={() => this.toggleFilter('sleepFilter')}
            size = {40} 
            underlayColor = 'transparent'
            color={this.state.sleepFilter?'black':'lightgray'} 
          />
          <Icon
            name='ios-restaurant' 
            type='ionicon'
            onPress={() => this.toggleFilter('foodFilter')}
            size = {40} 
            underlayColor = 'transparent'
            color={this.state.foodFilter?'black':'lightgray'}
          />
          <Icon
            name='ios-image' 
            type='ionicon'
            onPress={() => this.toggleFilter('todoFilter')}
            size = {40} 
            underlayColor = 'transparent'
            color={this.state.todoFilter?'black':'lightgray'} 
          />
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
                key={parseInt(marker.id)}
                coordinate={marker.coordinate}
                title={marker.header}
                description={marker.text}
                pinColor={marker.pinColor}
                onCalloutPress={e => this.navigateToMarker(e.nativeEvent)}
                onPress={e => this.setState({activeMarker: e.nativeEvent})}
                
            />
          ))}
        </MapView>
        
        </SafeAreaView>
      ); 

       if (!this.state.showMap) return (
         <SafeAreaView style={styles.container}>

          <Switch style={styles.switch}
            onValueChange = {this.toggleShowMap}
            value = {this.state.showMap}/>
          </SafeAreaView>
      );
    }
}

function mapStateToProps(storeState) {
  
  //console.log(storeState.allpois);
  return {
    allpois: storeState.allpois,
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
    position: 'relative',
    top: Metrics.screenHeight*0.75,
    zIndex: 100,
    },
    switch: {
        alignSelf: 'flex-end',
        position: 'relative',
        top: 10,
        left: -10,
    },
    map: {
     
    ...StyleSheet.absoluteFillObject,
    top: 50,
    
    },
});

export default connect(mapStateToProps)(Trips);
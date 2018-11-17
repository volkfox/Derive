
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView  } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { MapView, Marker} from 'expo';
import Icon from 'react-native-vector-icons/Feather';
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
     
   pFilters: {
       sleep: true,
       food: true,
       todo: true,
   }
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

   console.log("vp:");
   console.log(vp);
    
   const markers = this.props.allpois.filter(
       poi => 
       poi.coordinate.latitude > vp.southwest.lat && 
       poi.coordinate.latitude < vp.northeast.lat &&           
       poi.coordinate.longitude > vp.southwest.lng &&   
       poi.coordinate.longitude < vp.northeast.lng &&
    ((this.state.pFilters.sleep && poi.category==='sleep') || (this.state.pFilters.food && poi.category==='food') || (this.state.pFilters.todo && poi.category==='todo')));
   
   
   this.setState({markers: markers});
}
   
/* static navigationOptions = ({navigation}) => {
   return {
        headerTitle: 'Explore Trips',
    }
  };
  */
                
componentDidMount() {
    const geodata = this.props.navigation.getParam('geodata');
    //this.props.navigation.setParams({headerTitle: geodata.description});
    // deferred - not sure why does not work
    this.setState({geodata: geodata});  
}

  render() {
      const {viewport} = this.state.geodata.geometry;
      const {location} = this.state.geodata.geometry;
      //const {title} = this.state.geodata.description;
      
      console.log("render filtered markers:"+this.state.markers.length);
      
      return (
        <SafeAreaView style={styles.container}>

        <MapView
            style={styles.map}
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
                key={parseInt(marker.id)}
                coordinate={marker.coordinate}
                title={marker.header}
                description={marker.text}
                onCalloutPress={e => console.log(e.nativeEvent)}
                onPress={e => console.log(e.nativeEvent)}
            />
          ))}
        </MapView>

        <View>
          <Button
        title='to POI'
          onPress={ () => this.props.navigation.navigate('POI')}/>
        </View>

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
    alignItems: 'center',
    backgroundColor: '#fff',
  },
    map: {
     
    ...StyleSheet.absoluteFillObject,
    top: 50,
  },
});

export default connect(mapStateToProps)(Trips);
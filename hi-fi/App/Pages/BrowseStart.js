// Main Search Screen
import React from 'react';
import { StyleSheet, Text, View, Image, Button, TextInput, AsyncStorage, SafeAreaView, Keyboard, TouchableWithoutFeedback,TouchableHighlight,  TouchableOpacity, FlatList, ScrollView } from 'react-native';
import {List, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import { DrawerActions } from 'react-navigation';
import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { Images, Colors, Metrics } from '../Themes';
import GooglePlacesInput from '../Themes/GooglePlacesInput';

class BrowseStart extends React.Component {
  constructor(props) {
    super(props);
}

state = {
    location : {
        "lat": 37.42410599999999,
        "lng": -122.1660756,
        },
        searchText: '',
        inputTextColor: 'black', 
 }
 
static navigationOptions = ({navigation}) => {
    
    return {
        headerLeft: 
            <Icon  
                name="menu" 
                size={30} 
                color="gray"
                onPress={ () => 
                         navigation.dispatch(DrawerActions.toggleDrawer())}   
            />,
    }
};

_textStyle = function(options) {
   return {
     color: this.state.inputTextColor
   }
}

runSearch = (data, details) => {
    
    Keyboard.dismiss();

    if (!details.geometry.viewport) {
        details.geometry.viewport = {
            northeast: {lat: details.geometry.location.lat+0.01,
                       lng: details.geometry.location.lng+0.01 },
            southwest: {lat: details.geometry.location.lat-0.01,
                       lng: details.geometry.location.lng-0.01}
        }
    }
    const description = details.description?details.description:details.formatted_address;
    
    let startWithMap =  false;
    if (description == 'Current Location') startWithMap = true;
    // need push here?
    this.props.navigation.navigate('Trips',{geodata: {geometry: details.geometry, description: description}, startWithMap: startWithMap});
}

_keyExtractor = (item, index) => item.id;


_renderItem = ({item}) => {
   return (

   <TouchableOpacity style={styles.highlight} onPress={() => this.props.navigation.navigate('POI',{poi: item})}>
        <Image style={styles.thumbnail} 
            source={item.images[0]}
        />
    </TouchableOpacity>

   );

};


_renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: 5,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                    }
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
}

render() {
      
      const {allpois} = this.props;
      
    
      return (
          
        <SafeAreaView style={styles.container}>
          
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          
          
          <View style={styles.searchSection}>   
            
           <GooglePlacesInput searchCallBack = {this.runSearch} location={this.state.location}/>

          </View> 
          </TouchableWithoutFeedback>

          <View style={styles.teaser}>

                <FlatList 
                    data={allpois}
                    extraData={allpois}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    horizontal={true}
                    ItemSeparatorComponent={this._renderSeparator}
                    getItemLayout={(data, index) => (
                    {length: 100, offset: 100 * index, index}
  )}
                />
         </View>
      
      </SafeAreaView>
      );

    }
  }

function mapStateToProps(storeState) {
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
    
  searchIcon: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
    
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: Metrics.screenHeight*0.1,
},
  searchField: {
        height: 50,
        borderColor: 'transparent', 
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'rgb(240,240,240)',
        fontSize: 15,
        paddingTop: 0,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        color: '#424242',
        width: Metrics.screenWidth*0.55,
  },
    teaser: {
        flex: 1,
        height: 100,
    },
    thumbnail: {
        flex:1,
        height: 100,
        width: 100,
        resizeMode: 'cover',
    },
    textStyle: {
    transform: [{ rotate: '90deg'}]
},
    highlight: {
        height: 100,
        width: 100,
        backgroundColor: '#DDDDDD',
    },
});

export default connect(mapStateToProps)(BrowseStart);

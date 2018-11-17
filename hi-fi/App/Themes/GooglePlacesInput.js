import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Images, Colors, Metrics } from '../Themes';

export default function GooglePlacesInput(props) {
    
  const homePlace = { description: 'Stanford', geometry: { location: { lat: 37.42410599999999, lng: -122.1660756 } }};
  const currentPlace = { description: 'Current Location', geometry: {location: props.location}}
  
  return (
    <GooglePlacesAutocomplete
      placeholder='Try San Francisco'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'}  // software IOS keyboard button
      listViewDisplayed='auto'  // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={ (data, details=null) => props.searchCallBack(data, details) }
      
      getDefaultValue={() => ''}
      
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyA2wTXGcvjHgIgQRWc0at7uPn7_2Vc80Sw',
        language: 'en', // language of the results
        //types: '(cities)' // default: 'geocode'
      }}
      
      styles={styles}
      
      currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        types: 'food'
      }}

      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      predefinedPlaces={[currentPlace, homePlace, ]}

      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      //renderLeftButton={() => <Text>Custom text after the input</Text>
      //renderRightButton={() => <Text>Custom text after the input</Text>}
    />
   );
}

const styles = StyleSheet.create({
  textInputContainer: {
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth:0,
            marginLeft: 20,
            marginBottom: 5,
            paddingBottom: 5,
            width: Metrics.screenWidth*0.85,
        },
        description: {
          fontWeight: 'bold',
            fontSize: 10,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
          fontSize: 15,
        },
        row: {
           margin: 0,
        },
        textInput: {
            height: 50,
            borderColor: 'transparent', 
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: 'rgb(240,240,240)',
            fontSize: 15,
            paddingTop: 10,
            paddingRight: 10,
            marginBottom: 10,
            paddingLeft: 10,
            color: '#424242',
            width: Metrics.screenWidth*0.55,  
        },
        listView: {
                marginTop: 10,
                paddingTop: 2,
                paddingLeft: 20,
                paddingRight: 10,
                paddingBottom: 2,
                width: Metrics.screenWidth*0.95,
        },
        separator: {
            borderColor: '#1faadb',
        },
        poweredContainer: {
            height: 0,
            width: 0,
        },
        powered: {
            height: 0,
            width: 0,
        },
    
});


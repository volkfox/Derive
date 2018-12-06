
import React from 'react';
import {  CameraRoll, StyleSheet, Text, View, Button, TextInput, Image, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, SafeAreaView} from 'react-native';
import { Images, Colors, Metrics } from '../Themes';
import { DrawerActions } from 'react-navigation-drawer';
import { Icon, Card } from 'react-native-elements';
import { ImagePicker, Permissions, Svg  } from 'expo';
import StarRating from 'react-native-star-rating';
import Dialog, { DialogContent, DialogButton, DialogTitle } from 'react-native-popup-dialog';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MapView, Marker, Polyline} from 'expo';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import { addReport, addDraftPOI } from '../Store/Actions';


 class Generation extends React.Component {


  constructor(props) {
        super(props);
        this.mapRef = null;
        this.note = '';
        this.props.navigation.setParams({ title: this.state.title });
        this.props.navigation.setParams({ setTitle: this.setTitle });

        this.props.navigation.setParams({ submitPOI: this.submitPOI});
        this.props.navigation.setParams({ submitTrip: this.submitTrip});
        this.props.navigation.setParams({ hideMap: this.hideMap});

        this.loading = false;
        this.cursor = null;
  }


state = {

      author: 'James Landay',
      title: 'New Trip',
      titleDialogVisible: false,
      titleText: '',
      showMap: false,
      roll: [],
      showCarousel: true,

      header: '',
      id: null,
      authorRating: 0,
      category: 'todo',
      derived: 0,
      lat: Metrics.StanfordLat,
      lng: Metrics.StanfordLng,
      image: null,
      note: '',
      text: '',
};


resetState = () => {
  this.setState({header: '', text: '', note: '', id: null, authorRating: 0, category: 'todo', derived: 0,
  lat: Metrics.StanfordLat, lng: Metrics.StanfordLng, image: null, showCarousel: true });

}

copyState = (poi) => {
  this.setState(poi);
  this.setState({note: poi.header+'\n\n'+poi.text});
  this.setState({image: poi.images[0]});
  this.setState({lat: poi.coordinate.latitude, lng: poi.coordinate.longitude});
  this.setState({showCarousel: false});
}

static navigationOptions = ({navigation}) => {
return {
        headerTitle: <TouchableOpacity onPress={navigation.getParam('setTitle')}>
         <Text style={{fontWeight: '600'}}>{navigation.getParam('title','Untitled')}</Text>
        </TouchableOpacity>,
        headerLeft: <Icon
                name={navigation.getParam('leftIcon', 'ios-menu')}
                type='ionicon'
                size={30}
                containerStyle={{marginLeft: 5}}
                color={(navigation.getParam('leftIcon', 'ios-menu')==='ios-menu')?"gray":Colors.appleBlue}
                onPress={ () => {
                         const icon = navigation.getParam('leftIcon', 'ios-menu');
                         const hider = navigation.getParam('hideMap', null);
                         (icon === 'ios-menu')?
                          navigation.dispatch(DrawerActions.toggleDrawer()):hider();
                       }
                }
            />,
          headerRight:
            <View style={styles.iconContainer}>
                  <Icon
                    name="ios-add"
                    type='ionicon'
                    size={30}
                    iconStyle={styles.shareIcon}
                    color={Colors.appleBlue}
                    onPress={ navigation.getParam('submitPOI')}
                    />

                    <Icon
                          name="ios-arrow-dropright"
                          type='ionicon'
                          size={30}
                          iconStyle={styles.shareIcon}
                          color={Colors.appleBlue}
                          onPress={ navigation.getParam('submitTrip')}
                          />
                      </View>,
    }
};

_processImage = (result) => {
  if (!result.cancelled) {

    if (result.exif) {
          let {GPSLatitude, GPSLongitude} = result.exif;
          if (GPSLatitude && GPSLongitude) {
              if (result.exif.GPSLatitudeRef === 'S') GPSLatitude = -GPSLatitude;
              if (result.exif.GPSLongitudeRef === 'W') GPSLongitude = -GPSLongitude;
              this.setState({lat: GPSLatitude, lng: GPSLongitude});
          }
    }
      this.setState({ image: {uri: result.uri}});
  }
}

_pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      exif: true,
      aspect: [16, 9],
    });

    this._processImage(result);
}



_checkCameraPermissions = async  () => {

  const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status !== 'granted') {
    alert('Hey! We need camera roll permissions');
  }
}

validGPS =  () => {
 return !(this.state.lat === Metrics.StanfordLat && this.state.lng === Metrics.StanfordLng);
}

submitPOI = (e, copyOver) => {

  this.hideMap();

  if (!this.validGPS()) {

       !copyOver && Alert.alert(
           '',
           'Select location-enabled image or 📌',
           [
             {text: 'OK', onPress: () => {}},
           ],
           { cancelable: false }
         );
     return;
   }

   if (!this.state.header) {

     !copyOver && Alert.alert(
           '',
           'Please fill the title line',
           [
             //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: () => console.log('Missing title acknowledged')},
           ],
           { cancelable: false }
         );

     return;
   }
   const pinColorName = this.state.category+this.state.authorRating;
   const poi = {id: this.state.id?this.state.id:shortid.generate(), category: this.state.category, header: this.state.header, text: this.state.text, images: [this.state.image], coordinate: {latitude: this.state.lat, longitude: this.state.lng}, authorRating: this.state.authorRating,
     pinColor: Colors[pinColorName], derived: 0, author: this.state.author, };

   // 1. clear the current poi record
   this.resetState();
   // 2. save to redux
   this.props.upsert(poi);
}

// refactored to lead into another screen

submitTrip = () => {

   this.hideMap();

   if (!this.props.draftpois.length) {
     Alert.alert(
           '',
           'Please add at least one point of interest',
           [
             //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: () => console.log('Missing POI in trip submission')},
           ],
           { cancelable: false }
         );
     return;
   }

   if (this.state.title === 'New Trip') {
     Alert.alert(
           '',
           'Please name this trip',
           [
             {text: 'OK', onPress: () => console.log('Missing trip title in submission')},
           ],
           { cancelable: false }
         );
     return;
   }

   this.props.navigation.navigate('MyTrip', {title: this.state.title, author: this.state.author, reset: this.clearSelectors});
}

clearSelectors = () => {
  this.resetState();
  this.props.navigation.setParams({ title: 'New Trip'})
}

setTitle = () => {
  this.setState({ titleDialogVisible: true });
}

showMap = () => {
  this.props.navigation.setParams({leftIcon: 'ios-arrow-back'});
  this.setState({showMap: true});

}

hideMap = () => {
  this.props.navigation.setParams({leftIcon: 'ios-menu'});
  this.setState({showMap: false});

}

saveTitle = () => {


    // empty title or no change
    if (!this.state.titleText.length) {
        this.setState({titleDialogVisible: false});
        return;
    }

    // change but too small
    if (this.state.titleText.length < 5) {
      Alert.alert(
            '',
            'Please enter trip name longer than 5 characters',
            [
              {text: 'OK', onPress: () => console.log('Insufficient trip name length')},
            ],
            { cancelable: false }
            )
      return;
    }

    // good title here
    this.setState({title: this.state.titleText, titleDialogVisible: false});
    this.props.navigation.setParams({ title: this.state.titleText})
}

parseNote = (note) => {
    // empty input
    if (!note.length) return;
    const body = note.split('\n');

    // single line - assume a header
    if (body.length < 2) {
      this.setState({header: note, text: ''});
      return;
    }
    // else multiline case
    const header = body[0];
    body.shift();
    const text = body.join('');
    this.setState({header: header, text: text});
    this.note='';
}

getNextImages = () => {
      if (!this.cursor) return;
        this.getRollImages(this.cursor);
}

getRollImages = async (after) => {

    if (this.loading) return;
    this.loading = true;
    const results = await CameraRoll.getPhotos({ first: 20, after,});
    const { edges, page_info: { has_next_page, end_cursor } } = results;
    const loadedImages = edges.map(item => item.node);

    this.setState( {
        roll: this.state.roll.concat(loadedImages), },
        () => {
            this.loading = false;
            this.cursor = has_next_page ? end_cursor : null;
          }, );
}

componentDidMount() {
  this._checkCameraPermissions();
  this.resetState();
  this.getRollImages();
}


_renderRollItem = ({item, index}) => {

        return (
            <View style={styles.slide}>
                <Image source={item.image}
                  style={styles.cardImage}
                  backgroundColor='black'
                />
            </View>
        );
}

_activeEntry = (index) => {

     const active = this.state.roll[index];
     if (!active) return;

     if (active.location) {
           let {latitude, longitude} = active.location;
           if (latitude && longitude) {
               this.setState({lat: latitude, lng: longitude});
           }
     }
    this.setState({ image: {uri: active.image.uri}});
}


render() {

  let { image } = this.state;
  const pinColorName = this.state.category+this.state.authorRating;

  return (

 <SafeAreaView style={styles.container}>

      <Dialog
          visible={this.state.titleDialogVisible}
          onTouchOutside={() => {
            this.setState({ titleDialogVisible: false });
          }}
          actions={[
            <DialogButton
              text="OK"
              key = "0"
              onPress={() => {this.saveTitle(); }}
            />,
              <DialogButton
                text="CANCEL"
                key = "1"
                onPress={() => {this.setState({ titleDialogVisible: false });}}
              />,
          ]}
          dialogStyle={styles.dialog} >

          <DialogContent>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, padding: 5}}
              autoCorrect={false}
              defaultValue = {this.state.title}
              onChangeText={(text) => this.setState({titleText: text})}
              clearButtonMode = 'unless-editing'
              maxLength = {50}
            />
          </DialogContent>
      </Dialog>


    {!this.state.showMap && <ScrollView style={styles.scroller} ref={component => { this.myScrollView = component; }}>
      <Card style={styles.card} wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
          {!this.state.showCarousel && <TouchableOpacity onPress={this._pickImage}>
            <Image source={this.state.image} style={styles.cardImage} />
          </TouchableOpacity> }

          {this.state.showCarousel && <View style={{opacity: this.state.image?1.0:0.2,}}>
            <Carousel
                      ref={(c) => { this._carousel = c; }}
                      data={this.state.roll}
                      renderItem={this._renderRollItem}
                      sliderWidth={Metrics.screenWidth*0.9}
                      itemWidth={Metrics.screenWidth*0.9}
                      onSnapToItem={this._activeEntry}
                      onEndReached={this.getNextImages}
             />
         </View>}

         <View style={styles.propBox}>

              <View style={styles.actiontab}>
                <Icon
                  name='ios-bed'
                  type='ionicon'color={this.state.category==='sleep'?Colors.sleep3:'lightgray'}
                  onPress={() => this.setState({category: 'sleep'})}
                  size = {40}
                  underlayColor = 'transparent'
                  color={this.state.category==='sleep'?Colors.sleep3:'lightgray'}
                />
              <Text>sleep</Text>
             </View>

             <View style={styles.actiontab}>
               <Icon
                 name='ios-restaurant'
                 type='ionicon'
                 onPress={() => this.setState({category: 'food'})}
                 size = {40}
                 underlayColor = 'transparent'
                 color={this.state.category==='food'?Colors.food3:'lightgray'}
               />
             <Text>eat</Text>
            </View>

            <View style={styles.actiontab}>
              <Icon
                name='ios-image'
                type='ionicon'
                onPress={() => this.setState({category: 'todo'})}
                size = {40}
                underlayColor = 'transparent'
                color={this.state.category==='todo'?Colors.todo3:'lightgray'}
              />
              <Text>do</Text>
           </View>

            <Icon style={styles.gpsfixed}
              name='pin'
              type='octicon'
              size={20}
              iconStyle={styles.icon}
              color={this.validGPS()?Colors.appleBlue:'red'}
              onPress={ this.showMap }
              />
        </View>

              <KeyboardAvoidingView style={{ height: 500, justifyContent: "flex-start" }}>
                  <TextInput
                    placeholder={'Title \n \n Say more about this place'}
                    editable = {true}
                    defaultValue = {this.state.note}
                    value = {this.state.note}
                    onChangeText={(text) => this.setState({note: text})}
                    multiline = {true}
                    numberOfLines = {10}
                    style = {styles.textInput}
                    onFocus={() => this.myScrollView.scrollTo({ x: 0, y: Metrics.screenWidth*.9, animated: true })}
                    onBlur = { () => {
                      this.parseNote(this.state.note);
                      this.myScrollView.scrollTo({ x: 0, y: 0, animated: true });
                      }
                    }
                  />
                <View style={{ height: 300 }} />
              </KeyboardAvoidingView>
            </Card>
    </ScrollView>
    }

    {this.state.showMap &&

        <MapView
          style={styles.map}
          ref={(ref) => { this.mapRef = ref }}
          onLayout={() => this.mapRef.fitToCoordinates([{latitude: this.state.lat, longitude: this.state.lng}])}
          mapType={"mutedStandard"}

         >

          <MapView.Marker
              coordinate={{latitude: this.state.lat, longitude: this.state.lng}}
              title={this.state.header?this.state.header:"Untitled"}
              description={"Drag me to image location"}
              pinColor={'red'}
              draggable={true}
              onDragEnd = { (e) => this.setState({lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude}) }
          />

        {this.props.draftpois.map(marker => (
            <MapView.Marker
                mapType={"mutedStandard"}
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.header}
                description={"❤".repeat(Math.round(parseFloat(marker.authorRating)))}
                pinColor={marker.pinColor}
            />
          ))}
          <MapView.Polyline
               coordinates={this.props.draftpois.map(item => ({latitude: item.coordinate.latitude, longitude: item.coordinate.longitude}))}
               strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
               strokeColors={['red',...this.props.draftpois.map(item => item.pinColor)]}
               strokeWidth={2}
             />

        </MapView>

  }


  {!this.state.showMap &&

     <ScrollView style={styles.exposeRibbon} contentContainerStyle={styles.exposeContainer} horizontal='true'>

       {this.props.draftpois.map(poi => (
          <TouchableOpacity key={poi.id} onPress={() =>  {this.submitPOI(true, true); this.copyState(poi)}}>
               <Image
                 style={{width: 66, height: 58, margin: 10}}
                 source={poi.images[0]}
               />
          </TouchableOpacity>
       ))}

     </ScrollView>
  }

  </SafeAreaView>

  ); // end return()

  } // end render{}
} // end class

const shortid = require('shortid');

function mapStateToProps(storeState) {
  return {
    draftpois: storeState.draftpois,
   };
}

function mapDispatchToProps(dispatch, props) {
  return {
    publish: (poiList, trip) => dispatch(addReport(poiList, trip)),
    upsert: (poi) => dispatch(addDraftPOI(poi)),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroller: {
  },
  card: {
    width: Metrics.screenWidth*0.9,
  },
  slide: {
    width: Metrics.screenWidth*0.9,
    height: Metrics.screenWidth*0.9,
  },
  cardImage: {
    marginTop: 20,
    width: Metrics.screenWidth*0.9,
    height: Metrics.screenWidth*0.9,
  },
  cardWrapper: {
    padding: 0,
  },
  cardContainer: {
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
  },

  propBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  dialog: {
    width: Metrics.screenWidth*0.8,
  },
  textContainer: {
    height: Metrics.screenHeight*0.7,
  },
  textInput: {
      flex:1,
      backgroundColor: 'beige',
      alignSelf: 'stretch',
      marginTop: 10,
      marginBottom: 0,
      marginRight: 30,
      paddingLeft: 5,
      paddingRight: 5,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  shareIcon: {
    marginLeft: 20,
    marginRight: 5,
  },
  map: {
    flex:1,
    alignSelf: 'stretch',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    position: 'absolute',
    alignSelf: 'stretch',
    top: Metrics.screenHeight*0.8,
    width: Metrics.screenWidth,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actiontab: {
    alignItems: 'center'
  },

  gpsfixed: {
  },
  exposeRibbon: {
    position: 'absolute',
    alignSelf: 'stretch',
    top: Metrics.screenHeight*0.7,
    width: Metrics.screenWidth,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  exposeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  expose: {
    position: 'absolute',
    width: Metrics.screenWidth,
    top: Metrics.screenHeight*0.7,
    zIndex: 120,
  },
  backIcon:
  {

  },
});

  export default connect(mapStateToProps, mapDispatchToProps)(Generation);


import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native';
import { Images, Colors, Metrics } from '../Themes';
import { DrawerActions } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';
import StarRating from 'react-native-star-rating';
import Dialog, { DialogContent, DialogButton, DialogTitle } from 'react-native-popup-dialog';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';

import { addReport } from '../Store/Actions';

 class Generation extends React.Component {


  constructor(props) {
        super(props);
        this.mapRef = null;
        this.note = '';
        this.pois = [this.state,];
        this.props.navigation.setParams({ title: this.state.title });
        this.props.navigation.setParams({ setTitle: this.setTitle });
        this.props.navigation.setParams({ addPOI: this.addPOI})
        this.props.navigation.setParams({ submitTrip: this.submitTrip})
  }



state = {
      header: '',
      image: {uri: 'http://hdimages.org/wp-content/uploads/2017/03/placeholder-image4-768x432.jpg'},
      lat: 37.42410599999999,
      lng: -122.1660756,
      author: 'Joe Appleseed',
      authorRating: 0,
      text: '',
      category: 'sleep',
      title: 'New report',

      titleDialogVisible: false,
      titleText: '',
      showMap: false,
      pois: [],
};



static navigationOptions = ({navigation}) => {
return {
        headerTitle: <TouchableOpacity onPress={navigation.getParam('setTitle')}>
         <Text style={{fontWeight: '600'}}>{navigation.getParam('title','Untitled')}</Text>
        </TouchableOpacity>,
        headerLeft:
            <Icon
                name="menu"
                size={30}
                color="gray"
                onPress={ () =>
                         navigation.dispatch(DrawerActions.toggleDrawer())}
            />,
          headerRight: (
            <View style={styles.iconContainer} >
              <Icon
                name="ios-add"
                type='ionicon'
                size={30}
                iconStyle={styles.icon}
                color={Colors.appleBlue}
                onPress={ navigation.getParam('addPOI')}
                />
              <Icon
                    name="ios-share"
                    type='ionicon'
                    size={30}
                    iconStyle={styles.icon}
                    color={Colors.appleBlue}
                    onPress={ navigation.getParam('submitTrip')}
                    />
            </View>)
    }
};

_pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      exif: true,
      aspect: [16, 9],
    });

    if (!result.cancelled && result.exif) {
      let {GPSLatitude, GPSLongitude} = result.exif;
      if (GPSLatitude && GPSLongitude) {
          if (result.exif.GPSLatitudeRef === 'S') GPSLatitude = -GPSLatitude;
          if (result.exif.GPSLongitudeRef === 'W') GPSLongitude = -GPSLongitude;
          this.setState({ image: {uri: result.uri}, lat: GPSLatitude, lng: GPSLongitude});
      }

    } else {
      this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    }
}

validGPS =  () => !(this.state.lat === 37.42410599999999 && this.state.lng === -122.1660756);

_checkCameraPermissions = async  () => {

  const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status !== 'granted') {
    alert('Hey! We need camera roll permissions');
  }
}

addPOI = () => {


   if (!this.validGPS()) {
     Alert.alert(
           '',
           'Please add an image with GPS or tag it on the map',
           [
             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: () => console.log('OK Pressed')},
           ],
           { cancelable: false }
         );
     return;
   }

   if (!this.state.header) {
     Alert.alert(
           '',
           'Please fill the first line in description',
           [
             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: () => console.log('OK Pressed')},
           ],
           { cancelable: false }
         );
     return;
   }
   const pinColorName = this.state.category+this.state.rating;
   const poi = {header: this.state.header, text: this.state.text, authorRating: this.state.rating, images: [this.state.image],
     author: this.state.author, category: this.state.category, derived: 0, pinColor: Colors[pinColorName], id: 0};
   poi.id = shortid.generate();

   this.setState({pois: [poi,...this.state.pois]});
   console.log([poi,...this.state.pois]);

   // clear up.
}

submitTrip = () => {

   if (!this.pois.length) {
     Alert.alert(
           '',
           'Please add at least one point of interest',
           [
             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: () => console.log('OK Pressed')},
           ],
           { cancelable: false }
         );
     return;
   }

   if (this.state.title === 'New report') {
     Alert.alert(
           '',
           'Please name this report',
           [
             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: () => console.log('OK Pressed')},
           ],
           { cancelable: false }
         );
     return;
   }

   const poiList = this.state.pois.map(poi => poi.id);
   const trip = {id: shortid.generate(), author: this.state.author, date: {}, title: this.state.title, pois: poiList, communityRating: 0, derived: 0,}
   this.props.publish(this.state.pois, trip);

   // clean up the current and draftpois
}

setTitle = () => {
  this.setState({ titleDialogVisible: true });
}

saveTitle = () => {
    console.log(`text: ${this.state.titleText}`)

    // empty title or no change
    if (!this.state.titleText.length) {
        this.setState({titleDialogVisible: false});
        return;
    }

    // change but too small
    if (this.state.titleText.length < 5) {
      Alert.alert(
            '',
            'Please enter report name longer than 5 characters',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
            )
      return;
    }

    // good
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

componentDidMount() {
  this._checkCameraPermissions();

  //this._pickImage();
}


render() {

  let { image } = this.state;


  return (

 <View style={styles.container}>

      <Dialog
          visible={this.state.titleDialogVisible}
          onTouchOutside={() => {
            this.setState({ titleDialogVisible: false });
          }}
          actions={[
            <DialogButton
              text="OK"
              key = "0"
              onPress={this.saveTitle}
            />,
              <DialogButton
                text="CANCEL"
                key = "1"
                onPress={() => {this.setState({ titleDialogVisible: false });}}
              />,
          ]}
          dialogStyle={styles.dialog}

      >
          <DialogContent>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, padding: 5}}
              autoCorrect={false}
              defaultValue = {this.state.title}
              onChangeText={(text) => this.setState({titleText: text})}
              onBlur={() => this.saveTitle() }
              clearButtonMode = 'unless-editing'
              maxLength = {50}
            />
          </DialogContent>
      </Dialog>


    <ScrollView style={styles.card} ref={component => { this.myScrollView = component; }}>

          <TouchableOpacity onPress={this._pickImage}>
            <Image source={this.state.image} style={styles.cardImage} />
          </TouchableOpacity>

         <View style={styles.propBox}>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.rating}
                selectedStar={(rating) => {
                    this.setState({rating: rating});
                  }
                }

            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            halfStar={'ios-star-half'}
            iconSet={'Ionicons'}
            fullStarColor={'red'}
            starSize={20}
            />

            <Icon
              name='ios-bed'
              type='ionicon'
              onPress={() => this.setState({category: 'sleep'})}
              size = {30}
              underlayColor = 'transparent'
              color={this.state.category==='sleep'?Colors.sleep3:'lightgray'}
            />
            <Icon
              name='ios-restaurant'
              type='ionicon'
              onPress={() => this.setState({category: 'food'})}
              size = {30}
              underlayColor = 'transparent'
              color={this.state.category==='food'?Colors.food3:'lightgray'}
            />
            <Icon
              name='ios-image'
              type='ionicon'
              onPress={() => this.setState({category: 'todo'})}
              size = {30}
              underlayColor = 'transparent'
              color={this.state.category==='todo'?Colors.todo3:'lightgray'}
            />

            <Icon
              name='map-outline'
              type='material-community'
              size={30}
              iconStyle={styles.icon}
              color={this.validGPS()?Colors.appleBlue:'red'}
              onPress={ () =>
                        this.setState({showMap: true})}
              />

        </View>

              <KeyboardAvoidingView style={{ height: 500, justifyContent: "flex-start" }}>
                  <TextInput
                    placeholder={'Title \n \n What happened here?'}
                    editable = {true}
                    onChangeText={(text) => this.note=text}
                    multiline = {true}
                    numberOfLines = {10}
                    style = {styles.textInput}
                    onFocus={() => this.myScrollView.scrollTo({ x: 0, y: Metrics.screenWidth*.9, animated: true })}
                    onBlur = { () => {
                      this.parseNote(this.note);
                      this.myScrollView.scrollTo({ x: 0, y: 0, animated: true });
                      }
                    }
                  />
                <View style={{ height: 300 }} />
              </KeyboardAvoidingView>
    </ScrollView>
  </View>


  );

  }
}

const shortid = require('shortid');

function mapStateToProps(storeState) {
  return {
    draftpois: storeState.draftpois,
   };
}

function mapDispatchToProps(dispatch, props) {
  return {
    publish: (pois, trip) => dispatch(addReport(pois, trip)),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    alignSelf: 'stretch',
    alignContent: 'flex-start',
  },
  cardImage: {
    marginTop: 20,
    width: Metrics.screenWidth*0.9,
    height: Metrics.screenWidth*0.9,
  },
  propBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
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
      marginRight: 20,
      paddingLeft: 5,
      paddingRight: 5,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
    marginRight: 5,
  }
});

  export default connect(mapStateToProps, mapDispatchToProps)(Generation);

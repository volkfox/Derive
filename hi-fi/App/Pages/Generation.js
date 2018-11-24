
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image} from 'react-native';
import { Images, Colors, Metrics } from '../Themes';
import { DrawerActions } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';


export default class Generation extends React.Component {

  state = {
      image: null,
      exif: null,
      lat: 0,
      lng: 0,
    };


static navigationOptions = ({navigation}) => {
return {
        headerTitle: 'Build report',
        headerLeft:
            <Icon
                name="menu"
                size={30}
                color="gray"
                onPress={ () =>
                         navigation.dispatch(DrawerActions.toggleDrawer())}
            />,
          headerRight:
            <Icon
                name="ios-arrow-forward"
                type='ionicon'
                size={30}
                containerStyle={{marginRight: 5}}
                color="gray"
                onPress={ () =>
                          navigation.navigate('Trip')}
                />,
    }
};

_pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      exif: true,
      aspect: [16, 9],
    });

    if (!result.cancelled) {
      let {GPSLatitude, GPSLongitude} = result.exif;
      if (result.exif.GPSLatitudeRef === 'S') GPSLatitude = -GPSLatitude;
      if (result.exif.GPSLongitudeRef === 'W') GPSLongitude = -GPSLongitude;
      this.setState({ image: result.uri, lat: GPSLatitude, lng: GPSLongitude});

    } else {
      this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    }
}

_checkCameraPermissions = async  () => {
  //const { Permissions } = Expo;
  const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status !== 'granted') {
    alert('Hey! We need camera roll permissions');
  }
}

componentDidMount() {
  this._checkCameraPermissions();
  this._pickImage();
}

render() {

  let { image } = this.state;


  return (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Button
      title="Pick an image from camera roll"
      onPress={this._pickImage}
    />
    {image &&
      <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
  </View>
  );

  }
}



  // onPress={() => this.logout()}/>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

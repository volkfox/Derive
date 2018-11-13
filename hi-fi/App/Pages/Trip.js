
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,  } from 'react-native';
import { Images, Colors, Metrics } from '../Themes';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';

export default class Trip extends React.Component {

static navigationOptions = ({navigation}) => {
   return {
        headerTitle: 'Report',
    }
  };

  render() {

      return (
        <View style={styles.container}>
          <Button
        title='to POI'
          onPress={() => this.props.navigation.navigate('POI')}/>
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

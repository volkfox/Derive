
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,  } from 'react-native';
import { Images, Colors, Metrics } from '../Themes';
import Icon from 'react-native-vector-icons/Feather';

export default class EditPOI extends React.Component {


static navigationOptions = ({navigation}) => {
   return {
        headerTitle: 'POI',
    }
  };


render() {

      return (
        <View style={styles.container}>
          <Button
        title='Navigation end of stack'
          onPress={() => this.props.navigation.navigate('Trip')}/>
        </View>
      );

    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


import React from 'react';
import { StyleSheet, Text, View, Button, TextInput,  } from 'react-native';
import { Images, Colors, Metrics } from '../Themes';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';

export default class Plan extends React.Component {

static navigationOptions = ({navigation}) => {
return {
        headerTitle: 'Plan',
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

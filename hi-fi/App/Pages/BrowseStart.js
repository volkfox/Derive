// Main Search Screen
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage, SafeAreaView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Images, Colors, Metrics } from '../Themes';
import { DrawerActions } from 'react-navigation';

export default class BrowseStart extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      searchText: '',
      inputTextColor: 'black',
    }
}
 
static navigationOptions = ({navigation}) => {
    
    return {
        headerTitle: 'Browse',
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

runSearch = () => {
    Keyboard.dismiss();
    console.log("Search started for text: "+this.state.searchText);
    this.setState({searchText: ''})
}



  render() {

      return (
        <SafeAreaView style={styles.container}>
               
          <View style={styles.searchSection}>   
          
          
            <TextInput
            style={[styles.searchField, this._textStyle()]}
            placeholder = {"Try San Francisco"}
            clearButtonMode = "always"
            underlineColorAndroid = "transparent"
            onChangeText={
              (searchText) => this.setState({searchText})}
              onSubmitEditing={ () => this.runSearch() }
            value={this.state.searchText}
            onBlur={() => this.setState({inputTextColor: 'gray'})}
            onFocus={() => this.setState({inputTextColor: 'black'})}
            />    
           
            <Icon 
                style={styles.searchIcon} 
                name="navigation" 
                size={30} 
                color="gray"
                onPress={ () => this.runSearch() }
            />
                  
          </View>       

      </SafeAreaView>

      );

    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
    
  searchIcon: {
    padding: 10,
  },
    
  
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    marginTop: 100, 
},
  searchField: {
        height: 50,
        borderColor: 'transparent', 
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'rgb(240,240,240)',
        fontSize: 15,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        color: '#424242',
        width: Metrics.screenWidth*0.65,
  },
});

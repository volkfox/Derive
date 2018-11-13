import React from 'react';
import { StyleSheet, Text, View, Image, Button, ActivityIndicator, SectionList, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, DrawerActions, DrawerItems, NavigationActions} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Images, Colors, Metrics } from './App/Themes';
import * as pages from './App/Pages';
import Icon from 'react-native-vector-icons/Feather';

const {width, height} = Dimensions.get('window');


const BrowseNavigator = createStackNavigator(
  {
    Browse: pages.BrowseStart,
    Trip: pages.Trip,
    POI: pages.POI,
  },
  { headerMode: 'float',
    initialRouteName: 'Browse',
    navigationOptions: ({navigation}) => {

        return {
        }
    }
});

const PlanNavigator = createStackNavigator(
  {
    Trip: pages.Plan,
    POI: pages.POI, 
  },
  {
    initialRouteName: 'Trip',
});


const GenerationNavigator = createStackNavigator({
    
  Generation: pages.Generation,
  Trip: pages.Trip,
  POI: pages.POI,
}, { 
     headerMode: 'float',
     initialRouteName: 'Generation',
     navigationOptions: ({navigation}) => {
         
        return {
        }
    }
   });

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={styles.logo}>
      <Text style={styles.logotext}>&nbsp; derive</Text>
      </View>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const DrawerNav = createDrawerNavigator({
  Browse: {screen: BrowseNavigator},
  Plan: {screen: PlanNavigator},
  Generate:  {screen: GenerationNavigator},
  },
  { initialRouteName: 'Browse',
    contentComponent: CustomDrawerContentComponent,
    
});



export default class App extends React.Component {

render() {
      return (
        <DrawerNav />
      );
    }
  }
          
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    logo: {
    height: 70,
    paddingTop: 20,
    paddingBottom: 20,
  },
    logotext: {
    fontFamily: 'Helvetica Neue',
    fontSize: 31,
  },
});
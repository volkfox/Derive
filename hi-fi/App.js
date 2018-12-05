import React from 'react';
import { StyleSheet, Text, View, Image, Button, ActivityIndicator, SectionList, Dimensions, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
//import { Icon } from 'react-native-elements';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, DrawerActions, DrawerItems, NavigationActions} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {createStore} from 'redux';
import {Provider } from 'react-redux';
import devtools from 'remote-redux-devtools';

import  {reducer}  from './App/Store/Reducers';
import {restoreState, toggleOnboard} from './App/Store/Actions'

import { Images, Colors, Metrics } from './App/Themes';
import * as pages from './App/Pages';
import { LinearGradient } from 'expo';


// deferred features: multiple pics per POI, multiple planned trips,
// usernames and profile settings, access to published reports
const {width, height} = Dimensions.get('window');

// navigators
const BrowseNavigator = createStackNavigator(
  {
    Explore: pages.BrowseStart,
    Trips: pages.Trips,
    Trip: pages.Trip,
    POI: pages.POI,
  },
  { headerMode: 'float',
    initialRouteName: 'Explore',
    navigationOptions: ({navigation}) => {

        return {
            headerTitle: 'Search',
            headerBackTitle: null,
        }
    }
});

const GenerationNavigator = createStackNavigator(
  {
    Trip: pages.Plan,
    POI: pages.POI,
  },
  {
    initialRouteName: 'Trip',
    /*initialRouteParams: {
      rightIcon: 'map-outline',
    }*/
});


const PlanNavigator = createStackNavigator({

  Generation: pages.Generation,
  Trip: pages.MyTrip,
  POI: pages.EditPOI,
}, {
     headerMode: 'float',
     initialRouteName: 'Generation',
     navigationOptions: ({navigation}) => {

        return {
        }
    }
   });

/*const CustomDrawerContentComponent = (props) => (
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
  Explore: {screen: BrowseNavigator},
  Plan: {screen: PlanNavigator},
  Report:  {screen: GenerationNavigator},
  },
  { initialRouteName: 'Explore',
    contentComponent: CustomDrawerContentComponent,

});
*/
const TabNav = createBottomTabNavigator({
  Explore: {screen: BrowseNavigator,
  navigationOptions: () => ({
    tabBarLabel: "Search",
    tabBarIcon: ({ tintColor }) => (
            <Icon name="magnify" color="#000000" size={24} />
            )
    })

  },
  Plan: {screen: PlanNavigator,
    navigationOptions: () => ({
    tabBarLabel: "Post",
    tabBarIcon: ({ tintColor }) => (
            <Icon name="plus" color="#000000" size={24} />
            )
    })
  },
  Report:  {screen: GenerationNavigator,
    navigationOptions: () => ({
    tabBarLabel: "My Trips",
    tabBarIcon: ({ tintColor }) => (
            <Icon name="format-list-bulleted" color="#000000" size={24} />
            )
    })},
  },
  { initialRouteName: 'Explore',
    //contentComponent: CustomDrawerContentComponent,

});

// redux debug midddleware
const store = createStore(reducer,
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

//Persist onboarding and article storage in async
AsyncStorage.getItem('state').then(json => {
  if (json) {
    store.dispatch(restoreState(JSON.parse(json)));
  } else {
     store.dispatch(toggleOnboard(true));
  }
  store.subscribe(() => {
    AsyncStorage.setItem('state', JSON.stringify(store.getState()));
  })
});


// main App

export default class App extends React.Component {

render() {
      return (
        <Provider store={store}>
            <TabNav/>
        </Provider>
      );
    }
  }
const colors = {
  yellow: "#fecf33",
  lightOrange: "#fdbd39",
  peach: "#ee6723"
};
const textStyles = StyleSheet.create({
  header: {
    fontFamily: "SFUIDisplay",
    fontSize: 24,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#554d56"
  }
});

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

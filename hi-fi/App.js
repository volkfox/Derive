import React from 'react';
import { StyleSheet, Text, View, Image, Button, ActivityIndicator, SectionList, Dimensions, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, DrawerActions, DrawerItems, NavigationActions} from 'react-navigation';

import {createStore} from 'redux';
import {Provider } from 'react-redux';
import devtools from 'remote-redux-devtools';

import  {reducer}  from './App/Store/Reducers';
import {restoreState, toggleOnboard} from './App/Store/Actions'

import { Images, Colors, Metrics } from './App/Themes';
import * as pages from './App/Pages';


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
            headerTitle: 'Explore',
            headerBackTitle: null,
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
    initialRouteParams: {
      rightIcon: 'map-outline',
    }
});


const GenerationNavigator = createStackNavigator({

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
  Explore: {screen: BrowseNavigator},
  Plan: {screen: PlanNavigator},
  Report:  {screen: GenerationNavigator},
  },
  { initialRouteName: 'Explore',
    contentComponent: CustomDrawerContentComponent,

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
            <DrawerNav/>
        </Provider>
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

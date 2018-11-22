
import React from 'react';
import {  Modal, StyleSheet, Text, View, TextInput, ScrollView, Switch, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, Linking, Image, KeyboardAvoidingView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { MapView, Marker, Polyline} from 'expo';
import { DrawerActions } from 'react-navigation';
import { SwipeListView } from 'react-native-swipe-list-view';
import {uid} from 'react-uid';

import { changeNotePOI, delPlanPOI, ratePlanPOI } from '../Store/Actions';
import { Images, Colors, Metrics} from '../Themes';

class Plan extends React.Component {

constructor(props) {
      super(props);
      this.mapRef = null;
}

state = {
      showMap: false,
      sleepFilter: true,
      foodFilter: true,
      todoFilter: true,
      activeMarker: {},
      note: "",
   }

   static navigationOptions = ({navigation}) => {
      return ({
              headerTitle: 'Plan',
              headerLeft:
                  <Icon
                      name="menu"
                      size={30}
                      color="gray"
                      onPress={ () =>
                               navigation.dispatch(DrawerActions.toggleDrawer() )}
                  />,
              })
}



toggleShowMap = () =>
     this.setState((prevstate) => {return {showMap: !prevstate.showMap}});

sendToNav = (e) => {

         const navUrl = 'http://maps.apple.com/maps?saddr=Current%20Location&daddr='

         let coord = {};
         if (Object.keys(this.state.activeMarker).length) {
                 coord = this.state.activeMarker.coordinate;
         } else {
                 coord = e.nativeEvent.coordinate;
         }
         Linking.openURL(navUrl+coord.latitude+','+coord.longitude).catch(err => console.error('Could not open Apple maps', err));
     }

toggleFilter = async (key) => {

       await this.setState((prevstate) => {
       return {[key]: !prevstate[key]};
       });
   }

navigateToMarker = (event) => {
           //console.log(this.state.activeMarker);
           if (!this.state.activeMarker || !this.state.activeMarker.coordinate) return;

           const poi = this.props.allpois.find(marker =>
     this.state.activeMarker.coordinate.latitude === marker.coordinate.latitude &&
     this.state.activeMarker.coordinate.longitude === marker.coordinate.longitude);
           if (!poi) return;
           this.props.navigation.navigate('POI',{poi: poi})
     }

     renderNavBar = () => {
         return (

         <View style={styles.navbar}>
           <Icon
             name='ios-bed'
             type='ionicon'
             onPress={() => this.toggleFilter('sleepFilter')}
             size = {40}
             underlayColor = 'transparent'
             color={this.state.sleepFilter?'black':'lightgray'}
           />
           <Icon
             name='ios-restaurant'
             type='ionicon'
             onPress={() => this.toggleFilter('foodFilter')}
             size = {40}
             underlayColor = 'transparent'
             color={this.state.foodFilter?'black':'lightgray'}
           />
           <Icon
             name='ios-image'
             type='ionicon'
             onPress={() => this.toggleFilter('todoFilter')}
             size = {40}
             underlayColor = 'transparent'
             color={this.state.todoFilter?'black':'lightgray'}
           />
        </View>
      )
     }




  render() {

    const trip = this.props.plannedTrip;

    if (!trip) {
      console.log("Bummer! Empty trip passed into a trip screen")
      return (null);
    }
    //const trip = this.props.alltrips.find(item => item.id===passedTrip.id);
    //if (!trip) return (null);

    const poiSet = new Set(trip.map(item => item.poi));

    if (!poiSet.size) return (
        <View style={styles.bummer} >
            <Text> Bummer! {"\n\n"} You did not add anything to planner yet. {"\n"} Try exploring more places. </Text>
        </View>
    );
    const pois = this.props.allpois.filter(item => poiSet.has(item.id)&&((this.state.sleepFilter && item.category==='sleep') || (this.state.foodFilter && item.category==='food') || (this.state.todoFilter && item.category==='todo')));

    let rowRef = null;
    //console.log(`Planned trip pois: ${pois}`);
    return (
        <SafeAreaView style={styles.container}>

         <View style={styles.switchContainer}>

               <Switch style={styles.switch}
                 onValueChange = {this.toggleShowMap}
                 value = {this.state.showMap}/>

         </View>

         {!this.state.showMap && <ScrollView style={styles.scroll}>
            <SwipeListView

    // Grab reference to this row

                   onRowOpen={(rowKey, rowMap, toValue) => {rowRef = rowMap[rowKey];}}
                   useFlatList
                   data={pois}
                   keyExtractor = { (item) => item.id }
                   leftOpenValue={Metrics.screenWidth*0.6}
                   rightOpenValue={-75}
                   previewRowKey={pois[0].id}

                   renderItem={ (element, rowMap) => {
                     const item = element.item;
                     return (
                     <TouchableWithoutFeedback onLongPress={() => this.props.navigation.navigate('POI',{poi: item})}  >
                           <Card title={item.header} titleStyle={styles.cardTitle} image={item.images[0]}>

                           <View style = {styles.rateContainer}>
                                <StarRating
                                disabled={false}
                                maxStars={5}
                                rating={this.props.plannedTrip.find(element => element.poi===item.id).importance}
                                selectedStar={(rating) => this.props.ratePOI(item.id, rating)}
                                emptyStar={'ios-heart-empty'}
                                fullStar={'ios-heart'}
                                halfStar={'ios-heart-half'}
                                iconSet={'Ionicons'}
                                fullStarColor={Colors.bloodOrange}
                                starSize={20}
                                />
                            </View>

                           </Card>
                        </TouchableWithoutFeedback>
                   )}}
                   renderHiddenItem={ (data, rowMap) => (
                       <View style={styles.rowBack} >

                            <TextInput
                               {...this.props}
                               editable = {true}
                               defaultValue = {this.props.plannedTrip.find(element => element.poi===data.item.id).notes }
                               placeholder = {'Type a note here'}
                               onChangeText={(text) => this.setState({note: text})}
                               maxLength = {40}
                               multiline = {true}
                               numberOfLines = {10}
                               style = {styles.notes}
                               // possible rate condition to this.state.note
                               onBlur = { () => {
                                 const trip = this.props.plannedTrip.find(element => element.poi===data.item.id);
                                 console.log(trip.notes);
                                 this.props.changeNote(data.item.id, this.state.note);
                                 this.setState({note: ''});
                                 rowRef.closeRow()}
                               }
                              />

                              <View style={styles.buttonColumn} >
                                <Button
                                    onPress={() => rowRef.closeRow() }
                                    backgroundColor='#03A9F4'
                                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 20}}
                                    title='Move ▲' style={{marginTop: 20}} />
                                 <Button
                                        onPress={() => rowRef.closeRow() }
                                        backgroundColor='#03A9F4'
                                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 20}}
                                        title='Move ▼' style={{marginTop: 20}} />
                              </View>
                       </View>
                   )}

              />

              </ScrollView>
        }


        {this.state.showMap && this.renderNavBar() }

        {this.state.showMap && <MapView
            style={styles.map}
            onLongPress={this.sendToNav}
            onMarkerDeselect={ () => this.setState({activeMarker: {}})}
            ref={(ref) => { this.mapRef = ref }}
            onLayout={() => this.mapRef.fitToElements(true)}
           >

          {pois.map(marker => (
            <MapView.Marker
                mapType={"mutedStandard"}
                key={parseInt(marker.id)}
                coordinate={marker.coordinate}
                title={marker.header}
                description={marker.text}
                pinColor={marker.pinColor}
                onCalloutPress={e => this.navigateToMarker(e.nativeEvent)}
                onPress={e => this.setState({activeMarker: e.nativeEvent})}
                onSelect={e => this.setState({activeMarker: e.nativeEvent})}
            />
          ))}
        </MapView>
      }



         </SafeAreaView>
       )
      }
  }

  function mapStateToProps(storeState) {

    return {
      allpois: storeState.allpois,
      alltrips: storeState.alltrips,
      plannedTrip: storeState.plannedTrip,
     };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      changeNote: (id, note) => dispatch(changeNotePOI(id, note)),
      delPlan: (id) => dispatch(delPlanPOI(id)),
      ratePOI: (id, rating) => dispatch(ratePlanPOI(id, rating)),
    };
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

  rateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 30,
      marginLeft: 10,
  },
  switchContainer: {
      backgroundColor: 'white',
      alignSelf: 'stretch',
      height: 50,
      paddingTop: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
  },
  switch: {
      marginRight: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    top: Metrics.screenHeight*0.8,
    width: Metrics.screenWidth,
    zIndex: 100,
  },
  scroll: {
    alignSelf: 'stretch',
  },
  bummer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    resizeMode: 'cover',
    ...StyleSheet.absoluteFillObject,
    top: 50,
  },
  buttonrow: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonColumn: {
    flexDirection: 'column',
  },
  cardTitle: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 10,
    paddingRight: 5,
	},
  notes: {
    flex:1,
    backgroundColor: '#FFFFA5',
    alignSelf: 'stretch',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  map: {
    flex:1,
    alignSelf: 'stretch',
  },
  });


  export default connect(mapStateToProps, mapDispatchToProps)(Plan);

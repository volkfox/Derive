
import React from 'react';
import { Modal, StyleSheet, Alert, Text, View, TextInput, ScrollView, Switch, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, Linking, Image, KeyboardAvoidingView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { MapView, Marker, Polyline } from 'expo';
import { DrawerActions } from 'react-navigation';
import { SwipeListView } from 'react-native-swipe-list-view';

import { addReport, rateDraftPOI, shiftDraftPOI, delDraftPOI } from '../Store/Actions';
import { Images, Colors, Metrics} from '../Themes';

class MyTrip extends React.Component {

constructor(props) {
      super(props);
      this.mapRef = null;
      this.rowRef = null;
      this.rowOpen = false;
      this.props.navigation.setParams({ submitTrip: this.submitTrip});
}

state = {
      showMap: false,
      title: this.props.navigation.getParam('title','Untitled'),
      author: this.props.navigation.getParam('author','unknown'),
      sleepFilter: true,
      foodFilter: true,
      todoFilter: true,
      activeMarker: {},
      changeMarker: {},
      previewValue: -30,
   }

static navigationOptions = ({navigation}) => {
   const title = navigation.getParam('title','Untitled');
   return {
           headerTitle: "Preview: "+title,
           headerRight: (
               <View style={styles.iconContainer} >
                 <Icon
                       name="share-apple"
                       type='evilicon'
                       size={30}
                       iconStyle={styles.shareIcon}
                       color={Colors.appleBlue}
                       onPress={navigation.getParam('submitTrip')}
                       />
               </View>)
       }
};

submitTrip = () => {

      console.log("submitting trip");
      this.setState({showMap: false});

      if (!this.props.draftpois.length) {
        Alert.alert(
              '',
              'Please add at least one point of interest',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );
        return;
      }

      if (this.state.title === 'New Trip') {
        Alert.alert(
              '',
              'Please name this trip',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );

        this.props.navigation.dispatch(DrawerActions.toggleDrawer());
        return;
      }

      const poiSet = this.props.draftpois.map(poi => poi.id);

      const trip = {id: shortid.generate(), author: this.state.author, date: {}, title: this.state.title, pois: poiSet, communityRating: 0, derived: 0,}
      const poiList = this.props.draftpois.map(element => {element.tripID=trip.id; return element});
      this.props.publish(poiList, trip);

      Alert.alert(
            '',
            'Trip publishemd',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          );
      // clean up the current
      this.props.navigation.getParam('reset', null)();
      this.props.navigation.navigate('Generation');
      this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  }

componentDidMount() {
      this.props.navigation.setParams({ toggleShowMap: this.toggleShowMap });
}

render() {

    const trip = this.props.draftpois;

    if (!trip || !trip.length) {
      console.log("Bummer! Empty report passed into MyTrip screen")
      return (null);
    }

    return (
        <SafeAreaView style={styles.container}>

         <ScrollView style={styles.scroll}>

            <SwipeListView

            // items are planned trip entries
                   style={styles.listview}
                   friction = {7}
                   onRowOpen={(rowKey, rowMap, toValue) => {this.rowRef = rowMap[rowKey];}}
                   onRowDidClose={(rowKey, rowMap) => {this.rowOpen = false;}}
                   onRowDidOpen={(rowKey, rowMap) => {this.rowOpen = true; this.setState({previewValue: -1}); }}
                   useFlatList
                   data={trip}
                   keyExtractor = { (item) => JSON.stringify(item) }

                   rightOpenValue={-75}
                   previewRowKey={JSON.stringify(trip[0])}
                   previewOpenValue={this.state.previewValue}

                   renderItem={ (element, rowMap) => {
                     // this is poi entry in the trip
                     console.log(element);
                     const poi = element.item;

                     return (

                     <TouchableWithoutFeedback onPress={ () => {
                          console.log(this.rowOpen);
                          //!this.rowOpen && this.props.navigation.navigate('POI',{poi: poi, plan: true})
                           this.rowOpen && this.rowRef.closeRow();
                       }} >
                           <Card title={poi.header} titleStyle={styles.cardTitle} image={poi.images[0]} >

                               <View style = {styles.rateContainer}>
                                    <StarRating

                                    disabled={false}
                                    maxStars={5}
                                    rating={poi.authorRating}
                                    selectedStar={(rating) => {
                                        this.props.setDraftRating(poi.id, rating);
                                      }
                                    }

                                    emptyStar={'ios-star-outline'}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    iconSet={'Ionicons'}
                                    fullStarColor={Colors.buttonBlue}
                                    starSize={20}

                                    />
                                </View>
                                <Text style={{marginBottom: 10}}>
                                    {poi.text}
                                </Text>
                           </Card>
                        </TouchableWithoutFeedback>
                   )}}
                   renderHiddenItem={ (data, rowMap) => (
                       <View style={styles.rowBack} >

                              <View style={styles.buttonColumn} >
                                <Button
                                          onPress={() => {
                                            this.rowRef.closeRow();
                                            this.props.shiftDraftItem(data.item.id, 'up');
                                            let changeMarker = Object.assign({}, this.state.changeMarker);
                                            this.setState({ changeMarker: changeMarker });
                                            }
                                          }
                                          backgroundColor={Colors.buttonBlue}
                                          buttonStyle={styles.cardButton}
                                          title='Move ▲' style={{marginTop: 20}} />
                                <Button
                                           onPress={() => this.props.delDraftItem(data.item.id)}
                                           backgroundColor={Colors.buttonRed}
                                           buttonStyle={styles.cardButton}
                                           title='Drop' style={{marginTop: 20}} />
                                 <Button
                                         onPress={() => {
                                           this.rowRef.closeRow();
                                           this.props.shiftDraftItem(data.item.id, 'down');
                                           let changeMarker = Object.assign({}, this.state.changeMarker);
                                           this.setState({ changeMarker: changeMarker });
                                           }
                                         }
                                        backgroundColor={Colors.buttonBlue}
                                        buttonStyle={styles.cardButton}
                                        title='Move ▼' style={{marginTop: 20}} />
                              </View>
                       </View>
                   )}
              />

              </ScrollView>
         </SafeAreaView>
       ) // return
    }
} // end class

const shortid = require('shortid');

  function mapStateToProps(storeState) {

    return {
      draftpois: storeState.draftpois,
     };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      publish: (poiList, trip) => dispatch(addReport(poiList, trip)),
      setDraftRating: (id, rating) => dispatch(rateDraftPOI(id, rating)),
      delDraftItem: (id,) => dispatch(delDraftPOI(id)),
      shiftDraftItem: (id, direction) => dispatch(shiftDraftPOI(id, direction)),
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
  actiontab: {
    alignItems: 'center',
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
    justifyContent: 'space-between'
  },
  cardButton: {

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
		justifyContent: 'flex-end',
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
  listview: {
    marginBottom: 200,
  },
  shareIcon: {
    marginLeft: 20,
    marginRight: 5,
  },
  });


  export default connect(mapStateToProps, mapDispatchToProps)(MyTrip);

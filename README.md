## Hi-Fi project featurelist

Top navigation (Explore, Plan, Report) is done via edge swipe  (left-right direction, also duplicated as hamburger menu).

### Explore
1. *Main* Explore screen.
   * Search box with auto-propmt for arbitrary geographic destination
   * Pre-configured 'Current Location' and 'Stanford' destinations popping up when clicking search box
   * Search is activated by hitting Enter on keyboard and leads into *Trips* screen
   * Expose (scrollable band) of random clickable POIs that lead into *POI* screen
   
2. *Trips* screen (list and map representations, defaults to list view)
   * List: scrollable list of matching trip (trip must have at least one POI in the geographic area of search)
   * List: trip is represented as expose of POIs. Clicking on band leads into Trips screen
   * Map: Filter buttons showing/hiding category markers
   * Map: Panning/zooming selects/unselects trips in the area of map
   * Map: Clickable markers with POI title/description, clicking callouts lead into *POI* screen
   * Map: long click into Marker or arbitrary map point leads into Apple Navigation app
   * Map: Marker colors are coded as functions of POI categories and author's rating
   
3.  *Trip* screen (list and map representations)
    * List: scrollable list of clickable trip POIs (images and text), click leads into *POI* screen
    * List: Entire trip can be added to planner with one button click
    * Map:  Trips POIs shown as markers and connected. Same filtering, colors and Apple Navigation features as in *Trips* screen.
    * Map:  Zooming/panning does not select or unselect markers
    * Community Rating: viewer can assign rating to a trip
  
4.  *POI* screen
    * Clickable image leads into the "Lightbox" view
    * POI can be added to planner
    * Author's own POI rank (not changeable by the viewers)
    
### Plan 
 1. *Main* plan screen (list and map representations, defaults to list view)
 2.  Private importance (heart) POI ranking
 3.  Ability to disable a POI
 4.  Swiping POI right allows to fill a notes post-it
 5.  Swiping POI left allows to drop, or move POI up/down
 6.  Single-clicking POI card closes open row
 7.  Long clicking POI card leads into *POI* screen
 8.  Map representation uses same features as other map screens plus ignores disabled POIs.
 
Project limitations:
  * React Native platform
  * IOS only
  * No support for multiple planned trips
  * Reporting one trip at a time
  * No editing interface for saved reports
  * No commenting or other social features
  * No indications of time of trip
  
  Redux Database Schema by example:
  
 allpois: [
      {id:"1", category: 'food', header: 'Rays Grill', text: 'I think this place is a solid 4-star. \n \n I got a chicken burrito here, and it was a nice solid, burrito. Definitely no skimping on chicken or other fillings (rice and beans). It also came with tortilla chips and BOMB salsa and was only $6. Hollaaaaaaa. Also got Pacifico on tap for $3, this was actually kinda bad - tasted kinda watered down lol, BUT all the stuff my friends got they all liked - tostada salad and pad thai. \n\n Service here was like whatever tbh, I felt like I was being hella rushed but there was also a long line. I also dont know why youd be here if you are not visiting Stanford for some reason bc like lol if you are not visiting Stanford then recommend u DONT COME HERE and stay in real society because real society def has better food. But I mean its still good food and reasonable price for what you get. Some people just got HELLA HIGH STANDARDS OR SMTH.', images: [{uri: 'https://s3-us-west-2.amazonaws.com/tablehero.qa.images/wZ4IDzw0yfc/2e6fea31fe39ea79a459bb13d5ce7cac6f5d0d0a.jpg'}], coordinate:{latitude: 37.423659, longitude: -122.158492}, authorRating: 3, tripID:"1", pinColor: Colors.food3, derived: 1,author: 'Jim Piech'}]
      
 alltrips: [{id: "1", author: 'Jim Piech', date: {}, title: "My Trip to Stanford", pois: ["1","2"], communityRating: 3, derived: 11,}]
            

 plannedTrip: [{notes: '', importance: 2, poi: "1", active: 'true'}, {notes: '', importance: 2, poi: "2", active: 'true'}]
  
  
  

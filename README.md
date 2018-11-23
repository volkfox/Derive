## Hi-Fi project featurelist

Top navigation (**Explore, Plan, Report**) is done via edge swipe  (left-right direction, also duplicated as hamburger menu).

### Explore
1. *Main* screen.
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
 1. *Main* screen (list and map representations, defaults to list view)
     *  Private importance (heart) POI ranking
     *  Icon to disable a planned POI
     *  Swiping POI right allows to fill a notes post-it
     *  Swiping POI left allows to drop, or move POI up/down
     *  Single-clicking POI card closes open row
     *  Long clicking POI card leads into *POI* screen
     *  Map representation uses same features as other map screens plus ignores disabled POIs.
 
**Project limitations:**
  * React Native platform
  * IOS only
  * No support for multiple planned trips
  * Reporting one trip at a time
  * No editing interface for saved reports
  * No commenting interface (or other social features)
  * No indications of the time of the trip
  
  **Redux Database Schema by example:**
```  
allpois: [
      {id:"1", category: 'food', header: 'Rays Grill', text: 'blah blah blah', images: [{uri: 'https://s3-us-west-2.amazonaws.com/tablehero.qa.images/wZ4IDzw0yfc/2e6fea31fe39ea79a459bb13d5ce7cac6f5d0d0a.jpg'}], coordinate:{latitude: 37.423659, longitude: -122.158492}, authorRating: 3, tripID:"1", pinColor: Colors.food3, derived: 1, author: 'Jim Piech'}]
      
alltrips: [{id: "1", author: 'Jim Piech', date: {}, title: "My Trip to Stanford", pois: ["1","2"], communityRating: 3, derived: 11,}]
            
plannedTrip: [{notes: '', importance: 2, poi: "1", active: 'true'}, {notes: '', importance: 2, poi: "2", active: 'true'}]
 ```
  
  

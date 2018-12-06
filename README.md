## Hi-Fi project featurelist

Core tasks (**Explore, Plan, Report**) are accessed via edge swipe  (also duplicated in hamburger menu).

### Explore
1. *Main* screen.
   * Search box with auto-prompt for arbitrary geographic destinations
   * Pre-configured 'Current Location' and 'Stanford' destinations popping up when clicking search box
   * Search is activated by hitting Enter on keyboard and leads into *Trips* screen
   * Exposé (scrollable band) of randomly chosen clickable POIs that lead into respective *POI* screen
   
2. *Trips* screen (list and map representations, defaults to list view)
   * ListView: scrollable list of matching trips (a trip must have at least one POI in active search area to be shown)
   * ListView: trip is represented as exposé of POIs. Clicking on band leads into Trips screen
   * MapView: Filter buttons showing/hiding markers based on three categories (todo, sleep, food)
   * MapView: Panning/zooming selects/unselects trips based on active map area
   * MapView: Clickable markers with POI title/description, clicking callouts lead into *POI* screen
   * MapView: long click into a Marker or an arbitrary map point leads into the Apple Navigation app
   * MapView: Marker colors are coded as functions of POI categories and author's POI rankings
   
3.  *Trip* screen (list and map representations)
    * ListView: scrollable list of clickable trip POIs (images and text), click leads into *POI* screen
    * ListView: Entire trip can be added to planner with one button click
    * ListView: Community Rating: viewer can vote (contribute rating) to a trip report
    * MapView:  Trips POIs shown as markers and connected. Same filtering, coloring and Apple Navigation features as in *Trips* screen.
    * MapView:  Zooming/panning does not affect trip POI markers
    
  
4.  *POI* screen
    * Clickable image leads into the "lightbox-style" modal view
    * POI can be added to planner
    * Author's POI rank shown (not changeable by the viewers)
    * Clickable author's name navigates into *Trip* screen
    
### Plan 
 1. *Main* screen (list and map representations, defaults to list view)
     *  Private importance POI ranking
     *  Icon to disable a planned POI
     *  Swiping POI right allows to fill a "notes" post-it
     *  Swiping POI left reveals drop and move icons
     *  Single-clicking POI card closes the open row
     *  Clicking POI card leads into *POI* screen (nav to trip link will be disabled there)
     *  Map representation uses same features as other map screens AND ignores disabled POIs.
 
**Project limitations:**
  * React Native platform w/Expo
  * IOS only (Android likely have bugs with map)
  * No support for multiple planned trips
  * Reporting one trip at a time
  * No editing interface for published reports
  * No commenting interface (or other social features)
  * No indications of the time of the trip
  
### Generate
   1. *Main* screen (list and map representations)
     *  Camera roll as default source of images and GPS
     *  icon to fix/alter a GPS location
     *  icons to designate category class
     *  POI title in the 1st text line, editor behind the image screen
   2. *Submission* screen (list only)
     *  reorder, drop and submit functions
     
     
  
  **Redux Database Schema by example:**
```  
allpois: [
      {id:"1", category: 'food', header: 'Rays Grill', text: 'blah blah blah', images: [{uri: 'https://s3-us-west-2.amazonaws.com/tablehero.qa.images/wZ4IDzw0yfc/2e6fea31fe39ea79a459bb13d5ce7cac6f5d0d0a.jpg'}], coordinate:{latitude: 37.423659, longitude: -122.158492}, authorRating: 3, tripID:"1", pinColor: Colors.food3, derived: 1, author: 'Jim Piech'}]
      
alltrips: [{id: "1", author: 'Jim Piech', date: {}, title: "My Trip to Stanford", pois: ["1","2"], communityRating: 3, derived: 11,}]
            
plannedTrip: [{notes: '', importance: 2, poi: "1", active: 'true'}, {notes: '', importance: 2, poi: "2", active: 'true'}]
 ```
  
  

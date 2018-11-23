## Hi-Fi project for Derive team.
lingo: POI =  point of interest

Top navigation (Explore, Plan, Report) is done via left-right edge swipe (duplicated on hamburger menu).

Features implemented:

### Explore
1. *Main* Explore screen.
   * Search box with auto-propmt for arbitrary geographic destination
   * Pre-configured 'Current Location' and 'Stanford' destinations popping up when clicking search box
   * Search is activated by hitting Enter on software or hardware keyboard and leads into *Trips* screen
   * Expose (scrollable band) of random clickable POIs that lead into *POI* screen
   
2. *Trips* screen (list and map representations, defaults to list view)
   * List: scrollable trip list (trip must have at least one POI in the geographic area of search)
   * List: trip is represented as expose of POIs. Clicking on expose leads into Trips screen
   * Map: Filter buttons showing/hiding category markers
   * Map: Panning/zooming selects/unselects trips in the area
   * Map: Clickable markers with POI title/description callouts leading into POI screen
   * Map: long click into Marker or map point leading into Apple Navigation
   * Map: Marker colors are defined as function of POI category and author's rating
   
3.  *Trip* screen (list and map representations)
    * List: scrollable list of clickable trip POIs (images and text), click leads into *POI* screen
    * List: Entire trip can be added to planner with one button click
    * Map:  Trips POIs shown as markers and connected. Same filtering, colors and Apple Navigation features as in *Trips* screen.
    * Map:  Zooming/panning does not select or unselect markers
    * Rating: viewer can assign rating to a trip
  
4.  *POI* screen
    * Clickable image leads into the "Lightbox" view
    * POI can be added to planner
    * Author's rating shown (not changeable by the user)
    
### Plan 
 1. *Main* plan screen (list and map representations, defaults to list view)
 2.  Importance (heart) clickable ranking
 3.  Ability to disable a POI
 4.  Swiping POI right allows to fill a notes post-it
 5.  Swiping POI left allows to drop, or move POI up/down
 6.  Single-clicking POI card closes open row
 7.  Long clicking POI card leads into *POI* screen
 8.  Map representation uses same features as other map screens plus ignores disabled POIs.
 

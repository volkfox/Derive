import { CREATE_TRIP, RATE_TRIP, ADD_PLAN_POI, DEL_PLAN_POI, RESTORE_STATE, TOGGLE_ONBOARD } from './Actions';
import {Colors} from '../Themes'
const initialStoreState = {
    
  allpois: [
      {id:"1", category: 'food', header: 'Rays Grill', text: 'I think this place is a solid 4-star. \n \n I got a chicken burrito here, and it was a nice solid, burrito. Definitely no skimping on chicken or other fillings (rice and beans). It also came with tortilla chips and BOMB salsa and was only $6. Hollaaaaaaa. Also got Pacifico on tap for $3, this was actually kinda bad - tasted kinda watered down lol, BUT all the stuff my friends got they all liked - tostada salad and pad thai. \n\n Service here was like whatever tbh, I felt like I was being hella rushed but there was also a long line. I also dont know why youd be here if you are not visiting Stanford for some reason bc like lol if you are not visiting Stanford then recommend u DONT COME HERE and stay in real society because real society def has better food. But I mean its still good food and reasonable price for what you get. Some people just got HELLA HIGH STANDARDS OR SMTH.', images: [{uri: 'https://s3-us-west-2.amazonaws.com/tablehero.qa.images/wZ4IDzw0yfc/2e6fea31fe39ea79a459bb13d5ce7cac6f5d0d0a.jpg'}], coordinate:{latitude: 37.423659, longitude: -122.158492}, authorRating: 3, tripID:"1", pinColor: Colors.food3, derived: 1,author: 'Jim Piech'},
    
  {id:"2", category: 'todo', header: 'Claw Fountain', text: 'Fountain Hopping is a unique Stanford tradition where groups of undergraduate students swim, hangout and “hop” between the variety of fountains around campus. \n \n This tradition typically takes place with dorm mates during NSO or New Student Orientation at the beginning of freshman year (However, many students continue to fountain hop in their favorite fountains throughout their time at Stanford). Fountain hopping can entail swimming in the fountain, sitting on the side while dangling feet into the fountain or bringing an inflatable water toy to float on the surface. \n\n Stanford has many big and small fountains, however, students usually fountain hop in five that are most suited to this tradition. ', images: [{uri:'https://news.stanford.edu/news/2011/june/images/claw_news.jpg'}], coordinate:{latitude: 37.425187, longitude: -122.169362}, authorRating: 3, tripID:"1", pinColor: Colors.todo3, derived: 5, author: 'Jim Piech'},
            
  {id:"3", category: 'sleep', header: 'Coronet Hotel', text: 'Crappy hotel at outrageous prices.\n\n Welcome to Palo Alto.', images: [{uri: 'http://www.motel6anaheimmaingate.com/content/dam/g6/Microsites/Corporate/AnaheimMaingate/m_1066_420double3_1280x420.jpg'}], coordinate: {latitude: 37.426184, longitude: -122.145659}, authorRating: 3, tripID:"2", pinColor: Colors.sleep3, derived: 5, author: 'Pete Sahami'},
            
  {id:"4", category: 'todo', header: 'Gates II Building Computer Science Department', text: 'Easily the crappiest building on campus with a very strange basement design. Tons of free food though.', images: [{uri: 'https://upload.wikimedia.org/wikipedia/commons/3/31/StanfordGatesCS.jpg'}], coordinate: {latitude: 37.430268, longitude: -122.173373}, authorRating: 3, tripID:"2", pinColor: Colors.todo3, derived: 4, author: 'Pete Sahami'},
            
  {id:"5", category: 'todo', header: 'Green library', text: 'Here at Stanford, we are all big, beautiful, smart, kick-ass fish swimming in a pond filled with fluoride-infused water that’s been imported from the white sand beaches of Maui and triple purified through the latest reverse osmosis technologies. We are CONSTANTLY surrounded by the brightest minds IN THE WORLD!!! We live with them, we eat lunch with them, we go to CLASS with them!!! We cannot escape them because we ARE them. Our passion, our intellect, and our downright BLINDING good looks are the reason we BELONG here at this heaven on earth of an academic institution.',images: [{uri: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Green_Library_Stanford_University.jpg'}], coordinate: {latitude: 37.427023, longitude: -122.167172}, authorRating: 2, tripID:"2", pinColor: Colors.todo2, derived: 3, author: 'Pete Sahami'},
            
  {id:"6", category: 'todo', header: 'MemChu', text: 'Following the death of Leland Stanford in 1893, Jane Lathrop Stanford decided to build Stanford Memorial Church as a memorial to her husband. Mrs. Stanford wanted the church to be nondenominational and a place of peace, meditation, and prayer amid the turmoil and tasks of the university.', images: [{uri: 'https://cdn-images-1.medium.com/max/2000/1*cy45yZ0I82RnY-iW_pSP5Q.jpeg'}], coordinate: {latitude: 37.427068, longitude:-122.170462}, authorRating: 4, tripID:"2", pinColor: Colors.todo4, derived: 4, author: 'Pete Sahami'},
           ],
  alltrips: [{id: "1", author: 'Jim Piech', date: {}, title: "My Trip to Stanford", pois: ["1","2"], communityRating: 3, derived: 11},
            {id: "2", author: 'Pete Sahami', date: {}, title: "Random Walk", pois: ["3","4","5","6"], communityRating: 2, derived: 22}],
    
  plannedTrip: [{notes: '', wantRating: 2, poi: "1"}, {notes: '', wantRating: 2, poi: "2"}],
  needOnboarding: 'false',
};

export function reducer(state = initialStoreState, action) {
    
  if (action.type === RESTORE_STATE) {
    return action.state;
  }
    
  if (action.type === TOGGLE_ONBOARD) {
    return Object.assign({}, state, {
      needOnboarding: action.needOnboarding,
    });
        
  }
    
  // wrong! fix it
  if (action.type === CREATE_TRIP) {
    return {
      alltrips: [
        action.trip,
        ...state.alltrips,
      ],
      allpois: [
        ...action.pois,
        ...state.allpois,
      ],
        
    }
  }
    
  // need to find trip by id and update
  if (action.type === RATE_TRIP) {
    return state;
        
  }

  // push poi into plan, add derived counter
  if (action.type === ADD_PLAN_POI) {
      
    // avoid dups
    if (state.plannedTrip.find(item => item.poi===action.poiID)) return state;
      let poi = state.allpois.find(item =>  item.id === action.poiID);
      if (!poi) return state;
      const pois = state.allpois.filter(item =>  item.id !== action.poiID);
      poi.derived++;
     
     return Object.assign({}, state, {
        plannedTrip: [
        {notes: '', wantRating: 0, poi: action.poiID},
        ...state.plannedTrip,
      ], allpois: [poi, ...pois,]});
  }
    
  // need to find poi by id and delete
  if (action.type === DEL_PLAN_POI) {
    return state;
        
  }
  
   // kitchen sink
  return state;
}

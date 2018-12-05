export const CREATE_TRIP = 'CREATE_TRIP';
export const RATE_TRIP = 'RATE_TRIP';

export const ADD_PLAN_POI = 'ADD_PLAN_POI';
export const DEL_PLAN_POI = 'DEL_PLAN_POI';
export const RATE_PLAN_POI = 'RATE_PLAN_POI';
export const CHANGE_NOTE_POI = 'CHANGE_NOTE_POI';
export const TOGGLE_ACTIVE = 'TOGGLE_ACTIVE';
export const MOVE_PLAN_POI  = 'MOVE_PLAN_POI';

export const ADD_DRAFT_POI = 'ADD_DRAFT_POI';
export const RATE_DRAFT_POI = 'RATE_DRAFT_POI';
export const DEL_DRAFT_POI = 'DEL_DRAFT_POI';
export const SHIFT_DRAFT_POI = 'SHIFT_DRAFT_POI';
export const ADD_REPORT = 'ADD_REPORT';


export const TOGGLE_ONBOARD = 'TOGGLE_ONBOARD';
export const RESTORE_STATE = 'RESTORE_STATE';



export function createTrip(trip, pois) {
  return {
    type: CREATE_TRIP,
    trip: trip,
    pois: pois,
  };
}

export function rateTrip(tripID, rating) {
  return {
    type: RATE_TRIP,
      tripID: tripID,
      rating: rating,
  };
}

export function addReport(pois, trip) {
  return {
    type: ADD_REPORT,
    pois: pois,
    trip: trip,
  }
}

export function addDraftPOI(poi) {
  return {
    type: ADD_DRAFT_POI,
    poi: poi,
  }
}

export function rateDraftPOI(id, rating) {
  return {
    type: RATE_DRAFT_POI,
    id: id,
    rating: rating,
  }
}

export function delDraftPOI(id) {
  return {
    type: DEL_DRAFT_POI,
    id: id,
  }
}

export function shiftDraftPOI(id, direction) {
  return {
    type: SHIFT_DRAFT_POI,
    id: id,
    direction: direction,
  }
}

export function addPlanPOI(poiID) {
  return {
    type: ADD_PLAN_POI,
    poiID: poiID,
  };
}

export function changeNotePOI(poiID, note) {
  return {
    type: CHANGE_NOTE_POI,
    poiID: poiID,
    note: note,
  };
}

export function delPlanPOI(poiID) {
  return {
    type: DEL_PLAN_POI,
    poiID: poiID,
  };
}

export function ratePlanPOI(poiID, rating) {
  return {
    type: RATE_PLAN_POI,
    poiID: poiID,
    rating: rating,
  };
}

export function toggleActive(poiID, newstate) {
  return {
    type: TOGGLE_ACTIVE,
    poiID: poiID,
    newstate: newstate,
  };
}

export function movePOI(poiID, direction) {
  return {
    type: MOVE_PLAN_POI,
    poiID: poiID,
    direction: direction,
  };
}

export function toggleOnboard(newstate) {
  return {
    type: TOGGLE_ONBOARD,
      needOnboarding: newstate,
  };
}

export function restoreState(state) {
  return {
    type: RESTORE_STATE,
    state: state,
  };
}

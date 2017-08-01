import * as AdminActionTypes from '../actiontypes/admin';


//==============================================================
//state={} is overwritten by initialState provided in index.js
export default function Admin(state={}, action){
  switch (action.type) {

    case AdminActionTypes.UPDATE_STATE: {
      // const findObjectByLabel = (obj, label, value) => {
      //   const keyArr = Object.keys(obj);
      //
      //   if(keyArr.includes(label)) {
      //     obj[label] = value;
      //     return obj;
      //   }
      //   for(let i = 0; i < keyArr.length; i++){
      //     //console.log("hi", obj[keyArr[i]]);
      //     if(typeof obj[keyArr[i]] === 'object') return this.findObjectByLabel(obj[keyArr[i]], label, value);
      //   }
      //   return null;
      // };

      let stateObj = {...state};
      Object.keys(action.newState).forEach((k) => {
        // this.findObjectByLabel(stateObj, k, action.newState[k]);
        if(k === "billing" || k === "selected" || k === "payment"){
          stateObj["checkout"][k] = action.newState[k];
        }
        else if(stateObj[k]){
          stateObj[k] = action.newState[k];
        }
      });

      console.log("action.newState", action.newState);
      console.log("stateObj", stateObj);

      return stateObj;
    }

    default:
      return state;
  }
}

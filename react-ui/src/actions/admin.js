import * as AdminActionTypes from '../actiontypes/admin';
import axios from 'axios';

// import {errorStatus} from '../../data/errorMessages';
import {initialUser, initialCheckout, initialMessage, initialEdit, initialData, blogID} from '../../../data/initialData';

//=======================================================
// const validateForm = (newData) => {
//   return Object.keys(newData).reduce((a, b) => {
//     return a && newData[b] !== '' && newData[b] !== undefined && newData[b].length > 0 && newData[b][0] !== '';
//   }, true);
// }

export const updateState = (newState) => {
  return {
    type: AdminActionTypes.UPDATE_STATE,
    newState
  }
}


export const getData = (url, thisPage) => {
  return (dispatch) => {

    return axios.get(url)
      .then(response => {
        console.log("response", response.data);
        // if(response.data.success === false){
        //   dispatch(updateState({
        //     user: initialUser,
        //     checkout: initialCheckout,
        //     message: {
        //       error: "Session expired. Log back in again to continue.",
        //       success: ""
        //     }
        //   }));
        // }

        let res = {};
        (Object.keys(initialData)).forEach((k) => res[k] = response.data[k]);

        dispatch(updateState({
          edit: initialEdit,
          message: initialMessage,
          data: res,
        }));

      })
      .catch(error => {
        console.log("error", error);
        //alert("Unable to load content at this time.")
        dispatch(updateState({
          message: error.message
        }));
      });
  }
};

export const putData = (url, newData) => {

  return (dispatch) => {

    return axios.put(url, newData)
      .then(response => {
        console.log("response data", response.data);
        dispatch(updateState({message: 'Yay!'}));
        // if(response.data.success === false){
        //   dispatch(updateState({
        //     message: {
        //       error: "Session expired. Log back in again to continue.",
        //       success: ""
        //     }
        //   }));
        // }
        // else
        // if(url.length <= 37 && url.contains("/locked/user")){
        //   //we are editing information on book page
        //   dispatch(updateState({
        //     edit: initialEdit,
        //     message: initialMessage,
        //     data: initialData,
        //     billing: {
        //       ...newData.billing,
        //       ...response.data.billing
        //     },
        //     payment: {
        //       ...newData.payment,
        //       ...response.data.payment
        //     }
        //
        //   }));
        // }
        // else {
        //   const res = (Array.isArray(response.data)) ? response.data : [response.data];
        //   dispatch(updateState({
        //     edit: initialEdit,
        //     message: initialMessage,
        //     data: res,
        //   }));
        // }
      })
      .catch(error => {
        console.log(error);
        dispatch(updateState({
          message: error.message
        }));
      });

  }
};



export const postData = (url, newData) => {
  return (dispatch) => {

    return axios.post(url, newData)
      .then(response => {
        dispatch(updateState({message: 'Yay!'}));
        // console.log("newData", newData);
        // console.log("response data", response.data);
        // if(response.data.success === false){
        //   dispatch(updateState({
        //     message: {
        //       error: "Session expired. Log back in again to continue.",
        //       success: ''
        //     }
        //   }));
        // }
        // else {
        //   if (url.includes('say')) { //if posting message
        //     dispatch(updateState({
        //       message: {
        //         "success": "Message sent!",
        //         "error": ""
        //       }
        //     }));
        //   }
        //   else if (url.includes('login')) { //if posting login
        //     if(url.includes('api')){
        //       dispatch(updateState({
        //         edit: initialEdit,
        //         message: initialMessage,
        //         user: response.data
        //       }));
        //     }
        //     else if(url.includes('locked')){
        //       dispatch(updateState({
        //         edit: initialEdit,
        //         message: initialMessage,
        //         user: response.data.user,
        //         billing: {
        //           ...initialCheckout.billing,
        //           ...response.data.billing
        //         },
        //         payment: {
        //           ...initialCheckout.payment,
        //           ...response.data.payment
        //         }
        //
        //       }));
        //     }
        //   }
        //   else if (url.includes('user-setup')) { //if signing up, login
        //     dispatch(postData('/locked/userlogin', {
        //       email: newData.email,
        //       password: newData.password
        //     }));
        //   }
        //   else if (url.includes('page')) { //if posting new page
        //     dispatch(updateState({
        //       edit: initialEdit,
        //       message: initialMessage,
        //       data: response.data
        //     }));
        //   }
        //   else { //if posting upcoming
        //     dispatch(updateState({
        //       message: {
        //         "success": "Thank you",
        //         "error": ""
        //       },
        //       edit: initialEdit,
        //       checkout: initialCheckout,
        //     }));
        //   }
        // }
      })
      .catch(error => {
        console.log(error);
        dispatch(updateState({message: error.message}));
        // if (url.includes('say')) { //if posting message
        //   dispatch(updateState({
        //     message: {
        //       "success": "",
        //       "error": "Unable to send Message"
        //     }
        //   }));
        // }
        // else if (url.includes('login')) { //if posting login
        //   dispatch(updateState({
        //     message: {
        //       "success": "",
        //       "error": "Username and/or password not found"
        //     }
        //   }));
        // }
        // else if (url.includes('page')) { //if posting new page
        //   dispatch(updateState({
        //     message: {
        //       "success": "",
        //       "error": "Unable to add data"
        //     }
        //   }));
        // }
        // else { //if posting upcoming
        //   dispatch(updateState({
        //     message: {
        //       "success": "",
        //       "error": "Unable to book stay."
        //     }
        //   }));
        // }
      });
  }
};

export const deleteData = (url) => {
  return (dispatch) => {

    return axios.delete(url)
    .then(response => {
      console.log("response data", response.data);
      dispatch(updateState({message: 'Yay!'}));
      // if(response.data.success === false){
      //   dispatch(updateState({
      //     // user: initialUser,
      //     // checkout: initialCheckout,
      //     message: {
      //       error: "Session expired. Log back in again to continue.",
      //       success: ''
      //     }
      //   }));
      // }
      // else {
      //   dispatch(updateState({
      //     edit: initialEdit,
      //     message: initialMessage,
      //     data: response.data,
      //   }));
      // }
    })
    .catch(error => {
      dispatch(updateState({message: error.message}));
      // console.log(error);
      // dispatch(updateState({
      //   message: {
      //     error: "Unable to delete data",
      //     success: ""
      //   }
      // }));
    });
  }
};



//(1) CHARGE CLIENT
//need to add later
export const chargeClient = (url, newData) => {
  return (dispatch) => {
    return dispatch(postData(url, newData))
    //return dispatch(updateClient({admin:clientInfo.admin, select:clientInfo.select}));
  }
};


//(1) REFUND CLIENT
//need to add later
///:userID/upcoming/:upcomingID
export const refundClient = (url) => {
  return (dispatch) => {
    return dispatch(postData(url))
    //"/:pageID/rooms/upcoming/:request"
    //console.log(clientInfo);
    //if(clientInfo.user.admin) return dispatch(deleteData(`/api/admin/${clientInfo.user.id}/${clientInfo.upcomingID}?token=${clientInfo.user.token}`));
    //else return dispatch(deleteData(`/locked/user/${clientInfo.user.id}/${clientInfo.upcomingID}?token=${clientInfo.user.token}`));
  }
}


//=============GET AVAILABLE ROOMS==============================
// Sync Action
//(3) SUCCESS/UPDATE DATA PROP
//(2) GET THE ROOM DATA FROM THE ID
export const filterSearch = (data, results) => {
  //fetch rooms from page
  console.log("FILTER", results);
  return (dispatch) => {
    return axios.get(`/page/${blogID}/rooms`)
      .then(response => {
        console.log("response data", response.data);
        //filter rooms that have too low maximum occupancy
        // let availableRooms = [];
        //
        // //filter rooms that are not available for each date
        // response.data.forEach((o,j) => {
        //   //with date[0] find the index with the correct roomID
        //   const i = results[0].map((f, index) => {if(o._id === f.roomID) return index; });
        //   const index = i[0];
        //   //for each date at index...
        //   //determine if reserved < o.available
        //   let lookup = false;
        //   if(o.maximumOccupancy >= data.guests) {
        //
        //     lookup = results.reduce((a,b) => {
        //       console.log(b[index]);
        //       return ((b[index]["reserved"] < o.available) && a);
        //     }, true);
        //
        //   }
        //
        //   if(lookup){
        //     availableRooms.push({...o, cost: o.cost * data.days});
        //   }
        // });
        // console.log(availableRooms);
        dispatch(updateState({
          data: response.data
        }));

      })
      .catch(error => {
        console.log(error);
        alert("Unable to load content at this time.")
      });
  }
}

//Async Action
//(1) GET ROOMS FROM DB USING DATES
export const fetchSearch = (data) => {

  // Returns a dispatcher function
  // that dispatches an action at a later time
  return (dispatch) => {
    //CREATE AN ARRAY OF DATES OBJECTS
    let end = data.depart - (24*60*60*1000);
    const begin = data.arrive;
    let dateArr = [];
    let results = [];

    while(end >= begin){
      dateArr.push(end);
      end = end - (24*60*60*1000);
    }
    //console.log("FETCH", dateArr);

    //USE ARRAY TO CALL AVAILABILITY FOR THAT DAY
    return dateArr.forEach((date) => {
      //returns a promise
      axios.get(`/rooms/${blogID}/${date}`)
      .then(response => {

        results.push(response.data.free);
        //dispatch another action
        //to consume data
        if(results.length === dateArr.length){
          dispatch(filterSearch({...data, days: dateArr.length}, results));
        }
      })
      .catch((error) => {
        if(error.message.includes("404")){
          axios.post("/rooms", {
            "pageID": blogID,
            "date": date
          })
          .then(res => {
            results.push(res.data.free);
            if(results.length === dateArr.length){
              dispatch(filterSearch({...data, days: dateArr.length}, results));
            }
          })
          .catch((error) => {
            //console.log(error.message);
            alert("Unable to check availability at this time")
          });
        }
        else {
          alert("Unable to check availability")
        }
      });
    });
  };
};

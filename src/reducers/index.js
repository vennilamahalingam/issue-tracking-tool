const initialState = {};
const userData = (state = initialState, action) => {
    switch (action.type) {
      case 'read' :
      return state;
      
      case 'update' :
      return action.payload;
      
      default: 
      return state;
    }
  }

  export default userData;
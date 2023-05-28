import { combineReducers } from 'redux';
import userReducer from './userReducer';
import recipeReducer from './recipeReducer';

const rootReducer = combineReducers({
    user: userReducer,
    recipe: recipeReducer
});

export default rootReducer;
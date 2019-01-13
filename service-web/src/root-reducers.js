import { combineReducers } from 'redux'
import { reducer as todoReducer } from './ducks/todo'
/*
import {reducer as stepReducer} from "./ducks/step";
import {reducer as userReducer} from "./ducks/user";
import {reducer as novelReducer} from "./ducks/novel";
import {reducer as appReducer} from "./ducks/app";
import {reducer as chapterReducer} from "./ducks/chapter";
*/

const rootReducer = combineReducers({
  todo: todoReducer,
})

export default rootReducer

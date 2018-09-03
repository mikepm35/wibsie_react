import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userUpdate: ['id', 'blend', 'email'],
  changeBlend: ['blend']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  id: null,
  blend: null,
  email: null
})

/* ------------- Selectors ------------- */

export const UserSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const userUpdate = (state, { id, blend, email }) => {
  return state.merge({ id: id, blend: blend, email: email })
}

export const changeBlend = (state, { blend }) => {
  return state.merge({ blend: blend })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_UPDATE]: userUpdate,
  [Types.CHANGE_BLEND]: changeBlend
})

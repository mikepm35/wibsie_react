import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  changeZip: ['zip'],
  changeOverride: ['override']
})

export const LocationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  zip: null,
  override: false
})

/* ------------- Selectors ------------- */

export const LocationSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const changeZip = (state, { zip }) => {
  return state.merge({ zip: zip })
}

export const changeOverride = (state, { override }) => {
  return state.merge({ override: override })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_ZIP]: changeZip,
  [Types.CHANGE_OVERRIDE]: changeOverride
})

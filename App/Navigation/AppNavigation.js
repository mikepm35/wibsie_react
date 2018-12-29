import { StackNavigator } from 'react-navigation'
import SignupScreen from '../Containers/SignupScreen'
import LoginScreen from '../Containers/LoginScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import WeatherScreen from '../Containers/WeatherScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles, { tintColor } from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  SignupScreen: { screen: SignupScreen },
  LoginScreen: { screen: LoginScreen },
  SettingsScreen: { screen: SettingsScreen },
  WeatherScreen: { screen: WeatherScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'float',
  initialRouteName: 'LoginScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav

import React, { Component } from 'react'
import { AsyncStorage, SafeAreaView } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import RoundedButton from '../../App/Components/RoundedButton';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingsScreenStyle'

class SettingsScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {};
  }

  _logout = async () => {
    try {
      await AsyncStorage.removeItem('wibsie:userid');
      this.props.navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Error deleting user data from local: ', error);
    }
   };

  static navigationOptions = ({navigation}) => {
    return {
      gesturesEnabled: true,
      headerTitle: 'Settings',
      headerTintColor: 'white',
      headerRight: null,
    };
  };

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <RoundedButton
          disabled={false}
          onPress={() => this._logout()}>
          Logout
        </RoundedButton>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)

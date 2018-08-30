import React, { Component } from 'react'
import { AsyncStorage, SafeAreaView, Text, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import RoundedButton from '../../App/Components/RoundedButton';
import WibsieConfig from '../Config/WibsieConfig'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingsScreenStyle'

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: WibsieConfig,
      user: {email: '<email>',
              id: ''}
    }

    updateUserFromLocal = async () => {
      try {
        var userid = await AsyncStorage.getItem('wibsie:userid');
        var email = await AsyncStorage.getItem('wibsie:useremail');
        console.log('Retrieved local user data: ', userid, email);
        this.setState({
          user: {email: email,
                  password: userid}
        });
      } catch (error) {
        console.log('Error updating user from local: ', error);
      }
    }
  }

  _logout = async () => {
    try {
      await AsyncStorage.removeItem('wibsie:userid');
      await AsyncStorage.removeItem('wibsie:useremail');
      this.props.navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Error deleting user data from local: ', error);
    }
   };

   componentDidMount() {
     updateUserFromLocal();
   }

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
        <View style={styles.emailRow}>
          <Text style={styles.emailText}>Logged in as:</Text>
          <Text style={styles.emailText}>{this.state.user.email}</Text>
        </View>
        <View style={styles.logoutButtonRow}>
          <RoundedButton
            disabled={false}
            onPress={() => this._logout()}>
            Logout
          </RoundedButton>
        </View>
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

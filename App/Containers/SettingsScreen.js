import React, { Component } from 'react'
import { AsyncStorage, SafeAreaView, Text, View, TextInput } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import RoundedButton from '../../App/Components/RoundedButton';
import WibsieConfig from '../Config/WibsieConfig'
import { Colors } from '../Themes/'
import Icon from 'react-native-vector-icons/MaterialIcons';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import LocationActions from '../Redux/LocationRedux'
import UserActions from '../Redux/UserRedux'

// Styles
import styles from './Styles/SettingsScreenStyle'

class CheckIcon extends Component {
  render () {
    return (
      <Icon style={styles.icon} name="check-circle" size={20} color={Colors.green} />
    )
  }
}

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: WibsieConfig,
      user: {email: '<email>',
              id: ''},
      zipSave: {
        zip: '',
        color: Colors.charcoal,
        icon: 'radio-button-unchecked',
        saved: false
      }
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

    this.props.setZip(null);
    this.props.setOverride(false);
    this.props.setUser(null, null, null);
   };

   _updateZipSave = (zip) => {
     var isnum = /^\d+$/.test(zip);
     var saved = false;

     if (zip==null | zip=='') {
       var color = Colors.charcoal;
       var icon = 'radio-button-unchecked';
       if (this.props.override) {
         this.props.setZip(null);
         this.props.setOverride(false);
       }
     } else {
       if (zip.length == 5 & isnum) {
         var color = Colors.green;
         var icon = 'check-circle';
         var saved = true;
         this.props.setZip(zip);
         this.props.setOverride(true);
       } else {
         var color = Colors.error;
         var icon = 'cancel';
       }
     }

     this.setState({
       zipSave: {...this.state.zipSave,
                   zip: zip,
                   color: color,
                   icon: icon,
                  saved: saved}
     });
   }

   componentDidMount() {
     updateUserFromLocal();
     if (this.props.override == true) {
       this._updateZipSave(this.props.zip);
     }
  }

  componentWillUnmount() {
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
        <View style={styles.row}>
          <Text style={styles.inputLabel}>Override location zip code:</Text>
          <View style={styles.inputIconRow}>
            <TextInput
              style={styles.textInput}
              placeholder={'zip'}
              placeholderTextColor={Colors.charcoal}
              autoCapitalize={'none'}
              onChangeText={(zip) => this._updateZipSave(zip)}
              value={this.props.override ? this.props.zip:''}
            />
            <Icon style={styles.icon} name={this.state.zipSave.icon} size={20} color={this.state.zipSave.color} />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.inputLabel}>Logged in as:</Text>
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
  console.log('mapStateToProps: ', state);
  return {
    zip: state.location.zip,
    override: state.location.override
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setZip: (zip) => dispatch(LocationActions.changeZip(zip)),
    setOverride: (override) => dispatch(LocationActions.changeOverride(override)),
    setUser: (id, blend, email) => dispatch(UserActions.userUpdate(id, blend, email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)

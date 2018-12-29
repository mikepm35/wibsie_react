import React, { Component } from 'react';
import { AsyncStorage, Text, View, SafeAreaView, Button, TextInput, ImageBackground, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RoundedButtonDark from '../../App/Components/RoundedButtonDark';
import RoundedButtonHollow from '../../App/Components/RoundedButtonHollow';
import { Colors } from '../Themes/';
import { connect } from 'react-redux';
import axios from 'axios';
import WibsieConfig from '../Config/WibsieConfig'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import UserActions from '../Redux/UserRedux'

// Styles
import styles from './Styles/LoginScreenStyle'

class LoginScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {
        config: WibsieConfig,
        user: {email: '',
                password: '',
                blend: null},
        disabledControls: {loginDisabled: false,
                            loginActivity: false}
      }

      resetInputs = () => {
        this.setState({
          user: {email: '',
                  password: ''}
        });
      };

      updateLoginActivity = (active) => {
        if (active) {
          this.setState({
            disabledControls: {...this.state.disabledControls,
                    loginDisabled: true,
                    loginActivity: true}
          });
        } else {
          this.setState({
            disabledControls: {...this.state.disabledControls,
                    loginDisabled: false,
                    loginActivity: false}
          });
        }
      };

      updateUserData = (data) => {
        var blend = null;
        if (data.hasOwnProperty('model')) {
          blend = data.model.model_blend_pct
        }

        this.setState({
          user: {...this.state.user,
                  id: data.id,
                  blend: blend,
                  birth_year: data.birth_year,
                  gender: data.gender,
                  height_in: data.height_in,
                  lifestyle: data.lifestyle,
                  weight_lb: data.weight_lb}
        });
        // Add to persistent storage
        storeUserLocal();

        // Add to redux
        this.props.setUser(data.id, blend, data.email);
      };

      storeUserLocal = async () => {
        try {
          console.log('Storing user state locally: ', this.state.user, this.state.user.blend.toString());
          await AsyncStorage.setItem('wibsie:userid', this.state.user.id);
          await AsyncStorage.setItem('wibsie:blend', this.state.user.blend.toString());
          await AsyncStorage.setItem('wibsie:useremail', this.state.user.email);
        } catch (error) {
          console.log('Error storing user from login: ', error);
        }
      }

  }

  _checkCredentials(navigation) {
    updateLoginActivity(true);

    let urlUserQuery = this.state.config.endpointAPI + '/users/query' + '?schema=' + this.state.config.schema;

    // Validate if email is an email
    if (this.state.user.email.indexOf('@') < 0 || this.state.user.email.indexOf('.') < 0 || this.state.user.email.length > 75) {
      Alert.alert(
        'Error',
        'E-mail address is not valid.',
        [
          {text: 'OK', onPress: () => {this.setState({validInput: false});}},
        ],
        { cancelable: false }
      )
      updateLoginActivity(false);
      return;
    }

    // Validate if password meets complexity requirements
    if (this.state.user.password.length < 6 || this.state.user.password.length > 75) {
      Alert.alert(
        'Error',
        'Password must be at least 6 characters.',
        [
          {text: 'OK', onPress: () => {this.setState({validInput: false});}},
        ],
        { cancelable: false }
      )
      updateLoginActivity(false);
      return;
    }

    const axiosClient = axios.create();
    axiosClient.defaults.timeout = 10*1000;

    axiosClient.post(urlUserQuery, {
        email: this.state.user.email,
        password: this.state.user.password
      }, {headers: {'AuthToken': this.state.config.authToken}})
      .then(function (response) {
        console.log('Success user query: ', response);
        updateUserData(response.data);
        navigation.navigate('WeatherScreen', {user: response.data});
        updateLoginActivity(false);
      })
      .catch(function (error) {
        console.log('Error user query: ', error.response);

        var alertError = 'Server error, please try again.';
        if (error.response == undefined) {
          console.log('Error response undefined for user _checkCredentials');
          alertError = 'Please check your connection and try again.';
        }
        else if (error.response.status === 404) {
          console.log('User not found');
          alertError = 'Incorrect username or password.';
        } else {
          console.log('Non 404 returned for user _checkCredentials');
          alertError = 'Please check your connection and try again.';
        }
        Alert.alert(
          'Error',
          alertError,
          [
            {text: 'OK', onPress: () => resetInputs()},
          ],
          { cancelable: false }
        )
        updateLoginActivity(false);
      });
  };

  _loadUserFromId(userid) {
    let url = this.state.config.endpointAPI + '/users/' + userid + '?schema=' + this.state.config.schema;
    console.log('User id get url: ', url);

    axios.get(url, {headers: {'AuthToken': this.state.config.authToken}})
      .then(function (response) {
        console.log('Success userid query', response);
        updateUserData(response.data);
      })
      .catch(function (error) {
        console.log('Error fetching user from id: ', error, error.request);
      });
  }

  _getUserFromLocal = async () => {
    try {
      const userid = await AsyncStorage.getItem('wibsie:userid');
      const email = await AsyncStorage.getItem('wibsie:useremail');
      const blendStr = await AsyncStorage.getItem('wibsie:blend');
      const blend = Number(blendStr);
      if (userid !== null) {
        console.log('Retrieved user data from local: ', userid, blendStr, blend, email);
        // Load to redux
        this.props.setUser(userid, blend, email);

        // Hit api to pull user info
        this._loadUserFromId(userid);

        // Navigate away
        this.props.navigation.navigate('WeatherScreen', {user: {id: userid}});

      } else {
        console.log('No userid retrieved from local');
      }
    } catch (error) {
      console.log('Error fetching user data from local: ', error);
    }
   };

  static navigationOptions = ({navigation}) => {
    return {
      header: null
    };
  };

  componentDidMount() {
    this._getUserFromLocal();
  }

  render () {
    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../Images/nathan-dumlao-314494-unsplash.jpg')}
      >
        <SafeAreaView style={styles.loginContainer}>
          <View style={styles.logoView}>
            <Text style={styles.logoText}>Wibsie</Text>
          </View>
          <View style={styles.descriptionView}>
          <Text style={styles.descriptionText}>{"Weather for you \nPowered by machine learning"}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={'email'}
            placeholderTextColor={Colors.charcoal}
            autoCapitalize={'none'}
            onChangeText={(email) => this.setState({user: {...this.state.user, email: email}})}
            value={this.state.user.email}
          />
          <TextInput
            style={styles.textInput}
            placeholder={'password'}
            placeholderTextColor={Colors.charcoal}
            autoCapitalize={'none'}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({user: {...this.state.user, password: password}})}
            value={this.state.user.password}
          />
          <RoundedButtonDark
            disabled={this.state.disabledControls.loginDisabled}
            showActivityIndicator={this.state.disabledControls.loginActivity}
            onPress={() => this._checkCredentials(this.props.navigation)}>
            Login
          </RoundedButtonDark>
          <RoundedButtonHollow
            disabled={false}
            onPress={() => this.props.navigation.navigate('SignupScreen')}>
            Sign up
          </RoundedButtonHollow>
        </SafeAreaView>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  //console.log('mapStateToProps: ', state);
  return {
    id: state.user.id,
    blend: state.user.blend,
    email: state.user.email
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (id, blend, email) => dispatch(UserActions.userUpdate(id, blend, email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

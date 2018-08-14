import React, { Component } from 'react';
import { AsyncStorage, Text, View, SafeAreaView, Button, TextInput, ImageBackground, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RoundedButtonDark from '../../App/Components/RoundedButtonDark';
import RoundedButtonHollow from '../../App/Components/RoundedButtonHollow';
import { Colors } from '../Themes/';
import { connect } from 'react-redux';
import axios from 'axios';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/LoginScreenStyle'

class LoginScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {
        config: {endpointAPI: 'https://dev-api.wibsie.com/app',
                  endpointML: 'https://dev-api.wibsie.com/ml',
                  authToken: '6d2a3a86ae6b4fffa5448c6bcb5c6c34'},
        user: {email: '',
                password: ''}
      }

      resetInputs = () => {
        this.setState({
          user: {email: '',
                  password: ''}
        });
      };

      updateUserData = (data) => {
        this.setState({
          user: {...this.state.user,
                  id: data.id,
                  birth_year: data.birth_year,
                  gender: data.gender,
                  height_in: data.height_in,
                  lifestyle: data.lifestyle,
                  weight_lb: data.weight_lb}
        });
        // Add to persistent storage
        storeUserLocal();
      };

      storeUserLocal = async () => {
        try {
          await AsyncStorage.setItem('wibsie:userid', this.state.user.id);
        } catch (error) {
          console.log('Error storing user from login: ', error);
        }
      }

  }

  _checkCredentials(navigation) {
    let urlUserQuery = this.state.config.endpointAPI + '/users/query';

    axios.post(urlUserQuery, {
        email: this.state.user.email,
        password: this.state.user.password
      }, {headers: {'AuthToken': this.state.config.authToken}})
      .then(function (response) {
        console.log('Success user query: ', response);
        updateUserData(response.data);
        navigation.navigate('WeatherScreen', {user: response.data});
      })
      .catch(function (error) {
        console.log('Error user query: ', error);

        var alertError = 'Server error, please try again.';
        if (error.response.status === 404) {
          console.log('User not found');
          alertError = 'Incorrect username or password.';
        }
        Alert.alert(
          'Error',
          alertError,
          [
            {text: 'OK', onPress: () => resetInputs()},
          ],
          { cancelable: false }
        )
      });
  };

  _getUserFromLocal = async () => {
    try {
      const userid = await AsyncStorage.getItem('wibsie:userid');
      if (userid !== null) {
        console.log('Retrieved user data from local: ', userid);
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
            disabled={false}
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
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

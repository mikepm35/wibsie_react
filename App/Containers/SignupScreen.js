import React, { Component } from 'react'
import { Text, SafeAreaView, View, TextInput, Picker, Alert } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Colors } from '../Themes/'
import { connect } from 'react-redux'
import RoundedButton from '../../App/Components/RoundedButton'
import axios from 'axios'
import WibsieConfig from '../Config/WibsieConfig'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

const calendar = require('../Lib/calendar.js');

// Styles
import styles from './Styles/SignupScreenStyle'

class SignupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      config: WibsieConfig,
      user: {email: '',
              password: '',
              passwordTwo: '',
              birth_year: 1980,
              birth_month: 6,
              birth_day: 15,
              gender: 'male',
              height_in: '60',
              weight_lb: 150,
              lifestyle: 'moderate_activity'},
    disabledControls: {createButton: false,
                      showCreateButtonActivity: false}
    }

    addUserId = (id) => {
      this.setState({
        user: {...this.state.user,
                id: id}
      });
    };

    resetInputs = () => {
      this.setState({
        user: {email: '',
                password: '',
                passwordTwo: ''}
      });
    };

    updateCreateActivity = (active) => {
      if (active) {
        this.setState({
          disabledControls: {...this.state.disabledControls,
                  createButton: true,
                  showCreateButtonActivity: true}
        });
      } else {
        this.setState({
          disabledControls: {...this.state.disabledControls,
                  createButton: false,
                  showCreateButtonActivity: false}
        });
      }
    };

  }

  _createAccount(navigation) {
    updateCreateActivity(true);

    let urlUser = this.state.config.endpointAPI + '/users' + '?schema=' + this.state.config.schema;
    let authToken = this.state.config.authToken;

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
      updateCreateActivity(false);
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
      updateCreateActivity(false);
      return;
    }

    // Validate if passwords match
    if (this.state.user.password != this.state.user.passwordTwo) {
      Alert.alert(
        'Error',
        'Passwords do not match.',
        [
          {text: 'OK', onPress: () => {this.setState({validInput: false});}},
        ],
        { cancelable: false }
      )
      updateCreateActivity(false);
      return;
    }

    console.log('Starting create user post: ', this.state.user);
    axios.post(urlUser, {
        email: this.state.user.email,
        password: this.state.user.password,
        birth_year: this.state.user.birth_year,
        gender: this.state.user.gender,
        height_in: this.state.user.height_in,
        weight_lb: this.state.user.weight_lb,
        lifestyle: this.state.user.lifestyle
      }, {headers: {'AuthToken': authToken}})
      .then(function (response) {
        console.log('Success user create: ', response);
        addUserId(response.data.id);
        navigation.navigate('WeatherScreen', {user: response.data});
        updateCreateActivity(false);
      })
      .catch(function (error) {
        console.log('Error user create: ', error);
        var alertError = 'Server error creating user.'
        if (error.response.status === 409) {
          console.log('Email already exists');
          alertError = 'Email already exists';
        }
        Alert.alert(
          'Error',
          alertError,
          [
            {text: 'OK', onPress: () => {}},
          ],
          { cancelable: false }
        )
        updateCreateActivity(false);
      });
  };

  static navigationOptions = ({navigation}) => {
    return {
      gesturesEnabled: true,
      headerTitle: 'Sign Up',
      headerTintColor: 'white',
      headerRight: null,
    };
  };

  componentDidMount() {
    const monthMap = calendar.monthObject();
    const monthDayMap = calendar.monthDayIntegerObject();
    console.log('monthMap', monthMap);
    console.log('monthDayMap', monthDayMap);
  }

  render () {
    var heightMap = {};
    var stepFt;
    for (stepFt = 3; stepFt <= 7; stepFt++) {
      var stepIn;
      for (stepIn = 0; stepIn <= 11; stepIn++) {
        let stepStr = stepFt.toString()+"'"+stepIn.toString()+'"';
        let stepInTotal = stepFt*12 + stepIn;
        heightMap[stepInTotal] = stepStr;
      }
    }

    var weightList = [];
    var step;
    for (step = 50; step <= 500; step++) {
      weightList.push(step);
    }

    var yearList = [];
    var currentYear = new Date().getFullYear();
    var step;
    for (step = 1900; step <= currentYear; step++) {
      yearList.push(step);
    }

    const monthMap = calendar.monthObject();
    const monthDayMap = calendar.monthDayIntegerObject();

    const genderOptions = {'male': 'Male', 'female': 'Female'};

    const lifestyleOptions = {'sedentary': 'Not Active',
                              'moderate_activity': 'Moderately Active',
                              'high_activity': 'Highly Active'}

    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TextInput
            style={styles.textInput}
            placeholder={'email'}
            placeholderTextColor={Colors.charcoal}
            autoCapitalize={'none'}
            onChangeText={(email) => this.setState({user: {...this.state.user, email: email}})}
            value={this.state.user.email}
          />
        </View>
        <View>
          <TextInput
            style={styles.textInput}
            placeholder={'password'}
            placeholderTextColor={Colors.charcoal}
            autoCapitalize={'none'}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({user: {...this.state.user, password: password}})}
            value={this.state.user.password}
          />
        </View>
        <View>
          <TextInput
            style={styles.textInput}
            placeholder={'re-enter password'}
            placeholderTextColor={Colors.charcoal}
            autoCapitalize={'none'}s
            secureTextEntry={true}
            onChangeText={(passwordTwo) => this.setState({user: {...this.state.user, passwordTwo: passwordTwo}})}
            value={this.state.user.passwordTwo}
          />
        </View>
        <View style={styles.pickerRow}>
          <Picker
            selectedValue={this.state.user.height_in}
            style={styles.pickerStyle}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({user: {...this.state.user, height_in: itemValue}})}>
            {Object.keys(heightMap).map(key => {
              return (<Picker.Item label={heightMap[key]} value={key}/>)
            })}
          </Picker>
          <Picker
            selectedValue={this.state.user.weight_lb}
            style={styles.pickerStyle}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({user: {...this.state.user, weight_lb: itemValue}})}>
            {weightList.map((item,index) => {
              return (<Picker.Item label={item.toString()+'lb'} value={item}/>)
            })}
          </Picker>
          <Picker
            selectedValue={this.state.user.gender}
            style={styles.pickerStyle}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({user: {...this.state.user, gender: itemValue}})}>
            {Object.keys(genderOptions).map(key => {
              return (<Picker.Item label={genderOptions[key]} value={key}/>)
            })}
          </Picker>
        </View>
        <View style={styles.pickerRow}>
          <Picker
            selectedValue={this.state.user.birth_month}
            style={styles.datepickerLeft}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({user: {...this.state.user, birth_month: itemValue}})}>
            {Object.keys(monthMap).map(key => {
              return (<Picker.Item label={monthMap[key]} value={key}/>)
            })}
          </Picker>
          <Picker
            selectedValue={this.state.user.birth_day}
            style={styles.datepickerInner}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({user: {...this.state.user, birth_day: itemValue}})}>
            {monthDayMap[this.state.user.birth_month].map((item,index) => {
              return (<Picker.Item label={item.toString()} value={item}/>)
            })}
          </Picker>
          <Picker
            selectedValue={this.state.user.birth_year}
            style={styles.datepickerRight}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({user: {...this.state.user, birth_year: itemValue}})}>
            {yearList.map((item,index) => {
              return (<Picker.Item label={item.toString()} value={item}/>)
            })}
          </Picker>
        </View>
        <View style={styles.pickerRow}>
          <Picker
            selectedValue={this.state.user.lifestyle}
            style={styles.lifestylePickerStyle}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({user: {...this.state.user, lifestyle: itemValue}})}>
            {Object.keys(lifestyleOptions).map(key => {
              return (<Picker.Item label={lifestyleOptions[key]} value={key}/>)
            })}
          </Picker>
        </View>
        <View>
          <RoundedButton
            disabled={this.state.disabledControls.createButton}
            showActivityIndicator={this.state.disabledControls.showCreateButtonActivity}
            onPress={() => this._createAccount(this.props.navigation)}>
            Create Account
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)

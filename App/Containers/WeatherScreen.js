import React, { Component } from 'react'
import { ScrollView, Text, View, SafeAreaView, Picker, Button, TouchableHighlight, TouchableOpacity, Alert } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons';
import RoundedButton from '../../App/Components/RoundedButton'
import RoundedButtonExp from '../../App/Components/RoundedButtonExp'
import { DotIndicator } from 'react-native-indicators';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/WeatherScreenStyle'

class WeatherScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      config: {endpointAPI: 'https://api.wibsie.com/app',
                endpointML: 'https://api.wibsie.com/ml',
                authToken: '6d2a3a86ae6b4fffa5448c6bcb5c6c34'},
      disabledControls: {experiencePicker: false,
                          predictionButton: true,
                          showReset: false,
                          predictionResponse: true,
                          showPredictionButtonActivity: false},
      user: {},
      location: {zip: '--'},
      geolocation: {latitude: null,
                    longitude: null,
                    error: null},
      weatherCreatedLocal: '--',
      weather: {temperature: '--',
                summary: '--',
                humidity: '--',
                windSpeed: '--'},
      experience: {activity: 'standing',
                        upper_clothing: 'long_sleeves',
                        lower_clothing: 'shorts'},
      prediction: {primaryPercent: '--',
                    primaryResult: '--'}
    }

    loadUserData = (data) => {
      console.log('User data to load: ', data, data.id);
      this.setState({
        user: data
      });
    };

    resetPredictionData = () => {
      this.setState({
        prediction: {primaryPercent: '--',
                      primaryResult: '--'}
      });
      console.log('Prediction reset: ', this.state.prediction);
    };

    updatePredictionActivity = (showBool) => {
      this.setState({
        disabledControls: {...this.state.disabledControls,
                            showPredictionButtonActivity: showBool}
      });
    }

    updateWeatherCreatedLocal = () => {
        var date, month, day, ampm, hour, minutes, fullTime;
        date = new Date();

        month = date.getMonth();
        day = date.getDate();

        hour = date.getHours();

        if (hour <= 11) {
          ampm = 'am';
        } else {
          ampm = 'pm';
        }

        if (hour > 12) {
          hour = hour - 12;
        } else if (hour == 0) {
          hour = 12;
        }

        minutes = date.getMinutes();
        if (minutes < 10) {
          minutes = '0' + minutes.toString();
        }

        let weatherCreatedLocal = month.toString() + '/' + day.toString() + ' ' + hour.toString() + ':' + minutes.toString() + ' ' + ampm.toString();
        this.setState({
          weatherCreatedLocal: weatherCreatedLocal
        });
    };

    updateWeatherData = (data) => {
      this.setState({
        weather: {created: data.created,
                  expires: data.expires,
                  temperature: data.temperature.toFixed(0),
                  summary: data.summary,
                  humidity: (data.humidity*100).toFixed(0),
                  windSpeed: data.windSpeed.toFixed(1)},
        disabledControls: {...this.state.disabledControls,
                            experiencePicker: false,
                            predictionButton: false,
                            showReset: false,
                            predictionResponse: true}
      });
      updateWeatherCreatedLocal();
      resetPredictionData();
      console.log('New weather data: ', this.state.weather);
    };

    updateLocationData = (data) => {
      this.setState({
        location: {...this.state.location,
                    zip: data.zip}
      });
      this._getWeather();
    };

    updateExperienceData = (data) => {
      // Also clear prediction result when experience is updated
      this.setState({
        experience: {...this.state.experience,
                      created: data.created}
      });
      resetPredictionData();
      console.log('New experience data: ', this.state.experience);
    };

    updatePredictionData = (data) => {
      let comfortPredict = data[0].comfortable;
      let uncomfortPredict = data[0].uncomfortable;

      if (comfortPredict >= 0.5) {
        var primaryPercent = (comfortPredict*100).toFixed(0);
        var primaryResult = 'Comfortable';
      } else {
        var primaryPercent = (uncomfortPredict*100).toFixed(0);
        var primaryResult = 'Uncomfortable';
      }

      this.setState({
        prediction: {comfortPredict: comfortPredict,
                      uncomfortPredict: uncomfortPredict,
                      primaryPercent: primaryPercent,
                      primaryResult: primaryResult},
        disabledControls: {...this.state.disabledControls,
                            experiencePicker: true,
                            predictionButton: true,
                            showReset: true,
                            predictionResponse: false,
                            showPredictionButtonActivity: false}
      });
      console.log('New prediction data: ', this.state.prediction);
    };

  }

  _getWeather() {
    let endpointAPI = this.state.config.endpointAPI;
    let authToken = this.state.config.authToken;
    let zip = this.state.location.zip;

    if (zip == '--') {
      console.log('No zip loaded, running _updateCurrentPosition');
      this._updateCurrentPosition();
    }

    let url = endpointAPI + '/weatherreports?epoch=now&location=' + zip;

    console.log('Weather url', url, authToken);

    axios.get(url, {headers: {'AuthToken': authToken}})
      .then(function (response) {
        console.log('Success', response);
        updateWeatherData(response.data);
      })
      .catch(function (error) {
        console.log('Error: ', error, error.request);
        Alert.alert(
          'Error',
          'Error retrieving weather.',
          [
            {text: 'OK', onPress: () => {}},
          ],
          { cancelable: false }
        );
      });
  }

  _updatePredictionResponse(result) {
    console.log('Starting _runPredictionWorkflow');

    let endpointAPI = this.state.config.endpointAPI;
    let authToken = this.state.config.authToken;
    let userId = this.state.user.id;
    let experienceCreated = this.state.experience.created;

    this.setState({
      disabledControls: {...this.state.disabledControls,
                          predictionResponse: true}
    });

    // Start update experience with prediction result
    let urlExperiences = endpointAPI + '/users/' + userId + '/experiences';
    let urlExperienceUpdate = urlExperiences + '/' + experienceCreated.toString();
    console.log('Starting experience update for prediction result: ', urlExperienceUpdate);
    axios.put(urlExperienceUpdate, {
      comfort_level_result: result,
    }, {headers: {'AuthToken': authToken}})
    .then(function (response) {
      console.log('Success update experience for prediction', response);
    })
    .catch(function (error) {
      console.log('Error update experience for prediction', error);
    });
  }

  _runPredictionWorkflow() {
    // Creates experience, runs prediction, updates experience
    console.log('Starting _runPredictionWorkflow');

    let endpointAPI = this.state.config.endpointAPI;
    let authToken = this.state.config.authToken;
    let endpointML = this.state.config.endpointML;
    let userId = this.state.user.id;
    let weatherExpires = this.state.weather.expires;
    let zip = this.state.location.zip;
    let activity = this.state.experience.activity;
    let upper_clothing = this.state.experience.upper_clothing;
    let lower_clothing = this.state.experience.lower_clothing;

    let urlExperiences = endpointAPI + '/users/' + userId + '/experiences';
    let urlPredict = endpointML + '/infer';

    this.setState({
      disabledControls: {...this.state.disabledControls,
                          experiencePicker: true,
                          predictionButton: true,
                          showReset: true,
                          predictionResponse: true,
                          showPredictionButtonActivity: true}
    });

    // Start create experience
    axios.post(urlExperiences, {
        zip: zip,
        weather_expiration: weatherExpires,
        activity: activity,
        upper_clothing: upper_clothing,
        lower_clothing: lower_clothing,
        comfort_level_result: 'none',
        comfort_level_prediction: 'none',
      }, {headers: {'AuthToken': authToken}})
      .then(function (response) {
        console.log('Success create experience', response);
        updateExperienceData(response.data);
        let experienceCreated = response.data.created;

        // Start make prediction
        console.log('Starting prediction');
        axios.post(urlPredict, {
            user_id: userId,
            experience_created: experienceCreated
          }, {headers: {'AuthToken': authToken}})
          .then(function (response) {
            console.log('Success make prediction', response);
            updatePredictionData(response.data);

            // Start update experience with prediction result
            let comfortPredict = response.data[0].comfortable;
            let urlExperienceUpdate = urlExperiences + '/' + experienceCreated.toString();
            console.log('Starting experience update: ', urlExperienceUpdate);
            axios.put(urlExperienceUpdate, {
              zip: zip,
              weather_expiration: weatherExpires,
              activity: activity,
              upper_clothing: upper_clothing,
              lower_clothing: lower_clothing,
              comfort_level_result: 'none',
              comfort_level_prediction: comfortPredict,
            }, {headers: {'AuthToken': authToken}})
            .then(function (response) {
              console.log('Success update experience', response);
            })
            .catch(function (error) {
              console.log('Error update experience', error);
            });

          })
          .catch(function (error) {
            console.log('Error make prediction', error);
            updatePredictionActivity(false);
            Alert.alert(
              'Error',
              'Server error making prediction',
              [
                {text: 'OK', onPress: () => {}},
              ],
              { cancelable: false }
            )
          });
      })
      .catch(function (error) {
        console.log('Error create experience', error);
        updatePredictionActivity(false);
      });
  }

  _updateCurrentPosition() {
    let endpointAPI = this.state.config.endpointAPI;
    let authToken = this.state.config.authToken;

    let urlZipfromlatlong = endpointAPI + '/locations/zipFromLatLong';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Received geolocation: ', position);
        this.setState({
          geolocation: {latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null}
        });
        // Get zip from lat long
        console.log('Retrieving zip from latlong: ', urlZipfromlatlong, authToken);
        axios.post(urlZipfromlatlong, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }, {headers: {'AuthToken': authToken}})
        .then(function (response) {
          console.log('Success retrieving zip', response);
          updateLocationData(response.data);
        })
        .catch(function (error) {
          console.log('Error retrieving zip', error, error.request);
        });
      },
      (error) => this.setState({ geolocation: {...this.state.geolocation, error: error.message} }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  componentDidMount() {
    loadUserData(this.props.navigation.state.params.user);
    this._updateCurrentPosition();
  }

  static navigationOptions = ({navigation, state}) => {
    return {
      gesturesEnabled: false,
      headerTitle: '',
      headerLeft: null,
      headerRight: (
        <TouchableOpacity style={{paddingHorizontal: 10}} onPress={() => navigation.navigate('SettingsScreen')}>
          <Icon name="settings" size={17} color="white" />
        </TouchableOpacity>
      ),
    };
  };

  render () {
    const activityOptions = {
      'standing': 'Standing',
      'walking': 'Walking',
      'exercising': 'Exercising'
    };
    const activityKeys = Object.keys(activityOptions);

    const upperClothingOptions = {
      'long_sleeves': 'Long Sleeves',
      'short_sleeves': 'Short Sleeves',
      'jacket': 'Jacket',
      'no_shirt': 'No Shirt'
    };
    const upperClothingKeys = Object.keys(upperClothingOptions);

    const lowerClothingOptions = {
      'shorts': 'Shorts',
      'pants': 'Pants'
    };
    const lowerClothingKeys = Object.keys(lowerClothingOptions);

    return (
      <SafeAreaView style={styles.weatherContainer}>
        <View style={styles.weatherRow}>
          <View style={styles.weatherCols}>
            <TouchableOpacity style={{paddingHorizontal: 10}} onPress={()=>this._getWeather()}>
              <Text style={styles.tempText}>{this.state.weather.temperature+'\u00B0'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weatherCols}>
            <Text style={styles.weatherText}>{this.state.weather.summary}</Text>
            <Text style={styles.weatherText}>{this.state.weather.windSpeed} mph</Text>
            <Text style={styles.weatherText}>{this.state.weather.humidity}% Humidity</Text>
          </View>
        </View>
        <View style={styles.weatherInfoRow}>
          <Text style={styles.weatherInfoText}>{this.state.location.zip+'  \u00B7  '+this.state.weatherCreatedLocal}</Text>
        </View>
        <View style={styles.pickerRow}>
          <Picker
            selectedValue={this.state.experience.activity}
            style={styles.pickerStyle}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({experience: {...this.state.experience, activity: itemValue}})}>
            {(this.state.disabledControls.experiencePicker ? [this.state.experience.activity]:activityKeys).map((item,index) => {
              return (<Picker.Item label={activityOptions[item]} value={item}/>)
            })}
          </Picker>
          <Picker
            selectedValue={this.state.experience.upper_clothing}
            style={styles.pickerStyle}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({experience: {...this.state.experience, upper_clothing: itemValue}})}>
            {(this.state.disabledControls.experiencePicker ? [this.state.experience.upper_clothing]:upperClothingKeys).map((item,index) => {
              return (<Picker.Item label={upperClothingOptions[item]} value={item}/>)
            })}
          </Picker>
          <Picker
            selectedValue={this.state.experience.lower_clothing}
            style={styles.pickerStyle}
            itemStyle={styles.pickerText}
            onValueChange={(itemValue, itemIndex) => this.setState({experience: {...this.state.experience, lower_clothing: itemValue}})}>
            {(this.state.disabledControls.experiencePicker ? [this.state.experience.lower_clothing]:lowerClothingKeys).map((item,index) => {
              return (<Picker.Item label={lowerClothingOptions[item]} value={item}/>)
            })}
          </Picker>
        </View>
        <View style={styles.predictionRow}>
          <Text style={styles.predictionText}>{this.state.prediction.primaryPercent}% {this.state.prediction.primaryResult}</Text>
        </View>
        <View style={styles.predictionButtonRow}>
          {this.state.disabledControls.showReset ? (
            <RoundedButton
              disabled={false}
              showActivityIndicator={this.state.disabledControls.showPredictionButtonActivity}
              onPress={() => this._getWeather()}>
              Reset
            </RoundedButton>
          ) : (
            <RoundedButton
              disabled={this.state.disabledControls.predictionButton}
              showActivityIndicator={this.state.disabledControls.showPredictionButtonActivity}
              onPress={() => this._runPredictionWorkflow()}>
              Make Prediction
            </RoundedButton>
          )}
        </View>
        <View>
          <Text style={styles.weatherInfoText}>{"What was your actual comfort level?"}</Text>
        </View>
        <View style={styles.resultRow}>
          <RoundedButtonExp
            disabled={this.state.disabledControls.predictionResponse}
            styleType={'cold'}
            onPress={() => this._updatePredictionResponse('uncomfortable_cold')}>
            👎 Cold
          </RoundedButtonExp>
          <RoundedButtonExp
            disabled={this.state.disabledControls.predictionResponse}
            styleType={'comfort'}
            onPress={() => this._updatePredictionResponse('comfortable')}>
            👍
          </RoundedButtonExp>
          <RoundedButtonExp
            disabled={this.state.disabledControls.predictionResponse}
            styleType={'hot'}
            onPress={() => this._updatePredictionResponse('uncomfortable_warm')}>
            👎 Warm
          </RoundedButtonExp>
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

export default connect(mapStateToProps, mapDispatchToProps)(WeatherScreen)

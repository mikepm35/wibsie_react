import React, { Component } from 'react'
import { AppState, ScrollView, Text, View, SafeAreaView, Picker, Button, TouchableHighlight, TouchableOpacity, Alert, RefreshControl, Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons';
import RoundedButton from '../../App/Components/RoundedButton'
import RoundedButtonExp from '../../App/Components/RoundedButtonExp'
import { DotIndicator } from 'react-native-indicators';
import WibsieConfig from '../Config/WibsieConfig';
import { Metrics, Colors } from '../Themes/';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import LocationActions from '../Redux/LocationRedux'

// Styles
import styles from './Styles/WeatherScreenStyle'

class WeatherScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      config: WibsieConfig,
      refreshing: false,
      scrollEnabled: true,
      disabledControls: {
        experiencePicker: false,
        predictionButton: true,
        showReset: false,
        predictionResponse: true,
        showPredictionButtonActivity: false
      },
      user: {},
      location: {
        zip: '--'
      },
      geolocation: {
        latitude: null,
        longitude: null,
        error: null
      },
      weatherCreatedLocal: '--',
      weather: {
        temperature: '--',
        tempHigh: '--',
        tempLow: '--',
        summary: '--',
        humidity: '--',
        precipProbability: '--',
        windSpeed: '--'
      },
      experience: {
        activity: 'standing',
        upper_clothing: 'short_sleeves',
        lower_clothing: 'pants'
      },
      prediction: {
        primaryPercent: '--',
        primaryResult: '--',
        blendPercent: '--'
      },
      uppercloOpacity: {
        'short_sleeves': 1,
        'long_sleeves': 0,
        'light_jacket': 0,
        'heavy_jacket': 0
      },
      lowercloOpacity: {
        'pants': 1
      },
      activityColor: {
        'standing': Colors.steel,
        'walking': null,
        'exercising': null
      }
    };

    setScrollEnabled = (scrollBool) => {
      this.setState({
        scrollEnabled: scrollBool
      });
    }

    setRefreshing = (refreshBool) => {
      console.log('Setting refreshing: ', refreshBool);
      this.setState({
        refreshing: refreshBool
      });
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

        month = date.getMonth()+1; // 0 is first month
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
      // Attempt to pull high / low temp from raw data
      try {
        var tempHigh = data.raw.daily.data[0].temperatureHigh.toFixed(0);
        var tempLow = data.raw.daily.data[0].temperatureLow.toFixed(0);
      } catch(err) {
        console.log('Error fetching tempHigh/Low');
        var tempHigh = '--';
        var tempLow = '--';
      }

      console.log('Retrieved tempHigh/Low: ', tempHigh, tempLow);

      this.setState({
        weather: {created: data.created,
                  expires: data.expires,
                  temperature: data.temperature.toFixed(0),
                  tempHigh: tempHigh,
                  tempLow: tempLow,
                  summary: data.summary,
                  humidity: (data.humidity*100).toFixed(0),
                  precipProbability: (data.precipProbability*100).toFixed(0),
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
      this.props.setZip(data.zip);
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
      let uncomfortcoldPredict = data[0].uncomfortable_cold;
      let uncomfortwarmPredict = data[0].uncomfortable_warm;
      let uncomfortPredict = data[0].uncomfortable;
      let attributes = data[0].attributes;

      if (attributes != undefined) {
        console.log('Using attributes for updatePredictionData');
        var primaryPercent = (attributes.primary_percent*100).toFixed(0);
        var primaryResult = attributes.primary_result[0].toUpperCase() + attributes.primary_result.slice(1);
      } else {
        console.log('Using legacy comfort prediction');
        if (comfortPredict >= 0.5) {
          var primaryPercent = (comfortPredict*100).toFixed(0);
          var primaryResult = 'Comfortable';
        } else if (typeof uncomfortwarmPredict === 'undefined') {
          console.log('Logging an uncomfortable due to no uncomfortwarmPredict')
          var primaryPercent = ((1-comfortPredict)*100).toFixed(0);
          var primaryResult = 'Uncomfortable';
        } else if (uncomfortcoldPredict >= 0.5) {
          var primaryPercent = (uncomfortcoldPredict*100).toFixed(0);
          var primaryResult = 'Too Cold';
        } else if (uncomfortwarmPredict >= 0.5) {
          var primaryPercent = (uncomfortwarmPredict*100).toFixed(0);
          var primaryResult = 'Too Warm';
        } else if (typeof uncomfortPredict != 'undefined') {
          console.log('Using legacy uncomfortPredict');
          var primaryPercent = (uncomfortPredict*100).toFixed(0);
          var primaryResult = 'Uncomfortable';
        } else {
          console.log('Using generic uncomfortable due to no value over 0.5');
          var primaryPercent = ((1-comfortPredict)*100).toFixed(0);
          var primaryResult = 'Uncomfortable';
        }
      }

      var blendPercent = '0.0';
      if (data[0].blend!=null) {
        blendPercent = (data[0].blend*100).toFixed(1);
      }

      this.setState({
        prediction: {comfortPredict: comfortPredict,
                      uncomfortPredict: uncomfortPredict,
                      primaryPercent: primaryPercent,
                      primaryResult: primaryResult,
                      blendPercent: blendPercent,
                      attributes: attributes},
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

  _onScroll = (event) => {
    console.log('_onScroll event: ', event);
    if (event && event.nativeEvent.contentOffset.y) {
      console.log('_onScroll nativeEvent: ', event.nativeEvent);
      if (event.nativeEvent.contentOffset.y > 0) {
        this.refs.scrollView.scrollTo({x:0,y:0,animated:false});
        setScrollEnabled(false);
      } else {
        setScrollEnabled(true);
      }
    } else {
      console.log('Event empty for _onScroll');
      this.refs.scrollView.scrollTo(0);
      setScrollEnabled(true);
    }
  }

  _onRefresh = () => {
    setRefreshing(true);
    this._getWeather();
  }

  _getWeather() {
    let endpointAPI = this.state.config.endpointAPI;
    let authToken = this.state.config.authToken;
    let zip = this.props.zip;

    if (zip == '' | zip == null | zip == '--') {
      console.log('No zip loaded');
      this._updateCurrentPosition();
      Alert.alert(
        'Error',
        'No location loaded, check internet connection',
        [
          {text: 'OK', onPress: () => setRefreshing(false)},
        ],
        { cancelable: false }
      );
      return;
    }

    let url = endpointAPI + '/weatherreports?epoch=now&location=' + zip + '&schema=' + this.state.config.schema;

    console.log('Weather url', url, authToken);

    axios.get(url, {headers: {'AuthToken': authToken}})
      .then(function (response) {
        console.log('Success', response);
        updateWeatherData(response.data);
        setRefreshing(false);
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
        setRefreshing(false);
      });
  }

  _updatePredictionResponse(result) {
    console.log('Starting _updatePredictionResponse');

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
    let urlExperienceUpdate = urlExperiences + '/' + experienceCreated.toString() + '?schema=' + this.state.config.schema;
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
    let zip = this.props.zip;
    let activity = this.state.experience.activity;
    let upper_clothing = this.state.experience.upper_clothing;
    let lower_clothing = this.state.experience.lower_clothing;
    let schema = this.state.config.schema;

    let urlExperiences = endpointAPI + '/users/' + userId + '/experiences';
    let urlPredict = endpointML + '/infer' + '?schema=' + schema;

    this.setState({
      disabledControls: {...this.state.disabledControls,
                          experiencePicker: true,
                          predictionButton: true,
                          showReset: true,
                          predictionResponse: true,
                          showPredictionButtonActivity: true}
    });

    // Start create experience
    axios.post(urlExperiences + '?schema=' + schema, {
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

            // // Start update experience with prediction result - NOT NEEDED
            // let comfortPredict = response.data[0].comfortable;
            // let urlExperienceUpdate = urlExperiences + '/' + experienceCreated.toString();
            // console.log('Starting experience update: ', urlExperienceUpdate);
            // axios.put(urlExperienceUpdate + '?schema=' + schema, {
            //   zip: zip,
            //   weather_expiration: weatherExpires,
            //   activity: activity,
            //   upper_clothing: upper_clothing,
            //   lower_clothing: lower_clothing,
            //   comfort_level_result: 'none',
            //   comfort_level_prediction: comfortPredict,
            // }, {headers: {'AuthToken': authToken}})
            // .then(function (response) {
            //   console.log('Success update experience', response);
            // })
            // .catch(function (error) {
            //   console.log('Error update experience', error);
            // });

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

  _updateCurrentPosition(reset) {
    console.log('Starting _updateCurrentPosition', this.state.prediction.primaryPercent, reset);

    let weatherExpired = false;
    if (Date.now() > (this.state.weather.expires)) {
      console.log('Setting weatherExpired to true');
      weatherExpired = true;
    }

    if (this.state.prediction.primaryPercent != '--' & reset != true) {
      console.log('Ignoring _updateCurrentPosition due to prediction already loaded');
      return;
    } else if (this.props.override) {
      console.log('Ignoring _updateCurrentPosition due to override, but calling _getWeather');
      this._getWeather();
      return;
    } else if (weatherExpired & !this.state.disabledControls.showReset & !this.state.disabledControls.predictionButton) {
      console.log('Updating weather due to expiration and no prediction');
      this._getWeather();
      return;
    }

    let endpointAPI = this.state.config.endpointAPI;
    let authToken = this.state.config.authToken;

    let urlZipfromlatlong = endpointAPI + '/locations/zipFromLatLong' + '?schema=' + this.state.config.schema;

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

  _updateUpperclo() {
    switch(this.state.experience.upper_clothing) {
      case 'tank':
        console.log('_updateUpperclo tank');
        this.setState({
          experience: {...this.state.experience, upper_clothing: 'short_sleeves'},
          uppercloOpacity: {
            'short_sleeves': 1,
            'long_sleeves': 0,
            'light_jacket': 0,
            'heavy_jacket': 0
          }
        })
        break;
      case 'short_sleeves':
        console.log('_updateUpperclo short_sleeves');
        this.setState({
          experience: {...this.state.experience, upper_clothing: 'long_sleeves'},
          uppercloOpacity: {
            'short_sleeves': 0,
            'long_sleeves': 1,
            'light_jacket': 0,
            'heavy_jacket': 0
          }
        })
        break;
      case 'long_sleeves':
        console.log('_updateUpperclo long_sleeves');
        this.setState({
          experience: {...this.state.experience, upper_clothing: 'light_jacket'},
          uppercloOpacity: {
            'short_sleeves': 0,
            'long_sleeves': 1,
            'light_jacket': 1,
            'heavy_jacket': 0
          }
        })
        break;
      case 'light_jacket':
        console.log('_updateUpperclo light_jacket');
        this.setState({
          experience: {...this.state.experience, upper_clothing: 'heavy_jacket'},
          uppercloOpacity: {
            'short_sleeves': 0,
            'long_sleeves': 1,
            'light_jacket': 0,
            'heavy_jacket': 1
          }
        })
        break;
      case 'heavy_jacket':
        console.log('_updateUpperclo heavy_jacket');
        this.setState({
          experience: {...this.state.experience, upper_clothing: 'tank'},
          uppercloOpacity: {
            'short_sleeves': 0,
            'long_sleeves': 0,
            'light_jacket': 0,
            'heavy_jacket': 0
          }
        })
        break;
    }
  }

  _updateLowerclo() {
    switch(this.state.experience.lower_clothing) {
      case 'shorts':
        console.log('_updateLowerclo shorts');
        this.setState({
          experience: {...this.state.experience, lower_clothing: 'pants'},
          lowercloOpacity: {
            'pants': 1
          }
        })
        break;
      case 'pants':
        console.log('_updateLowerclo pants');
        this.setState({
          experience: {...this.state.experience, lower_clothing: 'shorts'},
          lowercloOpacity: {
            'pants': 0
          }
        })
        break;
    }
  }

  _updateActivity(activityClicked) {
    console.log('_updateActivity', activityClicked);

    switch(activityClicked) {
      case 'standing':
        this.setState({
          experience: {...this.state.experience, activity: 'standing'},
          activityColor: {
            'standing': Colors.steel,
            'walking': null,
            'exercising': null
          }
        })
        break;
      case 'walking':
        this.setState({
          experience: {...this.state.experience, activity: 'walking'},
          activityColor: {
            'standing': null,
            'walking': Colors.steel,
            'exercising': null
          }
        })
        break;
      case 'exercising':
        this.setState({
          experience: {...this.state.experience, activity: 'exercising'},
          activityColor: {
            'standing': null,
            'walking': null,
            'exercising': Colors.steel
          }
        })
        break;
    }
  }

  componentDidMount() {
    console.log('Props on load: ', this.props);

    loadUserData(this.props.navigation.state.params.user);

    AppState.addEventListener('change', this._handleAppStateChange);

    this.subs = [
      this.props.navigation.addListener('didFocus', () => this._updateCurrentPosition()),
    ];
  }

  componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);

      this.subs.forEach(sub => sub.remove());
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground');
      this._updateCurrentPosition();
    }
    this.setState({appState: nextAppState});
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
      'tank': 'Tank Top',
      'short_sleeves': 'Short Sleeves',
      'long_sleeves': 'Long Sleeves',
      'light_jacket': 'Light Jacket',
      'heavy_jacket': 'Heavy Jacket'
    };
    const upperClothingKeys = Object.keys(upperClothingOptions);

    const lowerClothingOptions = {
      'shorts': 'Shorts/Skirt',
      'pants': 'Pants/Dress'
    };
    const lowerClothingKeys = Object.keys(lowerClothingOptions);

    return (
      <SafeAreaView style={styles.weatherContainer}>
        <ScrollView
          // scrollEnabled={this.state.scrollEnabled}
          // bounces={this.state.scrollEnabled}
          // scrollEventThrottle={1}
          // onScroll={this._onScroll}
          // contentContainerStyle={{ paddingBottom: 100 }}
          pinchGestureEnabled={false}
          showsVerticalScrollIndicator={false}
          ref="scrollView"
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
        <View style={styles.weatherRow}>
          <View style={styles.weatherCols}>
            <TouchableOpacity style={{paddingHorizontal: 10}} onPress={()=>this._getWeather()}>
              <Text style={styles.tempText}>{this.state.weather.temperature+'\u00B0'}</Text>
              <Text style={styles.tempTextSmall}>H:{this.state.weather.tempHigh+'\u00B0'} L:{this.state.weather.tempLow+'\u00B0'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weatherCols}>
            <Text style={styles.weatherText}>{this.state.weather.summary}</Text>
            <Text style={styles.weatherText}>{this.state.weather.precipProbability}% Precipitation</Text>
            <Text style={styles.weatherText}>{this.state.weather.humidity}% Humidity</Text>
          </View>
        </View>
        <View style={styles.weatherInfoRow}>
          {(Metrics.aspectRatio > 1.6 & Metrics.height > 650) ? (
            <Text style={styles.weatherInfoText}>{(this.props.zip==null ? '--':this.props.zip) +'  \u00B7  '+this.state.weatherCreatedLocal}</Text>
          ) : (
            <Text></Text>
          )}
        </View>
        <View style={styles.pickerRow}>
          <View style={styles.humanView}>
            <Image
              source={require('../Images/human1/cartoon-human-png-4.png')}
              style={styles.imgMain}
            />
            <Image
              source={require('../Images/human1/tshirt.png')}
              style={[styles.imgTshirt, {opacity: this.state.uppercloOpacity.short_sleeves}]}
            />
            <Image
              source={require('../Images/human1/longsleeve.png')}
              style={[styles.imgLongsleeve, {opacity: this.state.uppercloOpacity.long_sleeves}]}
            />
            <Image
              source={require('../Images/human1/pants.png')}
              style={[styles.imgPants, {opacity: this.state.lowercloOpacity.pants}]}
            />
            <Image
              source={require('../Images/human1/lightjacket.png')}
              style={[styles.imgLightjacket, {opacity: this.state.uppercloOpacity.light_jacket}]}
            />
            <Image
              source={require('../Images/human1/heavyjacket.png')}
              style={[styles.imgHeavyJacket, {opacity: this.state.uppercloOpacity.heavy_jacket}]}
            />
            <TouchableOpacity
              style={styles.imgToptouchable}
              onPress={()=>this._updateUpperclo()}
              disabled={this.state.disabledControls.experiencePicker}
            >
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgBottomtouchable}
              onPress={()=>this._updateLowerclo()}
              disabled={this.state.disabledControls.experiencePicker}
            >
            </TouchableOpacity>
          </View>
          <View style={styles.humanSidebar}>
            <View style={styles.figureRow}>
              <TouchableOpacity
                style={{}}
                onPress={()=>this._updateActivity('standing')}
                disabled={this.state.disabledControls.experiencePicker}
              >
                <View style={styles.activityView}>
                  <Image
                    source={require('../Images/motionicons/003-standing-up-man.png')}
                    style={[styles.activityImg, {tintColor: this.state.activityColor.standing}]}
                    resizeMode="contain"
                  />
                  <Text style={styles.activityText}>{this.state.activityColor.standing ? this.state.experience.activity : null}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={()=>this._updateActivity('walking')}
                disabled={this.state.disabledControls.experiencePicker}
              >
                <View style={styles.activityView}>
                  <Image
                    source={require('../Images/motionicons/001-pedestrian-walking.png')}
                    style={[styles.activityImg, {tintColor: this.state.activityColor.walking}]}
                    resizeMode="contain"
                  />
                  <Text style={styles.activityText}>{this.state.activityColor.walking ? this.state.experience.activity : null}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={()=>this._updateActivity('exercising')}
                disabled={this.state.disabledControls.experiencePicker}
              >
                <View style={[styles.activityView, {paddingVertical: 5}]}>
                  <Image
                    source={require('../Images/motionicons/004-running.png')}
                    style={{height: 45, width:60, alignSelf: 'center', tintColor: this.state.activityColor.exercising}}
                    resizeMode="contain"
                  />
                  <Text style={styles.activityText}>{this.state.activityColor.exercising ? this.state.experience.activity : null}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.predictionButtonRow2}>
              {this.state.disabledControls.showReset ? (
                <RoundedButton
                  disabled={false}
                  showActivityIndicator={this.state.disabledControls.showPredictionButtonActivity}
                  onPress={() => this._updateCurrentPosition(true)}>
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
          </View>
        </View>
        <View style={styles.predictionRow}>
          <Text style={styles.predictionText}>{this.state.prediction.primaryResult} [{this.state.prediction.primaryPercent}%]</Text>
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
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  //console.log('mapStateToProps: ', state);
  return {
    zip: state.location.zip,
    override: state.location.override
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setZip: (zip) => dispatch(LocationActions.changeZip(zip))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherScreen)

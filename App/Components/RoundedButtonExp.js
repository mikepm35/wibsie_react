import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'
import styles from './Styles/RoundedButtonExpStyle'
import ExamplesRegistry from '../Services/ExamplesRegistry'

// Note that this file (App/Components/RoundedButton) needs to be
// imported in your app somewhere, otherwise your component won't be
// compiled and added to the examples dev screen.

// Ignore in coverage report
/* istanbul ignore next */
ExamplesRegistry.addComponentExample('Rounded Button', () =>
  <RoundedButton
    text='real buttons have curves'
    onPress={() => window.alert('Rounded Button Pressed!')}
  />
)

export default class RoundedButtonExp extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    styleType: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
    children: PropTypes.string,
    navigator: PropTypes.object
  }

  getText () {
    const buttonText = this.props.text || this.props.children || ''
    //return buttonText.toUpperCase()
    return buttonText
  }

  render () {
    var buttonStyle = null;
    if (this.props.styleType == 'cold') {
      buttonStyle = styles.buttonCold;
    } else if (this.props.styleType == 'comfort') {
      buttonStyle = styles.buttonComfort;
    } else if (this.props.styleType == 'hot') {
      buttonStyle = styles.buttonHot;
    }

    return (
      <TouchableOpacity
        style={this.props.disabled ? styles.buttonDisabled : buttonStyle}
        onPress={this.props.onPress}
        disabled={this.props.disabled}>
        <Text style={this.props.disabled ? styles.buttonTextDisabled : styles.buttonText}>{this.getText()}</Text>
      </TouchableOpacity>
    )
  }
}

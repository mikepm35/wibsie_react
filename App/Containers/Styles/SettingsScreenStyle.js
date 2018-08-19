import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  emailRow: {
    paddingVertical: Metrics.section
  },
  emailText: {
    ...Fonts.style.normal,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'center',
  },
  logoutButtonRow: {
    paddingVertical: Metrics.section
  },
})

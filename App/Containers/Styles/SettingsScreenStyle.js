import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  textInput: {
    height: (Metrics.aspectRatio > 1.6) ? 40 : 30,
    borderRadius: 5,
    paddingHorizontal: Metrics.smallMargin,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.ricePaper,
    borderColor: Colors.lightEggplant,
    borderWidth: 1,
    color: Colors.coal,
    justifyContent: 'center',
    flex: 2
  },
  inputLabel: {
    ...Fonts.style.normal,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'center',
  },
  inputIconRow: {
    flex: 2,
    flexDirection: 'row',
  },
  icon: {
    height: (Metrics.aspectRatio > 1.6) ? 40 : 30,
    paddingVertical: (Metrics.aspectRatio > 1.6) ? 10 : 5,
    marginVertical: Metrics.baseMargin,
    paddingRight: Metrics.smallMargin,
    marginRight: Metrics.section
  },
  row: {
    flex: 1,
    paddingVertical: (Metrics.height < 700) ? Metrics.section/5 : Metrics.section,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    paddingHorizontal: Metrics.smallMargin,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    height: 20
  },
  progressLabel: {
    ...Fonts.style.normal,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'center',
    paddingRight: Metrics.smallMargin,
    marginRight: Metrics.section,
    textAlignVertical: 'center',
  },
  emailText: {
    ...Fonts.style.normal,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'center',
  },
  logoutButtonRow: {
    paddingVertical: Metrics.section,
    marginBottom: (Metrics.height < 700) ? Metrics.section : Metrics.section*5,
  },
})

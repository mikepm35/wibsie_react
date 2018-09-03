import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  weatherContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Metrics.doubleBaseMargin,
    backgroundColor: Colors.eggplant
  },
  headerCols: {
    margin: Metrics.smallMargin,
    padding: Metrics.smallMargin,
    width: Metrics.screenWidth / 2 - Metrics.smallMargin*2,
  },
  weatherRow: {
    flexDirection: 'row',
    flex: 2,
    backgroundColor: 'transparent'
  },
  weatherCols: {
    margin: Metrics.smallMargin,
    padding: Metrics.smallMargin,
    width: Metrics.screenWidth / 2 - Metrics.smallMargin*2
  },
  tempText: {
    ...Fonts.style.h1,
    color: Colors.snow,
    textAlign: 'center',
    fontSize: 54,
    marginTop: Metrics.smallMargin
  },
  tempTextSmall: {
    ...Fonts.style.normal,
    color: Colors.snow,
    marginBottom: Metrics.smallMargin,
    textAlign: 'center'
  },
  weatherText: {
    ...Fonts.style.normal,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'left'
  },
  weatherInfoRow: {
    backgroundColor: 'transparent',
    paddingTop: Metrics.section
  },
  weatherInfoText: {
    ...Fonts.style.normal,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'center',
    width: Metrics.screenWidth - Metrics.smallMargin*2
  },
  pickerRow: {
    flexDirection: 'row',
    flex: 2,
    backgroundColor: 'transparent'
  },
  pickerStyle: {
    margin: Metrics.smallMargin,
    padding: Metrics.smallMargin,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
  },
  pickerText: {
    ...Fonts.style.description,
    color: Colors.snow,
    height: (Metrics.aspectRatio > 1.6 & Metrics.height > 650) ? 100 : 75
  },
  predictionRow: {
    paddingVertical: Metrics.section,
    backgroundColor: 'transparent'
  },
  predictionText: {
    ...Fonts.style.h3,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'center',
    width: Metrics.screenWidth - Metrics.smallMargin*2
  },
  predictionButtonRow: {
    paddingBottom: Metrics.section
  },
  resultRow: {
    flexDirection: 'row',
    flex: 2,
    backgroundColor: 'transparent'
  }
})

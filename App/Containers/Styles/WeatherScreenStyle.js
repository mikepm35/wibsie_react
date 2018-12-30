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
    paddingBottom: Metrics.section
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
  humanSidebar: {
    margin: Metrics.smallMargin,
    padding: Metrics.smallMargin,
    width: Metrics.screenWidth - Metrics.smallMargin*4 - 110,
    alignItems: 'center',
    flexDirection: 'column',
    flex: 2,
    justifyContent: 'center',
  },
  humanView: {
    height: 220,
    width: 110,
    alignItems: 'center',
    margin: Metrics.smallMargin,
    padding: Metrics.smallMargin,
  },
  activityView: {
    width: 65,
    height: 65
  },
  activityText: {
    ...Fonts.style.label,
    color: 'white',
    textAlign: 'center',
  },
  activityImg: {
    height: 50,
    width: 50,
    alignSelf: 'center'
  },
  imgMain: {
    position: 'absolute',
    top: 15,
    left: 15,
    height: 189.88,
    width: 70.48
  },
  imgTshirt: {
    position: 'absolute',
    top: 15+79,
    left: 15+4.3,
    opacity: 0,
    height: 51.5,
    width: 61.68
  },
  imgLongsleeve: {
    position: 'absolute',
    top: 15+79,
    left: 15+2.1,
    opacity: 0,
    height: 61.41,
    width: 65.98
  },
  imgLightjacket: {
    position: 'absolute',
    top: 15+79,
    left: 15+1.5,
    opacity: 0,
    height: 63,
    width: 67
  },
  imgHeavyJacket: {
    position: 'absolute',
    top: 15+78.5,
    left: 15-1,
    opacity: 0,
    height: 65,
    width: 72
  },
  imgPants: {
    position: 'absolute',
    top: 15+131,
    left: 15+12.8,
    opacity: 0,
    height: 57.13,
    width: 44.73
  },
  imgToptouchable: {
    position: 'absolute',
    top: 15+75,
    left: 15+0,
    height: 60,
    width: 75
  },
  imgBottomtouchable: {
    position: 'absolute',
    top: 15+60+75,
    left: 15+0,
    height: 65,
    width: 75
  },
  pickerStyle: {
    margin: Metrics.smallMargin,
    padding: Metrics.smallMargin,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2
  },
  pickerText: {
    ...Fonts.style.description,
    color: Colors.snow,
    height: (Metrics.aspectRatio > 1.6 & Metrics.height > 650) ? 100 : 75
  },
  predictionRow: {
    paddingVertical: Metrics.section/2,
    backgroundColor: 'transparent',
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
  predictionButtonRow2: {
    width: 200,
  },
  figureRow: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    flex: 2,
    backgroundColor: 'transparent'
  }
})

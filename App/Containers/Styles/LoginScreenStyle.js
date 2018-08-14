import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  loginContainer: {
    flex: 1,
    marginVertical: Metrics.doubleBaseMargin*5,
  },
  logoText: {
    ...Fonts.style.h1,
    fontFamily: Fonts.type.bold,
    color: Colors.eggplant,
    textAlign: 'center',
    fontSize: 54,
    marginVertical: Metrics.smallMargin
  },
  logoView: {
    paddingTop: Metrics.section,
    paddingBottom: Metrics.smallMargin
  },
  descriptionText: {
    ...Fonts.style.normal,
    color: Colors.eggplant,
    textAlign: 'center',
    marginVertical: Metrics.smallMargin
  },
  descriptionView: {
    paddingTop: Metrics.smallMargin,
    paddingBottom: Metrics.section
  },
  textInput: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: Metrics.smallMargin,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.ricePaper,
    borderColor: Colors.lightEggplant,
    borderWidth: 1,
    color: Colors.coal,
    justifyContent: 'center'
  },
  backgroundImage: {
    backgroundColor: '#ccc',
    flex: 1,
    resizeMode: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  }
})

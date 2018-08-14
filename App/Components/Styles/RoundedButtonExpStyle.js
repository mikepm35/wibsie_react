import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  buttonCold: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: Metrics.smallMargin,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.facebook,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
    justifyContent: 'center'
  },
  buttonComfort: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: Metrics.smallMargin,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.green,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
    justifyContent: 'center'
  },
  buttonHot: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: Metrics.smallMargin,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.error,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
    justifyContent: 'center'
  },
  buttonDisabled: {
    height: 45,
    borderRadius: 5,
    marginHorizontal: Metrics.smallMargin,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.steel,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.snow,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: Fonts.size.medium,
    marginVertical: Metrics.baseMargin
  },
  buttonTextDisabled: {
    color: Colors.charcoal,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: Fonts.size.medium,
    marginVertical: Metrics.baseMargin
  }
})

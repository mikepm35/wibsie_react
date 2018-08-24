import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

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
    justifyContent: 'center'
  },
  pickerRow: {
    flexDirection: 'row',
    flex: 1
  },
  pickerStyle: {
    margin: Metrics.smallMargin,
    padding: Metrics.smallMargin,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
  },
  datepickerLeft: {
    marginLeft: Metrics.smallMargin*5,
    paddingLeft: Metrics.smallMargin*3,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
  },
  datepickerInner: {
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*6,
  },
  datepickerRight: {
    marginRight: Metrics.smallMargin*5,
    paddingRight: Metrics.smallMargin*3,
    width: Metrics.screenWidth / 3 - Metrics.smallMargin*2,
  },
  lifestylePickerStyle: {
    marginLeft: Metrics.smallMargin,
    paddingLeft: Metrics.smallMargin,
    width: Metrics.screenWidth - Metrics.smallMargin*4,
  },
  pickerText: {
    ...Fonts.style.description,
    color: Colors.snow,
    height: (Metrics.aspectRatio > 1.6 & Metrics.height > 650) ? 100 : 75
  },
})

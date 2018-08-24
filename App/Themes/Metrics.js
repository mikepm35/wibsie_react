import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')
const aspectRatio = height/width;

console.log('dimensions: ', height, width, aspectRatio);

// Used via Metrics.baseMargin
const metrics = {
  aspectRatio: aspectRatio,
  height: height,
  width: width,
  marginHorizontal: (aspectRatio > 1.6) ? 10 : 2,
  marginVertical: (aspectRatio > 1.6) ? 10 : 2,
  section: (aspectRatio > 1.6) ? 25 : 7,
  baseMargin: (aspectRatio > 1.6) ? 10 : 4,
  doubleBaseMargin: (aspectRatio > 1.6) ? 20 : 5,
  smallMargin: (aspectRatio > 1.6) ? 5 : 2,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
}

export default metrics

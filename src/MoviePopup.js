import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  LayoutAnimation,
  PanResponder,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { defaultStyles } from './styles';
import Options from './Options';

const { width, height } = Dimensions.get('window');
//popup height is 67% of screen
const defaultHeight = height * 0.67;

export default class MoviePopup extends Component {
  state = {
    position: new Animated.Value(this.props.isOpen ? 0 : height),
    visible: this.props.isOpen,
    opacity: new Animated.Value(0),
    height: defaultHeight,
    expanded: false,
  };

  _previousHeight = 0;

  componentWillMount() {
    // Initialize PanResponder to handle move gestures
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Ignore taps
        if (dx !== 0 && dy === 0) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Store previous height before user changed it
        this._previousHeight = this.state.height;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Pull delta and velocity values for y axis from gestureState
        const { dy, vy } = gestureState;
        // Subtract delta y from previous height to get new height
        let newHeight = this._previousHeight - dy;

        // Animate heigh change so it looks smooth
        LayoutAnimation.easeInEaseOut();

        // Switch to expanded mode if popup pulled up above 80% mark
        if (newHeight > height - height / 5) {
          this.setState({ expanded: true });
        } else {
          this.setState({ expanded: false });
        }

        // Expand to full height if pulled up rapidly
        if (vy < -0.75) {
          this.setState({
            expanded: true,
            height: height
          });
        }

        // Close if pulled down rapidly
        else if (vy > 0.75) {
          this.props.onClose();
        }
        // Close if pulled below 75% mark of default height
        else if (newHeight < defaultHeight * 0.75) {
          this.props.onClose();
        }
        // Limit max height to screen height
        else if (newHeight > height) {
          this.setState({ height: height });
        }
        else {
          this.setState({ height: newHeight });
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dy } = gestureState;
        const newHeight = this._previousHeight - dy;

        // Close if pulled below default height
        if (newHeight < defaultHeight) {
          this.props.onClose();
        }

        // Update previous height
        this._previousHeight = this.state.height;
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }


  //isOpen changes to open or close
  componentWillReceiveProps(nextProps){
    //isOpen changed from false to true
    if(!this.props.isOpen && nextProps.isOpen){
      this.animateOpen();
    }else if(this.props.isOpen && !nextProps.isOpen){
      this.animateClose();
    }
    //isOpen changed from true to false
  }

  //popup open animation
  animateOpen(){
    //update state
    this.setState({
      visible: true
    }, () => {
      Animated.parallel([
        Animated.timing(
          this.state.position, { toValue: 0}
        ),
        Animated.timing(
          this.state.opacity, { toValue: 0.5 }
        ),
      ]).start();
    });
  }

  // Close popup
   animateClose() {
     Animated.parallel([
       // Animate opacity
       Animated.timing(
         this.state.opacity, { toValue: 0 } // transparent
       ),
       // Slide down
       Animated.timing(
         this.state.position, { toValue: height } // bottom of the screen
       ),
     ]).start(() => this.setState({
       // Reset to default values
       height: defaultHeight,
       expanded: false,
       visible: false,
     }));
   }

   getStyles = () => {
   return {
     imageContainer: this.state.expanded ? {
       width: width / 2,         // half of screen widtj
     } : {
       maxWidth: 110,            // limit width
       marginRight: 10,
     },
     movieContainer: this.state.expanded ? {
       flexDirection: 'column',  // arrange image and movie info in a column
       alignItems: 'center',     // and center them
     } : {
       flexDirection: 'row',     // arrange image and movie info in a row
     },
     movieInfo: this.state.expanded ? {
       flex: 0,
       alignItems: 'center',     // center horizontally
       paddingTop: 20,
     } : {
       flex: 1,
       justifyContent: 'center', // center vertically
     },
     title: this.state.expanded ? {
       textAlign: 'center',
     } : {},
   };
 }

  render() {
    const {
     movie,
     chosenDay,
     chosenTime,
     onChooseDay,
     onChooseTime,
     onBook
   } = this.props;
   // Pull out movie data
   const { title, genre, poster, days, times } = movie || {};
    if(!this.state.visible){
      return null;
    }
    return (
          <View style={styles.container}>
            {/* Closes popup if user taps on semi-transparent backdrop */}
            <TouchableWithoutFeedback onPress={this.props.onClose}>
              <Animated.View style={[styles.backdrop, { opacity: this.state.opacity }]}/>
            </TouchableWithoutFeedback>
            <Animated.View
              style={[styles.modal, {
                // Animates height
                height: this.state.height,
                // Animates position on the screen
                transform: [{ translateY: this.state.position }, { translateX: 0 }]
              }]}
            >

              {/* Content */}
              <View style={styles.content}>
                {/* Movie poster, title and genre */}
                <View
                  style={[styles.movieContainer, this.getStyles().movieContainer]}
                  {...this._panResponder.panHandlers}
                >
                  {/* Poster */}
                  <View style={[styles.imageContainer, this.getStyles().imageContainer]}>
                    <Image source={{ uri: poster }} style={styles.image} />
                  </View>
                  {/* Title and genre */}
                  <View style={[styles.movieInfo, this.getStyles().movieInfo]}>
                    <Text style={[styles.title, this.getStyles().title]}>{title}</Text>
                    <Text style={styles.genre}>{genre}</Text>
                  </View>
                </View>

                {/* Showtimes */}
                <View>
                  {/* Day */}
                  <Text style={styles.sectionHeader}>Day</Text>
                  <Options
                    values={days}
                    chosen={chosenDay}
                    onChoose={onChooseDay}
                  />
                  {/* Time */}
                  <Text style={styles.sectionHeader}>Showtime</Text><Options
                    values={times}
                    chosen={chosenTime}
                    onChoose={onChooseTime}
                  />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <TouchableHighlight
                    underlayColor="#9575CD"
                    style={styles.buttonContainer}
                    onPress={onBook}
                  >
                    <Text style={styles.button}>Book My Tickets</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Animated.View>
          </View>
        );
  }
}

const styles = StyleSheet.create({
  // Main container
  container: {
    ...StyleSheet.absoluteFillObject,   // fill up all screen
    justifyContent: 'flex-end',         // align popup at the bottom
    backgroundColor: 'transparent',     // transparent background
  },
  // Semi-transparent background below popup
  backdrop: {
    ...StyleSheet.absoluteFillObject,   // fill up all screen
    backgroundColor: 'black',
  },
  // Popup
  modal: {
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    margin: 20,
    marginBottom: 0,
  },
  // Movie container
  movieContainer: {
    flex: 1,                            // take up all available space
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,                            // take up all available space
  },
  image: {
    borderRadius: 10,                   // rounded corners
    ...StyleSheet.absoluteFillObject,   // fill up all space in a container
  },
  movieInfo: {
    backgroundColor: 'transparent',     // looks nicier when switching to/from expanded mode
  },
  title: {
    ...defaultStyles.text,
    fontSize: 20,
  },
  genre: {
    ...defaultStyles.text,
    color: '#BBBBBB',
    fontSize: 14,
  },
  sectionHeader: {
    ...defaultStyles.text,
    color: '#AAAAAA',
  },
  // Footer
  footer: {
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: '#673AB7',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  button: {
    ...defaultStyles.text,
    color: '#FFFFFF',
    fontSize: 18,
  },
});

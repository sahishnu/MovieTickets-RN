import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class MoviePopup extends Component {
  state = {
    position: new Animated.Value(this.props.isOpen ? 0 : height),
    visible: this.props.isOpen,
  };

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
      Animated.timing(
        this.state.position, {toValue: 0}
      ).start();
    });
  }

  //popaup close animation
  animateClose(){
    //slide down
    Animated.timing(
      this.state.position, {toValue: height} //bottom of screen
    ).start(
      () => this.setState({ visible: false })
    );
  }

  render() {
    if(!this.state.visible){
      return null;
    }
    return(
      <View style = {styles.container}>
        {/*close popup if user clicks off of it*/}
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <Animated.View style = {styles.backdrop}/>
        </TouchableWithoutFeedback>
        <Animated.View
          style = {[styles.modal, {
            transform: [{translateY: this.state.position}, {translateX: 0}]
          }]}>
          <Text>PopUp!</Text>
        </Animated.View>
      </View>
    )
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
    opacity: 0.5,
  },
  // Popup
  modal: {
    height: height / 2,                 // take half of screen height
    backgroundColor: 'white',
  },
});

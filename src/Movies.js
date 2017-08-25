import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { movies } from './data';
import MoviePoster from './MoviePoster';
import MoviePopup from './MoviePopup';

export default class Movies extends Component {
  static navigationOptions = {
    title: 'MovieFlix',
  };
  state = {
    popupIsOpen: false,
  }

  openMovie = (movie) => {
    this.setState({
      popupIsOpen: true,
      movie,
    });
  }
  closeMovie = () => {
    this.setState({
      popupIsOpen: false,
    });
  }

  render() {
    return (
      <View style = {styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {movies.map(
            (movie, index) => <MoviePoster
              movie = {movie}
              onOpen = {this.openMovie}
              key = {index}
            />
          )}
        </ScrollView>
        <MoviePopup
          movie = {this.state.movie}
          isOpen = {this.state.popupIsOpen}
          onClose = {this.closeMovie}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20, //start below status bar
  },
  scrollContent: {
    flexDirection: 'row', //arrange in rows
    flexWrap: 'wrap', //wrap rows
  }
});

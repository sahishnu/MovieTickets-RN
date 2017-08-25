import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { movies } from './data';
import MoviePoster from './MoviePoster';

export default class Movies extends Component {
  static navigationOptions = {
    title: 'MovieFlix',
  };
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

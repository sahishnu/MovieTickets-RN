import { AppRegistry } from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import Movies from './src/Movies';


const App = StackNavigator({
  Movies: {
    screen: Movies
  }
});

AppRegistry.registerComponent('MovieTickets', () => App);

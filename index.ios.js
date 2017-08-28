import { AppRegistry } from 'react-native';
import {
  StackNavigator
} from 'react-navigation';
import Movies from './src/Movies';
import Confirmation from './src/Confirmation';


const App = StackNavigator({
  Movies: {
    screen: Movies
  },
  Confirmation: {
    screen: Confirmation
  }
});

AppRegistry.registerComponent('MovieTickets', () => App);

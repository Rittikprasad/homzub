import { AppRegistry } from 'react-native';
import '@homzhub/common/src/assets/fonts/fonts';

import { App } from './App';

AppRegistry.registerComponent('homzhub', () => App);
AppRegistry.runApplication('homzhub', {
  rootTag: document.getElementById('root'),
});

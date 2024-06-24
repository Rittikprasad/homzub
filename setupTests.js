/* eslint-disable */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

/**
 * Set up DOM in node.js environment for Enzyme to mount to
 */
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM();
const { window } = jsdom;

const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter((prop) => typeof target[prop] === 'undefined')
    .map((prop) => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
};

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

configure({ adapter: new Adapter() });

/**
 * Ignore React Web errors when using React Native
 * allow other errors to propagate if they're relevant
 */
const suppressedErrors = /(React does not recognize the.*prop on a DOM element|Unknown event handler property|is using uppercase HTML|Received `true` for a non-boolean attribute `accessible`|The tag.*is unrecognized in this browser|Use PascalCase for React components|Received `%s` for a non-boolean attribute `%s`|Invalid DOM property `%s`|Not implemented: window.alert|React.createElement: type is invalid)/;
const realConsoleError = console.error;
console.error = (message) => {
  if (message.match(suppressedErrors)) {
    return;
  }
  realConsoleError(message);
};

import React from 'react';
import ReactDOM from 'react-dom';
import {Application} from './app';

// eslint-disable-next-line no-undef
particlesJS('particles-js', '../src/assets/particles.json', () => {});

// eslint-disable-next-line no-undef
ReactDOM.render(<Application/>, document.getElementById('root'));

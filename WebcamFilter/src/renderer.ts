import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

function render() {
  const element = React.createElement;
  const container = document.getElementById('root') as HTMLElement;
  const root = ReactDOM.createRoot(container);
  root.render(element(App));
}

render();


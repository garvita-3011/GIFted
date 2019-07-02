import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Home from './container/Home';

function App () {
  return (
    <div>
      <Header />
      <Home />
    </div>
  );
}

const wrapper = document.getElementById('container');
ReactDOM.render(<App />, wrapper);

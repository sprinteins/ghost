import React from 'react';
import ReactDOM from 'react-dom';

it('its possible to do react tests here ', () => {
  const div = document.createElement('div');
  ReactDOM.render(<div />, div);
  ReactDOM.unmountComponentAtNode(div);
});

import * as React from 'react';
import './Loading.css';
export const Loading: React.SFC<{}> = () => {
  return (
    <>
      <div id="loadingScreen">
        <img src={'./assets/ghost_pacman_gif.gif'} id="loadingScreenGif" />
      </div>
    </>
  );
};

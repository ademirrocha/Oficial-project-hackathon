import React from 'react';
import alert from '../../assets/alert.svg';

function PlacesDetected({text}) {
  return (
    <div>
        <img src={alert} alt="Delivery" height="30px" />
        {text}
      </div>
    );
}

export default PlacesDetected;
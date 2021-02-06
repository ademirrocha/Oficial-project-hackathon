import React from 'react';
import ViewCharts from "../../components/BarChart"
import NavBar from '../../components/NavBar';
import ViewLineCharts from '../../components/LineChart';
import ViewMaps from '../../components/Maps';


function SimpleMap() {

  return (
    <>
    <NavBar/>
    <div className="sub chart-wrapper block-map">
    <ViewMaps />
    </div>
    <ViewCharts></ViewCharts>
    <ViewLineCharts></ViewLineCharts>
    </>

    );
  }

  export default SimpleMap;
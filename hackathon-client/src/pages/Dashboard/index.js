import React from 'react';
import ViewChartLastTwoHours from "../../components/AnalyzeChartLastTwoHours"
import ViewChartLastSixHours from "../../components/AnalyzeChartLastSixHours"
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
    <ViewChartLastTwoHours></ViewChartLastTwoHours>
    <ViewChartLastSixHours></ViewChartLastSixHours>
    <ViewLineCharts></ViewLineCharts>
    </>

    );
  }

  export default SimpleMap;
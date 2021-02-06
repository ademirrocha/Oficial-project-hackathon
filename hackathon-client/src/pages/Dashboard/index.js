import React from 'react';
import ViewChartLastTwoHours from "../../components/AnalyzeChartLastTwoHours"
import ViewChartLastSixHours from "../../components/AnalyzeChartLastSixHours"
import ViewChartLastTwelveHours from "../../components/AnalyzeChartLastTwelveHours"
import ViewChartLastTwentyFourHours from "../../components/AnalyzeChartLastTwentyFourHours"
import ViewChartLastFiveDays from "../../components/AnalyzeChartLastFiveDays"
import ViewChartLastTenDays from "../../components/AnalyzeChartLastTenDays"
import ViewChartLastThirtyDays from "../../components/AnalyzeChartLastThirtyDays"
import NavBar from '../../components/NavBar';
import ViewMaps from '../../components/Maps';


function SimpleMap() {

  return (
    <>
    <NavBar/>
    <div className="main chart-wrapper block-map">
    <ViewMaps />
    </div>
    <ViewChartLastTwoHours></ViewChartLastTwoHours>
    <ViewChartLastSixHours></ViewChartLastSixHours>
    <ViewChartLastTwelveHours></ViewChartLastTwelveHours>
    <ViewChartLastTwentyFourHours></ViewChartLastTwentyFourHours>
    <ViewChartLastFiveDays></ViewChartLastFiveDays>
    <ViewChartLastTenDays></ViewChartLastTenDays>
    <ViewChartLastThirtyDays></ViewChartLastThirtyDays>
    </>

    );
  }

  export default SimpleMap;
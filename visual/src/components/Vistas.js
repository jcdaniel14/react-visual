import * as React from 'react';
import {styled} from '@mui/material/styles';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Prediction from './Prediction.js';
import Estadistica from './Estadistica.js';
import { Component } from "react";

class Vistas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      index: 0
    };
  }

  render(){
    const handleChange = (event, newValue) => {
      this.setState({value: newValue})
    };

    const Tabby = styled(Tab)({
      color: "#001e3c",
      "&:hover": {
        color: "#001e3c"
      },
      "&.Mui-selected": {
        color: "#001e3c"
      },
      "&.Mui-focusVisible": {
        color: "#001e3c"
      }
    });

    return (
      <div className="tabs-container">
        <div>
          <Tabs variant="fullWidth" value={this.state.value} onChange={handleChange} centered>
            <Tabby icon={<AnalyticsIcon />} label="Analisis Estadistico"/>
            <Tabby icon={<AutoGraphIcon />} label="Prediccion" />
          </Tabs>
        </div>
        <div>
          <Box mt={3} role="tabpanel" hidden={this.state.value !== 0}>
            <Estadistica/>
          </Box>
          <Box mt={3} role="tabpanel" hidden={this.state.value !== 1}>
            <Prediction/>
          </Box>
        </div>
      </div>
    );
  }

}
export default Vistas;
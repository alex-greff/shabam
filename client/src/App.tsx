import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom';

// Import global scss
import "./styling/global.scss";
import "./styling/main.scss";

import NavBar from "@/components/NavBar/NavBar";
import AppSwitch from "@/router/AppSwitch";


class App extends Component {
    render() {
        return (
            <Router>
                <div id="App">
                    <NavBar />
                    <AppSwitch />
                </div>
            </Router>
        );
    }
}

export default App;

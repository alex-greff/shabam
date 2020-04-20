import React from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom';

import NavBar from "@/components/NavBar/NavBar";
import AppSwitch from "@/router/AppSwitch";

const App = () => {
    return (
        <Router>
            <div id="App">
                <NavBar />
                <AppSwitch />
            </div>
        </Router>
    );
}

export default App;

import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { DEFAULT_NAMESPACE, DEFAULT_THEME } from "@/constants";

import themes from "@/theme/themes";
import { themeStore } from "@/store/theme/theme.store";
import ThemeProvider from "@/components/wrappers/ThemeProvider";

import NavBar from "@/components/NavBar/NavBar";
import AppSwitch from "@/router/AppSwitch";


class App extends Component {

    private instantiateNamespaces() {
        themeStore.addNamespace(DEFAULT_NAMESPACE, DEFAULT_THEME, true);
    }

    private instantiateThemes() {
        // Add all the themes
        Object.values(themes).forEach((themeData) => {
            themeStore.addTheme(themeData.name, themeData.theme, true);
        });
    }

    componentDidMount() {
        this.instantiateNamespaces();
        this.instantiateThemes();
    }

    render() {
        return (
            <Router>
                <ThemeProvider
                    namespace={DEFAULT_NAMESPACE}
                >
                    <div id="App">
                        <NavBar />
                        <AppSwitch />
                    </div>
                </ThemeProvider>
            </Router>
        );
    }
}

export default App;

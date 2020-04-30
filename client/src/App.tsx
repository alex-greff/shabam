import { AppLocationState } from "@/types";
import React, { Component, FunctionComponent } from 'react';
import './App.scss';
import { Router, Route, matchPath } from 'react-router-dom';
import { DEFAULT_NAMESPACE, DEFAULT_THEME } from "@/constants";
import { createBrowserHistory } from "history";

import themes from "@/theme/themes";
import { themeStore } from "@/store/theme/theme.store";
import ThemeProvider from "@/components/wrappers/ThemeProvider";

import NavBar from "@/components/nav/NavBar/NavBar";

import RouteSwitch from "@/router/RouteSwitch";
import RouteTransition from "@/router/RouteTransition";
import { Location } from "history";


// TODO: move out to separate component?
const Layout: FunctionComponent = ({ children }) => (
    <div id="App">
        <NavBar />
        {children}
    </div>
);

const history = createBrowserHistory<AppLocationState>();

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
            <Router history={history}>
                <ThemeProvider
                    namespace={DEFAULT_NAMESPACE}
                >
                    <Route path="/" 
                        render={(routeProps) => {
                            const location = routeProps.location as Location<AppLocationState>;
                            const transition = location?.state?.transition;

                            return (
                                <Layout>
                                    <RouteTransition 
                                        pageKey={location.pathname}
                                        transition={transition}
                                    >
                                        <RouteSwitch location={location} />
                                    </RouteTransition>
                                </Layout>
                            )
                        }}
                    />
                </ThemeProvider>
            </Router>
        );
    }
}

export default App;

import { AppLocationState } from "@/types";
import React, { Component, FunctionComponent } from 'react';
import './App.scss';
import { Router, Route } from 'react-router-dom';
import { DEFAULT_NAMESPACE, DEFAULT_THEME } from "@/constants";
import { createBrowserHistory } from "history";

import themes from "@/theme/themes";
import { themeStore } from "@/store/theme/theme.store";
import ThemeProvider from "@/components/wrappers/ThemeProvider";

import NavBar from "@/components/nav/NavBar/NavBar";

import RouteView from "@/router/RouteView";
import RouteTransition from "@/router/RouteTransition";
import { Location } from "history";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";


const Layout: FunctionComponent = ({ children }) => (
    <div id="App">
        <OverlayScrollbarsComponent 
            className="App__overlay-container"
            options={{
                paddingAbsolute: true,
                scrollbars: {
                    autoHide: 'leave'
                }
            }}
        >
            <NavBar />
            {children}
        </OverlayScrollbarsComponent>
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
                                        className="App__route-transition"
                                        pageKey={location.pathname}
                                        transition={transition}
                                    >
                                        <RouteView 
                                            className="App__route-view"
                                            location={location} 
                                        />
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

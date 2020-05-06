import { AppLocationState } from "@/types";
import React, { Component } from 'react';
import './App.scss';
import { Router, Route } from 'react-router-dom';
import { DEFAULT_NAMESPACE, DEFAULT_THEME } from "@/constants";
import { createBrowserHistory } from "history";
import update from "immutability-helper";
import { SizeMeProps } from "react-sizeme";

import themes from "@/theme/themes";
import { themeStore } from "@/store/theme/theme.store";
import ThemeProvider from "@/components/wrappers/ThemeProvider";

import NavBar from "@/components/nav/NavBar/NavBar";

import RouteView from "@/router/RouteView";
import RouteTransition from "@/router/RouteTransition";
import { Location } from "history";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const history = createBrowserHistory<AppLocationState>();

interface State {
    scrollAmount: number;
    navbarHeight: number;
    navbarWidth: number;
}

class App extends Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            scrollAmount: 0,
            navbarHeight: 0,
            navbarWidth: 0
        };
    }

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

    onScroll(args?: UIEvent) {
        const target = args?.target as HTMLElement;

        this.setState((prevState) => update(prevState, { 
            scrollAmount: { $set: target.scrollTop }
        }));
    }

    handleNavbarResize(size: SizeMeProps['size']) {
        this.setState((prevState) => update(prevState, {
            navbarHeight: { $set: size.height! },
            navbarWidth: { $set: size.width! }
        }));
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
                                <div id="App">
                                    <OverlayScrollbarsComponent 
                                        className="App__overlay-container"
                                        options={{
                                            scrollbars: {
                                                autoHide: 'leave'
                                            },
                                            callbacks: {
                                                onScroll: (args) => this.onScroll(args)
                                            }
                                        }}
                                    >
                                        <NavBar 
                                            scrollAmount={this.state.scrollAmount}
                                            onSize={(size) => this.handleNavbarResize(size)}
                                            width={this.state.navbarWidth}
                                        />
                                        <RouteTransition 
                                            className="App__route-transition"
                                            pageKey={location.pathname}
                                            transition={transition}
                                        >
                                            <RouteView 
                                                className="App__route-view"
                                                location={location} 
                                                navbarHeight={this.state.navbarHeight}
                                            />
                                        </RouteTransition>
                                    </OverlayScrollbarsComponent>
                                </div>
                            );
                        }}
                    />
                </ThemeProvider>
            </Router>
        );
    }
}

export default App;

import { AppLocationState } from "@/types";
import React, { Component, createRef, RefObject } from 'react';
import KEYS from "@/keys";
import './App.scss';
import { Router, Route } from 'react-router-dom';
import { DEFAULT_NAMESPACE, DEFAULT_THEME } from "@/constants";
import { createBrowserHistory } from "history";
import update from "immutability-helper";
import { SizeMeProps } from "react-sizeme";
import { Location } from "history";
import "mobx-react/batchingForReactDom";

import '@/styling/override-styles/ReactToastify.scss';
import "@/styling/override-styles/Notification.scss";
import { ToastContainer } from "react-toastify";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { NavBarHeightContext } from "@/contexts/NavBarHeightContext";

import PageAlignment from "@/components/page/PageAlignment/PageAlignment";

import OverlayScrollbars from "overlayscrollbars";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import themes from "@/theme/themes";
import { themeStore } from "@/store/theme/theme.store";
import ThemeProvider from "@/components/wrappers/ThemeProvider";

import NavBar from "@/components/nav/NavBar/NavBar";

import RouteView from "@/router/RouteView";
import RouteTransition from "@/router/RouteTransition";

import ThreeJSBackground from "@/components/background/ThreeJSBackground";

// Create the browser history that we will use
const history = createBrowserHistory<AppLocationState>();

// Create the GraphQL client that we will use to connect to the backend
export const apolloClient = new ApolloClient({
    uri: KEYS.GRAPHQL_API_ENDPOINT
});

interface State {
    scrollAmount: number;
    navbarHeight: number;
    navbarWidth: number;
    osInstance?: OverlayScrollbars | null;
}

class App extends Component<{}, State> {
    osRef: RefObject<OverlayScrollbarsComponent>;

    constructor(props: any) {
        super(props);

        this.state = {
            scrollAmount: 0,
            navbarHeight: 0,
            navbarWidth: 0,
            osInstance: null
        };

        this.osRef = createRef<OverlayScrollbarsComponent>();
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

    private updateOsInstance() {
        if (!this.state.osInstance) {
            this.setState((prevState) => update(prevState, {
                osInstance: { $set: this.osRef.current?.osInstance() }
            }));
        }
    }

    componentDidMount() {
        this.instantiateNamespaces();
        this.instantiateThemes();

        this.updateOsInstance();
    }

    componentDidUpdate() {
        this.updateOsInstance();
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
                                    <ThreeJSBackground />

                                    <ToastContainer
                                        className="Notification__container"
                                        newestOnTop={true}
                                    />

                                    <OverlayScrollbarsComponent 
                                        className="App__overlay-container"
                                        ref={this.osRef}
                                        options={{
                                            scrollbars: {
                                                autoHide: 'leave'
                                            },
                                            callbacks: {
                                                onScroll: (args) => this.onScroll(args)
                                            }
                                        }}
                                    >
                                        <ApolloProvider client={apolloClient}>
                                            <NavBar 
                                                scrollAmount={this.state.scrollAmount}
                                                onSize={(size) => this.handleNavbarResize(size)}
                                                width={this.state.navbarWidth}
                                            />

                                            <RouteTransition 
                                                className="App__route-transition"
                                                pageKey={location.pathname}
                                                transition={transition}
                                                osInstance={this.state.osInstance}
                                            >
                                                <NavBarHeightContext.Provider value={this.state.navbarHeight}>
                                                    <PageAlignment className="App__page-alignment">
                                                        <RouteView 
                                                            className="App__route-view"
                                                            location={location} 
                                                        />
                                                    </PageAlignment>
                                                </NavBarHeightContext.Provider>
                                            </RouteTransition>
                                        </ApolloProvider>
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

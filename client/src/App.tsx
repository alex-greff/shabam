import React, { Component, FunctionComponent } from 'react';
import './App.scss';
import { Router, Route, BrowserRouter } from 'react-router-dom';
import { DEFAULT_NAMESPACE, DEFAULT_THEME } from "@/constants";
import { createBrowserHistory, History } from "history";

import themes from "@/theme/themes";
import { themeStore } from "@/store/theme/theme.store";
import ThemeProvider from "@/components/wrappers/ThemeProvider";

import NavBar from "@/components/nav/NavBar/NavBar";
import RouteView from "@/router/RouteView";
import RouteTransitions from "@/router/RouteTransitions";

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Location } from "history";

interface AppLocationState {
    transition?: string;
    duration?: number;
}


const Layout: FunctionComponent = ({ children }) => (
    <div id="App">
        <NavBar />
        {children}
    </div>
);

interface FactoryProps {
    classNames: string;
    timeout: number;
}

const childFactoryCreator = (props: FactoryProps) => (child:any) => React.cloneElement(child, props);

const history = createBrowserHistory<AppLocationState>();

interface RouteProps {
    location: Location<AppLocationState>;
}

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
            // <BrowserRouter>
            <Router history={history}>
                <ThemeProvider
                    namespace={DEFAULT_NAMESPACE}
                >
                    {/* <Router history={history}> */}
                    {/* <BrowserRouter>
                            <div id="App">
                                <NavBar />
                                <Route 
                                    render={({ location }) => (
                                        <RouteTransitions pageKey={location.key}>
                                            <RouteView location={location} />
                                        </RouteTransitions>
                                    )}
                                    // path="/"
                                    // component={Test}
                                />
                            </div>
                    </BrowserRouter> */}
                    {/* </Router> */}
                    <Route path="/" render={({ location }) => {
                        const test = location as Location<AppLocationState>;

                        return (
                            <Layout>
                                {/* <RouteTransitions pageKey={location.key}>
                                    <RouteView location={location} />
                                </RouteTransitions> */}

                                <TransitionGroup
                                    childFactory={childFactoryCreator({ 
                                        classNames: test?.state?.transition || "page", 
                                        timeout: test?.state?.duration || 300 
                                    })}
                                >
                                    <CSSTransition
                                        key={location.pathname}
                                        addEndListener={() => {}}
                                    >
                                        <RouteView location={location} />
                                    </CSSTransition>
                                </TransitionGroup>
                            </Layout>
                        );
                    }}/>
                </ThemeProvider>
            </Router>
            // </BrowserRouter>
        );
    }
}

// const Main = () => (
//     <BrowserRouter>
//         <Route path="/" component={App}/>
//     </BrowserRouter>
// );

// const Test = (props: any) => (
//     <RouteTransitions pageKey={props.location.key}>
//         <RouteView location={props.location} />
//     </RouteTransitions>
// );

export default App;
// export default Main;

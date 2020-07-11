import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import KEYS from "@/keys";
import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { DEFAULT_NAMESPACE, DEFAULT_THEME } from "@/constants";
import update from "immutability-helper";
import { SizeMeProps } from "react-sizeme";
import "mobx-react/batchingForReactDom";
import "@/styling/override-styles/ReactToastify.scss";
import "@/styling/override-styles/Notification.scss";
import { ToastContainer } from "react-toastify";

import { RouteTransitionProvider, useTransition } from "react-route-transition";
import { options as routeTransitionOptions } from "@/transitions/route-transitions";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import { NavBarHeightContext } from "@/contexts/NavBarHeightContext";

import OverlayScrollbars from "overlayscrollbars";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import themes from "@/theme/themes";
import { themeStore } from "@/store/theme/theme.store";
import ThemeProvider from "@/components/wrappers/ThemeProvider";

import NavBar from "@/components/nav/NavBar/NavBar";

import RouteView from "@/router/RouteView";

import ThreeJSBackground from "@/components/background/ThreeJSBackground";
import SearchScene from "@/components/scenes/SearchScene/SearchScene";

// No type declarations for these
const { CSSPlugin, AttrPlugin } = require("gsap/all");

// Create the GraphQL client that we will use to connect to the backend
export const apolloClient = new ApolloClient({
  uri: KEYS.GRAPHQL_API_ENDPOINT,
});

interface State {
  scrollAmount: number;
  navbarHeight: number;
  navbarWidth: number;
  osInstance?: OverlayScrollbars | null;
}

const App: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    scrollAmount: 0,
    navbarHeight: 0,
    navbarWidth: 0,
    osInstance: null,
  });
  const osRef = useRef<OverlayScrollbarsComponent>(null);

  const instantiateNamespaces = () => {
    themeStore.addNamespace(DEFAULT_NAMESPACE, DEFAULT_THEME, true);
  };

  const instantiateThemes = () => {
    // Add all the themes
    Object.values(themes).forEach((themeData) => {
      themeStore.addTheme(themeData.name, themeData.theme, true);
    });
  };

  const updateOsInstance = () => {
    if (!state.osInstance) {
      setState((prevState) =>
        update(prevState, {
          osInstance: { $set: osRef.current?.osInstance() },
        })
      );
    }
  };

  useEffect(() => {
    // NOTE: this prevents the CSSPlugin and the AttrPlugin from 
    // getting tree shaken
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const plugins = [CSSPlugin, AttrPlugin];

    instantiateNamespaces();
    instantiateThemes();

    updateOsInstance();
  }, []);

  useEffect(() => {
    updateOsInstance();
  });

  const onScroll = (args?: UIEvent) => {
    const target = args?.target as HTMLElement;

    setState((prevState) =>
      update(prevState, {
        scrollAmount: { $set: target.scrollTop },
      })
    );
  };

  const handleNavbarResize = (size: SizeMeProps["size"]) => {
    setState((prevState) =>
      update(prevState, {
        navbarHeight: { $set: size.height! },
        navbarWidth: { $set: size.width! },
      })
    );
  };

  useTransition(routeTransitionOptions);

  return (
    <Router>
      <RouteTransitionProvider>
        <ThemeProvider namespace={DEFAULT_NAMESPACE}>
          <div id="App">
            <ToastContainer
              className="Notification__container"
              newestOnTop={true}
            />

            {/* <ThreeJSBackground /> */}
            <SearchScene />

            <OverlayScrollbarsComponent
              className="App__overlay-container"
              ref={osRef}
              options={{
                scrollbars: {
                  autoHide: "leave",
                },
                callbacks: {
                  onScroll: (args) => onScroll(args),
                },
              }}
            >
              <ApolloProvider client={apolloClient}>
                <NavBar
                  scrollAmount={state.scrollAmount}
                  onSize={(size) => handleNavbarResize(size)}
                  width={state.navbarWidth}
                />
                <NavBarHeightContext.Provider value={state.navbarHeight}>
                  <RouteView className="App__route-view" />
                </NavBarHeightContext.Provider>
              </ApolloProvider>
            </OverlayScrollbarsComponent>
          </div>
        </ThemeProvider>
      </RouteTransitionProvider>
    </Router>
  );
};

export default App;

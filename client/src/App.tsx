import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import KEYS from "@/keys";
import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { DEFAULT_NAMESPACE } from "@/constants";
import update from "immutability-helper";
import { SizeMeProps } from "react-sizeme";
import "mobx-react/batchingForReactDom";
import "@/styling/override-styles/ReactToastify.scss";
import "@/styling/override-styles/Notification.scss";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "react-modal-hook";
import { TransitionGroup } from "react-transition-group";

import { RouteTransitionProvider, useTransition } from "react-route-transition";
import { options as routeTransitionOptions } from "@/transitions/route-transitions";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

import { NavBarHeightContext } from "@/contexts/NavBarHeightContext";

import OverlayScrollbars from "overlayscrollbars";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

// Theme-related imports
import themes from "@/theme/themes";
import namespaces from "@/theme/namespaces";
import { schema, mixins } from "@/theme/definition";
import { ThemeApplier, initialize as initializeThemer } from "@/themer-react";

import NavBar from "@/components/nav/NavBar/NavBar";

import RouteView from "@/router/RouteView";

import ThreeJSBackground from "@/components/background/ThreeJSBackground";
import SearchScene from "@/components/scenes/SearchScene/SearchScene";
import { useApolloClient } from "./hooks/useApolloClient";

// No type declarations for these
const { CSSPlugin, AttrPlugin } = require("gsap/all");

// // Create the GraphQL client that we will use to connect to the backend
// export const apolloClient = new ApolloClient({
//   uri: KEYS.GRAPHQL_API_ENDPOINT,
//   cache: new InMemoryCache(),
//   link: createUploadLink({ uri: KEYS.GRAPHQL_API_ENDPOINT })
// });

// Initialize themer
initializeThemer(schema, mixins, themes, namespaces);

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

  const client = useApolloClient();

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
        <ThemeApplier namespace={DEFAULT_NAMESPACE}>
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
              <ApolloProvider client={client}>
                <ModalProvider rootComponent={TransitionGroup}>
                  <NavBar
                    scrollAmount={state.scrollAmount}
                    onSize={(size) => handleNavbarResize(size)}
                    width={state.navbarWidth}
                  />
                  <NavBarHeightContext.Provider value={state.navbarHeight}>
                    <RouteView className="App__route-view" />
                  </NavBarHeightContext.Provider>
                </ModalProvider>
              </ApolloProvider>
            </OverlayScrollbarsComponent>
          </div>
        </ThemeApplier>
      </RouteTransitionProvider>
    </Router>
  );
};

export default App;

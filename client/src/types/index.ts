import { RouteComponentProps, LinkProps } from "react-router-dom";
import { StaticContext } from "react-router";

export type ThemeName = "theme-light" | "theme-dark";

export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export interface AppLocationState {}

export type AppRouteComponentProps = RouteComponentProps<
  {},
  StaticContext,
  AppLocationState
>;
export type AppLinkProps = LinkProps<AppLocationState>;

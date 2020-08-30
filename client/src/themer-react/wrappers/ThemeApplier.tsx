import React, { FunctionComponent, useEffect } from "react";
import { observer, useLocalStore } from "mobx-react";
import { themeStore, assertInitialized } from "../controller";

import CustomPropertiesApplier, {
  Props as CPAProps,
} from "./CustomPropertiesApplier";

export interface Props extends Omit<CPAProps, "properties"> {
  namespace?: string;
  theme?: string;
}

const validateProps = (props: Props) => {
  const bothExist = !!props.namespace && !!props.theme;
  const neitherExist = !props.namespace && !props.theme;

  if (bothExist)
    throw "Error: only one of props 'namespace' and 'theme' can be specified at once.";
  if (neitherExist)
    throw "Error: one of props 'namespace' and 'theme' must be specified.";
};

const ThemeApplier: FunctionComponent<Props> = (props) => {
  useEffect(() => {
    // Validate props
    validateProps(props);
  }, [props]);

  const store = useLocalStore(() => ({
    get themeProperties() {
      const { namespace, theme } = props;

      // Every time this is recomputed, check the props
      validateProps(props);

      assertInitialized();

      // Get the related theme data
      const themeName = namespace ? themeStore!.getNamespace(namespace) : theme;
      const themeData = themeStore!.getTheme(themeName!);
      return themeData ? themeData.properties : {};
    },
  }));

  return (
    <CustomPropertiesApplier {...props} properties={store.themeProperties}>
      {props.children}
    </CustomPropertiesApplier>
  );
};

ThemeApplier.defaultProps = {} as Partial<Props>;

export default observer(ThemeApplier);

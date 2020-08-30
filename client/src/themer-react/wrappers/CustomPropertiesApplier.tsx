import React, { FunctionComponent, useEffect, useState } from "react";
import * as Utilities from "../utilities";

interface CSSProperties {
  [propertyName: string]: string;
}

type ApplyType = "root" | "element";

export interface Props {
  properties: CSSProperties;
  applyType?: ApplyType;
  el?: HTMLElement;
}

const validateProps = (props: Props) => {
  if (props.applyType === "element" && !props.el) {
    throw "Error: el must be specified when applyType is 'element'";
  }
};

const CustomPropertiesApplier: FunctionComponent<Props> = (props) => {
  const [currentlyUsingRoot, setCurrentlyUsingRoot] = useState<boolean>(false);

  useEffect(() => {
    // Ensure props are valid
    validateProps(props);

    const updateRootStyles = (
      properties: CSSProperties,
      applyType: ApplyType
    ) => {
      if (applyType !== "root")
        return;
  
      if (applyType === "root") {
        Object.entries(properties).forEach(([name, value]) => {
          Utilities.saveCSSProperty(name, value);
        });
    
        if (!currentlyUsingRoot) {
          setCurrentlyUsingRoot(true);
        }
      }
  
      if (applyType !== "root" && currentlyUsingRoot) {
        Object.keys(properties).forEach((name) => {
          Utilities.removeCSSProperty(name);
        });
  
        setCurrentlyUsingRoot(false);
      }
    };
  
    const updateElementStyles = (
      properties: CSSProperties,
      applyType: ApplyType,
      el?: HTMLElement
    ) => {
      if (applyType === "root" || !el)
        return;
  
      if (applyType === "element") {
        Object.entries(properties).forEach(([name, value]) => {
          Utilities.saveCSSProperty(name, value, el);
        });
      } else {
        Object.keys(properties).forEach((name) => {
          Utilities.removeCSSProperty(name, el);
        });
      }
    };

    // Update styles
    updateRootStyles(props.properties, props.applyType!);
    updateElementStyles(props.properties, props.applyType!, props.el);
  }, [props, currentlyUsingRoot]);

  return (
    <>
      {props.children}
    </>
  );
};

CustomPropertiesApplier.defaultProps = {
  applyType: "root",
} as Partial<Props>;

export default CustomPropertiesApplier;

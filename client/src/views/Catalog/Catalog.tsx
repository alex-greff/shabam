import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./Catalog.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";

export interface Props extends Omit<BaseProps, "id"> {}

const Catalog: FunctionComponent<Props> = (props) => {
  return (
    <PageView
      id="Catalog"
      className={classnames(props.className)}
      style={props.style}
    >
      Catalog View content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
      content
      <br />
    </PageView>
  );
};

export default Catalog;

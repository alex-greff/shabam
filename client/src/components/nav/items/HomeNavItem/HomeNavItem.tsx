import React, { FunctionComponent } from "react";
import "./HomeNavItem.scss";
import classnames from "classnames";

import NavItemBase, {
  Props as NavItemBaseProps,
} from "@/components/nav/items/NavItemBase/NavItemBase";

export interface Props extends NavItemBaseProps {}

const HomeNavItem: FunctionComponent<Props> = (props) => {
  return (
    <NavItemBase
      {...props}
      className={classnames("HomeNavItem", props.className)}
    >
      <span className="HomeNavItem__text-first">Sha</span>
      <span className="HomeNavItem__text-second">bam</span>
    </NavItemBase>
  );
};

HomeNavItem.defaultProps = {} as Partial<Props>;

export default HomeNavItem;

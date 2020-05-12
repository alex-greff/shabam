import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./SearchScene.scss";
import classnames from "classnames";

import BaseArc from "@/components/ui/arcs/BaseArc/BaseArc";

export interface Props extends BaseProps {

};

const SearchScene: FunctionComponent<Props> = (props) => {
    return (
        <div className={classnames("SearchScene", props.className)}>
            <div className="SearchScene__scene">
                <div className="SearchScene__main-circle"></div>

                <BaseArc 
                    className="SearchScene__test-arc"
                    stroke={0.5}
                    progress={20}
                />
            </div>
        </div>
    );
};

SearchScene.defaultProps = {

} as Partial<Props>;

export default SearchScene;
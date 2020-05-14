import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types"
import "./Home.scss";
import classnames from "classnames";

import PageView from "@/components/page/PageView/PageView";
import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";
import MouseIcon from "@material-ui/icons/MouseOutlined";

export interface Props extends BaseProps {

}

const Home: FunctionComponent<Props> = (props) => {
    return (
        <PageView 
            id="Home" 
            className={classnames(props.className)}
            ignoreNavbarHeight={true}
        >
            <div className="Home__content">
                <div className="Home__intro">
                    <div className="Home__logo">
                        <span className="Home__logo-text-first">
                            Sha
                        </span>
                        <span className="Home__logo-text-second">
                            bam
                        </span>
                    </div>

                    <div className="Home__blurb">
                        Music Recognition Project
                    </div>
                </div>

                <NormalButton
                    className="Home__enter-button"
                    path="/search"
                >
                    <MouseIcon 
                        className="Home__mouse-icon"
                    />

                    <div className="Home__enter-text">
                        Click To Get Started
                    </div>
                </NormalButton>
            </div>            
        </PageView>
    );
};

export default Home;
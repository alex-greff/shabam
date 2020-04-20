import React, { FunctionComponent } from "react";
import "./NavBar.scss";
import {
    Link
} from "react-router-dom";

type Props = {

}

const NavBar: FunctionComponent<Props> = (props) => {
    return (
        <div id="NavBar">
            <Link to="/">Shabam</Link> |&nbsp;
            <Link to="/search">Search</Link> |&nbsp;
            <Link to="/catalog">Catalog</Link>
        </div>
    );
};

export default NavBar;
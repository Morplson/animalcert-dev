import React, { useEffect, useContext, Component } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Background from "./Background";

class Layout extends Component {
    render() {
        return(
            <React.Fragment>
                <Navbar />
                <Outlet />
                <Footer />
                <Background />
            </React.Fragment>
        );
    }
};

export default Layout;
import React, { useState } from 'react'
import { withRouter } from 'next/router'

import './Navbar.css';

function Navbar() {

    const [navbarShow, setNavbarShow] = useState(false);

    return (
        <div className="Navbar">
            {navbarShow ? 
            (
                <div className="Navbar-active">
                    <button className="Navbar-close-button" onClick={() => setNavbarShow(false)}>X</button>
                </div>
            ) :
            (
                <div className="Navbar-default">
                    <button className="Navbar-active-button" onClick={() => setNavbarShow(true)}>☰</button>
                </div>
            )
            }
        </div>
    )
}

export default withRouter(Navbar)
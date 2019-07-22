import React, { useState } from 'react'
import { withRouter } from 'next/router'

import './Navbar.css';

function Navbar() {

    const [navbarShow, setNavbarShow] = useState(false);

    return (
        <nav className="Navbar">
            {navbarShow ? 
            (
                <div className="Navbar__active">
                    <button className="Navbar__close-button" onClick={() => setNavbarShow(false)}>X</button>
                    <a href="" className="Navbar__route">Home</a><br/>
                    <a href="" className="Navbar__route">About</a><br/>
                    <a href="" className="Navbar__route">Config</a><br/>
                    <a href="" className="Navbar__route">Q&A</a><br/>
                </div>
            ) :
            (
                <div className="Navbar__default">
                    <button className="Navbar__active-button" onClick={() => setNavbarShow(true)}>☰</button>
                </div>
            )
            }
        </nav>
    )
}

export default withRouter(Navbar)
import React, { useState } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';

import './Navbar.css';

function Navbar() {

    const [navbarShow, setNavbarShow] = useState(false);

    return (
        <nav className="Navbar">
            {navbarShow ? 
            (
                <div className="Navbar__active">
                    <button className="Navbar__close-button" onClick={() => setNavbarShow(false)}>X</button>
                    <Link href="/" ><a className="Navbar__route">Home</a></Link><br/>
                    <Link href="/About" ><a className="Navbar__route">About</a></Link><br/>
                    <Link href="/CreateArticle" ><a className="Navbar__route">new article</a></Link><br/>
                    <Link href="/" ><a className="Navbar__route">Q&A</a></Link><br/>
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
import React, { Component } from 'react'
import { withRouter } from 'next/router'

import './index.css';

import Navbar from '../components/Navbar/Navbar';

class index extends Component {
    render() {
        return (
            <div className="home">
                <Navbar />
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit, laborum ab adipisci nihil reiciendis alias, iusto eveniet nemo enim quas iste odit dolorem modi quibusdam animi aut eius illo temporibus?</p>   
            </div>
        )
    }
}

export default withRouter(index);
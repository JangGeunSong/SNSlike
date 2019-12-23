import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Renderer from 'react-test-renderer'

describe("Navbar testing", () => {
    
    const wrapper = Renderer.create(<Navbar />)

    it('should have button on navbar', () => {
        const openButton = wrapper.root.findByProps({ className:"Navbar__active-button" })
        Renderer.act(() => openButton.props.onClick())
        console.log(wrapper.root.children)
    })
})
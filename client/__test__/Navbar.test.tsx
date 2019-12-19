import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import renderer from 'react-test-renderer'

describe("Navbar testing", () => {
    it("Navbar is rendered?", () => {
        const nav = renderer.create(
            <Navbar />
        )
        let tree = nav.toJSON();

        expect(tree).toMatchSnapshot()
    })
})
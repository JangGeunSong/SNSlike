import React from 'react';
import Renderer from 'react-test-renderer';
import Index from '../pages/index';

describe('Index', () => {
    it('should render without throwing an error', () => {
        const testRenderer = Renderer.create(<Index />);
        expect(testRenderer.toJSON()).toMatchSnapshot();
    });
});
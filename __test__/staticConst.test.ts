import { SECRET_KEY } from '../staticConst'

describe('Const check', () => {
    it('const check to correct value', () => {
        expect(SECRET_KEY).toBe('somesupersecurity');
    })
})
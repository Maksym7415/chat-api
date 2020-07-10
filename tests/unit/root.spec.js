const forgotPassword = require('../forgotPassword');

describe("forgotPassword()", () => {
    it("should return true", () => {
        //Testing a boolean
        expect(forgotPassword(2, 2)).toBeTruthy();
        //Another way to test a boolean
        expect(forgotPassword(2, 2)).toEqual(4);
    });
});
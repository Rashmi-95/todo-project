var expect = chai.expect;
var should = chai.should()
var todoFunctions = require('../jqueryFunctions.js')

describe('Escape HTML Special characters', function () {
  it('should return eascaped string when a string with special character is passed', function () {
    const scriptString = '<script>alert("hey");</script>'
    expect(todoFunctions.escapeHtml(scriptString)).to.equal(1);
  })
  it('2 should be greater than 1', function () {
    expect(2).to.be.greaterThan(1);
  })
})

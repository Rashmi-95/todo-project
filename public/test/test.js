var expect = chai.expect
var should = chai.should()

todos = {
  1: { description: 'd1', status: true },
  3: { description: 'd2', status: false },
  600: { description: 'd3', status: false },
  100: { description: 'd4', status: true }
}
const listWithTrueStatus = {
  1: { description: 'd1', status: true },
  100: { description: 'd4', status: true }
}
const listWithFalseStatus = {
  3: { description: 'd2', status: false },
  600: { description: 'd3', status: false },
}

describe('Filter Object with Status Functionality', function () {

  it('should return object with status true, when status passed is true', function () {
    expect(JSON.stringify(filterTodo(true))).to.equal(JSON.stringify(listWithTrueStatus))
  })

  it('should return object with status false, when status passed is false', function () {
    expect(JSON.stringify(filterTodo(false))).to.equal(JSON.stringify(listWithFalseStatus))
  })

  it('should return invalid Status, when non boolean value is passed', function () {
    expect(filterTodo('hey')).to.equal('Invalid Status')
  })

  it('should return empty object, when empty todo is present', function () {
    todos = {}
    expect(JSON.stringify(filterTodo(false))).to.equal(JSON.stringify({}))
  })
})
describe('Escape HTML Special characters', function () {
  it('should return eascaped string when a string with special character is passed', function () {
    const scriptString = '<script>alert("hey");</script>'
    expect(escapeHtml(scriptString)).to.equal('&lt;script&gt;alert(&quot;hey&quot;);&lt;&#x2F;script&gt;')
  })
  it('show return same sring when special characters are not passed', function () {
    const scriptString = 'Hello!'
    expect(escapeHtml(scriptString)).to.be.equal('Hello!')
  })
})

describe('check-all items in list Functionality', function () {
  it('should return "All task are updated", when a status "true" is passed to check-all the items in list', function (done) {
    checkall(false, (xhr) => {
      expect(xhr.responseText).to.be.equal('All task are updated')
      done()
    })
  })

  it('should return "All task are updated", when a status "false" is passed to uncheck-all the items in list', function (done) {
    checkall(true, (xhr) => {
      expect(xhr.responseText).to.be.equal('All task are updated')
      done()
    })
  })

  it('should return invalid inout for type boolean, when a non bool value is passed', function (done) {
    const invalidStatus = 'hi'
    checkall(invalidStatus, (xhr) => {
      expect(xhr.responseJSON.message).to.be.equal(`invalid input syntax for type boolean: "${invalidStatus}"`)
      done()
    })
  })

  it('should return invalid inout for type boolean, when undefined variable is passed', function (done) {
    let invalidStatus
    checkall(invalidStatus, (xhr) => {
      expect(xhr.responseJSON.message).to.be.equal(`invalid input syntax for type boolean: "${invalidStatus}"`)
      done()
    })
  })
})

describe('check particular items in list Functionality', function () {
  it('should return task updated status, when a valid id and true status is passed', function (done) {
    id = Object.keys(todos)[0]
    updateStatus(id, true, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })
  it('should return task updated status, when a valid id and false status is passed', function (done) {
    id = Object.keys(todos)[0]
    updateStatus(id, false, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })
  it('should return invalid status, when a valid id and invalid status variable is passed', function (done) {
    id = Object.keys(todos)[0], invalidStatus = 'hi'
    updateStatus(id, invalidStatus, (xhr) => {
      expect(xhr.responseJSON.message).to.be.equal(`invalid input syntax for type boolean: "${invalidStatus}"`)
      done()
    })
  })
  it('should return task with id doesnt exist, when a invalid id and status variable is passed', function (done) {
    const id = 900
    updateStatus(id, true, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} doesnt exist to update`)
      done()
    })
  })
})

describe('change Description of particular items in list Functionality', function () {
  it('should return task updated, when a valid id and string description is passed', function (done) {
    id = Object.keys(todos)[0]
    updateDescription(id, 'new description', (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })

  it('should return task updated, when a valid id and number description are passed', function (done) {
    id = Object.keys(todos)[0], decription = 123
    updateDescription(id, decription, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })
})

describe('delete particular items in list Functionality', function () {
  it('should return the task is deleted, when valid id is passed is called', function (done) {
    id = Object.keys(todos)[0]
    deleteItem(id, (xhr) => {
      expect(xhr.responseText).to.be.equal('The task has been deleted')
      done()
    })
  })
  it('should return invalid task to delete when invalid id is passed ', function (done) {
    const id = 444
    deleteItem(id, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id =${id} doesnt exist to delete`)
      done()
    })
  })
})

describe('delete all checked items in list Functionality', function () {
  it('should return the task are deleted, when function is called', function (done) {
    deleteCompleted((xhr) => {
      expect(xhr.responseText).to.be.equal('The completed task(s) is/are deleted')
      done()
    })
  })

  it('should return no task to delete when no function is called', function (done) {
    deleteCompleted((xhr) => {
      expect(xhr.responseText).to.be.equal('No task to delete')
      done()
    })
  })
})

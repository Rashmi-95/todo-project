var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}
const escapeHtml = string => String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s])
let todos = []

function filterList () {
  const url = location.hash
  $('.filters a').prop('class', '')
  switch (url) {
    case '#/': $('a[href$="#/"').attr('class', 'selected')
      $('.todo-list li').show()
      break
    case '#/active': $('a[href$="#/active"]').attr('class', 'selected')
      $('.todo-list .active').show()
      $('.todo-list .completed').hide()
      break
    case '#/completed': $('a[href$="#/completed" ]').attr('class', 'selected')
      $('.todo-list .active').hide()
      $('.todo-list .completed').show()
      break
  }
}
function checkall (status) {
  $.ajax({
    url: `/update/`,
    type: 'PUT',
    data: `checkAll=${status}`,
    success: (result) => {
      todos.forEach((item) => (item.status = status))
      const className = (status) ? 'completed' : 'active'
      $(`.main li`).prop('class', className)
      showActiveCount()
      showClearComplete()
      filterList()
    }
  })
}

function hideWhenNoList() {
  console.log(todos, todos.empty, todos.length)
  if (todos.empty || todos.length === 0) {
    $('.toggle-all').hide()
    $('.footer').hide()
  } else {
    $('.toggle-all').show()
    $('.footer').show()
  }
}
function deleteCompleted () {
  $.ajax({
    url: `/delete/`,
    type: 'DELETE',
    data: `status=true`,
    success: (result) => {
      todos.forEach(function (index) {
        if (index.status === true) {
          delete todos[index.id]
          $(`li#${index.id}`).remove()
        }
      })
      $('.clear-completed').hide()
      showActiveCount()
      filterList()
      hideWhenNoList()
    }
  })
}

function createLi (id, description, checked = '') {
  const className = (checked === '') ? 'active' : 'completed'
  return `<li id="${id}" class ="${className}">
      <div class="view">
      <input class ="toggle" type="checkbox" id="todo-checkbox-${id}" ${checked}>
      <label id="todo-label-${id}">${description}</label>
      <input id="todo-edit-textbox-${id}" class="edit" type="text" name="editableText">
      <button id="todo-button-${id}" class="destroy"></button>
      </div>
      
      </li>`
}

function getActiveList () {
  const filteredList = todos.filter((item) => {
    return !item.status
  })
  return filteredList
}

function getCompletedList () {
  const filteredList = todos.filter((item) => {
    return item.status
  })
  return filteredList
}

function deleteItem (id) {
  $.ajax({
    url: `/delete/${id}`,
    type: 'DELETE',
    success: (result) => {
      delete todos[id]
      $(`li#${id}`).remove()
      showClearComplete()
      showActiveCount()
    }
  })
}

function updateStatus (id, status) {
  const ItemStatus = status
  $.ajax({
    url: `/update/${id}`,
    type: 'PUT',
    data: `description=&status=${ItemStatus}`,
    success: (result) => {
      todos[id].status = ItemStatus
      const className = (ItemStatus) ? 'completed' : 'active'
      $(`li#${id}`).prop('class', className)
      showActiveCount()
      showClearComplete()
    }
  })
}

function updateDescription (id, updateDescription, originalDescription) {
  if (updateDescription !== originalDescription) {
    $.ajax({
      url: `/update/${id}`,
      type: 'PUT',
      data: `description=${escapeHtml(updateDescription)}&status=`,
      success: (result) => (todos[id].status = status)
    })
  }
}

function addItem () {
  const content = $('.new-todo').val()
  if (content !== '') {
    $.post(`/write/${escapeHtml(content)}`, function (data) {
      todos[data] = { 'id': data, 'description': content, 'status': false }
      $('.new-todo').val('')
      render()
      filterList()
      hideWhenNoList()
    })
  }
}

function itemFunctionality () {
  $('.destroy').click(function () {
    deleteItem($(this).closest('li').attr('id'))
  })

  $('.toggle').change(function () {
    const id = $(this).closest('li').attr('id');
    (this.checked) ? updateStatus(id, true) : updateStatus(id, false)
  })

  $('li').dblclick(function () {
    const value = $(this).find('label').hide().text()
    $(this).find('.destroy').hide()
    $(this).find('.edit').show().focus().val(value)
  })

  $('.edit').focusout(function () {
    const changedContent = $(this).hide().val()
    if (changedContent === '') {
      deleteItem($(this).closest('li').attr('id'))
    } else {
      const originalContent = $(this).prev().text()
      $(this).prev().html($(this).val()).show()
      updateDescription($(this).closest('li').attr('id'), changedContent, originalContent)
    }
  })
}

function listFunctionality () {
  $('.header .new-todo').keyup(function (event) {
    if (event.keyCode === 13) {
      addItem()
    }
  })

  $('.toggle-all').change(function () {
    const status = this.checked
    $('.toggle').prop('checked', status)
    checkall(status)
  })

  $('.clear-completed').click(() => deleteCompleted())

  $(window).on('hashchange', () => filterList())
}
function read () {
  $.get('/read', (data) => {
    data.forEach(function (item) {
      todos[item.id] = item
    })
    render()
    listFunctionality()
  })
}

function showActiveCount () {
  const activeList = getActiveList()
  $('.todo-count').text(`${activeList.length} items left`)
}

function showClearComplete () {
  const completedList = getCompletedList();
  (completedList.length === 0) ? $('.clear-completed').hide() : $('.clear-completed').show()
}

function render () {
  showActiveCount()
  showClearComplete()
  let content = '<ul class="todo-list">'
  let checked
  todos.forEach(function (item) {
    let description = escapeHtml(item.description)
    checked = (item.status === true) ? 'checked' : ''
    content += createLi(item.id, description, checked)
    if (item.status === false) {
      $('.toggle-all').prop('checked', false)
    }
  })
  content += '</ul>'
  $('.main').html(content)
  $('.editTextbox').hide()
  itemFunctionality()
  hideWhenNoList()
}
$(document).ready(function () {
  read()
})

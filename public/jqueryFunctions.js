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

function addItem(afterRead) {
  const content = $('#new-todo').val()
  $.post(`/write/${escapeHtml(content)}`, function (data) {
    $(`#result ul`).append(`
       <li id="${data}">
          <input class ="checkbox" type="checkbox" name="checkbox" id="id${data}" >
          <label for="id${data}">${content}</label>
          <input class="editTextbox" type="text" name="editableText" style="display:none">
          <button class="delete">X</button>
        </li>`)
    $('#new-todo').val('')
    afterRead()
  })
}

function updateStatus(id, status) {
  $.ajax({
    url: `/update/${id}`,
    type: 'PUT',
    data: `description=&status=${status}`,
    success: (result) => (result)
  })
}

function updateDescription(id, description) {
  $.ajax({
    url: `/update/${id}`,
    type: 'PUT',
    data: `description=${escapeHtml(description)}&status=`,
    success: (result) => (result) // false case
  })
}

function deleteItem(id) {
  $.ajax({
    url: `/delete/${id}`,
    type: 'DELETE',
    success: (result) => (
      $(`li#${id}`).remove())
  })
}

function afterRead() { // check this
  $('#header #new-todo').keyup(function (event) {
    if (event.keyCode === 13) {
      addItem(afterRead)
    }
  })
  /* $('#write_button').click(() => addItem())*/

  $('.delete').click(function () {
    console.log('delete')
    deleteItem($(this).closest('li').attr('id'))
  })

  $('.checkbox').change(function () {
    console.log('checkbox');
    (this.checked) ? updateStatus($(this).closest('li').attr('id'), true) : updateStatus($(this).closest('li').attr('id'), false)
  })

  $('li').dblclick(function () {
    console.log('double click')
    const value = $(this).find('label').hide().text()
    $(this).find('.editTextbox').show().focus().val(value)//dash case for names
  })

  $('.editTextbox').focusout(function () {
    console.log('edit')
    const value = $(this).hide().val()
    $(this).prev().html($(this).val()).show()
    updateDescription($(this).closest('li').attr('id'), value)
  })
}

function read(afterRead) {
  $.get('/read', (data) => {
    let content = '<ul>'
    let checked
    data.forEach(function (item) {
      let description = escapeHtml(item.description)
      checked = (item.status === true) ? 'checked' : ''
      content += `
        <li id="${item.id}">
          <input class ="checkbox" type="checkbox" name="checkbox" id="id${item.id}" ${checked}>
          <label for="id${item.id}">${description}</label>
          <input class="editTextbox" type="text" name="editableText">
          <button class="delete">X</button>
        </li>`
    })
    content += '</ul>'
    $('#result').html(content)
    $('.editTextbox').hide()
    afterRead()
  })
}

$(document).ready(function () {
  read(afterRead)
})

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

function addItem () {
  const content = $('#new-todo').val()
  $.post(`/write/${escapeHtml(content)}`, (data) => read(afterRead))
  $('#new-todo').val('')
}

function updateStatus (id, status) {
  $.ajax({
    url: `/update/${id}`,
    type: 'PUT',
    data: `description=&status=${status}`,
    success: (result) => read(afterRead)
  })
}

function updateDescription (id, description) {
  $.ajax({
    url: `/update/${id}`,
    type: 'PUT',
    data: `description=${description}&status=`,
    success: (result) => read(afterRead)
  })
}

function deleteItem (id) {
  $.ajax({
    url: `/delete/${id}`,
    type: 'DELETE',
    success: (result) => read(afterRead)
  })
}

function afterRead () {
  $('#write_button').click(() => addItem())

  $('.delete').click(function () {
    deleteItem($(this).closest('li').attr('id'))
  })

  $('.checkbox').change(function () {
    (this.checked) ? updateStatus($(this).closest('li').attr('id'), true) : updateStatus($(this).closest('li').attr('id'), false)
  })

  $('li').dblclick(function () {
    const value = $(this).find('label').hide().text()
    $(this).find('.editTextbox').show().focus().val(value)
  })

  $('.editTextbox').focusout(function () {
    const value = $(this).hide().val()
    $(this).prev().html($(this).val()).show()
    updateDescription($(this).closest('li').attr('id'), value)
  })
}

function read (afterRead) {
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
    $('div#result').html(content)
    $('.editTextbox').hide()
    afterRead()
  })
}

$(document).ready(function () {
  read(afterRead)
})

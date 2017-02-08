module.exports = function (sequelize, res, id) {
  sequelize.query(`DELETE FROM task WHERE id = ${id} ;`)
    .then(function (task) {
      if (task[1].rowCount) {
        console.log('The task is deleted')
        res.send(`The task has been deleted`)
      } else {
        console.log('The task doesnt exist to delete')
        res.send(`The task with id =${id} doesnt exist to delete`)
      }
    })
    .catch(function () {
      console.log('Error in deleteing')
      res.send('Error in deleteing')
    })
}

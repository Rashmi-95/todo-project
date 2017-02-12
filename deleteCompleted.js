module.exports = function (sequelize, res, status) {
  const query = `DELETE FROM task WHERE status = :status_;`
  sequelize.query(query,
    {
      replacements: {status_: status}
    })
    .then(function (task) {
      if (task[1].rowCount) {
        console.log('The completed task(s) is/are deleted')
        res.send(`The completed task(s) is/are deleted`)
      } else {
        console.log('No task to delete')
        res.send(`No task to delete`)
      }
    })
    .catch(function () {
      console.log('Error in deleteing')
      res.send('Error in deleteing')
    })
}

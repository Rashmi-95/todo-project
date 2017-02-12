module.exports = function (sequelize, res, checkAll) {
  const query = `UPDATE task SET status = :status_;`
  sequelize.query(query,
    {
      replacements: {status_: checkAll}
    })
    .then(function (task) {
      if (task[1].rowCount) {
        console.log('All tasks are updates')
        res.send(`All task are updated`)
      } else {
        console.log('NO task is updates')
        res.send(`NO task is updates`)
      }
    })
    .catch(function (error) {
      console.log('Error in Updating', error)
      res.send('Error in Updating')
    })
}

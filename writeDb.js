module.exports = function (sequelize, res, contentToWrite) {
  sequelize.query(`INSERT INTO task (description, status) VALUES ('${contentToWrite}',false)`,
    { type: sequelize.QueryTypes.INSERT })
    .then(function (task) {
      console.log('The task is added to the task list')
      res.send('The task is added to the task list')
    })
    .catch(function () {
      console.log('Error in Inserting')
      res.send('Error in Inserting')
    })
}

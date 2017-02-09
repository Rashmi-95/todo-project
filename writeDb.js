module.exports = function (sequelize, res, contentToWrite) {
  sequelize.query(`INSERT INTO task (description, status) VALUES ('${contentToWrite}',false) returning id`)
    .then(function (task) {
      const id = task[0].id
      res.status(200).send((id).toString())
    })
    .catch(function (err) {
      console.log('Error in Inserting', err)
      res.send('Error in Inserting', err)
    })
}

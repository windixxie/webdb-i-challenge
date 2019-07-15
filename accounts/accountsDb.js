const db = require("../data/dbConfig");

module.exports = {
  get,
  getById,
  getTotal,
  insert,
  update,
  remove
};

function getTotal() {
  return db("accounts").count();
}

function get(query) {
  const { page = 1, limit = 10, sortby = "id", sortdir = "asc" } = query;
  const offset = limit * (page - 1);

  return db("accounts")
    .orderBy(sortby, sortdir)
    .limit(limit)
    .offset(offset);
}

function getById(id) {
  return db("accounts")
    .where({ id })
    .first();
}

function insert(account) {
  return db("accounts")
    .insert(account)
    .then(ids => {
      return getById(ids[0]);
    });
}

function update(id, changes) {
  return db("accounts")
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db("accounts")
    .where({ id })
    .del();
}

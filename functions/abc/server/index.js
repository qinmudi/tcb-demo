const test = async () => {
  return {
      test: 'test function'
  }
}

const getCache = async (db) => {
  const dbName = 'mp-web-token'
  const data = await db.collection(dbName).orderBy('create_time', 'desc').get()
  return data
}

module.exports = {
  test,
  getCache
}
// 这是路由处理函数模块

// 导入数据操作模块
const db = require('../db/index')
const {reg_login_schema} = require("../schema/user");

// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
  // 定义查询分类列表数据的sql语句
  const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
  // 调用query执行sql语句
  db.query(sql, (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err)
    // 执行成功
    res.send({
      status: 200,
      message: '查询数据成功',
      data: results,
    })
  })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
  // 定义查重的sql语句
  const sql = 'select * from ev_article_cate where name=? or alias=?'
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err)

    // 判断数据是否被暂用 length
    if (results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')

    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
      return res.cc('分类名称与分类别名被占用，请更换后重试！')

    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')

    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

    // 分类名称和分类别名都可用，添加分类操作
    // 定义插入文章分类的sql语句
    const sql = 'insert into ev_article_cate set ?'
    // 执行插入文章分类的sql语句
    db.query(sql, req.body, (err, results) => {
      // 执行语句失败
      if (err) return res.cc(err)
      // 判断是否添加成功
      if (results.affectedRows !== 1) return res.cc('新增文章分类失败')
      // 添加分类成功
      res.cc('新增分类成功', 200)
    })
  })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
  // 定义查询是否有此文章分类sql语句
  const sql = 'select * from ev_article_cate where id=?'
  // 执行sql语句
  db.query(sql, req.params.id, (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err)
    // 判断是否执行成功
    if (results.length === 0) return res.cc('删除失败，没有此文章分类')

    // 定义标记删除的sql语句
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    // 调用query执行sql语句
    db.query(sql, req.params.id, (err, results) => {
      // 执行语句失败
      if (err) return res.cc(err)
      // 判断是否执行成功
      if (results.affectedRows !== 1) return res.cc('删除文章分类失败')
      // 执行成功
      res.cc('删除文章分类成功', 200)
    })
  })
}

// 获取文章的处理函数
exports.obtainArticle = (req, res) => {
  // 定义执行的sql语句
  const sql = 'select * from ev_article_cate where id=?'
  // 执行sql语句
  db.query(sql, req.params.id, (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err)
    // 判断是否查询成功
    if (results.length !== 1) return res.cc('获取文章失败')
    // 查询成功
    res.send({
      status: 200,
      message: '查询文章成功',
      data: results[0]
    })
  })
}

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  // 定义执行的sql语句
  const sql = 'select * from ev_article_cate where id!=? and (name=? or alias=?)'
  // 执行sql语句
  db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err)
    // 判断名称和别名被占用的4种情况
    if (results.length === 2) res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
      return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

    // 定义文章分类的sql语句
    const sql = 'update ev_article_cate set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, results) => {
      // 执行语句失败
      if (err) return res.cc(err)
      // 判断是执行成功
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
      // 执行成功
      res.cc('更新文章分类成功!', 200)
    })
  })

}
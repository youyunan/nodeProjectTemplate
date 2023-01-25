// 导入数据库操作模块
const db = require('../db/index')

//导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  //定义查询用户信息的sql语句
  const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?'
  db.query(sql, req.user.id, (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc(err)
    //执行sql语句成功，但是查询结果为空
    if (results.length !== 1) return res.cc('获取用户信息失败！')

    // 用户信息获取成功
    res.send({
      status: 200,
      message: '获取用户信息成功',
      data: results[0]
    })
  })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  //定义待执行的sql语句
  const sql = 'update ev_users set ? where id=?'
  // 调用db.query执行sql语句并传递参数
  db.query(sql, [req.body, req.user.id], (err, results) => {
    console.log(results)
    // 执行sql语句失败
    if (err) return res.cc(err)
    // 执行sql语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败！')
    res.send({
      status: 200,
      message: '更新信息成功'
    })
  })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
  // 定义用户是否存在的sql语句
  const sql = 'select * from ev_users where id=?'
  // 根据用户id查询用户的信息的sql语句
  db.query(sql, req.user.id, (err, result) => {
    // 执行sql语句失败
    if (err) return res.cc(err)
    // 判断用户是否存在
    if (result.length !== 1) return res.cc('用户不存在')
    // // 判断旧密码是否一致
    const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
    if (!compareResult) return res.cc('旧密码错误')

    // 定义更新密码的sql语句
    const sql = 'update ev_users set password=? where id=?'
    // 对新密码进行加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 调用query执行sql语句
    db.query(sql, [newPwd, req.user.id], (err, result) => {
      // 执行语句失败
      if (err) return res.cc(err)
      // 判断影响的行数
      if (result.affectedRows !== 1) return res.cc('更新密码失败！')
      // 更新密码成功
      res.cc('更新密码成功', 200)
    })
  })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  // 定义更新头像的sql语句
  const sql = 'update ev_users set user_pic=? where id=?'
  // 调用query执行sql语句
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc(err)
    // 更新影响的行数是否等于1
    if (results.affectedRows !== 1) return res.cc('更新头像失败')
    // 更新头像成功
    res.cc('更新头像成功', 200)
  })
}
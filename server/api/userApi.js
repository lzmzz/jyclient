var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')
// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()

// 登录接口
router.post('/login', (req, res) => {
  var sql = $sql.user.login
  var loginSuccess = $sql.user.loginSuccess
  var getUserInfo = $sql.user.getUserInfo
  var params = req.body
  conn.query(sql, [params.tel], function (err, result1) {
    if (err) {
      console.log(err)
    }
    console.log(result1);
    if (result1) {
      if (result1.length < 1) {
        return res.json({
          data: '该用户不存在',
          status: -1
        })
        return
      }
      if (result1[0].pwd != params.pwd) {
        return res.json({
          data: '密码错误',
          status: -1
        })
        return
      }
      var nowTime = Date.parse(new Date())
      var token = Math.random().toString(36).substr(2)
      conn.query(loginSuccess, [nowTime, token, params.tel], function (err, result) {
        //存时间戳
        if (err) {
          return res.json({
            data: err,
            status: 0
          })
          console.log(err)
        }
        if (result) {
          conn.query(getUserInfo, [token], function (err, result2) {
            return res.json({
              data: result2[0],
              status: 0
            })
          })
        }
      })
    }
  })
})
// 获取用户信息接口
router.post('/getUserInfo', (req, res) => {
  var sql = $sql.user.getUserInfo
  var params = req.body
  conn.query(sql, [params.token], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      if (result.length < 1) {
        return res.json({
          data: '该用户不存在',
          status: -1
        })
        return
      }
      var nowTime = Date.parse(new Date()) / 1000
      if (_.isEmpty(result[0].login_time) || (result[0].login_time / 1000 + 21600) < nowTime) {
        //登录失效
        return res.json({
          data: '您还未登录，请先登录',
          status: -1
        })
        return
      }
      return res.json({
        data: result[0],
        status: 0
      })
    }
  })
})
// 修改密码接口
router.post('/changePwd', (req, res) => {
  var changePwd = $sql.user.changePwd
  var login = $sql.user.login
  var params = req.body
  conn.query(login, [params.tel], function (err, result) {
    //先查老密码
    if (err) {
      console.log(err)
    }
    if (result) {
      if (result.length < 1) {
        res.json({
          data: '该用户不存在',
          status: -1
        })
        return
      }
      if (result[0].pwd == params.oldPwd) {
        //如果老密码正确，再改密码
        conn.query(changePwd, [params.newPwd, params.tel], function (err, result) {
          if (err) {
            console.log(err)
          }
          if (result) {
            res.json({
              data: '修改成功',
              status: 0
            })
          }
        })
      } else {
        res.json({
          data: '旧密码不正确',
          status: -1
        })
      }
    }
  })

})

module.exports = router
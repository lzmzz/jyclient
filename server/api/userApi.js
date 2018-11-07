var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')
// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()
console.log('conn.connect()')
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        })
    } else {
        res.json(ret)
    }
}
function checkToken(res,token){
    var sql = $sql.user.checkToken
    return new Promise(resolve => {
        if(_.isEmpty(token)){
            res.json({data: 'token失效', status: -1})
            resolve(false)
            return
        }
        conn.query(sql, [token], function(err, result) {
            if (result) {
                resolve(true)
            }else{
                res.json({data: 'token失效', status: -1})
                resolve(false)
            }
        })
    })
}

// 增加用户接口
router.post('/addUser', (req, res) => {
    checkToken(res, params.token).then(data => {
        if(data){
            var sql = $sql.user.add
            var params = req.body
            console.log(params)
            conn.query(sql, [params.name, params.tel, params.work_type], function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    console.log(result,'conn.connect()conn.connect()conn.connect()conn.connect()')
                    jsonWrite(res, result)
                }
            })
        }
    })
})
// 登录接口
router.post('/login', (req, res) => {
    var sql = $sql.user.login
    var loginSuccess = $sql.user.loginSuccess
    var getUserInfo = $sql.user.getUserInfo
    var params = req.body
    conn.query(sql, [params.tel], function(err, result1) {
        if (err) {
            console.log(err)
        }
        if (result1) {
            if(result1.length<1){
                res.json({data: '该用户不存在', status: -1})            
                return
            }
            if(result1[0].pwd!=params.pwd){
                res.json({data: '密码错误', status: -1})            
                return
            }
            var nowTime = Date.parse(new Date())
            var token = Math.random().toString(36).substr(2)
            conn.query(loginSuccess, [nowTime,token, params.tel], function(err, result){
                //存时间戳
                if (err) {
                    res.json({data: err, status: 0})
                    console.log(err)
                }
                if(result){
                    conn.query(getUserInfo, [token], function(err, result2) {
                        res.json({data: result2[0], status: 0})
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
    checkToken(res, params.token).then(data => {
        if(data){
            conn.query(sql, [params.token], function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    if(result.length<1){
                        res.json({data: '该用户不存在', status: -1})
                        return
                    }
                    var nowTime = Date.parse(new Date())/1000
                    if(_.isEmpty(result[0].login_time)||(result[0].login_time/1000+21600)<nowTime){
                        //登录失效
                        res.json({data: '您还未登录，请先登录', status: -1})
                        return
                    }
                    res.json({data: result[0], status: 0})
                }
            })
        }
    })
})
// 修改密码接口
router.post('/changePwd', (req, res) => {
    var changePwd = $sql.user.changePwd
    var login = $sql.user.login
    var params = req.body
    checkToken(res, params.token).then(data => {
        if(data){
            conn.query(login, [params.tel], function(err, result) {
                //先查老密码
                if (err) {
                    console.log(err)
                }
                if (result) {
                    if(result.length<1){
                        res.json({data: '该用户不存在', status: -1})            
                        return
                    }
                    if(result[0].pwd==params.oldPwd){
                        //如果老密码正确，再改密码
                        conn.query(changePwd, [params.newPwd, params.tel], function(err, result) {
                            if (err) {
                                console.log(err)
                            }
                            if (result) {
                                res.json({data: '修改成功', status: 0})
                            }
                        })
                    }else{
                        res.json({data: '旧密码不正确', status: -1})
                    }
                }
            })
        }
    })
    
})

module.exports = router
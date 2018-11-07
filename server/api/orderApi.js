var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')

// import Vue from 'vue'
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

// 获取订单列表
router.post('/getOrderList', (req, res) => {
    var params = req.body
    checkToken(res, params.token).then(data => {
        if(data){
            if(params.doing){
                var sql = $sql.order.getOrderList
                conn.query(sql, [params.work_type], function(err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result,'conn.connect()conn.connect()conn.connect()conn.connect()')
                    if (result) {
                        res.json({data: result, status: 0})                                    
                    }
                })
            }else{
                var sql = $sql.order.getOrderList2
                conn.query(sql, [params.work_type, params.user_name], function(err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result,'conn.connect()conn.connect()conn.connect()conn.connect()')
                    if (result) {
                        res.json({data: result, status: 0})                                    
                    }
                })
            }
        }
    })
})
// 订单详情API
router.post('/getOrderItem', (req, res) => {
    var sql = $sql.order.getOrderItem
    var checkStatusDtl = $sql.order.checkStatusDtl
    var params = req.body
    console.log(params)
    checkToken(res, params.token).then(data => {
        if(data){
            conn.query(sql, [params.orderNo], function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    result[0].status_exist=false
                    result[0].status_many=null
                    conn.query(checkStatusDtl, [params.orderNo, params.user_id], function(err, result1) {
                        if(result1.length>0){
                            result[0].status_many=result1[0].status_many
                            result[0].status_exist=true
                        }
                        res.json({data: result[0],status: 0})
                    })
                }else{
                    res.json({data: '系统错误',status: -1})
                }
            })
        }
    })
})
// 提交实际数量API
router.post('/addStatusDtl', (req, res) => {
    var sql = $sql.order.addStatusDtl
    var params = req.body
    console.log(params)
    checkToken(res, params.token).then(data => {
        if(data){
            params.confrim_time = new Date(new Date().toLocaleDateString()).getTime()
            conn.query(sql, [params.order_status, params.order_name, params.order_no, params.status_many, params.work_type, params.user_name, params.user_id, params.confrim_time], function(err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    res.json({data: '提交成功',status: 0})
                }else{
                    res.json({data: '系统错误',status: -1})
                }
            })
        }
    })
})
// 修改订单状态
router.post('/setOrderStatus', (req, res) => {
    var sql = $sql.order.setOrderStatus
    var params = req.body
    console.log(params)
    checkToken(res, params.token).then(data => {
        if(data){
            params.order_status=parseInt(params.order_status)+1
            conn.query(sql, [params.order_status, params.order_no], function(err, result) {
                if (result) {
                    console.log(result, 'result')

                    res.json({data: '修改成功',status: 0})
                }else{
                    console.log(err, 'err')
                    res.json({data: '系统错误',status: -1})
                }
            })
        }
    })
})

module.exports = router
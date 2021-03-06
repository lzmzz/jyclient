var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')
var _ = require('lodash')
// 连接数据库
var conn = mysql.createConnection(models.mysql)

conn.connect()
// 获取订单列表
router.post('/getOrderList', (req, res) => {
  var params = req.body
  var date = new Date()
  date.setDate(1)
  params.startDay = new Date(date.toLocaleDateString()).getTime()
  var sql = $sql.order.getOrderList
  if (params.doing == 1) {
    //进行中
    sql += '= ?'
  } else if (params.doing == 0) {
    sql += '< ?'
  } else if (params.doing == 2) {
    sql += '> ?'
  }
  conn.query(sql, [params.startDay, params.work_type], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      return res.json({
        data: result,
        status: 0
      })
    }
  })
})
// 订单详情API
router.post('/getOrderItem', (req, res) => {
  var sql = $sql.order.getOrderItem
  var checkStatusDtl = $sql.order.checkStatusDtl
  var getManyList = $sql.order.getManyList
  var params = req.body
  conn.query(sql, [params.orderNo], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      result[0].status_many = null
      conn.query(getManyList, [params.orderNo, result[0].order_status], function (err, result1) {
        conn.query(checkStatusDtl, [params.orderNo, params.user_id], function (err, result2) {
          if(result2.length>0){
            result[0].status_many = result2[0].status_many
          }
          return res.json({
            data: {
              orderItem: result[0],
              manyList: result1,
            },
            status: 0
          })
        })
        
      })
    } else {
      return res.json({
        data: '系统错误',
        status: -1
      })
    }
  })
})
// 提交实际数量API
router.post('/addStatusDtl', (req, res) => {
  var sql = ''
  var params = req.body
  params.confrim_time = new Date(new Date().toLocaleDateString()).getTime()
  conn.query('select * from `status_details` where user_id = ? and order_no = ?', [params.user_id, params.order_no], function(err, rst){
    if(rst.length<1){
      sql = $sql.order.addStatusDtl
      conn.query(sql, [params.order_status, params.order_no, params.status_many, params.work_type, params.user_name, params.user_id, params.confrim_time], function (err1, result) {
        if (err1) {
          console.log(err1)
        }
        if (result) {
          return res.json({
            data: '提交成功',
            status: 0
          })
        } else {
          return res.json({
            data: '系统错误',
            status: -1
          })
        }
      })
    }else{
      sql = $sql.order.setStatusDtl
      conn.query(sql, [params.status_many, params.confrim_time, params.order_no, params.user_id], function (err1, result) {
        if (err1) {
          console.log(err1)
        }
        if (result) {
          return res.json({
            data: '提交成功',
            status: 0
          })
        } else {
          return res.json({
            data: '系统错误',
            status: -1
          })
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
  params.order_status = parseInt(params.order_status) + 1
  conn.query(sql, [params.order_status, params.order_no], function (err, result) {
    if (result) {
      console.log(result, 'result')

      return res.json({
        data: '修改成功',
        status: 0
      })
    } else {
      console.log(err, 'err')
      return res.json({
        data: '系统错误',
        status: -1
      })
    }
  })
})

module.exports = router
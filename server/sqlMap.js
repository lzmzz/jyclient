// sql语句
var sqlMap = {
    // 用户
    user: {
        add: 'insert into user(name, tel, work_type) values (?, ?, ?)',
        login: 'select pwd from `user` where tel=?',
        loginSuccess: 'update `user` set login_time=?,token=? where tel=?',
        changePwd: 'update `user` set pwd=? where tel=?',
        getUserInfo: 'select id, name, tel, login_time, work_type, token, is_master from `user` where token=?',
        checkToken: 'select work_type from `user` where token=?',
    },
    order: {
        getOrderList: 'select * from `order` where create_time >= ? and order_status ',
        getOrderList2: 'select * from `status_details` where order_status = ? and user_name = ?',
        getOrderItem: 'select * from `order` where order_no = ?',
        addStatusDtl: 'insert into status_details(order_status, order_no, status_many, work_type, user_name, user_id, confrim_time) values (?, ?, ?, ?, ?, ?, ?)',
        checkStatusDtl: 'select status_many from `status_details` where order_no=? and user_id=?',
        setStatusDtl: 'update `status_details` set status_many=?, confrim_time=? where order_no=? and user_id=?',
        setOrderStatus: 'update `order` set order_status = ? where order_no = ?',
    },
}

module.exports = sqlMap
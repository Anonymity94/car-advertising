export default {
  // 登录
  'POST /api/account/admin/login': (req, res) => {
    const { password, username } = req.body;
    if (password === 'admin' && username === 'admin') {
      res.send({
        result: 'success',
        message: '登录成功',
      });
      return;
    }
    res.send({
      result: 'error',
      message: '用户名或密码不正确',
    });
  },
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: '系统管理员',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  },
};

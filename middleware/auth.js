// 身份验证中间件
const jwt = require('../utils/jwt');

module.exports = (req, res, next) => {
  // 获取Authorization头
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 1, message: '未授权访问' });
  }

  // 提取token
  const token = authHeader.split(' ')[1];
  const payload = jwt.verify(token);

  if (!payload) {
    return res.status(401).json({ code: 1, message: 'token无效或已过期' });
  }

  // 将用户信息添加到请求对象
  req.user = payload;
  next();
};
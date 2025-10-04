// 创建config/upload.js文件

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 获取当前日期文件夹名称 YYYY-MM-DD
const getDateDir = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 配置存储引擎
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dateDir = getDateDir();
    const destPath = path.join(uploadDir, dateDir);
    fs.mkdirSync(destPath, { recursive: true });
    cb(null, destPath);
  },// 上传文件保存路径
  filename: function (req, file, cb) {// 使用前端传递的自定义文件名
    cb(null, req.body.fileName);
  }
});

// 文件过滤（只允许图片）
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

module.exports = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },// 限制5MB
  fileFilter: fileFilter
}).single('image');// 对应前端name="image"的字段
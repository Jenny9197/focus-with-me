const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const s3 = new aws.S3();
// aws.config.loadFromPath(`${process.cwd()}/config/s3.js`);

module.exports = {
  //파일 생성 규칙
  uploadAvatar: multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "${__dirname}/../public/uploads/avatar");
      },
      /*       filename(req, file, cb) {
        // const fileName = randomstring.generate(20);
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
      }, */
    }),
    limits: { fileSize: 10000000 },
  }),
  uploadCover: multer({
    dest: "public/uploads/cover",
    limits: { fileSize: 10000000 },
    // 파일이 없을 경우 예외처리 필요.
    // onError: function (err, next) {
    //   console.log("error", err);
    //   console.log("여기는 multer 에러 처리");
    //   next();
    // },
  }),
  uploadContents: multer({
    dest: "public/uploads/content",
    limits: { fileSize: 10000000 },
  }),
  uploadTemp: multer({
    dest: "public/uploads/temp",
    limits: { fileSize: 1000000 },
  }),
  uploadAvatarS3: multer({
    storage: multerS3({
      s3,
      bucket: "kkirri-images",
      acl: "public-read",
    }),
  }),
};

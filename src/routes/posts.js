const express = require("express");
const postsRouter = express.Router();
const {
  getOnePost,
  getPosts,
  postPosts,
  putPosts,
  deletePosts,
  ckUpload,
} = require("../controllers/postsController");
const {
  uploadCover,
  uploadTemp,
  uploadAvatarS3,
  uploadTempS3,
} = require("../middlewares/upload");
// S3 테스트용 커스텀 라이브러리
const { removeS3Obj, listingS3Objs } = require("../library/controlS3");

const { filter } = require("../middlewares/filter");
const { logInOnly, logInBoth } = require("../middlewares/passport-auth");

/* GET users listing. */
postsRouter
  .route("/posts")
  .get(logInBoth, filter, getPosts)
  .post(logInOnly, uploadCover.single("imageCover"), postPosts);

// ckEditor5 custom image upload adapter
// postsRouter
//   .route("/posts/ckUpload")
//   .post(logInOnly, uploadTemp.single("temp"), ckUpload);

// s3 test
postsRouter
  .route("/posts/ckUpload")
  .post(uploadTempS3.single("temp"), async (req, res) => {
    const path = req.file.location;
    console.log(req.file);
    console.log("여기는 오나?");
    await listingS3Objs();
    return res.send({ message: "하하하", path });
  });
postsRouter.route("/posts/s3").delete((req, res) => {
  const { path } = req.query;
  console.log(path);
  removeS3Obj(path);

  return res.send({ message: "삭제 성공했나" });
});

postsRouter
  .route("/posts/:postId")
  .put(logInOnly, uploadCover.single("imageCover"), putPosts)
  .delete(logInOnly, deletePosts)
  .get(logInBoth, getOnePost);

module.exports = postsRouter;

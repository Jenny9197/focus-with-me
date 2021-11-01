const express = require("express");
const router = express.Router();

//add controller function 
const cmtCtrl = require("../controllers/comments-ctrl/cmts-Ctrl");

/* comments listing. */
//댓글 생성
router.post("/posts/:postId/comments", cmtCtrl.commentList.commentUser);
//댓글 조회
router.get("/posts/:postId/comments", cmtCtrl.commentList.commentSearch);
//댓글 삭제
router.delete("/posts/:postId/comments/:commentId", cmtCtrl.commentList.commentDel);

module.exports = router;

const { Comment } = require("../../models");
const { User } = require("../../models"); // 댓글조회 때 필요함

const comments = {
  // 댓글 생성
  commentCreate: async (req, res) => {
    try {
      // const { textContent : 성공 } = { textContent : 성공 }
      const { textContent } = req.body;
      // const textContent = req.body.textContent => 구조분해할당 해제
      // const textContent = 성공
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const user = await User.findByPk(userId);
      const userNick = user.nickname;

      const date = new Date();
      const comment = await Comment.create({
        userId,
        postId,
        date,
        textContent,
      });
      return res.status(201).send({
        userNick,
        comment,
        message: "댓글 작성에 성공했습니다.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ 
        message: "댓글 서버로부터 오류가 생겼습니다." 
      });
    }
  },

  // 댓글 조회
  commentSearch: async (req, res) => {
    try {
      const { postId } = req.params;
      // const postId = req.params.postId; // ES5 및 이전 문법
      
      const commentAll = await Comment.findAll({
        // 시퀄라이즈 사용법, include를 [{model : 조인할테이블}] 으로 구성해야 조인이 된다. 중요!!
        include: [{ model: User }], 
        // where는 조건절, 결과값에서 postId 컬럼에 조건을 건다. 필터링
        where: { postId: postId }, 
      }); 

      // 배열, 배열안에 객체(Object)를 저장
      const respondComments = []; 
      for (const comment of commentAll) {
        respondComments.push({
          userId: comment.userId,
          userNickname: comment.User.nickname,
          textContent: comment.textContent,
          avatarUrl: comment.User.avatarUrl,
          date: comment.date, // 댓글 작성날짜 부분
          commentId: comment.commentId,
          postId: comment.postId,
        });
      }

      // SQL part
      // const a = await Comment.findAll({
      //   where: { postId },
      //   attributes: ["Comment.*", "User.nickname", "User.avatarUrl"], 
      //   include: {
      //     model: User,
      //     attributes: [],
      //   },
      //   //limit: 5,
      //   raw: true,
      //   order: [["date", "DESC"]],
      // });
      
      return res.status(200).send({
        respondComments,
        message: "댓글 조회에 성공했습니다.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ 
        message: "댓글 조회로부터 문제가 생겼습니다." 
      });
    }
  },

  // 댓글 삭제
  commentDel: async (req, res) => {
    try {
      // postId와 commentId 변수에서 req.params에 있는 값을 불러와 할당한다(구조분해할당) 
      const { postId, commentId } = req.params; 
      // res.locals.user 는 미들웨어인 loginOnly에서 값을 가져와 userId에 할당한다
      const { userId } = res.locals.user;
      // Comment 테이블에서 데이터 하나만 가져온다.
      const reqDelete = await Comment.findOne({
        // 어디에서 postId 라는 컬럼에서 postId로, id 라는 컬럼에서 commentId로
        // where 옵션으로 나열함으로써, 기본적으로 and 옵션과 같다
        where: { postId, commentId }, 
      });
      console.log(userId);
      if (reqDelete.userId === userId) {
        // "특정 포스트 -> 특정 댓글" 지운다
        await reqDelete.destroy(); 
        return res.status(200).send({ 
          message: "댓글이 삭제되었습니다.", 
        });
      } else {
        return res.status(400).send({
          message: "작성자가 아닙니다.", 
        });
      }
    } catch (err) {
      return res.status(500).send({
        message: "댓글 삭제에 문제가 생겼습니다! 관리자에게 문의해주세요.",
      });
    }
  },
};

module.exports = { comments };

const Tought = require('../models/Tought')
const UserLike = require('../models/UserLike')
module.exports = class UserLikeController {

    static async userLikePost(req, res) {
        const toughtId = req.body.toughtId;
        const actualUserId = req.session.userid;
        const likeStatus = req.body.likeStatus;
        const deslikeStatus = req.body.deslikeStatus;
    
        const [userToughtLike, userToughtLikeCreated] = await UserLike.findOrCreate(
          {
            where: { UserId: actualUserId, ToughtId: toughtId },
            defaults: {
              like: true,
              deslike: false,
              UserId: actualUserId,
              ToughtId: toughtId,
            },
          }
        );
    
        if (likeStatus === "true") {
          try {
            await UserLike.update(
              { like: false },
              {
                where: { UserId: actualUserId, ToughtId: toughtId },
              }
            );
            await Tought.increment({ like: -1 }, { where: { id: toughtId } });
          } catch (err) {
            console.log(err);
          }
        } else if (
          (likeStatus === "false" && deslikeStatus === "false") ||
          !likeStatus
        ) {
          try {
            await UserLike.update(
              { like: true },
              {
                where: { UserId: actualUserId, ToughtId: toughtId },
              }
            );
            await Tought.increment({ like: 1 }, { where: { id: toughtId } });
          } catch (err) {
            console.log(err);
          }
        } else if (likeStatus === "false" && deslikeStatus === "true") {
          try {
            await UserLike.update(
              { like: true, deslike: false },
              {
                where: { UserId: actualUserId, ToughtId: toughtId },
              }
            );
            await Tought.increment(
              { like: 1, deslike: -1 },
              { where: { id: toughtId } }
            );
          } catch (err) {
            console.log(err);
          }
        }
        req.session.save(() => { res.redirect('back');})
          return;
      }
    
      static async userDeslikePost(req, res) {
        const toughtId = req.body.toughtId;
        const actualUserId = req.session.userid;
        const likeStatus = req.body.likeStatus;
        const deslikeStatus = req.body.deslikeStatus;
    
        const [userToughtLike, userToughtLikeCreated] = await UserLike.findOrCreate(
          {
            where: { UserId: actualUserId, ToughtId: toughtId },
            defaults: {
              like: false,
              deslike: true,
              UserId: actualUserId,
              ToughtId: toughtId,
            },
          }
        );
     
    
        if (deslikeStatus === "true") {
          try {
            await UserLike.update(
              { deslike: false },
              {
                where: { UserId: actualUserId, ToughtId: toughtId },
              }
            );
            await Tought.increment({ deslike: -1 }, { where: { id: toughtId } });
          } catch (err) {
            console.log(err);
          }
        } else if (
          (deslikeStatus === "false" && likeStatus === "false") ||
          !deslikeStatus
        ) {
          try {
            await UserLike.update(
              { like: false, deslike: true },
              {
                where: { UserId: actualUserId, ToughtId: toughtId },
              }
            );
            await Tought.increment({ deslike: 1 }, { where: { id: toughtId } });
          } catch (err) {
            console.log(err);
          }
        } else if (deslikeStatus === "false" && likeStatus === "true") {
          try {
            await UserLike.update(
              { like: false, deslike: true },
              {
                where: { UserId: actualUserId, ToughtId: toughtId },
              }
            );
            await Tought.increment(
              { like: -1, deslike: 1 },
              { where: { id: toughtId } }
            );
          } catch (err) {
            console.log(err);
          }
        }
        req.session.save(() => { res.redirect('back');})
        return;
      }

}
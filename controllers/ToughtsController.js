const Tought = require("../models/Tought");
const User = require("../models/User");
const UserLike = require("../models/UserLike");

const { Op } = require("sequelize");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: [User],
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    let toughtsQty = toughts.length;
    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    // Checar quais "pensamentos" o usuário curtiu
    if (req.session.userid) {
      const userLikeData = await UserLike.findAll({
        include: [Tought],
        where: {
          UserId: req.session.userid,
        },
      });
      const userLike = userLikeData.map((result) =>
        result.get({ plain: true })
      );

      for (let i = 0; i < userLike.length; i++) {
        let element = userLike[i];
        likeCheck(element.ToughtId, element.like, element.deslike);
      }
      function likeCheck(ToughtId, like, deslike) {
        for (let i = 0; i < toughts.length; i++) {
          const element = toughts[i].id;
          let actualObj = toughts[i];
          if (element === ToughtId) {
            actualObj["userLike"] = like;
            actualObj["userDeslike"] = deslike;
          }
        }
      }
    }
    res.render("toughts/home", { toughts, search, toughtsQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true,
    });

    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static async createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
      like: 0,
      deslike: 0,
    };

    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento criado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;
    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    res.render("toughts/edit", { tought });
  }

  static async updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });

      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async likePost(req, res) {
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
      
      res.redirect("/");
      return;
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
      req.session.save(() => { res.redirect("/");})
     
      return;
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
      req.session.save(() => { res.redirect("/");})
      return;
    }
  }

  static async deslikePost(req, res) {
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
      req.session.save(() => { res.redirect("/");})
      return;
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
      req.session.save(() => { res.redirect("/");})
      return;
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
      req.session.save(() => { res.redirect("/");})
      return;
    }
  }
};

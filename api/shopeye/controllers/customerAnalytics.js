/**
 * @name api:shops:controllers:customerAnalytics
 * @description Customer Analytics Controller
 */

const orderService = require(".././services/orders");
const userService = require(".././services/shop-users");
const _ = require("lodash");

module.exports.count = async (req, res) => {
  try {
    let shopId = await userService.findOne({ brandId: req.user.brandId });
    let groupCondQuery = { _id: "$orderType", count: { $sum: 1 } };
    let groupCondQuery_Res = { _id: "$orderType", countRes: { $sum: 1 } };
    let groupCondQuery_Req = { _id: "$orderType", countReq: { $sum: 1 } };
    let condition = [
      {
        $match: { shop: shopId._id },
      },
      {
        $group: groupCondQuery,
      },
    ];
    let condition_res = [
      {
        $match: { shop: shopId._id, purchased: true },
      },
      {
        $group: groupCondQuery_Res,
      },
    ];
    let condition_req = [
      {
        $match: { shop: shopId._id, purchased: false },
      },
      {
        $group: groupCondQuery_Req,
      },
    ];
    let [totalCustomer, totalRes, totalReq, colValue, colRes, colReq] =
      await Promise.all([
        orderService.count({ shop: shopId._id }),
        orderService.count({ shop: shopId._id, purchased: true }),
        orderService.count({ shop: shopId._id, purchased: false }),
        orderService.aggregate(condition),
        orderService.aggregate(condition_res),
        orderService.aggregate(condition_req),
      ]);

    var colData = _.values(
      _.merge(
        _.keyBy(colValue, "_id"),
        _.keyBy(colRes, "_id"),
        _.keyBy(colReq, "_id")
      )
    );

    return res.sendSuccess({
      totalCus: totalCustomer,
      totalRes: totalRes,
      totalReq: totalReq,
      colData,
    });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

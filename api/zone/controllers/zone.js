const { executeQuery } = require("../../../config/database/redshift");
const _ = require("lodash");
const zoneQuery = require("../queries/zone");
const oracle = require("../../core/modules/oracle");
const storeService = require("../../stores/services/stores");
//analysis
module.exports.analysis = async (req, res) => {
  try {
    let getstoresId ={}
     ////Change Store name to store Id ///////
     if (req.body.storeId && req.body.storeId != '') {
      getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    if (!getstoresId) {
      return res.sendNoContent("Data not found");
    }
    let [count, zoneData] = await Promise.all([
      executeQuery(zoneQuery.count(req.body)),
      executeQuery(zoneQuery.zone(req.body)),
    ]);
    if (count.length == 0 || zoneData.length == 0) {
      return res.sendNoContent("Data Not Found");
    }
    for (var i = 0; i < zoneData.length; i++) {
      let path = `${zoneData[i].store_id}/croppedImages/${zoneData[i].stream_id}/${zoneData[i].zone_name}/map_day.png`;
      let images = await oracle.getCrpImg(path);
      zoneData[i].img = images;
      zoneData[i].perc = Math.round(
        (parseInt(zoneData[i].zone_footfall_count) /
          parseInt(count[0].total_footfall_count)) *
          100
      );
    }
    res.sendSuccess({
      result: { zoneData },
    });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.heatMap = async (req, res) => {
  try {
    let getstoresId ={}
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
     getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
     req.body.storeId = getstoresId.id || "";
   }
   ////////////////////////////////////////
   if (!getstoresId) {
     return res.sendNoContent("Data not found");
   }
    let path = "";
    let zoneData=[]
    let input = req.body;
    switch (input.type) {
      case 1:
        path = `${input.storeId}/croppedImages/${input.stream_id}/${input.zone_name}/map_day.png`;
        break;

      case 2:
        path = `${input.storeId}/croppedImages/${input.stream_id}/${input.zone_name}/map_week.png`;
        break;

      case 3:
        path = `${input.storeId}/croppedImages/${input.stream_id}/${input.zone_name}/map_month.png`;
        break;
    }
     zoneData = await executeQuery(zoneQuery.details(input));
    let images = await oracle.getCrpImg(path);
    // console.log(zoneData);
    // zoneData.push({crpImg:images})
    zoneData[0].crpImg = await oracle.getCrpImg(path);

   return res.sendSuccess({
      result: { zoneData },
    });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

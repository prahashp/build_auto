/**
 * @name api_camera_services_camera
 * @description Camera DB Service
 */

// NPM Modules
const bluebird = require("bluebird"),
  // Mongoose Models
  tagging = require("../models/tagging"),
  camera = require("../../camera/models/camera");

module.exports.get = (query = {}, fields = {}) => {
  return new bluebird((resolve, reject) => {
    tagging.find(query, fields).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.updateOne = (query = {}, record = {}) => {
  return new bluebird((resolve, reject) => {
    tagging
      .updateOne(
        query,
        { $set: record },
        {
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )
      .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
  });
};

module.exports.deleteOne = (query) => {
  return new bluebird((resolve, reject) => {
    tagging.deleteOne(query).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.getCount = (query = {}) => {
  return new bluebird((resolve, reject) => {
    tagging.count(query).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.insertMany = (record) => {
  return new bluebird((resolve, reject) => {
    tagging.insertMany(record, (err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.findLimit = (query = {}, offset, limit) => {
  return new bluebird((resolve, reject) => {
    tagging
      .find(query)
      .skip(offset)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .populate({
        path: "store",
        select: "id",
      })
      .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
  });
};

module.exports.find = (query = {}, record = {}) => {
  return new bluebird((resolve, reject) => {
    tagging.find(query, record).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.insert = (record) => {
  return new bluebird((resolve, reject) => {
    const document = new tagging(record);
    tagging.save((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.delete = (query) => {
  return new bluebird((resolve, reject) => {
    tagging.remove(query).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.camDetail = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        camera.find(query, fields)
        .populate('store')
        .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  };

  module.exports.find = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        tagging.find(query,record).exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  };

  module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new tagging(record);
        tagging.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};
  
module.exports.delete = query => {
    return new bluebird((resolve, reject) => {
        tagging.remove(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getAll_Tag_Cam = (query = {},offset, limit) => {
    return new bluebird((resolve, reject) => {
        tagging.find(query)
        .skip(offset)
        .limit(limit)
        .sort({updatedAt: -1 })
        .populate({
            path: 'store',
            select: 'id'
        })
        .populate({
            path: 'camera'
        })
        .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  };
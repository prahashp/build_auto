const Redshift = require("aws-redshift"),
  // configuration
  config = require("../").redshift_database;

module.exports.executeQuery = (query) => {
  var red_shift = new Redshift(config, { rawConnection: true });
  return new Promise((resolve, reject) => {
    try {
      red_shift.connect((err, conn) => {
        if (err) {
          console.log(err, "REDSHIFT_CONNECT");
          red_shift.close();
          return reject(err);
        } else {
          red_shift.query(query, (err, results) => {
            if (err) {
              console.log(err, "REDSHIFT_QUERY");
              red_shift.close();
              return reject(err);
            } else {
              red_shift.close();
              return resolve(results.rows);
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
};

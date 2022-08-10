/**
 * @name api_freshdesk
 * @description freshdesk api calling methods
 *@author praveenraj
 */

const bluebird = require("bluebird");
const auth = require("../env").freshdesk;

var Freshdesk = require("freshdesk-api");
var asyncFreshdesk = bluebird.promisifyAll(
  new Freshdesk(auth.domainName, auth.apiKey)
);

module.exports.createTicket = (data) => {
  return new bluebird((resolve, reject) => {
    try {
      asyncFreshdesk.createTicket(data, (err, res) => {
        if (err) reject(err);
        else {
          asyncFreshdesk.createReply(
            res.id,
            {
              body: `Greetings! Dear Customer,<br><br>Your Ticket No-#${res.id} has been created Based on your ${res.subject} Issue described as ${res.description}.<br><br>  We are working on this and it will be Resolved within 48 hours. Thanks!`,
            },
            (err, reply_res) => {
              if (err) reject(err);
              else {
                resolve(reply_res);
              }
            }
          );
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getTicket = (data) => {
  return new bluebird((resolve,reject) =>{
    try{
      asyncFreshdesk.listAllConversations(data, (err, res) =>{
        if(err) reject(err);
        else{
          resolve(res)
        }
      })
    }catch (error) {
      reject(error)
    }
  })
}

module.exports.createReply = (data) => {
  return new bluebird((resolve,reject) =>{
    try{
      asyncFreshdesk.createReply(
        data.id,
        {
          body: `${data.message}`,
        },
        (err, res) => {
          if (err){
            reject(err);
          }
          else {
            resolve("Reply Sent Successfully");
          }
        }
      );
    }catch (error) {
      reject(error)
    }
  })
}

module.exports.updateTicket = (data) => {
  return new bluebird((resolve,reject) =>{
    try{
      asyncFreshdesk.updateTicket(
        data.ticketNo,
        {
          status: data.status,
        },
        (err, res) => {
          if (err){
             reject(err);
          }
          else {
            resolve("Ticket Status Updated Successfully");
          }
        }
      );
    }catch (error) {
      reject(error)
    }
  })
}

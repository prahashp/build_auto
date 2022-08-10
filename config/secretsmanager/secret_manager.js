const AWS=require('aws-sdk'),
config = require("../").aws;

const secrets=new AWS.SecretsManager({
    region:config.auth.region
})

module.exports=async()=>{
    try {
      const secret=await  secrets.getSecretValue({
        SecretId:config.auth.secretName
      }).promise()
      console.log(secret);

    } catch (error) {
        console.error(error); 
    }
}


// module.exports = () => {
// 	//configure AWS SDK
// 	// const region = "ap-south-1";
// 	// const client = new AWS.SecretsManager({ region });

// 	// const SecretId = "test-secret";
// 	return new Promise((resolve, reject) => {
// 		//retrieving secrets from secrets manager
// 		secrets.getSecretValue({ SecretId:config.auth.secretName }, (err, data) => {
// 			if (err) {
// 				reject(err);
// 			} else {
// 				//parsing the fetched data into JSON
// 				const secretsJSON = JSON.parse(data.SecretString);

// 				let secretsString = "";
// 				Object.keys(secretsJSON).forEach((key) => {
// 					secretsString += `${key}=${secretsJSON[key]}\n`;
// 				});
// 				resolve(secretsString);
// 			}
// 		});
// 	});
// };
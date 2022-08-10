const config = require('../../../.././config').tangoAPI;

module.exports = class TangoShelfAPIClass {
    /**
     * Creates an instance of TangoShelfAPI.
     */
    constructor() {
        this.superagent = require('superagent');
        this.utils = require('../../modules/utils');
        this.alignURL = config.alignURL;
        this.predictURL = config.predictURL;
    }

    /**
     * Method to align shelf image
     *
     * @param {*} imagePath
     * @return {*}
     */
    async align(imagePath) {
        return new Promise(async (resolve, reject) => {
            let UUID = this.utils.generateUUID();
            console.log(imagePath)
            // imagePath = "https://shopper-shelf-alignment.s3.amazonaws.com/base_image/21.jpeg";
            this.superagent
                .post(this.alignURL)
                .send({ base_image_name: imagePath, appid: UUID, imageid: UUID })
                .set('accept', 'json')
                .set('x-api-key', 'ZRp2cviBLR3pVwUbB077D5Uvqmpeq3KC7Uh4CPnh')
                .end((err, res) => {
                    if (res != undefined && res.status == 200) resolve(res.body);

console.log("came here ----------", err)

                    reject('Shelf validation failed. Try again later')
                });
        });
    }
    /** 
     * Method to predict shelf products
     *
     * @param {*} imagePath
     * @return {*}
     */
    async predict(imagePath) {
        return new Promise((resolve, reject) => {
            let UUID = this.utils.generateUUID();
            // imagePath = "https://shopper-shelf-alignment.s3.amazonaws.com/base_image/21.jpeg";
            this.superagent
                .post(this.predictURL)
                .send({ base_image_name: imagePath, appid: 'test123', imageid: 'test21' })
                .set('accept', 'json')
                .set('x-api-key', 'ZRp2cviBLR3pVwUbB077D5Uvqmpeq3KC7Uh4CPnh')
                .end((err, res) => {
                    if (res != undefined && res.status == 200) resolve(res.body);

                    reject('Shelf prediction failed. Try again later')
                });
        });
    }
};
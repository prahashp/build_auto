/**
 * @name api_core_modules_crypto
 * @description Cryptography Operations
 */

// NPM Modules
const crypto = require('crypto'),
    bluebird = require('bluebird'),

    // configuration
    config = require('../../.././config');

module.exports.encrypt = (input, password = config.crypto.key) => {
    return new bluebird((resolve) => {
        const key = crypto.scryptSync(password, 'GfG', 24);
        const iv = Buffer.alloc(16, 0);
        const cipher = crypto.createCipheriv(config.crypto.algorithm, key, iv);

        let encrypted = '';
        // Reading data 
        cipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipher.read())) {
                encrypted += chunk.toString('base64');
            }
        });

        // Handling end event 
        cipher.on('end', () => {
            resolve(encrypted);
        });

        // Writing data 
        cipher.write(input);
        cipher.end();
    });
};

module.exports.decript = (input, password = config.crypto.key) => {
    return new bluebird((resolve) => {
        const key = crypto.scryptSync(password, 'GfG', 24);
        const iv = Buffer.alloc(16, 0);
        const decipher = crypto.createDecipheriv(config.crypto.algorithm, key, iv);

        let decrypted = '';
        // Reading data 
        decipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        });
        // Handling end event 
        decipher.on('end', () => {
            resolve(decrypted);
        });

        decipher.write(input, 'base64');
        decipher.end();
    });
};

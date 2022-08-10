const config = require('../../.././config').database,
    awsConfig = require('../../.././config').shopeye_bucket.aws;

const { spawn } = require('node:child_process'),
    bluebird = require('bluebird'),
    aws = require('aws-sdk'),
    fs = require('fs'),
    path = require('path');

// aws setup
aws.config.update({
    region: awsConfig.auth.region,
    accessKeyId: awsConfig.auth.accessKey,
    secretAccessKey: awsConfig.auth.secretKey
});

module.exports.dump = (req, res) => {
    const file = `db_${(new Date()).toISOString()}.zip`;
    const outPath = process.cwd() + `/` + file;
    let dumpQuery = `mongodump --host "${config.hostname.split(',')[0]}" --db "${config.name}" `;

    if (config.username && config.password)
        dumpQuery += `--username "${config.username}" --password "${config.password}"`;

    dumpQuery += `--gzip --archive=${outPath}`;

    return new bluebird((resolve, reject) => {
        const dbdump = spawn(dumpQuery, { cwd: process.cwd(), shell: true })

        dbdump.stdout.on('data', data => {
            resolve('done');
        });

        dbdump.stderr.on('data', data => {
            resolve('done');
        });
    })
        .then(() => {
            return new bluebird((resolve, reject) => {
                const s3 = new aws.S3({ apiVersion: '2006-03-01' });
                var uploadParams = { Bucket: awsConfig.s3.bucketName, Key: '', Body: '' };
                var fileStream = fs.createReadStream(file);
                fileStream.on('error', function (err) {
                    console.log('File Error', err);
                });
                uploadParams.Body = fileStream;
                uploadParams.Key = 'stg_bkps/' + file;

                s3.upload(uploadParams, function (err, data) {
                    if (err) {
                        reject(err);
                    } if (data) {
                        resolve(data.Location);
                    }
                });
            })
        })
        .then(result => {
            console.log('MongoDB Dump Stored in S3!!!');
            res.status(200)
                .json({
                    file: file,
                    query: dumpQuery,
                    location: result
                });

            const dbdump = spawn(`rm ${outPath}`, { cwd: process.cwd(), shell: true })
        })
        .catch(error => {
            console.log(error);
            res.status(400).json(error);
        });
};

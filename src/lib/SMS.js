import AWS from 'aws-sdk';

class SMS {
  sendSMS(params, res) {
    AWS.config.update({ region: 'us-east-1' });

    const publishTextPromise = new AWS.SNS().publish(params).promise();
    publishTextPromise
      .then(function (data) {
        return res.json(data);
      })
      .catch(function (err) {
        return res.json(err);
      });
  }
}

export default new SMS();

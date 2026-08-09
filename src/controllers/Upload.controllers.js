import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../../lib/s3-client.js';
import { AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../const/env.js';

export const uploadUrl = async (req, res) => {
  try {
    console.log('[uploadUrl] req.body:', req.body);
    console.log('[uploadUrl] req.headers:', req.headers);
    const { fileName, fileType, path } = req.body || {};
    const key = `${path}/${Date.now()}-${fileName}`;
    console.log('key: ',key);
    console.log('bucketName: ',AWS_S3_BUCKET);
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3000 });

    return res.status(200).json({
      uploadUrl,
      filePath: key,
    });
  } catch (err) {
    console.error('Error generating URL', err);
    return res.status(500).json({ error: 'Error generating URL.' });
  }
};

export const testS3 = async (req, res) => {
  const logs = [];
  try {
    logs.push(`AWS_REGION: [${AWS_REGION}]`);
    logs.push(`AWS_S3_BUCKET: [${AWS_S3_BUCKET}]`);
    logs.push(`AWS_ACCESS_KEY_ID: [${AWS_ACCESS_KEY_ID ? AWS_ACCESS_KEY_ID.substring(0, 4) + '...' : 'undefined'}]`);
    logs.push(`AWS_SECRET_ACCESS_KEY: [${AWS_SECRET_ACCESS_KEY ? AWS_SECRET_ACCESS_KEY.substring(0, 4) + '...' : 'undefined'}]`);

    const startClient = Date.now();
    const tempClient = new S3Client({
      region: AWS_REGION,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
    logs.push(`Created tempClient in ${Date.now() - startClient}ms`);

    const startSign = Date.now();
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: `test-${Date.now()}.txt`,
      ContentType: 'text/plain',
    });
    const url = await getSignedUrl(tempClient, command, { expiresIn: 60 });
    logs.push(`Signed URL in ${Date.now() - startSign}ms`);

    return res.status(200).json({
      success: true,
      logs,
      url,
    });
  } catch (err) {
    console.error('Test S3 failed:', err);
    return res.status(500).json({
      success: false,
      logs,
      error: err.message,
      stack: err.stack,
    });
  }
};

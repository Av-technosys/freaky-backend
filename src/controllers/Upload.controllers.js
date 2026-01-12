import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../../lib/s3-client.js';
import { AWS_S3_BUCKET } from '../../const/env.js';

export const uploadUrl = async (req, res) => {
  try {
    const { fileName, fileType, path } = req.body;
    const key = `uploads/${path}/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return res.status(200).json({
      uploadUrl,
      filePath: key,
    });
  } catch (err) {
    console.error('Error generating URL', err);
    return res.status(500).json({ error: 'Error generating URL.' });
  }
};

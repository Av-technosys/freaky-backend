import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../../lib/s3-client.js';
import dotenv from "dotenv"

dotenv.config();


export const uploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read'
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return res.status(200).json({
      uploadUrl,
      fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });

  } catch (err) {
    console.error("Error generating URL", err);
    return res.status(500).json({ error: "Error generating URL." });
  }
};
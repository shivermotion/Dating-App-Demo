import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function uploadToS3(file: string, key: string): Promise<string> {
  try {
    // Convert base64 to buffer if needed
    const buffer = file.startsWith('data:') 
      ? Buffer.from(file.split(',')[1], 'base64')
      : Buffer.from(file);

    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.startsWith('data:') 
        ? file.split(';')[0].split(':')[1]
        : 'application/octet-stream'
    }));

    // Generate signed URL for access
    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key
      }),
      { expiresIn: 3600 } // URL expires in 1 hour
    );

    return signedUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
} 
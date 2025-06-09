import { FastifyInstance } from 'fastify';
import { PutObjectCommand, CreateBucketCommand, HeadBucketCommand, HeadObjectCommand, DeleteObjectCommand, S3ServiceException } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ServiceError } from '../types';

export class S3Service {
  private readonly BUCKET_NAME: string;
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'video/quicktime'
  ];

  constructor(private fastify: FastifyInstance) {
    this.BUCKET_NAME = process.env.BUCKET_NAME || 'media-bucket';
  }

  async ensureBucketExists(): Promise<void> {
    try {
      await this.fastify.s3.send(new HeadBucketCommand({ Bucket: this.BUCKET_NAME }));
    } catch (err) {
      if ((err as S3ServiceException).$metadata.httpStatusCode === 404) {
        await this.fastify.s3.send(new CreateBucketCommand({ Bucket: this.BUCKET_NAME }));
      } else {
        throw err;
      }
    }
  }

  validateMimeType(mimeType: string): void {
    if (!this.allowedMimeTypes.includes(mimeType)) {
      const error = new Error('Invalid file type!') as ServiceError;
      error.statusCode = 400;
      throw error;
    }
  }

  async generatePreSignedPutUrl(fileName: string, mimeType: string): Promise<string> {
    this.validateMimeType(mimeType);
    await this.ensureBucketExists();

    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: fileName,
      ContentType: mimeType,
    });

    try {
      return await getSignedUrl(this.fastify.s3, command, { expiresIn: 3600 });
    } catch (error) {
      const serviceError = new Error('Failed to generate pre-signed URL') as ServiceError;
      serviceError.statusCode = 500;
      throw serviceError;
    }
  }

  async verifyFileExists(fileName: string): Promise<void> {
    try {
      await this.fastify.s3.send(new HeadObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: fileName
      }));
    } catch (err: any) {
      if (err.name === 'NoSuchKey' || err.name === 'NotFound') {
        const error = new Error('File not found in S3') as ServiceError;
        error.statusCode = 404;
        throw error;
      }
      throw err;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.fastify.s3.send(new HeadObjectCommand({ Bucket: this.BUCKET_NAME, Key: fileName }));
      await this.fastify.s3.send(new DeleteObjectCommand({ Bucket: this.BUCKET_NAME, Key: fileName }));
    } catch (err) {
      if ((err as S3ServiceException).$metadata?.httpStatusCode === 404) {
        const error = new Error('File not found in S3 bucket') as ServiceError;
        error.statusCode = 404;
        throw error;
      }
      const error = new Error('Error deleting file from S3') as ServiceError;
      error.statusCode = 500;
      throw error;
    }
  }
}

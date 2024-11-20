import {FastifyPluginAsync} from 'fastify'

const uploadMedia: FastifyPluginAsync = async (fastify, opts): Promise < void > => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  const uploadToMinIO = async (bucketName: string, objectName: string, buffer: Buffer) => {
      await fastify.minio.putObject(bucketName, objectName, buffer);
  };

  const ensureBucketExists = async (bucketName: string) => {
      const exists = await fastify.minio.bucketExists(bucketName);
      if (!exists) {
          await fastify.minio.makeBucket(bucketName);
      }
  };

  fastify.post('/upload', async (request, reply) => {
      const data = await request.file();

      if (!data) {
          return reply.badRequest('No file uploaded!');
      }

      const fileBuffer = await data.toBuffer();
      const fileName = data.filename;

      await ensureBucketExists(BUCKET_NAME);
      await uploadToMinIO(BUCKET_NAME, fileName, fileBuffer);

      return reply.send({message: 'File uploaded successfully!'});
  });
}

export default uploadMedia;

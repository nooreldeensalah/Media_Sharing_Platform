// Initalize Minio's Client and wrap it up in a fastify plugin, decorate the fastify instance with the minio client
import fp from 'fastify-plugin';
import * as Minio from 'minio';

export default fp < Minio.ClientOptions > (async (fastify, opts) => {
    const config: Minio.ClientOptions = {
        endPoint: process.env.MINIO_ENDPOINT || 'localhost',
        port: parseInt(process.env.MINIO_PORT || '9000', 10),
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY || '',
        secretKey: process.env.MINIO_SECRET_KEY || '',
    };

    // Validate required fields
    if (!config.accessKey || !config.secretKey) {
        throw new Error('MinIO accessKey and secretKey must be provided.');
    }

    const minioClient = new Minio.Client(config);

    fastify.decorate('minio', minioClient);
});

declare module 'fastify' {
    interface FastifyInstance {
        minio: Minio.Client;
    }
}

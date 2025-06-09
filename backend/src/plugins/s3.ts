import fp from "fastify-plugin";
import { S3Client } from "@aws-sdk/client-s3";

export default fp(async (fastify) => {
  const { S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION, S3_ENDPOINT } = process.env;
  if (!S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_REGION || !S3_ENDPOINT) {
    throw new Error("Missing S3 configuration in environment variables");
  }

  const s3 = new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    forcePathStyle: true, // needed with minio
  });

  fastify.decorate("s3", s3);
},
  {
    name: "s3",
  }
);

declare module "fastify" {
  interface FastifyInstance {
    s3: S3Client;
  }
}

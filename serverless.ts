import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    service: 'resume-builder-aws-lambda',
    frameworkVersion: '3.24.1',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
        bucketName: 'my-resume-templates-${self:provider.stage}',
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',

        region: 'ap-south-1',
        profile: 'serverlessUser',

        apiGateway: {
            minimumCompressionSize: 1024,
            binaryMediaTypes: ['*/*'],
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            bucketName: '${self:custom.bucketName}',
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 's3:*',
                Resource: '*',
            },
        ],
        stage: 'dev',
    },
    functions: {
        createCertificate: {
            handler: 'src/function/createResume/index.handler',
            events: [
                {
                    http: {
                        method: 'post',
                        path: 'resume',
                        cors: true,
                    },
                },
            ],
        },
    },

    resources: {
        Resources: {
            templateBucket: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: '${self:custom.bucketName}',
                },
            },
        },
    },
};

module.exports = {serverlessConfiguration};

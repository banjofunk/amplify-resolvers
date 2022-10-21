import { AmplifyApiGraphQlResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper';

const {
  providers: { awscloudformation: { StackName: stackName = '' } = {} } = {},
} = require('../../../amplify-meta.json');

const envName = stackName
  .split('-')
  .slice(-2, -1)
  .pop();

export function override(resources: AmplifyApiGraphQlResourceStackTemplate) {
  const prodEnvs = ['prodb'];
  const params = prodEnvs.includes(envName)
    ? {
        instanceCount: 3,
        instanceType: 't3.medium.elasticsearch',
      }
    : {
        instanceCount: 1,
        instanceType: 't2.small.elasticsearch',
      };

  console.log('ES config -> ', params);

  resources.opensearch.OpenSearchDomain.elasticsearchClusterConfig = {
    ...resources.opensearch.OpenSearchDomain.elasticsearchClusterConfig,
    ...params,
  };

  resources.opensearch.OpenSearchStreamingLambdaFunction.timeout = 30;
  resources.opensearch.OpenSearchStreamingLambdaFunction.memorySize = 2048;
}

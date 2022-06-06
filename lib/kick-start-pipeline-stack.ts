// kick-start-pipeline-stack.ts

import { Stack, StackProps } from 'aws-cdk-lib';
import { MyStackProps, PipelineStack } from './pipeline-stack';
import { Construct } from 'constructs';

export class KickStartPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 위에서 선언한 MyStackProps를 실제 사용하기 위해 constructor내부에서 정의
    const defaultProps: MyStackProps = {
      ...props,
      ...{
        ServiceName: 'logistics',
        UserBranch: 'main'
      }
    }

    // 정의한 defaultProps를 사용하여 PipelineStack 생성
    new PipelineStack(this, "PipelineStack", defaultProps);
  }
}

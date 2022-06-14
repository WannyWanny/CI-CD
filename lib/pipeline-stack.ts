//pipeplie-stack.ts

import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CodeCommit } from './construct/codecommit';
import { Ecr } from './construct/ecr';
import { Kms } from './construct/kms';

//ServiceName, UserBranch를 추가 선언하여 interface를 생성
export interface MyStackProps extends StackProps {
    ServiceName: String;
    UserBranch: String;
}

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: MyStackProps){
        super(scope, id, props);

        const kms = new Kms(this, 'Kms', {
            ServiceName: props.ServiceName
        });

        const ecr = new Ecr(this, 'Ecr', {
            ServiceName: props.ServiceName,
            MaxImageAge: Duration.days(30)
        });

        const codecommit = new CodeCommit(this, 'CodeCommit', {
            ServiceName: props.ServiceName
        });
    }
}
//pipeplie-stack.ts

import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CodeCommit } from './construct/codecommit';
import { Ecr } from './construct/ecr';
import { Kms } from './construct/kms';
import { Iam } from './construct/iam';
import { CodeBuild } from "./construct/codeBuild";

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

        const iam = new Iam(this, 'Iam', {
            ServiceName: props.ServiceName,
            KmsCmk: kms.pipelineCmk,
            EcrRepo: ecr.ecrRepo
        });

        const codeBuild = new CodeBuild(this, 'CodeBuild', {
            ServiceName: props.ServiceName,
            TimeOut: Duration.minutes(10),
            EcrRepoUri: ecr.ecrRepo.repositoryUri,
            CodebuildRole: iam.codebuildRole,
            KmsCmk: kms.pipelineCmk
        });
    }
}
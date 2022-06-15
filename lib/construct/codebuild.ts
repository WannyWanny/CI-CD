// codebuild.ts
import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";

import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';

interface codebuildProps {
    ServiceName: String,
    TimeOut: Duration,
    EcrRepoUri: string,
    CodebuildRole: Role,
    KmsCmk: Key
}

export class CodeBuild extends Construct {
    
    public readonly buildProject: codebuild.Project;

    constructor(scope: Construct, id: string, props: codebuildProps) {
        super(scope, id);

        this.buildProject = this.createBuildProject(props);
    }

    private createBuildProject(props: codebuildProps): codebuild.Project {
        const project = new codebuild.PipelineProject(this, 'CodeBuildProject', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.build.yaml'),
            role: props.CodebuildRole,  
            encryptionKey: props.KmsCmk,
            environment: {
                buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
                privileged: true
            },
            timeout: props.TimeOut,
            environmentVariables: {
                SERVICE_NAME: { value: props.ServiceName },
                ECR_REPO_URI: { value: props.EcrRepoUri },
                TEST_ENV: { value: 'testenv_value' }
            }
        })

        return project;
    }
}
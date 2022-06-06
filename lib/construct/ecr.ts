// ecr.ts

import { Construct } from "constructs";
import * as ecr from 'aws-cdk-lib/aws-ecr'
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { AccountPrincipal, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

interface EcrProps {
    ServiceName: String,
    MaxImageAge: Duration
}

export class Ecr extends Construct {
    public readonly ecrRepo: ecr.Repository;

    constructor(scope: Construct, id: string, props: EcrProps){
        super(scope, id);

        this.ecrRepo = this.createEcrRepo(props);
        this.addLifecycleRule(this.ecrRepo, props);
        this.addPermission(this.ecrRepo);
    }

    private createEcrRepo(props: EcrProps) {
        const ecrRepo = new ecr.Repository(this, "ecr", {
            repositoryName: props.ServiceName + '-' + 'repo',
            imageScanOnPush: true,
            encryption: ecr.RepositoryEncryption.KMS,

            removalPolicy: RemovalPolicy.DESTROY
        });
        return ecrRepo;
    }

    private addLifecycleRule(ecrRepo: ecr.Repository, props: EcrProps){
        ecrRepo.addLifecycleRule({ tagPrefixList: ['prod'], maxImageCount: 9999});
        ecrRepo.addLifecycleRule({ maxImageAge: props.MaxImageAge});
    }

    private addPermission(ecrRepo: ecr.Repository){
        ecrRepo.grantPullPush(new ServicePrincipal('codebuild.amazon.com'));
    }
}
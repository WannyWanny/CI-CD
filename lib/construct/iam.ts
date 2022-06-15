// iam.ts
import { Construct } from "constructs";
import * as iam from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Repository } from "aws-cdk-lib/aws-ecr";

interface IamProps {
    ServiceName: String
    KmsCmk: Key
    EcrRepo: Repository
}

export class Iam extends Construct {

    public readonly codebuildRole: iam.Role;

    constructor(scope: Construct, id:string, props: IamProps) {
        super(scope, id);

        this.codebuildRole = this.createCodebuildRole();

        this.addEcrAuthPolicy(this.codebuildRole);
        this.addLoggingPolicy(this.codebuildRole);
        this.addCodebuildPolicy(this.codebuildRole);
        this.addCdkAssumePolicy(this.codebuildRole);
        this.addEcrPullPushPolicy(this.codebuildRole, props.EcrRepo);
        this.addKmsPolicy(this.codebuildRole, props.KmsCmk);
    }

    private createCodebuildRole() {
        const codebuildRole = new iam.Role(this, "codebuildRole", {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
        });
        return codebuildRole;
    }

    private addEcrAuthPolicy(role: iam.Role) {
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "ecr:GetAuthorizationToken"
            ],
            resources: ["*"],
        }));
    }

    private addLoggingPolicy(role: iam.Role) {
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "logs:CreateLogGruop",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            resources: ["*"],
        }));
    }

    private addCodebuildPolicy(role: iam.Role) {
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "codebuild:CreateReportGroup",
                "codebuild:CreateReport",
                "codebuild:UpdateReport",
                "codebuild:BatchPutTestCases",
                "codebuild:BatchPutCodeCoverages"
            ],
            resources: ["*"],
        }));
    }

    private addCdkAssumePolicy(role: iam.Role){
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "sts:AssumeRole"
            ],
            resources: ["*"],
        }));
    }
    
    private addEcrPullPushPolicy(role: iam.Role, ecrRepo: Repository) {
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUplaod",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUplaod",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:PutImage"
            ],
            // 리소스를 명시
            resources: [ecrRepo.repositoryArn],
        }));
    }

    private addKmsPolicy(role: iam.Role, cmk: Key) {
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "ksm:Decrypt",
                "ksm:DescribeKey",
                "ksm:Encrypt",
                "ksm:ReEncrypt*",
                "ksm:GenerateDataKey*",
            ],
            // 리소스를 명시
            resources: [cmk.keyArn],
        }));
    }
}
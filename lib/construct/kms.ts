// kms.ts
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";

import * as kms from 'aws-cdk-lib/aws-kms';

interface KmsProps {
    ServiceName: String
}

export class Kms extends Construct {

    public readonly pipelineCmk: kms.Key;

    constructor(scope: Construct, id: string, props: KmsProps) {
        super(scope, id);

        this.pipelineCmk = new kms.Key(this, props.ServiceName + '-' +  'Pipelinecmk', {
            alias: props.ServiceName + '-' + 'PipelineCmk',
            removalPolicy: RemovalPolicy.DESTROY
        })
    }
}
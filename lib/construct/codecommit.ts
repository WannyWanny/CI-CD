// codecommit.ts

import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

// codecommit construct에서 사용할 interface를 정의합니다.
interface CodecommitProps {
    ServiceName: String;
}

export class CodeCommit extends Construct {
    public readonly codeRepo: codecommit.Repository;

    constructor(scope: Construct, id: string, props: CodecommitProps){
        super(scope, id);

        // codecommit lib을 이용하여 Repositroy를 생성할 수 있도록 정의
        this.codeRepo = new codecommit.Repository(this, 'Repository', {
            repositoryName: props.ServiceName + '-' + 'repo', 
            description: 'First-Codecommit Repository for testing.'
        });
    }
}
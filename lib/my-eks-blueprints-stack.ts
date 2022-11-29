// lib/my-eks-blueprints-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';

import { TeamPlatform, TeamApplication } from '../teams'; 
import { KyvernoAddOn } from './kyverno_addon';

export default class ClusterConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    
    const repoUrl = 'https://github.com/aws-samples/eks-blueprints-workloads.git'
  
    // HERE WE ADD THE ARGOCD APP OF APPS REPO INFORMATION
    const bootstrapRepo : blueprints.ApplicationRepository = {
        repoUrl,
        targetRevision: 'workshop',
    }
    
    // HERE WE GENERATE THE ADDON CONFIGURATION
    const bootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'envs/dev'
        },
    });

    
    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(
      new blueprints.ClusterAutoScalerAddOn,
      new KyvernoAddOn(), 
      bootstrapArgo // HERE WE ADD OUR NEW ADDON WITH THE CONFIGURED ARGO CONFIGURATIONS
    ) 
    .teams(new TeamPlatform(account), new TeamApplication('burnham',account)) 
    .build(scope, id+'-stack');
  }
}

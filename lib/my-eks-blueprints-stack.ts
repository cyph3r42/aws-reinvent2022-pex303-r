// lib/my-eks-blueprints-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';

import { TeamPlatform, TeamApplication } from '../teams'; 
import { KyvernoAddOn } from './kyverno_addon'; // WE IMPORT THE ADDON HERE

export default class ClusterConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const account = props?.env?.account!;
    const region = props?.env?.region!;

    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(
      new blueprints.ClusterAutoScalerAddOn,
      new KyvernoAddOn, // HERE WE ONBOARD THE ADDON
      )
    .teams(new TeamPlatform(account), new TeamApplication('burnham',account)) 
    .build(scope, id+'-stack');
  }
}

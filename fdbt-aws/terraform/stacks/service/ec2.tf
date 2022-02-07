# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for an RDS resources

# Parameters:
#   Stage:
#     Type: String
#     AllowedValues:
#       - test
#       - preprod
#       - prod

#   ProductName:
#     Type: String
#     Default: fdbt

#   LatestAmiId:
#     Type: "AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>"
#     Default: "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"

# Conditions:
#   IsProd: !Equals [!Ref Stage, "prod"]

# Resources:
#   BastionInstanceProfile:
#     Type: AWS::IAM::InstanceProfile
#     Properties:
#       InstanceProfileName: !Sub ${ProductName}-bastion-instance-profile-${Stage}
#       Path: /
#       Roles:
#         - Fn::ImportValue: !Sub ${Stage}:BastionRoleName

#   BastionLaunchTemplate:
#     Type: AWS::EC2::LaunchTemplate
#     Properties:
#       LaunchTemplateName: !Sub ${ProductName}-bastion-launch-template-${Stage}
#       LaunchTemplateData:
#         IamInstanceProfile:
#           Arn: !GetAtt BastionInstanceProfile.Arn
#         ImageId: !Ref LatestAmiId
#         InstanceType: t3.micro
#         SecurityGroupIds:
#           - Fn::ImportValue: !Sub ${Stage}:BastionSecurityGroup
#         TagSpecifications:
#           - ResourceType: instance
#             Tags:
#               - Key: Name
#                 Value: Bastion
#               - Key: Bastion
#                 Value: "true"

#   BastionAutoScalingGroup:
#     Type: AWS::AutoScaling::AutoScalingGroup
#     Properties:
#       DesiredCapacity: "1"
#       LaunchTemplate:
#         LaunchTemplateId: !Ref BastionLaunchTemplate
#         Version: !GetAtt BastionLaunchTemplate.LatestVersionNumber
#       MaxSize: "1"
#       MinSize: "1"
#       VPCZoneIdentifier:
#         - Fn::ImportValue: !Sub ${Stage}:PrivateSubnetA
#         - Fn::ImportValue: !Sub ${Stage}:PrivateSubnetB

#Pivotal Customer0 _PCF on AWS_ Reference Architecture

*__Goal__*:  Customer0 Reference Architectures are utilized by Pivotal's Customer0 group to _simulate_ a base deployment of our products that is common to as many customer use cases as possible.  These architectures are then automated via concourse pipelines and _'validated'_ thru various customer0 validation scenarios to simulate typical customer use cases.

######* Customer0[Typical Customer] * = _A secured but publicly accessible PCF Foundation, capable of hosting ~100 Application instances with PCF managed Services: "Mysql, RabbitMQ, Pivotal Spring Cloud Services"_

*__Non-Goals__*:

- This PCF on AWS reference architecture is published as is with no warranty or support expressed or implied!
- This document is NOT intended to replace the basic installation documentation located @ [http://docs.pivotal.io/pivotalcf/1-8/customizing/cloudform.html](http://docs.pivotal.io/pivotalcf/1-8/customizing/cloudform.html), but rather to demonstrate how those instructions should be related to a typical/recommended Pivotal Cloud Foundry Installation on AWS.

*__Validation Key Info__*: (STATUS=Validation In Progress)

| PCF Products Validated        | Version                  | Known Issues              |
| -----------------------------:|:-------------------------|:-------------------------|
| PCF Ops Manager               | 1.8.10.0 (Nov 2 2016)    | PASS |
| Elastic Runtime               | 1.8.13 (Nov 6 2016       | SmokeTests=PASS; CATs=6 Failures |
| Rabbit                        | 1.7.6 (Nov 2 2016)       | PASS |
| Metrics                       | 1.1.# (Latest)           | NOT YET VALIDATED |
| Mysql                         | 1.7.# (Latest)           | NOT YET VALIDATED |
| Spring Cloud Services         | 1.2.# (Latest)           | NOT YET VALIDATED |

## Reference Architecture IaaS Overview

PCF on AWS Reference Architecture Overview (*c0-aws-base*):![c0-aws-base v1.0.1](../static/aws/images/PCF-AWS-RefArch-Overview/overview-arch.png)

- [Pipeline Repo Link](https://github.com/c0-ops/aws-concourse) : Customer0 Concourse Pipelines
- [Running Pipeline Link](https://fly.customer0.net/teams/main/pipelines/c0-aws-deploy-ert-base) : See the Running Customer0 Concourse Pipelines


### __PCF on AWS requires the following AWS Components__:

##### VPC/Region/AZ/Subnet

A Cloud Foundry Deployment will exist within a single VPC.  It will be located in a single AWS region and should distribute Cloud Foundry Jobs/Instances across 3 AWS Availability Zone to ensure a high degree of availability.  Each AWS subnet maps to one subnet.

##### EC2 Instance Quota

Default quota on a new AWS subscription only has around 20 EC2 instances, which is not enough to host a multi-az deployment.
The recommend quota for EC2 instances is 100. AWS require the instances quota tickets to include Primary Instance Types, which should be t2.micro

##### Service Accounts

Best practice PCF on AWS deployments requires 2 "Service Accounts"

1. Admin Account -> "For Terraforming"

   - Terraform will use this admin account to provision required AWS resources as well as an IAM service account


2. IAM Service Account -> "For OpsMan/BOSH"

   - The service account will be automatically provisioned with restricted access only to PCF needed resources. [C0 AWS IAM ](https://github.com/c0-ops/aws-concourse/blob/master/terraform/c0-aws-base/iam.tf)

#####Networks

Review Pipeline Network objects here: [C0 AWS Pipeline Terraform Network Objects](https://github.com/c0-ops/aws-concourse/blob/master/terraform/c0-aws-base/vpc.tf#L25)

Each AWS subnet is tight to a particular AZ. As a result a multi-AZ deployment topologies require corresponding multi-subnets

- **Subnets**

	1. 1 *"public"* subnet <->  This network will host:
		- _["OpsManager","Director(aka BOSH), "NAT Boxes"]_
	2. 3 *"ert"* (/24) subnets <-> These networks will host the core instances of cloud foundry:
	   - _["GoRouters","Diego Cells","Cloud Controllers", "etc..."]_
	3. 3 *"services-#"* subnets <->  These networks ,as well as additional service networks, will host PCF managed service tiles:
  	 - _["Rabbit","Mysql","Spring Cloud Services", "etc..."]_
  4. 3 *"RDS"* subnets <->  These networks will hosts the PCF management databases:
     - _["Cloud Controller DB","UAA DB","etc..."]_   

- **Routes**

	Routes are created by AWS terraform pipeline that associates to each subnet:

  * PublicSubnetRouteTable
    This routing table enable the ingress/egress routing from/to internet through internet gateway for OpsManager, NAT Boxes
  * PrivateSubnetRouteTable
    This routing table enable the egress routing to the internet through the NAT boxes

  *Note*: If an EC2 instance sits on a subnet attached with an Internet gateway as well as a public IP, it is ingress accessible from the internet. E.g. OpsManager


- **External IPs**



#####Security Groups

Review Pipeline Security Group here:[C0 AWS Pipeline Terraform Security Group Rules](https://github.com/c0-ops/aws-concourse/blob/master/terraform/c0-aws-base/security_group.tf)

![rules_and_tags v1.0.0](../static/gcp/images/PCF-GCP-RefArch-Overview/firewall-rules.png)

GCP Firewall rules are bound to a Network object and can be created to use any of the following objects as a match for source & destination fields in a rule:

- *[IP range/Any]*, basically a specific cidr or 0.0.0.0/0 in the case of any
- *[Subnetworks]*, selecting a subnet that a GCP instance is attached to will apply as a match
- *[Instance Tags]*, All PCF jobs get a default_deployment tag as well as additional tags, like job specific tag ["router", "diego-brain", "cell", "etc..."]

Instance tags are the preferred method of applying Firewall rules/ACLs in the Customer0 Reference Architecture. In the image above, irrespective of the subnet ranges applied, traffic can be controlled with the use of tags. Traffic that does not match the source & destination of a rule that is explicitly 'allowed' will be dropped. For example, in the image above, ssh attempts to connect to TCP:22 routed to the 'Diego Brain' job will fail as only TCP:2222 has been allowed via a rule and a matching tag. Since the 'Diego Brain' has no tag matching an 'allow' rule for TCP:22, traffic  will be dropped.


#####Load Balancing

PCF on GCP requires multiple load balancing services types.  The first type is the **_"HTTP"_** load balancer which is leveraged for API/Application access to Cloud Foundry.  It is a very scalable and globally capable resource which does support SSL termination as well as required header sets to forward HTTP/HTTPS traffic direct to the Cloud Foundry  'GoRouter' jobs.   This is why 'ha_proxy' jobs are not necessary in a GCP deployment.  Currently, **HTTP load balancers DO NOT SUPPORT WEBSOCKETS!!!**, this is important in that doppler/loggregator endpoints require websockets, so improperly configure load banacing topologies will not allow 'cf logs' to function. The GCP refarch splits log traffic to another GCP router type (TCP) as shown in the "Network Topology" diagram in this refarch documentation.  Additionally, this is why the GoRouters perform SSL termination as well as the HTTP load balancers, so that log traffic can be encrypted.

The second key type of GCP load balancer PCF will us is the **_"TCP"_** variant.  It cannot perform advanced URL functions, nor can it terminate SSL,  but is a very capable TCP load balancer for Cloud Foundry to leverage as proxy services for:

1. Websockets based 'cf logs' traffic (Required)
2. Diego-Brain ssh-proxy services for 'cf ssh' traffic (Optional)
3. Cloud Foundry TCP Load Balancing Services (Optional)

GCP load balancing services are comprised of multiple components you will see deployed as part of the Customer0 Terraform Scripts:

- Forwarding Rules:
  - These rules can be either 'Global' for use with HTTP load balancing or local for use with TCP load balancing.
  - 'Global' forwarding rules (Used by HTTP LB) map a front end IP address & TCP port to a 'target proxy'.
  - Local forwarding rules (Used by TCP LB) map a front end IP address & TCP port to a 'target pool'

- Target Proxy(s) (Used by HTTP LB)
  - Maps a URL linked to the Front End IP to a 'Backend Service'

- Backend Service(s) (Used by HTTP LB)
  - Bind a 'Health Check' as well as an 'Instance Group' to accept forwarded traffic from the Global-Forwarding-Rule(s)->Target-Proxy(s)->Url_Map(s).  The 'Instance Group' is typically comprised of the Cloud Foundry 'GoRouter' jobs.

- Certificate(s) (Used by HTTP LB)
  - Certs for Client SSL termination when accessing the Cloud Foundry API or Cloud Foundry hosted applications.

- Target Pool(s) (Used by TCP LB)
  - Bind a 'Health Check' as well as 1 or more instances/jobs to accept traffic from a Local-Forwarding-Rule.  These can be various jobs depending on the Forwarding rule,  for example, the 'ssh-proxy' forward rule will map to a target pool consisting of 'Diego-Brain' jobs and a health check for TCP:2222.

- Health Checks
  - Define how HTTP & TCP load balancing services determine is a node is healthy or not to accept forwarded traffic.

#####Instance Groups
#####Images
#####Google Cloud Storage Bucket(s) & Token(s)

## Network Topology

PCF on GCP Base Network Topology (*c0-gcp-base*):![v1.0](../static/gcp/images/PCF-GCP-RefArch-Overview/net-topology-base.png)

Explain Base Network Architecture & GCP Objects

  - Recommended Firewall Topology with Tags
  - GCP Project SSH Topology
  - Application Security Groups
  - Load Balancer Topology
    -  TCP
    -  HTTPS

## Variants to Base Reference Architecture

Will Insert Variant Image(s) here:

Customer0 will 'validate' a limited number of variant scenarios from the base topology.

| Variant *{{gcp_pcf_terraform_template}}*| Varient Description                   |
| -----------------------------:|:-------------------------|
|c0-gcp-nonat|Base template (+) No dedicated SNAT, default GCP instances each with Public IPs for SNAT|
|c0-gcp-private|Base template (-) All External IPs, no public IPs at all||
|c0-gcp-ipsec|Base template (+) IPSEC add on||
|c0-gcp-gslb|2 x Base templates deployments Globally load balanced||



##Pivotal Customer0 PCF on GCP Deployment Pipeline

Describe what Customer0 Uses the pipeline for (Solution Validation)
[Insert Link to pipeline repo]

Min-Reqs to run the Pipleine ...

1. Appropriate GCP Quotas
2. [GCP Service Account](http://docs.pivotal.io/pivotalcf/1-8/customizing/gcp-prepare-env.html#iam_account)
3. [Enable GCP APIs](http://docs.pivotal.io/pivotalcf/1-8/customizing/gcp-prepare-env.html#enable_compute_resource_api)
4. Google Cloud Storage Access Token
5. A resolvable/registered DNS domain for Cloud Foundry `system` & `apps` domains
6. A [Concourse](https://concourse.ci/) instance with workers that have public access.

(ToDo) Document How to use the pipeline in a POC scenario ...

(ToDo) Document How to ref the pipeline for manual deployment steps ...

(ToDo) Document What Customer0 Validates * (Future html link to validation repos) ...


##PCF on GCP Helpful Links

- [https://cloud.google.com/solutions/cloud-foundry-on-gcp](https://cloud.google.com/solutions/cloud-foundry-on-gcp)
- [http://docs.pivotal.io/pivotalcf/1-8/customizing/gcp.html](http://docs.pivotal.io/pivotalcf/1-8/customizing/gcp.html)
- [https://github.com/cloudfoundry-incubator/bosh-google-cpi-release](https://github.com/cloudfoundry-incubator/bosh-google-cpi-release)
- [http://bosh.io/stemcells/bosh-google-kvm-ubuntu-trusty-go_agent](http://bosh.io/stemcells/bosh-google-kvm-ubuntu-trusty-go_agent)
- [http://bosh.io/releases/github.com/cloudfoundry-incubator/bosh-google-cpi-release?all=1](http://bosh.io/releases/github.com/cloudfoundry-incubator/bosh-google-cpi-release?all=1)

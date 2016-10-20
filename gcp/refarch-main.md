#Pivotal Customer0 _PCF on GCP_ Reference Architecture

__Summary__:  Customer0 Reference Architectures are utilized by Pivotal's Customer0 group to _simulate_ a base deployment of our products that is common to as many customer use cases as possible.  These architectures are then automated via concourse pipelines and "validates' thru various customer0 validation scenarios to simulate common customer use cases.

*__This PCF on GCP reference architecture is published as is with no warranty or support expressed or implied__*.

Validation Key Info (October 2016)

| PCF Products Validated        | Version                   |
| ----------------------------- |:-------------------------:|
| PCF Ops Manager               | 1.8.#	(Latest) |
| Elastic Runtime               | 1.8.# (Latest) |
| Rabbit                        | 1.7.# (Latest) |
| Metrics                       | 1.1.# (Latest) |
| Mysql                         | 1.7.# (Latest) |
| Spring Cloud Services         | 1.2.# (Latest) |

## IaaS Overview

PCF on GCP Reference Architecture Overview:![v1.0](https://github.com/c0-ops/landingpage/blob/master/static/gcp/images/PCF-GCP-RefArch-Overview/overview-arch.png)

- [Pipeline Repo Link](https://github.com/c0-ops/gcp-concourse)
- [Running Pipeline Link](https://fly.customer0.net/teams/main/pipelines/c0-gcp-deploy-ert-base)


PCF on GCP requires the following logical Constructs:

##### Project/Region/Zones

A Cloud Foundry Deployment will exist within a single Project.  It will be located in a single GCP region and should distribute Cloud Foundry Jobs/Instances across 3 GCP zones to ensure a high degree of availability.  Each GCP Zone will map to a Cloud Foundry Availability Zone

##### Google Cloud API

Pivotal Ops Manager & BOSH will utilize the Google Compute Engine API, it must be enabled on a new Google Cloud subscription as it is not enabled by default


#####Quotas

Default quotas on a new GCP subscription will not have enough quota for a typical PCF deployment.  This Reference Architecture has been sized to host ~300 typical Cloud Foundry AIs.   You should request a Quota increase for the following Objects:

| Resource        | Suggested Limit                   |
| ----------------------------- |:-------------------------:|
| CPUs *Region Specific*		|#|
| Firewall Rules				   |#|
| Forwarding Rules				   |#|
| Health Checks				   |#|
| Images				   |#|
| Static IP Addresses *Region Specific*   |#|
| IP Addresses Global				   |#|
| IP Addresses *Region Specific*		|#|
| Networks *Region Specific*		|#|
| Subnetworks		|#|
| Routes		|#|
| Target Pools		|#|
| Total persistent disk reserved (GB) *Region Specific* |#|

#####Service Accounts
#####Networks
- Subnets 
- Routes
- External IPs

#####FireWall Rules
#####Load Balancing
- Forwarding Rules
- Target Pools
- Health Checks 
#####Instance Groups
#####Images

## Network Topology

PCF on GCP Base Network Topology :![v1.0](https://github.com/c0-ops/landingpage/blob/master/static/gcp/images/PCF-GCP-RefArch-Overview/net-topology-base.png)

Explain Base Network Architecture

  - Recommended Firewall Topology with Tags
  - GCP Project SSH Topology
  - Application Security Groups
  - Load Balancer Topology
    - 	TCP
    -  HTTPS

## Variants to Reference Architecture

Insert Variant Image(s) here:![alt text](https://d1fto35gcfffzn.cloudfront.net/images/header/Pivotal_WhiteOnTeal_RGB.svg "Network Arch Image")

  1. Private DNS (Non Google Zone Managed) (Pipeline Link)
  2. Private RFC versus Public IP Addresses & NAT (Pipeline Link)
  3. IaaS Specific VPN Architecture (Pipeline Link)
  4. GSLB Setup for multiple (Pipeline Link)

  

##Pivotal Customer0 PCF on GCP Deployment Pipeline

Describe what Customer0 Uses the pipeline for (Solution Validation)
[Insert Link to pipeline repo]

- Document how to prepare the Google Project (API, Quotas, Service Account Creds, etc...)
- Document How to use the pipeline in a POC scenario
- Document How to ref the pipeline for manual deployment steps
- Document What Customer0 Validates * (Future link to validation repos)

Pipeline Job/Tasks
```
Links to Relevant Pipeline Code
```

Pipeline Job/Tasks
```
Links to Relevant Pipeline Code
```

##PCF on GCP Links

[https://cloud.google.com/solutions/cloud-foundry-on-gcp](https://cloud.google.com/solutions/cloud-foundry-on-gcp)
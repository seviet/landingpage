#Pivotal Customer0 _PCF on GCP_ Reference Architecture

__Summary__:  Customer0 Reference Architectures are utilized by Pivotal's Customer0 group to _simulate_ a base deployment of our products that is common to as many customer use cases as possible.  These architectures are then automated via concourse pipelines and "validates' thru various customer0 validation scenarios to simulate common customer use cases.

*__This PCF on GCP reference architecture is published as is with no warranty or support expressed or implied__*.

Validation Key Info (October 2016)

| PCF Products Validated        | Version                   |
| ----------------------------- |:-------------------------:|
| PCF Ops Manager               | 1.8.?	(Link to Pipelines) |
| Elastic Runtime               | ?                         |
| Rabbit                        | ? 		                    |
| Metrics                       | ? 	                       |
| Rabbit                        | ? 		                    |

### Pivotal Customer0 Reference Architecture Overview

Insert IaaS Specific Architecture Overview:![v1.0](https://github.com/c0-ops/landingpage/blob/master/static/gcp/images/PCF-GCP-RefArch-Overview.png)


-explain high level constructs

### IaaS Architecture


Explain GCP logical Constructs required by PCF

- Project/Zones
- Google Cloud APIs
- Quotas Required
- Service Accounts
- Networks
  - Subnets 
  - Routes
  - External IPs
- FireWall Rules
- Load Balancing
  - Forwarding Rules
  - Target Pools
  - Health Checks 
- Instance Groups
- Images

### Network Topology

Insert IaaS Specific Network Image here:![alt text](https://d1fto35gcfffzn.cloudfront.net/images/header/Pivotal_WhiteOnTeal_RGB.svg "Network Arch Image")

Explain Base Architecture

  - Recommended Firewall Topology with Tags
  - GCP Project SSH Topology
  - Application Security Groups
  - Load Balancer Topology
    - 	TCP
    -  HTTPS

Variants to Base Architecture

Insert Variant Image(s):![alt text](https://d1fto35gcfffzn.cloudfront.net/images/header/Pivotal_WhiteOnTeal_RGB.svg "Network Arch Image")

  - Private DNS (Non Google Zone Managed) (Pipeline Link)
  - Private RFC versus Public IP Addresses & NAT (Pipeline Link)
  - IaaS Specific VPN Architecture
  - GSLB Setup for multiple (Pipeline Link)

  

#Pivotal Customer0 Deployment Pipeline

Describe what Customer0 Uses the pipeline for (Solution Validation)
[Insert Link to pipeline repo]


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

#PCF on GCP Links

[https://cloud.google.com/solutions/cloud-foundry-on-gcp](https://cloud.google.com/solutions/cloud-foundry-on-gcp)
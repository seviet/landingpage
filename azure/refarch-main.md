#Pivotal Customer0 Azure Reference Architecture

Summary:  What we are & aren't providing with this ref arch.    No warranty implied or explicit!!!!

Validation Key Info (Date last Updated)

| PCF Products Validated        | Version                   |
| ----------------------------- |:-------------------------:|
| PCF Ops Manager               | 1.8.?	(Link to Pipelines) |
| Elastic Runtime               | ?                         |
| Rabbit                        | ? 		                    |
| Metrics                       | ? 	                       |
| Rabbit                        | ? 		                    |

### Pivotal Customer0 Reference Architecture Overview

Insert Architectural Overview Image here:![alt text](https://d1fto35gcfffzn.cloudfront.net/images/header/Pivotal_WhiteOnTeal_RGB.svg "Complete Solution Arch Image")

-explain high level constructs

### IaaS Architecture

Insert IaaS Specific Object/Architecture Image here:![alt text](https://d1fto35gcfffzn.cloudfront.net/images/header/Pivotal_WhiteOnTeal_RGB.svg "IaaS Arch Image")

Explain logical Constructs required by PCF on the given IaaS (Azure)
  - Service Accounts
  - Resource Groups
  - Availability Sets
  - Virtual Networks / Subnets
  - Network Security Groups
  - Azure Load Balancers

### Network Topology

Insert IaaS Specific Network Image here:![alt text](https://d1fto35gcfffzn.cloudfront.net/images/header/Pivotal_WhiteOnTeal_RGB.svg "Network Arch Image")

Explain

  - Security Controls (ACLs)
  - Application Security Groups
  - Load Balancer Topology
  - Private RFC versus Public IP Addresses
  - IaaS Specific VPN Architecture (Express Rout/Home Grown VPN)
  - Azure API Manager * (Optional)
  - GSLB Setup * (Optional)

#Pivotal Customer0 Deployment Pipeline

Describe what Customer0 Uses the pipeline for (Solution Validation)
[Insert Link to pipeline repo]


- Document How to use the pipeline in a POC scenario
- Document How to ref the pipeline for manual deployment steps
- Document What Customer0 Validates * (Future link to validation repos)


```
Links to Relevant Code
```

#Pivotal Customer0 Azure Reference Architecture

Summary:  What we are & aren't providing with this ref arch.    No warranty implied or expressed!

Validation Key Info (Date last Updated)

| PCF Products Validated        | Version                   |
| ----------------------------- |:-------------------------:|
| PCF Ops Manager               | 1.8.?	(Link to Pipelines) |
| Elastic Runtime               | ?                         |
| future                        | ? 		                    |
| future                        | ? 	                      |
| future                        | ? 		                    |

### Pivotal Customer0 Reference Architecture Overview

  ![](PCF-Azure-RefArch-Customer0.png)

This model shows a single PCF deployment in a single Azure Resource Group. For HA deployment, create and deploy same on a second Resource Group.

The reference approach is to create a Resource Group, populate it with a virtual network and draw three subnets from it. These three subnets will be used in a manner simliar to other Customer[0] architectures, where one is used for infrastructure, one for apps and one for service tiles.

### IaaS Architecture

Insert IaaS Specific Object/Architecture Image here:

  ![]Image

Explain logical Constructs required by PCF on the given IaaS (Azure)
  - Service Accounts
  - Resource Groups
  - Availability Sets
  - Virtual Networks / Subnets
  - Network Security Groups
  - Azure Load Balancers

### Network Topology

Insert IaaS Specific Network Image here:

  ![]Image

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

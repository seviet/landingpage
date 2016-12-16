#Pivotal Customer[0] _PCF on vSphere_ Reference Architecture

*__Goal__*:  Customer[0] Reference Architectures are utilized by Pivotal's Customer[0] group to _simulate_ a base deployment of our products that is common to as many customer use cases as possible.  These architectures are then automated via concourse pipelines and _'validated'_ thru various Customer[0] validation scenarios to simulate typical customer use cases.

######* Customer[0][Typical Customer] * = _A secured and internally hosted PCF Foundation, capable of hosting ~1500 Application Instances (AIs) with PCF managed Services: "Mysql, RabbitMQ, Pivotal Spring Cloud Services"_

*__Non-Goals__*:

- This PCF on AWS reference architecture is published as is with no warranty or support expressed or implied!
- This document is NOT intended to replace the basic installation documentation located @ [http://docs.pivotal.io/](http://docs.pivotal.io/pivotalcf/1-8/customizing/vsphere.html), but rather to demonstrate how those instructions should be related to a typical/recommended Pivotal Cloud Foundry Installation.

| PCF Products Validated        | Version                   |
| ----------------------------- |:-------------------------:|
| PCF Ops Manager               | 1.8.latest |
| Elastic Runtime               | 1.8.latest                |

### Pivotal Customer[0] Reference Architecture Overview

  ![](../static/vsphere/images/overview.png)

- [Pipeline Repo Link](https://github.com/c0-ops/vsphere-concourse) : Customer[0] Concourse Pipelines
- [Pipeline ERT Repo Link](https://github.com/c0-ops/ert-concourse) : Customer[0] Concourse Pipelines
- [Running Pipeline Link](https://fly.customer0.net/teams/main/pipelines/vsphere-base) : See the Running Customer[0] Concourse Pipelines

The reference approach is to create a three Clusters, populate them with the Resource Pools and then deploy PCF with Pivotal Operations Manager into those pools, one pool per Cluster. Core networking is created via an NSX Edge with the following subnets:
  - Infrastructure
  - ERT (_Elastic Runtime_)
  - Service tiles
  - Dynamic Service tiles

This model is the gold standard for deploying one or more PCF installations for long term use and growth, while allowing for capacity growth at the vSphere level and also maximum installation security. The use of NSX is an optional, but highly recommended addition to the installation approach, as it adds several powerful elements:

  1. Firewall capability per-installation thru the built-in Edge firewall
  2. High capacity, resilient load balancing per-installation thru the NSX Load Balancer
  3. Installation obfuscation thru the use of non-routed RFC networks behind the NSX Edge and the use of SNAT/DNAT connections to expose only the endpoints of Cloud Foundry that need exposure.
  4. High repeatability of installations thru the repeat use of all network and addressing conventions on the right hand side of the diagram (the Tenant Side)

Depicted here a two PCF installations sharing the same vSphere capacity, yet segmented from each other with Resource Pools (the dotted line rectangles). This approach can easily scale to many PCF installations on the same capacity with the assurance that each is resource protected and separate from each other. Priority can be given to one or another installation if desired thru the use of "shares" applied at the Pool level ("High Shares" for the important installation, "Low Shares" for the sacrificial one(s)).

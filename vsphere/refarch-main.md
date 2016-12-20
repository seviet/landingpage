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

This model is the gold standard for deploying one or more PCF installations for long term use and growth, while allowing for capacity growth at the vSphere level and also maximum installation security.

Depicted here a two PCF installations sharing the same vSphere capacity, yet segmented from each other with Resource Pools (the dotted line rectangles). This approach can easily scale to many PCF installations on the same capacity with the assurance that each is resource protected and separate from each other. Priority can be given to one or another installation if desired thru the use of "shares" applied at the Pool level ("High Shares" for the important installation, "Low Shares" for the sacrificial one(s)).

*__Compute__*:

Each Cluster is populated by three ESXi hosts, making nine hosts for each installation in a stripped manner. All installations draw form the same nine hosts in an aggregated fashion. Vertical growth is accomplished thru adding more pools and PCF installations, horizontal growth is via adding more hosts to the existing clusters (in sets of three, one per Cluster), from which all the installations can gain access to the added capacity.

It is a VMware best practice to deploy hosts in Clusters of no less that three for vSphere HA use. vSphere DRS is a required function to enable Resource Pools and allow for automated vMotion.

*__Storage__*:

Storage is granted to the hosts in one of two common approaches:
1. Datastores are granted to all hosts and a subset are offered to one installation at a time.
2. Datastores are granted to a host cluster uniquiely and each installation uses multiple datastores to store VMs per cluster.

Example (1): There are 6 datastores, "ds01" thru "ds06". All nine hosts are granted access to all six datastores. PCF installation #1 is provisioned to use "ds01", "ds02", and "ds03" and VMs land in all the pools starting in "ds01" until it's full, then "ds02" is used and so on.

Example (2): There are 6 datastores, "ds01" thru "ds06". Cluster 1 hosts are granted "ds01" and "ds02", Cluster 2 hosts are granted "ds03" and "ds04", and so on. PCF installation #1 is provisioned to use "ds01", "ds03" and "ds05" and all VMs land on the datastore correct for the cluster they are provisioned to. This is how vSphere VSAN works.

*__Networking__*

The above model employs VMware NSX to provide unique benefits to the PCF installation on vSphere. Refer to subsequent chapters in this document for treatments of this approach where NSX is not used.

The use of NSX is an optional, but highly recommended addition to the installation approach, as it adds several powerful elements:

  1. Firewall capability per-installation thru the built-in Edge firewall
  2. High capacity, resilient load balancing per-installation thru the NSX Load Balancer
  3. Installation obfuscation thru the use of non-routed RFC networks behind the NSX Edge and the use of SNAT/DNAT connections to expose only the endpoints of Cloud Foundry that need exposure.
  4. High repeatability of installations thru the repeat use of all network and addressing conventions on the right hand side of the diagram (the Tenant Side)

NSX DLR (Distributed Logical Router) is not used in this approach as it provides only routing services, not load balancing and firewalling.

NSX DLF (Distributed Logical Firewall) isn't used as we gain that capability right where it's needed most, in front of the PCF installation, not on the network(s) the installation uses. This also applies to "micro-segmentation", as there's no need to place firewall rules horizontally on a network used by PCF when the above model is deployed with the NSX Edge.

NSX DLB (Distributed Load Balancing) isn't used as it's not considered production quality and is not intended for use with L7 balancing (which is PCF's primary need) or for North/South flows.

*__Networking Design__*

Each PCF installation consumes three (or more) networks from the NSX Edge, aligned to specific jobs:

- "Infrastruture" A network with a small CIDR range for use with those resources focused on interacting with the IaaS layer and back-office systems. This is an "inward-facing" network, where Ops Manager, BOSH ad other utility VMs such as jump box VM would connect.
- "Deployment" A network with a large CIDR range exclusively used by the ERT tile to deploy app containers and related support components. Also known as "the apps wire".
- "Services" At least one, if not more, with a large CIDR range for use with other installations hosted and managed by BOSH via Ops Manager. A simple approach is to use this network for all PCF tiles except ERT. A more involved approach would be to deploy multiple "Services-#" networks, one for each tile or one for each type of tile, say databases vs message busses and so on.

All of these networks are considered "inside" or "tenant-side" networks, and use non-routable RFC network space to make provisioning repeatable. The NSX Edge translates between the tenant and service provider side networks using SNAT and DNAT.



### Reference Approach Without VMware NSX

In the absence of VMware NSX SDN technology, the PCF installation on vSphere follows the standard approach discussed in the documentation. For the purposes of this reference architecture, it would be easist to explore what changes and/or is lost in this approach.

*__Networking Features__*

- Load balancing would have to be hosted by some external service, such as a hardware appliance or VM from a 3rd party. This also applies to SSL termination.
- Pre-installation firewalling would be lost, as the traditional approach to firewalling inside systems is per zone or per network, not per virtual appliance installation that spans multiple networks.
- The need to SNAT/DNAT non-routable RFC networks used with PCF would go away as it's unlikely they would be used at all without the NSX Edge there to provide the boundary. In it's place a single, or possible multiple VLANs from the routable network space already deployed in the datacenter would be used.

*__Networking Design__*

The more traditional approach without SDN would be to deploy a single VLAN for use with all of PCF, or possibly a pair of VLANs (one for infrastructure and one for PCF).

  ![PCF without SDN Model](image here)

### Reference Approach Without Three Clusters

Some desire to start with PCF aligned to less resource than the standard (above) calls for, so the starting point for that is a single Cluster. If you are working with at least three ESXi hosts, the recommended guidance is still to setup in three Clusters, even with one host in each (such that the HA comes fro the PasS, not the IaaS), but for less than that, place all available hosts into a single Cluster with DRS and HA enabled.

  ![PCF Single Cluster Model](image here)

A two Cluster configuration has little value compared to a single or triple cluster configuration. While a pair of Clusters has symmetry in vSphere, PCF always seeks to deploy resources in odd numbers, so a two Cluster configuration forces the operator into a two AZ alignment for odd (three) elements, which is far from ideal.

*__Network Design__*

It is recommended to use the networking approach detailed in either the with-NSX or without-NSX sections for this design, as the compute arrangement has little impact on how PCF in networked for production use.

*__Storage__*

It is recommended that all datastores to be used by PCF be mapped to all the hosts in the single cluster.

### Reference Approach Utilizing Multi-Datacenter

For some scenarios, deploying PCF across combined resources located in more than one site is desirable to avoid total loss of site. There are a number of approaches architects may take to solve this problem, each with it's own caveats.

TL;DR PCF Multi-Datacenter is a plausable approach that's flawed in one way or another depending on the architecture.

*__Multi-Datacenter vSphere With Stretched Clusters__*



*__Multi-Datacenter vSphere With Combined East/West Clusters__*

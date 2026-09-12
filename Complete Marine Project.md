**Complete Project Details — OceanSentinel**

**1\. Project Overview**

**OceanSentinel** is a multi-agent maritime intelligence and autonomous ocean-preservation platform designed to coordinate three major objectives:

1.  **Maritime Logistics Optimization**
    *   Find fuel-efficient shipping routes.
    *   Account for weather, ocean currents, congestion, environmental zones, and vessel constraints.
    *   Dynamically reroute vessels when conditions change.
    *   Minimize fuel consumption, travel time, emissions, and operational cost.
2.  **Illegal / Dark-Vessel Detection**
    *   Monitor AIS and vessel-position data.
    *   Detect vessels that turn off AIS or behave anomalously.
    *   Identify suspicious fishing patterns.
    *   Detect unusual vessel rendezvous and possible transshipment.
    *   Calculate vessel risk scores.
    *   Monitor protected marine areas and restricted fishing zones.
3.  **Autonomous Marine Debris Management**
    *   Detect and classify floating marine debris.
    *   Predict debris movement using currents and wind.
    *   Assign autonomous cleanup vessels/robots to debris zones.
    *   Optimize robot assignments based on distance, battery, capacity, and debris priority.
    *   Continuously reassign cleanup missions as conditions change.

The system is built around a **Maritime Commander Agent** that coordinates specialized agents rather than treating each feature as an isolated application.

**2\. Core Project Vision**

The final system should behave like an autonomous **maritime command center**.

OCEANSENTINEL

│

Maritime Commander

│

┌─────────────────┼─────────────────┐

│ │ │

▼ ▼ ▼

Shipping Agent Dark Vessel Agent Cleanup Agent

│ │ │

▼ ▼ ▼

Route Planning Vessel Analysis Debris Detection

Fuel Optimization Risk Scoring Debris Prediction

Weather Routing Fishing Detection Robot Allocation

│ │ │

└─────────────────┼─────────────────┘

│

▼

Shared Ocean Intelligence

│

┌─────────────────┼─────────────────┐

▼ ▼ ▼

Weather Ocean Data Geospatial

AIS Data Satellite Marine Zones

│ │ │

└─────────────────┼─────────────────┘

▼

Event System

│

▼

Data Platform

The important idea is:

**Specialized agents perceive the maritime environment, reason about their domain, communicate through events, and cooperate through the Maritime Commander.**

**3\. Main System Modules**

The complete project should contain the following major modules.

**A. Maritime Command Center**

Central dashboard for:

*   Live map
*   Vessel monitoring
*   Route optimization
*   Dark-vessel alerts
*   Marine debris
*   Cleanup missions
*   Weather
*   Ocean conditions
*   Environmental risk
*   System alerts
*   Agent status
*   Historical analytics
*   Sustainability metrics
*   Simulation controls

**4\. Maritime Commander Agent**

This is the central orchestration layer.

It should not perform every calculation itself.

Instead, it delegates tasks to specialized agents.

**Responsibilities**

*   Understand incoming maritime events.
*   Decide which agent should handle an event.
*   Coordinate multiple agents.
*   Combine agent recommendations.
*   Resolve conflicts.
*   Prioritize emergencies.
*   Trigger autonomous actions.
*   Request human approval for high-risk decisions.
*   Maintain mission state.
*   Track active tasks.

Example:

STORM DETECTED

↓

Maritime Commander

↓

Weather Agent

↓

Affected vessels identified

↓

Route Agent

↓

Alternative routes generated

↓

Fuel Agent

↓

Fuel/emission comparison

↓

Ecology Agent

↓

Environmental impact check

↓

Commander

↓

Best route selected

**5\. Shipping Route Optimization System**

**Shipping Agent**

Responsible for finding optimal routes.

**Inputs**

*   Origin
*   Destination
*   Vessel location
*   Vessel speed
*   Vessel type
*   Cargo weight
*   Fuel capacity
*   Current fuel
*   Weather
*   Ocean currents
*   Restricted areas
*   Shipping lanes
*   Port congestion
*   Environmental zones

**Outputs**

*   Recommended route
*   Distance
*   Estimated travel time
*   Estimated fuel consumption
*   CO₂ emissions
*   Estimated operational cost
*   Environmental risk
*   Route confidence

**6\. Multi-Objective Route Optimization**

The route should not simply minimize distance.

The optimization function should consider:

Route Score =

Fuel Cost

\+ Time Cost

\+ Emission Cost

\+ Weather Risk

\+ Environmental Risk

\+ Congestion Cost

\+ Safety Risk

Different weights can be configured.

For example:

Fuel efficiency 30%

Travel time 20%

Safety 20%

CO₂ emissions 15%

Environmental impact 10%

Congestion 5%

The system should support changing these weights.

**7\. Weather-Aware Routing**

Integrate weather information such as:

*   Wind speed
*   Wind direction
*   Wave height
*   Wave direction
*   Storms
*   Visibility
*   Sea conditions

The route optimizer should be able to compare:

Shortest Route

vs

Safest Route

vs

Fuel-Efficient Route

vs

Environmentally Preferred Route

**8\. Ocean Current Optimization**

Ocean currents should influence route selection.

For example:

Current → → → →

🚢

↓

Using current:

Fuel consumption ↓

Travel time ↓

The system should calculate whether taking a longer geographic route can actually reduce fuel consumption.

**9\. Dynamic Rerouting**

The route should not be static.

If:

*   Storm develops
*   Current changes
*   Port becomes congested
*   Restricted zone changes
*   Vessel experiences mechanical problems

the agent should recalculate the route.

Original Route

↓

Environmental change

↓

Risk analysis

↓

New route candidates

↓

Optimization

↓

New recommended route

**10\. Fuel Optimization Agent**

The Fuel Agent calculates:

*   Fuel consumption
*   Fuel remaining
*   Fuel cost
*   Fuel efficiency
*   Estimated fuel savings

It should also evaluate vessel speed.

Example:

18 knots → 35,000 L

16 knots → 29,000 L

14 knots → 24,000 L

The system can recommend:

Reduce speed to 15 knots to save fuel while maintaining acceptable ETA.

**11\. Carbon / Emissions Agent**

Calculate:

*   Fuel-based CO₂ emissions
*   Emissions per voyage
*   Emissions per kilometer
*   Emissions per ton of cargo
*   Emission savings from alternative routes

Dashboard:

CO₂ EMISSIONS

Current route 82.4 tons

Optimized route 67.8 tons

Reduction 17.7%

**12\. Operational Cost Agent**

Calculate overall voyage cost.

Potential components:

Fuel

+

Port fees

+

Delay cost

+

Carbon cost

+

Maintenance

+

Operational cost

This allows the system to find routes that are economically efficient as well as environmentally efficient.

**13\. Dark-Vessel Detection System**

The Dark Vessel Agent monitors vessel behavior.

A vessel becomes suspicious when multiple indicators appear.

**Indicators**

*   AIS turned off
*   AIS signal interruption
*   Impossible position jumps
*   Unusual speed
*   Unusual heading
*   Entry into protected areas
*   Fishing activity in restricted zones
*   Repeated rendezvous
*   Suspicious loitering
*   Repeated route deviations
*   Nighttime activity
*   Unexpected behavior compared with historical patterns

**14\. AIS Anomaly Detection**

The system should detect:

**AIS gap**

10:00 → AIS ON

10:30 → AIS ON

11:00 → AIS OFF

11:30 → AIS OFF

12:00 → AIS ON

The system records:

AIS gap duration = 1 hour

Then correlates it with other information.

AIS disappearance alone should **not automatically classify a vessel as illegal**.

**15\. Vessel Behavioral Analysis**

Maintain historical vessel behavior.

For every vessel:

Normal speed range

Normal operating region

Typical routes

Typical fishing zones

Typical activity times

AIS reliability

Historical anomalies

Then identify deviations.

Example:

Normal behavior:

Fishing zone A

Current behavior:

Protected zone B

Behavior deviation:

HIGH

**16\. Dark-Vessel Risk Score**

Create a weighted risk system.

Example:

AIS interruption +20

Protected-zone entry +30

Suspicious rendezvous +20

Unusual speed +10

Fishing outside permitted

area +20

Historical suspicious

behavior +15

Result:

Risk Score: 92/100

Classification:

HIGH RISK

The system should expose **why** the score was generated.

**17\. Vessel Rendezvous Detection**

Detect vessels that:

1.  Approach one another.
2.  Slow down.
3.  Remain close for a period.
4.  Separate.

This can indicate potential ship-to-ship activity.

The system should store:

Vessel A

Vessel B

Location

Start time

End time

Duration

Distance between vessels

Speed during rendezvous

Historical occurrences

Repeated events increase the risk score.

**18\. Geofencing System**

Create geospatial boundaries for:

*   Marine protected areas
*   Fishing zones
*   No-fishing zones
*   Shipping corridors
*   Ports
*   Restricted waters
*   Ecologically sensitive regions

Then detect:

VESSEL ENTERED PROTECTED ZONE

and generate an event.

**19\. Marine Environmental Risk Agent**

This agent evaluates ocean regions.

Factors:

*   Marine protected areas
*   Whale activity
*   Coral reef regions
*   Fishing activity
*   Shipping density
*   Pollution
*   Debris
*   Weather
*   Ocean conditions

Output:

Environmental Risk: 81/100

**20\. Marine Ecosystem Monitoring**

The platform can maintain environmental layers:

Whale zones

Coral zones

Protected areas

Fishing zones

Pollution zones

Debris zones

High-traffic shipping zones

These layers can influence route optimization.

**21\. Marine Debris Detection System**

The Cleanup Agent manages marine debris.

Possible debris categories:

*   Plastic
*   Fishing nets
*   Containers
*   Floating garbage
*   Wood
*   Oil-like surface contamination
*   Unknown floating objects

**22\. Computer Vision Agent**

Use image/video input to identify debris.

Pipeline:

Camera / Satellite Image

↓

Computer Vision Model

↓

Object Detection

↓

Classification

↓

Location Extraction

↓

Debris Database

Store:

Debris ID

Latitude

Longitude

Type

Estimated size

Confidence

Detection time

Priority

**23\. Debris Priority Agent**

Not all debris has the same importance.

Priority can depend on:

*   Size
*   Type
*   Toxicity
*   Location
*   Proximity to protected ecosystems
*   Proximity to coastline
*   Proximity to marine life
*   Movement speed

Example:

Fishing net CRITICAL

Large container HIGH

Oil-like spill CRITICAL

Plastic bottle LOW

**24\. Debris Movement Prediction**

Predict future debris positions using:

*   Ocean currents
*   Wind
*   Waves
*   Historical movement

Example:

Current position

↓

+2 hours

↓

+6 hours

↓

+12 hours

This allows cleanup robots to intercept debris rather than simply chase it.

**25\. Autonomous Cleanup Fleet**

Simulate or control multiple cleanup vessels/robots.

Each robot has:

Location

Battery

Maximum range

Collection capacity

Current mission

Speed

Status

Example:

Robot 1

Battery: 92%

Capacity: 500 kg

Robot 2

Battery: 44%

Capacity: 300 kg

Robot 3

Battery: 78%

Capacity: 700 kg

**26\. Cleanup Mission Allocation**

The Cleanup Coordinator determines which robot should collect which debris.

Optimization factors:

Distance

+

Battery

+

Debris quantity

+

Robot capacity

+

Debris priority

+

Ocean current

+

Time

Output:

Robot 1 → Zone C

Robot 2 → Zone A

Robot 3 → Zone B

**27\. Autonomous Mission Reassignment**

If:

Robot battery becomes low

the system should:

Pause mission

↓

Find nearest suitable robot

↓

Transfer mission

↓

Resume cleanup

This demonstrates real autonomous coordination.

**28\. Oil Spill Detection**

Add a specialized environmental detection agent.

Pipeline:

Satellite / Drone Image

↓

Vision Model

↓

Potential oil spill

↓

Confidence score

↓

Environmental risk

↓

Emergency response

**29\. Maritime Emergency Agent**

Monitor:

*   Storms
*   Ship collision risk
*   Engine failure
*   Fire
*   Oil spill
*   Vessel grounding
*   Severe weather
*   Low fuel
*   Navigation anomalies

The Emergency Agent gets the highest priority.

**30\. Collision Risk Detection**

Calculate risk based on:

*   Distance
*   Relative speed
*   Heading
*   Closest point of approach
*   Time to closest point

Generate:

Collision Risk: HIGH

Vessel A

→ heading 082°

Vessel B

→ heading 261°

CPA: 0.4 km

TCPA: 6 minutes

Then recommend evasive action.

**31\. Predictive Maintenance**

Monitor vessel telemetry:

*   Engine temperature
*   RPM
*   Fuel efficiency
*   Vibration
*   Oil pressure
*   Engine load

Detect anomalies.

Example:

Engine vibration

Normal: 3.1

Current: 5.8

Fuel efficiency:

↓ 12%

Maintenance Risk:

HIGH

**32\. Smart Port Optimization**

Port Agent manages:

*   Berth assignment
*   Arrival scheduling
*   Vessel queue
*   Loading/unloading
*   Fueling
*   Maintenance
*   Departure scheduling

Goal:

Minimize:

Waiting time

+

Port congestion

+

Fuel consumption

**33\. Dynamic ETA Prediction**

ETA should use:

Distance

+

Vessel speed

+

Current

+

Weather

+

Congestion

+

Port waiting time

Continuously update:

Original ETA: 14:30

New ETA: 15:05

Reason:

Storm + port congestion

**34\. Human-in-the-Loop System**

Not every action should be autonomous.

Actions should be categorized:

**Automatic**

*   Recalculate route
*   Update ETA
*   Predict debris
*   Assign low-risk cleanup mission

**Approval required**

*   High-risk vessel escalation
*   Emergency route change
*   Major cleanup mission reassignment
*   High-risk environmental action

Dashboard:

⚠️ HUMAN APPROVAL REQUIRED

Vessel: MV-203

Risk: 91/100

Reason:

Protected-zone entry

+

AIS outage

+

Suspicious rendezvous

\[Approve Investigation\]

\[Reject\]

\[Review Evidence\]

**35\. Explainable AI**

Every agent recommendation should have an explanation.

Instead of:

"Route B is better."

Show:

Route B selected because:

Fuel consumption -11%

CO₂ emissions -14%

Storm risk -32%

Environmental impact -18%

ETA increase +24 min

For dark vessels:

High-risk classification because:

AIS outage ✓

Protected zone ✓

Rendezvous ✓

Unusual speed ✓

Historical anomaly ✓

**36\. Event-Driven Architecture**

Agents should communicate using events.

Example:

STORM\_DETECTED

VESSEL\_ENTERED\_ZONE

AIS\_SIGNAL\_LOST

DARK\_VESSEL\_SUSPECTED

DEBRIS\_DETECTED

DEBRIS\_MOVEMENT\_UPDATED

CLEANUP\_MISSION\_CREATED

VESSEL\_ENGINE\_ANOMALY

COLLISION\_RISK\_DETECTED

PORT\_CONGESTION\_CHANGED

ROUTE\_RECALCULATION\_REQUIRED

This is important for scalability.

**37\. Shared Maritime Knowledge Base**

Maintain shared information about:

**Vessels**

Vessel ID

Position

Speed

Heading

Type

Owner/operator

Historical behavior

Risk

**Ocean**

Currents

Weather

Temperature

Waves

Protected zones

Ecological zones

**Debris**

Location

Type

Quantity

Priority

Movement

Assigned robot

**Routes**

Origin

Destination

Distance

ETA

Fuel

CO₂

Risk

**38\. Recommended Technology Stack**

**Frontend**

**React + TypeScript**

Use:

*   React
*   TypeScript
*   Vite or Next.js
*   Tailwind CSS

For maps:

**MapLibre GL JS**

or

**Mapbox GL JS**

The dashboard should be map-centric.

**39\. Mapping / Geospatial Layer**

Recommended:

**PostGIS**

PostgreSQL extension for geospatial data.

Use it for:

*   Vessel coordinates
*   Marine zones
*   Routes
*   Debris
*   Robot positions
*   Geofencing
*   Spatial queries

Example:

Find all vessels

within 10 km

of protected zone X

**40\. Backend**

A strong architecture would use:

**Python + FastAPI**

Python is particularly useful because the project involves:

*   AI/ML
*   optimization
*   geospatial processing
*   computer vision
*   data science

FastAPI handles:

*   REST APIs
*   WebSocket connections
*   Agent APIs
*   Authentication
*   Dashboard communication

**41\. Agent Framework**

For the multi-agent layer, evaluate:

*   LangGraph
*   LangChain
*   CrewAI
*   AutoGen

For this project, I would lean toward **LangGraph** because the system has explicit state, workflows, branching, and agent coordination.

The important thing is that the LLM should **orchestrate decisions**, not replace deterministic algorithms.

For example:

LLM Agent

↓

"Storm detected"

↓

Call route optimizer

↓

Call fuel calculator

↓

Call environmental-risk service

↓

Compare results

↓

Generate recommendation

Don't ask an LLM to calculate shortest paths or fuel consumption itself.

**42\. Optimization Algorithms**

Use conventional algorithms where appropriate.

**Routing**

*   Dijkstra
*   A\*
*   Multi-objective shortest path
*   Time-dependent routing

**Fleet allocation**

*   Hungarian algorithm
*   Linear programming
*   Integer programming
*   Vehicle routing problem techniques

**Scheduling**

*   Constraint optimization
*   Priority queues
*   Mixed-integer programming

**Collision detection**

*   CPA/TCPA calculations
*   Geometric trajectory analysis

**Debris prediction**

*   Physics-inspired simulation
*   Numerical trajectory models
*   ML forecasting where appropriate

**43\. Machine Learning**

Possible ML components:

**Vessel anomaly detection**

*   Isolation Forest
*   Autoencoders
*   Random Forest
*   Gradient boosting

**Debris detection**

*   YOLO
*   Faster R-CNN
*   Segmentation models

**Time-series prediction**

*   XGBoost
*   LSTM
*   Temporal models

**Risk prediction**

*   Gradient boosting
*   Neural networks
*   Rule + ML hybrid model

**44\. Satellite / External Data**

The architecture should support external maritime datasets.

Potential sources include:

*   AIS data
*   Weather APIs
*   Ocean current datasets
*   Satellite imagery
*   Marine protected area datasets
*   Fishing-zone datasets
*   Port information
*   OpenStreetMap / maritime geospatial data

For the hackathon, real-time access is optional.

You can build a **replay/simulation layer** using historical or generated data.

**45\. Simulation Engine**

This is important because you don't want the entire demo dependent on live data.

Create a simulation environment containing:

Ocean grid

+

Ships

+

Weather

+

Currents

+

Debris

+

Robots

+

Marine zones

Simulation can generate events:

10:00 → Normal

10:15 → Storm appears

10:20 → Vessel AIS disappears

10:25 → Debris detected

10:30 → Robot dispatched

10:40 → Port congestion increases

Agents react to these events.

**46\. Digital Twin**

The simulation becomes a maritime **digital twin**.

Dashboard shows:

DIGITAL OCEAN

🚢

🌊

🛰️

🗑️ 🚢

☁️

STORM

🐋 Protected Zone

🤖 Cleanup Robot

The state of the simulation should be synchronized with the agent system.

**47\. What-If Simulation**

Users should be able to trigger scenarios.

Examples:

**Scenario 1**

**Storm appears**

System reroutes vessels.

**Scenario 2**

**AIS disabled**

System evaluates vessel risk.

**Scenario 3**

**500 kg debris detected**

Cleanup fleet gets deployed.

**Scenario 4**

**Oil spill detected**

Emergency response activates.

**Scenario 5**

**Port congestion**

Ships receive new arrival schedules.

**48\. Data Storage**

**PostgreSQL + PostGIS**

Primary persistent database.

Tables could include:

vessels

vessel\_positions

vessel\_events

routes

route\_history

weather

ocean\_currents

marine\_zones

debris

debris\_predictions

cleanup\_robots

cleanup\_missions

alerts

agent\_events

ports

**49\. Redis**

Use Redis for:

*   Real-time state
*   Caching
*   Agent communication
*   Temporary mission state
*   Pub/Sub
*   Fast dashboard updates

**50\. Event Broker**

For a larger architecture:

**Kafka**

or a simpler solution:

**Redis Streams / PubSub**

For the hackathon, Redis can be enough.

Later the architecture can evolve to Kafka.

**51\. Real-Time Communication**

Use:

**WebSockets**

Dashboard receives:

Vessel position update

Storm update

New dark-vessel alert

Debris detection

Robot movement

Route change

without refreshing the page.

**52\. API Structure**

Possible backend structure:

/api/v1/vessels

/api/v1/routes

/api/v1/weather

/api/v1/ocean

/api/v1/debris

/api/v1/cleanup

/api/v1/dark-vessels

/api/v1/zones

/api/v1/ports

/api/v1/alerts

/api/v1/agents

/api/v1/simulation

**53\. Frontend Dashboard Pages**

**1\. Command Center**

Main operational view.

**2\. Fleet**

All vessels and robots.

**3\. Route Planner**

Interactive route optimization.

**4\. Dark Vessel Intelligence**

Suspicious vessel analysis.

**5\. Ocean Health**

Pollution, debris and ecosystem data.

**6\. Cleanup Operations**

Robot missions.

**7\. Alerts**

System-wide alerts.

**8\. Simulation**

Digital-twin scenarios.

**9\. Analytics**

Historical metrics.

**10\. Agent Monitor**

Shows what each AI agent is doing.

**54\. Agent Monitor**

This can be a great hackathon UI feature.

MARITIME COMMANDER

● ACTIVE

SHIPPING AGENT

● Calculating route

WEATHER AGENT

● Monitoring storm

DARK VESSEL AGENT

⚠️ Investigating MV-204

CLEANUP AGENT

● Coordinating 4 robots

ECOLOGY AGENT

● Calculating environmental impact

Clicking an agent shows its recent decisions.

**55\. System Metrics**

Track measurable impact.

**Logistics**

*   Fuel saved
*   Distance saved
*   Travel time saved
*   CO₂ avoided
*   Cost saved

**Conservation**

*   Suspicious vessels detected
*   Protected-zone violations
*   Debris detected
*   Debris collected
*   Cleanup distance
*   Cleanup time

**Safety**

*   Collision risks detected
*   Storm reroutes
*   Emergencies handled

**56\. Ocean Sustainability Score**

Combine the metrics into one high-level score.

Example:

OCEAN HEALTH

87/100

Fuel Efficiency 91

Carbon Reduction 88

Marine Safety 84

Illegal Fishing 92

Ocean Cleanup 81

Environmental Risk 86

**57\. Security**

The system should include:

*   JWT authentication
*   Role-based access
*   API authentication
*   Input validation
*   Rate limiting
*   Secure secrets
*   Audit logs

Roles:

Admin

Operator

Environmental Analyst

Port Manager

Observer

**58\. Observability**

Track:

*   Agent execution time
*   Agent failures
*   API latency
*   Event processing
*   Model inference time
*   Database performance
*   WebSocket connections

Use:

*   Structured logging
*   Prometheus
*   Grafana
*   OpenTelemetry

For the hackathon, basic logging + monitoring is sufficient initially.

**59\. Testing Strategy**

**Unit tests**

Test:

*   Route calculations
*   Fuel calculations
*   Risk scores
*   Geofence logic
*   Debris allocation
*   Collision detection

**Integration tests**

Test:

Event

↓

Agent

↓

Database

↓

API

↓

Dashboard

**AI tests**

Test:

*   False positives
*   False negatives
*   Confidence
*   Model performance

**Simulation tests**

Create reproducible scenarios.

**60\. Deployment**

Recommended:

**Frontend**

*   Vercel

**Backend**

*   Render / Railway / AWS / Azure

**Database**

*   PostgreSQL
*   Supabase / Neon / AWS RDS

**Redis**

*   Upstash / Redis Cloud

**Containerization**

Use:

**Docker**

Structure:

frontend

backend

agent-service

worker

postgres

redis

Docker Compose can run the local environment.

**61\. Suggested Repository Structure**

oceansentinel/

│

├── frontend/

│ ├── src/

│ │ ├── components/

│ │ ├── pages/

│ │ ├── maps/

│ │ ├── dashboard/

│ │ └── services/

│

├── backend/

│ ├── app/

│ │ ├── api/

│ │ ├── models/

│ │ ├── schemas/

│ │ ├── services/

│ │ ├── repositories/

│ │ └── main.py

│

├── agents/

│ ├── commander/

│ ├── shipping/

│ ├── fuel/

│ ├── weather/

│ ├── dark\_vessel/

│ ├── ecology/

│ ├── debris/

│ ├── cleanup/

│ ├── emergency/

│ └── port/

│

├── ml/

│ ├── vessel\_anomaly/

│ ├── debris\_detection/

│ ├── risk\_prediction/

│ └── forecasting/

│

├── simulation/

│ ├── ocean/

│ ├── vessels/

│ ├── weather/

│ ├── debris/

│ └── scenarios/

│

├── data/

│ ├── vessels/

│ ├── weather/

│ ├── marine\_zones/

│ └── simulation/

│

├── database/

│ ├── migrations/

│ └── seeds/

│

├── docker/

│

├── tests/

│

└── README.md

**62\. Recommended Development Principles**

The most important architectural principle is:

**AI does not need to do everything.**

Use:

**LLMs for:**

*   Reasoning
*   Planning
*   Agent orchestration
*   Natural-language explanations
*   Tool selection
*   Decision synthesis

Use:

**Algorithms for:**

*   Routing
*   Distances
*   Fuel calculations
*   Collision mathematics
*   Geofencing
*   Optimization

Use:

**ML for:**

*   Anomaly detection
*   Computer vision
*   Prediction
*   Classification

Use:

**Database/GIS for:**

*   Spatial queries
*   Historical data
*   Vessel tracking
*   Environmental zones

This hybrid architecture will be considerably more robust than trying to make an LLM directly control everything.

**63\. Complete Feature Inventory**

For the eventual project roadmap, these are the features to track.

**🚢 Maritime Logistics**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route planning
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Multi-objective optimization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fuel optimization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)CO₂ optimization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cost optimization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather-aware routing
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean-current routing
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dynamic rerouting
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)ETA prediction
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Port congestion
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Smart port scheduling
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Predictive maintenance
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Collision detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Emergency routing

**🛰️ Dark Vessel Intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS tracking
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gap detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Position anomaly detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Speed anomaly detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route deviation detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Suspicious loitering
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Rendezvous detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing activity detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Protected-zone violations
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Historical vessel behavior
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel risk scoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Explainable risk analysis
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Alert generation

**🌊 Ocean Preservation**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Marine protected zones
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ecosystem risk mapping
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Marine-life zones
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Pollution monitoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris classification
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris prioritization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris movement prediction
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Oil-spill detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean health score

**🤖 Autonomous Cleanup**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup robot fleet
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Robot state tracking
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Battery monitoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Collection capacity
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission assignment
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fleet optimization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dynamic reassignment
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission tracking
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris interception
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Autonomous return-to-base

**🧠 Multi-Agent Intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Maritime Commander
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Shipping Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fuel Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dark Vessel Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ecology Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup Agent
*   \[Emergency Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Port Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Predictive Maintenance Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Event-driven communication
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Shared state
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent memory
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent observability
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Human-in-the-loop

**🌐 Platform**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Interactive world map
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dark-vessel dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Alert system
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent monitoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Analytics
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Historical replay
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Digital twin
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)What-if simulation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean sustainability score

**64\. Final System Architecture**

The complete architecture should ultimately look like this:

┌─────────────────────────┐

│ USER / OPERATOR │

└────────────┬────────────┘

│

▼

┌─────────────────────────┐

│ MARITIME COMMAND UI │

│ React + TypeScript │

│ Map + Analytics │

└────────────┬────────────┘

│

REST + WebSocket

│

▼

┌────────────────────────────────────┐

│ API GATEWAY │

│ FastAPI │

└────────────────┬───────────────────┘

│

▼

┌────────────────────────────────────┐

│ MARITIME COMMANDER │

│ Multi-Agent Orchestrator │

│ LangGraph │

└────────────────┬───────────────────┘

│

┌──────────────────────────┼──────────────────────────┐

│ │ │

▼ ▼ ▼

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐

│ SHIPPING AGENTS │ │ VESSEL SECURITY │ │ OCEAN PRESERVE │

│ │ │ │ │ │

│ Route │ │ Dark Vessel │ │ Debris │

│ Fuel │ │ AIS Anomaly │ │ Ecology │

│ Weather │ │ Rendezvous │ │ Oil Spill │

│ Cost │ │ Risk │ │ Cleanup │

│ ETA │ │ Geofence │ │ Robot Fleet │

└────────┬────────┘ └────────┬────────┘ └────────┬────────┘

│ │ │

└─────────────────────────┼─────────────────────────┘

│

▼

┌──────────────────────┐

│ EVENT BUS │

│ Redis Streams/Kafka │

└──────────┬───────────┘

│

┌─────────────────────────┼─────────────────────────┐

▼ ▼ ▼

┌────────────────┐ ┌────────────────┐ ┌────────────────┐

│ AIS / VESSELS │ │ WEATHER/OCEAN │ │ SATELLITE/CV │

│ Data │ │ Data │ │ Data │

└────────────────┘ └────────────────┘ └────────────────┘

│

▼

┌──────────────────────┐

│ AI / ML SERVICES │

│ │

│ Anomaly Detection │

│ Object Detection │

│ Forecasting │

│ Risk Prediction │

└──────────┬───────────┘

│

▼

┌──────────────────────┐

│ OPTIMIZATION ENGINE │

│ │

│ A\* / Dijkstra │

│ VRP │

│ Assignment │

│ Scheduling │

└──────────┬───────────┘

│

▼

┌─────────────────────────────────┐

│ DATA PLATFORM │

│ │

│ PostgreSQL + PostGIS │

│ Redis │

│ Object Storage │

└─────────────────────────────────┘

│

▼

┌──────────────────────┐

│ DIGITAL OCEAN │

│ TWIN │

│ │

│ Ships │

│ Storms │

│ Currents │

│ Debris │

│ Robots │

│ Marine zones │

└──────────────────────┘

**65\. What the Finished Demo Should Feel Like**

The final product should feel less like a collection of ML models and more like a **real autonomous maritime operations center**.

A judge should be able to select:

**"Storm + Dark Vessel + Marine Debris Scenario"**

and watch:

Storm detected

↓

Weather Agent analyzes storm

↓

Commander identifies affected ships

↓

Shipping Agent generates routes

↓

Fuel Agent scores routes

↓

Ecology Agent checks protected areas

↓

Commander selects route

↓

AIS Agent detects suspicious vessel

↓

Risk Agent calculates 91/100

↓

Debris Agent detects floating debris

↓

Prediction Agent forecasts movement

↓

Cleanup Agent dispatches Robot #3

↓

Robot route optimized

↓

Mission completed

↓

Dashboard updates:

Fuel saved 8,420 L

CO₂ avoided 22.5 tons

Debris collected 640 kg

Vessels protected 7

Dark vessels 1 flagged

**Phase 1 of 4 — Maritime Intelligence Foundation + Core Route Optimization**

Phase 1 should establish the **working foundation of OceanSentinel** and deliver the first complete end-to-end capability:

**A user can select a vessel, origin, destination, and optimization objective; OceanSentinel generates and visualizes an optimized maritime route, calculates distance/fuel/CO₂/ETA, stores the voyage, and explains why the route was selected.**

Phase 1 should **not** attempt to fully implement dark-vessel detection, autonomous cleanup, satellite computer vision, or the complete multi-agent ecosystem yet. Those depend on the data, geospatial, event, API, and frontend foundations established here.

**1\. Phase 1 Goal**

By the end of Phase 1, the project should be a functioning **Maritime Logistics Intelligence MVP**.

The complete flow should be:

USER

│

▼

┌─────────────────┐

│ Command Center │

│ React Dashboard │

└────────┬────────┘

│

▼

FastAPI Backend

│

▼

Route Planning API

│

┌───────────┼───────────┐

▼ ▼ ▼

Geospatial Fuel Emission

Engine Model Model

│ │ │

└───────────┼───────────┘

▼

Route Optimizer

│

▼

PostgreSQL/PostGIS

│

▼

Dashboard Map

**2\. Phase 1 Deliverables**

The developer must finish these components:

**Core infrastructure**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Git repository
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Project structure
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Docker environment
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)PostgreSQL
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)PostGIS
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Redis
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Backend
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Frontend
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environment configuration
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Database migrations
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Seed data

**Maritime data model**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel database
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel position model
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Port model
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Marine zone model
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route model
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Voyage model
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route segment model

**Route engine**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Coordinate validation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Distance calculation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean-grid representation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Land/obstacle handling
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)A\* route planning
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Alternative route generation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route scoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route selection

**Fuel system**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel fuel parameters
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fuel-consumption calculation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fuel-cost calculation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fuel-saving comparison

**Emission system**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)CO₂ calculation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Emission comparison
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental score

**ETA**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Travel-time calculation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)ETA calculation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route comparison

**API**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel APIs
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Port APIs
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route APIs
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Voyage APIs
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Optimization API
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Health API

**Frontend**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Command center
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Interactive map
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel selector
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Origin/destination selection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Optimization controls
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route visualization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route comparison
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Metrics dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Explanation panel

**Testing**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Unit tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)API tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Optimization tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Database tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Frontend tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)End-to-end test

**3\. Technology Stack**

Use this stack consistently throughout Phase 1.

**Frontend**

React

TypeScript

Vite

Tailwind CSS

MapLibre GL JS

React Query / TanStack Query

Zustand

Purpose:

| Technology | Purpose |
| --- | --- |
| React | UI |
| TypeScript | Type safety |
| Vite | Build tooling |
| Tailwind | Styling |
| MapLibre | Maritime map |
| TanStack Query | API state |
| Zustand | Application state |

**4\. Backend**

Use:

Python

FastAPI

Pydantic

SQLAlchemy

Alembic

GeoAlchemy2

Purpose:

FastAPI → API

Pydantic → validation

SQLAlchemy → database ORM

Alembic → migrations

GeoAlchemy2 → PostGIS

**5\. Database**

Use:

PostgreSQL

PostGIS

PostGIS is mandatory for Phase 1.

The system needs spatial operations such as:

distance between coordinates

point inside zone

route intersects zone

nearest port

nearest vessel

**6\. Cache / Event Infrastructure**

Use:

Redis

Phase 1 only needs Redis for:

*   caching route calculations
*   temporary simulation state
*   future event architecture

The complete agent event system will be expanded in later phases.

**7\. Containerization**

Use:

Docker

Docker Compose

Local infrastructure:

Docker Compose

│

├── frontend

├── backend

├── postgres

└── redis

During development, frontend can also run outside Docker if preferred, but the database/backend infrastructure must be reproducible.

**8\. Required Repository Structure**

Create:

oceansentinel/

│

├── README.md

├── .gitignore

├── .env.example

├── docker-compose.yml

│

├── frontend/

│ ├── package.json

│ ├── tsconfig.json

│ ├── vite.config.ts

│ └── src/

│ ├── components/

│ ├── pages/

│ ├── features/

│ ├── hooks/

│ ├── services/

│ ├── stores/

│ ├── types/

│ ├── utils/

│ └── main.tsx

│

├── backend/

│ ├── requirements.txt

│ ├── alembic.ini

│ └── app/

│ ├── main.py

│ ├── config.py

│ ├── database.py

│ │

│ ├── api/

│ │ ├── vessels.py

│ │ ├── ports.py

│ │ ├── routes.py

│ │ ├── voyages.py

│ │ └── health.py

│ │

│ ├── models/

│ │ ├── vessel.py

│ │ ├── port.py

│ │ ├── route.py

│ │ ├── voyage.py

│ │ └── marine\_zone.py

│ │

│ ├── schemas/

│ │ ├── vessel.py

│ │ ├── port.py

│ │ ├── route.py

│ │ └── voyage.py

│ │

│ ├── services/

│ │ ├── routing/

│ │ ├── fuel/

│ │ ├── emissions/

│ │ ├── eta/

│ │ └── optimization/

│ │

│ ├── repositories/

│ │

│ ├── utils/

│ │

│ └── tests/

│

├── simulation/

│ ├── grid/

│ ├── vessels/

│ ├── routes/

│ └── scenarios/

│

├── data/

│ ├── vessels/

│ ├── ports/

│ ├── marine\_zones/

│ └── scenarios/

│

└── docs/

├── architecture.md

├── api.md

├── database.md

└── routing.md

**9\. Environment Configuration**

Create:

.env

with values conceptually equivalent to:

DATABASE\_URL=postgresql://...

REDIS\_URL=redis://...

API\_HOST=0.0.0.0

API\_PORT=8000

CORS\_ORIGINS=http://localhost:5173

Also create:

.env.example

without secrets.

Never commit .env.

**10\. Database Design**

Phase 1 needs the following entities.

**10.1 Vessel**

A vessel represents a ship managed by OceanSentinel.

Fields:

id

vessel\_identifier

name

vessel\_type

length\_m

width\_m

draft\_m

max\_speed\_knots

cruise\_speed\_knots

fuel\_capacity\_liters

fuel\_consumption\_rate

cargo\_capacity\_tonnes

current\_fuel\_liters

latitude

longitude

heading

status

created\_at

updated\_at

Example:

Vessel:

MV Ocean Star

Type:

Container Ship

Cruise speed:

16 knots

Fuel capacity:

1,200,000 L

Current fuel:

840,000 L

**11\. Vessel Types**

Support at least:

container

tanker

bulk\_carrier

cargo

research

cleanup

patrol

other

**12\. Port Model**

Fields:

id

name

country

latitude

longitude

capacity

congestion\_level

status

Example:

Singapore Port

Latitude: ...

Longitude: ...

Congestion: 35%

**13\. Marine Zone Model**

This is important for future phases.

Store:

id

name

zone\_type

geometry

risk\_level

restricted

description

Zone types:

protected\_area

shipping\_lane

fishing\_zone

restricted\_area

environmental\_zone

port\_zone

Even though Phase 1 does not fully implement the environmental agents, the route engine should already be capable of recognizing restricted zones.

**14\. Route Model**

A route represents the generated path.

Fields:

id

origin\_lat

origin\_lon

destination\_lat

destination\_lon

distance\_km

estimated\_time\_hours

estimated\_fuel\_liters

estimated\_co2\_kg

estimated\_cost

risk\_score

environmental\_score

optimization\_score

geometry

created\_at

geometry should be stored as a PostGIS LineString.

**15\. Route Segment Model**

A route consists of segments.

route\_id

sequence\_number

start\_point

end\_point

distance\_km

estimated\_speed

estimated\_fuel

estimated\_time

This becomes extremely useful later when weather/current information is introduced.

**16\. Voyage Model**

A voyage represents a vessel actually using a route.

Fields:

id

vessel\_id

route\_id

status

departure\_time

estimated\_arrival

actual\_arrival

starting\_fuel

estimated\_fuel

fuel\_saved

co2\_estimated

created\_at

Statuses:

planned

active

completed

cancelled

**17\. Spatial Database Configuration**

Enable PostGIS.

The database must support:

POINT

LINESTRING

POLYGON

Use WGS84 / EPSG:4326 for geographic coordinates.

**18\. Seed Data**

Do not start with an empty database.

Create deterministic demo data.

At minimum:

**10 vessels**

Different types and fuel characteristics.

**10 ports**

Distributed across the simulated ocean.

**5–10 marine zones**

Include:

*   normal shipping area
*   protected area
*   restricted area
*   environmental zone
*   shipping corridor

**Several predefined scenarios**

For example:

Mumbai → Singapore

Singapore → Colombo

Colombo → Dubai

Dubai → Mumbai

These are **simulation/demo scenarios**, not claims about actual optimal maritime navigation.

**19\. Coordinate System**

All API requests involving coordinates must use:

latitude

longitude

Validate:

latitude ∈ \[-90, 90\]

longitude ∈ \[-180, 180\]

Reject invalid coordinates with HTTP 422.

**20\. Route Planning Engine**

This is the main technical feature of Phase 1.

Do **not** simply connect origin and destination with a straight line.

The engine should represent the ocean as a navigable grid or graph.

**21\. Ocean Grid**

Represent the planning area as a grid.

Example:

+---+---+---+---+---+---+

| | | | X | | |

+---+---+---+---+---+---+

| | | X | X | | |

+---+---+---+---+---+---+

| S | | | | | |

+---+---+---+---+---+---+

| | X | X | | | |

+---+---+---+---+---+---+

| | | | | | G |

+---+---+---+---+---+---+

Where:

S = start

G = goal

X = non-navigable

For the initial implementation, use deterministic simulated obstacles / land masks.

**22\. A\* Algorithm**

Use A\* for route generation.

Each node contains:

latitude

longitude

grid\_x

grid\_y

Cost:

f(n) = g(n) + h(n)

Where:

g(n) = accumulated route cost

h(n) = estimated remaining cost

The initial heuristic can be geographic distance.

**23\. Grid Movement**

Support:

up

down

left

right

Optionally support diagonals.

If diagonals are supported, their cost should be:

straight = 1

diagonal = sqrt(2)

Do not mix these inconsistently.

**24\. Route Generation**

Input:

{

"origin": {

"latitude": 10.0,

"longitude": 70.0

},

"destination": {

"latitude": 12.0,

"longitude": 75.0

}

}

Output should contain:

route ID

coordinates

distance

ETA

fuel

CO₂

cost

risk

optimization score

**25\. Distance Calculation**

Use the Haversine formula for geographic distance.

For coordinates:

(lat1, lon1)

(lat2, lon2)

calculate:

distance\_km

Do not use Euclidean distance directly on latitude/longitude.

**26\. Route Geometry**

The route should be returned as GeoJSON.

Example structure:

{

"type": "LineString",

"coordinates": \[

\[70.0, 10.0\],

\[70.2, 10.1\],

\[70.4, 10.3\]

\]

}

Remember GeoJSON uses:

\[longitude, latitude\]

not:

\[latitude, longitude\]

This distinction should be enforced throughout the codebase.

**27\. Route Metrics**

Every generated route must calculate:

distance

time

fuel

CO₂

cost

risk

environmental impact

Do not allow a route to exist without these metrics.

**28\. Vessel Speed Model**

Initial Phase 1 model:

cruise\_speed = vessel.cruise\_speed\_knots

Travel time:

time\_hours = distance\_nm / speed\_knots

Since:

1 nautical mile = 1.852 km

convert:

distance\_nm = distance\_km / 1.852

**29\. Fuel Consumption Model**

For Phase 1, use a transparent deterministic model.

Example:

fuel\_per\_hour =

base\_consumption

× speed\_factor

× cargo\_factor

Do not hardcode one universal value for every vessel.

Each vessel should have a baseline fuel-consumption parameter.

**30\. Speed/Fuel Relationship**

A more realistic simplified model can use:

speed\_factor = (speed / reference\_speed)^3

because marine resistance generally increases strongly with speed.

For Phase 1 this is a **simulation model**, not a certified ship-performance model.

Document this clearly.

**31\. Cargo Factor**

Use a simple factor:

cargo\_factor =

1 + 0.0005 × cargo\_weight

or another documented bounded model.

The exact constants should live in configuration rather than scattered throughout the code.

For example:

FUEL\_CARGO\_FACTOR\_COEFFICIENT=...

**32\. Fuel Cost**

Create configurable:

fuel\_price\_per\_liter

Then:

fuel\_cost =

fuel\_consumed × fuel\_price

The price must be configurable rather than hardcoded into route logic.

**33\. CO₂ Calculation**

For the simulation:

CO2 = fuel\_consumed × emission\_factor

Store the emission factor in configuration.

Do not claim the resulting number represents a certified emissions measurement.

It is an estimate.

**34\. ETA**

Calculate:

ETA =

current\_time

+

travel\_duration

For simulation scenarios, allow a configurable simulated departure time.

**35\. Route Risk**

Phase 1 should introduce a basic risk score.

Factors:

restricted-zone intersection

obstacle proximity

route complexity

Example:

base risk = 0

restricted zone = +50

high-risk zone = +30

obstacle proximity = +10

Clamp:

0–100

The more advanced environmental and weather risk model comes later.

**36\. Environmental Score**

Phase 1 should establish the interface, not the final environmental intelligence.

For now:

environmental\_score =

weighted combination of:

fuel usage

CO₂

restricted-zone exposure

Later phases can add:

*   marine ecosystems
*   whale activity
*   pollution
*   debris
*   fishing zones

**37\. Multi-Objective Optimization**

The route engine should generate multiple candidates.

For example:

Route A

Shortest

Route B

Fuel efficient

Route C

Low environmental impact

Then calculate:

optimization\_score =

w\_distance × normalized\_distance

+

w\_fuel × normalized\_fuel

+

w\_time × normalized\_time

+

w\_emission × normalized\_emission

+

w\_risk × normalized\_risk

Weights must come from the user's request/configuration.

**38\. Optimization Modes**

Phase 1 should support:

**Fastest**

time = high weight

**Fuel Efficient**

fuel = high weight

**Green**

CO₂ = high weight

environmental = high weight

**Balanced**

Balanced weights.

**39\. User-Configurable Weights**

The UI should expose:

Fuel efficiency

Travel time

Safety

Environmental impact

Cost

Example:

Fuel ████████░░ 40%

Time █████░░░░░ 25%

Safety ████░░░░░░ 20%

Environment███░░░░░░░ 15%

The backend should validate that weights are:

\>= 0

and normalize them to:

sum = 1

**40\. Route Comparison**

The backend should return multiple candidates.

Example:

Route A

Distance: 1,820 km

Fuel: 88,000 L

ETA: 52 h

CO₂: 235 t

Route B

Distance: 1,910 km

Fuel: 76,000 L

ETA: 55 h

CO₂: 203 t

Route C

Distance: 1,850 km

Fuel: 81,000 L

ETA: 53 h

CO₂: 216 t

Then:

Recommended: Route B

because the user's optimization preferences favor fuel/environmental efficiency.

**41\. Explainable Route Recommendation**

Every recommendation must have a machine-readable explanation.

Example:

{

"recommendation": "Route B",

"reasons": \[

"12% lower estimated fuel consumption",

"14% lower estimated CO2 emissions",

"Low restricted-zone exposure"

\],

"tradeoffs": \[

"3 hours longer than the fastest route"

\]

}

This is essential for the later Explainable AI layer.

**42\. Route API**

Implement:

POST /api/v1/routes/optimize

Request:

{

"vessel\_id": 1,

"origin": {

"latitude": 10.0,

"longitude": 70.0

},

"destination": {

"latitude": 12.0,

"longitude": 75.0

},

"optimization": {

"fuel": 0.4,

"time": 0.2,

"safety": 0.2,

"environment": 0.2

}

}

**43\. Route API Response**

Return:

{

"recommended\_route": {},

"alternatives": \[\],

"comparison": {},

"explanation": {}

}

The response should be documented using OpenAPI automatically generated by FastAPI.

**44\. Vessel APIs**

Implement:

GET /api/v1/vessels

GET /api/v1/vessels/{id}

POST /api/v1/vessels

PATCH /api/v1/vessels/{id}

Phase 1 does not need unrestricted vessel deletion.

**45\. Port APIs**

Implement:

GET /api/v1/ports

GET /api/v1/ports/{id}

Optional:

GET /api/v1/ports/nearest

**46\. Marine Zone APIs**

Implement:

GET /api/v1/zones

GET /api/v1/zones/{id}

Filter by:

zone\_type

**47\. Voyage APIs**

Implement:

POST /api/v1/voyages

GET /api/v1/voyages

GET /api/v1/voyages/{id}

PATCH /api/v1/voyages/{id}

**48\. Health API**

Implement:

GET /health

Response:

{

"status": "ok",

"database": "healthy",

"redis": "healthy"

}

**49\. Frontend Command Center**

The first screen should be the **Maritime Command Center**.

Layout:

┌─────────────────────────────────────────────────────────┐

│ OceanSentinel ● System Online │

├──────────────┬───────────────────────────────┬──────────┤

│ │ │ │

│ CONTROLS │ OCEAN MAP │ METRICS │

│ │ │ │

│ Vessel │ 🚢 │ Fuel │

│ Origin │ ─────────→ │ CO₂ │

│ Destination │ │ ETA │

│ Objective │ │ Distance │

│ │ │ │

├──────────────┴───────────────────────────────┴──────────┤

│ ROUTE COMPARISON │

└─────────────────────────────────────────────────────────┘

**50\. Map**

Map must support:

*   Zoom
*   Pan
*   Vessel markers
*   Origin marker
*   Destination marker
*   Route line
*   Alternative routes
*   Marine zones

Clicking a vessel should open:

Vessel name

Type

Speed

Fuel

Location

Status

**51\. Route Planner Panel**

Controls:

Vessel:

\[ MV Ocean Star ▼ \]

Origin:

\[ Select on map \]

Destination:

\[ Select on map \]

Optimization:

○ Fastest

○ Fuel Efficient

○ Green

● Balanced

\[ OPTIMIZE ROUTE \]

**52\. Origin/Destination Selection**

Support two mechanisms:

**Option 1**

Select from predefined ports.

**Option 2**

Click the map.

For Phase 1, both should be supported if feasible.

When clicked:

Origin selected

Lat: ...

Lon: ...

**53\. Route Visualization**

Display:

Recommended route

Alternative 1

Alternative 2

The recommended route should visually stand out.

Clicking an alternative should update the metric panel.

**54\. Metrics Panel**

Show:

DISTANCE

1,850 km

ETA

53h 20m

FUEL

81,240 L

CO₂

216 t

COST

$...

RISK

Low

FUEL SAVED

6,200 L

**55\. Route Comparison Table**

Frontend:

| Route | Distance | Fuel | ETA | CO₂ | Score |
| --- | --- | --- | --- | --- | --- |
| Fastest | ... | ... | ... | ... | ... |
| Fuel Efficient | ... | ... | ... | ... | ... |
| Green | ... | ... | ... | ... | ... |
| Recommended | ... | ... | ... | ... | ... |

**56\. Explanation Panel**

Display:

WHY THIS ROUTE?

✓ 12% lower fuel consumption

✓ 14% lower CO₂ emissions

✓ Avoids restricted zones

✓ Acceptable travel-time increase

TRADEOFF

+3 hours compared with fastest route

This will make the system feel significantly more intelligent.

**57\. Frontend State Management**

Use Zustand for:

selectedVessel

origin

destination

optimizationWeights

selectedRoute

mapViewport

Use TanStack Query for server data:

vessels

ports

zones

routes

voyages

Do not store all backend data redundantly in Zustand.

**58\. Backend Service Separation**

Do not put everything in the FastAPI route handlers.

Bad:

@app.post("/routes")

def optimize():

\# 500 lines

Instead:

API

↓

Route Service

↓

Optimizer

↓

Routing Engine

↓

Fuel Model

↓

Emission Model

**59\. Service Architecture**

Use:

services/

│

├── routing/

│ ├── astar.py

│ ├── grid.py

│ ├── geometry.py

│ └── service.py

│

├── fuel/

│ ├── model.py

│ └── service.py

│

├── emissions/

│ ├── model.py

│ └── service.py

│

├── eta/

│ └── service.py

│

└── optimization/

├── scoring.py

├── weights.py

└── service.py

**60\. Configuration**

Put tunable constants in configuration.

For example:

REFERENCE\_SPEED

FUEL\_PRICE

CO2\_EMISSION\_FACTOR

GRID\_RESOLUTION

MAX\_ROUTE\_CANDIDATES

RISK\_WEIGHTS

Do not scatter constants across source files.

**61\. Logging**

Every route optimization request should log:

request ID

vessel

origin

destination

optimization mode

execution time

candidate count

selected route

Example:

\[INFO\]

Route optimization completed

request=abc123

vessel=17

candidates=4

duration=182ms

Never log secrets.

**62\. Error Handling**

Implement consistent errors.

Example:

{

"error": {

"code": "NO\_ROUTE\_FOUND",

"message": "No navigable route exists between the specified points."

}

}

Other errors:

INVALID\_COORDINATES

VESSEL\_NOT\_FOUND

INVALID\_WEIGHTS

NO\_ROUTE\_FOUND

INVALID\_ZONE

ROUTE\_OPTIMIZATION\_FAILED

**63\. Caching**

Route calculations can be expensive.

Create a deterministic cache key:

vessel

origin

destination

optimization weights

grid version

Example conceptual key:

route:vessel17:origin...:destination...:weights...

Store result in Redis.

**64\. Cache Invalidation**

The cache should be invalidated if:

*   Grid changes
*   Marine zones change
*   Vessel parameters change
*   Optimization configuration changes

For Phase 1, a GRID\_VERSION configuration value can be used.

**65\. Simulation Layer**

Phase 1 needs a basic simulation engine.

It should generate:

vessel positions

static ocean environment

static marine zones

Do not implement complex autonomous behavior yet.

**66\. Demo Scenario**

Create one deterministic flagship scenario.

Example:

Vessel:

MV Ocean Star

Origin:

Port A

Destination:

Port B

Conditions:

Normal

Objective:

Fuel Efficient

The expected flow:

Select vessel

↓

Select origin

↓

Select destination

↓

Select Fuel Efficient

↓

Optimize

↓

Generate 3 routes

↓

Calculate metrics

↓

Select best route

↓

Display explanation

This must work reliably every time.

**67\. Route Replay**

Phase 1 can include a basic route replay.

After route generation:

\[▶ PLAY ROUTE\]

Vessel marker moves along the generated route.

Display:

Current position

Distance travelled

Distance remaining

Estimated arrival

Fuel remaining

This is optional but highly valuable for the demo.

**68\. Voyage Simulation**

Create a simple time-step simulation.

Each tick:

position += movement

fuel -= consumption

distance\_remaining -= movement

The system updates:

ETA

fuel

position

status

Later phases can connect this simulation to weather, dark vessels, and cleanup robots.

**69\. Phase 1 Database Relationships**

Conceptually:

VESSEL

│

│ 1:N

▼

VOYAGE

│

│ N:1

▼

ROUTE

│

│ 1:N

▼

ROUTE SEGMENTS

PORT ────────► VOYAGE

MARINE ZONE

│

└──── intersects ──── ROUTE

**70\. Phase 1 Testing**

Testing is mandatory.

**Unit Test: Haversine**

Test:

same coordinate → 0 km

known coordinate pair → expected approximate distance

**Unit Test: Fuel**

Given:

distance

speed

vessel

cargo

ensure:

fuel > 0

and increasing distance does not decrease fuel.

**Unit Test: ETA**

Increasing distance must increase travel time if speed remains constant.

**Unit Test: A\***

Test:

start

goal

obstacles

Expected:

valid route

**Unit Test: No Route**

Create a completely enclosed destination.

Expected:

NO\_ROUTE\_FOUND

**71\. Optimization Tests**

Given fixed candidates:

A = fastest

B = lowest fuel

C = lowest CO₂

verify that changing weights changes the selected route appropriately.

For example:

time weight high

→ A

fuel weight high

→ B

CO₂ weight high

→ C

**72\. API Tests**

Test:

GET /health

GET /vessels

GET /ports

GET /zones

POST /routes/optimize

POST /voyages

Also test invalid input.

**73\. Frontend Tests**

Test:

*   vessel selection
*   origin selection
*   destination selection
*   optimization mode
*   route rendering
*   metric updates
*   alternative route selection
*   API failure state
*   loading state

**74\. End-to-End Test**

One complete automated scenario:

Open dashboard

↓

Select vessel

↓

Select origin

↓

Select destination

↓

Select fuel optimization

↓

Click Optimize

↓

Route appears

↓

Metrics appear

↓

Explanation appears

This is the most important Phase 1 test.

**75\. Documentation**

Developer must produce:

**README.md**

Include:

Project overview

Architecture

Installation

Environment variables

Running locally

Testing

API

Database

**docs/architecture.md**

Include:

system architecture

data flow

component relationships

**docs/routing.md**

Explain:

grid

A\*

distance

fuel

optimization

**docs/database.md**

Document:

tables

relationships

spatial fields

indexes

**docs/api.md**

Document API endpoints.

**76\. Database Indexes**

Create indexes for frequently queried fields.

Especially:

vessel\_identifier

vessel position

port location

marine zone geometry

route geometry

voyage vessel\_id

Use PostGIS spatial indexes where appropriate.

**77\. API Validation**

Pydantic schemas should enforce:

latitude range

longitude range

positive distance

positive vessel parameters

weights >= 0

Don't rely on frontend validation alone.

**78\. Security Requirements**

Even in Phase 1:

*   CORS configuration
*   environment variables
*   input validation
*   request limits
*   no secrets in Git
*   database credentials outside source code

Authentication can be introduced later if time is limited.

**79\. Performance Requirements**

Target reasonable local performance.

For the standard demo scenario:

Route calculation:

< 1 second preferred

API response:

< 2 seconds preferred

Frontend should remain responsive during calculation.

If optimization becomes expensive, execute it asynchronously.

**80\. Phase 1 Agent Architecture**

Although the complete autonomous agent system comes later, Phase 1 should establish the interfaces.

Create conceptual agents/services:

Maritime Commander

│

└── Shipping Agent

│

├── Routing Engine

├── Fuel Engine

├── Emission Engine

└── ETA Engine

Initially the Maritime Commander can be a deterministic orchestrator.

Do **not** require an LLM for Phase 1.

This is intentional.

**81\. Shipping Agent**

Define an interface like:

optimize\_voyage(request)

Internally:

validate request

↓

load vessel

↓

generate candidate routes

↓

calculate metrics

↓

score candidates

↓

select route

↓

generate explanation

This interface can later become an actual LangGraph agent node.

**82\. Why Not Use an LLM Yet?**

The first phase should establish reliable deterministic infrastructure.

For example:

A\* → exact path

Fuel model → deterministic calculation

CO₂ → deterministic calculation

PostGIS → spatial query

An LLM is not appropriate for calculating these values.

Later:

LLM

↓

Commander

↓

Shipping Agent

↓

Deterministic tools

This gives you a much stronger architecture.

**83\. Phase 1 Event Definitions**

Create event schemas even if most are not yet active.

For example:

ROUTE\_OPTIMIZATION\_REQUESTED

ROUTE\_OPTIMIZATION\_COMPLETED

VOYAGE\_CREATED

VOYAGE\_STARTED

VOYAGE\_COMPLETED

ROUTE\_RECALCULATION\_REQUIRED

Later phases can add:

STORM\_DETECTED

AIS\_SIGNAL\_LOST

DARK\_VESSEL\_DETECTED

DEBRIS\_DETECTED

CLEANUP\_MISSION\_CREATED

**84\. Event Schema**

Use a standard format:

{

"event\_id": "...",

"event\_type": "ROUTE\_OPTIMIZATION\_COMPLETED",

"timestamp": "...",

"source": "shipping\_agent",

"entity\_type": "route",

"entity\_id": "...",

"payload": {}

}

This becomes the foundation for future multi-agent communication.

**85\. Observability**

Track:

API latency

route calculation time

database query time

cache hit rate

optimization count

optimization failures

Dashboard can later expose:

Routes optimized today

Fuel saved

CO₂ avoided

Average optimization time

**86\. Phase 1 Analytics**

Create basic aggregate calculations:

Total voyages

Total distance

Total fuel consumed

Total fuel saved

Total CO₂

Average ETA

Dashboard cards:

12 Voyages

18,240 km

742,000 L Fuel

42,800 kg CO₂

**87\. Definition of "Fuel Saved"**

Do not display "fuel saved" without a baseline.

Use:

fuel\_saved =

baseline\_route\_fuel

\-

optimized\_route\_fuel

The baseline should be clearly defined.

For example:

Baseline = fastest route

Then:

Optimized = fuel-efficient route

**88\. Definition of "CO₂ Avoided"**

Similarly:

co2\_avoided =

baseline\_CO2

\-

optimized\_CO2

Always identify the baseline in the UI.

**89\. Important Data Integrity Rules**

The system must guarantee:

**Coordinates**

Always validate.

**Units**

Clearly define:

distance → km

speed → knots

fuel → liters

CO₂ → kg

time → hours

**Currency**

Use configurable currency and price assumptions.

**GeoJSON**

Always:

longitude, latitude

**Database**

Use UTC timestamps.

**90\. Phase 1 UI Error States**

Every major operation needs:

**Loading**

Optimizing maritime route...

**Success**

Route optimization complete

**Error**

Unable to generate route.

No navigable path was found.

**Empty**

No vessels available.

**91\. Phase 1 Developer Sequence**

The developer should implement Phase 1 in this order.

**Step 1 — Repository**

Create:

oceansentinel/

Set up:

*   Git
*   README
*   .gitignore
*   .env.example

**Step 2 — Docker**

Create:

docker-compose.yml

Run:

PostgreSQL

PostGIS

Redis

Verify connectivity.

**Step 3 — Backend Bootstrap**

Create FastAPI application.

Verify:

GET /health

returns success.

**Step 4 — Database**

Configure:

SQLAlchemy

GeoAlchemy2

Alembic

Create migrations.

**Step 5 — Core Models**

Implement:

Vessel

Port

MarineZone

Route

RouteSegment

Voyage

**Step 6 — Seed Data**

Insert deterministic:

vessels

ports

zones

Verify spatial queries.

**Step 7 — Routing Engine**

Implement:

grid

obstacle map

A\*

path reconstruction

coordinate conversion

Test independently.

**Step 8 — Geographic Calculations**

Implement:

Haversine

nautical-mile conversion

route distance

**Step 9 — Fuel Model**

Implement:

fuel consumption

speed factor

cargo factor

fuel cost

**Step 10 — Emissions**

Implement:

CO₂

**Step 11 — ETA**

Implement:

route duration

ETA

**Step 12 — Optimization**

Implement:

candidate routes

normalization

weighted scoring

recommendation

**Step 13 — Explanation**

Generate structured reasons:

positive factors

tradeoffs

metrics

**Step 14 — APIs**

Expose:

vessels

ports

zones

routes

voyages

**Step 15 — Redis**

Add route-result caching.

**Step 16 — Frontend Bootstrap**

Create:

React + TypeScript + Vite

**Step 17 — Map**

Implement:

MapLibre

vessel markers

ports

zones

**Step 18 — Route Planner**

Implement:

vessel selector

origin

destination

optimization mode

**Step 19 — Route Visualization**

Display:

recommended route

alternative routes

**Step 20 — Metrics**

Display:

fuel

CO₂

distance

ETA

cost

risk

**Step 21 — Explanation**

Display:

Why this route?

Tradeoffs

Savings

**Step 22 — Voyage Simulation**

Implement basic route playback.

**Step 23 — Analytics**

Implement basic project-level metrics.

**Step 24 — Testing**

Run:

unit

integration

API

frontend

E2E

**Step 25 — Documentation**

Complete:

README

architecture

database

routing

API

**92\. Phase 1 Final User Flow**

The final demo should work exactly like this:

USER OPENS OCEANSENTINEL

│

▼

COMMAND CENTER

│

▼

Select MV Ocean Star

│

▼

Select Origin

│

▼

Select Destination

│

▼

Select Objective

│

▼

Click OPTIMIZE

│

▼

Shipping Agent

│

▼

Generate routes

│

▼

Calculate:

├── Distance

├── Fuel

├── ETA

├── CO₂

├── Cost

└── Risk

│

▼

Score routes

│

▼

Select best route

│

▼

Show explanation

│

▼

USER SEES

│

┌──────┼──────┐

▼ ▼ ▼

MAP METRICS WHY

│ │ │

▼ ▼ ▼

Route Fuel Reasons

CO₂ Tradeoffs

ETA Savings

**93\. Phase 1 Completion Criteria**

Phase 1 is **not complete** merely because the backend works.

It is complete only when all of the following work together:

**Infrastructure**

*   Docker starts successfully.
*   PostgreSQL/PostGIS works.
*   Redis works.
*   Backend starts.
*   Frontend starts.

**Data**

*   Vessels exist.
*   Ports exist.
*   Marine zones exist.
*   Spatial queries work.

**Routing**

*   A\* generates valid paths.
*   Obstacles are avoided.
*   Distance is calculated correctly.
*   Multiple candidate routes can be generated.

**Optimization**

*   Fuel is calculated.
*   ETA is calculated.
*   CO₂ is calculated.
*   Cost is calculated.
*   Risk is calculated.
*   Weighted optimization works.
*   Recommendation changes when weights change.

**Frontend**

*   Map works.
*   Vessel selection works.
*   Origin/destination selection works.
*   Optimization works.
*   Route appears.
*   Alternatives appear.
*   Metrics appear.
*   Explanation appears.

**Persistence**

*   Route is stored.
*   Voyage can be created.
*   Voyage can be retrieved.

**Reliability**

*   Invalid inputs are rejected.
*   No-route conditions are handled.
*   API errors are handled.
*   Tests pass.

**Demonstration**

A developer can start the project with documented commands and reproduce the complete demo without manually modifying source code.

**94\. What Phase 1 Should NOT Implement**

To prevent scope creep, explicitly defer:

❌ Dark-vessel ML detection

❌ AIS anomaly detection

❌ Satellite computer vision

❌ Illegal fishing classification

❌ Debris image detection

❌ Autonomous cleanup robots

❌ Debris trajectory ML

❌ Oil-spill computer vision

❌ Full weather integration

❌ Real-time ocean currents

❌ Predictive maintenance ML

❌ Smart-port optimization

❌ Full LLM agent autonomy

❌ Production-grade vessel tracking

However, Phase 1 **must create interfaces and data structures that make these possible later**.

**95\. Phase 1 → Phase 2 Handoff**

At the end of Phase 1, the following interfaces should be ready for Phase 2:

PHASE 1

│

┌────────────┼────────────┐

▼ ▼ ▼

Route API Vessel API Geo API

│ │ │

└────────────┼────────────┘

▼

Event System

│

▼

PHASE 2

│

Weather Agent

│

Ocean Current

│

Dynamic Routing

Phase 2 can therefore add environmental intelligence without rewriting the foundation.

**96\. Phase 1 Success Demonstration**

The ideal final demonstration is approximately:

**0:00**

Open OceanSentinel.

**0:20**

Show global maritime map and vessels.

**0:40**

Select a vessel.

**1:00**

Select origin and destination.

**1:20**

Select **Fuel Efficient**.

**1:30**

Click **Optimize**.

**1:31–2:00**

System generates several candidate routes.

**2:00**

Display:

Recommended Route

Fuel: 76,240 L

CO₂: 203,100 kg

ETA: 55h

Distance: 1,910 km

Fuel saved: 12,000 L

CO₂ saved: 32,000 kg

**2:20**

Show explanation:

Route B was selected because it reduces estimated fuel consumption and CO₂ emissions while avoiding restricted marine zones. The tradeoff is a longer ETA.

**2:40**

Play the vessel moving along the route.

**3:00**

Show the architecture:

Dashboard

↓

FastAPI

↓

Shipping Agent

↓

A\*

↓

Fuel / CO₂ / ETA

↓

Optimization

↓

PostGIS

At that point, **Phase 1 is a complete vertical slice**, rather than merely a collection of unfinished backend components.

**97\. Phase 1 Architecture After Completion**

The target implementation should look like:

┌───────────────────────┐

│ USER │

└───────────┬───────────┘

│

▼

┌───────────────────────┐

│ REACT COMMAND │

│ CENTER │

│ │

│ MapLibre │

│ Route Planner │

│ Metrics │

│ Analytics │

└───────────┬───────────┘

│

REST / JSON

│

▼

┌───────────────────────┐

│ FASTAPI │

│ BACKEND │

└───────────┬───────────┘

│

┌───────────────────┼───────────────────┐

│ │ │

▼ ▼ ▼

┌────────────┐ ┌────────────┐ ┌────────────┐

│ Vessel │ │ Route │ │ Voyage │

│ Service │ │ Service │ │ Service │

└────────────┘ └─────┬──────┘ └────────────┘

│

▼

┌─────────────────┐

│ Shipping Agent │

└────────┬────────┘

│

┌───────────────┼───────────────┐

▼ ▼ ▼

┌────────┐ ┌────────┐ ┌──────────┐

│ A\* │ │ Fuel │ │ Emission │

│ Engine │ │ Model │ │ Model │

└────┬───┘ └────┬───┘ └────┬─────┘

│ │ │

└───────────────┼───────────────┘

▼

┌──────────────┐

│ Optimization │

│ Engine │

└──────┬───────┘

│

┌───────────┴───────────┐

▼ ▼

┌──────────────┐ ┌──────────────┐

│ PostgreSQL │ │ Redis │

│ + PostGIS │ │ Cache │

└──────────────┘ └──────────────┘

**98\. The Most Important Principle for the Developer**

Build **Phase 1 as a vertical slice**, not as isolated tasks.

The developer should be able to demonstrate:

Database

↓

Backend

↓

Routing

↓

Optimization

↓

API

↓

Frontend

↓

Map

↓

User

from beginning to end.

**Phase 2 of 4 — Environmental Intelligence, Dynamic Routing & Maritime Risk Detection**

Phase 2 takes the Phase 1 system from **static route optimization** to an **environment-aware maritime intelligence platform**.

The core objective is:

**Continuously monitor environmental conditions and vessel context, detect route risks, and dynamically re-optimize voyages when conditions change.**

Phase 2 should introduce the first real autonomous-agent behavior.

**1\. Phase 2 Goal**

At the end of Phase 2, the system should be able to:

MARITIME COMMAND CENTER

│

▼

Maritime Commander

│

┌───────────────┼────────────────┐

▼ ▼ ▼

Weather Agent Ocean Agent Risk Agent

│ │ │

└───────────────┼────────────────┘

▼

Dynamic Route Engine

│

▼

Route Optimizer

│

▼

Updated Voyage

The system should no longer assume:

"The route calculated at departure remains optimal."

Instead:

"The route is continuously evaluated against changing environmental conditions."

**2\. Phase 2 Deliverables**

**Environmental intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather data ingestion
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Wind information
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Wave information
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Visibility
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Storm information
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean-current information
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Sea-state classification
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental risk scoring

**Dynamic routing**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather-aware routing
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Current-aware routing
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dynamic route costs
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route recalculation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route deviation detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route recommendation updates

**Maritime risk**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel risk score
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental risk
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route risk
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Storm proximity
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dangerous sea-state detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Restricted-zone proximity
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Anomaly event framework

**Autonomous agents**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Maritime Commander
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean Conditions Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route Optimization Agent

**Real-time infrastructure**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Event bus
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Background workers
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Scheduled data ingestion
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Redis streams/pub-sub or equivalent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Event persistence
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent communication

**Dashboard**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Live weather overlay
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Current overlay
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk heatmap
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Storm visualization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dynamic route updates
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Alerts
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent activity panel
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route-change explanations

**3\. What Phase 2 Builds on From Phase 1**

Phase 1 already provides:

Vessel

Port

Marine Zone

Route

Route Segment

Voyage

PostGIS

Redis

A\*

Fuel model

CO₂ model

ETA

Optimization

React dashboard

Map

Shipping Agent

Phase 2 should **extend these components rather than replace them**.

**4\. Phase 2 Architecture**

Target architecture:

USER

│

▼

┌─────────────────────┐

│ COMMAND CENTER │

│ React │

└──────────┬──────────┘

│

▼

┌───────────────────┐

│ API Gateway │

│ FastAPI │

└─────────┬─────────┘

│

┌────────────┼────────────┐

│ │ │

▼ ▼ ▼

┌──────────┐ ┌──────────┐ ┌──────────┐

│ Weather │ │ Ocean │ │ Risk │

│ Agent │ │ Agent │ │ Agent │

└────┬─────┘ └────┬─────┘ └────┬─────┘

│ │ │

└────────────┼────────────┘

▼

┌───────────────┐

│ Event System │

└───────┬───────┘

│

▼

┌──────────────────┐

│ Maritime │

│ Commander │

└────────┬─────────┘

│

▼

┌──────────────────┐

│ Dynamic Routing │

│ Engine │

└────────┬─────────┘

│

┌──────────┼──────────┐

▼ ▼ ▼

A\* Engine Fuel Risk Cost

│ │ │

└──────────┼──────────┘

▼

Best Route

│

▼

Voyage Update

**5\. New Technology Requirements**

Keep the Phase 1 stack.

Add:

Celery or ARQ

Redis Streams

httpx

NumPy

Pandas

Shapely

GeoJSON

For an AI-agent implementation, optionally add:

LangGraph

The important point is that the agents should use **deterministic tools** for numerical calculations.

**6\. External Data Layer**

Phase 2 needs environmental data.

The architecture should not directly couple agents to a particular provider.

Create:

Data Provider

↓

Normalizer

↓

Environmental Data Model

↓

Database / Cache

↓

Agents

This means the project can change providers without rewriting the agents.

**7\. Environmental Data Interface**

Create a generic interface:

EnvironmentalProvider

with operations conceptually equivalent to:

get\_weather(lat, lon, timestamp)

get\_wave\_conditions(lat, lon, timestamp)

get\_ocean\_current(lat, lon, timestamp)

get\_storms(area, time\_range)

The provider implementation can initially use:

*   a public weather/ocean API,
*   a simulated provider,
*   or a combination.

**8\. Important Rule: Real Data + Simulation**

The system should support two modes.

**Real mode**

External APIs

↓

Environmental Provider

**Simulation mode**

Synthetic Environment

↓

Environmental Provider

Both must expose the same interface.

This is extremely useful for the hackathon because you can demonstrate controlled scenarios such as:

"A storm appears directly on the current route."

**9\. Environmental Data Model**

Create:

EnvironmentalObservation

Fields:

id

timestamp

latitude

longitude

wind\_speed

wind\_direction

wave\_height

wave\_period

visibility

current\_speed

current\_direction

sea\_state

source

created\_at

**10\. Weather Model**

Store at least:

wind\_speed

wind\_direction

temperature

pressure

visibility

precipitation

weather\_condition

timestamp

Units must be standardized.

For example:

wind\_speed → m/s

wave\_height → meters

visibility → meters

temperature → Celsius

pressure → hPa

**11\. Ocean Current Model**

Store:

current\_speed

current\_direction

timestamp

latitude

longitude

Current direction should be explicitly defined as either:

direction the current is moving toward

or:

direction the current is coming from

Pick one convention and use it everywhere.

For route calculations, **toward-direction** is easier to reason about.

**12\. Storm Model**

Create:

Storm

Fields:

id

name

storm\_type

severity

center\_latitude

center\_longitude

radius\_km

wind\_speed

movement\_direction

movement\_speed

forecast\_time

source

Example:

Storm:

SEVERE\_STORM\_01

Severity:

HIGH

Radius:

180 km

Wind:

28 m/s

**13\. Sea State**

Create a normalized sea-state value:

0 = calm

1 = slight

2 = moderate

3 = rough

4 = very rough

5 = dangerous

The system can calculate this from wave conditions.

**14\. Environmental Grid**

Phase 1 had:

navigable

non-navigable

Phase 2 extends each grid cell:

Grid Cell

│

├── navigable

├── weather

├── wave

├── current

├── storm

├── environmental risk

└── routing cost

Conceptually:

┌────┬────┬────┬────┬────┐

│ 12 │ 14 │ 18 │ 60 │ 72 │

├────┼────┼────┼────┼────┤

│ 10 │ 13 │ 30 │ 75 │ 80 │

├────┼────┼────┼────┼────┤

│ 8 │ 11 │ 20 │ 40 │ 55 │

└────┴────┴────┴────┴────┘

Values represent route cost/risk.

**15\. Dynamic Route Cost**

Phase 1:

cost =

distance

Phase 2:

cost =

distance

\+ weather\_cost

\+ current\_cost

\+ wave\_cost

\+ storm\_cost

\+ risk\_cost

This is the major upgrade.

**16\. Wind Cost**

Wind should affect:

*   fuel consumption
*   vessel speed
*   risk

For Phase 2, implement a simplified model.

For example:

headwind

→ higher fuel consumption

tailwind

→ lower effective fuel consumption

The implementation should calculate the angle between:

vessel heading

and:

wind direction

**17\. Current Effect**

Ocean current should modify effective vessel speed.

Simplified:

effective\_speed =

vessel\_speed

+

current\_component\_along\_route

Where:

current\_component =

current\_speed × cos(relative\_angle)

Clamp the result to prevent physically impossible values.

For example:

minimum effective speed > 0

**18\. Wave Effect**

Higher waves should increase:

fuel consumption

travel time

risk

A simple normalized model can be used:

wave\_factor =

1 + wave\_height × WAVE\_COEFFICIENT

Keep the coefficient configurable.

**19\. Storm Penalty**

A route entering a storm region should receive a major penalty.

For example:

outside storm:

0

storm edge:

+100

storm core:

+1000

The actual numbers should be configuration values.

**20\. Storm Avoidance**

The routing engine must prefer routes that avoid storms.

Example:

START

│

├───────────────┐

│ │

│ STORM │

│ XXXXX │

│ XXXXX │

│ │

└───────────────┘

│

END

The dynamic route should go around the storm.

**21\. Dynamic Re-routing**

This is one of the most important Phase 2 features.

Suppose:

09:00

Route A selected

At:

12:00

a storm develops.

The system detects:

current route intersects storm

and triggers:

ROUTE\_RECALCULATION\_REQUIRED

Then:

Weather Agent

↓

Risk Agent

↓

Commander

↓

Routing Agent

↓

New route

**22\. Route Recalculation Trigger**

Do not continuously recalculate every second.

Trigger when one of these occurs:

storm detected

risk exceeds threshold

major weather change

current changes significantly

route becomes unsafe

route efficiency decreases significantly

**23\. Re-routing Thresholds**

Configuration:

RISK\_RECALCULATION\_THRESHOLD

WEATHER\_CHANGE\_THRESHOLD

CURRENT\_CHANGE\_THRESHOLD

MINIMUM\_ROUTE\_IMPROVEMENT

Example logic:

if new\_risk > threshold:

recalculate

and:

if new\_route\_score < current\_route\_score × improvement\_threshold:

switch route

**24\. Avoid Route Oscillation**

A dangerous implementation would be:

Route A

→ B

→ A

→ B

→ A

because environmental values fluctuate.

Implement:

minimum route commitment time

and:

minimum improvement required

before changing routes.

For example:

New route must be at least 10% better

and:

route cannot change more than once every X minutes

These values must be configurable.

**25\. Weather Agent**

The Weather Agent should:

retrieve weather

normalize weather

store observations

detect severe weather

publish weather events

Architecture:

Weather API

↓

Weather Provider

↓

Normalizer

↓

Weather Agent

↓

Event Bus

**26\. Ocean Conditions Agent**

Responsibilities:

retrieve currents

retrieve wave conditions

normalize data

calculate sea state

publish ocean-condition events

**27\. Risk Agent**

The Risk Agent combines:

weather

waves

currents

storms

marine zones

vessel characteristics

and generates:

risk\_score

between:

0–100

**28\. Risk Classification**

Use:

0–20 LOW

21–40 MODERATE

41–60 ELEVATED

61–80 HIGH

81–100 CRITICAL

The exact thresholds should be configuration.

**29\. Risk Factors**

Phase 2 risk model:

storm proximity

wind

wave height

visibility

current strength

restricted zones

vessel characteristics

For example:

risk =

storm\_risk

\+ wave\_risk

\+ wind\_risk

\+ visibility\_risk

\+ current\_risk

\+ zone\_risk

Normalize to 0–100.

**30\. Vessel-Specific Risk**

Different vessels should react differently.

For example:

small research vessel

could have greater sensitivity to:

high waves

while:

large tanker

might have different constraints.

Therefore add:

vessel.weather\_tolerance

vessel.wave\_tolerance

vessel.wind\_tolerance

or a vessel-class configuration.

**31\. Maritime Commander**

Phase 2 introduces the central autonomous coordinator.

Conceptually:

COMMANDER

│

┌──────────────┼───────────────┐

▼ ▼ ▼

Weather Ocean Risk

Agent Agent Agent

│ │ │

└──────────────┼───────────────┘

▼

Route Agent

The Commander should not perform every calculation itself.

It coordinates specialist agents.

**32\. Agent Responsibilities**

| Agent | Responsibility |
| --- | --- |
| Commander | Coordination |
| Weather Agent | Weather |
| Ocean Agent | Current/waves |
| Risk Agent | Safety |
| Route Agent | Routing |
| Fuel Engine | Fuel calculations |
| Emission Engine | CO₂ |

**33\. Agent Communication**

Use structured events.

Example:

{

"event\_type": "STORM\_DETECTED",

"source": "weather\_agent",

"timestamp": "...",

"payload": {

"storm\_id": 12,

"severity": "HIGH",

"affected\_area\_km": 180

}

}

**34\. Event Bus**

Use Redis Streams or another lightweight event mechanism.

Streams:

weather.events

ocean.events

risk.events

routing.events

voyage.events

agent.events

**35\. Event Lifecycle**

Example:

Weather Agent

│

▼

STORM\_DETECTED

│

▼

Risk Agent

│

▼

ROUTE\_AT\_RISK

│

▼

Commander

│

▼

RECALCULATE\_ROUTE

│

▼

Route Agent

│

▼

NEW\_ROUTE\_AVAILABLE

│

▼

Commander

│

▼

UPDATE\_VOYAGE

This is the first real autonomous loop in the project.

**36\. Agent State**

Each agent should maintain minimal state.

Example:

agent\_id

status

last\_run

last\_event

last\_error

Agent statuses:

idle

running

waiting

error

disabled

**37\. Agent Activity Dashboard**

Add:

AGENT ACTIVITY

────────────────────

● Weather Agent

Updated 20 sec ago

● Ocean Agent

Updated 31 sec ago

● Risk Agent

Analyzing Route 103

● Routing Agent

Recalculating...

● Commander

Coordinating response

This is extremely valuable during a hackathon demo because judges can **see autonomy happening**.

**38\. Alerts**

Create an alert system.

Alert fields:

id

type

severity

message

latitude

longitude

vessel\_id

route\_id

created\_at

resolved\_at

status

Alert types:

STORM\_WARNING

HIGH\_WAVE

HIGH\_WIND

LOW\_VISIBILITY

HIGH\_RISK

ROUTE\_DEVIATION

ROUTE\_RECALCULATED

**39\. Alert Severity**

Use:

INFO

WARNING

HIGH

CRITICAL

**40\. Dashboard Alerts**

Add a panel:

┌──────────────────────────────────┐

│ ALERTS │

├──────────────────────────────────┤

│ 🔴 HIGH │

│ Storm approaching Route 103 │

│ │

│ 🟠 WARNING │

│ Wave height increasing │

│ │

│ 🟢 INFO │

│ Route successfully recalculated │

└──────────────────────────────────┘

**41\. Weather Map Layer**

Add toggle:

☑ Weather

☑ Wind

☑ Waves

☑ Currents

☑ Storms

☑ Risk

Each layer can be independently enabled/disabled.

**42\. Wind Visualization**

Show wind vectors/arrows.

Conceptually:

→ → → → →

↗ ↗ ↗ ↗

🚢

The arrows represent:

wind direction

wind strength

**43\. Current Visualization**

Similarly:

→→→→→

→→→→→

→→→→→

Use line/vector visualization.

**44\. Risk Heatmap**

Map should display:

LOW

MODERATE

HIGH

CRITICAL

using a continuous risk surface.

The map should allow:

Risk layer ON/OFF

**45\. Storm Visualization**

Display:

Storm center

Storm radius

Storm severity

Storm movement

Example:

↗

┌───────────┐

/ \\

| ● |

\\ /

└───────────┘

↗

**46\. Dynamic Route UI**

When the route changes:

CURRENT ROUTE

────────────────

Route A

⚠ Risk increasing

\[ RECOMMENDING NEW ROUTE \]

Then:

NEW ROUTE

────────────────

Route B

Risk: LOW

Fuel: -7%

ETA: +1h 10m

\[ ACCEPT \]

\[ VIEW DETAILS \]

For the autonomous demo, the system can automatically accept when configured for autonomous mode.

**47\. Route Change Explanation**

Every automatic route change should explain:

WHY WAS THE ROUTE CHANGED?

⚠ Severe storm detected

⚠ Current route enters storm radius

✓ New route reduces risk by 63%

Tradeoff:

+1h 12m travel time

+3.4% fuel

This is critical.

Never silently change the route.

**48\. Autonomous Modes**

Add three operating modes.

**Advisory**

Agent recommends.

Human approves

**Semi-autonomous**

Agent recommends and waits for approval.

**Autonomous**

Agent changes route automatically if safety threshold is exceeded.

UI:

MODE

○ Advisory

● Semi-Autonomous

○ Autonomous

**49\. Human Override**

Always support:

\[ OVERRIDE ROUTE \]

Human can reject autonomous route changes.

Record:

override\_reason

user

timestamp

previous\_route

new\_route

This establishes human-in-the-loop control.

**50\. Route Versioning**

Every recalculation creates a route version.

Example:

Voyage 17

Route v1

09:00

Initial route

Route v2

13:40

Storm avoidance

Route v3

18:10

Current optimization

Database:

route

route\_version

parent\_route\_id

change\_reason

**51\. Voyage Timeline**

Frontend should display:

VOYAGE TIMELINE

09:00 Voyage started

09:05 Route optimized

12:30 Weather changed

12:32 Risk increased

12:34 Storm detected

12:36 Route recalculation

12:37 New route selected

This creates a strong demonstration of autonomous decision-making.

**52\. Dynamic Fuel Calculation**

Phase 1 assumes:

constant conditions

Phase 2:

fuel =

distance

\+ speed

\+ wind

\+ waves

\+ currents

Each route segment gets its own estimated fuel.

**53\. Segment-Level Environmental Data**

For every route segment:

segment

│

├── wind

├── waves

├── current

├── risk

├── speed

├── fuel

└── ETA

This is much better than calculating one average value for the entire route.

**54\. Segment Cost Function**

Conceptually:

segment\_cost =

distance\_cost

+

fuel\_cost

+

time\_cost

+

risk\_cost

+

environment\_cost

The optimizer can then choose routes based on segment-level conditions.

**55\. Dynamic A\***

Modify Phase 1 A\*.

Previously:

neighbor cost = geographic distance

Now:

neighbor cost =

distance

× environmental\_factor

+

risk\_penalty

+

storm\_penalty

+

fuel\_penalty

The heuristic should remain admissible/appropriately bounded for the chosen implementation.

**56\. Candidate Route Generation**

Generate at least:

Fastest

Fuel efficient

Lowest risk

Balanced

The system should compare them under **current environmental conditions**.

**57\. Route Recommendation Example**

Suppose:

Route A

ETA: 40h

Fuel: 70,000 L

Risk: 85

Route B

ETA: 43h

Fuel: 72,000 L

Risk: 25

Route C

ETA: 46h

Fuel: 68,000 L

Risk: 15

Autonomous safety mode should strongly favor:

Route C

even if it isn't the fastest.

**58\. Route Safety Constraint**

Introduce hard constraints.

For example:

if risk >= CRITICAL\_THRESHOLD:

route = INVALID

This is better than merely adding a huge penalty.

Some conditions should make a route **unacceptable**, not merely expensive.

**59\. Hard vs Soft Constraints**

**Hard constraints**

land

restricted area

critical storm

impossible navigation

**Soft constraints**

moderate wind

fuel

ETA

wave height

cost

The optimizer should treat these differently.

**60\. Environmental Data Storage**

Create tables:

weather\_observations

ocean\_observations

storms

risk\_observations

alerts

agent\_events

**61\. Spatial Indexing**

Every environmental observation with coordinates should have a spatial index.

For example:

weather.location

ocean.location

risk.location

storm.geometry

This allows queries such as:

Find weather conditions near route

efficiently.

**62\. Route/Environment Intersection**

Given:

route geometry

find:

weather grid cells

storm polygons

risk zones

intersecting the route.

This is where PostGIS becomes extremely useful.

**63\. Data Freshness**

Environmental information must include:

observed\_at

received\_at

expires\_at

The system should know whether information is stale.

Example:

Weather data:

Updated 2 minutes ago ✓

Current:

Updated 55 minutes ago ⚠

Storm:

Updated 3 hours ago 🔴

**64\. Stale Data Handling**

If data exceeds a configured TTL:

DATA\_STALE

The system should:

*   flag it,
*   avoid treating it as fresh,
*   optionally request new data.

**65\. Background Workers**

Create workers for:

weather ingestion

ocean ingestion

storm ingestion

risk calculation

route monitoring

Example:

Worker Scheduler

│

├── Weather every 5 min

├── Ocean every 10 min

├── Storm every 5 min

└── Route monitoring every 1 min

Exact intervals should be configurable.

**66\. Route Monitoring Worker**

For every active voyage:

load current route

↓

load environmental data

↓

calculate current risk

↓

check thresholds

↓

trigger event if necessary

**67\. Route Health**

Introduce:

Route Health Score

Example:

92 / 100

HEALTHY

It should decrease when:

risk increases

weather deteriorates

fuel efficiency decreases

**68\. Voyage Health**

Similarly:

Voyage Health

Safety 91

Fuel 84

Environment 88

ETA 93

Overall 89

**69\. Predictive ETA**

Phase 2 can improve ETA using:

current

wind

waves

instead of:

constant speed

Formula conceptually:

ETA =

sum(segment\_distance / segment\_effective\_speed)

**70\. Predictive Fuel**

Similarly:

Total fuel =

Σ(segment fuel consumption)

instead of:

distance × constant rate

**71\. Environmental Impact**

Phase 2 should update:

CO₂ estimate

based on actual environmental conditions.

For example:

headwind

→ higher fuel

→ higher CO₂

This connects the logistics objective directly to environmental preservation.

**72\. New API Endpoints**

Add:

GET /api/v1/weather

GET /api/v1/weather/route/{route\_id}

GET /api/v1/ocean

GET /api/v1/ocean/route/{route\_id}

GET /api/v1/storms

GET /api/v1/storms/active

GET /api/v1/risk

GET /api/v1/risk/route/{route\_id}

GET /api/v1/alerts

GET /api/v1/alerts/active

**73\. Dynamic Routing API**

Add:

POST /api/v1/routes/recalculate

Request:

{

"voyage\_id": 17,

"reason": "STORM\_DETECTED"

}

Response:

{

"previous\_route": {},

"new\_route": {},

"risk\_reduction": 63.2,

"fuel\_change": 3.4,

"eta\_change\_hours": 1.2,

"reason": \[

"Storm intersects current route",

"Alternative route reduces critical-risk exposure"

\]

}

**74\. Agent APIs**

For monitoring:

GET /api/v1/agents

GET /api/v1/agents/{id}

GET /api/v1/agents/events

Return:

agent status

last activity

current task

last event

errors

**75\. Alert APIs**

GET /api/v1/alerts

GET /api/v1/alerts/{id}

POST /api/v1/alerts/{id}/acknowledge

**76\. WebSocket**

Introduce WebSockets for live updates.

Frontend

│

WebSocket

│

▼

FastAPI

│

▼

Event Bus

Events:

vessel position

weather update

storm alert

risk update

route change

agent status

**77\. Real-Time Dashboard**

The map should update without refreshing.

For example:

12:01

Route risk = 22

12:03

Route risk = 37

12:04

Storm detected

12:05

Route risk = 74

12:06

Route recalculated

12:07

Route risk = 19

**78\. Simulation Controls**

Add a simulation control panel.

SIMULATION

\[▶ Start\]

Speed:

1x 5x 10x 50x

Environment:

Normal

Storm

Heavy Waves

Strong Current

\[ Inject Event \]

**79\. Scenario Injection**

Allow the developer/demo operator to trigger:

Storm detected

Strong headwind

Strong current

High waves

Visibility drop

This allows the hackathon judges to see the agents react immediately.

**80\. Example Hackathon Demo**

Start:

Voyage:

Mumbai → Singapore

Mode:

Autonomous

Initial:

Risk: LOW

Fuel: 76,000 L

ETA: 55h

Then inject:

STORM DETECTED

System:

Weather Agent

↓

Storm detected

↓

Risk Agent

↓

Risk = CRITICAL

↓

Commander

↓

Route Agent

↓

Recalculate

Dashboard displays:

⚠ ROUTE AT RISK

Storm detected 140 km ahead.

Calculating safer route...

Then:

NEW ROUTE SELECTED

Risk:

82 → 21

Fuel:

+3.2%

ETA:

+1h 18m

Reason:

Avoids storm system

That is a strong autonomous-agent demonstration.

**81\. LLM Integration**

If using LangGraph in Phase 2, the LLM should primarily handle:

planning

coordination

explanation

tool selection

It should **not** calculate:

distance

fuel

risk

ETA

Those remain deterministic tools.

Architecture:

LLM

│

Maritime Commander

│

┌─────────┼─────────┐

▼ ▼ ▼

Weather Risk Routing

Tool Tool Tool

│ │ │

▼ ▼ ▼

APIs Models A\*

**82\. Commander Decision Example**

The Commander receives:

{

"event": "ROUTE\_AT\_RISK",

"risk": 87,

"storm\_distance\_km": 120

}

It should invoke:

get\_weather()

get\_storm()

calculate\_route\_risk()

recalculate\_route()

compare\_routes()

Then return a structured decision:

{

"action": "RECALCULATE\_ROUTE",

"priority": "HIGH",

"reason": "Current route enters critical storm zone"

}

**83\. Agent Guardrails**

LLM agents must not directly modify the database.

Use:

Agent

↓

Tool

↓

Validation

↓

Service

↓

Database

Not:

LLM → SQL

**84\. Decision Logging**

Every autonomous decision must be recorded.

Decision:

ROUTE\_CHANGED

Agent:

Maritime Commander

Reason:

Storm detected

Previous risk:

82

New risk:

23

Decision time:

...

Route:

v3 → v4

This provides auditability.

**85\. Agent Confidence**

Optionally track:

confidence

Example:

Storm detection confidence: 0.96

Route recommendation confidence: 0.91

For deterministic calculations, confidence can be derived from data freshness/quality rather than pretending the numerical result is probabilistic.

**86\. Data Quality Score**

Every environmental dataset should have:

freshness

source reliability

completeness

Then:

data\_quality\_score

Example:

Weather:

94%

Ocean Current:

81%

Storm:

97%

**87\. Frontend Architecture Changes**

Extend Phase 1:

components/

├── map/

│ ├── VesselLayer

│ ├── RouteLayer

│ ├── WeatherLayer

│ ├── CurrentLayer

│ ├── StormLayer

│ └── RiskLayer

│

├── agents/

│ ├── AgentStatus

│ └── AgentTimeline

│

├── alerts/

│ ├── AlertPanel

│ └── AlertCard

│

└── voyage/

├── VoyageHealth

├── VoyageTimeline

└── RouteChanges

**88\. New Dashboard Layout**

┌──────────────────────────────────────────────────────────────┐

│ OceanSentinel 🟢 Autonomous Mode │

├─────────────┬──────────────────────────────┬─────────────────┤

│ │ │ │

│ VOYAGE │ │ RISK │

│ │ │ │

│ Vessel │ │ 21 LOW │

│ Origin │ LIVE MAP │ │

│ Destination │ │ Storms: 1 │

│ │ 🚢 ──────── │ Waves: Normal │

│ │ ──────── │ Wind: 12 m/s │

│ │ │ │

├─────────────┴──────────────────────────────┴─────────────────┤

│ ALERTS │ AGENT ACTIVITY │

│ │ │

│ Storm detected │ Weather Agent ✓ │

│ Route recalculated │ Ocean Agent ✓ │

│ │ Risk Agent ✓ │

│ │ Commander → Route Agent │

└────────────────────────────┴─────────────────────────────────┘

**89\. Agent Timeline**

Show actual agent events:

10:41:02 Weather Agent

Storm detected

10:41:03 Risk Agent

Route risk increased to 87

10:41:04 Commander

Recalculation requested

10:41:05 Routing Agent

3 candidates generated

10:41:07 Risk Agent

Candidate B selected

10:41:08 Commander

Voyage updated

**90\. Database Additions**

Phase 2 should add:

weather\_observations

ocean\_observations

storms

risk\_observations

alerts

agent\_events

agent\_decisions

route\_versions

**91\. Database Relationships**

VOYAGE

│

├──── ROUTE VERSION

│ │

│ └── ENVIRONMENTAL CONDITIONS

│

├──── ALERT

│

└──── AGENT DECISION

WEATHER

│

└──── ROUTE RISK

OCEAN

│

└──── ROUTE RISK

STORM

│

└──── ROUTE RISK

**92\. Indexing**

Add spatial indexes on:

weather\_observations.location

ocean\_observations.location

storms.geometry

risk\_observations.location

Also indexes:

timestamp

vessel\_id

voyage\_id

route\_id

severity

status

**93\. Caching Strategy**

Cache:

current weather

current ocean conditions

active storms

route risk

Use TTLs.

Example:

weather → 5 min

ocean → 10 min

storm → 5 min

risk → 1 min

Make these configurable.

**94\. Performance Targets**

For a demo-sized environment:

weather ingestion:

< 2 sec

risk calculation:

< 500 ms

route recalculation:

< 2 sec preferred

WebSocket update:

< 1 sec

dashboard update:

near real-time

Do not allow an LLM call to block critical numerical routing operations.

**95\. Testing**

Phase 2 needs substantially more tests than Phase 1.

**Weather Tests**

Verify:

valid weather

missing fields

stale data

invalid coordinates

API failure

**Current Tests**

Test:

tail current

head current

cross current

zero current

Expected:

tail current → higher effective speed

head current → lower effective speed

**96\. Storm Tests**

Test:

route outside storm

route touching storm

route crossing storm

Expected:

outside → safe

crossing → critical

**97\. Dynamic Routing Test**

Scenario:

Route A initially optimal

Storm introduced

Route A becomes unsafe

Route B becomes optimal

Expected:

automatic recalculation

**98\. Oscillation Test**

Simulate fluctuating conditions.

Expected:

no A → B → A → B oscillation

**99\. Agent Tests**

Test:

Weather Agent

Risk Agent

Commander

Routing Agent

individually.

Then test:

Weather

↓

Risk

↓

Commander

↓

Routing

as an integration workflow.

**100\. Event Tests**

Verify:

STORM\_DETECTED

causes:

ROUTE\_AT\_RISK

which causes:

RECALCULATE\_ROUTE

which causes:

NEW\_ROUTE\_AVAILABLE

**101\. End-to-End Phase 2 Test**

The mandatory E2E test:

Start voyage

↓

Generate route

↓

Start simulation

↓

Inject storm

↓

Weather Agent detects storm

↓

Risk increases

↓

Commander reacts

↓

Route recalculated

↓

New route displayed

↓

Metrics updated

↓

Timeline updated

**102\. Developer Implementation Sequence**

The recommended order is:

**Step 1**

Extend database models.

**Step 2**

Build environmental provider interface.

**Step 3**

Implement simulation provider.

**Step 4**

Implement weather ingestion.

**Step 5**

Implement ocean/current ingestion.

**Step 6**

Implement storm model.

**Step 7**

Implement environmental grid.

**Step 8**

Modify routing engine.

**Step 9**

Implement dynamic fuel/ETA.

**Step 10**

Implement risk engine.

**Step 11**

Implement event system.

**Step 12**

Implement Weather Agent.

**Step 13**

Implement Ocean Agent.

**Step 14**

Implement Risk Agent.

**Step 15**

Implement Route Agent.

**Step 16**

Implement Maritime Commander.

**Step 17**

Implement background workers.

**Step 18**

Implement route monitoring.

**Step 19**

Implement automatic recalculation.

**Step 20**

Implement WebSockets.

**Step 21**

Implement dashboard layers.

**Step 22**

Implement alerts.

**Step 23**

Implement agent activity UI.

**Step 24**

Implement simulation controls.

**Step 25**

Implement autonomous/advisory modes.

**Step 26**

Implement audit logging.

**Step 27**

Testing.

**Step 28**

Documentation.

**103\. Phase 2 Definition of Done**

Phase 2 is complete only when:

**Environmental intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather can be ingested.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean current data can be ingested.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Wave information exists.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Storms can be represented.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental data has timestamps.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Stale data is detected.

**Risk**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk score is calculated.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk is route-specific.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk is segment-specific.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Critical conditions invalidate routes.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Alerts are generated.

**Dynamic routing**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Existing routes can be monitored.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental conditions affect route cost.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Storms can cause rerouting.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fuel/ETA are recalculated.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route versions are stored.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route changes have explanations.

**Agents**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather Agent works.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean Agent works.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk Agent works.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route Agent works.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Commander coordinates them.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Events are logged.

**Frontend**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather layer.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Current layer.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Storm layer.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk heatmap.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Alerts.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent activity.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route changes.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Voyage timeline.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Autonomous mode.

**Reliability**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)External API failures handled.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Stale data handled.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent failures handled.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route oscillation prevented.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Human override works.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Tests pass.

**104\. Phase 2 Final Architecture**

At the end of Phase 2, the system should look like:

┌──────────────────┐

│ USER │

└────────┬─────────┘

│

▼

┌─────────────────────────┐

│ COMMAND CENTER │

│ │

│ Map + Routes + Alerts │

│ Risk + Agents + Voyage │

└────────────┬────────────┘

│

REST + WebSocket

│

▼

┌─────────────────────────┐

│ FASTAPI │

└────────────┬────────────┘

│

┌──────────────────┼──────────────────┐

│ │ │

▼ ▼ ▼

┌───────────┐ ┌───────────┐ ┌───────────┐

│ WEATHER │ │ OCEAN │ │ RISK │

│ AGENT │ │ AGENT │ │ AGENT │

└─────┬─────┘ └─────┬─────┘ └─────┬─────┘

│ │ │

└──────────────────┼──────────────────┘

│

▼

┌──────────────────┐

│ EVENT BUS │

└────────┬─────────┘

│

▼

┌──────────────────┐

│ MARITIME │

│ COMMANDER │

└────────┬─────────┘

│

▼

┌──────────────────┐

│ ROUTE AGENT │

└────────┬─────────┘

│

┌─────────────────┼─────────────────┐

▼ ▼ ▼

┌──────┐ ┌─────────┐ ┌────────┐

│ A\* │ │ FUEL │ │ RISK │

│Engine│ │ ENGINE │ │ ENGINE │

└──┬───┘ └────┬────┘ └───┬────┘

│ │ │

└─────────────────┼────────────────┘

│

▼

┌──────────────┐

│ ROUTE │

│ VERSION │

└──────┬───────┘

│

┌──────────────┼──────────────┐

▼ ▼ ▼

PostgreSQL PostGIS Redis

│

▼

Environmental History

**105\. Phase 2 → Phase 3 Handoff**

The most important output of Phase 2 is that the project now has:

STATIC ROUTING

↓

ENVIRONMENT-AWARE ROUTING

↓

AUTONOMOUS MONITORING

↓

AUTONOMOUS RE-ROUTING

Phase 3 can build the **illegal/dark-vessel intelligence system** on this foundation:

PHASE 2

│

AIS + Vessel Infrastructure

│

▼

┌──────────────┐

│ Risk Engine │

└──────┬───────┘

│

▼

PHASE 3

│

┌────────────┼─────────────┐

▼ ▼ ▼

AIS Agent Dark Vessel Fishing Agent

│

▼

Satellite Data

│

▼

Anomaly Detection

│

▼

Illegal Fishing Risk

**Phase 3 of 4 — Autonomous Dark-Vessel Detection, Illegal Fishing Intelligence & Maritime Surveillance**

Phase 3 extends the system from **environment-aware routing** into **maritime surveillance and anomaly detection**.

The objective is:

**Continuously monitor vessel activity, identify suspicious behavior, detect vessels that disappear from AIS, estimate illegal-fishing risk, and give the autonomous agent system enough evidence to distinguish normal maritime activity from potentially suspicious behavior.**

This phase should **not automatically accuse a vessel of illegal fishing**. It should produce an explainable **suspicion/risk score**, preserve evidence, and escalate high-confidence cases for human review.

**1\. Phase 3 Goal**

At the end of Phase 3, the system should support this pipeline:

AIS / Vessel Data

│

▼

┌───────────────────┐

│ Vessel Tracking │

│ & Normalization │

└─────────┬─────────┘

│

▼

┌───────────────────┐

│ Behavioral │

│ Feature Engine │

└─────────┬─────────┘

│

▼

┌────────────────────────────────────┐

│ Maritime Intelligence │

│ │

│ ┌────────┐ ┌────────┐ ┌────────┐ │

│ │ AIS │ │Fishing │ │Anomaly │ │

│ │ Agent │ │ Agent │ │ Agent │ │

│ └────────┘ └────────┘ └────────┘ │

└───────────────┬────────────────────┘

│

▼

┌─────────────────┐

│ Risk Assessment │

└────────┬────────┘

│

▼

┌─────────────────┐

│ Evidence Engine │

└────────┬────────┘

│

▼

┌─────────────────┐

│ Commander Agent │

└────────┬────────┘

│

┌─────┴──────┐

▼ ▼

Monitor Escalate

**2\. Phase 3 Deliverables**

**Vessel intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS ingestion
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel identity normalization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel position tracking
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel trajectory reconstruction
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel speed/heading analysis
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel type classification
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Historical movement storage

**Dark-vessel detection**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS silence detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gap detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Unexpected reappearance detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Last-known-position tracking
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Estimated position during AIS gap
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dark-period analysis
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Suspicious AIS behavior scoring

**Fishing intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing-zone detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Marine protected area detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing behavior detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Loitering detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Repeated movement patterns
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Rendezvous detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Transshipment suspicion
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel interaction analysis

**Anomaly detection**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Speed anomalies
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Course anomalies
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Geofence violations
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS anomalies
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Unusual route deviations
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Suspicious vessel clusters

**Autonomous agents**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel Tracking Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing Intelligence Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Anomaly Detection Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Evidence Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Maritime Commander integration

**Visualization**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Live vessel map
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel trails
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gaps
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dark-vessel zones
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing activity heatmap
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Suspicion heatmap
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel detail panel
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Investigation timeline
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Evidence panel

**3\. Phase 3 Architecture**

The architecture should extend Phase 2 rather than replace it.

COMMAND CENTER

│

▼

FastAPI API

│

┌────────────────┼────────────────┐

│ │ │

▼ ▼ ▼

Vessel API Risk API Evidence API

│ │ │

└────────────────┼────────────────┘

│

▼

EVENT BUS

│

┌──────────────────────┼──────────────────────┐

│ │ │

▼ ▼ ▼

AIS Agent Fishing Agent Anomaly Agent

│ │ │

▼ ▼ ▼

Vessel Tracker Fishing Detector Behavior Engine

│ │ │

└──────────────────────┼──────────────────────┘

▼

Risk Assessment

│

▼

Evidence Engine

│

▼

Maritime Commander

│

▼

Investigation Case

**4\. Data Sources**

Phase 3 should support multiple sources.

The architecture should abstract them behind providers.

AIS Provider

Satellite Provider

Fishing Zone Provider

Marine Protected Area Provider

Vessel Registry Provider

Do not make the agents directly dependent on APIs.

Use:

Provider

↓

Normalizer

↓

Internal Data Model

↓

Agent

**5\. AIS Provider Interface**

Create a provider abstraction conceptually equivalent to:

AISProvider

with:

get\_vessels(area)

get\_vessel(vessel\_id)

get\_track(vessel\_id, start\_time, end\_time)

get\_positions(area, time\_range)

A simulation provider should also exist.

**6\. Simulation Mode**

This is extremely important for the hackathon.

You need to demonstrate dark-vessel detection without depending on a live AIS feed.

Create scenarios such as:

NORMAL\_VESSEL

AIS\_GAP

SUSPICIOUS\_FISHING

MPA\_INTRUSION

LOITERING

VESSEL\_RENDEZVOUS

TRANSIT\_ANOMALY

Then judges can select:

Scenario:

AIS Gap + Fishing Zone

\[START\]

and watch the autonomous system react.

**7\. AIS Data Model**

Create:

AISPosition

Fields:

id

vessel\_id

timestamp

latitude

longitude

speed\_over\_ground

course\_over\_ground

heading

navigation\_status

source

received\_at

Optional:

rate\_of\_turn

draught

destination

eta

**8\. Vessel Model**

Extend the Phase 1 vessel model.

Add:

imo\_number

mmsi

call\_sign

vessel\_type

flag

length

beam

draught

gross\_tonnage

engine\_power

Do not assume that MMSI and IMO are interchangeable.

Maintain separate identifiers.

**9\. Vessel Types**

Normalize vessel categories.

For example:

CARGO

TANKER

CONTAINER

FISHING

PASSENGER

TUG

RESEARCH

UNKNOWN

You can later expand these classifications.

**10\. Vessel Identity Resolution**

The same physical vessel can appear with different identifiers or malformed information.

Create:

VesselIdentityResolver

Its responsibility:

AIS record

↓

MMSI

↓

IMO

↓

Registry information

↓

Canonical Vessel ID

Store confidence and source.

**11\. Vessel Track Reconstruction**

AIS produces discrete observations:

10:00 → (lat1, lon1)

10:05 → (lat2, lon2)

10:10 → (lat3, lon3)

The system reconstructs:

Vessel trajectory

as:

P1 ───── P2 ───── P3 ───── P4

Store the resulting trajectory or generate it from indexed AIS observations.

**12\. Vessel Trail**

The frontend should display historical trails.

Example:

P4

/

P3 ----

/

P1 --- P2

Allow:

1 hour

6 hours

24 hours

7 days

**13\. Vessel Detail View**

Clicking a vessel should open:

VESSEL #1023

Type:

Fishing Vessel

MMSI:

XXXXXXXXX

Speed:

6.4 knots

Heading:

182°

AIS:

ACTIVE

Risk:

67 HIGH

Current Activity:

Fishing-zone loitering

**14\. AIS Gap Detection**

This is the central Phase 3 feature.

An AIS gap occurs when:

last message

↓

long period without message

↓

next message

Example:

10:00 AIS ✓

10:05 AIS ✓

10:10 AIS ✓

10:15 AIS ✗

10:20 AIS ✗

10:25 AIS ✗

10:30 AIS ✓

The system identifies:

AIS GAP

15 minutes

**15\. Important Distinction**

An AIS gap **does not automatically mean illegal behavior**.

Possible explanations:

*   equipment issue,
*   coverage problem,
*   satellite reception issue,
*   transmission failure,
*   normal operational behavior,
*   intentional disabling.

Therefore:

AIS Gap

↓

Anomaly

↓

Investigate context

not:

AIS Gap

↓

Illegal fishing

**16\. AIS Gap Threshold**

Make configurable:

AIS\_GAP\_THRESHOLD\_SECONDS

For example:

< threshold → normal

\> threshold → AIS gap

Do not hard-code it into agent logic.

**17\. Dark Period Model**

Create:

DarkPeriod

Fields:

id

vessel\_id

start\_time

end\_time

duration

last\_latitude

last\_longitude

reappearance\_latitude

reappearance\_longitude

estimated\_distance

estimated\_area

severity

**18\. Dark Vessel Risk**

Calculate a score based on context.

Example factors:

AIS gap duration

fishing-zone proximity

MPA proximity

historical behavior

reappearance location

speed

course change

vessel type

time of day

**19\. Example Dark-Vessel Risk**

Suppose:

AIS gap = 2 hours

but vessel was:

far from fishing areas

Risk might remain:

25 / 100

But:

AIS gap

+

fishing vessel

+

inside protected zone

+

reappears elsewhere

could produce:

87 / 100

Again, this is a **risk indicator**, not a declaration of criminal activity.

**20\. Fishing Zone Model**

Create:

FishingZone

Fields:

id

name

geometry

zone\_type

jurisdiction

allowed\_vessel\_types

active\_from

active\_until

Zone types:

AUTHORIZED\_FISHING

RESTRICTED\_FISHING

SEASONAL\_FISHING

NO\_FISHING

**21\. Marine Protected Area**

Create:

MarineProtectedArea

Fields:

id

name

geometry

protection\_level

authority

rules

Use PostGIS geometry.

**22\. Geofence Engine**

Build a reusable:

GeofenceEngine

It should answer:

is\_vessel\_inside\_zone()

and:

distance\_to\_zone()

and:

trajectory\_intersects\_zone()

**23\. Fishing Behavior Detection**

The system should identify patterns rather than relying on one signal.

Potential indicators:

low speed

repeated turns

slow movement

long residence

zig-zag movement

repeated passes

These can indicate fishing-like behavior.

But again:

They are indicators, not proof.

**24\. Loitering Detection**

Create:

LoiteringDetector

Input:

vessel trajectory

time window

speed

movement radius

Output:

loitering\_score

Example:

Vessel:

Speed < 3 knots

Movement radius:

2.1 km

Duration:

2h 40m

Loitering:

HIGH

**25\. Fishing Pattern Detection**

A simplified detector can identify:

high-speed transit

↓

slowdown

↓

repeated turns

↓

slow movement

↓

departure

Represent it as:

TRANSIT

↓

SLOWDOWN

↓

FISHING-LIKE ACTIVITY

↓

DEPARTURE

**26\. Fishing Activity Score**

Create:

fishing\_activity\_score

between:

0–100

Possible features:

speed variance

turning frequency

time at low speed

trajectory shape

zone location

duration

**27\. Rendezvous Detection**

Look for two vessels:

Vessel A ────────┐

│

▼

● rendezvous

▲

│

Vessel B ────────┘

Potential indicators:

vessels approach

speeds decrease

distance remains small

vessels stay together

vessels separate

**28\. Vessel Interaction Event**

Create:

VesselInteraction

Fields:

id

vessel\_a

vessel\_b

start\_time

end\_time

minimum\_distance

location

interaction\_type

confidence

Types:

RENDEZVOUS

POSSIBLE\_TRANSSHIPMENT

FORMATION

UNKNOWN

**29\. Transshipment Suspicion**

Potential pattern:

Fishing vessel

↓

approaches cargo/support vessel

↓

both slow down

↓

remain close

↓

separate

The system should generate:

POSSIBLE\_TRANSSHIPMENT

rather than claiming that transshipment occurred.

**30\. Vessel Behavior Baseline**

One of the strongest Phase 3 features is learning a vessel's normal behavior.

For each vessel calculate:

normal speed

normal route

normal operating areas

normal activity duration

normal fishing behavior

normal AIS reporting pattern

Then compare current behavior.

**31\. Behavioral Anomaly**

Example:

Historical:

Vessel usually operates here

████████████

Current:

█

█

█

System:

Route deviation detected

**32\. Historical Behavior Model**

Create:

VesselBehaviorProfile

Fields:

vessel\_id

average\_speed

speed\_stddev

common\_regions

common\_routes

usual\_activity\_hours

ais\_gap\_frequency

fishing\_activity\_baseline

last\_updated

**33\. Anomaly Score**

Calculate:

behavior\_anomaly\_score

based on deviation from baseline.

Example:

speed anomaly

+

route anomaly

+

location anomaly

+

AIS anomaly

**34\. Composite Suspicion Score**

The most important Phase 3 output:

maritime\_risk\_score

Example:

AIS anomaly 25

Fishing behavior 20

Protected-zone risk 25

Vessel behavior 10

Rendezvous 5

────────────────────────

Total 85

Normalize:

0–100

**35\. Risk Categories**

Use:

0–20 LOW

21–40 MODERATE

41–60 ELEVATED

61–80 HIGH

81–100 CRITICAL

**36\. Evidence Engine**

Every risk score should have evidence.

Create:

Evidence

Example:

EVIDENCE

✓ AIS gap: 48 minutes

✓ Vessel reappeared 17 km away

✓ Vessel entered restricted fishing zone

✓ Fishing-like movement detected

✓ Vessel approached another vessel

This is far more useful than:

Risk = 92

with no explanation.

**37\. Evidence Types**

AIS\_GAP

ZONE\_ENTRY

ZONE\_EXIT

LOITERING

FISHING\_PATTERN

COURSE\_ANOMALY

SPEED\_ANOMALY

VESSEL\_RENDEZVOUS

REAPPEARANCE

ROUTE\_DEVIATION

**38\. Evidence Strength**

Each evidence item should have:

strength

confidence

source

timestamp

geometry

Example:

AIS\_GAP

Confidence: 0.99

Source: AIS

**39\. Investigation Case**

Create:

InvestigationCase

Fields:

id

vessel\_id

risk\_score

risk\_level

status

created\_at

updated\_at

assigned\_to

summary

Status:

OPEN

UNDER\_REVIEW

ESCALATED

RESOLVED

DISMISSED

**40\. Case Creation Logic**

Do not create cases for every tiny anomaly.

For example:

risk < 60

→ event only

60–80

→ alert

\> 80

→ investigation case

Make thresholds configurable.

**41\. Autonomous Investigation Agent**

Introduce:

Investigation Agent

It receives:

suspicious vessel

and gathers:

recent AIS

historical AIS

zone information

fishing activity

AIS gaps

vessel metadata

nearby vessel interactions

Then generates a structured investigation summary.

**42\. Investigation Workflow**

Suspicious Event

│

▼

Investigation Agent

│

├── Get Vessel

├── Get Track

├── Get AIS Gaps

├── Check Zones

├── Analyze Fishing

├── Find Nearby Vessels

└── Compare History

│

▼

Evidence Bundle

│

▼

Risk Assessment

│

▼

Case Created

**43\. Commander Integration**

The Phase 2 Commander becomes:

Maritime Commander

with three major domains:

LOGISTICS

ENVIRONMENT

SURVEILLANCE

Architecture:

COMMANDER

│

┌────────────────┼────────────────┐

▼ ▼ ▼

Logistics Environment Surveillance

│ │ │

▼ ▼ ▼

Route Agent Weather Agent AIS Agent

Fuel Agent Ocean Agent Fishing Agent

Risk Agent Risk Agent Anomaly Agent

**44\. Surveillance Events**

Add event streams:

ais.events

vessel.events

fishing.events

anomaly.events

investigation.events

Examples:

AIS\_GAP\_DETECTED

VESSEL\_ENTERED\_ZONE

FISHING\_ACTIVITY\_DETECTED

VESSEL\_RENDEZVOUS\_DETECTED

HIGH\_RISK\_VESSEL

CASE\_CREATED

**45\. Event Example**

{

"event\_type": "AIS\_GAP\_DETECTED",

"source": "ais\_agent",

"timestamp": "2026-09-12T10:30:00Z",

"vessel\_id": 1023,

"payload": {

"gap\_duration\_minutes": 48,

"last\_known\_latitude": 12.34,

"last\_known\_longitude": 72.45

}

}

**46\. Frontend: Global Maritime Map**

The map now becomes the main command center.

Layers:

☑ Vessels

☑ Vessel Trails

☑ Routes

☑ Weather

☑ Currents

☑ Storms

☑ Fishing Zones

☑ Protected Areas

☑ AIS Gaps

☑ Risk Heatmap

☑ Suspicious Activity

**47\. Vessel Visualization**

Normal vessel:

●

Fishing vessel:

🔵

Suspicious vessel:

🟠

High-risk:

🔴

The actual implementation can use icons/colors appropriate to the map library.

**48\. AIS Gap Visualization**

Display:

Last known position

●

│

│

│ DARK PERIOD

│

?

│

●

Reappearance

The UI should explicitly label the intermediate path as:

ESTIMATED / UNKNOWN

rather than presenting it as observed fact.

**49\. Vessel Timeline**

Clicking a vessel:

VESSEL 1023

08:00 AIS ✓

08:15 AIS ✓

08:30 AIS ✓

08:45 AIS ✗

09:00 AIS ✗

09:15 AIS ✗

09:30 AIS ✓

⚠ AIS GAP: 45 MIN

**50\. Investigation Panel**

Example:

┌────────────────────────────────────┐

│ VESSEL 1023 │

├────────────────────────────────────┤

│ Risk: 87 / 100 │

│ CRITICAL │

│ │

│ Evidence │

│ │

│ ✓ AIS gap: 48 min │

│ ✓ Restricted zone entry │

│ ✓ Fishing-like behavior │

│ ✓ Rendezvous detected │

│ │

│ \[VIEW TIMELINE\] │

│ \[VIEW EVIDENCE\] │

│ \[OPEN CASE\] │

└────────────────────────────────────┘

**51\. Suspicious Activity Heatmap**

Create a spatial layer:

low activity

↓

moderate

↓

high

↓

critical

The heatmap should be based on detected events rather than simply painting arbitrary areas.

**52\. Fishing Activity Heatmap**

Aggregate:

fishing\_activity\_score

by geographic cells.

Example:

░░░░

░▒▒▒▒▒▒░

▒▒▓▓▓▓▓▒▒

▒▓████▓▒

▒▓▓▓▓▒

This lets operators identify areas with unusual fishing activity.

**53\. Protected-Zone Alerts**

If a vessel enters:

NO\_FISHING

generate:

ZONE\_VIOLATION

with:

vessel

zone

entry\_time

location

duration

**54\. Zone Violation Severity**

Example:

transit through zone

→ MODERATE

slow fishing-like behavior

→ HIGH

fishing behavior + AIS gap

→ CRITICAL

The final risk should depend on multiple factors.

**55\. Vessel Comparison**

Allow operators to compare vessels:

Vessel A

Risk: 72

AIS gaps: 4

Fishing activity: High

Vessel B

Risk: 31

AIS gaps: 1

Fishing activity: Low

**56\. Search**

Add:

Search vessel

Search MMSI

Search IMO

Search region

Search case

**57\. Filtering**

Filters:

Risk:

□ Low

□ Moderate

□ High

□ Critical

Type:

□ Fishing

□ Cargo

□ Tanker

□ Unknown

Activity:

□ Fishing

□ Loitering

□ AIS gap

□ Rendezvous

□ Zone violation

**58\. Historical Replay**

This will be one of the strongest demo features.

Add:

\[ PLAY REPLAY \]

Timeline:

08:00 ─────────────── 12:00

▲

cursor

The map replays vessel movements.

**59\. Replay Scenario**

Example:

08:00

Fishing vessel enters region

08:30

Fishing activity begins

09:15

AIS disappears

10:00

AIS reappears

10:05

Vessel approaches another vessel

10:30

System creates investigation case

This makes the system extremely easy for judges to understand.

**60\. Satellite Data Integration**

If satellite imagery is available, create:

SatelliteProvider

Do not make satellite imagery mandatory for the first implementation.

Phase 3 should support:

AIS-only mode

AIS + satellite mode

**61\. Satellite Observation Model**

Create:

SatelliteObservation

Fields:

id

timestamp

latitude

longitude

geometry

image\_url/reference

source

confidence

If using external imagery, store a reference rather than copying large imagery into PostgreSQL.

**62\. AIS vs Satellite Correlation**

Potential workflow:

AIS says:

No vessel

Satellite says:

Possible vessel

↓

AIS-Satellite discrepancy

↓

Suspicious observation

This is a powerful future-facing feature.

**63\. Dark Vessel Confirmation**

Do not say:

Satellite detected illegal vessel.

Instead:

Possible non-cooperative vessel detected.

Then:

AIS unavailable

+

satellite observation

\=

HIGHER CONFIDENCE

**64\. Data Fusion Engine**

Create:

MaritimeDataFusion

Input:

AIS

Satellite

Zones

Weather

Vessel history

Output:

unified maritime picture

**65\. Confidence Calculation**

Every detection should have:

confidence\_score

Example:

AIS gap:

0.99

Fishing behavior:

0.78

Zone intrusion:

0.99

Satellite correlation:

0.86

**66\. Explainable Risk**

Instead of:

Risk = 91

produce:

Risk = 91

Primary contributors:

+28 AIS gap

+25 protected-zone activity

+20 fishing-like behavior

+10 unusual route

+08 rendezvous

This should be generated from structured data.

**67\. LLM Usage**

The LLM should be used for:

investigation planning

evidence summarization

natural-language explanations

agent coordination

operator questions

It should not determine criminality autonomously.

For example, an operator can ask:

"Why is Vessel 1023 high risk?"

The Commander gathers deterministic evidence and the LLM converts it into:

Vessel 1023 is classified as high risk because...

**68\. Natural-Language Query Interface**

Add:

Ask Maritime AI

Examples:

"Show high-risk fishing vessels."

"Why is Vessel 1023 suspicious?"

"Which vessels entered protected zones today?"

"Show vessels with AIS gaps longer than 30 minutes."

"Which suspicious vessels are near our shipping routes?"

**69\. Tool-Based LLM Architecture**

User

│

▼

LLM

│

├── search\_vessels()

├── get\_vessel\_track()

├── get\_ais\_gaps()

├── get\_zone\_events()

├── get\_risk()

├── get\_evidence()

└── get\_investigation\_case()

│

▼

Structured Answer

Never allow the LLM to invent vessel observations.

**70\. New API Endpoints**

Add:

GET /api/v1/vessels

GET /api/v1/vessels/{id}

GET /api/v1/vessels/{id}/track

GET /api/v1/vessels/{id}/history

**71\. AIS APIs**

GET /api/v1/ais

GET /api/v1/ais/gaps

GET /api/v1/ais/gaps/{id}

**72\. Fishing APIs**

GET /api/v1/fishing/activity

GET /api/v1/fishing/zones

GET /api/v1/fishing/events

**73\. Surveillance APIs**

GET /api/v1/surveillance/events

GET /api/v1/surveillance/risk

GET /api/v1/surveillance/heatmap

**74\. Investigation APIs**

GET /api/v1/investigations

GET /api/v1/investigations/{id}

POST /api/v1/investigations/{id}/assign

POST /api/v1/investigations/{id}/resolve

POST /api/v1/investigations/{id}/dismiss

**75\. Vessel Risk API**

GET /api/v1/vessels/{id}/risk

Response:

{

"vessel\_id": 1023,

"score": 87,

"level": "CRITICAL",

"factors": \[

{

"type": "AIS\_GAP",

"score": 28

},

{

"type": "ZONE\_ACTIVITY",

"score": 25

},

{

"type": "FISHING\_BEHAVIOR",

"score": 20

}

\]

}

**76\. Database Additions**

Phase 3 should add:

vessels

ais\_positions

vessel\_tracks

dark\_periods

fishing\_zones

marine\_protected\_areas

fishing\_events

vessel\_interactions

behavior\_profiles

anomaly\_events

vessel\_risk\_scores

evidence

investigation\_cases

satellite\_observations

**77\. Spatial Database Structure**

Use PostGIS for:

AIS positions

tracks

fishing zones

MPAs

vessel interactions

satellite observations

risk surfaces

Spatial indexes are mandatory.

**78\. AIS Indexes**

Important indexes:

vessel\_id

timestamp

location

Composite indexes should be considered for:

vessel\_id + timestamp

because historical track queries will be frequent.

**79\. Track Storage Strategy**

Do not repeatedly rebuild an entire vessel track from raw AIS for every dashboard request.

Use:

Raw AIS

↓

Track processor

↓

Indexed trajectory

Keep raw observations for evidence/audit.

**80\. Event Processing**

The surveillance event pipeline:

AIS

↓

Normalizer

↓

Track Processor

↓

Feature Extraction

↓

Anomaly Detection

↓

Risk Engine

↓

Evidence Engine

↓

Commander

**81\. Feature Extraction**

Create a reusable service:

VesselFeatureEngine

Features:

speed\_mean

speed\_stddev

course\_change\_rate

turning\_rate

time\_stationary

time\_in\_zone

distance\_traveled

ais\_gap\_count

ais\_gap\_duration

nearest\_vessel\_distance

**82\. Feature Windows**

Calculate features over:

15 minutes

1 hour

6 hours

24 hours

7 days

30 days

This enables both short-term anomaly detection and historical baselines.

**83\. Anomaly Algorithms**

Start simple.

**Rule-based**

if AIS gap > threshold

**Statistical**

if speed > mean + N × stddev

**Spatial**

if vessel enters prohibited polygon

**Behavioral**

if current trajectory significantly differs from baseline

This is enough for Phase 3.

Do not immediately build a complicated deep-learning model.

**84\. Optional ML Layer**

After the deterministic system works, introduce:

Isolation Forest

or another anomaly-detection model.

Input:

speed

heading changes

location

time

AIS gaps

zone activity

interaction patterns

Output:

anomaly\_score

The ML score should be **one input** to the risk engine, not the entire decision.

**85\. Risk Engine Architecture**

AIS Features

│

Fishing Features

│

Zone Features

│

Behavior Features

│

Interaction Features

│

Satellite Features

│

▼

┌───────────────────┐

│ Risk Engine │

└─────────┬─────────┘

│

▼

Risk Score

│

▼

Evidence Engine

**86\. Investigation Evidence Bundle**

Every investigation should have:

Vessel identity

Current location

Historical track

AIS gaps

Fishing activity

Zone violations

Nearby vessels

Behavior profile

Risk factors

Data sources

Timestamps

**87\. Evidence Snapshot**

When a case is created, preserve a snapshot.

Why?

Because environmental and AIS data will continue changing.

You need to know:

"What evidence existed when the system generated this case?"

Store:

evidence\_snapshot

timestamp

data\_version

**88\. Audit Trail**

Log:

case created

risk updated

evidence added

agent decision

human review

case dismissed

case escalated

**89\. Human-in-the-Loop**

Phase 3 must not make law-enforcement conclusions automatically.

Use:

AI Detection

↓

Risk Assessment

↓

Human Review

↓

Investigation

UI:

\[ REVIEW CASE \]

\[ CONFIRM CONCERN \]

\[ DISMISS \]

\[ NEED MORE DATA \]

**90\. False Positive Handling**

The system should allow:

DISMISSED\_REASON

Examples:

AIS equipment failure

Coverage issue

Authorized activity

Weather disruption

Data error

Unknown

These labels can later become training data.

**91\. Feedback Loop**

Human investigators can provide:

true positive

false positive

uncertain

Then:

Detection

↓

Human feedback

↓

Historical dataset

↓

Model improvement

This creates a foundation for Phase 4.

**92\. Security**

Phase 3 introduces sensitive maritime information.

Implement:

authentication

authorization

role-based access

audit logs

Roles:

ADMIN

OPERATOR

ANALYST

VIEWER

**93\. Access Control**

Example:

VIEWER

→ view map

ANALYST

→ view investigations

OPERATOR

→ acknowledge/escalate

ADMIN

→ manage system

**94\. Data Protection**

Avoid exposing unnecessary:

raw provider credentials

internal IDs

private infrastructure

Use environment variables for secrets.

**95\. Performance Requirements**

Target:

AIS ingestion:

high throughput

vessel position update:

< 1–2 seconds

risk calculation:

< 500 ms preferred

track retrieval:

< 1 sec for normal window

investigation generation:

< 5 sec preferred

map updates:

near real-time

The exact target depends on dataset size.

**96\. Testing**

Phase 3 requires several test categories.

**AIS Tests**

Test:

normal messages

duplicate messages

out-of-order messages

missing coordinates

invalid MMSI

invalid timestamp

**97\. Dark-Vessel Tests**

Scenario:

AIS:

10:00 ✓

10:05 ✓

10:10 ✓

10:15 ✗

10:20 ✗

10:25 ✗

10:30 ✓

Expected:

DarkPeriod detected

duration = 15 minutes

**98\. Zone Tests**

Test:

outside zone

enter zone

remain in zone

leave zone

Expected:

ZONE\_ENTRY

ZONE\_EXIT

**99\. Fishing Detection Tests**

Test trajectories:

straight transit

stationary vessel

zig-zag fishing pattern

slow circular pattern

Expected:

transit → low fishing score

zig-zag → high fishing score

**100\. Rendezvous Tests**

Scenario:

Vessel A → Vessel B

distance decreases

both slow

remain together

distance increases

Expected:

VESSEL\_RENDEZVOUS

**101\. Composite Risk Test**

Scenario:

Fishing vessel

+

AIS gap

+

restricted zone

+

fishing behavior

Expected:

HIGH/CRITICAL risk

depending on configured weights.

**102\. False Positive Test**

Scenario:

AIS gap

+

no restricted zone

+

no fishing behavior

+

known coverage issue

Expected:

low/moderate risk

not an automatic critical case.

**103\. End-to-End Test**

Mandatory Phase 3 demonstration:

Simulated Fishing Vessel

│

▼

Enters Fishing Zone

│

▼

Fishing-like Behavior

│

▼

AIS Disappears

│

▼

AIS Agent

│

▼

Dark Period Detected

│

▼

Vessel Reappears

│

▼

Anomaly Agent

│

▼

Fishing Agent

│

▼

Risk Engine

│

▼

Risk = HIGH

│

▼

Evidence Engine

│

▼

Investigation Agent

│

▼

Case Created

│

▼

Dashboard Alert

**104\. Recommended Developer Implementation Order**

Do **not** implement all agents simultaneously.

Follow this sequence.

**Step 1 — Vessel database**

Extend vessel schema.

**Step 2 — AIS schema**

Implement raw AIS storage.

**Step 3 — AIS provider**

Create real + simulation providers.

**Step 4 — AIS ingestion**

Create background ingestion worker.

**Step 5 — Track reconstruction**

Build vessel trajectories.

**Step 6 — Vessel map**

Display live vessels.

**Step 7 — Vessel history**

Implement trails and timeline.

**Step 8 — AIS gap detector**

Detect dark periods.

**Step 9 — Zone engine**

Implement fishing zones and MPAs.

**Step 10 — Geofencing**

Detect vessel zone entry/exit.

**Step 11 — Fishing behavior engine**

Detect low-speed/turning/loitering patterns.

**Step 12 — Vessel interaction engine**

Detect rendezvous.

**Step 13 — Behavioral baseline**

Build normal vessel profiles.

**Step 14 — Anomaly engine**

Combine behavioral anomalies.

**Step 15 — Risk engine**

Calculate vessel risk.

**Step 16 — Evidence engine**

Explain every risk score.

**Step 17 — Investigation cases**

Create cases for high-risk activity.

**Step 18 — AIS Agent**

Automate AIS monitoring.

**Step 19 — Fishing Agent**

Automate fishing analysis.

**Step 20 — Anomaly Agent**

Automate behavioral detection.

**Step 21 — Investigation Agent**

Build evidence bundles.

**Step 22 — Commander integration**

Coordinate all agents.

**Step 23 — Real-time events**

Connect everything through Redis.

**Step 24 — Dashboard**

Build surveillance interface.

**Step 25 — Historical replay**

Implement timeline playback.

**Step 26 — Simulation scenarios**

Create hackathon demo scenarios.

**Step 27 — Optional satellite correlation**

Add external/simulated satellite observations.

**Step 28 — Security**

Implement RBAC and audit logging.

**Step 29 — Testing**

Run unit + integration + E2E tests.

**Step 30 — Demo preparation**

Prepare repeatable scenarios.

**105\. Phase 3 Final Dashboard**

The final dashboard should look conceptually like:

┌─────────────────────────────────────────────────────────────┐

│ OCEANSENTINEL AUTONOMOUS MODE 🟢 │

├───────────────┬───────────────────────────────┬─────────────┤

│ │ │ │

│ SURVEILLANCE │ │ RISK │

│ │ │ │

│ Vessels │ LIVE MAP │ 72 HIGH │

│ 1,284 │ │ │

│ │ 🚢 │ │

│ Suspicious │ 🚢 │ Storm │

│ 17 │ 🔴 │ Low │

│ │ │ │

│ AIS Gaps │ ─────────────── │ Fishing │

│ 8 │ │ High │

│ │ │ │

├───────────────┴───────────────────────────────┴─────────────┤

│ ACTIVE INVESTIGATIONS │

│ │

│ 🔴 Vessel 1023 Risk 87 AIS Gap + Fishing + Zone Entry │

│ 🟠 Vessel 441 Risk 68 Unusual Fishing Pattern │

│ 🟠 Vessel 892 Risk 63 AIS Anomaly │

├─────────────────────────────────────────────────────────────┤

│ AGENT ACTIVITY │

│ │

│ AIS Agent ✓ Monitoring │

│ Fishing Agent ✓ Analyzing Vessel 1023 │

│ Anomaly Agent ✓ 3 anomalies detected │

│ Evidence Agent → Building Case #291 │

│ Commander → Awaiting human review │

└─────────────────────────────────────────────────────────────┘

**106\. Phase 3 Definition of Done**

Phase 3 is complete when all of the following work.

**Vessel tracking**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS data ingestion works.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel identity is normalized.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel positions are stored.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel tracks can be reconstructed.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Historical trails can be displayed.

**Dark-vessel detection**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gaps are detected.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dark periods are stored.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Reappearance is detected.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dark-period risk is calculated.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gaps are visualized.

**Fishing intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing zones exist.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Protected zones exist.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Geofencing works.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Loitering is detected.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing-like behavior is detected.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel rendezvous is detected.

**Anomaly detection**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Speed anomalies.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Course anomalies.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route anomalies.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS anomalies.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Behavioral anomalies.

**Risk**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel risk score.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Explainable risk factors.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Confidence score.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Evidence generation.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk history.

**Investigation**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Investigation cases.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Evidence bundles.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Human review.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Case status.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Audit history.

**Agents**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS Agent.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing Agent.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Anomaly Agent.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Evidence Agent.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Investigation Agent.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Commander integration.

**Frontend**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Live vessel map.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel trails.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gap visualization.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing zones.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)MPA visualization.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk heatmap.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Investigation panel.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent activity.
*   \[Historical replay.

**Reliability**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Duplicate AIS handled.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Invalid AIS handled.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Missing data handled.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Provider failures handled.
*   \[False positives can be dismissed.
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)All agent decisions are logged.

**107\. The Phase 3 Hackathon Story**

The strongest demonstration should connect **all three phases**.

Imagine:

OCEAN SENTINEL

│

┌───────────────┼────────────────┐

│ │ │

▼ ▼ ▼

LOGISTICS ENVIRONMENT SURVEILLANCE

PHASE 1 PHASE 2 PHASE 3

│ │ │

▼ ▼ ▼

Optimize Route Detect Storm Detect Vessel

│ │ │

▼ ▼ ▼

Save Fuel Re-route AIS Gap

│

▼

Fishing Pattern

│

▼

Zone Violation

│

▼

Risk Engine

│

▼

Investigation

The system becomes more than a route optimizer.

It becomes an **autonomous maritime intelligence platform**.

**108\. Phase 3 → Phase 4 Handoff**

At the end of Phase 3, you will have:

PHASE 1

Shipping Optimization

↓

PHASE 2

Environmental Intelligence

↓

PHASE 3

Maritime Surveillance

↓

┌─────────────────────────────┐

│ │

▼ ▼

Vessel Intelligence Ocean Intelligence

│ │

└──────────────┬──────────────┘

▼

MARITIME COMMANDER

│

▼

PHASE 4

Phase 4 can then focus on the **autonomous marine-debris collection and deep-sea preservation system**, while also connecting the three existing capabilities into one unified autonomous maritime ecosystem:

┌─────────────────────┐

│ MARITIME COMMANDER │

└──────────┬──────────┘

│

┌─────────────────┼─────────────────┐

▼ ▼ ▼

SHIPPING SURVEILLANCE PRESERVATION

AGENT AGENT AGENT

│ │ │

▼ ▼ ▼

Fuel/Route Dark Vessels Debris

Optimization Fishing Risk Detection

│ │ │

└─────────────────┼─────────────────┘

▼

AUTONOMOUS OCEAN

OPERATIONS SYSTEM

**Phase 4 of 4 — Autonomous Marine Debris Collection, Deep-Sea Preservation & Unified Maritime Autonomy**

Phase 4 is the **final integration and autonomy phase**.

The goal is to take everything built in Phases 1–3 and turn it into a unified system capable of:

**Detecting marine debris, estimating environmental impact, planning autonomous collection missions, coordinating autonomous marine-cleanup units, avoiding hazards and restricted areas, optimizing collection routes, monitoring mission execution, and feeding the resulting environmental intelligence back into the Maritime Commander.**

At the end of Phase 4, the project should operate as one integrated platform:

┌──────────────────────────┐

│ MARITIME COMMANDER │

│ AUTONOMOUS BRAIN │

└────────────┬─────────────┘

│

┌────────────────────────┼────────────────────────┐

│ │ │

▼ ▼ ▼

SHIPPING AGENT SURVEILLANCE AGENT PRESERVATION AGENT

│ │ │

▼ ▼ ▼

Route Optimization Dark Vessel Debris Detection

Fuel Optimization Detection Cleanup Planning

Weather Avoidance Fishing Risk Mission Control

│ │ │

└────────────────────────┼────────────────────────┘

│

▼

┌─────────────────────┐

│ OCEAN DIGITAL TWIN │

└──────────┬──────────┘

│

▼

AUTONOMOUS MISSIONS

**1\. Phase 4 Objectives**

Phase 4 should deliver six major capabilities:

**1\. Marine debris intelligence**

Detect and classify:

*   floating plastic
*   fishing nets
*   containers
*   abandoned equipment
*   oil-like surface anomalies
*   garbage clusters
*   unidentified floating objects

**2\. Environmental impact assessment**

Determine:

*   debris concentration
*   proximity to protected areas
*   proximity to coastlines
*   proximity to shipping routes
*   potential ecological impact
*   urgency

**3\. Autonomous cleanup planning**

Determine:

*   which debris should be collected first
*   which cleanup vessel/drone should respond
*   optimal collection route
*   required fuel/energy
*   expected collection time

**4\. Multi-agent cleanup coordination**

Coordinate multiple autonomous marine units.

**5\. Mission execution**

Track:

*   unit position
*   battery/fuel
*   collected debris
*   mission progress
*   hazards
*   route deviations

**6\. Full-system integration**

Connect:

Shipping

+

Weather

+

Ocean

+

Surveillance

+

Debris

+

Cleanup

into one autonomous maritime operating system.

**2\. Final Project Architecture**

The final architecture should look like:

USER

│

▼

┌───────────────────┐

│ COMMAND CENTER UI │

└─────────┬─────────┘

│

▼

┌─────────────────┐

│ API GATEWAY │

└────────┬────────┘

│

▼

┌───────────────────┐

│ MARITIME COMMANDER│

└─────────┬─────────┘

│

┌───────────────────┼────────────────────┐

│ │ │

▼ ▼ ▼

LOGISTICS AGENT SURVEILLANCE AGENT PRESERVATION AGENT

│ │ │

│ │ │

▼ ▼ ▼

Route/Fuel AIS/Dark Vessel Debris Agent

Optimization Fishing Detection Cleanup Agent

│ │ │

└───────────────────┼────────────────────┘

│

▼

┌──────────────────┐

│ DECISION ENGINE │

└────────┬─────────┘

│

┌───────────────┼────────────────┐

│ │ │

▼ ▼ ▼

Risk Engine Mission Engine Resource Engine

│ │ │

└───────────────┼────────────────┘

▼

┌──────────────────┐

│ OCEAN DIGITAL │

│ TWIN / WORLD │

│ MODEL │

└────────┬─────────┘

│

▼

AUTONOMOUS UNITS

**3\. Phase 4 Major Components**

Build the following components:

Debris Detection Engine

Debris Classification Engine

Environmental Risk Engine

Cleanup Mission Planner

Fleet Coordination Engine

Autonomous Unit Simulator

Mission Execution Engine

Collision Avoidance Engine

Energy Management Engine

Collection Capacity Manager

Mission Monitoring Engine

Digital Twin

Preservation Agent

Commander Integration

Analytics Engine

**4\. Marine Debris Data Model**

Create:

MarineDebris

Fields:

id

type

latitude

longitude

geometry

estimated\_mass

estimated\_volume

confidence

detected\_at

source

status

priority

environmental\_risk

Possible statuses:

DETECTED

VERIFIED

ASSIGNED

COLLECTING

COLLECTED

FAILED

DISMISSED

**5\. Debris Types**

Start with:

PLASTIC

FISHING\_NET

FISHING\_GEAR

CONTAINER

DRIFTWOOD

UNKNOWN

Optional:

OIL\_LIKE

MICROPLASTIC\_ZONE

ABANDONED\_EQUIPMENT

For the hackathon, don't try to build an extremely sophisticated classifier unless you already have suitable training data.

**6\. Debris Detection Sources**

Support:

Satellite

Drone

Ship sensors

Camera

Manual operator report

Simulation

Architecture:

Detection Source

↓

Detection Provider

↓

Normalizer

↓

Debris Detection

↓

Confidence

↓

Environmental Risk

**7\. Simulation-Based Debris Detection**

For the hackathon, create synthetic debris scenarios.

Example:

DEBRIS\_CLUSTER\_01

Location:

12.4231, 72.2345

Type:

Plastic

Estimated mass:

2.8 tonnes

Confidence:

0.91

This guarantees a reliable demonstration even without live satellite data.

**8\. Debris Cluster Detection**

Individual detections should be clustered.

Example:

● ●

● ● ●

● ●

becomes:

DEBRIS CLUSTER

rather than seven separate cleanup missions.

**9\. Spatial Clustering**

Use a spatial clustering algorithm such as:

DBSCAN

Input:

latitude

longitude

Output:

cluster\_id

centroid

radius

density

estimated\_mass

**10\. Debris Density**

Calculate:

debris\_density =

estimated\_mass / affected\_area

This helps identify cleanup hotspots.

**11\. Environmental Risk Engine**

Create:

EnvironmentalRiskEngine

It evaluates:

debris density

+

debris type

+

mass

+

protected area proximity

+

coastline proximity

+

marine ecosystem sensitivity

+

shipping lane proximity

+

ocean currents

Output:

environmental\_risk\_score

**12\. Environmental Risk Score**

Use:

0–20 LOW

21–40 MODERATE

41–60 ELEVATED

61–80 HIGH

81–100 CRITICAL

Example:

Plastic cluster

+

large mass

+

near protected ecosystem

+

currents moving toward coast

Risk = 89

**13\. Impact Prediction**

The system should estimate:

"Where might this debris move next?"

Use ocean-current data from Phase 2.

Pipeline:

Debris

│

▼

Current Vector

│

▼

Drift Model

│

▼

Predicted Position

**14\. Debris Drift Model**

For each debris cluster:

current\_position

current\_velocity

wind

ocean\_current

time

Estimate:

future\_position

A simplified model is sufficient for the hackathon.

**15\. Drift Prediction**

Example:

Current location

●

\\

\\

\\

●

+6h

\\

●

+12h

Display:

CURRENT

↓

+6 HOURS

↓

+12 HOURS

↓

+24 HOURS

**16\. Cleanup Priority**

Create:

CleanupPriorityEngine

Score based on:

environmental risk

debris mass

drift risk

protected-area proximity

coastline proximity

shipping risk

collection difficulty

Output:

priority\_score

**17\. Example Priority**

Cluster A

Risk: 91

Mass: 5 tonnes

Near MPA

Priority: CRITICAL

Cluster B

Risk: 55

Mass: 1 tonne

Open ocean

Priority: MEDIUM

**18\. Autonomous Cleanup Unit**

Create:

CleanupUnit

Fields:

id

name

type

latitude

longitude

status

battery

fuel

speed

collection\_capacity

current\_load

max\_range

operational\_radius

**19\. Unit Types**

For simulation:

AUTONOMOUS\_SURFACE\_VESSEL

CLEANUP\_DRONE

SUPPORT\_VESSEL

**20\. Unit Status**

AVAILABLE

EN\_ROUTE

COLLECTING

RETURNING

CHARGING

MAINTENANCE

OFFLINE

**21\. Cleanup Unit Simulation**

This is extremely important.

You don't need actual physical robots.

Create simulated autonomous units moving around the digital ocean.

Example:

USV-01

Position:

12.1, 72.2

Battery:

82%

Capacity:

65%

Status:

AVAILABLE

**22\. Mission Model**

Create:

CleanupMission

Fields:

id

debris\_cluster\_id

unit\_id

status

created\_at

started\_at

completed\_at

planned\_distance

actual\_distance

estimated\_duration

actual\_duration

estimated\_energy

actual\_energy

collected\_mass

**23\. Mission Status**

PLANNED

ASSIGNED

EN\_ROUTE

AT\_TARGET

COLLECTING

RETURNING

COMPLETED

FAILED

ABORTED

**24\. Cleanup Mission Planner**

Create:

CleanupMissionPlanner

Input:

debris clusters

cleanup units

weather

currents

restricted areas

shipping routes

unit capacity

unit battery

Output:

unit assignment

route

mission ETA

energy requirement

collection plan

**25\. Assignment Optimization**

Suppose:

Unit A → 30 km

Unit B → 70 km

Unit C → 45 km

But Unit A has:

capacity = 1 tonne

while debris is:

4 tonnes

Therefore Unit A cannot handle it alone.

The system should consider:

distance

+

capacity

+

energy

+

mission duration

**26\. Multi-Unit Assignment**

Possible solution:

Debris Cluster

│

├── USV-01

├── USV-03

└── Support Vessel

The system creates coordinated missions.

**27\. Vehicle Routing**

Use a routing optimizer.

Objective:

minimize:

distance

+

fuel

+

energy

+

time

+

environmental risk

Subject to:

capacity

battery

range

weather

restricted zones

**28\. Cleanup Route**

Example:

BASE

│

▼

USV

│

├───────────────┐

▼ ▼

DEBRIS A DEBRIS B

│ │

└───────┬───────┘

▼

BASE

**29\. Dynamic Replanning**

This is where the system becomes genuinely autonomous.

Suppose:

USV heading toward debris

then:

storm detected

The Commander should trigger:

REPLAN\_MISSION

New route:

Debris

↓

safe waypoint

↓

base

**30\. Mission Replanning Triggers**

Replan when:

storm

route blocked

restricted zone appears

battery too low

debris moves

new higher-priority debris appears

cleanup unit failure

shipping traffic increases

**31\. Energy Management**

Every autonomous unit should continuously calculate:

remaining\_energy

and:

energy\_required\_to\_return

Safety condition:

remaining\_energy >

energy\_required\_to\_return

+

safety\_reserve

If false:

RETURN\_TO\_BASE

**32\. Autonomous Safety Rule**

The system should never allow:

energy insufficient for return

to happen during a normal mission.

Example:

Battery = 24%

Return requirement = 18%

Safety reserve = 5%

Required = 23%

24% > 23%

Continue

But:

Battery = 21%

Required = 23%

21% < 23%

RETURN

**33\. Collection Capacity**

Example:

USV-01

Capacity: 1000 kg

Current load: 800 kg

Remaining: 200 kg

If debris is:

500 kg

the planner should not assign the entire collection task to that unit.

**34\. Partial Collection**

Allow:

Mission 1

collect 200 kg

Mission 2

collect remaining 300 kg

**35\. Collection Progress**

Track:

target\_mass

collected\_mass

remaining\_mass

Example:

██████████████░░░░░░

72%

**36\. Autonomous Navigation**

Create:

NavigationEngine

It receives:

start

destination

obstacles

weather

restricted areas

shipping routes

and produces:

waypoints

**37\. Collision Avoidance**

The cleanup units must avoid:

other vessels

restricted areas

shallow areas

storms

known hazards

For simulation, implement:

distance threshold

Example:

if distance\_to\_vessel < SAFE\_DISTANCE:

change\_course()

**38\. Dynamic Obstacle**

Example:

USV

↓

🚢

System detects:

COLLISION\_RISK

and creates:

AVOIDANCE\_MANEUVER

**39\. Shipping Integration**

This is where Phase 1 and Phase 4 interact.

The cleanup planner must know:

commercial shipping routes

so cleanup vessels don't unnecessarily interfere with shipping traffic.

**40\. Surveillance Integration**

Phase 3 provides:

dark vessel locations

The cleanup mission should use that information as an operational safety signal.

For example:

cleanup route

│

▼

suspicious vessel detected nearby

│

▼

risk assessment

│

▼

avoid / notify / replan

**41\. Weather Integration**

Phase 2 weather intelligence feeds:

CleanupMissionPlanner

Input:

wind

waves

storms

visibility

Output:

safe / unsafe

**42\. Ocean Current Integration**

Currents affect both:

debris drift

and:

cleanup vessel energy consumption

Therefore:

Current data

│

├──> Debris prediction

│

└──> Route optimization

**43\. Ocean Digital Twin**

The final system should contain a simplified digital representation of the ocean.

Represent:

vessels

debris

weather

currents

routes

protected areas

cleanup units

in one shared spatial environment.

**44\. Digital Twin State**

Conceptually:

OceanState {

vessels

debris

cleanup\_units

weather

currents

protected\_areas

shipping\_routes

active\_missions

}

This becomes the shared world state for all agents.

**45\. Digital Twin Update Cycle**

DATA

↓

NORMALIZATION

↓

WORLD STATE

↓

AGENTS

↓

DECISIONS

↓

ACTIONS

↓

WORLD STATE UPDATE

**46\. Preservation Agent**

Create:

PreservationAgent

Responsibilities:

monitor debris

evaluate environmental risk

prioritize cleanup

request missions

monitor ecosystem risk

**47\. Cleanup Agent**

Create:

CleanupAgent

Responsibilities:

find available units

assign units

plan routes

start missions

monitor missions

replan missions

complete missions

**48\. Fleet Agent**

Create:

FleetCoordinatorAgent

It manages all cleanup units.

Responsibilities:

unit availability

unit battery

unit capacity

unit health

mission allocation

fleet balancing

**49\. Commander**

The final Commander should orchestrate:

Logistics Agent

Weather Agent

Ocean Agent

AIS Agent

Fishing Agent

Anomaly Agent

Preservation Agent

Cleanup Agent

Fleet Agent

Investigation Agent

**50\. Commander Decision Example**

A user asks:

"Clean the highest-risk debris cluster."

Commander:

1\. Find highest-risk debris.

2\. Check drift prediction.

3\. Check weather.

4\. Check currents.

5\. Check protected zones.

6\. Find available cleanup units.

7\. Check battery.

8\. Check collection capacity.

9\. Check nearby vessels.

10\. Calculate routes.

11\. Select best unit(s).

12\. Create mission.

13\. Monitor execution.

**51\. Agent Communication**

Use structured messages.

Example:

{

"event\_type": "CLEANUP\_REQUEST",

"source": "preservation\_agent",

"target": "cleanup\_agent",

"payload": {

"debris\_id": "D-102",

"priority": 91

}

}

**52\. Mission Assignment**

{

"event\_type": "MISSION\_ASSIGNMENT",

"unit\_id": "USV-03",

"debris\_id": "D-102",

"route": \[

\[12.1,72.2\],

\[12.3,72.4\],

\[12.5,72.6\]

\]

}

**53\. Mission Event Stream**

Add:

mission.created

mission.assigned

mission.started

mission.position\_updated

mission.arrived

mission.collection\_started

mission.collection\_progress

mission.replanned

mission.aborted

mission.completed

**54\. Real-Time Mission Monitoring**

Dashboard:

MISSION #M-102

USV:

USV-03

Status:

COLLECTING

Progress:

██████████████░░░ 78%

Collected:

780 kg / 1000 kg

Battery:

62%

ETA:

18 minutes

Risk:

LOW

**55\. Mission Map**

Display:

BASE

│

│

▼

🚤─────────────► ● DEBRIS

│

│ collection

▼

BASE

Also show:

planned route

actual route

debris location

weather

restricted areas

nearby vessels

**56\. Mission Timeline**

10:00 Mission created

10:02 USV assigned

10:05 Mission started

10:21 Arrived at target

10:22 Collection started

10:40 650 kg collected

10:47 Collection completed

10:48 Returning to base

11:02 Mission completed

**57\. Mission Failure**

Handle:

battery failure

communication loss

weather deterioration

navigation error

capacity exceeded

unit malfunction

Example:

USV-02 communication lost

↓

Commander

↓

Mark unit UNKNOWN

↓

Reassign mission

**58\. Communication Loss**

The simulator should model:

CONNECTED

DEGRADED

OFFLINE

If disconnected:

continue safe behavior

and:

attempt reconnection

If timeout exceeded:

RETURN\_TO\_SAFE\_STATE

**59\. Safe State**

For the hackathon:

SAFE\_STATE =

stop collection

+

avoid obstacles

+

return to base

or another predefined fallback.

**60\. Environmental Mission Rules**

The planner must respect:

marine protected areas

no-go zones

sensitive ecosystems

shipping routes

weather restrictions

**61\. Protected Area Handling**

Do not automatically send cleanup units through protected areas unless the simulated rules explicitly permit it.

Instead:

Protected Area

│

▼

Routing Constraint

│

▼

Alternative Route

**62\. Ecological Priority**

A small debris cluster near a sensitive ecosystem may be more urgent than a much larger cluster in open ocean.

Example:

Cluster A:

5 tonnes

Open ocean

Cluster B:

1 tonne

Near protected ecosystem

Priority:

B > A

This demonstrates intelligent decision-making rather than simple nearest-target selection.

**63\. Carbon Optimization**

Calculate:

cleanup\_emissions

and:

cleanup\_distance

Then optimize:

environmental\_benefit

/

operational\_cost

This connects preservation with the original fuel-efficiency objective.

**64\. Environmental Benefit Score**

Example:

environmental\_benefit =

debris\_mass

× ecological\_sensitivity

× urgency

Then:

mission\_efficiency =

environmental\_benefit / energy\_used

**65\. Mission Recommendation**

Commander can explain:

"USV-03 was selected because it can reach the debris cluster 18 minutes faster than USV-01 while requiring 23% less energy and remaining outside the protected area."

This is a strong demonstration of explainable autonomy.

**66\. Analytics Dashboard**

Final system should include:

Total debris detected

Total debris collected

Cleanup missions

Successful missions

Average collection time

Total distance

Energy consumed

Estimated fuel saved

Environmental risk reduced

Protected areas protected

Suspicious vessels detected

**67\. Environmental Impact Dashboard**

Example:

MARINE PRESERVATION

Debris detected 18.4 tonnes

Debris collected 11.7 tonnes

Remaining 6.7 tonnes

Risk reduction 38%

High-risk zones 4

Cleaned zones 7

Active missions 3

**68\. Fleet Dashboard**

AUTONOMOUS FLEET

Available 6

En route 3

Collecting 2

Returning 1

Maintenance 1

Average battery 72%

Total capacity 12.5 tonnes

**69\. Global Risk Dashboard**

Combine Phase 3 + Phase 4:

MARITIME RISK

Shipping Risk LOW

Storm Risk MEDIUM

Fishing Risk HIGH

Debris Risk HIGH

Environmental Risk HIGH

**70\. Unified Ocean Health Score**

Create:

OceanHealthScore

based on:

debris

pollution

fishing pressure

protected-zone violations

weather stress

shipping pressure

Output:

0–100

where higher means healthier.

**71\. Ocean Health Map**

Show regions:

Excellent

Good

Moderate

Poor

Critical

The score should be based on actual simulated/observed metrics rather than arbitrary coloring.

**72\. Historical Ocean Health**

Allow:

Today

7 days

30 days

90 days

Comparison:

Last Month:

62

Current:

78

Improvement:

+16

**73\. Cleanup Impact Visualization**

Show:

BEFORE

██████████████████

Risk: 89

AFTER

████████░░░░░░░░░░

Risk: 41

This visually demonstrates the value of autonomous intervention.

**74\. Natural Language Control**

The operator should be able to say:

"Prioritize marine debris near protected areas."

Commander translates this into:

filter debris

+

increase ecological priority

+

recalculate missions

Another:

"Send the most efficient available cleanup unit."

Commander:

evaluate fleet

+

calculate energy

+

calculate ETA

+

assign unit

**75\. Tool Architecture for LLM**

The LLM should have tools such as:

get\_ocean\_state()

get\_debris()

get\_debris\_risk()

get\_cleanup\_units()

get\_weather()

get\_currents()

get\_vessels()

get\_shipping\_routes()

create\_cleanup\_mission()

replan\_cleanup\_mission()

get\_mission\_status()

get\_environmental\_impact()

**76\. Important LLM Restriction**

The LLM should **not directly manipulate the world state**.

Instead:

LLM

↓

Tool request

↓

Validation

↓

Decision Engine

↓

Action

For example:

LLM:

"Send USV-03."

↓

Mission Validator

↓

Battery check

Capacity check

Weather check

Route check

↓

APPROVED

↓

Mission created

**77\. Decision Validation**

Create:

ActionValidator

Before an agent can execute:

CREATE\_MISSION

REPLAN\_ROUTE

ASSIGN\_UNIT

RETURN\_UNIT

validate:

energy

capacity

route

weather

restricted zones

collision risk

mission conflicts

**78\. Autonomous Decision Levels**

Use three levels.

**Level 1 — Automatic**

Safe routine actions:

route recalculation

minor waypoint change

debris priority update

**Level 2 — Operator notification**

mission reassignment

high-risk area

unexpected vessel

**Level 3 — Human approval**

major operational changes

mission into sensitive area

uncertain high-impact action

This creates responsible autonomy.

**79\. Event-Driven Architecture**

Final system:

EVENT BUS

│

┌─────────────────┼──────────────────┐

▼ ▼ ▼

Logistics Surveillance Preservation

│ │ │

▼ ▼ ▼

Route Events AIS Events Debris Events

│ │ │

└─────────────────┼──────────────────┘

▼

COMMANDER AGENT

│

▼

ACTION EVENTS

**80\. Recommended Technology Stack**

Keep the stack consistent with previous phases.

**Frontend**

React

TypeScript

Vite

Tailwind CSS

MapLibre GL JS

Recharts

**Backend**

Python

FastAPI

Pydantic

SQLAlchemy

**Database**

PostgreSQL

PostGIS

Redis

**Background Processing**

Celery

Redis

or:

Redis Streams

depending on the architecture already selected.

**81\. AI / Agent Layer**

Use:

LLM

LangGraph

Pydantic structured outputs

The important principle is:

Agents

↓

Tools

↓

Deterministic services

↓

Database

rather than letting agents directly manipulate databases.

**82\. Geospatial Stack**

Use:

PostGIS

Shapely

GeoPandas

pyproj

for spatial calculations.

**83\. Routing**

For prototype:

OSRM

or:

GraphHopper

can provide routing.

For marine-specific simulation, you can implement your own grid/graph-based routing where:

nodes = ocean waypoints

edges = navigable paths

weights = distance + energy + risk

**84\. Optimization**

For assignment problems, use:

Google OR-Tools

for:

vehicle routing

assignment

capacity constraints

multi-stop missions

This is particularly useful for Phase 4.

**85\. Computer Vision**

If implementing image-based debris detection:

Python

OpenCV

PyTorch

Ultralytics YOLO

But this should be optional.

For the hackathon MVP:

simulated detections

should remain available.

**86\. Infrastructure**

Use:

Docker

Docker Compose

Git

GitHub

GitHub Actions

Final deployment can use:

AWS / Azure / GCP

but cloud deployment should not be required for the core demo.

**87\. Suggested Repository Structure**

ocean-sentinel/

│

├── frontend/

│ ├── src/

│ │ ├── components/

│ │ ├── pages/

│ │ ├── maps/

│ │ ├── missions/

│ │ ├── vessels/

│ │ ├── debris/

│ │ └── agents/

│ │

│ └── package.json

│

├── backend/

│ ├── app/

│ │ ├── api/

│ │ ├── models/

│ │ ├── schemas/

│ │ ├── services/

│ │ ├── agents/

│ │ ├── simulation/

│ │ ├── routing/

│ │ ├── optimization/

│ │ └── events/

│ │

│ └── requirements.txt

│

├── database/

│ ├── migrations/

│ └── seed/

│

├── simulation/

│ ├── vessels/

│ ├── debris/

│ ├── weather/

│ └── missions/

│

├── agents/

│ ├── commander/

│ ├── preservation/

│ ├── cleanup/

│ ├── fleet/

│ ├── surveillance/

│ └── logistics/

│

├── tests/

│

├── docker-compose.yml

└── README.md

**88\. New Database Tables**

Phase 4 adds:

marine\_debris

debris\_clusters

environmental\_risk

cleanup\_units

cleanup\_missions

mission\_waypoints

mission\_events

unit\_telemetry

collection\_records

ocean\_health

drift\_predictions

fleet\_assignments

**89\. Telemetry Model**

Create:

UnitTelemetry

Fields:

unit\_id

timestamp

latitude

longitude

speed

heading

battery

fuel

current\_load

status

This powers the live dashboard.

**90\. Mission Waypoints**

MissionWaypoint

mission\_id

sequence

latitude

longitude

planned\_arrival

actual\_arrival

status

Status:

PENDING

CURRENT

COMPLETED

SKIPPED

**91\. Mission Events**

Store:

MissionEvent

mission\_id

event\_type

timestamp

location

metadata

This creates a complete mission audit trail.

**92\. APIs**

Add:

GET /api/v1/debris

GET /api/v1/debris/{id}

GET /api/v1/debris/clusters

GET /api/v1/debris/risk

GET /api/v1/debris/drift

**93\. Cleanup APIs**

GET /api/v1/cleanup/units

GET /api/v1/cleanup/missions

GET /api/v1/cleanup/missions/{id}

POST /api/v1/cleanup/missions

POST /api/v1/cleanup/missions/{id}/start

POST /api/v1/cleanup/missions/{id}/abort

POST /api/v1/cleanup/missions/{id}/replan

**94\. Fleet APIs**

GET /api/v1/fleet

GET /api/v1/fleet/units

GET /api/v1/fleet/telemetry

**95\. Ocean Health APIs**

GET /api/v1/ocean/health

GET /api/v1/ocean/health/history

GET /api/v1/ocean/risk-map

**96\. Commander APIs**

POST /api/v1/commander/query

GET /api/v1/commander/activity

GET /api/v1/commander/decisions

**97\. WebSocket**

Use WebSocket for real-time:

/v1/ws/maritime

Events:

vessel\_updated

debris\_detected

risk\_updated

mission\_updated

unit\_position\_updated

weather\_updated

agent\_activity

**98\. Frontend Final Pages**

Build:

1\. Command Center

2\. Ocean Map

3\. Vessel Surveillance

4\. Vessel Investigation

5\. Debris Intelligence

6\. Cleanup Missions

7\. Autonomous Fleet

8\. Ocean Health

9\. Analytics

10\. Agent Activity

11\. Scenario Simulator

**99\. Command Center**

The landing page should summarize the entire system:

┌────────────────────────────────────────────┐

│ OCEAN SENTINEL │

│ AUTONOMOUS MARITIME AI │

├────────────────────────────────────────────┤

│ │

│ Ocean Health 82 │

│ Maritime Risk LOW │

│ Debris Risk HIGH │

│ Fishing Risk MEDIUM │

│ │

│ Active Missions 4 │

│ Suspicious Vessels 7 │

│ Debris Collected 12.8 tonnes │

│ │

├────────────────────────────────────────────┤

│ LIVE MAP │

│ │

│ 🚢 🔴 │

│ 🚤 │

│ ● debris │

│ │

└────────────────────────────────────────────┘

**100\. Debris Intelligence Page**

Display:

DEBRIS CLUSTERS

Cluster Mass Risk Priority

D-101 4.2t 91 CRITICAL

D-102 1.1t 72 HIGH

D-103 0.7t 44 MEDIUM

Clicking a cluster opens:

location

type

mass

risk

drift prediction

nearby protected areas

recommended action

**101\. Autonomous Fleet Page**

USV-01

🟢 AVAILABLE

Battery 91%

USV-02

🔵 EN ROUTE

Battery 74%

USV-03

🟠 COLLECTING

Battery 61%

USV-04

⚫ MAINTENANCE

**102\. Agent Activity Page**

This makes the AI aspect visible to judges.

Example:

10:31:04

Preservation Agent

Detected high-risk debris cluster D-102.

10:31:05

Risk Engine

Environmental risk = 87.

10:31:06

Cleanup Agent

Requested available units.

10:31:07

Fleet Agent

USV-03 selected.

10:31:08

Routing Agent

Optimal route generated.

10:31:09

Commander

Mission M-102 approved.

10:31:10

USV-03

Mission started.

**103\. Autonomous Reasoning Panel**

Show:

WHY DID THE SYSTEM CHOOSE USV-03?

Distance:

18.2 km

USV-01:

31.4 km

Battery:

USV-03 = 84%

Capacity:

USV-03 = 2.1 tonnes

Weather:

Safe

Protected area:

Avoided

Decision:

USV-03

This is extremely valuable in a hackathon presentation.

**104\. Simulation Center**

Create a dedicated page:

MARITIME SIMULATOR

Scenario:

○ Normal Ocean

○ Storm

○ Dark Vessel

○ Illegal Fishing Pattern

○ Debris Cluster

○ Multiple Debris

○ Cleanup Mission

○ Combined Crisis

\[START SCENARIO\]

**105\. Ultimate Demo Scenario**

Your final demonstration should combine **all four phases**.

**Step 1**

A cargo vessel requests a route.

Route Agent

→ optimal fuel-efficient route

**Step 2**

Weather changes.

Weather Agent

→ storm detected

**Step 3**

Route is automatically recalculated.

Commander

→ new safe route

**Step 4**

Surveillance detects a fishing vessel.

AIS Agent

→ AIS gap

**Step 5**

Fishing Agent detects:

fishing-like behavior

+

restricted-zone activity

**Step 6**

Risk engine:

Risk = 86

**Step 7**

Investigation case created.

**Step 8**

At the same time:

Debris detection

finds:

4.5 tonne debris cluster

**Step 9**

Preservation Agent:

Environmental risk = 91

**Step 10**

Cleanup Agent:

USV-03 selected

**Step 11**

Route planner calculates:

safe + energy-efficient route

**Step 12**

During mission:

storm changes

**Step 13**

Commander automatically:

replans mission

**Step 14**

USV collects debris.

**Step 15**

Ocean health improves.

Before:

62

After:

81

This gives you a complete narrative:

**The system observes the ocean → understands the environment → detects threats → predicts consequences → plans interventions → autonomously executes safe missions → measures the environmental outcome.**

**106\. Phase 4 Implementation Order**

Do not start with the LLM.

Build deterministic infrastructure first.

**Stage 1 — Debris**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris schema
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris provider
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Simulation data
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Spatial clustering

**Stage 2 — Environmental Intelligence**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental risk
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Drift prediction
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup priority
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Protected-area interaction

**Stage 3 — Autonomous Fleet**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup unit schema
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Unit simulator
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Telemetry
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Battery model
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Capacity model

**Stage 4 — Missions**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission schema
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission lifecycle
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Waypoints
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission events
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission monitoring

**Stage 5 — Optimization**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Unit assignment
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route optimization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Capacity constraints
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Energy constraints
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Multi-unit missions

**Stage 6 — Autonomy**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dynamic replanning
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather response
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris drift response
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Unit failure response
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Collision avoidance

**Stage 7 — Agents**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Preservation Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fleet Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Commander integration

**Stage 8 — Digital Twin**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Shared world state
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Real-time updates
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission simulation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Historical replay

**Stage 9 — Dashboard**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Command center
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris map
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fleet map
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean health
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent activity

**Stage 10 — Intelligence Interface**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Natural-language queries
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Tool calling
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Explainable decisions
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Decision validation

**Stage 11 — Testing**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Unit tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Integration tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Simulation tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Failure tests
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)E2E tests

**Stage 12 — Final Demo**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Prepare scenario
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Seed deterministic data
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Run complete system
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Verify all agents
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Verify dashboard
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Verify autonomous mission
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Record fallback demo

**107\. Phase 4 Testing Requirements**

**Debris tests**

single debris

multiple debris

duplicate detection

incorrect detection

cluster formation

**Drift tests**

zero current

constant current

changing current

storm-driven movement

**Fleet tests**

low battery

full capacity

unit failure

multiple available units

no available units

**Routing tests**

shortest route

energy-efficient route

restricted zone

storm

moving debris

**Mission tests**

create

assign

start

collect

return

complete

abort

replan

**108\. Critical Failure Scenarios**

The final system must test:

Database unavailable

AIS unavailable

Weather unavailable

LLM unavailable

Routing service unavailable

Cleanup unit offline

WebSocket disconnect

External API timeout

Invalid debris coordinates

Duplicate mission

The system should degrade gracefully.

**109\. Offline / Demo Mode**

For a hackathon, provide:

DEMO\_MODE=true

In demo mode:

AIS → simulator

Weather → simulator

Currents → simulator

Debris → simulator

Fleet → simulator

Satellite → simulator

This guarantees the presentation works even without internet access.

**110\. Deterministic Demo Seed**

Use:

SIMULATION\_SEED=42

so the same scenario produces the same result.

This is extremely useful during judging.

**111\. Logging**

Every agent action should log:

timestamp

agent

event

input

decision

confidence

action

result

Example:

\[10:32:41\]

CleanupAgent

Input:

D-102

Decision:

Assign USV-03

Reason:

Lowest energy + sufficient capacity

Result:

Mission M-102 created

**112\. Observability**

Use:

structured JSON logs

and optionally:

Prometheus

Grafana

for metrics.

Track:

agent latency

mission latency

API latency

event throughput

failed missions

replanning frequency

**113\. Security**

Final system should include:

JWT authentication

RBAC

API validation

rate limiting

secret management

audit logs

**114\. Human Approval**

The final architecture should always allow:

AI recommendation

↓

Human approval

↓

Execution

for high-impact actions.

**115\. Explainability**

Every autonomous decision should have:

WHAT?

WHY?

DATA?

CONFIDENCE?

EXPECTED RESULT?

Example:

ACTION

Deploy USV-03

WHY

Highest environmental priority cluster

DATA

Risk = 91

Distance = 18.2 km

Capacity = 2.1 tonnes

CONFIDENCE

0.93

EXPECTED RESULT

Remove approximately 1.8 tonnes

**116\. Final Project Feature Set**

After Phase 4, your complete platform will contain:

**Maritime logistics**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fuel-efficient routing
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather-aware routing
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Current-aware routing
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Route risk scoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dynamic rerouting
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)ETA prediction

**Maritime surveillance**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS monitoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dark-vessel detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gap analysis
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing behavior detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Zone violation detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel rendezvous
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Behavioral anomaly detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Risk scoring
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Evidence generation
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Investigation cases

**Ocean preservation**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris detection
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris clustering
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris classification
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental risk
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Drift prediction
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup prioritization
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Autonomous cleanup missions
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fleet coordination
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Energy management
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Dynamic mission replanning
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Collision avoidance
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Collection tracking
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean health score

**AI**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Maritime Commander
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Logistics Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Weather Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Anomaly Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Investigation Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Preservation Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Cleanup Agent
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fleet Agent

**Visualization**

*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Digital ocean map
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Vessel trails
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)AIS gaps
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Fishing heatmap
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Debris heatmap
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Environmental risk map
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Autonomous fleet
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission routes
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Mission replay
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Ocean health
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Agent activity
*   ![](data:image/x-wmf;base64,183GmgAAAAAAAB4AGgB4AAAAAABtVwEACQAAA/oBAAABAJ8BAAAAAAQAAAADAQgABQAAAAsCAAAAAAUAAAAMAhoAHgADAAAAHgAHAAAA/AIAAP///wAAAAQAAAAtAQAACQAAAB0GIQDwABoAHgAAAAAABAAAAC0BAAAJAAAAHQYhAPAAGgAMAAAAEgAFAAAACwIAAAAABQAAAAwCGgAeAAUAAAABAv///wAFAAAALgEAAAAABQAAAAIBAQAAAJ8BAABACSAAzAAAAAAAEAAQAAUAAQAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////oKCg4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlp////////////////////////////////////////////////4+Pj////oKCgaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp4+Pj////oKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg////BAAAACcB//8DAAAAAAA=)Decision explanations

**117\. Final System Architecture**

The finished project should conceptually become:

┌───────────────────────┐

│ OPERATOR │

└───────────┬───────────┘

│

▼

┌───────────────────────┐

│ COMMAND CENTER │

└───────────┬───────────┘

│

▼

┌────────────────────────────────┐

│ MARITIME COMMANDER │

│ │

│ PLAN → REASON → VALIDATE │

│ → ACT → MONITOR │

└───────────────┬────────────────┘

│

┌─────────────────────────┼─────────────────────────┐

│ │ │

▼ ▼ ▼

┌──────────────┐ ┌──────────────┐ ┌──────────────┐

│ LOGISTICS │ │ SURVEILLANCE │ │ PRESERVATION │

│ AGENTS │ │ AGENTS │ │ AGENTS │

└──────┬───────┘ └──────┬───────┘ └──────┬───────┘

│ │ │

▼ ▼ ▼

Routes/Fuel AIS/Fishing Debris

Weather Dark Vessels Drift

Currents Anomalies Cleanup

│ │ │

└────────────────────────┼────────────────────────┘

│

▼

┌──────────────────┐

│ DECISION ENGINE │

└────────┬─────────┘

│

▼

┌──────────────────┐

│ OCEAN DIGITAL │

│ TWIN │

└────────┬─────────┘

│

┌──────────────────┼─────────────────┐

▼ ▼ ▼

COMMERCIAL SURVEILLANCE CLEANUP

VESSELS EVENTS FLEET

│ │ │

└──────────────────┼─────────────────┘

▼

┌──────────────────┐

│ OCEAN OUTCOME │

│ │

│ Fuel Saved │

│ Threats Found │

│ Debris Removed │

│ Risk Reduced │

│ Ocean Health │

└──────────────────┘

**118\. Final Definition of Done — Entire Project**

The project should be considered complete only when the system can demonstrate this complete loop:

OBSERVE

↓

UNDERSTAND

↓

PREDICT

↓

PRIORITIZE

↓

PLAN

↓

VALIDATE

↓

ACT

↓

MONITOR

↓

REPLAN

↓

MEASURE IMPACT

↓

LEARN

Applied to the ocean:

Sensors / AIS / Weather / Satellite

↓

Ocean Digital Twin

↓

Autonomous Agents

↓

Risk Assessment

↓

Maritime Commander

↓

┌──────────────┼──────────────┐

▼ ▼ ▼

Shipping Surveillance Preservation

▼ ▼ ▼

Fuel saved Threats Debris removed

detected

└──────────────┼──────────────┘

▼

Healthier Ocean

**That should be the final product vision:** not three disconnected AI demos, but **one autonomous maritime operating system** in which logistics, surveillance, environmental intelligence, and robotic preservation continuously share the same ocean state and coordinate their decisions.
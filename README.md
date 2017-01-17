# test-simulations-mgmt-repo

### What
This repo is a sample submission and evaluation tool for Simulations 2.0 Outputs.

### Why
Outputs are artifacts that are created, which demonstrate a learner's capabilities. A file, message, video, screenshot, or documented reflection or feedback are all examples of outputs.

Outputs are important because they provide an opportunity for Simulations Fellows to practice and demonstrate their skills in a way that enables the exchange of targeted feedback.

Outputs can be designed in a way that enables scalable learning facilitation. Any interaction that requires a Facilitator to be live and present to deliver feedback to the learner is inherently less scalable than one in which performance can be reviewed and feedback can be delivered asyncronously. If, for example, an interaction where a Fellow pairs with a Product Owner on a UI/UX design upgrade results in an output of a html/css mockup and documented review, then a facilitator can review this output at a later time in a way that is much more efficient than it would be if they had to be present during the interaction. Many of the outputs we are designing now for Simulations 2.0 will provide the foundation for outputs that are eventually migrated to pre-Fellowship and enable the learning of a much broader audience.

### How
The Curriculum Manager and Program Designer, Simulations are kicking off this initiative by defining "Supercontexts" (e.g. "Getting Started with a Team", "Developing Software with Agile", "Contributing to an Environment in which the Team Thrives"), defining the experiences that occur within each supercontext (e.g. "Kickoff Call", "Daily Standups", "Suggesting Improvements to Team Workflow") and outputs associated with each experience. This repo is an alpha version of a tool that Facilitators can use to organize the submission and review of outputs by Fellows on their team.

Distributed design is our mantra in the Learning Department. This work is intended to kick start the process of revamping our outputs and the output submission and review process. If you are a Facilitator, your participation int he design of this initiative is critical. Please review the instructions below and share your concerns, desires, and suggestions on how we can integrate this initiative into Simulations.

Read the instructins below, get started, ask questions, and lets build yet another powerful learning mechanism.

## Instructions
##### Embrace co-design...
- If you are reading this, you are a codesigner of this initiative! We need you to evolve this tool and its contents to best suit the needs of Andela Simulations. Jump in, make suggestions, ask questions, and lets design towards more impactful learning experiences together!

##### How are branches structured?
- master: the Simulations-approved suite of supercontexts, experiences, and outputs
- facilitator: each Facilitator sets up a branch of their own, identical to the master
- facilitator-team: for each team, the Facilitator sets up a branch off of their own branch, with which each Fellow will have their own personal branch for output submission
- facilitator-team-fellow: this is the branch that an individual Fellow will use to submit outputs and receive feedback on individual outputs. Example -- njira-croners-njoroge

##### How are folders structured within branches?
Branch >> Supercontext >> Experience >> Output >> README
***Example***:
njira-croners-njoroge >> getting-started-with-a-team >> kickoff-call >> README

##### How are Outputs submitted and reviewed?
When a Fellow wants to submit an output, they find their personal branch, click through to the folder associated with the output, and submit a pull request containing the output. 

The Facilitator can then comment on the output and request revision if necessary.

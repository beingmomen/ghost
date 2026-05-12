<template>
  <UPage dir="ltr">
    <SdlcHero :phases="phases" />
    <SdlcTimeline :phases="phases" />

    <SdlcPhaseSection
      v-for="phase in phases"
      :key="phase.id"
      :phase="phase"
    />

    <SdlcWorkflow />
    <SdlcDecisions />
  </UPage>
</template>

<script setup>
useHead({
  title: 'SDLC Visual Framework — Architect\'s Playbook',
  meta: [
    {
      name: 'description',
      content:
        'A cognitive visual framework for the Software Development Life Cycle — phases, roles, OOA&D workflow, UML diagrams, and decision flows.'
    }
  ]
})

useSeoMeta({
  ogTitle: 'SDLC Visual Framework — Architect\'s Playbook',
  ogDescription: 'A visual framework for understanding the complete Software Development Life Cycle.',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'SDLC Visual Framework',
  twitterDescription: 'Phases, roles, OOA&D workflow, UML diagrams, and decision flows.',
  twitterSite: '@beingmomen'
})

useBreadcrumbSchema([{ name: 'SDLC Visual Framework', path: '/sdlc' }])

const config = useRuntimeConfig()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': 'SDLC Visual Framework — Architect\'s Playbook',
        'description': 'A cognitive visual framework for the Software Development Life Cycle — phases, roles, OOA&D workflow, UML diagrams, and decision flows.',
        'author': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري'
        },
        'url': `${config.public.siteUrl}/sdlc`,
        'inLanguage': 'en'
      })
    }
  ]
})

const phases = [
  {
    id: 'analysis',
    num: '01',
    color: 'cyan',
    title: 'Analysis',
    tagline: 'Understand the problem before solving it',
    layerA: {
      title: 'What is this phase?',
      body: 'Transform vague stakeholder expectations into precise, documented requirements. Define what the system must do — never how it should do it.',
      output: 'Requirements Specification Document'
    },
    layerB: {
      title: 'Requirements Breakdown',
      items: [
        'Vision — The big picture and project goals',
        'Functional Requirements — What the system does',
        'Non-Functional Requirements — Performance, security, and scalability',
        'Constraints — Hard limits and boundaries',
        'Assumptions — Accepted unknowns'
      ]
    },
    layerC: {
      title: 'Decision Checkpoints',
      items: [
        'Is the vision clear to ALL stakeholders?',
        'Are requirements measurable and testable?',
        'Are constraints documented explicitly?',
        'Have assumptions been validated?',
        'Can non-functional requirements be measured?'
      ]
    },
    meta: {
      roles: 'Product Owner · Project Manager · Business Analyst · CTO',
      question: 'What problem are we solving?',
      trigger: 'All requirements are reviewed and signed off',
      risk: 'Building the entirely wrong system'
    }
  },
  {
    id: 'design',
    num: '02',
    color: 'violet',
    title: 'Design',
    tagline: 'Translate requirements into architectural blueprints',
    layerA: {
      title: 'What is this phase?',
      body: 'Convert functional requirements into system structures. Define the problem domain, establish boundaries, model use cases, and define architectural decomposition.',
      output: 'Architectural Blueprint and UML Diagrams'
    },
    layerB: {
      title: 'Design Activities',
      items: [
        'Problem Domain — Define system boundaries',
        'Mission Use Cases — Core system purpose flows',
        'System Use Cases — All user-system interactions',
        'Actors — Who interacts with the system',
        'Architectural Decomposition — Layers, modules, and interfaces'
      ]
    },
    layerC: {
      title: 'Decision Checkpoints',
      items: [
        'Are domain boundaries drawn explicitly?',
        'Are ALL actors (human and system) identified?',
        'Do use cases cover every user goal?',
        'Is the architecture scalable for future requirements?',
        'Are external interfaces and APIs defined?'
      ]
    },
    meta: {
      roles: 'System Architect · UX/UI Designer',
      question: 'How will the system be structured?',
      trigger: 'Architecture is reviewed and approved by the team',
      risk: 'Unscalable, brittle codebase from day one'
    }
  },
  {
    id: 'development',
    num: '03',
    color: 'emerald',
    title: 'Development',
    tagline: 'Turn architectural design into working, tested code',
    layerA: {
      title: 'What is this phase?',
      body: 'Implement the designed architecture. Frontend and backend teams build the system following the approved specifications, data models, and workflow designs.',
      output: 'Working Source Code and Unit Tests'
    },
    layerB: {
      title: 'Build Activities',
      items: [
        'Entities (Data Model) — Define data structures',
        'Flowcharts — Implement application logic flow',
        'Pseudocode — Plan logic before writing code',
        'Sequence Diagrams — Object interaction ordering',
        'Frontend and Backend — UI, APIs, business logic, and database'
      ]
    },
    layerC: {
      title: 'Decision Checkpoints',
      items: [
        'Does the code match the approved architecture?',
        'Are coding standards enforced via peer reviews?',
        'Are edge cases and null values handled?',
        'Is unit test coverage adequate?',
        'Is pseudocode drafted before coding?'
      ]
    },
    meta: {
      roles: 'Frontend Developer · Backend Developer',
      question: 'Does the code correctly implement the design?',
      trigger: 'Feature complete and code reviews passed',
      risk: 'Technical debt compounds rapidly'
    }
  },
  {
    id: 'testing',
    num: '04',
    color: 'amber',
    title: 'Testing',
    tagline: 'Validate every behavior against its requirements',
    layerA: {
      title: 'What is this phase?',
      body: 'Systematically verify that the system meets every requirement. Find and eliminate defects before they reach real users in production.',
      output: 'Test Reports and Bug-Free Release Candidate'
    },
    layerB: {
      title: 'Testing Types',
      items: [
        'Unit Testing — Individual component correctness',
        'Integration Testing — Combined module behavior',
        'System Testing — Full end-to-end flows',
        'UAT — User acceptance validation',
        'Performance Testing — Load, stress, and scalability'
      ]
    },
    layerC: {
      title: 'Decision Checkpoints',
      items: [
        'Are ALL use cases covered by tests?',
        'Are non-functional requirements validated?',
        'Are test cases traceable to requirements?',
        'Is regression testing automated?',
        'Has the product owner signed off on UAT?'
      ]
    },
    meta: {
      roles: 'Solutions Architect · QA Engineer · Tester · DevOps',
      question: 'Does the system do exactly what we promised?',
      trigger: 'All critical bugs resolved and test coverage met',
      risk: 'Production failures and broken user trust'
    }
  },
  {
    id: 'deployment',
    num: '05',
    color: 'orange',
    title: 'Deployment',
    tagline: 'Release to the live production environment safely',
    layerA: {
      title: 'What is this phase?',
      body: 'Move the tested system into the live production environment. Configure infrastructure, run migrations, activate monitoring, and execute the go-live plan.',
      output: 'Live System and Deployment Documentation'
    },
    layerB: {
      title: 'Deployment Activities',
      items: [
        'Environment Setup — Servers, configurations, and secrets',
        'Database Migration — Schema and seed data',
        'CI/CD Pipeline — Automated release processes',
        'Smoke Testing — Post-deployment verification',
        'Rollback Plan — Defined revert strategy'
      ]
    },
    layerC: {
      title: 'Decision Checkpoints',
      items: [
        'Is a rollback strategy clearly defined?',
        'Are monitoring and alerts active?',
        'Is the deployment window communicated to stakeholders?',
        'Are secrets and configurations secured?',
        'Is data migration reversible?'
      ]
    },
    meta: {
      roles: 'Database Administrator · DevOps',
      question: 'Is the system safely live for end users?',
      trigger: 'System is stable in production and users are onboarded',
      risk: 'Data loss, downtime, and security exposures'
    }
  },
  {
    id: 'maintenance',
    num: '06',
    color: 'pink',
    title: 'Maintenance',
    tagline: 'Sustain, evolve, and continuously improve the live system',
    layerA: {
      title: 'What is this phase?',
      body: 'Monitor and keep the system healthy. Respond to user feedback, patch production bugs, and feed learnings into the next SDLC iteration.',
      output: 'Patches, Updated Docs, and Next Iteration Feed'
    },
    layerB: {
      title: 'Maintenance Types',
      items: [
        'Corrective — Fix reported production bugs',
        'Adaptive — Adjust to environment changes',
        'Perfective — Performance improvements',
        'Preventive — Refactoring and reducing tech debt'
      ]
    },
    layerC: {
      title: 'Decision Checkpoints',
      items: [
        'Is monitoring surfacing real issues early?',
        'Is user feedback channeled into the backlog?',
        'Are hotfixes following a proper process?',
        'When does the next SDLC cycle start?'
      ]
    },
    meta: {
      roles: 'Users · Testers · Support',
      question: 'Is the system still meeting real user needs?',
      trigger: 'Major new requirements identified',
      risk: 'System decay and user abandonment'
    }
  }
]
</script>

<script setup>
defineProps({
  phases: {
    type: Array,
    required: true
  }
})

const phaseRoles = {
  analysis: ['Product Owner', 'Project Manager', 'Business Analyst', 'CTO'],
  design: ['System Architect', 'UX/UI Designer'],
  development: ['Frontend Developer', 'Backend Developer'],
  testing: ['Solutions Architect', 'QA Engineer', 'Tester', 'DevOps'],
  deployment: ['Database Administrator', 'DevOps'],
  maintenance: ['End Users', 'Testers', 'Technical Support']
}

const roleDetails = {
  'Product Owner': { summary: 'Represents the product vision and prioritizes requirements on behalf of stakeholders. Manages the Product Backlog and decides what to build first to maximize product value.' },
  'Project Manager': { summary: 'Coordinates team work, manages timelines, resources, and risks. Ensures project delivery on time and within budget through effective communication with all parties.' },
  'Business Analyst': { summary: 'Gathers and documents stakeholder requirements. Bridges the gap between business needs and technical solutions to ensure the team fully understands what is being built and why.' },
  'CTO': { summary: 'Leads the company\'s technical strategy and oversees infrastructure and engineering teams. Ensures technology decisions align with business goals and long-term vision.' },
  'System Architect': { summary: 'Designs the overall technical architecture of the system and selects appropriate architectural patterns and technologies. Ensures component integration and meets performance, security, and scalability requirements.' },
  'UX/UI Designer': { summary: 'Designs user experience and application interface from wireframes to final mockups. Aims to make the product visually appealing, user-friendly, and aligned with real user needs.' },
  'Frontend Developer': { summary: 'Transforms UX/UI designs into interactive interfaces that users directly interact with. Ensures performance and responsiveness across devices and browsers while maintaining code quality standards.' },
  'Backend Developer': { summary: 'Builds application business logic, APIs, and databases. Responsible for system performance, security, stability, and efficient data processing.' },
  'Solutions Architect': { summary: 'Designs integrated technical solutions connecting technical strategy with practical implementation. Oversees solution-to-requirement alignment and ensures overall architecture quality.' },
  'QA Engineer': { summary: 'Ensures software quality by designing and executing test plans. Prevents defects from reaching end users and sets quality standards for the entire team.' },
  'Tester': { summary: 'Tests software manually or automatically to find bugs. Verifies the system works according to defined specifications and documents defects clearly for the development team.' },
  'DevOps': { summary: 'Bridges development and operations to automate build, deployment, and monitoring processes. Ensures environment stability, delivery speed, and system reliability in production.' },
  'Database Administrator': { summary: 'Manages and maintains databases, ensuring their performance, security, and availability. Oversees migration, backup, and disaster recovery operations.' },
  'End Users': { summary: 'Use the system in production and provide real feedback that shapes improvement direction in the next cycle. Their satisfaction is the true measure of product success.' },
  'Testers': { summary: 'Participate in continuous post-deployment testing to verify system stability and performance in production, and detect early quality regressions between releases.' },
  'Technical Support': { summary: 'Responds to and resolves user issues. Represents the first line in the post-launch support chain, documenting recurring bugs and routing them to the engineering team.' }
}

const modalOpen = ref(false)
const activeRole = ref(null)
const activePhase = ref(null)

function openModal(role, phase) {
  activeRole.value = role
  activePhase.value = phase
  modalOpen.value = true
}
</script>

<template>
  <UPageSection
    title="6 Phases · Roles at a Glance"
    description="Every phase has distinct stakeholders, inputs, and outputs. The cycle is iterative — not strictly linear."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-xl sm:text-2xl font-medium',
      description: 'text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(phase, index) in phases"
        :key="phase.id"
        class="animate-fade-in"
        :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
      >
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300">
          <div class="flex items-center gap-2 mb-3">
            <UBadge
              :label="phase.num"
              color="primary"
              variant="subtle"
              size="xs"
            />
            <span class="text-base font-semibold">{{ phase.title }}</span>
          </div>
          <USeparator class="mb-3" />
          <ul class="space-y-2">
            <li
              v-for="role in phaseRoles[phase.id]"
              :key="role"
              class="text-base text-muted hover:text-primary cursor-pointer transition-colors duration-200"
              @click="openModal(role, phase)"
            >
              {{ role }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <UModal
      :open="modalOpen"
      :title="activeRole"
      :description="activePhase?.title"
      :ui="{ content: '[direction:ltr] text-left' }"
      @update:open="modalOpen = $event"
    >
      <template #body>
        <p class="text-base text-muted leading-relaxed">
          {{ roleDetails[activeRole]?.summary }}
        </p>
      </template>
    </UModal>
  </UPageSection>
</template>

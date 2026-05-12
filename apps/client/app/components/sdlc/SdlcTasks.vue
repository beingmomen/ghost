<script setup>
const tasks = [
  {
    title: 'Read Requirements from Ch12',
    desc: 'Extract and document all requirements from the Vacation Tracking System chapter. Create a shared requirements document the whole team can reference.',
    tags: ['Vision', 'Functional Requirements', 'Non-Functional Requirements', 'Constraints']
  },
  {
    title: 'Define the Problem Domain',
    desc: 'Establish system boundaries. Identify what is inside and outside the scope of the Vacation Tracking System. Document what the system is — and explicitly what it is not.',
    tags: ['Domain Boundaries', 'Scope Definition', 'Entity Identification']
  },
  {
    title: 'List Actors of the System',
    desc: 'Identify every human and system actor that will interact with the Vacation Tracking System. Classify each as primary, secondary, or system actor.',
    tags: ['Primary Actors', 'Secondary Actors', 'System Actors']
  },
  {
    title: 'Build Use Cases — "Manage Time"',
    desc: 'For each use case, produce four artifacts that together fully specify the behavior. These become the foundation for development and testing.',
    tags: ['Entities (Data Model)', 'Flowchart [Flow]', 'Sequence Diagram', 'Pseudocode']
  }
]
</script>

<template>
  <UPageSection
    title="Team Workflow"
    description="Concrete tasks for the Vacation Tracking System (Ch12) — the applied project for this OOA&D mentorship program."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-xl sm:text-2xl font-medium',
      description: 'text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="space-y-4">
      <div
        v-for="(task, index) in tasks"
        :key="task.title"
        class="animate-fade-in"
        :style="{ animationDelay: `${0.1 + index * 0.12}s` }"
      >
        <div class="flex gap-4 items-start">
          <div class="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
            {{ index + 1 }}
          </div>
          <div class="flex-1 rounded-xl border border-default/60 bg-elevated/30 p-4 sm:p-5 hover:bg-elevated/60 transition-colors duration-300">
            <h3 class="text-base font-semibold mb-1">
              {{ task.title }}
            </h3>
            <p class="text-base text-muted leading-relaxed mb-3">
              {{ task.desc }}
            </p>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in task.tags"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="subtle"
                size="xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>

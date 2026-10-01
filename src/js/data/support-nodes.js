const support = (fields) => ({ kind: 'support', owner: 'Workflow artifact', executor: 'None (passive)', mode: 'REFERENCE', ...fields });

export const supportNodes = {
  'repo-context': support({
    category: 'REPOSITORY / MEMORY',
    title: 'Codebase context',
    summary: 'Existing patterns and system knowledge that agents consult while designing and building.',
    trigger: 'Read by agents on demand',
    inputs: 'Repository history, conventions, documentation.',
    outputs: 'Context for design decisions.',
    guardrails: ['Read-only for agents.', 'Kept current by the team.'],
    notes: 'Shown with a dashed link because it informs decisions without being a step.',
  }),
  tasks: support({
    category: 'ARTIFACT / TASK LIST',
    title: 'Atomic tasks & interfaces',
    summary: 'Small, independent work items with defined interfaces, produced by the architect.',
    trigger: 'Architecture complete',
    inputs: 'System design.',
    outputs: 'Task list consumed by the orchestrator.',
    guardrails: ['Each task is independently implementable.', 'Interfaces are fixed before work begins.'],
    notes: 'The contract that lets developer agents work in parallel without colliding.',
  }),
  dossier: support({
    category: 'ARTIFACT / PR DOSSIER',
    title: 'Consolidated PR dossier',
    summary: 'One bundle with the diff, test results, and review notes that the human decides on.',
    trigger: 'Both QA agents finished',
    inputs: 'Diff, test results, review notes.',
    outputs: 'Single evidence package for the final gate.',
    guardrails: ['Contains unedited agent results.', 'Is the only basis for the approval decision.'],
    notes: 'Reduces the human review to one place with all evidence.',
  }),
  staging: support({
    category: 'DELIVERY / COMPLETE',
    title: 'Staging deployment',
    summary: 'The approved change deployed to staging with updated documentation.',
    trigger: 'Release package ready',
    inputs: 'Release package.',
    outputs: 'Running staging environment.',
    guardrails: ['Reached only through the final human gate.', 'Documentation is updated with the deployment.'],
    notes: 'End of the workflow. Promotion beyond staging is outside this diagram.',
  }),
};

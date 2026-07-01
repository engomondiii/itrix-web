import type { ReviewStep, PressureSignal } from '@/types/review.types';
import type { QualificationQuestion, PlatformEnvironment, QuestionId } from '@/types/qualification.types';

/**
 * Review flow config. v3.0: the funnel is a two-stage conversation ending in a
 * "preparing" hand-off to the token-gated customized page (/c/[token]). The old
 * 'result'/'confirmation' steps are retired; 'preparing' + 'diagnosed' are added.
 * 'result' is kept in the union for backward-compat with persisted stores.
 */
export const REVIEW_STEPS: ReviewStep[] = ['prompt', 'qualify', 'preparing', 'diagnosed'];

/** Two-stage grouping of the preserved Q1–Q9 (see lib/content/qualificationQuestions). */
export const REVIEW_STAGE_QUESTION_IDS: Record<'stage_1' | 'stage_2', QuestionId[]> = {
  stage_1: ['Q2', 'Q6', 'Q1', 'Q3', 'Q5'],
  stage_2: ['Q7', 'Q4', 'Q8', 'Q9'],
};

/** Seven AI-aggravated pressure areas (Knowledge Core section 7). */
export const PRESSURE_SIGNALS: PressureSignal[] = [
  { area: 'cost', label: 'Cost', prompt: 'Computation is becoming too expensive' },
  { area: 'speed', label: 'Speed', prompt: 'Our workload is too slow' },
  { area: 'stability_accuracy', label: 'Stability & accuracy', prompt: 'Accuracy or stability is difficult to maintain' },
  { area: 'energy', label: 'Energy', prompt: 'Energy consumption is becoming a constraint' },
  { area: 'hardware_utilization', label: 'Hardware utilization', prompt: 'Hardware utilization is not good enough' },
  { area: 'architecture', label: 'Architecture', prompt: 'We are exploring a new computational architecture' },
  { area: 'memory_data_movement', label: 'Memory & data movement', prompt: 'Moving data dominates the runtime' },
];

export const PLATFORM_ENVIRONMENTS: PlatformEnvironment[] = [
  { value: 'matlab_julia', label: 'MATLAB / Julia', family: 'numerical' },
  { value: 'python_scipy', label: 'Python / SciPy / NumPy', family: 'numerical' },
  { value: 'r_sas', label: 'R / SAS', family: 'numerical' },
  { value: 'simulink_modelica', label: 'Simulink / Modelica', family: 'simulation' },
  { value: 'cae', label: 'CAE (ANSYS / Abaqus / COMSOL / OpenFOAM)', family: 'simulation' },
  { value: 'ai_ml', label: 'PyTorch / TensorFlow / JAX', family: 'ai_ml' },
  { value: 'native', label: 'C / C++ / Fortran / CUDA', family: 'systems' },
  { value: 'hardware', label: 'Custom hardware / runtime', family: 'hardware' },
  { value: 'other', label: 'Something else', family: 'other' },
];

/** Q1–Q9 — feed routing and the five scoring categories. Weights unchanged. */
export const QUALIFICATION_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'Q1',
    prompt: 'Where does this computation run today?',
    helper: 'Pick the closest environment.',
    type: 'single',
    category: 'technical_fit',
    required: true,
    options: PLATFORM_ENVIRONMENTS.map((e) => ({ value: e.value, label: e.label })),
  },
  {
    id: 'Q2',
    prompt: 'What is becoming expensive?',
    helper: 'Select all that apply.',
    type: 'multi',
    category: 'technical_fit',
    required: true,
    options: PRESSURE_SIGNALS.map((p) => ({ value: p.area, label: p.label })),
  },
  {
    id: 'Q3',
    prompt: 'What kind of structure does the workload involve?',
    type: 'single',
    category: 'technical_fit',
    required: true,
    options: [
      { value: 'linear_algebra', label: 'Dense / complex linear algebra' },
      { value: 'conservation', label: 'Conservation-law or transport dynamics' },
      { value: 'state_observation', label: 'State estimation with partial observation' },
      { value: 'mixed', label: 'A mix of the above' },
      { value: 'unsure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'Q4',
    prompt: 'How soon do you need a different answer on compute?',
    type: 'single',
    category: 'urgency',
    required: true,
    options: [
      { value: 'now', label: 'Already blocking us', weight: 20 },
      { value: 'quarter', label: 'This quarter', weight: 15 },
      { value: 'year', label: 'Within a year', weight: 8 },
      { value: 'exploring', label: 'Just exploring', weight: 3 },
    ],
  },
  {
    id: 'Q5',
    prompt: 'How severe is the current bottleneck?',
    type: 'single',
    category: 'urgency',
    required: true,
    options: [
      { value: 'critical', label: 'Critical — it caps what we can do', weight: 20 },
      { value: 'significant', label: 'Significant — it slows us down', weight: 14 },
      { value: 'moderate', label: 'Moderate — manageable for now', weight: 8 },
      { value: 'minor', label: 'Minor', weight: 3 },
    ],
  },
  {
    id: 'Q6',
    prompt: 'What best describes your organization?',
    type: 'single',
    category: 'strategic_fit',
    required: true,
    options: [
      { value: 'hardware_chip', label: 'Hardware / chip / accelerator', weight: 25 },
      { value: 'cloud_infra', label: 'Cloud or infrastructure provider', weight: 22 },
      { value: 'enterprise_rd', label: 'Enterprise R&D / engineering', weight: 18 },
      { value: 'research', label: 'Research institution', weight: 12 },
      { value: 'individual', label: 'Individual / independent', weight: 5 },
    ],
  },
  {
    id: 'Q7',
    prompt: 'What is your role in this decision?',
    type: 'single',
    category: 'budget_authority',
    required: true,
    options: [
      { value: 'decision_maker', label: 'I decide', weight: 15 },
      { value: 'influencer', label: 'I influence the decision', weight: 10 },
      { value: 'evaluator', label: 'I evaluate options', weight: 7 },
      { value: 'curious', label: 'Personal interest', weight: 2 },
    ],
  },
  {
    id: 'Q8',
    prompt: 'Where are you on budget for solving this?',
    type: 'single',
    category: 'budget_authority',
    required: true,
    options: [
      { value: 'allocated', label: 'Budget allocated', weight: 15 },
      { value: 'planning', label: 'Planning / building the case', weight: 10 },
      { value: 'none_yet', label: 'No budget yet', weight: 4 },
    ],
  },
  {
    id: 'Q9',
    prompt: 'Are you interested in licensing the underlying technology?',
    helper: 'Licensing terms are always handled by the team, never quoted here.',
    type: 'single',
    category: 'license_potential',
    required: true,
    options: [
      { value: 'exclusive', label: 'Yes — possibly exclusive / strategic', weight: 15 },
      { value: 'non_exclusive', label: 'Yes — non-exclusive', weight: 11 },
      { value: 'product_only', label: 'Product use only for now', weight: 6 },
      { value: 'unsure', label: 'Not sure', weight: 3 },
    ],
  },
];

import type { SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: [
      { name: 'Python' },
      { name: 'JavaScript / TypeScript' },
      { name: 'SQL' },
      { name: 'C++' },
      { name: 'MATLAB' },
    ],
  },
  {
    category: 'AI / Agentic',
    skills: [
      { name: 'Google ADK', detail: 'Agent Development Kit' },
      { name: 'Gemini API' },
      { name: 'MCP' },
      { name: 'AWS Bedrock' },
      { name: 'YOLO (v12)' },
    ],
  },
  {
    category: 'ML & Data',
    skills: [
      { name: 'PyTorch' },
      { name: 'Keras' },
      { name: 'TensorFlow' },
      { name: 'Scikit-Learn' },
      { name: 'Pandas' },
    ],
  },
  {
    category: 'Web & Backend',
    skills: [
      { name: 'FastAPI' },
      { name: 'SQLAlchemy' },
      { name: 'JWT' },
      { name: 'React' },
      { name: 'shadcn/ui' },
      { name: 'Tailwind CSS' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', detail: 'S3, ECS Fargate, Lambda, SQS, IAM, ECR, RDS, Cognito' },
      { name: 'GCP', detail: 'Cloud Run, Pub/Sub, Cloud Storage, Secret Manager, Firestore, IAM' },
      { name: 'Cloudflare Workers' },
      { name: 'GitLab CI/CD' },
    ],
  },
  {
    category: 'Testing & Tooling',
    skills: [
      { name: 'Playwright', detail: 'End-to-end automated testing' },
      { name: 'pytest' },
      { name: 'uv' },
      { name: 'Docker' },
    ],
  },
  {
    category: 'Software & IDEs',
    skills: [
      { name: 'Jupyter Notebook' },
      { name: 'Visual Studio Code' },
      { name: 'SOLIDWORKS' },
      { name: 'Power Automate' },
      { name: 'Microsoft 365' },
    ],
  },
  {
    category: 'Soft Skills',
    skills: [
      { name: 'Team & Client Communication' },
      { name: 'Leadership' },
      { name: 'Receptive Learning' },
      { name: 'Team Collaboration' },
    ],
  },
]

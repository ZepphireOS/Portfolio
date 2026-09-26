import type { Project } from './types'

// Add `images: ['images/projects/<file>']` (files under public/) as screenshots become available.
export const projects: Project[] = [
  {
    id: 'proj-gmail',
    title: 'Gmail Invoice Extraction Pipeline',
    category: 'pipeline',
    tags: ['GCP', 'Gemini', 'Pub/Sub', 'Cloud Run'],
    description: [
      'Designed and built a serverless, event-driven pipeline on Google Cloud to automatically extract structured data from invoice emails — Pub/Sub for event triggering, Cloud Run for processing, Gemini for extraction, and Firestore for storage.',
      'Implemented incremental email sync using a Cloud Storage–backed watermark (Gmail historyId) to avoid reprocessing, with Secret Manager–based credential retrieval on each invocation.',
      'Built a real-time HTML dashboard to visualize extracted invoice data as it was processed, without a frontend build pipeline.',
      'Self-directed learning project completed with no prior GCP experience, covering IAM, event-driven architecture, and LLM-based structured data extraction end-to-end.',
    ],
  },
  {
    id: 'proj-phoenix',
    title: 'Project Phoenix — Autonomous Racecar Vision',
    category: 'vision',
    tags: ['YOLO12', 'Computer Vision'],
    description: [
      'Contributed to an autonomous university racecar with the Intelligent Systems Club at the University of Michigan–Dearborn, focusing on the computer-vision component for road-line detection and path tracking.',
      'Worked with the YOLO12 model for image segmentation and vision-based road interpretation.',
      'Annotated video data used to prepare training material for the computer-vision pipeline.',
      'Worked within a multidisciplinary team integrating AI with the vehicle’s broader autonomous-system architecture.',
    ],
  },
  {
    id: 'proj-churn',
    title: 'Telco Customer Churn Prediction',
    category: 'ml',
    tags: ['XGBoost', 'Random Forest', 'ANN'],
    description: [
      'Developed and evaluated multiple customer-churn prediction models using XGBoost, Random Forest, and Artificial Neural Networks.',
      'Built an ANN model focused on identifying potential churn customers, achieving 88% recall on positive churn predictions.',
      'Developed a web application that lets users enter customer information and receive real-time churn predictions.',
      'Compared model behavior to understand the trade-offs between overall accuracy and identifying at-risk customers.',
    ],
  },
  {
    id: 'proj-genre',
    title: 'Music Genre Detection',
    category: 'audio',
    tags: ['CNN', 'MFCC'],
    description: [
      'Developed a Convolutional Neural Network for music-genre classification using MFCC feature extraction on the GTZAN dataset.',
      'Achieved 84.8% testing accuracy.',
      'Optimized the processing pipeline, reducing model computation time by approximately 25 ms.',
    ],
  },
  {
    id: 'proj-spam',
    title: 'Email Spam Detection',
    category: 'nlp',
    tags: ['NLP', 'Naive Bayes'],
    description: [
      'Developed an email-spam classification system using the Enron-Spam dataset.',
      'Applied text vectorization and Multinomial Naive Bayes for supervised classification.',
      'Achieved 99.32% testing accuracy.',
    ],
  },
]

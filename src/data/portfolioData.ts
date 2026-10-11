import { 
  PersonalProfile, 
  SkillItem, 
  ProjectItem, 
  ExperienceItem, 
  EducationItem, 
  FaqItem, 
  PortfolioContent,
  LearningEntry,
  CertificationItem,
  AchievementItem,
  EducationMilestone
} from '../types';

export const personalProfile: PersonalProfile = {
  name: 'Shaik Ali Ahammad',
  roleTitle: 'Aspiring Data Scientist',
  degreeShort: 'B.Tech AI & Data Science',
  degreeFull: 'B.Tech in Artificial Intelligence and Data Science',
  institution: 'Muthayammal Engineering College, Rasipuram',
  location: 'Rasipuram, Tamil Nadu, India',
  graduationBatch: '2028',
  careerGoal: 'Become a skilled Data Scientist and secure an opportunity at a leading technology company.',
  targetRole: 'Data Scientist',
  bioHeadline: 'Aspiring Data Scientist | AI & Data Science Student',
  bioSummary: 'I am an Artificial Intelligence and Data Science student passionate about turning data into meaningful insights through Python, SQL, Power BI, and Machine Learning.',
  aboutParagraph: 'I am a student specializing in Artificial Intelligence and Data Science at Muthayammal Engineering College. I focus on developing practical competence across Python data science libraries, relational database queries in SQL, Power BI analytics dashboards, and predictive modeling fundamentals.',
  githubUsername: 'ALI108-dotcom',
  githubUrl: 'https://github.com/ALI108-dotcom',
  emailConfigurable: 'SHAIKALIBHAI9895@GMAIL.COM',
  linkedinConfigurable: 'https://www.linkedin.com/in/shaik-ali-ahammad-b6b38b321/',
  introVideoUrl: 'https://www.youtube.com/watch?v=xC-c7E5PK0Y', // Sample 3-minute introduction video (3-13 min range)
  introVideoTitle: 'Introduction to Data Science & Analytical Journey',
  introVideoDuration: '3 min',
};

export const skillsData: SkillItem[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'core',
    description: 'Data manipulation, exploratory analysis, and scientific computing with Pandas, NumPy, Matplotlib & Seaborn.',
    tags: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'EDA'],
    gradientClass: 'grad-verdant',
    iconName: 'Code',
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'core',
    description: 'Relational database querying, multi-table joins, aggregations, data filtering, and structured data transformations.',
    tags: ['Queries', 'Joins', 'Aggregations', 'Schema Design', 'Data Cleaning'],
    gradientClass: 'grad-azure',
    iconName: 'Database',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'tool',
    description: 'NoSQL document storage, flexible BSON schemas, querying unstructured data, and collection indexing.',
    tags: ['NoSQL', 'Document Store', 'Collections', 'JSON/BSON'],
    gradientClass: 'grad-sunrise',
    iconName: 'Layers',
  },
  {
    id: 'powerbi',
    name: 'Microsoft Power BI',
    category: 'tool',
    description: 'Interactive dashboard engineering, business KPI reporting, DAX expressions, and visual data storytelling.',
    tags: ['Dashboards', 'DAX', 'Data Modeling', 'Visual Reports', 'KPI Cards'],
    gradientClass: 'grad-sunrise',
    iconName: 'BarChart3',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    category: 'tool',
    description: 'Spreadsheet modeling, pivot tables, lookup functions, conditional formatting, and exploratory data summary.',
    tags: ['Pivot Tables', 'VLOOKUP/XLOOKUP', 'Data Cleaning', 'Formulas'],
    gradientClass: 'grad-verdant',
    iconName: 'FileSpreadsheet',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'domain',
    description: 'Foundations of supervised learning, exploratory model pipelines, feature scaling, and performance metric evaluation.',
    tags: ['Supervised Learning', 'Preprocessing', 'Train/Test Split', 'Scikit-Learn'],
    gradientClass: 'grad-azure',
    iconName: 'Cpu',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'domain',
    description: 'End-to-end analytical workflow: data cleaning, missing value imputation, outlier detection, and insight extraction.',
    tags: ['Data Cleaning', 'Statistical Summary', 'Feature Engineering'],
    gradientClass: 'grad-verdant',
    iconName: 'TrendingUp',
  },
  {
    id: 'data-vis',
    name: 'Data Visualization',
    category: 'domain',
    description: 'Transforming complex datasets into clear, communicative charts, executive dashboards, and narrative reports.',
    tags: ['Visual Storytelling', 'Heatmaps', 'Distribution Plots', 'Dashboards'],
    gradientClass: 'grad-sunrise',
    iconName: 'PieChart',
  },
];

export const projectsData: ProjectItem[] = [
  {
    id: 'project-1',
    title: 'Power BI Business Performance Dashboard',
    tagline: 'Interactive Executive Dashboard & Sales KPI Analytics',
    problemStatement: 'Organizations often struggle to uncover cross-regional sales trends and revenue bottlenecks from fragmented transactional sheets.',
    description: 'Engineered an interactive multi-page Power BI dashboard connecting relational sales data. Modeled KPIs including total revenue, gross margins, regional distribution, and month-over-month growth using custom DAX calculations and dynamic filters.',
    technologies: ['Microsoft Power BI', 'DAX', 'Data Modeling', 'Power Query', 'Excel'],
    category: 'Power BI',
    featured: true,
    repoUrl: 'https://github.com/ALI108-dotcom',
    demoUrl: undefined, // [Editable: Add Power BI service public embed URL if published]
    highlightBadge: 'Executive Analytics',
    stats: [
      { label: 'Data Model', value: 'Star Schema' },
      { label: 'KPI Views', value: '4 Interactive Pages' },
      { label: 'Calculations', value: 'Custom DAX Metrics' },
    ],
  },
  {
    id: 'project-2',
    title: 'Power BI Operational Metrics & KPI Tracker',
    tagline: 'Operational Visibility & Trend Diagnostics',
    problemStatement: 'Operational teams require clear visual indicators to detect delays, monitor volume throughput, and track customer fulfillment metrics in real time.',
    description: 'Designed a comprehensive Power BI reporting suite focused on operational throughput, category-wise demand distribution, and fulfillment efficiency. Features interactive slicers, drill-through cards, and automated color-coded alert thresholds.',
    technologies: ['Microsoft Power BI', 'DAX', 'Data Visualization', 'Data Cleansing'],
    category: 'Power BI',
    featured: false,
    repoUrl: 'https://github.com/ALI108-dotcom',
    demoUrl: undefined, // [Editable: Add demo link]
    highlightBadge: 'Operational BI',
    stats: [
      { label: 'Report Focus', value: 'Operations & Volume' },
      { label: 'Visual Cards', value: 'Dynamic Thresholds' },
      { label: 'Data Source', value: 'Cleaned Relational Records' },
    ],
  },
  {
    id: 'project-3',
    title: 'Titanic Dataset Exploratory Data Analysis',
    tagline: 'Statistical Exploration & Demographic Survival Insights',
    problemStatement: 'Understanding historical survival patterns requires systematic data cleaning, handling missing ages and embarked ports, and evaluating multi-factor demographic correlations.',
    description: 'Conducted a rigorous Python exploratory data analysis (EDA) on the classic Titanic dataset as part of the Yuva Virtual Data Science Apprenticeship. Analyzed passenger demographics, ticket class disparities, fare distributions, and family size survival correlation using Pandas, Matplotlib, and Seaborn heatmaps.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter'],
    category: 'Python & EDA',
    featured: true,
    repoUrl: 'https://github.com/ALI108-dotcom',
    demoUrl: undefined, // [Editable: Link to Jupyter Notebook / Colab if published]
    highlightBadge: 'Supported Apprenticeship Project',
    stats: [
      { label: 'Dataset', value: 'Titanic Kaggle Corpus' },
      { label: 'Analysis Types', value: 'Univariate & Bivariate' },
      { label: 'Visualizations', value: 'Correlation Heatmaps & Boxplots' },
    ],
  },
  {
    id: 'project-4',
    title: 'Supervised Machine Learning Model Exploration',
    tagline: 'Predictive Feature Analysis & Classification Evaluation',
    problemStatement: 'Evaluating classification boundaries and comparing baseline models requires proper feature normalization, encoding, and balanced evaluation metrics.',
    description: 'Built a structured machine learning pipeline in Python to preprocess tabular data, handle categorical encodings, train baseline classification models, and benchmark evaluation metrics including precision, recall, and ROC-AUC score.',
    technologies: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
    category: 'Machine Learning',
    featured: false,
    repoUrl: 'https://github.com/ALI108-dotcom',
    demoUrl: undefined, // [Editable: Add ML repository link]
    highlightBadge: 'ML Modeling',
    stats: [
      { label: 'Approach', value: 'Supervised Learning' },
      { label: 'Pipeline', value: 'Encoding & Train-Test Split' },
      { label: 'Metrics', value: 'Accuracy, Precision & Recall' },
    ],
  },
  {
    id: 'project-5',
    title: 'AI Interview Coach Application',
    tagline: 'Interactive Practice Assistant for Technical & Behavioral Interviews',
    problemStatement: 'Students preparing for tech and data science placements often lack structured, on-demand interview questioning and targeted feedback.',
    description: 'An AI-assisted interview preparation prototype created to help aspiring candidates practice technical concepts, data science questions, and behavioral responses with immediate prompt-guided structuring.',
    technologies: ['Python', 'Natural Language Processing', 'Web Interface'],
    category: 'AI Applications',
    featured: false,
    repoUrl: 'https://github.com/ALI108-dotcom',
    demoUrl: undefined, // [Editable: Add live demo URL if hosted]
    highlightBadge: 'Verified Project',
    stats: [
      { label: 'Domain', value: 'Interview Prep & QA' },
      { label: 'Interface', value: 'Interactive Web Prototype' },
      { label: 'Audience', value: 'Data Science Candidates' },
    ],
  },
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-yuva',
    role: 'Virtual Data Science with Python Apprentice',
    organization: 'Yuva Virtual Internship Program',
    location: 'Remote',
    period: 'Apprenticeship Period (Coursework & Project)',
    status: 'Completed',
    summary: 'Engaged in hands-on practical data science training utilizing Python to perform comprehensive exploratory data analysis, statistical summarization, and data visualization on real-world datasets.',
    tasksCompleted: [
      'Executed systematic data wrangling, missing value handling, and categorical feature transformation in Python.',
      'Conducted extensive exploratory data analysis (EDA) on the Titanic dataset, uncovering passenger demographic survival trends.',
      'Constructed publication-ready visual storytelling plots including multi-variable correlation heatmaps, distribution histograms, and scatter plots using Matplotlib and Seaborn.',
      'Synthesized analytical findings into structured documentation highlighting key observational takeaways.',
    ],
    skillsPracticed: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Exploratory Data Analysis', 'Statistical Reasoning'],
    verificationUrl: undefined, // [Editable: Paste verified certificate or verification URL here]
    certificateNote: 'Coursework & Capstone Project completed as part of the Yuva Apprentice curriculum.',
  },
];

export const educationData: EducationItem = {
  degree: 'Bachelor of Technology (B.Tech)',
  specialization: 'Artificial Intelligence and Data Science',
  institution: 'Muthayammal Engineering College',
  location: 'Rasipuram, Namakkal District, Tamil Nadu, India',
  batch: 'Graduation Batch: 2028',
  status: 'Currently Pursuing (Undergraduate Student)',
  keyCoursework: [
    'Python Programming & Problem Solving',
    'Data Structures and Algorithms',
    'Relational Database Management Systems (SQL)',
    'Foundations of Data Science & Statistics',
    'Machine Learning Foundations',
    'Object-Oriented Programming & Software Engineering',
  ],
};

export const faqData: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is Shaik Ali Ahammad’s primary academic background and career aspiration?',
    answer: 'Shaik Ali Ahammad is an undergraduate student pursuing a B.Tech in Artificial Intelligence and Data Science at Muthayammal Engineering College, Rasipuram (Batch of 2028). His career goal is to become a skilled Data Scientist and secure an opportunity at a leading technology company.',
    category: 'Profile',
  },
  {
    id: 'faq-2',
    question: 'What core technical stack and analytical tools does Shaik utilize?',
    answer: 'His core skillset includes Python for data science and scripting, SQL for database querying and aggregation, MongoDB for NoSQL document modeling, Microsoft Power BI for executive dashboard building and DAX analytics, and Microsoft Excel for spreadsheet manipulation and pivot analysis.',
    category: 'Skills',
  },
  {
    id: 'faq-3',
    question: 'What practical experience was completed during the Yuva Apprenticeship?',
    answer: 'As a Yuva Virtual Data Science with Python Apprentice, Shaik focused on data exploration and analytical techniques, culminating in a thorough exploratory data analysis project on the Titanic dataset examining passenger survival demographics and multi-variable correlations.',
    category: 'Experience',
  },
  {
    id: 'faq-4',
    question: 'What types of Power BI dashboards have been built?',
    answer: 'Shaik has developed two distinct Power BI dashboard projects: an executive sales & performance analytics dashboard featuring star schema modeling and custom DAX measures, and an operational metrics tracker providing visibility into process volumes and fulfillment thresholds.',
    category: 'Projects',
  },
  {
    id: 'faq-5',
    question: 'How can recruiters or collaborators get in touch?',
    answer: 'You can explore his public repositories directly at https://github.com/ALI108-dotcom or send an inquiry via the verified contact form below. All direct messages receive a timely response.',
    category: 'Contact',
  },
];

export const defaultLearningJourney: LearningEntry[] = [
  {
    id: 'learn-1',
    title: 'Python Pandas Data Wrangling & Outlier Treatment',
    category: 'Data Analysis',
    summary: 'Mastering data transformation workflows, handling null values with domain imputation, and reshaping tabular structures.',
    keyConcepts: ['Missing Value Imputation', 'DataFrame GroupBy', 'Bivariate Aggregations'],
    practicalApplication: 'Applied to the Titanic survival demographic corpus to clean fare and age distributions.',
    relatedTechnologies: ['Python', 'Pandas', 'NumPy'],
    dateLearned: '2024 - Present',
    published: true,
  },
  {
    id: 'learn-2',
    title: 'Star Schema Data Modeling & DAX Calculation Engines',
    category: 'Business Intelligence',
    summary: 'Structuring denormalized fact tables and dimension tables for high-performance Power BI report filtering.',
    keyConcepts: ['Star Schema', 'Calculated Measures', 'Filter Context Navigation'],
    practicalApplication: 'Engineered executive dashboards calculating dynamic conversion rates and margins across product categories.',
    relatedTechnologies: ['Microsoft Power BI', 'DAX', 'Data Modeling'],
    dateLearned: '2024 - Present',
    published: true,
  },
  {
    id: 'learn-3',
    title: 'Relational Database Queries & Analytical SQL Joins',
    category: 'Databases & SQL',
    summary: 'Authoring clean relational queries using inner/outer joins, aggregate grouping, and subquery logic.',
    keyConcepts: ['Multi-table Joins', 'Window Functions', 'Data Aggregations'],
    practicalApplication: 'Querying normalized student and sales records with indexing best practices.',
    relatedTechnologies: ['SQL', 'PostgreSQL', 'MySQL'],
    dateLearned: '2024 - Present',
    published: true,
  },
];

export const defaultCertifications: CertificationItem[] = [
  {
    id: 'cert-1',
    name: 'Virtual Data Science with Python Apprenticeship',
    issuingOrg: 'Yuva Virtual Internship Program',
    issueDate: '2024',
    description: 'Practical exploratory data analysis with Python, Pandas, and Matplotlib.',
    skills: ['Python', 'Pandas', 'Matplotlib', 'EDA'],
    published: true,
  },
];

export const defaultAchievements: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Yuva Data Science Apprenticeship Capstone Deliverable',
    category: 'Academic & Training',
    description: 'Completed comprehensive exploratory data analysis on the classic Titanic dataset with correlation heatmaps and demographic survival profiling.',
    date: '2024',
    published: true,
  },
];

export const defaultEducationMilestones: EducationMilestone[] = [
  {
    id: 'edu-m1',
    num: '01',
    title: 'B.TECH IN ARTIFICIAL INTELLIGENCE AND DATA SCIENCE',
    subtitle: 'Muthayammal Engineering College, Rasipuram',
    period: 'BATCH OF 2028',
    published: true,
  },
  {
    id: 'edu-m2',
    num: '02',
    title: 'YUVA VIRTUAL DATA SCIENCE WITH PYTHON APPRENTICESHIP',
    subtitle: 'Hands-on practical training & Titanic dataset exploratory data analysis',
    period: 'COMPLETED',
    published: true,
  },
  {
    id: 'edu-m3',
    num: '03',
    title: 'POWER BI & DATA VISUALIZATION DASHBOARD SUITE',
    subtitle: 'Development of business performance & operational KPI dashboards',
    period: 'PRACTICE SUITE',
    published: true,
  },
  {
    id: 'edu-m4',
    num: '04',
    title: 'TARGET CAREER MILESTONE: PROFESSIONAL DATA SCIENTIST',
    subtitle: 'Securing an opportunity at a leading technology enterprise',
    period: 'GRADUATION 2028',
    published: true,
  },
];

export const defaultPortfolioContent: PortfolioContent = {
  profile: personalProfile,
  skills: skillsData.map(s => ({ ...s, published: true })),
  projects: projectsData.map(p => ({ ...p, published: true })),
  learningJourney: defaultLearningJourney,
  certifications: defaultCertifications,
  achievements: defaultAchievements,
  educationMilestones: defaultEducationMilestones,
  experience: experienceData.map(e => ({ ...e, published: true })),
  education: educationData,
  faq: faqData,
};



// Script to seed fresh Supabase database with authoritative portfolio content
const supabaseUrl = 'https://jnnnymecvnfkgazzmzry.supabase.co';
const supabaseKey = 'sb_publishable_hzGyOs8g82aBksr_AOGJ5Q_i2uP7tD_';

async function seed() {
  console.log('Seeding portfolio content to Supabase...');
  
  // We can write a clean baseline payload
  const initialContent = {
    profile: {
      name: 'Shaik Ali Ahammad',
      roleTitle: 'What I Know & What I Did',
      degreeShort: 'B.Tech AI & Data Science',
      degreeFull: 'B.Tech in Artificial Intelligence and Data Science',
      institution: 'Annamacharya Institute of Technology and Sciences, Rajampet',
      location: 'Andhra Pradesh, India',
      graduationBatch: '2028',
      careerGoal: 'Continuously learn, build impactful projects, and master modern technologies.',
      targetRole: 'Technology Learner & Builder',
      bioHeadline: 'What I Know Till Now & What I Have Built',
      bioSummary: 'Welcome to my portfolio! Here I document everything I know, the projects I have built, and the skills I am continuously learning. As I learn new technologies and build new work, I keep updating it right here.',
      aboutParagraph: 'I am a student passionate about technology, programming, and building real-world projects. I believe in learning by doing — exploring core concepts, creating functional applications, and continuously expanding my skillset.',
      githubUsername: 'ALI108-dotcom',
      githubUrl: 'https://github.com/ALI108-dotcom',
      emailConfigurable: 'SHAIKALIBHAI9895@GMAIL.COM',
      linkedinConfigurable: 'https://www.linkedin.com/in/shaik-ali-ahammad-b6b38b321/',
      introVideoUrl: 'https://www.youtube.com/watch?v=xC-c7E5PK0Y',
      introVideoTitle: 'Introduction & Technical Learning Journey',
      introVideoDuration: '~3 Min (3–13 Min Allowed)',
      heroSkills: [
        'Python & SQL',
        'Microsoft Power BI',
        'Machine Learning',
        'Data Analysis & EDA',
        'Artificial Intelligence'
      ]
    }
  };

  const resp = await fetch(`${supabaseUrl}/rest/v1/portfolio_content?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      id: 'main',
      content: initialContent,
      updated_at: new Date().toISOString(),
    }),
  });

  if (resp.ok) {
    const data = await resp.json();
    console.log('✅ Supabase database initialized and seeded successfully:', data);
  } else {
    const text = await resp.text();
    console.error('❌ Seeding failed:', resp.status, text);
  }
}

seed().catch(console.error);

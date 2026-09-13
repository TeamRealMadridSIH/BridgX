import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const { Pool } = pg;
export const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255),
      role VARCHAR(20) DEFAULT 'citizen',
      avatar VARCHAR(255),
      bio TEXT,
      github_username VARCHAR(100),
      followers INT DEFAULT 0,
      solved_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS problems (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50),
      location VARCHAR(150),
      image_url VARCHAR(255),
      status VARCHAR(20) DEFAULT 'open',
      upvotes INT DEFAULT 0,
      author_id INT REFERENCES users(id) ON DELETE CASCADE,
      solver_id INT REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS challenges (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50),
      org_id INT REFERENCES users(id) ON DELETE CASCADE,
      deadline TIMESTAMP,
      prize VARCHAR(100),
      status VARCHAR(20) DEFAULT 'open',
      community VARCHAR(50),
      ps_number VARCHAR(20),
      theme VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      challenge_id INT REFERENCES challenges(id) ON DELETE CASCADE,
      applicant_id INT REFERENCES users(id) ON DELETE CASCADE,
      proposal TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS solve_requests (
      id SERIAL PRIMARY KEY,
      problem_id INT REFERENCES problems(id) ON DELETE CASCADE,
      solver_id INT REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS workspaces (
      id SERIAL PRIMARY KEY,
      problem_id INT REFERENCES problems(id),
      challenge_id INT REFERENCES challenges(id),
      github_repo VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS workspace_members (
      workspace_id INT REFERENCES workspaces(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (workspace_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      type VARCHAR(50),
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE challenges ADD COLUMN IF NOT EXISTS community VARCHAR(50)`);
  await pool.query(`ALTER TABLE challenges ADD COLUMN IF NOT EXISTS ps_number VARCHAR(20)`);
  await pool.query(`ALTER TABLE challenges ADD COLUMN IF NOT EXISTS theme VARCHAR(100)`);

  console.log('PostgreSQL tables ready');
  await seed();
}

async function seed() {
  const { rows: check } = await pool.query(`SELECT id FROM users WHERE email='asif@bridgex.app'`);
  if (check.length) return;

  const pw = async (p) => bcrypt.hash(p, 10);

  // ── USERS ──────────────────────────────────────────────────────────────────
  const { rows: users } = await pool.query(`
    INSERT INTO users (name, email, password, role, avatar, bio, github_username, solved_count) VALUES
    ('Asif',          'asif@bridgex.app',     $1, 'solver',       'https://api.dicebear.com/7.x/avataaars/svg?seed=asif',       'Full-stack developer passionate about civic tech. Loves building tools that matter.', 'asif-dev',       11),
    ('Aysha',         'aysha@bridgex.app',    $2, 'citizen',      'https://api.dicebear.com/7.x/avataaars/svg?seed=aysha',      'Urban researcher and community advocate from Kozhikode.', NULL,              0),
    ('Nargis',        'nargis@bridgex.app',   $3, 'mentor',       'https://api.dicebear.com/7.x/avataaars/svg?seed=nargis',     'Ex-DRDO researcher, now mentoring young engineers.', 'nargis-tech',    18),
    ('Shahid Afridi', 'shahid@bridgex.app',   $4, 'solver',       'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid',     'Open-source contributor and infrastructure engineer.', 'shahidafridi',   7),
    ('Mehna',         'mehna@bridgex.app',    $5, 'citizen',      'https://api.dicebear.com/7.x/avataaars/svg?seed=mehna',      'Social entrepreneur running an NGO in Malappuram.', NULL,              0),
    ('Shafeeque',     'shafeeque@bridgex.app',$6, 'solver',       'https://api.dicebear.com/7.x/avataaars/svg?seed=shafeeque',  'IoT and embedded systems specialist. Built 3 smart city pilots.', 'shafeeque-iot',  5),
    ('Muhammed',      'muhammed@bridgex.app', $7, 'solver',       'https://api.dicebear.com/7.x/avataaars/svg?seed=muhammed',   'ML engineer and data scientist. Kaggle expert.', 'muhammed-ml',    9),
    ('Muhasir',       'muhasir@bridgex.app',  $8, 'mentor',       'https://api.dicebear.com/7.x/avataaars/svg?seed=muhasir',    'DevOps and cloud infrastructure mentor. 10+ years experience.', 'muhasir-cloud',  15),
    ('IIT Bombay',    'iitb@bridgex.app',     $9, 'organization', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/120px-IIT_Bombay_Logo.svg.png', 'Premier technical institute driving innovation across India.', NULL, 0),
    ('ISRO',          'isro@bridgex.app',     $9, 'organization', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/ISRO_Logo.svg/120px-ISRO_Logo.svg.png', 'Indian Space Research Organisation — space for all.', NULL, 0),
    ('Smart India Hackathon', 'sih@bridgex.app', $9, 'organization', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=120&fit=crop', 'Government of India national-level hackathon platform.', NULL, 0),
    ('Tata Consultancy Services', 'tcs@bridgex.app', $9, 'organization', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png', 'Global IT services, consulting and business solutions.', NULL, 0)
    RETURNING id, name, email
  `, [
    await pw('pass123'), await pw('pass123'), await pw('pass123'), await pw('pass123'),
    await pw('pass123'), await pw('pass123'), await pw('pass123'), await pw('pass123'),
    await pw('org123')
  ]);

  const u = {}, org = {};
  users.forEach(r => {
    if (['IIT Bombay','ISRO','Smart India Hackathon','Tata Consultancy Services'].includes(r.name)) org[r.name] = r.id;
    else u[r.name] = r.id;
  });

  // ── PROBLEMS ───────────────────────────────────────────────────────────────
  const { rows: problems } = await pool.query(`
    INSERT INTO problems (title, description, category, location, image_url, status, upvotes, author_id, solver_id) VALUES
    (
      'Severe waterlogging blocks NH-66 near Kozhikode every monsoon',
      'The NH-66 stretch near Kozhikode bypass floods within 20 minutes of heavy rain, stranding hundreds of vehicles. The drainage culverts were built in 1987 and have never been upgraded. Local residents have filed 12 complaints with NHAI over 3 years with no action. Businesses along the stretch report losses of ₹2-3 lakh per flood event.',
      'Infrastructure', 'Kozhikode, Kerala',
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80',
      'open', 67, $1, NULL
    ),
    (
      'Drinking water turns brown in Malappuram ward 12 for 3 weeks',
      'Residents of ward 12, Malappuram have been receiving brown, foul-smelling tap water since the last pipe maintenance work. Children and elderly are falling sick. The local health centre has reported 23 cases of gastroenteritis in the past week. Municipality has not responded to repeated complaints.',
      'Health', 'Malappuram, Kerala',
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
      'in_progress', 89, $2, $1
    ),
    (
      'Zero public Wi-Fi at Thrissur central bus stand serving 50,000 daily',
      'Thrissur central bus stand is one of the busiest in Kerala with 50,000+ daily commuters, yet has zero public internet access. Students travelling for exams, migrant workers and tourists are severely affected. A simple mesh Wi-Fi network could solve this at minimal cost.',
      'Technology', 'Thrissur, Kerala',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
      'open', 43, $3, NULL
    ),
    (
      'Stray dog attacks near 3 schools in Kannur — 15 bite cases in a month',
      'Three schools in Kannur town have reported 15 stray dog bite incidents in the past month alone. Parents are afraid to send children to school. The municipal animal welfare unit has no capacity to handle the situation. An urgent ABC (Animal Birth Control) programme and temporary shelters are needed.',
      'Safety', 'Kannur, Kerala',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
      'open', 34, $2, NULL
    ),
    (
      'Kochi low-lying areas flood in 30 minutes — drainage channels blocked',
      'Low-lying areas of Ernakulam district flood within 30 minutes of moderate rain due to drainage channels blocked with construction debris and plastic waste. The 2023 floods caused ₹40 crore in property damage. A smart drainage monitoring system with automated alerts could prevent future disasters.',
      'Environment', 'Kochi, Kerala',
      'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
      'in_progress', 112, $2, $4
    ),
    (
      'Calicut railway station has no wheelchair ramps — disabled passengers carried manually',
      'Calicut railway station, handling 25,000 passengers daily, has no wheelchair ramps or lifts between platforms. Differently-abled passengers are physically carried across tracks by porters, which is both undignified and dangerous. Railway board has ignored 3 RTI applications filed since 2021.',
      'Social', 'Kozhikode, Kerala',
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
      'solved', 58, $3, $5
    ),
    (
      'Air quality data unavailable for 80% of Pune — only 3 AQI stations for 7M people',
      'Pune has only 3 government AQI monitoring stations for a population of 7 million. Citizens in Hadapsar, Kothrud and Wakad have no real-time air quality data. A low-cost IoT sensor network could provide hyperlocal AQI data and help residents make informed decisions.',
      'Environment', 'Pune, Maharashtra',
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
      'open', 51, $6, NULL
    ),
    (
      'Pothole-ridden roads in Bengaluru Whitefield cause daily accidents',
      'The 4km stretch of ITPL Main Road in Whitefield, Bengaluru has over 300 potholes. Two fatal accidents occurred last month. Despite being a major IT corridor, BBMP has not repaired the road in 14 months. A crowdsourced pothole mapping app could help prioritise repairs.',
      'Infrastructure', 'Bengaluru, Karnataka',
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80',
      'open', 78, $7, NULL
    ),
    (
      'No sanitation facilities for 200 street vendors near Palayam market, Trivandrum',
      'Over 200 street vendors near Palayam market in Thiruvananthapuram have no access to toilets or clean water for 10+ hours a day. Women vendors are particularly affected. The nearest public toilet is 800m away and charges ₹5 per use. A mobile sanitation unit would transform their daily lives.',
      'Sanitation', 'Thiruvananthapuram, Kerala',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
      'open', 29, $8, NULL
    ),
    (
      'School dropout rate spikes in Wayanad tribal areas — no digital learning access',
      'Tribal schools in Wayanad district report 34% dropout rate, partly due to zero digital learning infrastructure. Teachers have no projectors, tablets or internet. An offline-first digital learning kit with solar charging could reach 12,000 students across 45 tribal schools.',
      'Education', 'Wayanad, Kerala',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      'open', 44, $2, NULL
    )
  `, [u['Asif'], u['Aysha'], u['Nargis'], u['Shahid Afridi'], u['Muhammed'], u['Shafeeque'], u['Muhammed'], u['Muhasir'], u['Mehna']]);

  // ── CHALLENGES ─────────────────────────────────────────────────────────────
  const d = (days) => { const dt = new Date(); dt.setDate(dt.getDate() + days); return dt; };

  const { rows: challenges } = await pool.query(`
    INSERT INTO challenges (title, description, category, org_id, deadline, prize, status, community, ps_number, theme) VALUES
    (
      'Smart Waste Management System for Indian Cities',
      'Design an IoT-based solution to optimize municipal solid waste collection using real-time bin fill-level sensors, ML-based route optimization and a citizen reporting app. Solution must work in low-connectivity areas and support 10+ languages.',
      'Environment', $1, $5, '₹1,00,000', 'open', 'SIH 2024', 'SIH1442', 'Smart Cities'
    ),
    (
      'Multilingual Chatbot for Government Scheme Discovery',
      'Build a conversational AI chatbot supporting Malayalam, Hindi, Tamil and English to help citizens discover government schemes, check eligibility, file complaints and track applications — all without visiting a government office.',
      'Technology', $1, $6, '₹80,000', 'in_progress', 'SIH 2024', 'SIH1523', 'GovTech'
    ),
    (
      'AI-Powered Crop Disease Detection for Farmers',
      'Build a mobile app using computer vision to detect crop diseases from smartphone photos. Must work offline, support 20+ crops, provide treatment advice in local language and integrate with Kisan Call Centre.',
      'Agriculture', $1, $7, '₹75,000', 'open', 'SIH 2024', 'SIH1389', 'AgriTech'
    ),
    (
      'Satellite Image Analysis for 72-Hour Flood Prediction',
      'Develop an ML pipeline to analyze ISRO Resourcesat-2 and Cartosat satellite imagery to predict flood-prone zones 72 hours in advance. Must integrate with IMD rainfall data and generate district-level alerts.',
      'Technology', $2, $8, '₹2,00,000', 'open', 'ISRO Challenge', NULL, 'Space Tech'
    ),
    (
      'Accessible Public Transport Navigation App',
      'Create an app providing real-time accessibility information for buses, metro and railways for differently-abled citizens. Must include wheelchair route planning, audio navigation, and crowdsourced accessibility ratings.',
      'Social', $3, $9, '₹50,000', 'open', 'TCS Innovate', NULL, 'Inclusion'
    ),
    (
      'Smart Health Monitoring Wearable for Rural Elderly',
      'Design a low-cost wearable (BOM under ₹800) that monitors SpO2, heart rate and temperature, sends SMS alerts to caregivers when vitals are abnormal, and works without smartphone dependency.',
      'Health', $4, $10, '₹1,50,000', 'open', 'SIH 2024', 'SIH1501', 'HealthTech'
    )
  `, [
    org['Smart India Hackathon'], org['ISRO'], org['Tata Consultancy Services'], org['IIT Bombay'],
    d(45), d(25), d(60), d(55), d(35), d(40)
  ]);

  const [ch1, ch2, ch3, ch4, ch5, ch6] = challenges;

  // ── APPLICATIONS ───────────────────────────────────────────────────────────
  await pool.query(`
    INSERT INTO applications (challenge_id, applicant_id, proposal, status) VALUES
    ($1, $7, 'We propose ESP32-based smart bins with ultrasonic sensors + GSM. Route optimization using Google OR-Tools. Citizen app in React Native with offline support. BOM per bin: ₹1,200.', 'pending'),
    ($1, $8, 'LoRa mesh network for bin sensors, MQTT broker on AWS IoT, ML scheduling with Prophet. Already piloted in 2 wards of Kochi.', 'pending'),
    ($2, $3, 'Rasa NLP pipeline with custom Malayalam tokenizer. Integrated with DigiLocker and UMANG APIs. Tested with 500 users in Malappuram.', 'accepted'),
    ($2, $4, 'Fine-tuned Llama-3 on Kerala govt scheme corpus. Voice input via Whisper. WhatsApp integration for rural reach.', 'pending'),
    ($3, $5, 'YOLOv8 model trained on 50,000 crop disease images. Flutter app with TFLite for offline inference. Supports 25 crops in 6 languages.', 'pending'),
    ($4, $6, 'U-Net segmentation on Resourcesat-2 imagery. LSTM for time-series rainfall correlation. Integrated with IMD API. 87% accuracy on 2018-2023 flood data.', 'pending'),
    ($5, $9, 'React Native app with OpenStreetMap accessibility layer. Crowdsourced ratings with photo verification. Integrated with IRCTC and BMTC APIs.', 'pending'),
    ($6, $7, 'MAX30102 + DS18B20 on ESP32-C3. Custom PCB, 7-day battery life. SMS via Twilio. Tested on 30 elderly patients in Thrissur.', 'pending')
  `, [ch1.id, ch2.id, ch3.id, ch4.id, ch5.id, ch6.id,
      u['Shafeeque'], u['Muhasir'], u['Asif'], u['Shahid Afridi'],
      u['Muhammed'], u['Shafeeque'], u['Muhasir'], u['Shafeeque']]);

  // ── SOLVE REQUESTS ─────────────────────────────────────────────────────────
  const [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10] = problems;
  await pool.query(`
    INSERT INTO solve_requests (problem_id, solver_id, message, status) VALUES
    ($1, $3, 'I can build a pothole detection app using phone camera + CV. Have done similar work for BBMP.', 'pending'),
    ($1, $4, 'I have experience with road infrastructure GIS mapping. Can create a crowdsourced reporting system.', 'pending'),
    ($2, $5, 'I can deploy IoT water quality sensors and build a real-time dashboard for the municipality.', 'accepted'),
    ($5, $6, 'I specialize in IoT drainage monitoring. Can deploy ultrasonic water level sensors with SMS alerts.', 'accepted'),
    ($7, $3, 'I can set up a low-cost AQI sensor network using PMS5003 sensors on Raspberry Pi Zero.', 'pending'),
    ($9, $4, 'I can design and deploy a mobile sanitation unit with solar water heating. Have NGO contacts in Trivandrum.', 'pending')
  `, [p8.id, p8.id, p2.id, p5.id, p7.id, p9.id,
      u['Muhammed'], u['Shahid Afridi'], u['Asif'], u['Shafeeque'], u['Muhammed'], u['Shahid Afridi']]);

  // ── WORKSPACES ─────────────────────────────────────────────────────────────
  // WS1: Malappuram water problem (Aysha posted, Asif solving)
  const { rows: [ws1] } = await pool.query(
    `INSERT INTO workspaces (problem_id, github_repo) VALUES ($1, 'asif-dev/malappuram-water-monitor') RETURNING id`,
    [p2.id]
  );
  await pool.query(
    `INSERT INTO workspace_members (workspace_id, user_id) VALUES ($1,$2),($1,$3),($1,$4)`,
    [ws1.id, u['Aysha'], u['Asif'], u['Nargis']]
  );

  // WS2: Kochi flood problem (Aysha posted, Shahid solving)
  const { rows: [ws2] } = await pool.query(
    `INSERT INTO workspaces (problem_id, github_repo) VALUES ($1, 'shahidafridi/kochi-flood-drain') RETURNING id`,
    [p5.id]
  );
  await pool.query(
    `INSERT INTO workspace_members (workspace_id, user_id) VALUES ($1,$2),($1,$3),($1,$4)`,
    [ws2.id, u['Aysha'], u['Shahid Afridi'], u['Muhasir']]
  );

  // WS3: Challenge workspace — Asif accepted for multilingual chatbot
  const { rows: [ws3] } = await pool.query(
    `INSERT INTO workspaces (challenge_id, github_repo) VALUES ($1, 'asif-dev/kerala-govbot') RETURNING id`,
    [ch2.id]
  );
  await pool.query(
    `INSERT INTO workspace_members (workspace_id, user_id) VALUES ($1,$2),($1,$3),($1,$4),($1,$5)`,
    [ws3.id, u['Asif'], u['Shahid Afridi'], u['Muhammed'], u['Nargis']]
  );

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────────
  await pool.query(`
    INSERT INTO notifications (user_id, message, type, read) VALUES
    ($1,  'Your solve request for the Malappuram water problem was accepted! Workspace is ready.', 'accepted', false),
    ($2,  'Asif has joined your problem workspace for Malappuram water contamination.', 'solve_request', false),
    ($3,  'You have been added as mentor to the Malappuram water workspace.', 'accepted', true),
    ($4,  'Your solve request for Kochi flood drainage was accepted! Workspace is ready.', 'accepted', false),
    ($2,  'Shahid Afridi has joined your Kochi flood drainage workspace.', 'solve_request', false),
    ($5,  'You have been added as mentor to the Kochi flood workspace.', 'accepted', true),
    ($1,  'Your application for the Multilingual Chatbot challenge was accepted! Workspace is ready.', 'accepted', false),
    ($6,  'You have been added to the GovBot challenge workspace.', 'accepted', false),
    ($7,  'You have been added to the GovBot challenge workspace.', 'accepted', false),
    ($3,  'You have been added as mentor to the GovBot challenge workspace.', 'accepted', true),
    ($2,  'Muhammed wants to solve your pothole problem in Bengaluru.', 'solve_request', false),
    ($2,  'Shahid Afridi wants to solve your pothole problem in Bengaluru.', 'solve_request', false),
    ($8,  'Shafeeque applied to your Smart Waste Management challenge.', 'application', true),
    ($8,  'Muhasir applied to your Smart Waste Management challenge.', 'application', false),
    ($8,  'Asif applied to your Multilingual Chatbot challenge.', 'application', true),
    ($8,  'Shahid Afridi applied to your Multilingual Chatbot challenge.', 'application', false),
    ($9,  'Muhammed applied to your Crop Disease Detection challenge.', 'application', false),
    ($10, 'Shafeeque applied to your Flood Prediction challenge.', 'application', false),
    ($11, 'Muhasir applied to your Accessible Transport challenge.', 'application', false),
    ($12, 'Shafeeque applied to your Smart Health Wearable challenge.', 'application', false),
    ($6,  'Calicut railway station accessibility problem has been marked as solved!', 'solved', true),
    ($5,  'Your problem about Calicut railway station has been solved by Muhammed.', 'solved', false)
  `, [
    u['Asif'], u['Aysha'], u['Nargis'], u['Shahid Afridi'], u['Muhasir'],
    u['Shahid Afridi'], u['Asif'], u['Shahid Afridi'], u['Muhammed'], u['Nargis'],
    u['Aysha'], u['Aysha'],
    org['Smart India Hackathon'], org['Smart India Hackathon'], org['Smart India Hackathon'],
    org['Smart India Hackathon'], org['Smart India Hackathon'], org['ISRO'],
    org['Tata Consultancy Services'], org['IIT Bombay'],
    u['Muhammed'], u['Nargis']
  ]);

  console.log('✅ Seed complete — all users, problems, challenges, workspaces and notifications inserted');
}

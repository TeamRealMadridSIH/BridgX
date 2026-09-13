export { PROBLEMS } from './problems';

export const CHALLENGES = [
  { id: 1, title: 'Smart Waste Management System for Indian Cities', description: 'Design an IoT-based solution to optimize municipal solid waste collection using real-time bin fill-level sensors, ML-based route optimization and a citizen reporting app. Solution must work in low-connectivity areas and support 10+ languages.', category: 'Environment', org_id: 11, org_name: 'Smart India Hackathon', org_avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=120&fit=crop', deadline: '2025-02-15T00:00:00Z', prize: '₹1,00,000', status: 'open', community: 'SIH 2024', ps_number: 'SIH1442', theme: 'Smart Cities', created_at: '2024-11-01T00:00:00Z' },
  { id: 2, title: 'Multilingual Chatbot for Government Scheme Discovery', description: 'Build a conversational AI chatbot supporting Malayalam, Hindi, Tamil and English to help citizens discover government schemes, check eligibility, file complaints and track applications — all without visiting a government office.', category: 'Technology', org_id: 11, org_name: 'Smart India Hackathon', org_avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=120&fit=crop', deadline: '2025-01-25T00:00:00Z', prize: '₹80,000', status: 'in_progress', community: 'SIH 2024', ps_number: 'SIH1523', theme: 'GovTech', created_at: '2024-11-01T00:00:00Z' },
  { id: 3, title: 'AI-Powered Crop Disease Detection for Farmers', description: 'Build a mobile app using computer vision to detect crop diseases from smartphone photos. Must work offline, support 20+ crops, provide treatment advice in local language and integrate with Kisan Call Centre.', category: 'Agriculture', org_id: 11, org_name: 'Smart India Hackathon', org_avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=120&fit=crop', deadline: '2025-03-01T00:00:00Z', prize: '₹75,000', status: 'open', community: 'SIH 2024', ps_number: 'SIH1389', theme: 'AgriTech', created_at: '2024-11-01T00:00:00Z' },
  { id: 4, title: 'Satellite Image Analysis for 72-Hour Flood Prediction', description: 'Develop an ML pipeline to analyze ISRO Resourcesat-2 and Cartosat satellite imagery to predict flood-prone zones 72 hours in advance. Must integrate with IMD rainfall data and generate district-level alerts.', category: 'Technology', org_id: 10, org_name: 'ISRO', org_avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/ISRO_Logo.svg/120px-ISRO_Logo.svg.png', deadline: '2025-02-25T00:00:00Z', prize: '₹2,00,000', status: 'open', community: 'ISRO Challenge', ps_number: null, theme: 'Space Tech', created_at: '2024-10-15T00:00:00Z' },
  { id: 5, title: 'Accessible Public Transport Navigation App', description: 'Create an app providing real-time accessibility information for buses, metro and railways for differently-abled citizens. Must include wheelchair route planning, audio navigation, and crowdsourced accessibility ratings.', category: 'Social', org_id: 12, org_name: 'Tata Consultancy Services', org_avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png', deadline: '2025-02-05T00:00:00Z', prize: '₹50,000', status: 'open', community: 'TCS Innovate', ps_number: null, theme: 'Inclusion', created_at: '2024-10-20T00:00:00Z' },
  { id: 6, title: 'Smart Health Monitoring Wearable for Rural Elderly', description: 'Design a low-cost wearable (BOM under ₹800) that monitors SpO2, heart rate and temperature, sends SMS alerts to caregivers when vitals are abnormal, and works without smartphone dependency.', category: 'Health', org_id: 9, org_name: 'IIT Bombay', org_avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/120px-IIT_Bombay_Logo.svg.png', deadline: '2025-02-10T00:00:00Z', prize: '₹1,50,000', status: 'open', community: 'SIH 2024', ps_number: 'SIH1501', theme: 'HealthTech', created_at: '2024-11-01T00:00:00Z' },
];

export const APPLICATIONS = [
  { id: 1, challenge_id: 1, applicant_id: 6, name: 'Shafeeque', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shafeeque', role: 'solver', proposal: 'ESP32-based smart bins with ultrasonic sensors + GSM. Route optimization using Google OR-Tools. Citizen app in React Native with offline support. BOM per bin: ₹1,200.', status: 'pending', created_at: '2024-11-05T00:00:00Z' },
  { id: 2, challenge_id: 1, applicant_id: 8, name: 'Muhasir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhasir', role: 'mentor', proposal: 'LoRa mesh network for bin sensors, MQTT broker on AWS IoT, ML scheduling with Prophet. Already piloted in 2 wards of Kochi.', status: 'pending', created_at: '2024-11-06T00:00:00Z' },
  { id: 3, challenge_id: 2, applicant_id: 1, name: 'Asif', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif', role: 'solver', proposal: 'Rasa NLP pipeline with custom Malayalam tokenizer. Integrated with DigiLocker and UMANG APIs. Tested with 500 users in Malappuram.', status: 'accepted', created_at: '2024-11-03T00:00:00Z' },
  { id: 4, challenge_id: 2, applicant_id: 4, name: 'Shahid Afridi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid', role: 'solver', proposal: 'Fine-tuned Llama-3 on Kerala govt scheme corpus. Voice input via Whisper. WhatsApp integration for rural reach.', status: 'pending', created_at: '2024-11-04T00:00:00Z' },
  { id: 5, challenge_id: 3, applicant_id: 7, name: 'Muhammed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhammed', role: 'solver', proposal: 'YOLOv8 model trained on 50,000 crop disease images. Flutter app with TFLite for offline inference. Supports 25 crops in 6 languages.', status: 'pending', created_at: '2024-11-07T00:00:00Z' },
  { id: 6, challenge_id: 4, applicant_id: 6, name: 'Shafeeque', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shafeeque', role: 'solver', proposal: 'U-Net segmentation on Resourcesat-2 imagery. LSTM for time-series rainfall correlation. Integrated with IMD API. 87% accuracy on 2018-2023 flood data.', status: 'pending', created_at: '2024-11-08T00:00:00Z' },
];

export const WORKSPACES = [
  { id: 1, problem_id: 2, challenge_id: null, github_repo: 'asif-dev/malappuram-water-monitor', name: 'Malappuram Water Crisis', created_at: '2024-11-09T00:00:00Z', members: [{ id: 5, name: 'Mehna', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehna', role: 'citizen' }, { id: 1, name: 'Asif', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif', role: 'solver' }, { id: 3, name: 'Nargis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nargis', role: 'mentor' }] },
  { id: 2, problem_id: 5, challenge_id: null, github_repo: 'shahidafridi/kochi-flood-drain', name: 'Kochi Flood Drainage', created_at: '2024-11-06T00:00:00Z', members: [{ id: 2, name: 'Aysha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aysha', role: 'citizen' }, { id: 4, name: 'Shahid Afridi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid', role: 'solver' }, { id: 8, name: 'Muhasir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhasir', role: 'mentor' }] },
  { id: 3, problem_id: null, challenge_id: 2, github_repo: 'asif-dev/kerala-govbot', name: 'Kerala GovBot Challenge', created_at: '2024-11-04T00:00:00Z', members: [{ id: 1, name: 'Asif', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif', role: 'solver' }, { id: 4, name: 'Shahid Afridi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid', role: 'solver' }, { id: 7, name: 'Muhammed', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhammed', role: 'solver' }, { id: 3, name: 'Nargis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nargis', role: 'mentor' }] },
];

export const MESSAGES = {
  1: [
    { _id: 'm1', workspaceId: '1', senderId: 5, senderName: 'Mehna', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehna', text: 'Hi team! The water situation is getting worse. Ward 12 residents are really suffering.', createdAt: '2024-11-09T09:00:00Z' },
    { _id: 'm2', workspaceId: '1', senderId: 1, senderName: 'Asif', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif', text: 'I have set up the IoT water quality sensors. pH and turbidity readings are way off the charts.', createdAt: '2024-11-09T09:15:00Z' },
    { _id: 'm3', workspaceId: '1', senderId: 3, senderName: 'Nargis', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nargis', text: 'Good work Asif. I have contacted the municipal engineer. They will inspect the pipes tomorrow.', createdAt: '2024-11-09T09:30:00Z' },
    { _id: 'm4', workspaceId: '1', senderId: 1, senderName: 'Asif', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif', text: 'Dashboard is live at malappuram-water.vercel.app — sharing with the municipality now.', createdAt: '2024-11-09T10:00:00Z' },
    { _id: 'm5', workspaceId: '1', senderId: 5, senderName: 'Mehna', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehna', text: 'Amazing! The residents will be so relieved. Thank you both!', createdAt: '2024-11-09T10:10:00Z' },
  ],
  2: [
    { _id: 'm6', workspaceId: '2', senderId: 2, senderName: 'Aysha', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aysha', text: 'Shahid, the drainage channels near Vyttila are completely blocked. I have photos.', createdAt: '2024-11-06T08:00:00Z' },
    { _id: 'm7', workspaceId: '2', senderId: 4, senderName: 'Shahid Afridi', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid', text: 'Received. I am deploying ultrasonic water level sensors at 5 key points today.', createdAt: '2024-11-06T08:30:00Z' },
    { _id: 'm8', workspaceId: '2', senderId: 8, senderName: 'Muhasir', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhasir', text: 'I have set up the AWS IoT pipeline. Alerts will go to the KSEB and municipality WhatsApp groups.', createdAt: '2024-11-06T09:00:00Z' },
    { _id: 'm9', workspaceId: '2', senderId: 4, senderName: 'Shahid Afridi', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid', text: 'Sensors are live. GitHub repo updated with the latest firmware.', createdAt: '2024-11-06T11:00:00Z' },
  ],
  3: [
    { _id: 'm10', workspaceId: '3', senderId: 1, senderName: 'Asif', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif', text: 'Team, our application got accepted! Let us start with the Malayalam NLP module first.', createdAt: '2024-11-04T10:00:00Z' },
    { _id: 'm11', workspaceId: '3', senderId: 7, senderName: 'Muhammed', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhammed', text: 'I have the Rasa pipeline running locally. Malayalam tokenizer accuracy is at 91%.', createdAt: '2024-11-04T10:30:00Z' },
    { _id: 'm12', workspaceId: '3', senderId: 4, senderName: 'Shahid Afridi', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid', text: 'I will handle the DigiLocker and UMANG API integrations. Should be done by Friday.', createdAt: '2024-11-04T11:00:00Z' },
    { _id: 'm13', workspaceId: '3', senderId: 3, senderName: 'Nargis', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nargis', text: 'Great progress everyone. Make sure to document the API endpoints properly for the submission.', createdAt: '2024-11-04T11:30:00Z' },
    { _id: 'm14', workspaceId: '3', senderId: 1, senderName: 'Asif', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif', text: 'Demo video is ready. Uploading to the repo now. Submission deadline is in 3 days!', createdAt: '2024-11-05T09:00:00Z' },
  ],
};

export const NOTIFICATIONS = {
  1: [ // Asif
    { id: 1, user_id: 1, message: 'Your solve request for the Malappuram water problem was accepted! Workspace is ready.', type: 'accepted', read: false, created_at: '2024-11-09T08:00:00Z' },
    { id: 2, user_id: 1, message: 'Your application for the Multilingual Chatbot challenge was accepted! Workspace is ready.', type: 'accepted', read: false, created_at: '2024-11-04T09:00:00Z' },
    { id: 3, user_id: 1, message: 'Mehna commented on the Malappuram water problem.', type: 'solve_request', read: true, created_at: '2024-11-09T10:00:00Z' },
  ],
  2: [ // Aysha
    { id: 4, user_id: 2, message: 'Asif has joined your problem workspace for Malappuram water contamination.', type: 'solve_request', read: false, created_at: '2024-11-09T08:05:00Z' },
    { id: 5, user_id: 2, message: 'Shahid Afridi has joined your Kochi flood drainage workspace.', type: 'solve_request', read: false, created_at: '2024-11-06T07:00:00Z' },
    { id: 6, user_id: 2, message: 'Muhammed wants to solve your pothole problem in Bengaluru.', type: 'solve_request', read: false, created_at: '2024-11-03T10:00:00Z' },
  ],
  3: [ // Nargis
    { id: 7, user_id: 3, message: 'You have been added as mentor to the Malappuram water workspace.', type: 'accepted', read: true, created_at: '2024-11-09T08:10:00Z' },
    { id: 8, user_id: 3, message: 'You have been added as mentor to the GovBot challenge workspace.', type: 'accepted', read: true, created_at: '2024-11-04T09:05:00Z' },
    { id: 9, user_id: 3, message: 'Calicut railway station accessibility problem has been marked as solved!', type: 'solved', read: true, created_at: '2024-10-25T10:00:00Z' },
  ],
  4: [ // Shahid
    { id: 10, user_id: 4, message: 'Your solve request for Kochi flood drainage was accepted! Workspace is ready.', type: 'accepted', read: false, created_at: '2024-11-06T07:05:00Z' },
    { id: 11, user_id: 4, message: 'You have been added to the GovBot challenge workspace.', type: 'accepted', read: false, created_at: '2024-11-04T09:10:00Z' },
  ],
  5: [ // Mehna
    { id: 12, user_id: 5, message: 'Asif wants to solve your Malappuram water contamination problem!', type: 'solve_request', read: false, created_at: '2024-11-08T12:00:00Z' },
    { id: 13, user_id: 5, message: 'Your problem about Calicut railway station has been solved by Muhammed.', type: 'solved', read: false, created_at: '2024-10-25T10:05:00Z' },
  ],
  6: [ // Shafeeque
    { id: 14, user_id: 6, message: 'Smart India Hackathon reviewed your application for Smart Waste Management.', type: 'application', read: false, created_at: '2024-11-07T10:00:00Z' },
    { id: 15, user_id: 6, message: 'ISRO reviewed your application for Flood Prediction challenge.', type: 'application', read: true, created_at: '2024-11-09T09:00:00Z' },
  ],
  7: [ // Muhammed
    { id: 16, user_id: 7, message: 'You have been added to the GovBot challenge workspace.', type: 'accepted', read: false, created_at: '2024-11-04T09:15:00Z' },
    { id: 17, user_id: 7, message: 'SIH reviewed your application for Crop Disease Detection.', type: 'application', read: true, created_at: '2024-11-08T11:00:00Z' },
  ],
  8: [ // Muhasir
    { id: 18, user_id: 8, message: 'You have been added as mentor to the Kochi flood workspace.', type: 'accepted', read: true, created_at: '2024-11-06T07:10:00Z' },
    { id: 19, user_id: 8, message: 'Shafeeque applied to your Smart Waste Management challenge.', type: 'application', read: false, created_at: '2024-11-05T10:00:00Z' },
  ],
};

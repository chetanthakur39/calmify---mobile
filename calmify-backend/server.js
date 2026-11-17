const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'calmify_jwt_secret_production_2026';

app.use(cors());
app.use(express.json());

// ==================== AUTH MIDDLEWARE ====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ==================== 1. AUTH ROUTES ====================
// Register / Sign Up
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existing = checkStmt.get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertStmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = insertStmt.run(name.trim(), email.toLowerCase().trim(), hashedPassword);

    const token = jwt.sign({ id: Number(result.lastInsertRowid), email, name }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({
      token,
      user: { id: Number(result.lastInsertRowid), name, email }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login / Sign In
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const findStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = findStmt.get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// Current User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
  const user = stmt.get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// ==================== 2. DAILY MOOD TRACKING ====================
// Get mood history
app.get('/api/mood', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, mood, note, created_at as createdAt FROM mood_entries WHERE user_id = ? ORDER BY id DESC');
    const entries = stmt.all(req.user.id);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
});

// Save daily mood
app.post('/api/mood', authenticateToken, (req, res) => {
  try {
    const { mood, note } = req.body;
    if (!mood || mood < 1 || mood > 5) {
      return res.status(400).json({ error: 'Mood score must be between 1 and 5' });
    }

    const stmt = db.prepare('INSERT INTO mood_entries (user_id, mood, note) VALUES (?, ?, ?)');
    const result = stmt.run(req.user.id, mood, note || '');

    const newEntry = db.prepare('SELECT id, mood, note, created_at as createdAt FROM mood_entries WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save mood entry' });
  }
});

// ==================== 3. FEATURE 1: FACIAL STRESS DETECTION ====================
app.post('/api/stress/scan', authenticateToken, (req, res) => {
  try {
    const { stressScore, expression, heartRateEst, recommendation } = req.body;
    const stmt = db.prepare(`
      INSERT INTO stress_scans (user_id, stress_score, expression, heart_rate_est, recommendation)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      req.user.id,
      stressScore || 45,
      expression || 'Neutral',
      heartRateEst || 72,
      recommendation || 'Take 3 deep box-breaths to reset cortisol levels.'
    );

    res.status(201).json({
      id: Number(result.lastInsertRowid),
      message: 'Facial stress scan logged successfully',
      stressScore,
      expression,
      recommendation
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log facial stress scan' });
  }
});

app.get('/api/stress/recent', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM stress_scans WHERE user_id = ? ORDER BY id DESC LIMIT 10');
    const scans = stmt.all(req.user.id);
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stress history' });
  }
});

// ==================== 4. FEATURE 2: YOGA POSE CORRECTNESS ====================
app.post('/api/yoga/session', authenticateToken, (req, res) => {
  try {
    const { poseName, efficiency, feedback } = req.body;
    const stmt = db.prepare(`
      INSERT INTO yoga_sessions (user_id, pose_name, efficiency, feedback)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(req.user.id, poseName || 'Tree Pose', efficiency || 85, feedback || 'Great alignment');

    res.status(201).json({
      id: Number(result.lastInsertRowid),
      poseName,
      efficiency,
      feedback
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save yoga session' });
  }
});

app.get('/api/yoga/history', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM yoga_sessions WHERE user_id = ? ORDER BY id DESC LIMIT 10');
    res.json(stmt.all(req.user.id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch yoga sessions' });
  }
});

// ==================== 5. FEATURE 3: MONTHLY & WEEKLY ANALYTICS ====================
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
  try {
    const moodStmt = db.prepare(`
      SELECT mood, created_at 
      FROM mood_entries 
      WHERE user_id = ? 
      ORDER BY id DESC LIMIT 30
    `);
    const moods = moodStmt.all(req.user.id);

    const stressStmt = db.prepare(`
      SELECT stress_score, created_at 
      FROM stress_scans 
      WHERE user_id = ? 
      ORDER BY id DESC LIMIT 30
    `);
    const stresses = stressStmt.all(req.user.id);

    // Calculate analytics
    const totalMoods = moods.length;
    const avgMood = totalMoods ? (moods.reduce((a, b) => a + b.mood, 0) / totalMoods).toFixed(1) : 4.2;
    const highestMood = totalMoods ? Math.max(...moods.map(m => m.mood)) : 5;
    const lowestMood = totalMoods ? Math.min(...moods.map(m => m.mood)) : 2;

    const avgStress = stresses.length 
      ? Math.round(stresses.reduce((a, b) => a + b.stress_score, 0) / stresses.length)
      : 38;

    // AI suggestion engine based on trends
    let aiSuggestion = "Your emotional baseline is stable! Maintain your morning mindfulness and hydration routines.";
    if (avgStress > 60 || Number(avgMood) < 2.5) {
      aiSuggestion = "Elevated stress detected over past scans. We recommend 10 mins of Vrikshasana (Tree Pose) and a 4-7-8 breathing session.";
    } else if (avgStress < 30) {
      aiSuggestion = "Optimal relaxation zone achieved. Great time for deep creative work and restful sleep.";
    }

    res.json({
      summary: {
        avgMood: Number(avgMood),
        avgStress,
        highestMood,
        lowestMood,
        totalEntries: totalMoods,
        streakDays: Math.min(totalMoods, 7),
        aiSuggestion
      },
      recentMoods: moods.slice(0, 7),
      recentStress: stresses.slice(0, 7)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute analytics dashboard' });
  }
});

// ==================== 6. FEATURE 4: AI STRESS CHATBOT ====================
const KNOWLEDGE_BASE = [
  { keywords: ['stress', 'stressed', 'overwhelm', 'pressure'], reply: "When stress peaks, trigger the physiological sigh: inhale twice through the nose, then take a long, slow exhale through your mouth. Doing this 3 times immediately drops your heart rate." },
  { keywords: ['anxiety', 'anxious', 'panic', 'nervous'], reply: "Try the 5-4-3-2-1 grounding technique: acknowledge 5 things you can see, 4 you can touch, 3 you hear, 2 you smell, and 1 you can taste. This brings you back into the present moment." },
  { keywords: ['sleep', 'insomnia', 'tired', 'rest'], reply: "For restorative sleep: avoid screens 45 minutes before bed, keep your room cool (around 19°C / 66°F), and practice 4-7-8 breathing as you lie down." },
  { keywords: ['yoga', 'exercise', 'body', 'stretch'], reply: "Yoga directly reduces cortisol levels! Check out our Pose Checker tab to practice Tree Pose or Child's Pose with real-time alignment feedback." },
  { keywords: ['game', 'relax', 'bored', 'fun'], reply: "Visit our Zen Garden mini-game in the Doctors & Games tab! Popping mindful ripple bubbles stimulates dopamine and breaks stress loops." },
  { keywords: ['doctor', 'therapist', 'help', 'clinic'], reply: "If stress persists, professional support is invaluable. Switch to our 'Doctors & Maps' tab to find verified mental health specialists and clinics near you with one-click navigation." }
];

app.post('/api/chat', authenticateToken, (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const lower = message.toLowerCase();
    let reply = "I'm right here with you. Take a gentle breath. Tell me more about what's feeling heavy right now, or try asking about breathing techniques, sleep tips, or finding calm.";

    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(k => lower.includes(k))) {
        reply = item.reply;
        break;
      }
    }

    // Save to chat history
    db.prepare('INSERT INTO chat_history (user_id, sender, message) VALUES (?, ?, ?)').run(req.user.id, 'user', message);
    db.prepare('INSERT INTO chat_history (user_id, sender, message) VALUES (?, ?, ?)').run(req.user.id, 'bot', reply);

    res.json({ reply, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Chatbot processing error' });
  }
});

app.get('/api/chat/history', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT sender, message, created_at as timestamp FROM chat_history WHERE user_id = ? ORDER BY id ASC LIMIT 50');
    res.json(stmt.all(req.user.id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// ==================== 7. FEATURE 5: DOCTORS DIRECTORY ====================
app.get('/api/doctors', (req, res) => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Ananya Sharma, MD",
      specialty: "Clinical Psychiatrist & Anxiety Specialist",
      clinic: "MindCare Wellness Center",
      rating: 4.9,
      distance: "1.2 km away",
      phone: "+91 98112 34567",
      address: "Suite 402, Green Park Avenue",
      mapsQuery: "Psychiatrist near me"
    },
    {
      id: 2,
      name: "Dr. Rajesh Verma, Ph.D.",
      specialty: "Cognitive Behavioral Therapist (CBT)",
      clinic: "Peace of Mind Counseling",
      rating: 4.8,
      distance: "2.5 km away",
      phone: "+91 98223 45678",
      address: "14B Sunrise Hub, Metro Station Road",
      mapsQuery: "Therapist near me"
    },
    {
      id: 3,
      name: "Dr. Neha Kulkarni",
      specialty: "Mindfulness & Stress Management Expert",
      clinic: "Holistic Health & Yoga Institute",
      rating: 4.9,
      distance: "3.8 km away",
      phone: "+91 98334 56789",
      address: "7th Cross, Lotus Garden",
      mapsQuery: "Mental Health Clinic near me"
    }
  ];
  res.json(doctors);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', platform: 'Calmify API', database: 'SQLite', timestamp: new Date().toISOString() });
});


// ==================== REPO COMPATIBILITY ROUTES (/api/users, /api/moods, /api/ai) ====================
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  if (checkStmt.get(email.toLowerCase().trim())) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name || 'User', email.toLowerCase().trim(), hash);
  const token = jwt.sign({ id: Number(result.lastInsertRowid), email, name }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: Number(result.lastInsertRowid), name: name || 'User', email } });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email?.toLowerCase().trim());
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  const bcrypt = require('bcryptjs');
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/moods', (req, res) => {
  try {
    const list = db.prepare('SELECT id, mood, note, created_at as createdAt FROM mood_entries ORDER BY id DESC LIMIT 50').all();
    res.json(list);
  } catch(e) { res.json([]); }
});

app.post('/api/moods', (req, res) => {
  try {
    const { mood, note, score } = req.body;
    const finalMood = mood || score || 4;
    const result = db.prepare('INSERT INTO mood_entries (user_id, mood, note) VALUES (?, ?, ?)').run(1, Number(finalMood), note || '');
    res.json({ id: Number(result.lastInsertRowid), mood: finalMood, note });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/moods/report', (req, res) => {
  try {
    const moods = db.prepare('SELECT mood, created_at FROM mood_entries ORDER BY id DESC LIMIT 30').all();
    res.json({ report: moods, summary: { count: moods.length } });
  } catch(e) { res.json({ report: [] }); }
});

app.post('/api/ai/analyze', (req, res) => {
  const { notes, text } = req.body;
  res.json({
    sentiment: 'Positive & Grounded',
    advice: 'Your expressions indicate good resilience. Keep doing daily breathing exercises.',
    score: 85
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Calmify API Server running on http://localhost:${PORT}`);
});

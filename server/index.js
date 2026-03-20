require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db, dbRun, dbGet, dbAll, initDB } = require('./database');
const { generateToken, authenticateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// --- AUTH ROUTES ---

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await dbGet('SELECT id, email, plan_id FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    try {
        const password_hash = await bcrypt.hash(password, 10);
        const id = uuidv4();
        await dbRun('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, email, password_hash]);
        
        const user = { id, email, plan_id: 'free' };
        const token = generateToken(user);
        res.status(201).json({ user, session: { access_token: token } });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.json({ 
            user: { id: user.id, email: user.email, plan_id: user.plan_id }, 
            session: { access_token: token } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
    try {
        const products = await dbAll('SELECT * FROM products ORDER BY created_at DESC');
        res.json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GEODATA ROUTES ---

app.get('/api/geodata/layers', authenticateToken, async (req, res) => {
    try {
        const layers = await dbAll('SELECT * FROM geodata_layers');
        res.json({ data: layers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SEPAY WEBHOOK ---

app.post('/api/webhooks/sepay', async (req, res) => {
    try {
        const payload = req.body;
        console.log('SePay Webhook received:', payload);

        const content = payload.content || "";
        const match = content.match(/VCK\s*(\d+)/i);
        
        if (!match) {
            return res.status(200).json({ error: 'No order code found' });
        }

        const orderCode = match[1];

        // 1. Find pending payment
        const payment = await dbGet('SELECT * FROM payment_history WHERE order_code = ? AND status = ?', [orderCode, 'pending']);
        if (!payment) {
            return res.status(200).json({ error: 'Payment not found or processed' });
        }

        // 2. Update status
        await dbRun('UPDATE payment_history SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_code = ?', ['PAID', orderCode]);

        // 3. Upgrade user plan
        await dbRun('UPDATE users SET plan_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [payment.plan_id, payment.user_id]);

        console.log(`User ${payment.user_id} upgraded to ${payment.plan_id}`);
        res.json({ success: true });

    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

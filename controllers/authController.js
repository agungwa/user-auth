// const pool = require('../config/db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 8);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function findUserByUsername(username) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
        return result[0];
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function register(req, res) {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const user = await findUserByUsername(username);
        if (user) {
            return res.status(409).send({message:'User exist'});
        }
        await createUser(username, password);
        res.status(201).send({message:'User registered'});
    } catch (err) {
        console.log(err.sqlMessage)
        res.status(500).send({message:'Error registering user'});
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(400).send({message:'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({message:'Invalid credentials'});
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error logging in');
    }
}

export { register, login };
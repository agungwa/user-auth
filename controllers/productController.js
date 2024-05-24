// const pool = require('../config/db');
import pool from '../config/db.js';

async function getProducts(req, res) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('SELECT * FROM product');
        res.json(result);
    } catch (err) {
        res.status(500).send('Error fetching products');
    } finally {
        if (conn) conn.release();
    }
}

async function getProductById(req, res) {
    const productId = req.params.id;
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query('SELECT * FROM product WHERE productID = ?', [productId]);
        if (!result[0]) {
            return res.status(404).send({message:'Product not found'});
        }
        res.json(result[0]);
    } catch (err) {
        res.status(500).send('Error fetching product');
    } finally {
        if (conn) conn.release();
    }
}

export { getProducts, getProductById };
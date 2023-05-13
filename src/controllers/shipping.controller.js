import { pool } from '../db/database.js'
import { encryptPassword, comparePassword } from '../libs/encrypt.js'
import jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode'
import { randomUUID } from 'crypto'
import boxes from '../public/boxes.json'
import fetch from "node-fetch"
import { SESSION_TRACKER, APIKEY } from '../config.js'
import { json } from 'express'

export const regularExpression = (data) => {
  let regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
  return regex.exec(data)[0]
}
export const getCategorias = async (req, res) => {

  try {

    const [rows] = await pool.query('SELECT * FROM productCategories')
    res.json(rows)

  } catch (error) {

    return res.status(500).json({
      message: "error consulta mire la peticion o la conexion de DB"
    })

  }
}
export const getShippingCart = async (req, res) => {

  let totalWeight = 0
  let totalValue = 0
  let totalQuantity = 0
  
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt_decode(token)

    const [user] = await pool.query('SELECT * FROM Usuarios WHERE id_user = ?', [decoded.id])

    const [shippingCart] = await pool.query('SELECT * FROM items_sending_cart WHERE user_id = ?', user[0].id_user)

    
    //////////
    for ( let i of shippingCart) {
      const [nameC] = await pool.query('SELECT * FROM productCategories WHERE id_Categories = ?', [i.id_category])
      i.category_name = nameC[0].nameCategories;
    }
    /////////

    for (let i of shippingCart) {
      totalWeight += i.weight
      totalValue += i.declared_value
      totalQuantity += i.quantity
    }

    const shippingBox = boxes.filter(box => box.min_weight < totalWeight && totalWeight <= box.max_weight)


    return res.status(200).json({
      cart: shippingCart,
      assigned_box: shippingBox[0],
      totalWeight,
      totalValue,
      totalQuantity

    })

  } catch (error) {
    console.log(error)

  }


}
export const sendShippingCart = async (req, res) => {
  const { id_category, quantity, weight, declaredValue } = req.body

  try {
    const token = req.headers.authorization;   
    const decoded = jwt_decode(token.split(' ')[1])
    const [user] = await pool.query('SELECT * FROM Usuarios WHERE id_user=?', [decoded.id])
    const [category] = await pool.query('SELECT * FROM productCategories WHERE id_Categories=?', [id_category])

    if (weight > 50) return res.status(400).json({ message: 'Weight exceed' })

    const newShipping = {
      id: randomUUID(),
      quantity,
      declared_value: declaredValue,
      id_category: category[0].id_Categories,
      weight,
      user_id: user[0].id_user
    }
    await pool.query('INSERT INTO items_sending_cart SET ?', [newShipping])

    return res.status(200).json({
      message: 'Item Added Successfully'
    })

  } catch (error) {
    console.log(error)
  }


}
export const deleteItemCart = async (req, res) => {

  const { id } = req.params
  console.log(id);

  try {

    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt_decode(token)

    const [user] = await pool.query('SELECT * FROM Usuarios WHERE id_user=?', [decoded.id])

    const [items] = await pool.query('SELECT * FROM items_sending_cart WHERE user_id=?', user[0].id_user)

    await pool.query('DELETE FROM items_sending_cart WHERE id=? AND user_id=?', [id, items[0].user_id])

    res.status(200).json({
      message: 'Item deleted successfully'
    })


  } catch (error) {
    console.log(error);
  }
}
export const generateQuote = async (req, res) => {

  //const { destiny, weight, quantity, declaredValue } = req.body
  const { destiny, height, width, length, weight, declaredValue } = req.body

  try {
    //const token = req.headers.authorization
    //const decoded = jwt_decode(token.split(' ')[1])

    //const user = await pool.query('SELECT * FROM users WHERE id=?', [decoded.id])

    if (weight === 0 || weight < 0 || weight > 50) {
      return res.status(400).json({ message: "Dato invalid" })
    }

    //const shippingBox = boxes.filter(box => box.min_weight < weight && weight <= box.max_weight)

    let destinyLoc = regularExpression(destiny)


    const [idLocationDestiny] = await pool.query('SELECT * FROM locations WHERE locationName=?', destinyLoc)

    const quote = {
      originLocationCode: "11001000",
      destinyLocationCode: idLocationDestiny[0].locationCode,
      //height: shippingBox[0].height,
      //width: shippingBox[0].width,
      //length: shippingBox[0].length,
      //weight: shippingBox[0].max_weight,
      height,
      width,
      length,
      weight,
      quantity: 1,
      declaredValue,
      saleValue: 250000
    }

    const response = await fetch('https://api-v2.dev.mpr.mipaquete.com/quoteShipping', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "session-tracker": SESSION_TRACKER,
        "apikey": APIKEY
      },
      body: JSON.stringify(quote)
    })

    const data = await response.json()
    if (data.length <= 0) return res.status(400).json({ message: 'Fuera de Rango' })

    return res.status(200).json({
      data
    })
  } catch (e) {
    console.log(e)
  }


}
//module.exports = { generateQuote }
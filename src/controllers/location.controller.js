import fetch from "node-fetch"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ciudades = require('../public/ciudades.json')
export const departamentosCO = async (req, res) => {
    res.json(ciudades);
  /*try {
    const response = await fetch(
      "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json",
      {
        method: "GET"
      }
    );
    const data = await response.json()
    if (data.length <= 0) return res.status(400).json({ message: 'Error' })

    return res.status(200).json({
      data
    })

  } catch (error) {
    console.log(error);
  }*/
};

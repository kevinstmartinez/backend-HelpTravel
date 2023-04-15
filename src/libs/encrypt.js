import bcrypt from 'bcryptjs'

// para encriptar la contraseña
export const encrypPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

// para comparar contraseña ingresada y guardada
export const comparePassword = async (password, recivedPassword) => {
    const compare = await bcrypt.compare(password, recivedPassword)
    return compare
}
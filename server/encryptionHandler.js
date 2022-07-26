require('dotenv').config()
const crypto = require('crypto')
const secret = `${process.env.SECRET}`

const encrypt = (plaintext) => {
	const iv = Buffer.from(crypto.randomBytes(16))
	const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secret), iv)

	const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()])

	return { iv: iv.toString('hex'), password: ciphertext.toString('hex') }
}

const decrypt = (ciphertext) => {
	const decipher = crypto.createDecipheriv(
		'aes-256-ctr',
		Buffer.from(secret),
		Buffer.from(ciphertext.iv, 'hex'),
	)

	const plaintext = Buffer.concat([
		decipher.update(Buffer.from(ciphertext.password, 'hex')),
		decipher.final(),
	])

	return plaintext.toString()
}

module.exports = { encrypt, decrypt }

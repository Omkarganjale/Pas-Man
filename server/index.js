require('dotenv').config()

const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const queries = require('./queries.json')
const { encrypt, decrypt } = require('./encryptionHandler')
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
	user: `${process.env.DB_USER}`,
	host: `${process.env.DB_HOST}`,
	password: `${process.env.DB_PASS}`,
	database: `${process.env.DB_NAME}`,
})

app.post('/decryptpassword', (req, res) => {
	res.send(decrypt(req.body))
})

app.post('/addPassword', (req, res) => {
	console.log('connection request received')
	const { loginId, password, title } = req.body
	const encryptedPass = encrypt(password)
	db.query(
		queries.addPW,
		[loginId, encryptedPass.password, title, encryptedPass.iv],
		(result, err) => {
			if (err) {
				console.log(err)
			} else {
				result.send('Success!')
			}
		},
	)
})

app.get('/showpasswords', (req, res) => {
	db.query(queries.showPW, (err, result) => {
		if (err) {
			console.log(err)
		} else {
			res.send(result)
		}
	})
})

app.get('*', (req, res) => {
	res.send('Getting you results for ' + req.url)
})

app.post('*', (req, res) => {
	console.log('post *')
	res.send('random POST received')
})

app.listen(process.env.PORT, () => {
	console.log('Server Listening on ' + process.env.PORT)
})

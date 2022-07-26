import Axios from 'axios'
import { useState, useEffect } from 'react'

import './App.css'
import config from './config.json'

function App() {
	// password and title saved into state
	const [password, setPassword] = useState('')
	const [title, setTitle] = useState('')
	const [loginId, setLoginId] = useState('')
	const [passwordList, setPasswordList] = useState([])

	useEffect(() => {
		Axios.get(config.url + '/showpasswords').then((response) => {
			setPasswordList(response.data)
		})
	}, [])

	const onTitleChange = (newTitle) => {
		setTitle(newTitle)
	}

	const onLoginIdChange = (newLoginId) => {
		setLoginId(newLoginId)
	}

	const onPasswordChange = (newPassword) => {
		setPassword(newPassword)
	}

	const onSubmit = () => {
		if (
			loginId == '' ||
			title == '' ||
			password == '' ||
			loginId == null ||
			title == null ||
			password == null
		) {
			alert('Invalid/Blank credentials')
			return
		}
		const postUrl = config.url + '/addPassword'
		Axios.post(postUrl, {
			loginId: loginId,
			password: password,
			title: title,
		})
		window.location.reload()
	}

	const decryptPassword = (encryption) => {
		Axios.post('http://localhost:3001/decryptpassword', {
			password: encryption.password,
			iv: encryption.iv,
		}).then((response) => {
			setPasswordList(
				passwordList.map((val) => {
					return val.id == encryption.id
						? {
								id: val.id,
								loginId: val.loginId,
								password: val.password,
								title: `${val.loginId}  @ ${response.data}`,
								iv: val.iv,
						  }
						: val
				}),
			)
		})
	}

	return (
		<div className='App'>
			<div className='addPassword'>
				{/* <p> Pas-Man </p> */}

				{/* title textbox */}
				<input
					type='text'
					name=''
					id=''
					placeholder='Ex. Facebook'
					onChange={(e) => {
						onTitleChange(e.target.value)
					}}
				/>

				{/* login id  */}
				<input
					type='text'
					name=''
					id=''
					placeholder='Ex. john_Doe'
					onChange={(e) => {
						onLoginIdChange(e.target.value)
					}}
				/>

				{/* password textbox */}
				<input
					type='text'
					name=''
					id=''
					placeholder='Ex. password123'
					onChange={(e) => {
						onPasswordChange(e.target.value)
					}}
				/>

				{/* submit button */}
				<button
					onClick={() => {
						onSubmit()
					}}
				>
					Add Password
				</button>
			</div>

			<div className='passwords'>
				{passwordList.map((val, key) => {
					return (
						<div
							className='password'
							id={val.id}
							onClick={() => {
								decryptPassword({
									password: val.password,
									loginId: val.loginId,
									iv: val.iv,
									id: val.id,
								})
							}}
							key={key}
						>
							<h3>{`${val.title}`}</h3>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default App

import express from 'express'
import { createServer } from 'http'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import ElementState from './models/elements.js'

const app = express()
const httpServer = createServer(app)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/drawboard')

const io = new Server(httpServer, {
	cors: {
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', function (socket) {
	socket.on('get-room', async (documentId) => {
		if (documentId == null) return
		const room = await findOrCreateRoom(documentId)
		socket.join(documentId)
		socket.emit('load-document', room.data)
		socket.on('elements-change', async (data) => {
			if (data == null) return
			socket.broadcast.to(documentId).emit('get-element-changes', data)
			const res = await ElementState.findByIdAndUpdate(documentId, { data })
		})
	})
})

httpServer.listen(process.env.PORT || 3001)

//finds room for the user, if not present creates a new room
const findOrCreateRoom = async (documentId) => {
	if (documentId == null) return

	const room = await ElementState.findById(documentId)
	if (room) return room

	return await ElementState.create({
		_id: documentId,
		data: [],
	})
}

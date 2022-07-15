import express from 'express'
import { createServer } from 'http'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import ElementState from './models/elements.js'

const app = express()
const httpServer = createServer(app)

mongoose.connect('mongodb://localhost/drawboard')

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
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

httpServer.listen(3001, () => {})

const findOrCreateRoom = async (documentId) => {
	if (documentId == null) return

	const room = await ElementState.findById(documentId)
	if (room) return room

	return await ElementState.create({
		_id: documentId,
		data: [],
	})
}

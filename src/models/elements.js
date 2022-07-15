import mongoose from 'mongoose'
const { Schema, model } = mongoose

const pointSchema = new Schema({
	x: { type: Number, required: true },
	y: { type: Number, required: true },
})

const elementSchema = new Schema({
	elementId: { type: Number, required: true },
	points: [pointSchema],
	x1: Number,
	y1: Number,
	x2: Number,
	y2: Number,
	type: { type: String, required: true },
	strokeColor: { type: String, required: true },
	strokeWidth: { type: Number, required: true },
})

const ElementStateSchema = new Schema({
	_id: String,
	data: [elementSchema],
})

export default model('ElementState', ElementStateSchema)

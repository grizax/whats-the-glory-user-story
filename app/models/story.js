var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StorySchema = new Schema({

	// To Link a Schema to another Schema we have to refer it

	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	content: String,
	created: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Story', StorySchema);

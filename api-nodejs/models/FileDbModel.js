const mongoose = require('mongoose');
const { Schema } = mongoose;
var randomWords = require('random-words');

const filesSchema = new Schema({
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true, immutable: true},
    filename: { type: String, required: true },
    isPrivate: { type: Boolean, required: true, default: false},
    path: { type: String, required: true, immutable: true},
    route: { 
      type: String, 
      required: true, 
      maxlength: [ 12 , 'The route can be up to 12 characters.'],
      match: [/^[A-Za-z0-9]*$/, 'Only letters and numbers'],
      unique: [true, 'This route has been taken by another user.']
    },
    size: { type: Number, required: true, immutable: true },
    date: { type: Date, immutable: true ,default: Date.now },
    expiredate: {type: Date, immutable: true ,default: () => new Date(+new Date() + 1000 * 60 * 60 * 24 * 3)}
  });

const FileDbModel = mongoose.model('File', filesSchema);

module.exports = FileDbModel;
import mongoose from 'mongoose';


const followSchema = new mongoose.Schema({
  follower: {
    type: String,
    required: true
  },
  followee: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  }
}, {
  timestamps: true
})

followSchema.index({ follower: 1, followee: 1 }, { unique: true })

export default mongoose.model('Follow', followSchema)
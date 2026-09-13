import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true, index: true },
  senderId: { type: Number, required: true },
  senderName: { type: String },
  senderAvatar: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model('Message', messageSchema);

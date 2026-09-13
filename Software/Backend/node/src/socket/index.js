import { Message } from '../models/Message.js';

export function initSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join_workspace', (workspaceId) => {
      socket.join(workspaceId);
    });

    socket.on('send_message', async ({ workspaceId, senderId, senderName, senderAvatar, text }) => {
      const msg = await Message.create({ workspaceId, senderId, senderName, senderAvatar, text });
      io.to(workspaceId).emit('new_message', msg);
    });

    socket.on('leave_workspace', (workspaceId) => {
      socket.leave(workspaceId);
    });
  });
}

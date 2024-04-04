const Message = require('../models/Message');
const Conversation = require('../models/Conversation');


const postMessage = async (req, res) => {
    const { conversationId, content, memberId, type } = req.body; // Lấy thông tin tin nhắn từ request body
    const createAt = new Date(); // Lấy thời gian hiện tại

    try {
        // Tạo một tin nhắn mới
        const message = new Message({
            content,
            memberId,
            type,
            createAt // Thêm thời gian tạo vào tin nhắn
        });

        // Lưu tin nhắn vào cơ sở dữ liệu
        const newMessage = await message.save();

        // Tìm cuộc trò chuyện hoặc nhóm tương ứng
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Thêm tin nhắn vào cuộc trò chuyện hoặc nhóm
        conversation.messages.push(newMessage._id);
        await conversation.save();

        // Trả về tin nhắn mới được tạo
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    postMessage
};
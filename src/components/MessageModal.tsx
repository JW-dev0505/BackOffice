import React from 'react';

interface MessageModalProps {
  message: { title: string; body: string; createdAt: string };
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{message.title}</h2>
        <p className="text-gray-700 mb-4">{message.body}</p>
        <small className="block mb-4 text-gray-500">
          Received on: {new Date(message.createdAt).toLocaleString()}
        </small>
        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;

import React, { useState } from 'react';

function Chat() {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Chat del Sistema</h3>
        <p className="text-gray-500">
          El sistema de chat completo está disponible con el backend
        </p>
      </div>
    </div>
  );
}

export default Chat;
window.Chat = Chat;
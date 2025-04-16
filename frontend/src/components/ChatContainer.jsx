import React from 'react'
import {useChatStore} from '../store/useChatStore';
import MessageSkeleton from './Skeletons/MessageSkeleton';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useEffect } from 'react';

const ChatContainer = () => {

  const {messages, getMessages,isMessagesloading,selectedUser}=useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id)
  }, [selectedUser._id,getMessages]);
  
  if(isMessagesloading) { return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )
}

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      
      <ChatHeader/>

      <p>Messages....</p>

      <MessageInput/>
    </div>
  )
}

export default ChatContainer
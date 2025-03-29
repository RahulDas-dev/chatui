import './App.css';
import ChatArea from './components/chatarea';
import SideBar from './components/sidebar';
import TitleBar from './components/titlebar';
import React, { FC, useState } from 'react';

const App: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className='app flex flex-row h-screen'>
      <SideBar isVisible={isVisible} toggleSidebar={toggleSidebar} />
      <div className='app-body flex-1 h-full bg-amber-400'>
        <TitleBar toggleSidebar={toggleSidebar} />
        <ChatArea />
      </div>
    </div>
  );
}

export default App;

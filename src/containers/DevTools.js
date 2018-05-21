import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

// 参数过长会有个格式bug，所以关闭eslint
/* eslint-disable */
export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-w">
    <LogMonitor />
  </DockMonitor>,
);

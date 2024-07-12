import React, { useReducer, useState } from 'react';
import { ConfigProvider, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { customTheme } from "@/theme/config";
import { getInitialThemeState, getAlgorithm, themeReducer } from "@/theme/themeSettings";
import { getInitialLayoutMode, setLayoutMode } from "@/theme/layoutSettings";
import { AppContext } from "@/stores/AppContext";
import Router from "@/router/index";

// 设置默认指示符
Spin.setDefaultIndicator(<LoadingOutlined style={{ fontSize: 36 }} spin />);

export const App = () => {
  // 主题颜色切换
  const [themeState, dispatch] = useReducer(themeReducer, getInitialThemeState());
  // 布局切换
  const [layoutMode, setLayoutModeState] = useState(getInitialLayoutMode());
  return (
    <AppContext.Provider
      value={{
        setTheme: dispatch,
        layoutMode: layoutMode,
        setLayoutMode: (mode) => setLayoutMode(mode, setLayoutModeState)
      }}
    >
      <ConfigProvider
        theme={{
          ...customTheme,
          algorithm: getAlgorithm(themeState.algorithm),
        }}
        componentSize={themeState.componentSize}
        locale={zhCN}
      >
        <Router />
      </ConfigProvider>
    </AppContext.Provider>
  );
};
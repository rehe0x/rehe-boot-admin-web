import storage from "@/common/storage";
import ThemeAlgorithm from "@/theme/algorithm";

export const getInitialThemeState = () => {
  const themeConfig: { algorithm?: string; componentSize?: string } = storage.getStorage('themeConfig') || {};
  
  return {
    algorithm: themeConfig.algorithm || 'light',
    componentSize: themeConfig.componentSize || 'middle',
  };
};

export const getAlgorithm = (action: string) => {
  switch (action) {
    case 'light':
      return ThemeAlgorithm.CustomDefaultAlgorithm;
    case 'dark':
      return ThemeAlgorithm.CustomDarkAlgorithm;
    default:
      return ThemeAlgorithm.CustomDefaultAlgorithm;
  }
};

export const themeReducer = (state: any, action: string) => {
  if (action === 'light' || action === 'dark') {
    state.algorithm = action;
  } else {
    state.componentSize = action;
  }

  storage.setStorage('themeConfig', JSON.stringify(state));
  return { ...state };
};
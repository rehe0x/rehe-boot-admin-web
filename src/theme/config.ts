export const customTheme = {
  token: {
    screenXXL: 2000,
    screenXXLMin: 2000,
    screenXLMax: 1999,
    screenXLMin: 1350,
    screenXL: 1350,
    screenLGMax: 1349,
    screenLGMin: 1050,
    screenLG: 1050,
    screenMDMax: 1049,
  },
  components: {
    Layout: {
      headerHeight: 55,
      headerBg: 'var(--ant-header-bg)',
      siderBg: 'var(--ant-sider-bg)',
      algorithm: true,
    },
    Menu: {
      algorithm: true,
      activeBarHeight: 0,
      activeBarBorderWidth: 0,
      activeBarWidth: 0,
    }
  },
  cssVar: {
    key: 'my-var-css'
  },
  hashed: false
}
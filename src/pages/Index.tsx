import React, { useEffect, useLayoutEffect,  useState } from 'react';
import { Outlet, useLocation } from "react-router-dom"
import { Layout } from 'antd';

import BaseHeader from "@/layouts/components/BaseHeader";
import { BashIndexSkeleton } from "@/layouts/components/Skeleton";
import { router } from "@/router/index";
import { menuArrayToTreeMap} from "@/router/generate";
import request from "@/common/request";
import { useApp } from "@/stores/AppContext";
import { AuthContext } from "@/stores/AuthContext";

import('@/styles/TableLayout.css')

import { useStartUploadWorker } from "@/hooks/UseUploadWorker";

// 获取菜单创建路由
const App = () => {
  useStartUploadWorker()

  const location = useLocation();
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({
    permissions: [],
    username: '',
    nickname: '',
    roleLevel:null,
  })
  
  const [topMenuItem, setTopMenuItem] = useState([]);
 // 获取菜单
  useLayoutEffect(() => {
    (async () => {     
      // const platformId = layoutMode ? layoutMode : 1
      const {data: {username,nickname,roleLevel, menuList}} = await request.get("/api/v1/auth/info");
      // 生成菜单及路由
      const { topMenuTree, routeTree, permissions} = menuArrayToTreeMap(menuList);
    
      // 设置用户信息
      setUserInfo({
        // @ts-ignore
        permissions: permissions,
        username: username,
        nickname:nickname,
        roleLevel:roleLevel
      })

      // 填充动态路由
      // @ts-ignore
      router.routes[0].children  = routeTree
      // 跳转对应路由
      router.navigate(`${location.pathname}`, { replace: true });

      // 适当延迟过度效果
      setTimeout(()=>{
        setLoading(false)
         // 延时设置顶部菜单
      // @ts-ignore
        setTopMenuItem(topMenuTree)
      },500)
    })();
  }, [])

  return (
    <AuthContext.Provider
      value={userInfo}
    >
      <Layout>
        <BaseHeader topMenuItem={topMenuItem} />
        <BashIndexSkeleton loading={loading}>
          <div style={{marginTop: '55px'}}>
            <Outlet />
          </div>
        </BashIndexSkeleton>
      </Layout>
    </AuthContext.Provider>
  );
};
export default App;
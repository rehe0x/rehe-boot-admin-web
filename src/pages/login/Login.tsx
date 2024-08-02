import React, { useState, useEffect } from "react";
import { LockOutlined, UserOutlined,WechatOutlined, GoogleOutlined} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  Space,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import storage from "@/common/storage";
import LoginForm from "@/pages/login/Form";
import LeftCarousel from "@/pages/login/Left";

import "./Login.css";

const Login = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    storage.removeStorage("token");
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {!(width < 700) ? (
        <div
          style={{
            width: "50%",
          }}
        >
          <LeftCarousel />
        </div>
      ) : (
        <></>
      )}
      <div
        style={{
          width: "50%",
          backgroundImage: "url(src/assets/img/6.jpg)",
          backgroundSize: "cover",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "var(--ant-color-bg-base)",
            // backdropFilter: 'blur(8px)'
          }}
        >
          <div>
            <Space direction="vertical" size={20} align="center">
              <div>
                <Typography.Title
                  level={2}
                  style={{
                    textAlign: "center",
                  }}
                >
                  REHE ADMIN 
                </Typography.Title>
                <Typography.Title
                  level={5}
                  style={{
                    textAlign: "center",
                  }}
                >
                  rehe admin
                </Typography.Title>
              </div>
              <div>
                <LoginForm />
                <Divider>or</Divider>
              </div>
              <Space direction="vertical" size={20}>
                <Button style={{ width: "320px" }} size="large">
                  <GoogleOutlined style={{color: '#6c7ede'}}/>Google
                </Button>
                <Button style={{ width: "320px" }} size="large">
                <WechatOutlined style={{color: 'green'}} />QRcode
                </Button>
              </Space>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

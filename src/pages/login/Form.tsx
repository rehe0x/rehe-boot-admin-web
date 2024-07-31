import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input,Alert } from 'antd';
import { useNavigate } from "react-router-dom";
import storage from "@/common/storage";
import { loginPasswd } from "./service";

const LoginFrom = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [passError, setPassError] = useState(false);

  const [password, setPassword] = useState('');

  const navigate = useNavigate()
  const onFinish = async (values) => {
    setLoading(true)
    const result = await loginPasswd({username: values.username,password:values.password})
    if(result.successful){
      storage.setStorage('token',result.data.token)
    } else {
      setLoginError(true)
    }
    setTimeout(() => {
      result.successful && navigate('/')
      setLoading(false)
    }, 1000);
   
  };


  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo.errorFields);
    const f = errorInfo.errorFields.filter(item => item.name[0] === 'password')
    if(f[0].errors[0]){
      console.log()
      setPassError(f[0].errors[0])
    }
   
    
  };

  const handleFocus = (e) => {
    setLoginError(false)
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      style={{width: '320px'}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout='vertical'
    >
      <Form.Item
        name="username"
        label='账号'
        rules={[
          {
            required: true,
            message: '请输入您的用户名!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} size='large' placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        label='密码'
        // extra={passError && <div style={{color:'var(--ant-color-error)',fontSize: '16px'}}>账号或密码错误!</div>}
        rules={[
          {
            required: true,
            message: '请输入您的密码!',
          },
        ]}
        // validateStatus={passError ? 'error' : ''}
        // help={loginError ? <div style={{color:'var(--ant-color-error)',fontSize: '16px'}}>账号或密码错误!</div> : passError ? '请输入您的密码!' : ''}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          size='large'
          // onFocus={handleFocus}
        />

      </Form.Item>

      {/* {passError && (
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} noStyle>
          <Alert message='账号或密码错误' type="error" />
        </Form.Item>
      )} */}

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          忘记密码
        </a>
      </Form.Item>

      <Form.Item>
        <Button style={{width: '100%'}} size='large' type="primary" htmlType="submit" loading={loading} iconPosition='end' className="login-form-button">
          Log in
        </Button>
        {/* Or <a href="">注册!</a> */}
      </Form.Item>
    </Form>
  );
};


export default LoginFrom
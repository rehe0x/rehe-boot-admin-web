import React, { useRef, useState } from 'react';
import Icon,{ PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space,Flex,Tooltip } from 'antd';
import type { InputRef } from 'antd';
import * as icons from "@ant-design/icons";

let index = 0;

const excludedIcons = ['createFromIconfontCN', 'default', 'getTwoToneColor', 'setTwoToneColor'];
const MyIcon = ({icon}) => {
  if(excludedIcons.includes(icon)){
    return
  }
  const IconComponent = icons[icon];
  return(
    <IconComponent style={{ fontSize: '28px' }}/>
  )
}



const App: React.FC = () => {
  const [items, setItems] = useState(['jack', 'lucy']);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      placeholder="custom dropdown render"
      dropdownRender={(menu) => (
        <div style={{ height:'300px', overflow:"auto",display: 'flex', flexWrap: 'wrap' }}>
          {Object.keys(icons).map((name) => {
            return (
              <Tooltip title={name} key={name}>
                <div style={{ padding: 10, textAlign: 'center' }}>
                <MyIcon icon={name}/>
    
                </div>
              </Tooltip>
            );
          })}
        </div>
      )}
      options={items.map((item) => ({ label: item, value: item }))}
    />
  );
};

export default App;
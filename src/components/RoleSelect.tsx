import React,{useEffect , useState} from 'react';
import { Select, Space } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { queryRoleAll } from "@/pages/main/role/service";

const App: React.FC<{value:any[],onChange:()=>void}> = ({value,onChange}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([])
  const loadData = async() => {
    const result = await queryRoleAll()
    if(result.successful){
      const roleOptions = result.data.map(item => ({
        label:item.name,
        value:item.id,
        desc:item.description
      }))
      setOptions(roleOptions)
    }
  } 
  useEffect(() => {
    loadData()
  },[])
  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="选择角色"
      value={value ? value:undefined}
      onChange={onChange}
      options={options}
    />
  );
}

export default App;
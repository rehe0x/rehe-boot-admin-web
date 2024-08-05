import React, { useEffect,useLayoutEffect, useState } from 'react';

interface PageTableData<T> {
  loading: boolean;
  pageSize: number;
  pageNum: number;
  total: number;
  tableList: T[];
  formData: Record<string, any>;
}

interface Pagination {
  total: number;
  size: 'default';
  current: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  showTotal: (total: number) => string;
  onChange: (page: number, pageSize?: number) => void;
}

interface PageTableProps<T> {
  loading: boolean;
  dataSource: T[];
  pagination?: Pagination;
}


type UsePageTableResult<T> = [PageTableProps<T>, () => void, (formData: Record<string, any>) => void];

export const usePageTable = <T,>(
  fun: (params: { pageSize: number; pageNum: number,[key: string]: any }) => Promise<{ data: T[]; page: {total:number};successful:boolean }>)
: UsePageTableResult<T> => {
  const [data, setData] = useState<PageTableData<T>>({
    loading: false,
    pageSize: 10,
    pageNum: 1,
    total: 0,
    tableList: [],
    formData: {}
  });

  const load = async ({ pageNum = data.pageNum, pageSize = data.pageSize } = {}, params = data.formData) => {
    setData(prevData => ({
      ...prevData,
      loading: true,
    }));

    const result = await fun({ pageSize, pageNum ,...params});
    if(result.successful){
      setData((prevData):PageTableData<T> => ({
        ...prevData,
        // loading: false,
        tableList: result.data,
        total: result.page.total || 0,
        pageSize,
        pageNum,
        formData:params
      }));
    }
    setTimeout(() => {
      setData(prevData => ({
        ...prevData,
        loading: false,
      }));
    },300)
    
  };

  useEffect(() => {
    load();
  }, []);

  const pageChange = (page: number, pageSize?: number) => {
    load({ pageNum: page, pageSize });
  };

  const tableProps: PageTableProps<T> = {
    loading: data.loading,
    dataSource: data.tableList,
    pagination: {
      total: data.total,
      size: "default",
      current: data.pageNum,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `总共 ${total} 条`,
      onChange: pageChange,
    }
  };

  const query = (formData: Record<string, any>) => {
    load({ pageNum: 1 }, formData);
  };

  const refresh = () => {
    load();
  };

  return [tableProps, refresh, query];
};


interface TableData<T> {
  loading: boolean;
  tableList: T[];
  formData: Record<string, any>;
}

interface TableProps<T> {
  loading: boolean;
  dataSource: T[];
  pagination:false
}

type UseTableResult<T> = [TableProps<T>, () => void, (formData: Record<string, any>) => void, params:Record<string, any>];

export const useTable = <T,>(
  fun: (params: Record<string, any>) => Promise<{ data: T[],successful:boolean}>, defaultParams?:Record<string, any>)
: UseTableResult<T> => {
  const [data, setData] = useState<TableData<T>>({
    loading: false,
    tableList: [],
    formData: defaultParams || {}
  });

  const load = async (params = data.formData) => {
    setData(prevData => ({
      ...prevData,
      loading: true,
    }));
    const result = await fun({...data.formData,...params});
    if(result && result.successful){
      setData((prevData):TableData<T> => ({
        ...prevData,
        // loading: false,
        tableList: result.data,
        formData:{ ...prevData.formData,...params},
      }));
    }
   

    setTimeout(() => {
      setData(prevData => ({
        ...prevData,
        loading: false,
      }));
    },300)
  };

  useEffect(() => {
    load();
  }, []);

  const tableProps: TableProps<T> = {
    loading: data.loading,
    dataSource: data.tableList,
    pagination:false
  };

  const query = (formData: Record<string, any>) => {
    load(formData);
  };

  const refresh = () => {
    load();
  };

  return [tableProps, refresh, query, data.formData];
};



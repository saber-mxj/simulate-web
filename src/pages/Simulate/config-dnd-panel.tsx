/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv4 } from '@antv/xflow';
import { XFlowNodeCommands } from '@antv/xflow';
import { DND_IMAGE_RENDER_ID } from './constant';
import type { NsNodeCmd } from '@antv/xflow';
import type { NsNodeCollapsePanel } from '@antv/xflow';
import { Card } from 'antd';
import React from 'react';
import base64 from '@/base64';

export const onNodeDrop: NsNodeCollapsePanel.IOnNodeDrop = async (
  node,
  commands,
  modelService,
) => {
  const args: NsNodeCmd.AddNode.IArgs = {
    nodeConfig: { ...node, id: uuidv4() },
  };
  commands.executeCommand(XFlowNodeCommands.ADD_NODE.id, args);
};

const NodeDescription = (props: { name: string }) => {
  return (
    <Card
      size="small"
      title="算法组件介绍"
      style={{ width: '200px' }}
      bordered={false}
    >
      欢迎使用：{props.name}
      这里可以根据服务端返回的数据显示不同的内容
    </Card>
  );
};

export const nodeDataService: NsNodeCollapsePanel.INodeDataService = async (
  meta,
  modelService,
) => {
  console.log(meta, modelService);
  return [
    {
      id: '1',
      header: '分组1',
      children: [
        {
          id: '2',
          label: '组件1',
          parentId: '1',
          renderKey: DND_IMAGE_RENDER_ID,
          src: base64.ph,
          popoverContent: <NodeDescription name="组件1" />,
          width: 80,
          height: 80,
        },
        {
          id: '3',
          label: '组件2',
          parentId: '1',
          renderKey: DND_IMAGE_RENDER_ID,
          src: base64.ph,
          popoverContent: <NodeDescription name="组件2" />,
          width: 80,
          height: 80,
        },
        {
          id: '4',
          label: '组件3',
          parentId: '1',
          renderKey: DND_IMAGE_RENDER_ID,
          src: base64.ph,
          popoverContent: <NodeDescription name="组件3" />,
          width: 80,
          height: 80,
        },
      ],
    },
  ];
};

export const searchService: NsNodeCollapsePanel.ISearchService = async (
  nodes: NsNodeCollapsePanel.IPanelNode[] = [],
  keyword: string,
) => {
  const list = nodes.filter((node) => node.label.includes(keyword));
  console.log(list, keyword, nodes);
  return list;
};

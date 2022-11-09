import type { IProps } from './index';
import type { NsGraph, NsNodeCmd } from '@antv/xflow';
import {
  createHookConfig,
  DisposableCollection,
  XFlowNodeCommands,
} from '@antv/xflow';
import { DND_IMAGE_RENDER_ID, GROUP_NODE_RENDER_ID } from './constant';
import { GroupNode } from './react-node/group';
import { ImageNode } from '@/pages/Simulate/react-node/image-node';

export const useGraphHookConfig = createHookConfig<IProps>((config, proxy) => {
  // 获取 Props
  const props = proxy.getValue();
  console.log('get main props', props);
  config.setRegisterHook((hooks) => {
    const disposableList = [
      // 注册增加 react Node Render
      hooks.reactNodeRender.registerHook({
        name: 'add react node',
        handler: async (renderMap) => {
          renderMap.set(DND_IMAGE_RENDER_ID, ImageNode);
          renderMap.set(GROUP_NODE_RENDER_ID, GroupNode);
        },
      }),
      // 注册修改graphOptions配置的钩子
      hooks.graphOptions.registerHook({
        name: 'custom-x6-options',
        after: 'dag-extension-x6-options',
        handler: async (options) => {
          Object.assign(options, {
            /** 画布网格 */
            grid: true,
            /** 画布缩放等级 */
            scaling: {
              min: 0.2,
              max: 20,
            },
            /** 画布滚轮缩放 */
            mousewheel: {
              enabled: true,
              /** 将鼠标位置作为中心缩放 */
              zoomAtMousePosition: true,
            },
            resizing: true,
            rotating: true,
            snapline: true,
            clipboard: true,
            keyboard: {
              enabled: true,
            },
          });
        },
      }),
      // 注册增加 graph event
      hooks.x6Events.registerHook({
        name: 'add',
        handler: async (events) => {
          events.push({
            eventName: 'node:moved',
            callback: (e, cmds) => {
              const { node } = e;
              cmds.executeCommand<NsNodeCmd.MoveNode.IArgs>(
                XFlowNodeCommands.MOVE_NODE.id,
                {
                  id: node.id,
                  position: node.getPosition(),
                },
              );
            },
          } as NsGraph.IEvent<'node:moved'>);
        },
      }),
    ];
    const toDispose = new DisposableCollection();
    toDispose.pushAll(disposableList);
    return toDispose;
  });
});

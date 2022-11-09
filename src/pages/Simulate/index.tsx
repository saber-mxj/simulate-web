import React, { useMemo, useState } from 'react';
import type { IApplication, IAppLoad } from '@antv/xflow';
/** app 核心组件 */
/** 交互组件 */
import {
  CanvasContextMenu,
  CanvasMiniMap,
  CanvasNodePortTooltip /** 触发Command的交互组件 */,
  CanvasScaleToolbar /** Graph的扩展交互组件 */,
  CanvasSnapline,
  CanvasToolbar,
  JsonSchemaForm,
  KeyBindings,
  NodeCollapsePanel,
  XFlow,
  XFlowCanvas,
} from '@antv/xflow';

/** app 组件配置  */
/** 配置画布 */
import { useGraphHookConfig } from './config-graph';
/** 配置Command */
import { initGraphCmds, useCmdConfig } from './config-cmd';
/** 配置Model */
import { useModelServiceConfig } from './config-model-service';
/** 配置Menu */
import { useMenuConfig } from './config-menu';
/** 配置Toolbar */
import { useToolbarConfig } from './config-toolbar';
/** 配置快捷键 */
import { useKeybindingConfig } from './config-keybinding';
/** 配置Dnd组件面板 */
import * as dndPanelConfig from './config-dnd-panel';
/** 配置JsonConfigForm */
import {
  controlMapService,
  formSchemaService,
  formValueUpdateService,
} from './config-form';

import './index.less';
import '@antv/xflow/dist/index.css';
import { DagGraphExtension } from '@/pages/Simulate/canvas-dag-extension';
import { LayoutEnum } from '@/pages/Simulate/canvas-dag-extension/interface';

export interface IProps {
  meta?: { flowId: string };
}

export const Simulate: React.FC<IProps> = (props) => {
  const { meta } = props;
  const graphHooksConfig = useGraphHookConfig(props);
  const toolbarConfig = useToolbarConfig();
  const menuConfig = useMenuConfig();
  const cmdConfig = useCmdConfig();
  const modelServiceConfig = useModelServiceConfig();
  const keybindingConfig = useKeybindingConfig();

  const cache = React.useMemo<{ app: IApplication } | null>(
    () => ({
      app: null,
    }),
    [],
  );
  /**
   * @param app 当前XFlow工作空间
   * @param extensionRegistry 当前XFlow配置项
   */

  const onLoad: IAppLoad = async (app) => {
    cache.app = app;
    initGraphCmds(cache.app);
  };

  /** 父组件meta属性更新时,执行initGraphCmds */
  React.useEffect(() => {
    if (cache.app) {
      initGraphCmds(cache.app);
    }
  }, [cache.app, meta]);

  /**
   * 左右面板展开折叠处理
   */
  const [isNodePanelCollapsed, setIsNodePanelCollapsed] =
    useState<boolean>(false);
  const canvasToolbarPosition = useMemo(() => {
    return {
      top: 0,
      left: isNodePanelCollapsed ? 0 : 280,
      right: 290,
      bottom: 0,
    };
  }, [isNodePanelCollapsed]);
  const canvasPosition = useMemo(() => {
    return {
      top: 40,
      left: isNodePanelCollapsed ? 0 : 280,
      right: 290,
      bottom: 0,
    };
  }, [isNodePanelCollapsed]);

  return (
    <XFlow
      style={{ height: '100%' }}
      className="dag-user-custom-clz"
      hookConfig={graphHooksConfig}
      modelServiceConfig={modelServiceConfig}
      commandConfig={cmdConfig}
      onLoad={onLoad}
      meta={meta}
    >
      <DagGraphExtension layout={LayoutEnum.TOP_BOTTOM} />
      <NodeCollapsePanel
        className="xflow-node-panel"
        searchService={dndPanelConfig.searchService}
        nodeDataService={dndPanelConfig.nodeDataService}
        onNodeDrop={dndPanelConfig.onNodeDrop}
        position={{ width: 280, top: 0, bottom: 0, left: 0 }}
        footerPosition={{ height: 0 }}
        bodyPosition={{ top: 40, bottom: 0, left: 0 }}
        collapsible={true}
        onCollapseChange={setIsNodePanelCollapsed}
      />
      <CanvasToolbar
        className={
          'xflow-workspace-toolbar-top x6-panel-position-change-transition'
        }
        layout="horizontal"
        config={toolbarConfig}
        position={canvasToolbarPosition}
      />
      <XFlowCanvas position={canvasPosition}>
        <CanvasScaleToolbar position={{ top: 12, right: 12 }} />
        <CanvasContextMenu config={menuConfig} />
        <CanvasSnapline color="#faad14" />
        <CanvasNodePortTooltip />
        <CanvasMiniMap
          position={{ bottom: 12, right: 12 }}
          minimapOptions={{
            enabled: true,
            scalable: true,
            minScale: 0.2,
            maxScale: 20,
          }}
        />
      </XFlowCanvas>
      <JsonSchemaForm
        controlMapService={controlMapService}
        formSchemaService={formSchemaService}
        formValueUpdateService={formValueUpdateService}
        bodyPosition={{ top: 0, bottom: 0, right: 0 }}
        position={{ width: 290, top: 0, bottom: 0, right: 0 }}
        footerPosition={{ height: 0 }}
      />
      <KeyBindings config={keybindingConfig} />
    </XFlow>
  );
};

export default Simulate;

Simulate.defaultProps = {
  meta: { flowId: 'test-meta-flow-id' },
};

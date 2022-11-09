import React from 'react';
import type { NsGraph } from '@antv/xflow';

export const ImageNode: NsGraph.INodeRender = (props) => {
  console.log(props, 'node props');
  const { data } = props;
  return (
    <div
      style={{
        width: data.width || '100%',
        height: data.height || '100%',
      }}
    >
      <img width={'100%'} height={'100%'} src={data.src} alt={''} />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          fontSize: 12,
          transform: 'translateX(-50%)',
          color: 'rgba(0, 0, 0, 0.65)',
        }}
      >
        {data.label}
      </div>
    </div>
  );
};

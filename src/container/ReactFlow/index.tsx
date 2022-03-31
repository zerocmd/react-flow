import { Global, css } from '@emotion/react'
import cc from 'classcat';
import React, { forwardRef } from 'react';
import Attribution from '../../components/Attribution';
import { BezierEdge, SmoothStepEdge, StepEdge, StraightEdge, SimpleBezierEdge } from '../../components/Edges';
import DefaultNode from '../../components/Nodes/DefaultNode';
import InputNode from '../../components/Nodes/InputNode';
import OutputNode from '../../components/Nodes/OutputNode';
import SelectionListener from '../../components/SelectionListener';
import StoreUpdater from '../../components/StoreUpdater';
import {
  ConnectionLineType,
  ConnectionMode,
  EdgeTypes,
  NodeTypes,
  PanOnScrollMode,
  ReactFlowProps,
  ReactFlowRefType,
} from '../../types';
import { createEdgeTypes } from '../EdgeRenderer/utils';
import GraphView from '../GraphView';
import { createNodeTypes } from '../NodeRenderer/utils';
import { useNodeOrEdgeTypes } from './utils';
import Wrapper from './Wrapper';

const defaultNodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
};

const defaultEdgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
  simplebezier: SimpleBezierEdge,
};

const initSnapGrid: [number, number] = [15, 15];
const initDefaultPosition: [number, number] = [0, 0];

const ReactFlow = forwardRef<ReactFlowRefType, ReactFlowProps>(
  (
    {
      nodes,
      edges,
      defaultNodes,
      defaultEdges,
      className,
      nodeTypes = defaultNodeTypes,
      edgeTypes = defaultEdgeTypes,
      onNodeClick,
      onEdgeClick,
      onInit,
      onMove,
      onMoveStart,
      onMoveEnd,
      onConnect,
      onConnectStart,
      onConnectStop,
      onConnectEnd,
      onNodeMouseEnter,
      onNodeMouseMove,
      onNodeMouseLeave,
      onNodeContextMenu,
      onNodeDoubleClick,
      onNodeDragStart,
      onNodeDrag,
      onNodeDragStop,
      onNodesDelete,
      onEdgesDelete,
      onSelectionChange,
      onSelectionDragStart,
      onSelectionDrag,
      onSelectionDragStop,
      onSelectionContextMenu,
      connectionMode = ConnectionMode.Strict,
      connectionLineType = ConnectionLineType.Bezier,
      connectionLineStyle,
      connectionLineComponent,
      deleteKeyCode = 'Backspace',
      selectionKeyCode = 'Shift',
      multiSelectionKeyCode = 'Meta',
      zoomActivationKeyCode = 'Meta',
      snapToGrid = false,
      snapGrid = initSnapGrid,
      onlyRenderVisibleElements = false,
      selectNodesOnDrag = true,
      nodesDraggable,
      nodesConnectable,
      elementsSelectable,
      minZoom,
      maxZoom,
      defaultZoom = 1,
      defaultPosition = initDefaultPosition,
      translateExtent,
      preventScrolling = true,
      nodeExtent,
      defaultMarkerColor = '#b1b1b7',
      zoomOnScroll = true,
      zoomOnPinch = true,
      panOnScroll = false,
      panOnScrollSpeed = 0.5,
      panOnScrollMode = PanOnScrollMode.Free,
      zoomOnDoubleClick = true,
      panOnDrag = true,
      onPaneClick,
      onPaneScroll,
      onPaneContextMenu,
      children,
      onEdgeUpdate,
      onEdgeContextMenu,
      onEdgeDoubleClick,
      onEdgeMouseEnter,
      onEdgeMouseMove,
      onEdgeMouseLeave,
      onEdgeUpdateStart,
      onEdgeUpdateEnd,
      edgeUpdaterRadius = 10,
      onNodesChange,
      onEdgesChange,
      noDragClassName = 'nodrag',
      noWheelClassName = 'nowheel',
      noPanClassName = 'nopan',
      fitView = false,
      fitViewOptions,
      connectOnClick = true,
      attributionPosition,
      proOptions,
      defaultEdgeOptions,
      ...rest
    },
    ref
  ) => {
    const nodeTypesParsed = useNodeOrEdgeTypes(nodeTypes, createNodeTypes) as NodeTypes;
    const edgeTypesParsed = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes) as EdgeTypes;
    const reactFlowClasses = cc(['react-flow', className]);

    return (
      <>
        <Global
          styles={css`
.react-flow {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.react-flow__container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.react-flow__pane {
  z-index: 1;
}

.react-flow__viewport {
  transform-origin: 0 0;
  z-index: 2;
  pointer-events: none;
}

.react-flow__renderer {
  z-index: 4;
}

.react-flow__selectionpane {
  z-index: 5;
}

.react-flow .react-flow__edges {
  pointer-events: none;
  overflow: visible;
}

.react-flow__edge {
  pointer-events: visibleStroke;

  &.inactive {
    pointer-events: none;
  }
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}

.react-flow__edge-path {
  fill: none;
}

.react-flow__edge-textwrapper {
  pointer-events: all;
}

.react-flow__edge-text {
  pointer-events: none;
  user-select: none;
}

.react-flow__connection {
  pointer-events: none;

  .animated {
    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
  }
}

.react-flow__connection-path {
  fill: none;
}

.react-flow__nodes {
  pointer-events: none;
  transform-origin: 0 0;
}

.react-flow__node {
  position: absolute;
  user-select: none;
  pointer-events: all;
  transform-origin: 0 0;
  box-sizing: border-box;
}

.react-flow__nodesselection {
  z-index: 3;
  transform-origin: left top;
  pointer-events: none;

  &-rect {
    position: absolute;
    pointer-events: all;
    cursor: grab;
  }
}

.react-flow__handle {
  pointer-events: none;

  &.connectable {
    pointer-events: all;
  }
}

.react-flow__handle-bottom {
  top: auto;
  left: 50%;
  bottom: -4px;
  transform: translate(-50%, 0);
}

.react-flow__handle-top {
  left: 50%;
  top: -4px;
  transform: translate(-50%, 0);
}

.react-flow__handle-left {
  top: 50%;
  left: -4px;
  transform: translate(0, -50%);
}

.react-flow__handle-right {
  right: -4px;
  top: 50%;
  transform: translate(0, -50%);
}

.react-flow__edgeupdater {
  cursor: move;
  pointer-events: all;
}

/* additional components */

.react-flow__controls {
  position: absolute;
  z-index: 5;
  bottom: 20px;
  left: 15px;

  &-button {
    width: 24px;
    height: 24px;
    border: none;

    svg {
      width: 100%;
    }
  }
}

.react-flow__minimap {
  position: absolute;
  z-index: 5;
  bottom: 20px;
  right: 15px;
}

.react-flow__attribution {
  font-size: 10px;
  position: absolute;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.5);
  padding: 2px 3px;
  color: #999;

  a {
    color: #555;
    text-decoration: none;
  }

  &.top {
    top: 0;
  }

  &.bottom {
    bottom: 0;
  }

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }

  &.center {
    left: 50%;
    transform: translateX(-50%);
  }
}

/* THEMES */

.react-flow__edge {
  &.selected {
    .react-flow__edge-path {
      stroke: #555;
    }
  }

  &.animated path {
    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
  }

  &.updating {
    .react-flow__edge-path {
      stroke: #777;
    }
  }
}

.react-flow__edge-path {
  stroke: #b1b1b7;
  stroke-width: 1;
}

.react-flow__edge-text {
  font-size: 10px;
}

.react-flow__edge-textbg {
  fill: white;
}

.react-flow__connection-path {
  stroke: #b1b1b7;
  stroke-width: 1;
}

.react-flow__node {
  cursor: grab;
}

.react-flow__node-default,
.react-flow__node-input,
.react-flow__node-output,
.react-flow__node-group {
  padding: 10px;
  border-radius: 3px;
  width: 150px;
  font-size: 12px;
  color: #222;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  background: #fff;
  border-color: #1a192b;

  &.selected,
  &.selected:hover {
    box-shadow: 0 0 0 0.5px #1a192b;
  }

  .react-flow__handle {
    background: #1a192b;
  }
}

.react-flow__node-default.selectable,
.react-flow__node-input.selectable,
.react-flow__node-output.selectable,
.react-flow__node-group.selectable {
  &:hover {
    box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);
  }
}

.react-flow__node-group {
  background: rgba(240, 240, 240, 0.25);
  border-color: #1a192b;

  &.selected,
  &.selected:hover {
    box-shadow: 0 0 0 0.5px #1a192b;
  }
}

.react-flow__nodesselection-rect,
.react-flow__selection {
  background: rgba(0, 89, 220, 0.08);
  border: 1px dotted rgba(0, 89, 220, 0.8);
}

.react-flow__handle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #555;
  border: 1px solid white;
  border-radius: 100%;

  &.connectable {
    cursor: crosshair;
  }
}

.react-flow__minimap {
  background-color: #fff;
}

.react-flow__controls {
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);

  &-button {
    background: #fefefe;
    border-bottom: 1px solid #eee;
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    cursor: pointer;
    user-select: none;
    padding: 5px;

    svg {
      max-width: 12px;
      max-height: 12px;
    }

    &:hover {
      background: #f4f4f4;
    }
  }
}
          `}
        />
      <div {...rest} ref={ref} className={reactFlowClasses}>
        <Wrapper>
          <GraphView
            onInit={onInit}
            onMove={onMove}
            onMoveStart={onMoveStart}
            onMoveEnd={onMoveEnd}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseMove={onNodeMouseMove}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeContextMenu={onNodeContextMenu}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypesParsed}
            edgeTypes={edgeTypesParsed}
            connectionLineType={connectionLineType}
            connectionLineStyle={connectionLineStyle}
            connectionLineComponent={connectionLineComponent}
            selectionKeyCode={selectionKeyCode}
            deleteKeyCode={deleteKeyCode}
            multiSelectionKeyCode={multiSelectionKeyCode}
            zoomActivationKeyCode={zoomActivationKeyCode}
            onlyRenderVisibleElements={onlyRenderVisibleElements}
            selectNodesOnDrag={selectNodesOnDrag}
            defaultZoom={defaultZoom}
            defaultPosition={defaultPosition}
            preventScrolling={preventScrolling}
            zoomOnScroll={zoomOnScroll}
            zoomOnPinch={zoomOnPinch}
            zoomOnDoubleClick={zoomOnDoubleClick}
            panOnScroll={panOnScroll}
            panOnScrollSpeed={panOnScrollSpeed}
            panOnScrollMode={panOnScrollMode}
            panOnDrag={panOnDrag}
            onPaneClick={onPaneClick}
            onPaneScroll={onPaneScroll}
            onPaneContextMenu={onPaneContextMenu}
            onSelectionDragStart={onSelectionDragStart}
            onSelectionDrag={onSelectionDrag}
            onSelectionDragStop={onSelectionDragStop}
            onSelectionContextMenu={onSelectionContextMenu}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeContextMenu={onEdgeContextMenu}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeMouseEnter={onEdgeMouseEnter}
            onEdgeMouseMove={onEdgeMouseMove}
            onEdgeMouseLeave={onEdgeMouseLeave}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            edgeUpdaterRadius={edgeUpdaterRadius}
            defaultMarkerColor={defaultMarkerColor}
            noDragClassName={noDragClassName}
            noWheelClassName={noWheelClassName}
            noPanClassName={noPanClassName}
          />
          <StoreUpdater
            nodes={nodes}
            edges={edges}
            defaultNodes={defaultNodes}
            defaultEdges={defaultEdges}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectStop={onConnectStop}
            onConnectEnd={onConnectEnd}
            nodesDraggable={nodesDraggable}
            nodesConnectable={nodesConnectable}
            elementsSelectable={elementsSelectable}
            minZoom={minZoom}
            maxZoom={maxZoom}
            nodeExtent={nodeExtent}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            snapToGrid={snapToGrid}
            snapGrid={snapGrid}
            connectionMode={connectionMode}
            translateExtent={translateExtent}
            connectOnClick={connectOnClick}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView={fitView}
            fitViewOptions={fitViewOptions}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
          />
          {onSelectionChange && <SelectionListener onSelectionChange={onSelectionChange} />}
          {children}
          <Attribution proOptions={proOptions} position={attributionPosition} />
        </Wrapper>
      </div>
      </>
    );
  }
);

ReactFlow.displayName = 'ReactFlow';

export default ReactFlow;

import React, { memo, useCallback, FC, useEffect, useState } from 'react';
import cc from 'classcat';

import { useStore, useStoreApi } from '../../store';
import useReactFlow from '../../hooks/useReactFlow';

// @ts-ignore
import PlusIcon from '../../icons/PlusIcon';
// @ts-ignore
import MinusIcon from '../../icons/MinusIcon';
// @ts-ignore
import FitviewIcon from '../../icons/FitViewIcon';
// @ts-ignore
import LockIcon from '../../icons/LockIcon';
// @ts-ignore
import UnlockIcon from '../../icons/UnlockIcon';

import { ControlProps, ControlButtonProps, ReactFlowState } from '../../types';

export const ControlButton: FC<ControlButtonProps> = ({ children, className, ...rest }) => (
  <button type="button" className={cc(['react-flow__controls-button', className])} {...rest}>
    {children}
  </button>
);

const isInteractiveSelector = (s: ReactFlowState) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;

const Controls: FC<ControlProps> = ({
  style,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewOptions,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
  children,
}) => {
  const store = useStoreApi();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isInteractive = useStore(isInteractiveSelector);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const mapClasses = cc(['react-flow__controls', className]);

  const onZoomInHandler = useCallback(() => {
    zoomIn?.();
    onZoomIn?.();
  }, [zoomIn, onZoomIn]);

  const onZoomOutHandler = useCallback(() => {
    zoomOut?.();
    onZoomOut?.();
  }, [zoomOut, onZoomOut]);

  const onFitViewHandler = useCallback(() => {
    fitView?.(fitViewOptions);
    onFitView?.();
  }, [fitView, fitViewOptions, onFitView]);

  const onInteractiveChangeHandler = useCallback(() => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive,
    });

    onInteractiveChange?.(!isInteractive);
  }, [isInteractive, onInteractiveChange]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={mapClasses} css={style || {}}>
      {showZoom && (
        <>
          <ControlButton
            onClick={onZoomInHandler}
            className="react-flow__controls-zoomin"
            title="zoom in"
            aria-label="zoom in"
          >
            <PlusIcon />
          </ControlButton>
          <ControlButton
            onClick={onZoomOutHandler}
            className="react-flow__controls-zoomout"
            title="zoom out"
            aria-label="zoom out"
          >
            <MinusIcon />
          </ControlButton>
        </>
      )}
      {showFitView && (
        <ControlButton
          className="react-flow__controls-fitview"
          onClick={onFitViewHandler}
          title="fit view"
          aria-label="fit view"
        >
          <FitviewIcon />
        </ControlButton>
      )}
      {showInteractive && (
        <ControlButton
          className="react-flow__controls-interactive"
          onClick={onInteractiveChangeHandler}
          title="toggle interactivity"
          aria-label="toggle interactivity"
        >
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </ControlButton>
      )}
      {children}
    </div>
  );
};

Controls.displayName = 'Controls';

export default memo(Controls);

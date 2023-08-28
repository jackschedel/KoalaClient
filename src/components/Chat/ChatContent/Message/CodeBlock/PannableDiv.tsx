import React, { useState, useEffect, useRef } from 'react';

type PannableDivProps = {
  children?: React.ReactNode;
  zoomLimit?: { minZoom: number; maxZoom: number };
  isPannable?: boolean;
};

const PannableDiv: React.FC<PannableDivProps> = ({
  children,
  zoomLimit = { minZoom: 0.5, maxZoom: 3.0 },
  isPannable = false,
}) => {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [scale, setScale] = useState(1);
  const [transform, setTransform] = useState('translate(0px, 0px) scale(1)');

  const pannerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPannable) return;

    e.preventDefault();
    setDragging(true);
    setStartX(e.pageX);
    setStartY(e.pageY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isPannable) return;

    setDragging(false);
    setPosX((prevPosX) => prevPosX + (e.pageX - startX) * 0.35);
    setPosY((prevPosY) => prevPosY + (e.pageY - startY) * 0.35);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPannable) return;

    e.preventDefault();
    if (dragging) {
      const newTransform = `translate(${posX + (e.pageX - startX) * 0.33}px, ${
        posY + (e.pageY - startY) * 0.33
      }px) scale(${scale})`;
      setTransform(newTransform);
    }
  };

  const handleScroll = (e: WheelEvent) => {
    if (!isPannable) return;

    e.preventDefault();
    let newScale = scale - e.deltaY * 0.0006;
    newScale = Math.min(
      Math.max(newScale, zoomLimit.minZoom),
      zoomLimit.maxZoom
    );
    setScale(newScale);
    const newTransform = `translate(${posX}px, ${posY}px) scale(${newScale})`;
    setTransform(newTransform);
  };

  useEffect(() => {
    const panner = pannerRef.current;
    if (panner) {
      if (dragging == true) document.body.classList.add('cursor-grabbing');
      else document.body.classList.remove('cursor-grabbing');
      panner.addEventListener('wheel', handleScroll, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (panner) {
        panner.removeEventListener('wheel', handleScroll);
      }
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragging, startX, startY, posX, posY, scale, isPannable]);

  return (
    <div
      className='overflow-hidden'
      onMouseDown={handleMouseDown}
      ref={pannerRef}
    >
      <div
        className='select-none origin-center box-border overflow-clip transform-gpu'
        style={{ transform }}
      >
        <div className=''>{children}</div>
      </div>
    </div>
  );
};

export default PannableDiv;

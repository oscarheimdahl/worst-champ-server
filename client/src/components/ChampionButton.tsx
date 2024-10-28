import { ReactNode, useState, KeyboardEvent, useRef } from 'react';
import { cn } from '../utils/utils';

interface Symbol {
  id: string;
  endX: number;
  endY: number;
  rotation: number;
}

const maxEndDist = 120;
const minEndDist = 60;
const floatAnimationDuration = 2000;

export const ChampionButton = ({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [active, setActive] = useState(false);

  const spawnSymbol = () => {
    const endPos = randomEndPos();
    const rotation = Math.random() * 20 - 10;
    const id = crypto.randomUUID();

    setSymbols((prev) => [
      ...prev,
      {
        id,
        endX: endPos.x,
        endY: endPos.y,
        rotation: rotation,
      },
    ]);

    setTimeout(() => {
      setSymbols((prev) => prev.filter((item) => item.id !== id));
    }, floatAnimationDuration);
  };

  const removeActiveTimeout = useRef<number>();
  const handleClick = () => {
    clearTimeout(removeActiveTimeout.current);
    onClick();
    spawnSymbol();
    setActive(true);
    removeActiveTimeout.current = setTimeout(() => setActive(false), 100);
    if (symbols.length > 5) spawnSymbol();
    if (symbols.length > 10) spawnSymbol();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'SpaceBar') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      {symbols.map((item) => {
        return (
          <div
            key={item.id}
            className='pointer-events-none absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 text-white'
          >
            <div
              className={`${
                item.rotation > 0 ? 'text-red-400' : 'text-gray-200'
              } animate-float pointer-events-none select-none`}
              style={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                '--end-position-x': `${-item.endX}px`,
                '--end-position-y': `${-item.endY}px`,
                '--rotation': `${item.rotation}deg`,
                '--float-animation-duration': `${floatAnimationDuration}ms`,
              }}
            >
              -1
            </div>
          </div>
        );
      })}
      <button
        onKeyDown={onKeyDown}
        onMouseDown={handleClick}
        className={cn(
          `relative peer rounded-md size-16 flex-none group overflow-hidden transition-all
          outline-white outline-1 hover:scale-125
            active:translate-y-1 active:rotate-1`,
          active && 'translate-y-1',
          className
        )}
      >
        {children}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 opacity-0 group-active:opacity-70 transition-opacity',
            active && 'opacity-50'
          )}
        ></div>
      </button>
    </>
  );
};

function randomEndPos() {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * (maxEndDist - minEndDist) + minEndDist;
  // Convert polar coordinates (distance, angle) to Cartesian (x, y)
  const x = distance * Math.cos(angle);
  const y = distance * Math.sin(angle);
  return { x, y };
}

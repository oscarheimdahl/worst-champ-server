import { ChampionList } from './components/ChampionList';
import { useEffect } from 'react';
import { useCustomToast } from './components/useCustomToast';

export type Champion = {
  name: string;
  id: string;
  votes: number;
};

export default function App() {
  const customToast = useCustomToast();
  useEffect(() => {
    customToast(
      <div className='text-left pb-2 flex flex-col '>
        <span className='text-gray-400 italic relative bottom-2'>Welcome!</span>
        <span> Vote for the worst champion in</span>
        <span className='text-amber-400 pb-2'>
          League&nbsp;of&nbsp;Legends.
        </span>
        <span>You can vote as many times as you want :)</span>
      </div>
    );
  }, [customToast]);

  return (
    <div className='w-full h-full overflow-scroll'>
      <Background />
      <ChampionList />
    </div>
  );
}

const Background = () => {
  const gradient1 =
    'radial-gradient(circle at 20% 20%, #f017f012 10%, transparent 40%, transparent 100%)';
  const gradient2 =
    'radial-gradient(circle at 80% 80%, #3817f012 20%, transparent 50%, transparent 100%)';
  const gradient3 =
    'radial-gradient(circle at 60% 50%, #d2900c12 20%, transparent 50%, transparent 100%)';

  const gradient4 =
    'radial-gradient(circle at 20% 80%, #056f1212 20%, transparent 40%, transparent 100%)';

  return (
    <>
      <div className={'fixed size-full'} style={{ background: gradient1 }} />
      <div className={'fixed size-full'} style={{ background: gradient2 }} />
      <div className={'fixed size-full'} style={{ background: gradient3 }} />
      <div className={'fixed size-full'} style={{ background: gradient4 }} />

      <div
        className={'fixed inset-4 rounded-sm border border-white/10'}
        style={{
          backgroundImage: 'radial-gradient(#151515 1px, transparent 0)',
          backgroundSize: '40px 40px',
          backgroundPosition: '-19px -19px',
        }}
      />
    </>
  );
};

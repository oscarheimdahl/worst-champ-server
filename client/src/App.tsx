import { ChampionList } from './components/ChampionList';

export type Champion = {
  name: string;
  id: string;
  votes: number;
};

export const dynamic = 'force-dynamic';

export default function App() {
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
        className={'fixed inset-4 border border-white/10'}
        style={{
          backgroundImage: 'radial-gradient(#151515 1px, transparent 0)',
          backgroundSize: '40px 40px',
          backgroundPosition: '-19px -19px',
        }}
      />
    </>
  );
};

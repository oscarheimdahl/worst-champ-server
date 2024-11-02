import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ChampionList } from '../components/ChampionList';
import { useCustomToast } from '../components/useCustomToast';

export const Route = createLazyFileRoute('/')({
  component: App,
});

function App() {
  const customToast = useCustomToast();
  useEffect(() => {
    if (sessionStorage.getItem('welcomed') === 'true') return;
    customToast(<WelcomeMessage />);
    sessionStorage.setItem('welcomed', 'true');
  }, [customToast]);

  return (
    <>
      <ChampionList />
      <ShowWelcomeMessage />
    </>
  );
}

const ShowWelcomeMessage = () => {
  const customToast = useCustomToast();

  return (
    <button
      className='fixed bottom-8 right-8 text-white size-6 rounded-full opacity-20 text-sm hover:opacity-100 transition-opacity border'
      onClick={() => customToast(<WelcomeMessage />)}
    >
      ?
    </button>
  );
};

const WelcomeMessage = () => {
  return (
    <div className='text-left flex flex-col '>
      <span className='text-gray-400 italic pb-2'>Welcome!</span>
      <span className='pb-2'>
        Vote for the champion you <span className='text-red-500'>dislike</span>{' '}
        the most in
        <span className='text-amber-300 pb-2'>
          &nbsp;League&nbsp;of&nbsp;Legends.
        </span>
      </span>
      <span>The worst champions are moved to the top.</span>
      <span>Order is synced between all visitors.</span>
      <span>You can vote as many times as you want :)</span>
    </div>
  );
};

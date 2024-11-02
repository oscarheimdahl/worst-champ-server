import { useEffect } from 'react';

import { createLazyFileRoute } from '@tanstack/react-router';

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
      className="fixed bottom-8 right-8 size-6 rounded-full border text-sm text-white opacity-20 transition-opacity hover:opacity-100"
      onClick={() => customToast(<WelcomeMessage />)}
    >
      ?
    </button>
  );
};

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col text-left">
      <span className="pb-2 italic text-gray-400">Welcome!</span>
      <span className="pb-2">
        Vote for the champion you <span className="text-red-500">dislike</span> the most in
        <span className="pb-2 text-amber-300">&nbsp;League&nbsp;of&nbsp;Legends.</span>
      </span>
      <span>The worst champions are moved to the top.</span>
      <span>Order is synced between all visitors.</span>
      <span>You can vote as many times as you want :)</span>
    </div>
  );
};

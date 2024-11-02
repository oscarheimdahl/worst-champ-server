import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { cn } from '../utils/utils';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <div className='w-full h-full overflow-scroll'>
        <Background />
        <div className='relative h-full'>
          <Outlet />
        </div>
      </div>
      <Toaster visibleToasts={1} duration={15000} />
    </>
  );
}

const Background = () => {
  const router = useRouterState();

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
        className={'fixed inset-4 mt-8 rounded-sm border border-white/10'}
        style={{
          backgroundImage: 'radial-gradient(#151515 1px, transparent 0)',
          backgroundSize: '40px 40px',
          backgroundPosition: '-19px -19px',
        }}
      />
      <div className='fixed top-0 flex gap-2 px-4 z-10 h-12 items-center bg-black/30 w-full'>
        <Link
          to='/'
          className={cn(
            'bg-transparent ml-auto border-transparent border rounded-sm px-2 py-1 transition-colors hover:bg-white/10 hover:border-white/20',
            router.location.pathname === '/' && 'border-white/20'
          )}
        >
          <span className='bg-gradient-to-br  from-pinkish to-orangish text-transparent bg-clip-text'>
            Vote
          </span>
        </Link>
        <Link
          to='/history'
          className={cn(
            'bg-transparent border-transparent border rounded-sm px-2 py-1 transition-colors hover:bg-white/10 hover:border-white/20',
            router.location.pathname === '/history' && 'border-white/20'
          )}
        >
          <span className='bg-gradient-to-br  from-pinkish to-orangish text-transparent bg-clip-text'>
            History
          </span>
        </Link>
      </div>
    </>
  );
};

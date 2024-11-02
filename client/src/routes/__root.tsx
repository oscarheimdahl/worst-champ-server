import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { Toaster } from 'sonner';

import { cn } from '@/lib/utils';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <div className="h-full w-full overflow-scroll">
        <Background />
        <div className="relative h-full">
          <Outlet />
        </div>
      </div>
      <Toaster visibleToasts={1} duration={15000} />
    </>
  );
}

const Background = () => {
  const gradient1 = 'radial-gradient(circle at 20% 20%, #f017f012 10%, transparent 40%, transparent 100%)';
  const gradient2 = 'radial-gradient(circle at 80% 80%, #3817f012 20%, transparent 50%, transparent 100%)';
  const gradient3 = 'radial-gradient(circle at 60% 50%, #d2900c12 20%, transparent 50%, transparent 100%)';

  const gradient4 = 'radial-gradient(circle at 20% 80%, #056f1212 20%, transparent 40%, transparent 100%)';

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
      <div className="fixed top-0 z-10 flex h-12 w-full items-center justify-end gap-2 bg-black/60 px-4">
        <LinkButton route="/" label="Vote" />
        <LinkButton route="/history" label="History" />
      </div>
      <div className="fixed bottom-0 z-10 flex h-4 w-full items-center justify-end gap-2 bg-black/60"></div>
    </>
  );
};

const LinkButton = (props: { route: string; label: string }) => {
  const router = useRouterState();

  return (
    <Link
      to={props.route}
      className={cn(
        'rounded-sm border border-transparent bg-transparent px-2 py-1 saturate-0 transition-all',
        'hover:border-white/20 hover:bg-white/10 hover:saturate-100',
        router.location.pathname === props.route && 'border-white/10 saturate-100',
      )}
    >
      <span className="bg-gradient-to-br from-pinkish to-orangish bg-clip-text text-transparent">{props.label}</span>
    </Link>
  );
};

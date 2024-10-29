import { ReactNode } from 'react';
import { toast } from 'sonner';

export const useCustomToast = () => {
  return (children: ReactNode | string) =>
    toast.custom((t) => (
      <button
        onClick={() => toast.dismiss(t)}
        className='hover:opacity-50 hover:translate-y-2 transition-all text-white rounded-md w-[354px] p-[1px] bg-white right-0 bg-gradient-to-tr from-[hsl(295,67%,10%)] to-[hsl(30,21%,20%)]'
      >
        <div className='size-full text-left p-4 rounded-[5px] bg-[#030312]'>
          {children}
        </div>
      </button>
    ));
};

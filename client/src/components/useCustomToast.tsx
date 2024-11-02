import { ReactNode } from 'react';

import { toast } from 'sonner';

export const useCustomToast = () => {
  return (children: ReactNode | string) =>
    toast.custom((t) => (
      <button
        onClick={() => toast.dismiss(t)}
        className="right-0 w-[354px] rounded-md bg-white bg-gradient-to-tr from-[hsl(295,67%,10%)] to-[hsl(30,21%,20%)] p-[1px] text-white transition-all hover:translate-y-2 hover:opacity-50"
      >
        <div className="size-full rounded-[5px] bg-[#030312] p-4 text-left">{children}</div>
      </button>
    ));
};

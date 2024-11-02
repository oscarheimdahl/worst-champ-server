import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { apiUrl } from '../utils/env';

export const Route = createFileRoute('/history')({
  component: History,
});

function History() {
  const [savedChampions, setSavedChampions] = useState<
    Record<
      string,
      {
        name: string;
        votes: number;
      }[]
    >
  >();
  useEffect(() => {
    const doFetch = async () => {
      const res = await fetch(`${apiUrl}/saved-champions`);
      const savedChampions = await res.json();
      console.log(savedChampions);
      setSavedChampions(savedChampions);
    };
    doFetch();
  }, []);

  return (
    <div className='size-full  text-white'>
      {savedChampions &&
        Object.entries(savedChampions).map(([date, champions], b) => {
          return (
            <div>
              {date}
              <br />
              <div className='ml-2'>
                {champions.map((c) => {
                  return (
                    <div>
                      {c.name}: {c.votes}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}

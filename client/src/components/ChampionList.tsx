import { useEffect, useRef, useState } from 'react';

import { Reorder } from 'framer-motion';

import { apiUrl, socketUrl } from '../lib/env';
import { Champion } from '../types/champion';
import { ChampionButton } from './ChampionButton';
import { useCustomToast } from './useCustomToast';

async function upvoteChampion(championId: string, clientId: string) {
  const res = await fetch(`${apiUrl}/champions/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ championId, clientId }),
  });

  if (res.status !== 200 && res.status !== 429) throw new Error('Error');
}

function sortChampions(a: Champion, b: Champion) {
  if (b.votes === a.votes) {
    return a.name.localeCompare(b.name);
  }
  return b.votes - a.votes;
}

export const ChampionList = () => {
  const clientId = useRef(Math.random().toString(36).substring(2, 15));
  // const [preventVoteClick, setPreventVoteClick] = useState(false);

  const [champions, setChampions] = useState<Champion[]>([]);
  const customToast = useCustomToast();

  useEffect(() => {
    const doFetch = async () => {
      const res = await fetch(`${apiUrl}/champions`);
      const newChampions = await res.json();
      setChampions(newChampions.slice().sort(sortChampions));
    };
    doFetch();
  }, []);

  const ref = useRef<boolean>(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const socket = new WebSocket(socketUrl);

    socket.onmessage = async (event) => {
      if (event.type === 'message') {
        const data = JSON.parse(event.data);
        if (data.type === 'vote') {
          if (data.clientId === clientId.current) return;
          await upvote(data.championId);
        }
      }
    };
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const upvote = async (championId: string, castByUser?: boolean) => {
    setChampions((prevChampions) => {
      const newChampions = prevChampions
        .map((item) => {
          if (item.id === championId) {
            return {
              ...item,
              votes: item.votes + 1,
            };
          }
          return item;
        })
        .slice()
        .sort(sortChampions);

      // if (castByUser) {
      //   const orderChanged = !newChampions.every(
      //     (champion, i) => prevChampions[i].id === champion.id
      //   );
      //   if (orderChanged) {
      //     const sound = new Audio(`/darkharvest.ogg`);
      //     sound.volume = 0.1;
      //     sound.playbackRate = 2;
      //     sound.play();
      //   }
      // }
      return newChampions;
    });

    if (!castByUser) return;
    try {
      await upvoteChampion(championId, clientId.current);
    } catch (e) {
      console.log(e);
      customToast('Server Error');
    }
  };

  const lastVoteClick = useRef(0);
  const handleVoteClick = async (championId: string) => {
    if (Date.now() - lastVoteClick.current < 1000) return;
    lastVoteClick.current = Date.now();
    upvote(championId, true);
  };

  return (
    <Reorder.Group
      className={'relative flex w-full flex-col items-center gap-6 py-[300px]'}
      as="div"
      axis="y"
      values={champions}
      onReorder={(c) => setChampions(c)}
    >
      {champions.map((champion) => {
        return (
          <Reorder.Item
            drag={false}
            key={champion.id}
            value={champion}
            as="div"
            style={{ zIndex: champion.votes }}
            className={
              'group peer relative transition-opacity duration-1000 peer-hover:opacity-30 has-[~div:hover]:opacity-30'
            }
          >
            <span className={'sr-only pointer-events-none absolute'}>{champion.name.replace('_', ' ')}</span>
            <ChampionButton
              // className={preventVoteClick ? 'pointer-events-none' : ''}
              onClick={() => handleVoteClick(champion.id)}
            >
              <img
                loading="lazy"
                className={'pointer-events-none size-full scale-[1.05] select-none transition-transform'}
                src={(import.meta.env.PROD ? '' : 'http://localhost:8000') + `/imgs/${champion.name}.jpg`}
              />
            </ChampionButton>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
};

import { useEffect, useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

import { apiUrl } from '../lib/env';

export const Route = createFileRoute('/history')({
  component: History,
});

type ISOString = string;
type SavedChampionsRecordsApi = Record<ISOString, { name: string; votes: number }[]>;
type SavedChampionRecord = { date: string; champions: { name: string; votes: number }[] };

function History() {
  const [savedChampions, setSavedChampions] = useState<SavedChampionRecord[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const doFetch = async () => {
      const res = await fetch(`${apiUrl}/saved-champions`);
      const savedChampionsRecords = (await res.json()) as SavedChampionsRecordsApi;

      const latestSavedChampions = Object.entries(savedChampionsRecords)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .slice(0, 10)
        .map(([date, champions]) => ({
          date,
          champions: champions.sort((a, b) => b.votes - a.votes).slice(0, 10),
        }))
        .reverse();

      setSavedChampions(latestSavedChampions);
      setTimeout(() => setShow(true), 200);
    };
    doFetch();
  }, []);

  const chartData = savedChampions.map((entry) => {
    const formattedEntry: {
      date: string;
    } & {
      [key: string]: number | string;
    } = { date: entry.date };

    entry.champions.forEach((champion) => {
      formattedEntry[champion.name] = champion.votes;
    });

    return formattedEntry;
  });

  const uniqueChampionNames = Array.from(
    new Set(savedChampions.flatMap((entry) => entry.champions.map((champion) => champion.name))),
  );

  return (
    <div
      style={{ transitionDuration: '1000ms' }}
      className={cn('flex size-full items-center justify-center', !show && 'opacity-0')}
    >
      <Card
        style={{ transitionDuration: '500ms' }}
        className={cn('w-5/6 bg-black/10 transition-all', !show && 'translate-y-12')}
      >
        <CardHeader>
          <CardTitle>Worst Champions Over Time</CardTitle>
          <CardDescription>Updated every hour</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(isoTimestamp) => {
                  return formatDistanceToNow(new Date(isoTimestamp), { addSuffix: true });
                }}
              />
              {uniqueChampionNames.map((championName, i) => (
                <Line
                  animationDuration={0}
                  label={championName}
                  dataKey={championName}
                  type="monotone"
                  stroke={`hsl(${(i * 255) / 10},40%,40%)`}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, index, dataKey: championName } = props;

                    if (index !== 9) return <></>;

                    return (
                      <image
                        href={(import.meta.env.PROD ? '' : 'http://localhost:8000') + `/imgs/${championName}.jpg`}
                        x={cx - 12} // Adjust to center the image properly
                        y={cy - 12}
                        height={24}
                        width={24}
                      />
                    );
                  }}
                ></Line>
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

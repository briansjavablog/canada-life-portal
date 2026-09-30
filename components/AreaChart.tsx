import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { theme } from '@/theme';
import { formatEuroCompact } from '@/utils/format';

export type ChartSeries = {
  id: string;
  values: number[];
  color: string;
  fill?: boolean;
  dashed?: boolean;
};

type Label = { index: number; text: string };

function useTweenSeries(series: number[][], duration = 460): number[][] {
  const [values, setValues] = useState(series);
  const current = useRef(series);
  const signature = series.map((row) => row.join(',')).join('|');

  useEffect(() => {
    const from = current.current;
    const sameShape =
      from.length === series.length && from.every((row, index) => row.length === series[index]?.length);
    const startRows = sameShape ? from : series.map((row) => [...row]);
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = series.map((row, seriesIndex) =>
        row.map((value, pointIndex) => {
          const origin = startRows[seriesIndex]?.[pointIndex] ?? value;
          return origin + (value - origin) * eased;
        }),
      );
      current.current = next;
      setValues(next);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // signature captures the numeric series without retriggering on new array identity alone
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, duration]);

  return values;
}

function pointsFor(
  values: number[],
  width: number,
  height: number,
  min: number,
  max: number,
  pad: { top: number; right: number; bottom: number; left: number },
) {
  const innerWidth = Math.max(1, width - pad.left - pad.right);
  const innerHeight = Math.max(1, height - pad.top - pad.bottom);
  const span = max - min || 1;
  return values.map((value, index) => {
    const x = pad.left + (values.length <= 1 ? innerWidth / 2 : (index / (values.length - 1)) * innerWidth);
    const y = pad.top + (1 - (value - min) / span) * innerHeight;
    return { x, y };
  });
}

function linePath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
}

export function AreaChart({
  series,
  labels = [],
  height = 220,
  compact = false,
  showBand = false,
}: {
  series: ChartSeries[];
  labels?: Label[];
  height?: number;
  compact?: boolean;
  showBand?: boolean;
}) {
  const [width, setWidth] = useState(320);
  const gradientId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const animated = useTweenSeries(series.map((item) => item.values));
  const pad = compact
    ? { top: 8, right: 4, bottom: 8, left: 4 }
    : { top: 16, right: 12, bottom: 28, left: 48 };

  const domain = useMemo(() => {
    const all = animated.flat();
    const low = Math.min(...all);
    const high = Math.max(...all);
    const cushion = (high - low) * 0.14 || high * 0.08 || 1;
    return { min: Math.max(0, low - cushion * 0.35), max: high + cushion };
  }, [animated]);

  const plotted = animated.map((values) => pointsFor(values, width, height, domain.min, domain.max, pad));
  const baselineY = height - pad.bottom;
  const primaryIndex = series.findIndex((item) => !item.dashed);
  const primary = plotted[primaryIndex] ?? plotted[0];
  const secondary = plotted.find((_, index) => series[index]?.dashed);

  const grid = [0, 0.5, 1].map((step) => {
    const value = domain.min + (domain.max - domain.min) * (1 - step);
    const y = pad.top + step * (height - pad.top - pad.bottom);
    return { y, label: formatEuroCompact(value) };
  });

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.colors.chartPrimary} stopOpacity="0.22" />
            <Stop offset="1" stopColor={theme.colors.chartPrimary} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        {!compact
          ? grid.map((line) => (
              <Line
                key={line.label}
                x1={pad.left}
                x2={width - pad.right}
                y1={line.y}
                y2={line.y}
                stroke={theme.colors.line}
                strokeWidth={1}
              />
            ))
          : null}
        {!compact
          ? grid.map((line) => (
              <SvgText key={`${line.label}-t`} x={0} y={line.y + 4} fill={theme.colors.faint} fontSize={11}>
                {line.label}
              </SvgText>
            ))
          : null}
        {showBand && primary && secondary ? (
          <Path d={`${linePath(primary)} ${[...secondary].reverse().map((point) => `L${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')} Z`} fill={theme.colors.positive} fillOpacity={0.14} />
        ) : null}
        {plotted.map((points, index) => {
          const item = series[index];
          if (!item || points.length === 0) return null;
          const area = item.fill ? `${linePath(points)} L${points[points.length - 1].x.toFixed(1)} ${baselineY} L${points[0].x.toFixed(1)} ${baselineY} Z` : null;
          return (
            <Path
              key={`${item.id}-area`}
              d={area ?? ''}
              fill={area ? `url(#${gradientId})` : 'transparent'}
            />
          );
        })}
        {plotted.map((points, index) => {
          const item = series[index];
          if (!item) return null;
          return (
            <Path
              key={item.id}
              d={linePath(points)}
              stroke={item.color}
              strokeWidth={item.dashed ? 2 : 2.5}
              strokeDasharray={item.dashed ? '5 6' : undefined}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
        {primary && primary.length > 0 ? (
          <Circle cx={primary[primary.length - 1].x} cy={primary[primary.length - 1].y} r={4.5} fill={theme.colors.red} />
        ) : null}
        {!compact
          ? labels.map((label) => {
              const point = primary?.[label.index];
              if (!point) return null;
              return (
                <SvgText
                  key={label.text}
                  x={point.x}
                  y={height - 8}
                  fill={theme.colors.muted}
                  fontSize={12}
                  textAnchor={label.index === 0 ? 'start' : label.index === (primary?.length ?? 1) - 1 ? 'end' : 'middle'}
                >
                  {label.text}
                </SvgText>
              );
            })
          : null}
      </Svg>
    </View>
  );
}

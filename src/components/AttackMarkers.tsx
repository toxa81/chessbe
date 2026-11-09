import type { Color, Square } from '../chess/board';

interface AttackMarkersProps {
  color: Color;
  sources: readonly Square[];
  edge: 'top' | 'bottom';
}

export function AttackMarkers({ color, sources, edge }: AttackMarkersProps) {
  if (sources.length === 0) return null;
  // A single SVG keeps every circle round and fits even unusually crowded rows.
  return <svg
    className={`attack-markers ${color} ${edge}`}
    viewBox={`0 0 ${sources.length * 8 - 2} 6`}
    preserveAspectRatio="xMinYMid meet"
    aria-hidden="true"
  >{sources.map((source, index) => <circle key={source} data-source={source} cx={index * 8 + 3} cy="3" r="2.5" />)}</svg>;
}

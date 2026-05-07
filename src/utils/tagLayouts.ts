import type { BlogTag } from '../types/blog';

export type { BlogTag };

export interface HexCellData {
  tag: BlogTag;
  x: number;
  y: number;
  size: number;
  baseColor: string;
  delay: number;
  sizeLevel: number;
}

export interface HexContainerSize {
  width: number;
  height: number;
}

// 预设调色板
const TAG_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#ef4444',
  '#84cc16',
];

// 布局算法常量
const MARGIN_RATIO = 0.9;
const FIT_THRESHOLD = 0.95;
const MIN_HEX_SIZE = 22;
const MAX_HEX_SIZE = 55;
const ABSOLUTE_MIN_SIZE = 20;
const MAX_FIT_ATTEMPTS = 5;
const SIZE_DECAY = 0.92;
const ANIMATION_DELAY_BASE = 60;
const MIN_CONTAINER_HEIGHT = 100;

// 六边形几何常量
const HEX_HORIZONTAL_SPACING = 1.5;
const HEX_VERTICAL_OFFSET = 0.5;

// 大小等级常量
const SIZE_LEVEL_DIVISOR = 2;
const MAX_SIZE_LEVEL = 5;

// 无限生成器的安全上限
const MAX_SAFE_RING = 10000;

/**
 * 根据标签名称获取颜色（一致性哈希）
 */
export function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

/**
 * 根据数量计算大小等级 (1-MAX_SIZE_LEVEL)
 */
export function getSizeLevel(count: number): number {
  return Math.min(Math.ceil(count / SIZE_LEVEL_DIVISOR), MAX_SIZE_LEVEL);
}

/**
 * 生成六边形螺旋坐标
 */
function* hexSpiralCoords(): Generator<{ q: number; r: number; ring: number }> {
  yield { q: 0, r: 0, ring: 0 };

  for (let ring = 1; ring <= MAX_SAFE_RING; ring++) {
    const positions: { q: number; r: number; angle: number }[] = [];

    for (let q = -ring; q <= ring; q++) {
      for (let r = -ring; r <= ring; r++) {
        const s = -q - r;
        const dist = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
        if (dist === ring) {
          const angle = Math.atan2(r, q);
          positions.push({ q, r, angle });
        }
      }
    }

    positions.sort((a, b) => a.angle - b.angle);

    for (const pos of positions) {
      yield { q: pos.q, r: pos.r, ring };
    }
  }
}

/**
 * axial 坐标转像素坐标（平顶六边形）
 */
function hexToPixel(q: number, r: number, size: number): { x: number; y: number } {
  const x = size * HEX_HORIZONTAL_SPACING * q;
  const y = size * Math.sqrt(3) * (r + q * HEX_VERTICAL_OFFSET);
  return { x, y };
}

/**
 * 计算六边形布局在指定 size 下的包围盒
 */
function getLayoutBounds(
  tags: BlogTag[],
  size: number
): { cells: HexCellData[]; width: number; height: number } {
  const coordGen = hexSpiralCoords();
  const cells: HexCellData[] = [];

  for (const tag of tags) {
    const next = coordGen.next();
    if (next.done || !next.value) break;
    const coords = next.value;
    const pixel = hexToPixel(coords.q, coords.r, size);
    const sizeLevel = getSizeLevel(tag.count);

    cells.push({
      tag,
      x: pixel.x,
      y: pixel.y,
      size,
      baseColor: getTagColor(tag.name),
      delay: coords.ring * ANIMATION_DELAY_BASE,
      sizeLevel,
    });
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const cell of cells) {
    const w = cell.size * 2;
    const h = cell.size * Math.sqrt(3);
    minX = Math.min(minX, cell.x - w / 2);
    maxX = Math.max(maxX, cell.x + w / 2);
    minY = Math.min(minY, cell.y - h / 2);
    maxY = Math.max(maxY, cell.y + h / 2);
  }

  return {
    cells,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * 计算蜂巢布局
 */
export function calculateHexLayout(
  tags: BlogTag[],
  containerWidth: number,
  containerHeight: number
): HexCellData[] {
  if (tags.length === 0) return [];

  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  const n = sortedTags.length;

  let maxRing = 0;
  while (1 + 3 * maxRing * (maxRing + 1) < n) {
    maxRing++;
  }

  const estimatedSize =
    (containerWidth * MARGIN_RATIO) / ((2 * maxRing + 1) * HEX_HORIZONTAL_SPACING);

  let bestSize = Math.min(Math.max(estimatedSize, MIN_HEX_SIZE), MAX_HEX_SIZE);
  let bestLayout = getLayoutBounds(sortedTags, bestSize);

  const checkHeight = containerHeight > MIN_CONTAINER_HEIGHT;
  let attempts = 0;
  while (
    (bestLayout.width > containerWidth * FIT_THRESHOLD ||
      (checkHeight && bestLayout.height > containerHeight * FIT_THRESHOLD)) &&
    bestSize > ABSOLUTE_MIN_SIZE &&
    attempts < MAX_FIT_ATTEMPTS
  ) {
    bestSize *= SIZE_DECAY;
    bestLayout = getLayoutBounds(sortedTags, bestSize);
    attempts++;
  }

  const { cells } = bestLayout;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const cell of cells) {
    const w = cell.size * 2;
    const h = cell.size * Math.sqrt(3);
    minX = Math.min(minX, cell.x - w / 2);
    maxX = Math.max(maxX, cell.x + w / 2);
    minY = Math.min(minY, cell.y - h / 2);
    maxY = Math.max(maxY, cell.y + h / 2);
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  for (const cell of cells) {
    cell.x -= centerX;
    cell.y -= centerY;
  }

  return cells;
}

/**
 * 根据单元格计算容器所需尺寸
 */
export function calculateHexContainerSize(cells: HexCellData[]): HexContainerSize {
  if (cells.length === 0) return { width: 0, height: 0 };

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const cell of cells) {
    const w = cell.size * 2;
    const h = cell.size * Math.sqrt(3);
    minX = Math.min(minX, cell.x - w / 2);
    maxX = Math.max(maxX, cell.x + w / 2);
    minY = Math.min(minY, cell.y - h / 2);
    maxY = Math.max(maxY, cell.y + h / 2);
  }

  return {
    width: Math.ceil(maxX - minX),
    height: Math.ceil(maxY - minY),
  };
}

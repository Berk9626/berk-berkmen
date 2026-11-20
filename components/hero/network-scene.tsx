"use client";

/* The signal field writes into WebGL buffers on every frame. Those objects are GPU state, not React state. */
/* eslint-disable react-hooks/immutability, react-hooks/refs */

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLS = 70;
const ROWS = 70;
const COUNT = COLS * ROWS;
const LINE_FLOATS = (COLS * (ROWS - 1) + ROWS * (COLS - 1)) * 2 * 3;
const MAX_PACKETS = 16;
const MAX_SEGS = 99;
const TRAIL_FLOATS = MAX_PACKETS * MAX_SEGS * 6;
const HEAD_FLOATS = MAX_PACKETS * 3;

const ICE = new THREE.Color("#8AB4D4");
const COPPER = new THREE.Color("#E8702A");
const PACKET_COLORS = [
  "#E8702A",
  "#A855F7",
  "#39D353",
  "#F1C40F",
  "#60A5FA",
].map((hex) => new THREE.Color(hex));

type Packet = {
  path: number[];
  segIdx: number;
  segProg: number;
  speed: number;
  color: THREE.Color;
  state: "traveling" | "fading";
  fadeProg: number;
};

function stepToward(from: number, to: number, maxSteps: number) {
  const steps: number[] = [];
  let current = from;

  for (let i = 0; i < maxSteps && current !== to; i += 1) {
    const col = current % COLS;
    const row = Math.floor(current / COLS);
    const toCol = to % COLS;
    const toRow = Math.floor(to / COLS);
    const moveCol = col !== toCol;
    const moveRow = row !== toRow;
    let next = current;

    if (moveCol && moveRow) {
      next =
        Math.random() > 0.5
          ? current + (col < toCol ? 1 : -1)
          : current + (row < toRow ? COLS : -COLS);
    } else if (moveCol) {
      next = current + (col < toCol ? 1 : -1);
    } else if (moveRow) {
      next = current + (row < toRow ? COLS : -COLS);
    }

    if (next === current) break;
    steps.push(next);
    current = next;
  }

  return steps;
}

function createPacket(): Packet | null {
  const waypoints = [Math.floor(Math.random() * COUNT)];
  const extras = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < extras; i += 1) {
    waypoints.push(Math.floor(Math.random() * COUNT));
  }

  const path = [waypoints[0]];
  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const room = 100 - path.length;
    if (room <= 1) break;
    path.push(...stepToward(waypoints[i], waypoints[i + 1], room - 1));
  }

  if (path.length < 2) return null;

  return {
    path,
    segIdx: 0,
    segProg: 0,
    speed: 3 + Math.random() * 5,
    color: PACKET_COLORS[Math.floor(Math.random() * PACKET_COLORS.length)].clone(),
    state: "traveling",
    fadeProg: 0,
  };
}

function createGeometry(floatCount: number, withColor: boolean) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(floatCount), 3),
  );
  if (withColor) {
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(floatCount), 3),
    );
  }
  return geometry;
}

function CameraRig() {
  useFrame(({ clock, camera }) => {
    const time = clock.elapsedTime;
    camera.position.x = 2.5 * Math.sin(0.18 * time);
    camera.position.y = 4 + 0.5 * Math.sin(0.13 * time);
    camera.position.z = 6 + 2.5 * Math.cos(0.18 * time * 0.7);
    camera.lookAt(
      Math.sin(0.18 * time * 0.85),
      -0.3,
      -1.8 + 1.8 * Math.sin(0.18 * time * 0.6),
    );
  });

  return null;
}

type Field = {
  glow: THREE.Texture;
  points: THREE.BufferGeometry;
  grid: THREE.BufferGeometry;
  trails: THREE.BufferGeometry;
  heads: THREE.BufferGeometry;
  packets: Packet[];
  spawnIn: number;
  heat: Float32Array;
  flash: Float32Array;
};

function createGlow() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  if (!context) return texture;
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.70)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  texture.needsUpdate = true;
  return texture;
}

function createField(): Field {
  return {
    glow: createGlow(),
    points: createGeometry(COUNT * 3, true),
    grid: createGeometry(LINE_FLOATS, false),
    trails: createGeometry(TRAIL_FLOATS, true),
    heads: createGeometry(HEAD_FLOATS, true),
    packets: [],
    spawnIn: 0,
    heat: new Float32Array(COUNT),
    flash: new Float32Array(COUNT * 3),
  };
}

function SignalField() {
  const field = useRef<Field | null>(null);
  if (field.current === null) field.current = createField();
  const scene = field.current;

  useEffect(() => {
    const current = field.current;
    return () => {
      current?.points.dispose();
      current?.grid.dispose();
      current?.trails.dispose();
      current?.heads.dispose();
      current?.glow.dispose();
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const current = field.current;
    if (!current) return;
    const { points, grid, trails, heads } = current;
    const time = clock.elapsedTime;
    const position = points.attributes.position.array as Float32Array;
    const color = points.attributes.color.array as Float32Array;
    const lines = grid.attributes.position.array as Float32Array;
    const trailPosition = trails.attributes.position.array as Float32Array;
    const trailColor = trails.attributes.color.array as Float32Array;
    const headPosition = heads.attributes.position.array as Float32Array;
    const headColor = heads.attributes.color.array as Float32Array;
    const heatMap = current.heat;
    const flashMap = current.flash;

    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const index = row * COLS + col;
        const x = -34.5 + col;
        const z = -63 + row;
        position[index * 3] = x;
        position[index * 3 + 1] =
          0.35 * Math.sin(0.69 * x + 0.43 * time) +
          0.26 * Math.sin(0.58 * z + 0.3 * time) +
          0.16 * Math.sin((x + z) * 0.4 + 0.47 * time) +
          0.1 * Math.sin((x - z) * 0.52 + 0.24 * time);
        position[index * 3 + 2] = z;
      }
    }

    let cursor = 0;
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS - 1; col += 1) {
        const a = (row * COLS + col) * 3;
        const b = a + 3;
        lines[cursor] = position[a];
        lines[cursor + 1] = position[a + 1];
        lines[cursor + 2] = position[a + 2];
        lines[cursor + 3] = position[b];
        lines[cursor + 4] = position[b + 1];
        lines[cursor + 5] = position[b + 2];
        cursor += 6;
      }
    }
    for (let row = 0; row < ROWS - 1; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const a = (row * COLS + col) * 3;
        const b = ((row + 1) * COLS + col) * 3;
        lines[cursor] = position[a];
        lines[cursor + 1] = position[a + 1];
        lines[cursor + 2] = position[a + 2];
        lines[cursor + 3] = position[b];
        lines[cursor + 4] = position[b + 1];
        lines[cursor + 5] = position[b + 2];
        cursor += 6;
      }
    }

    for (let i = 0; i < COUNT; i += 1) {
      if (heatMap[i] > 0) heatMap[i] = Math.max(0, heatMap[i] - 1.8 * delta);
      const height = Math.max(0, Math.min(1, (position[i * 3 + 1] + 0.87) / 1.74));
      const boost = 2.2 * heatMap[i];
      color[i * 3] = Math.min(2, ICE.r + height * (COPPER.r - ICE.r) + flashMap[i * 3] * boost);
      color[i * 3 + 1] = Math.min(2, ICE.g + height * (COPPER.g - ICE.g) + flashMap[i * 3 + 1] * boost);
      color[i * 3 + 2] = Math.min(2, ICE.b + height * (COPPER.b - ICE.b) + flashMap[i * 3 + 2] * boost);
    }

    current.spawnIn -= delta;
    if (current.spawnIn <= 0 && current.packets.length < MAX_PACKETS) {
      const packet = createPacket();
      if (packet) current.packets.push(packet);
      current.spawnIn = 0.3 + Math.random() * 0.9;
    }

    trailPosition.fill(0);
    trailColor.fill(0);
    headPosition.fill(0);
    headColor.fill(0);

    const alive: Packet[] = [];
    let trailCursor = 0;
    let headIndex = 0;

    for (const packet of current.packets) {
      const tint = packet.color;
      if (packet.state === "traveling") {
        packet.segProg += delta * packet.speed;
        while (packet.segProg >= 1) {
          const next = packet.segIdx + 1;
          if (next >= packet.path.length - 1) {
            const cell = packet.path[packet.path.length - 1];
            heatMap[cell] = 2.5;
            flashMap[cell * 3] = tint.r;
            flashMap[cell * 3 + 1] = tint.g;
            flashMap[cell * 3 + 2] = tint.b;
            packet.segIdx = next;
            packet.state = "fading";
            packet.fadeProg = 0;
            break;
          }
          packet.segProg -= 1;
          packet.segIdx = next;
          const cell = packet.path[next];
          heatMap[cell] = 1;
          flashMap[cell * 3] = tint.r;
          flashMap[cell * 3 + 1] = tint.g;
          flashMap[cell * 3 + 2] = tint.b;
        }
      }

      const drawn = Math.min(packet.segIdx, MAX_SEGS);
      if (packet.state === "fading") {
        packet.fadeProg += delta * packet.speed;
        if (packet.fadeProg >= drawn + 3) continue;
      }

      const fadeStart = packet.state === "fading" ? packet.fadeProg : Number.NEGATIVE_INFINITY;
      for (let segment = 0; segment < drawn; segment += 1) {
        const alpha = Math.max(0, Math.min(1, (segment - fadeStart + 3) / 3));
        if (alpha <= 0 || trailCursor + 6 > TRAIL_FLOATS) continue;
        const from = packet.path[segment] * 3;
        const to = packet.path[segment + 1] * 3;
        trailPosition[trailCursor] = position[from];
        trailPosition[trailCursor + 1] = position[from + 1];
        trailPosition[trailCursor + 2] = position[from + 2];
        trailPosition[trailCursor + 3] = position[to];
        trailPosition[trailCursor + 4] = position[to + 1];
        trailPosition[trailCursor + 5] = position[to + 2];
        trailColor[trailCursor] = tint.r * alpha;
        trailColor[trailCursor + 1] = tint.g * alpha;
        trailColor[trailCursor + 2] = tint.b * alpha;
        trailColor[trailCursor + 3] = tint.r * alpha;
        trailColor[trailCursor + 4] = tint.g * alpha;
        trailColor[trailCursor + 5] = tint.b * alpha;
        trailCursor += 6;
      }

      if (
        packet.state === "traveling" &&
        packet.segIdx < packet.path.length - 1 &&
        headIndex < MAX_PACKETS &&
        trailCursor + 6 <= TRAIL_FLOATS
      ) {
        const from = packet.path[packet.segIdx] * 3;
        const to = packet.path[packet.segIdx + 1] * 3;
        const progress = Math.min(packet.segProg, 1);
        const headX = position[from] + (position[to] - position[from]) * progress;
        const headY = position[from + 1] + (position[to + 1] - position[from + 1]) * progress;
        const headZ = position[from + 2] + (position[to + 2] - position[from + 2]) * progress;
        trailPosition[trailCursor] = position[from];
        trailPosition[trailCursor + 1] = position[from + 1];
        trailPosition[trailCursor + 2] = position[from + 2];
        trailPosition[trailCursor + 3] = headX;
        trailPosition[trailCursor + 4] = headY;
        trailPosition[trailCursor + 5] = headZ;
        trailColor[trailCursor] = tint.r * 0.7;
        trailColor[trailCursor + 1] = tint.g * 0.7;
        trailColor[trailCursor + 2] = tint.b * 0.7;
        trailColor[trailCursor + 3] = tint.r * 2.5;
        trailColor[trailCursor + 4] = tint.g * 2.5;
        trailColor[trailCursor + 5] = tint.b * 2.5;
        trailCursor += 6;
        headPosition[headIndex * 3] = headX;
        headPosition[headIndex * 3 + 1] = headY;
        headPosition[headIndex * 3 + 2] = headZ;
        headColor[headIndex * 3] = tint.r * 4;
        headColor[headIndex * 3 + 1] = tint.g * 4;
        headColor[headIndex * 3 + 2] = tint.b * 4;
        headIndex += 1;
      }

      alive.push(packet);
    }

    current.packets = alive;
    trails.setDrawRange(0, trailCursor / 3);
    heads.setDrawRange(0, headIndex);
    points.attributes.position.needsUpdate = true;
    points.attributes.color.needsUpdate = true;
    grid.attributes.position.needsUpdate = true;
    trails.attributes.position.needsUpdate = true;
    trails.attributes.color.needsUpdate = true;
    heads.attributes.position.needsUpdate = true;
    heads.attributes.color.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={scene.grid} frustumCulled={false}>
        <lineBasicMaterial
          color="#1e3a52"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments geometry={scene.trails} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </lineSegments>
      <points geometry={scene.points} frustumCulled={false}>
        <pointsMaterial
          size={0.042}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          sizeAttenuation
          map={scene.glow}
          alphaMap={scene.glow}
          alphaTest={0.001}
        />
      </points>
      <points geometry={scene.heads} frustumCulled={false}>
        <pointsMaterial
          size={0.14}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          sizeAttenuation
          map={scene.glow}
          alphaMap={scene.glow}
          alphaTest={0.001}
        />
      </points>
    </group>
  );
}

export default function NetworkScene() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 4, 6.8], fov: 58 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ width: "100%", height: "100%", background: "#0D1117" }}
      >
        <color attach="background" args={["#0D1117"]} />
        <fogExp2 attach="fog" args={["#0D1117", 0.06]} />
        <CameraRig />
        <SignalField />
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.07}
            luminanceSmoothing={0.88}
            intensity={2.6}
            mipmapBlur
            radius={0.88}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

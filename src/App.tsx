import {
  Environment,
  Gltf,
  OrbitControls,
  PerformanceMonitor,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Splat } from './splat-object';
import { Leva, useControls } from 'leva';
import { Suspense, useState } from 'react';
import url from './basura1.splat';

const gltfUrls = [
] as const;
const splatUrls = [
  url,
] as const;

function App() {
  // On screen controls
  const { splatUrl, gltfUrl, throttleDpr, maxDpr, throttleSplats, maxSplats } = useControls({
    splatUrl: { label: 'Splat URL', options: splatUrls },
    gltfUrl: { label: "Gltf URL", options: gltfUrls },
    throttleDpr: {
      label: 'Degrade pixel ratio based on perf.',
      value: false,
    },
    maxDpr: { label: 'Max pixel ratio', value: window?.devicePixelRatio ?? 1 },
    throttleSplats: {
      label: 'Degrade splat count based on perf.',
      value: false,
    },
    maxSplats: { label: 'Max splat count', value: 10000000 },
  }) as any;

  // Performance factor
  const [factor, setFactor] = useState(1);

  // Downsample pixels if perf gets bad
  // const [dpr, setDpr] = useState(maxDpr);
  const dpr = Math.min(maxDpr, Math.round(0.5 + 1.5 * factor));
  const effectiveDpr = throttleDpr ? Math.min(maxDpr, dpr) : maxDpr;

  // Downsample splats if perf gets bad
  const [splats, setSplats] = useState(maxSplats);
  // const splats =
  const effectiveSplats = throttleSplats
    ? Math.min(maxSplats, splats)
    : maxSplats;

  const splatScale = 2.7 as number;
  const splatPos = [12.1 + 0, 19.3, -1.0] as [number, number, number];
  const splatRot = [-0.516, 0.15, 0.1] as [number, number, number];

  return (
    <>
      <Leva oneLineLabels collapsed />
      <Canvas
        className="h-full w-full bg-black"
        gl={{ antialias: false }}
        dpr={effectiveDpr}
      >
        <PerformanceMonitor
          ms={250}
          iterations={1}
          step={1}
          onIncline={({ factor }) => {
            setFactor(factor);
            setSplats(() =>
              Math.min(
                maxSplats,
                Math.round((0.9 + 0.2 * factor) * effectiveSplats)
              )
            );
          }}
          onDecline={({ factor }) => {
            setFactor(factor);
            setSplats(() =>
              Math.min(
                maxSplats,
                Math.round((0.9 + 0.2 * factor) * effectiveSplats)
              )
            );
          }}
        />

        

        <OrbitControls rotateSpeed={0.2}/>

        
        <axesHelper args={[5]} />
        <gridHelper />

        {gltfUrl && <Suspense fallback={null}>
          <group position={[2, 0, 0]} rotation={[0, 0, 0]}  >
            <Gltf src={gltfUrl} />
          </group>
        </Suspense>}

        {splatUrl && <group position={splatPos} rotation={splatRot} scale={[splatScale, splatScale, splatScale]} >
          <Splat url={splatUrl} maxSplats={effectiveSplats} />
        </group>}
        <Environment preset="city" />
      </Canvas>
      
    </>
  );
}

export default App;

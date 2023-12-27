import {
  OrbitControls,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Splat } from './splat-object';
import { Leva, useControls } from 'leva';
import url from './basura1.splat';

const splatUrls = [
  url,
] as const;

function App() {
  // On screen controls
  const { splatUrl, maxDpr } = useControls({
    splatUrl: { label: 'Splat URL', options: splatUrls },
    throttleSplats: {
      label: 'Degrade splat count based on perf.',
      value: false,
    },
    maxSplats: { label: 'Max splat count', value: 1000000 },
  }) as any;

  // Performance factor
  

  // Downsample pixels if perf gets bad
  // const [dpr, setDpr] = useState(maxDpr);
  const dpr = Math.min(maxDpr, Math.round(0.5 + 1.5 * 1));
  const effectiveDpr = false ? Math.min(maxDpr, dpr) : maxDpr;


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

        <OrbitControls rotateSpeed={0.2}/>

        
        {/* <axesHelper args={[5]} />
        <gridHelper /> */}

        {splatUrl && <group position={splatPos} rotation={splatRot} scale={[splatScale, splatScale, splatScale]} >
          <Splat url={splatUrl} maxSplats={500000} />
        </group>}
        
      </Canvas>
      
    </>
  );
}

export default App;

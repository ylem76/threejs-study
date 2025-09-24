import * as THREE from 'three';
import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import {
  Canvas,
  extend,
  useThree,
  useLoader,
  useFrame,
} from '@react-three/fiber';

import { OrbitControls, Sky, Stars, useGLTF } from '@react-three/drei';
import { Water } from 'three-stdlib';

extend({ Water });

const MoonModel = () => {
  return (
    <mesh position={[-100, 100, -1000]}>
      <sphereGeometry args={[25, 32, 32]} /> {/* 반지름 크게 */}
      <meshStandardMaterial
        color='#fdfbd3'
        emissive='#fdfbd3'
        emissiveIntensity={1.5}
      />
    </mesh>
  );
};
function IslandModel() {
  // 등대섬
  const { scene, materials } = useGLTF(
    `${import.meta.env.BASE_URL}/models/island.glb`
  );

  useEffect(() => {
    // scene의 모든 child에 castShadow 적용
    // scene.traverse는 씬 그래프 전체를 순회
    scene.traverse((child) => {
      child.receiveShadow = true;
    });
  }, [scene]);

  return <primitive object={scene} position={[0, -1.5, 0]} />;
}

function LightHouseModel() {
  // 등대
  const { scene, materials } = useGLTF(
    `${import.meta.env.BASE_URL}/models/lighthouse.glb`
  );

  useEffect(() => {
    // scene의 모든 child에 castShadow 적용
    // scene.traverse는 씬 그래프 전체를 순회
    scene.traverse((child) => {
      child.castShadow = true;
    });
  }, [scene]);

  return <primitive object={scene} position={[0, -1.5, 0]} />;
}

function Ocean() {
  const ref = useRef<any>(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
    THREE.TextureLoader,
    `${import.meta.env.BASE_URL}/textures/waternormals.jpg`
  );
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      // format: gl.encoding
    }),
    [waterNormals]
  );
  useFrame(
    (state, delta) => (ref.current.material.uniforms.time.value += delta)
  );
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
}

function HouseModel() {
  // glb 파일 로드
  // scene : 3d모델 전체
  // materials : 모델 안에서 사용된 머티리얼 모음

  const { scene, materials } = useGLTF(
    `${import.meta.env.BASE_URL}/models/house.glb`
  );
  console.log('materials', materials);

  useEffect(() => {
    // materials 중 창문(window) material을 가져와 발광 설정
    const win = materials.window as THREE.MeshPhysicalMaterial;
    win.emissive = new THREE.Color('orange');
    win.emissiveIntensity = 0.1;
    win.color = new THREE.Color('white');
    win.transparent = true;
    win.transmission = 1; // 1 = 완전한 투명 유리
    win.thickness = 0.1; // 유리 두께
    win.roughness = 0; // 표면 거칠기
    win.metalness = 0; // 금속성
    win.ior = 1.5; // 굴절률 (유리=1.5 정도)
  }, [materials]);

  useEffect(() => {
    // scene의 모든 child에 castShadow 적용
    // scene.traverse는 씬 그래프 전체를 순회
    scene.traverse((child) => {
      child.castShadow = true;
    });
  }, [scene]);

  return <primitive object={scene} position={[0, -1.5, 0]} />;
}

function DebugCamera() {
  const { camera, controls } = useThree() as {
    camera: THREE.PerspectiveCamera;
    controls: OrbitControlsImpl;
  };

  useEffect(() => {
    const log = () => {
      console.log('camera.position', camera.position.toArray());
      console.log('controls.target', controls?.target.toArray());
    };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        // p키 누르면 콘솔에 찍기
        log();
      }
    });

    return () => window.removeEventListener('keydown', log);
  }, [camera, controls]);

  return null;
}

export default function App() {
  return (
    <Canvas
      camera={{
        position: [10.930983937456272, 8.773521034162675, 17.631544584569394],
        fov: 55,
        near: 1,
        far: 20000,
      }}>
      <color attach='background' args={['#100c4f']} />
      <Stars
        radius={100} // 별이 퍼질 반경
        depth={50} // 별깊이
        count={5000} // 별 개수
        factor={4} // 크기
        saturation={0}
        fade
      />
      <ambientLight intensity={0.1} />

      {/* 달빛 표현 */}
      <directionalLight
        position={[30, 40, -50]} // 달이 있는 쪽에서 비추도록
        intensity={0.3} // 밝기 (낮보다 훨씬 낮게)
        color='#b0c4de' // 약간 푸른빛 (달빛 느낌)
      />
      <pointLight decay={0} position={[100, 100, 100]} />
      <pointLight decay={0.5} position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        {/* 달 모델 */}
        <MoonModel />

        {/* 섬 모델 */}
        <IslandModel />
        {/* 등대모델 */}
        <LightHouseModel />
        <Ocean />
      </Suspense>
      {/* <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} /> */}
      <OrbitControls />
    </Canvas>
  );
}

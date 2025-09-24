// react-three-fiber : three.js를 react 방식으로 사용할 수 있게
// Canvas : 내부적으로 Scene, Renderer, Camera 자동 설정
// useFrame : 매 프레임마다 실행되는 함수 등록
// requestAnimationFrame과 유사
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// three.js에서 제공하는 유틸리티 모음
// OrbitControls : 마우스로 카메라 제어하는 조작 로직 컴포넌트
// camera와 gl.domElement를 자동으로 받아서
// Three.js의 OrbitControls 인스턴스를 만들고
// useFrame()으로 매 프레임마다 카메라를 업데이트함
// 마우스/터치 이벤트를 감지해서 카메라 조작을 트리거함
import { Bounds, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Sky } from '@react-three/drei';
import { Stars } from '@react-three/drei';
// import { Water } from 'three-stdlib';
import { extend } from '@react-three/fiber';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import { Ocean } from './components/Ocean';

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

function RotatingBox() {
  // three.js의 mesh 인스턴스에 접근하기 위해 ref를 사용해서 참조
  //null! : 절대 null이 아니라고 ts에 명시
  const ref = useRef<THREE.Mesh>(null!);

  // useFrame은 Canvas내부(three.js context 내부에서만 동작)
  // useFrame에서는 state와 delta 값을 인자로 받는데,
  // state 내부에는 또다시 camera, clock, mouse, scene, size, viewport등이 있다
  // delta : 이전 프레임과의 시간차(초단위)
  useFrame((_, delta) => {
    // 내부의 코드는 매 프레임마다 호출됨
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta;
  });

  return (
    <mesh ref={ref}>
      {/* 실제 지오메트리 */}
      <boxGeometry />
      {/* 마테리얼 인스턴스 */}
      <meshStandardMaterial color='tomato' />
    </mesh>
  );
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
      shadows
      camera={{
        position: [10.930983937456272, 8.773521034162675, 17.631544584569394],
        fov: 50,
      }}
      style={{ height: '100vh', width: '100vw' }}>
      {/* <Sky
        distance={60000}
        sunPosition={[0, -1, 0]} // 태양을 아래로 (밤 효과)
        inclination={0}
        azimuth={0.2}
      /> */}

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

      {/* 안개 */}
      {/* <fog attach='fog' args={['#999', 10, 200]} /> */}

      {/* <fogExp2 attach='fog' args={['#fff', 0.01]} /> */}

      {/* 달 모델 */}
      <MoonModel />

      {/* 섬 모델 */}
      <IslandModel />
      {/* 등대모델 */}
      <LightHouseModel />
      {/* 물 */}
      <Suspense fallback={null}>
        <Ocean />
      </Suspense>

      <OrbitControls target={[0, 5, 0]} />
      <DebugCamera />
    </Canvas>
  );
}

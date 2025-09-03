// react-three-fiber : three.js를 react 방식으로 사용할 수 있게
// Canvas : 내부적으로 Scene, Renderer, Camera 자동 설정
// useFrame : 매 프레임마다 실행되는 함수 등록
// requestAnimationFrame과 유사
import { Canvas, useFrame } from '@react-three/fiber';

// three.js에서 제공하는 유틸리티 모음
// OrbitControls : 마우스로 카메라 제어하는 조작 로직 컴포넌트
// camera와 gl.domElement를 자동으로 받아서
// Three.js의 OrbitControls 인스턴스를 만들고
// useFrame()으로 매 프레임마다 카메라를 업데이트함
// 마우스/터치 이벤트를 감지해서 카메라 조작을 트리거함
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

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
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}/models/house.glb`);
  return <primitive object={scene} />;
}

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      style={{ height: '100vh', width: '100vw' }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[2, 3, 1]} intensity={1.5} />

      {/* 집 모델 */}
      <HouseModel />
      <OrbitControls />
    </Canvas>
  );
}

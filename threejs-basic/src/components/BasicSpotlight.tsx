import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';

export function BasicSpotlight() {
  const spotlightRef = useRef<THREE.SpotLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);
  const { scene } = useThree();

  // SpotLight는 target을 반드시 scene에 붙여야 함
  useEffect(() => {
    if (spotlightRef.current && targetRef.current) {
      spotlightRef.current.target = targetRef.current;
      scene.add(spotlightRef.current.target);
    }
  }, [scene]);

  return (
    <>
      {/* 빛 */}
      <spotLight
        ref={spotlightRef}
        position={[5, 10, 5]} // 스포트라이트 위치
        angle={Math.PI / 6} // 빛이 퍼지는 각도
        penumbra={0.3} // 가장자리 부드럽게
        intensity={5} // 빛 세기
        distance={50} // 닿는 거리
        color={'#ffffff'} // 흰색 빛
        castShadow
      />
      {/* 빛이 향하는 target 지점 */}
      <object3D ref={targetRef} position={[0, 0, 0]} />

      {/* 바닥 */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color='gray' />
      </mesh>

      {/* 테스트용 박스 */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color='red' />
      </mesh>
    </>
  );
}

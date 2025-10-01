import { SpotLight } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function LighthouseLight() {
  const lightRef = useRef<THREE.SpotLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);
  const { scene } = useThree();

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
      scene.add(lightRef.current.target);
    }
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (targetRef.current) {
      // 원형 궤도로 target 이동 → 빛 방향만 회전
      const radius = 50; // 회전 반경
      targetRef.current.position.set(
        Math.sin(t) * radius, // x축 원운동
        0, // 높이 (고정)
        Math.cos(t) * radius // z축 원운동
      );
    }
  });

  return (
    <>
      <SpotLight
        ref={lightRef}
        castShadow
        penumbra={1}
        distance={500}
        angle={10} // 빛 퍼짐 각도
        attenuation={5}
        anglePower={8}
        intensity={1000}
        color={'#fffbe6'}
        position={[-8.5, 8.5, -5]} // 등대 꼭대기 위치 기준
      />

      {/* 👇 타겟 지정 (빛이 쏘이는 방향) */}
      <object3D ref={targetRef} position={[10, 0, 0]} />
    </>
  );
}

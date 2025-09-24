import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { extend } from '@react-three/fiber';
import { Water } from 'three-stdlib';

extend({ Water });

export const Ocean = () => {
  const waterNormals = useLoader(
    THREE.TextureLoader,
    `${import.meta.env.BASE_URL}/textures/waternormals.jpg`
  );
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const waterRef = useRef<THREE.Mesh>(null!);

  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xaaaaee, // 흐린 달빛
      waterColor: 0x000814, // 진한 밤바다 색
      distortionScale: 2.0, // 물결 왜곡 적당히
      fog: true,
    }),
    [waterNormals]
  );

  useEffect(() => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms && mat.uniforms['sunDirection']) {
        mat.uniforms['sunDirection'].value.set(1, 1, 1);
      }
    }
  }, []);

  useEffect(() => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.time) {
        mat.uniforms.time.value = 0; // 초기화
      }
    }
  }, []);

  useFrame((_, delta) => {
    const mat = waterRef.current?.material as THREE.ShaderMaterial | undefined;
    mat?.uniforms?.['time']?.value !== undefined &&
      (mat.uniforms['time'].value += delta * 0.2);
  });

  return (
    <water
      ref={waterRef}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
    />
  );
};

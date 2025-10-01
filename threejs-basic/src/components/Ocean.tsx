import * as THREE from 'three';
import React, { Suspense, useRef, useMemo } from 'react';
import {
  Canvas,
  extend,
  useThree,
  useLoader,
  useFrame,
} from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Water } from 'three-stdlib';

extend({ Water });

export function Ocean() {
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
      sunColor: 0xaaaaaa,
      waterColor: 0x001020,
      distortionScale: 3.7,
      fog: true,
      // format: gl.encoding
    }),
    [waterNormals]
  );
  useFrame(
    (state, delta) => (ref.current.material.uniforms.time.value += delta * 0.1)
  );
  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      receiveShadow
    />
  );
}

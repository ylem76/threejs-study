import { Water } from 'three/examples/jsm/objects/Water2';

declare module '@react-three/fiber' {
  interface ThreeElements {
    water: ReactThreeFiber.Object3DNode<Water, typeof Water>;
  }
}

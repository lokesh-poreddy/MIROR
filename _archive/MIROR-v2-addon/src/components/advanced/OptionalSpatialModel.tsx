"use client";

// Optional: requires `three`, `@react-three/fiber` and `@react-three/drei`.
// Keep this component out of the default critical path until a real engineering
// model/visualization has business value.

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Structure() {
  const mesh = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.08;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.035;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.2}>
      <mesh ref={mesh} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.65, 1.2]} />
        <meshStandardMaterial color="#8e7140" metalness={0.5} roughness={0.46} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.25, 0.82]} />
        <meshStandardMaterial color="#c6c1b6" metalness={0.25} roughness={0.6} />
      </mesh>
    </Float>
  );
}

export function OptionalSpatialModel() {
  return <div style={{ height: 520 }}><Canvas camera={{ position: [4, 2.8, 5], fov: 38 }} dpr={[1, 1.5]} shadows><ambientLight intensity={0.7} /><directionalLight position={[3, 4, 2]} intensity={2.1} castShadow /><Structure /><Environment preset="city" /><OrbitControls enablePan={false} minDistance={4} maxDistance={8} /></Canvas></div>;
}

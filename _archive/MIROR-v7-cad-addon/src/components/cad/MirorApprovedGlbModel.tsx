"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { canUseOnProjectPage, type ModelRecord } from "@/lib/miror-cad-model-registry";

export type MirorApprovedGlbModelProps = {
  model: ModelRecord;
  projectSlug: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
};

function SceneAsset({ model, scale, position, rotation, opacity }: Omit<MirorApprovedGlbModelProps, "projectSlug"> & { url: string }) {
  const gltf = useGLTF(model.url as string);
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material;
      const materials = Array.isArray(material) ? material : [material];
      materials.forEach((entry) => {
        const next = entry.clone() as THREE.Material & { transparent?: boolean; opacity?: number; depthWrite?: boolean };
        if (typeof opacity === "number") {
          next.transparent = opacity < 1;
          next.opacity = opacity;
          next.depthWrite = opacity > 0.96;
        }
        mesh.material = Array.isArray(material) ? materials.map(() => next) : next;
      });
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    return cloned;
  }, [gltf.scene, opacity]);

  useEffect(() => {
    return () => {
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material.dispose());
      });
    };
  }, [scene]);

  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
}

function LoadingCard() {
  return <Html center><div className="miror-cad-model-loading-card"><span>LOADING MODEL</span><b>STRUCTURE / GLB</b></div></Html>;
}

function ErrorCard() {
  return <Html center><div className="miror-cad-model-error-card"><span>MODEL UNAVAILABLE</span><b>PROCEDURAL FALLBACK ACTIVE</b></div></Html>;
}

export default function MirorApprovedGlbModel(props: MirorApprovedGlbModelProps) {
  const { model, projectSlug } = props;
  if (!model.url || !canUseOnProjectPage(model) || model.projectSlug !== projectSlug) return null;
  return (
    <Suspense fallback={<LoadingCard />}>
      <ErrorBoundary fallback={<ErrorCard />}>
        <SceneAsset {...props} url={model.url} />
      </ErrorBoundary>
    </Suspense>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? this.props.fallback : this.props.children; }
}

export const MIROR_APPROVED_GLB_VERSION = "7.0.0";

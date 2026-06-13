"use client";

import { Canvas } from "@react-three/fiber";
import { Float, RoundedBox, Torus, Cylinder } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

export default function HeroScene() {
  const [shouldRender3D, setShouldRender3D] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isMobile && !prefersReducedMotion) {
      setShouldRender3D(true);
    }
  }, []);

  if (!shouldRender3D) {
    return (
      <div className="flex items-center justify-center w-full h-full opacity-80">
        <Shield className="w-16 h-16 text-[var(--accent-indigo)]" />
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
        <group rotation={[0, -Math.PI / 6, 0]}>
          {/* Padlock Base */}
          <RoundedBox args={[1.8, 1.4, 0.6]} radius={0.15} smoothness={4} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#3D5AFE" roughness={0.6} metalness={0.1} />
          </RoundedBox>
          {/* Keyhole */}
          <Cylinder args={[0.15, 0.15, 0.61, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color="#F5F1E8" roughness={0.8} metalness={0} />
          </Cylinder>
          <RoundedBox args={[0.15, 0.4, 0.61]} radius={0.05} position={[0, -0.45, 0]}>
            <meshStandardMaterial color="#F5F1E8" roughness={0.8} metalness={0} />
          </RoundedBox>
          {/* Lock Hoop */}
          <Torus args={[0.6, 0.15, 16, 32, Math.PI]} position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.1} />
          </Torus>
          <Cylinder args={[0.15, 0.15, 0.4]} position={[-0.6, 0.1, 0]}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.1} />
          </Cylinder>
          <Cylinder args={[0.15, 0.15, 0.4]} position={[0.6, 0.1, 0]}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.1} />
          </Cylinder>
        </group>
      </Float>
    </Canvas>
  );
}

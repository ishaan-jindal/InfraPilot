"use client";

import { Canvas } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Server } from "lucide-react";

export default function DeployScene() {
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
      <div className="flex justify-center gap-8 items-center h-full">
        <Server className="w-8 h-8 text-[var(--accent-indigo)]" />
        <Server className="w-8 h-8 text-[#E9C46A]" />
        <Server className="w-8 h-8 text-[var(--accent-indigo)]" />
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ width: "100%", height: "120px" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      
      {/* Cube 1 */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={[-2.5, 0, 0]}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#3D5AFE" roughness={0.5} metalness={0.1} />
        </RoundedBox>
      </Float>

      {/* Cube 2 */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5} position={[0, -0.2, 0]}>
        <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.1} smoothness={4} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} metalness={0.1} />
        </RoundedBox>
      </Float>

      {/* Cube 3 */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8} position={[2.5, 0.1, 0]}>
        <RoundedBox args={[0.7, 0.7, 0.7]} radius={0.1} smoothness={4} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#F5F1E8" roughness={0.6} metalness={0} />
        </RoundedBox>
      </Float>
    </Canvas>
  );
}

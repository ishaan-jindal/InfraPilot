"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Box, Html } from "@react-three/drei";
import * as THREE from "three";
import { ShieldCheck, Box as BoxIcon } from "lucide-react";

function ServerUnit({ position, delay = 0 }: { position: [number, number, number], delay?: number }) {
  const ledRef = useRef<THREE.Mesh>(null);
  const time = useRef(delay);

  useFrame((_, delta) => {
    time.current += delta;
    if (ledRef.current) {
      // Blinking LED effect
      const intensity = Math.sin(time.current * 5) > 0 ? 0.8 : 0.2;
      (ledRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <group position={position}>
      {/* Main Server Chassis */}
      <Box args={[3, 0.4, 2]}>
        <meshStandardMaterial color="#F7F8FA" roughness={0.1} metalness={0.8} />
      </Box>
      {/* Dark front panel */}
      <Box args={[2.8, 0.3, 0.1]} position={[0, 0, 1]}>
        <meshStandardMaterial color="#1B2430" roughness={0.4} />
      </Box>
      {/* Blinking LED */}
      <mesh ref={ledRef} position={[-1.2, 0, 1.06]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function FloatingElement({ position, icon: Icon, color, delay }: { position: [number, number, number], icon: any, color: string, delay: number }) {
  return (
    <Float position={position} speed={0.5} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        <Html transform center distanceFactor={5} zIndexRange={[100, 0]}>
          <div className="bg-white dark:bg-[#161C24] p-1.5 rounded border border-[#E2E8F0] dark:border-[#2D3748] shadow-sm flex items-center justify-center">
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

export default function ServerRackScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [5, 4, 6], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <group position={[0, -1, 0]}>
          <ServerUnit position={[0, 0, 0]} delay={0} />
          <ServerUnit position={[0, 0.6, 0]} delay={0.5} />
          <ServerUnit position={[0, 1.2, 0]} delay={1.2} />
          <ServerUnit position={[0, 1.8, 0]} delay={2.1} />
        </group>

        {/* Floating Icons */}
        <FloatingElement position={[-2, 1, 1]} icon={BoxIcon} color="#3B82F6" delay={0} />
        <FloatingElement position={[2.5, 2, 0]} icon={BoxIcon} color="#3B82F6" delay={1} />
        <FloatingElement position={[0, 3, 1]} icon={ShieldCheck} color="#00B894" delay={2} />
        
      </Canvas>
    </div>
  );
}

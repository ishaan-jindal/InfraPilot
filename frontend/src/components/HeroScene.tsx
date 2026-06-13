"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";
import * as THREE from "three";

function FlowingLine({ start, end, color = "#3B82F6", delay = 0 }: { start: [number, number, number], end: [number, number, number], color?: string, delay?: number }) {
  const lineRef = useRef<any>(null);
  const [active, setActive] = useState(false);
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    if (time.current > delay && !active) {
      setActive(true);
    }
    if (active && lineRef.current) {
      // Simulate dashed flowing effect
      lineRef.current.material.dashOffset -= delta * 2;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color={active ? color : "#8B95A8"}
      lineWidth={1.5}
      dashed={true}
      dashScale={5}
      dashSize={0.2}
      dashOffset={0}
      transparent
      opacity={active ? 0.8 : 0.2}
    />
  );
}

function Node({ position, label, color = "#FFFFFF", type = "standard", active = false }: { position: [number, number, number], label: string, color?: string, type?: "repo" | "target" | "standard", active?: boolean }) {
  const glowIntensity = active ? 0.5 : 0;
  
  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2} position={position}>
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={active ? color : "#000000"} 
          emissiveIntensity={glowIntensity}
          roughness={0.2} 
          metalness={0.8} 
        />
        <Html transform center distanceFactor={10} position={[0, -0.6, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] px-3 py-1.5 rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] whitespace-nowrap relative">
            <span className="font-mono text-xs font-semibold text-[var(--color-text-primary)] relative z-10">{label}</span>
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function BranchScanner({ end, color, delay = 0 }: { end: [number, number, number], color: string, delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = ((state.clock.elapsedTime + delay) % 2) / 2; // 0 to 1 over 2 seconds
    
    // Interpolate from center [0,0,0] to target
    meshRef.current.position.x = end[0] * t;
    meshRef.current.position.y = end[1] * t;
    meshRef.current.position.z = end[2] * t;
    
    // Make the plate perpendicular to the line of travel
    const angle = Math.atan2(end[1], end[0]);
    meshRef.current.rotation.z = angle + Math.PI / 2;
    
    // Fade in and out
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    if (t < 0.1) material.opacity = t * 6;
    else if (t > 0.9) material.opacity = (1 - t) * 6;
    else material.opacity = 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.6, 0.05, 0.2]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Node position={[0, 0, 0]} label="github.com/you/app" type="repo" active={true} />
        
        {/* Targets (Circle around center) */}
        <Node position={[-2.2, 2.2, 0]} label="AWS EC2" color="#3B82F6" type="target" active={true} />
        <Node position={[2.2, 2.2, 0]} label="Oracle Cloud" color="#10B981" type="target" active={true} />
        <Node position={[-2.2, -2.2, 0]} label="DigitalOcean" color="#3B82F6" type="target" active={true} />
        <Node position={[2.2, -2.2, 0]} label="Raspberry Pi" color="#10B981" type="target" active={true} />

        {/* Connections */}
        <FlowingLine start={[0, 0, 0]} end={[-2.2, 2.2, 0]} delay={0} color="#3B82F6" />
        <FlowingLine start={[0, 0, 0]} end={[2.2, 2.2, 0]} delay={0} color="#10B981" />
        <FlowingLine start={[0, 0, 0]} end={[-2.2, -2.2, 0]} delay={0} color="#3B82F6" />
        <FlowingLine start={[0, 0, 0]} end={[2.2, -2.2, 0]} delay={0} color="#10B981" />

        {/* Branch Scanners */}
        <BranchScanner end={[-2.2, 2.2, 0]} color="#3B82F6" delay={0} />
        <BranchScanner end={[2.2, 2.2, 0]} color="#10B981" delay={0} />
        <BranchScanner end={[-2.2, -2.2, 0]} color="#3B82F6" delay={0} />
        <BranchScanner end={[2.2, -2.2, 0]} color="#10B981" delay={0} />
      </Canvas>
    </div>
  );
}

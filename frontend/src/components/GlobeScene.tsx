"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Icosahedron, Html } from "@react-three/drei";
import * as THREE from "three";

function Node({ position, label, onClick, active }: { position: [number, number, number], label: string, onClick: () => void, active: boolean }) {
  const [hovered, setHovered] = useState(false);
  const color = active ? "#00B894" : hovered ? "#3B82F6" : "#8B95A8";
  
  return (
    <group position={position}>
      <mesh 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {active && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-2 rounded shadow-md w-48 text-xs font-mono -translate-x-1/2 -translate-y-[120%] pointer-events-none">
            <div className="font-bold text-[var(--color-text-primary)] mb-1">{label}</div>
            <div className="text-[var(--color-text-secondary)]">Deploys via SSH. Configures Docker, HTTPS & security checks.</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function WireframeGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  useFrame(() => {
    if (globeRef.current && activeNode === null) {
      globeRef.current.rotation.y += 0.001; // slow continuous rotation when idle
    }
  });

  const nodes = [
    { id: 0, label: "AWS EC2 (us-east)", pos: [1.2, 0.8, 1.2] },
    { id: 1, label: "Oracle Cloud (eu-frankfurt)", pos: [0.5, 1.2, -1.3] },
    { id: 2, label: "Azure (asia-east)", pos: [-1.4, -0.2, 1.0] },
    { id: 3, label: "DigitalOcean (lon1)", pos: [0.8, -1.0, 1.4] },
    { id: 4, label: "Hetzner (fsn1)", pos: [-0.3, 1.5, 0.8] },
    { id: 5, label: "Home Lab (Raspberry Pi)", pos: [-0.6, -1.4, -1.0] }
  ];

  return (
    <group ref={globeRef}>
      {/* The Globe */}
      <Icosahedron args={[2, 2]}>
        <meshBasicMaterial color="#8B95A8" wireframe opacity={0.2} transparent />
      </Icosahedron>

      {/* Infrastructure Nodes */}
      {nodes.map((n) => (
        <Node 
          key={n.id}
          position={n.pos as [number, number, number]} 
          label={n.label} 
          onClick={() => setActiveNode(n.id)}
          active={activeNode === n.id}
        />
      ))}
    </group>
  );
}

export default function GlobeScene() {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        <WireframeGlobe />
      </Canvas>
    </div>
  );
}

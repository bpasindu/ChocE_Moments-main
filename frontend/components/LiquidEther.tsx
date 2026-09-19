import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

const LiquidEther: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Chocolate-themed fluid simulation
    const colors = ['#C7A07A', '#A44529', '#734128']; // Bronze, Burgundy, Brown
    
    const container = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Create animated gradient blobs
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(colors[0]) },
        color2: { value: new THREE.Color(colors[1]) },
        color3: { value: new THREE.Color(colors[2]) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          
          float d1 = length(p - vec2(sin(time * 0.5) * 0.5, cos(time * 0.3) * 0.5));
          float d2 = length(p - vec2(cos(time * 0.4) * 0.6, sin(time * 0.6) * 0.4));
          float d3 = length(p - vec2(sin(time * 0.7) * 0.4, cos(time * 0.5) * 0.6));
          
          float blob1 = smoothstep(0.8, 0.0, d1);
          float blob2 = smoothstep(0.9, 0.0, d2);
          float blob3 = smoothstep(0.7, 0.0, d3);
          
          vec3 color = color1 * blob1 + color2 * blob2 + color3 * blob3;
          float alpha = (blob1 + blob2 + blob3) * 0.5;
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="liquid-ether-container" />;
};

export default LiquidEther;


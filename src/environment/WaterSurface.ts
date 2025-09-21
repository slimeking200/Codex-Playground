import * as THREE from 'three';

export class WaterSurface {
  private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private time = 0;

  constructor(size: number, normalMap: THREE.Texture) {
    const geometry = new THREE.PlaneGeometry(size, size, 256, 256);
    const material = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uChoppiness;
        varying vec2 vUv;
        varying vec3 vNormal;

        float wave(vec2 p) {
          return sin(p.x * 3.1 + uTime * 0.3) * 0.15 + sin(p.y * 2.8 - uTime * 0.4) * 0.1;
        }

        void main() {
          vUv = uv;
          vec3 transformed = position;
          float height = wave(uv * 8.0) + wave(uv * 16.0) * 0.4;
          transformed.z += height * uChoppiness;
          vNormal = normalize(normal + vec3(0.0, 0.0, height));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform sampler2D uNormalMap;
        uniform vec3 uWaterColor;
        uniform vec3 uSunDirection;
        uniform vec3 uSkyColor;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vec3 normalSample = texture2D(uNormalMap, vUv * 8.0 + vec2(uTime * 0.03, uTime * -0.04)).rgb;
          vec3 normal = normalize(vNormal + (normalSample.xyz * 2.0 - 1.0) * 0.3);
          float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
          float diffuse = max(dot(normal, normalize(uSunDirection)), 0.0);
          vec3 color = mix(uWaterColor, uSkyColor, fresnel) + diffuse * vec3(0.5, 0.7, 1.0);
          gl_FragColor = vec4(color, 0.9);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uChoppiness: { value: 1.5 },
        uNormalMap: { value: normalMap },
        uWaterColor: { value: new THREE.Color(0x135b7a) },
        uSkyColor: { value: new THREE.Color(0x64c8ff) },
        uSunDirection: { value: new THREE.Vector3(0.5, 1, 0.25) }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
  }

  public addToScene(scene: THREE.Scene): void {
    scene.add(this.mesh);
  }

  public update(deltaTime: number, sunDirection: THREE.Vector3): void {
    this.time += deltaTime;
    this.mesh.material.uniforms.uTime.value = this.time;
    this.mesh.material.uniforms.uSunDirection.value = sunDirection;
  }
}

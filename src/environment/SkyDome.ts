import * as THREE from 'three';

export class SkyDome {
  private mesh: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
  private material: THREE.ShaderMaterial;

  constructor(radius: number) {
    this.material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        skyColor: { value: new THREE.Color(0x73b8ff) },
        horizonColor: { value: new THREE.Color(0xf4f2d2) },
        cloudDensity: { value: 0.2 },
        fogStrength: { value: 0.05 },
        time: { value: 0 }
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 skyColor;
        uniform vec3 horizonColor;
        uniform float cloudDensity;
        uniform float fogStrength;
        uniform float time;
        varying vec3 vWorldPosition;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec3 direction = normalize(vWorldPosition);
          float elevation = max(direction.y, 0.0);
          vec3 color = mix(horizonColor, skyColor, pow(elevation, 0.35));

          float cloud = noise(direction.xz * 4.0 + time * 0.05) * noise(direction.xz * 2.0 - time * 0.03);
          cloud = smoothstep(0.35, 0.7, cloud) * cloudDensity;
          color = mix(color, vec3(1.0), cloud);

          float fog = exp(-pow(max(direction.y, 0.0), 1.5) * 6.0) * fogStrength;
          color = mix(color, vec3(0.9, 0.95, 1.0), fog);

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const geometry = new THREE.SphereGeometry(radius, 64, 32);
    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  public addToScene(scene: THREE.Scene): void {
    scene.add(this.mesh);
  }

  public getMaterial(): THREE.ShaderMaterial {
    return this.material;
  }

  public update(deltaTime: number): void {
    this.material.uniforms.time.value += deltaTime;
  }
}

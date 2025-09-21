import * as THREE from 'three';

export type LoadingCallbacks = {
  onProgress?: (progress: number, resource: string) => void;
  onComplete?: () => void;
};

export class ResourceLoader {
  private readonly loadingManager: THREE.LoadingManager;
  private readonly textureLoader: THREE.TextureLoader;
  private readonly cubeTextureLoader: THREE.CubeTextureLoader;

  constructor(private callbacks: LoadingCallbacks = {}) {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      this.callbacks.onProgress?.(itemsLoaded / itemsTotal, url);
    };
    this.loadingManager.onLoad = () => {
      this.callbacks.onComplete?.();
    };
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);
  }

  public async loadTexture(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          resolve(texture);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  public async loadCubeTexture(urls: string[]): Promise<THREE.CubeTexture> {
    return new Promise((resolve, reject) => {
      this.cubeTextureLoader.load(urls, resolve, undefined, reject);
    });
  }

  public createWaterNormalTexture(): THREE.Texture {
    const data = new Uint8Array(256 * 256 * 3);
    for (let i = 0; i < data.length; i += 3) {
      data[i] = 128 + Math.sin(i * 0.01) * 40;
      data[i + 1] = 128 + Math.cos(i * 0.015) * 40;
      data[i + 2] = 255;
    }
    const texture = new THREE.DataTexture(data, 256, 256, THREE.RGBFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }
}

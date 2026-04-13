import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 30, g: 20, b: 50 };
}

export class WebGLPageTransition {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  cameraZ = 100;
  dimension = { width: 0, height: 0, pixelRatio: 1 };
  color: { r: number; g: number; b: number };

  constructor(hexColor = "#1e1432") {
    this.color = hexToRgb(hexColor);
    this.dimension = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 1),
    };

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createGeometry();
    this.createMesh();
    this.updateMeshSize();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    const fov =
      2 * Math.atan(this.dimension.height / 2 / this.cameraZ) * (180 / Math.PI);
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.dimension.width / this.dimension.height,
      0.1,
      1000,
    );
    this.camera.position.z = this.cameraZ;
    this.scene.add(this.camera);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.domElement.id = "webgl-canvas";
    this.renderer.domElement.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
    `;
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.dimension.width, this.dimension.height);
    this.renderer.setPixelRatio(this.dimension.pixelRatio);
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
  }

  createMesh() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: new THREE.Vector3(
            this.color.r / 255,
            this.color.g / 255,
            this.color.b / 255,
          ),
        },
        uProgress: { value: 1.5 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  updateMeshSize() {
    this.mesh.scale.set(this.dimension.width, this.dimension.height, 1);
  }

  onResize() {
    this.dimension.width = window.innerWidth;
    this.dimension.height = window.innerHeight;
    this.dimension.pixelRatio = Math.min(window.devicePixelRatio, 1);

    this.camera.aspect = this.dimension.width / this.dimension.height;
    this.camera.fov =
      2 * Math.atan(this.dimension.height / 2 / this.cameraZ) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.dimension.width, this.dimension.height);
    this.renderer.setPixelRatio(this.dimension.pixelRatio);
    this.updateMeshSize();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.renderer.domElement.remove();
    this.renderer.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }
}

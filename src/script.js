import {
  Vector3,
  Matrix,
  Color4,
  Color3,
  Engine,
  Scene,
  SceneLoader,
  ArcRotateCamera,
  HemisphericLight,
  StandardMaterial,
  CreateSphere,
  ShaderMaterial,
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  StackPanel,
  Control,
  ColorPicker,
  Slider,
} from "@babylonjs/gui";
import "@babylonjs/loaders";

(function () {
  let currentPickedMesh = [];
  let currentClonedMesh = [];
  let outlineMaterial = undefined;

  // Setup
  const canvas = document.querySelector("canvas.babylon-canvas");
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(1, 1, 1, 1);

  // Camera
  const camera = new ArcRotateCamera(
    "camera",
    0,
    0,
    10,
    new Vector3(0, 0, 0),
    scene
  );
  camera.setPosition(new Vector3(0, 0, -2));
  camera.attachControl(canvas, true);

  // Light
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  // Load Model
  SceneLoader.ShowLoadingScreen = false;
  SceneLoader.ImportMesh(
    "",
    "models/",
    "FinalBaseMesh.obj",
    scene,
    (meshes) => {
      const meshMaterial = new StandardMaterial("modelMaterial", scene);
      meshMaterial.diffuseColor = new Color3(1, 0, 0);
      meshMaterial.cullBackFaces = true;
      meshMaterial.backFaceCulling = true;
      meshes.forEach((obj) => {
        if (obj._isMesh) {
          obj.material = meshMaterial;
        }
      });
    }
  );

  // Geometry
  for (let i = 0; i < 20; i++) {
    const sphere = CreateSphere("sphere" + i, {}, scene);
    const mat = new StandardMaterial("sim" + i, scene);
    mat.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
    sphere.material = mat;

    sphere.position.x = Math.random() * 4 - 2;
    sphere.position.y = Math.random() * 4 - 2;
    sphere.position.z = Math.random() * 4 - 2;

    const scaler = Math.random() * 0.3 + 0.1;
    sphere.scaling.multiply(scaler);
  }

  // Picking
  scene.onPointerMove = () => {
    const ray = scene.createPickingRay(
      scene.pointerX,
      scene.pointerY,
      Matrix.Identity(),
      camera,
      false
    );

    const hit = scene.pickWithRay(ray);

    if (hit.hit) {
      if (
        currentPickedMesh.length &&
        currentPickedMesh[0].id === hit.pickedMesh.id
      )
        return;

      clearOutline();
      currentPickedMesh.push(hit.pickedMesh);
      drawOutline(hit.pickedMesh);
      return;
    }

    clearOutline();
  };

  const clearOutline = function () {
    currentPickedMesh = [];

    if (currentClonedMesh.length) {
      currentClonedMesh.forEach((obj) => {
        obj.dispose(true);
      });
      currentClonedMesh = [];
    }
  };

  const drawOutline = function (mesh) {
    const outline = mesh.clone();

    if (!outlineMaterial) {
      outlineMaterial = createOutlineMaterial();
    }

    outline.material = outlineMaterial;
    currentClonedMesh.push(outline);
  };

  const createOutlineMaterial = function () {
    let color = new Color3(0, 0, 0);
    let thickness = 0.02;

    const outlineMaterial = new ShaderMaterial(
      "outlineMaterial",
      scene,
      "./Shaders/Outline/outline",
      {
        attributes: ["position", "normal"],
        uniforms: ["worldViewProjection", "u_thickness", "u_color"],
      }
    );
    outlineMaterial.cullBackFaces = false;
    outlineMaterial.backFaceCulling = true;
    outlineMaterial.setFloat("u_thickness", thickness);
    outlineMaterial.setColor3("u_color", color);

    // Debug UI
    var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "UI",
      true,
      scene
    );

    const panel = new StackPanel();
    panel.width = "200px";
    panel.isVertical = true;
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel);

    const outlineColorPicker = new ColorPicker();
    outlineColorPicker.value = color;
    outlineColorPicker.onValueChangedObservable.add((value) => {
      outlineMaterial.setColor3("u_color", value);
      color = value;
    });
    panel.addControl(outlineColorPicker);

    const outlineThicknessSlider = new Slider();
    outlineThicknessSlider.minimum = 0.02;
    outlineThicknessSlider.maximum = 0.1;
    outlineThicknessSlider.value = thickness;
    outlineThicknessSlider.height = "20px";
    outlineThicknessSlider.width = "150px";
    outlineThicknessSlider.color = "#003399";
    outlineThicknessSlider.background = "grey";
    outlineThicknessSlider.onValueChangedObservable.add(function (value) {
      outlineMaterial.setFloat("u_thickness", value);
      thickness = value;
    });
    panel.addControl(outlineThicknessSlider);

    return outlineMaterial;
  };

  // Handle Canvas Resize
  window.addEventListener("resize", () => {
    engine.resize();
  });

  // Game Loop
  engine.runRenderLoop(() => {
    scene.render();
  });
})();

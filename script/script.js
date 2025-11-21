const SceneView = await $arcgis.import("@arcgis/core/views/SceneView.js");
const WebScene = await $arcgis.import("@arcgis/core/WebScene.js");
const SceneLayer = await $arcgis.import("@arcgis/core/layers/SceneLayer.js");
const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
const TileLayer = await $arcgis.import("@arcgis/core/layers/TileLayer.js");
const VectorTileLayer = await $arcgis.import("@arcgis/core/layers/VectorTileLayer.js");
const Basemap = await $arcgis.import("@arcgis/core/Basemap.js");
const FeatureFilter = await $arcgis.import("@arcgis/core/layers/support/FeatureFilter.js");
const Compass = await $arcgis.import("@arcgis/core/widgets/Compass.js");
const reactiveUtils = await $arcgis.import("@arcgis/core/core/reactiveUtils.js");

const Graphic = await $arcgis.import("@arcgis/core/Graphic.js");
const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");
const Mesh = await $arcgis.import("@arcgis/core/geometry/Mesh.js");
const Point = await $arcgis.import("@arcgis/core/geometry/Point.js");
const SpatialReference = await $arcgis.import("@arcgis/core/geometry/SpatialReference.js");
const meshUtils = await $arcgis.import("@arcgis/core/geometry/support/meshUtils.js");
const FillSymbol3DLayer = await $arcgis.import("@arcgis/core/symbols/FillSymbol3DLayer.js");
const MeshSymbol3D = await $arcgis.import("@arcgis/core/symbols/MeshSymbol3D.js");
const MeshMaterial = await $arcgis.import("@arcgis/core/geometry/support/MeshMaterial.js");
const MeshLocalVertexSpace = await $arcgis.import("@arcgis/core/geometry/support/MeshLocalVertexSpace.js");

/***Send images to modal and launch***/

$('.app-image').click(function (e) {
  let location = $(e.target).attr('src')
  let caption = $(e.target).attr('data-caption')
  $('#neatModalImg').attr('src', location);
  $('#img-modal').fadeIn(500);
  $('#img-caption').html(caption);
});

/***Fade in Splash Screen on Load***/

$(document).ready(function(){
    $(".splash-container")
    .css("display", "flex")
    .hide()
    .fadeIn();
});

//Splash button initially disabled until DC Buildings layer loads

const splashButton = document.querySelector(".splash-btn");

splashButton.disabled = true;

// /***Close Splash Screen***/

$('.splash-btn').click(function () {
    $('.splash-container').fadeOut(700);
    view.goTo({
        position: {
          spatialReference: {
            // latestWkid: 3857,
            wkid: 3857
          },
           x: -8577663.253492767,
          y: 4705478.411412261,
          z: 151.3735215915367
        },
        heading: 79.01463482473405,
        tilt: 81.57362053851135
    }, {
      duration: 7000
    });
    startIntroAnimation();
})

/***Open Tour Pane***/

let toggle = 1;

$('#tour-btn').click(function () {
  if (toggle == 1) {
    
    toggle = 0;
    $('.tour-panel').fadeIn(700);
    $('.tour-btn').addClass('on');

    view.goTo({
        position: {
          spatialReference: {
            // latestWkid: 3857,
            wkid: 3857
          },
          x: -8577004.779774044,
          y: 4705667.843296814,
          z: 10.543300992809236
        },
        heading: 83.59418325714013,
        tilt: 84.22649756027022
    }, {
      duration: 3000
    });

    graphicsLayer.graphics.forEach(g => {
        if (g !== imageOneGraphic) {
          g.visible = false;
        } else {
          imageOneGraphic.visible = true;
        }
    });

  } else if (toggle == 0) {
    toggle = 1;

    $('.tour-panel').fadeOut(700);
    $('.tour-btn').removeClass('on');

    view.goTo({
        position: {
          spatialReference: {
            // latestWkid: 3857,
            wkid: 3857
          },
          x: -8576700.517221361,
          y: 4704926.522271065,
          z: 748.4846795396879
        },
        heading: 359.4376327221278,
        tilt: 38.177992495378874
    }, {
      duration: 3000
    });

    graphicsLayer.graphics.forEach(g => {
        g.visible = false;
    });

  } else {}
})


/***Trigger About Modal***/

$('.nav-item:nth-of-type(5)').click(function () {
  $('#about-modal').fadeIn(500);
})

/***Close all modals***/

$('#about-close, #img-close').click(function () {
    $('#img-modal').fadeOut(500);
    $('#about-modal').fadeOut(500);
})

/***Open / Close side panel***/

$('#panel-btn').click(function(){
  $('.side-panel').toggleClass('on');
  $('#panel-btn').toggleClass('on');
});

$('#panel-close').click(function(){
  $('.side-panel').removeClass('on');
  $('#panel-btn').toggleClass('on');
});

/***Open / Close about panel***/

$('#help-btn').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

$('#help-close').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

/***Turn on RC structures labels***/

$('#labelSwitch').change(function(){
  if ($(this).is(':checked')) {
    rcStructures.labelingInfo = [structureUseLabel]
    newDealBuildingsLabelPoint.labelingInfo = [newDealLabel]
  } else {
    rcStructures.labelingInfo = [""]
    newDealBuildingsLabelPoint.labelingInfo = [""]
  }
})

/***Toggle Tree Layer***/

$('#treeSwitch').change(function(){
  if ($(this).is(':checked')) {
    rcTrees.visible = false;
  } else {
    rcTrees.visible = true;
  }
})

/***Change weather***/

$('#weatherSwitch').change(function(){
  if ($(this).is(':checked')) {
    view.environment.weather = {
      type: "rainy",
      precipitation: 0.7,
      cloudCover: 0.7  
    };
  } else {
    view.environment.weather = {
      type: "cloudy",
      cloudCover: 0.5  
    };
  }
})

/***Toggle Timeline Div */

$('#timelineSwitch').change(function(){
  if ($(this).is(':checked')) {
    $('.timeline').addClass('show');
    resetAnimation();
  } else {
    $('.timeline').removeClass('show');
  }
})

/***Add Map Layers***/

const rcStructures = new SceneLayer({
  url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/Resurrection_City_Structures/SceneServer",
  renderer: rcStructuresRenderer,
  // labelingInfo: [structureUseLabel],
  labelingInfo: [""],
  outFields: ["*"],
  id: 'rcStructures',
  elevationInfo: {
    mode: "on-the-ground"
  },
  popupEnabled: false,
  opacity: 1
});

const newDealBuildings = new SceneLayer({
  url: "https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/NewDeal_Mall_Structures/SceneServer",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

const newDealBuildingsLabelPoint = new FeatureLayer({
  url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/New_Deal_Building_Label/FeatureServer",
  labelingInfo: [""],
  renderer: newDealPointRenderer
})

const rcTrees = new SceneLayer({                    
  url:"https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/RC_Trees_3D/SceneServer",
  opacity: 0.7,
  popupEnabled: false
});

const mallGroundCover = new FeatureLayer({
  url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/Mall_Cover/FeatureServer",
  elevationInfo: {
    mode: "on-the-ground",
  },
  maxScale: 0,
  renderer: mallRenderer,
  popupEnabled: false
});

const dcBuildings = new SceneLayer({
  url: "https://services.arcgis.com/neT9SoYxizqTHZPH/arcgis/rest/services/DC_3D_Buildings/SceneServer",
  definitionExpression: "EGID NOT IN ('DC00002813', 'DC00002812', 'DC00002810', 'DC00002811', 'DC00002814', 'DC00002809')",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

/***Mesh / Graphics Layers***/

const graphicsLayer = new GraphicsLayer({
  elevationInfo: {
    mode: "absolute-height"
  }
});

/*Image One*/

const imageOnePoint = new Point({
  x: -8576975.467217475,
  y: 4705667.056388107,
  z: 8,
  spatialReference: SpatialReference.WebMercator
});

const imageOnePlane = Mesh.createPlane(imageOnePoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageOnePlane.rotate(0,0,0);

imageOnePlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_1.JPG"}
});

// const imageOneGraphic = new Graphic({
//   geometry: imageOnePlane,
//   visible: true,
//   symbol: new MeshSymbol3D({
//     symbolLayers: [new FillSymbol3DLayer({
//       material: {
//         color: null
//       }
//     })]
//   })
// });

const imageOneGraphic = new Graphic({
  geometry: imageOnePlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageOnePlane.attributes = {
  "caption": "This is a test caption for image one"
};

/*End Image One*/

/*Image Two*/

const imageTwoPoint = new Point({
  x: -8576962.715648185,
  y: 4705684.373811365,
  z: 8.5,
  spatialReference: SpatialReference.WebMercator
});

const imageTwoPlane = Mesh.createPlane(imageTwoPoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageTwoPlane.rotate(0,0,20);

imageTwoPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_2.JPG"}
});

const imageTwoGraphic = new Graphic({
  geometry: imageTwoPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageTwoPlane.attributes = {
  "caption": "This is a test caption for image two"
};

/*End Image Two*/

/*Image Three*/

const imageThreePoint = new Point({
  x: -8576888.084422419,
  y: 4705690.157280493,
  z: 8,
  spatialReference: SpatialReference.WebMercator
});

const imageThreePlane = Mesh.createPlane(imageThreePoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageThreePlane.rotate(0,0,15);

imageThreePlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_3.JPG"}
});

const imageThreeGraphic = new Graphic({
  geometry: imageThreePlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageThreePlane.attributes = {
  "caption": "This is a test caption for image three"
};

/*End Image Three*/

/*Image Four*/

const imageFourPoint = new Point({
  x: -8576824.272072172,
  y: 4705657.890354409,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const imageFourPlane = Mesh.createPlane(imageFourPoint, {size: { height: 5, width: 10}, facing: "north", vertexSpace: "georeferenced"});

imageFourPlane.rotate(0,0,0);

imageFourPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_4_1.JPG"}
});

const imageFourGraphic = new Graphic({
  geometry: imageFourPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageFourPlane.attributes = {
  "caption": "This is a test caption for image four"
};

/*End Image Four*/

/*Image Five*/

const imageFivePoint = new Point({
  x: -8576585.395584574,
  y: 4705689.322322281,
  z: 6,
  spatialReference: SpatialReference.WebMercator
});

const imageFivePlane = Mesh.createPlane(imageFivePoint, {size: { height: 4, width: 8}, facing: "west", vertexSpace: "georeferenced"});

imageFivePlane.rotate(0,0,0);

imageFivePlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_5.JPG"}
});

const imageFiveGraphic = new Graphic({
  geometry: imageFivePlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageFivePlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Five*/

/*Image Six*/

const imageSixPoint = new Point({
  x: -8576418.172697078,
  y: 4705706.755209459,
  z: 6,
  spatialReference: SpatialReference.WebMercator
});

const imageSixPlane = Mesh.createPlane(imageSixPoint, {size: { height: 4, width: 8}, facing: "north", vertexSpace: "georeferenced"});

imageSixPlane.rotate(0,0,0);

imageSixPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_6_1.JPG"}
});

const imageSixGraphic = new Graphic({
  geometry: imageSixPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});
imageSixPlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Six*/

/*Image Seven*/

const imageSevenPoint = new Point({
  x: -8576727.67788017,
  y: 4705666.360655037,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const imageSevenPlane = Mesh.createPlane(imageSevenPoint, {size: { height: 6, width: 12}, facing: "north", vertexSpace: "georeferenced"});

imageSevenPlane.rotate(0,0,0);

imageSevenPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_7_1.JPG"}
});

const imageSevenGraphic = new Graphic({
  geometry: imageSevenPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageSevenPlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Seven*/

/*Image Eight*/

const imageEightPoint = new Point({
  x: -8576709.849813217,
  y: 4705647.31064385,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const imageEightPlane = Mesh.createPlane(imageEightPoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageEightPlane.rotate(0,0,0);

imageEightPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_8.JPG"}
});

const imageEightGraphic = new Graphic({
  geometry: imageEightPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageEightPlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Eight*/

/***Add all image / graphics layers) */

graphicsLayer.addMany([imageOneGraphic, imageTwoGraphic, imageThreeGraphic, imageFourGraphic, imageFiveGraphic, imageSixGraphic, imageSevenGraphic, imageEightGraphic]);

/***Basemap Layers***/

const vectorTileLayer = new VectorTileLayer({
    portalItem: {
      id: "86a5d38d9933473cb9c7645f61068295", // Custom CRMP Basemap
    },
    opacity: 0.75,
  });

const hillshadeTileLayer = new TileLayer({
  portalItem: {
    id: "1b243539f4514b6ba35e7d995890db1d", // World Hillshade
  },
});

const customBasemap = new Basemap({ baseLayers: [hillshadeTileLayer, vectorTileLayer] });

/***Create Map and SceneView***/

const map = new WebScene({
    basemap: customBasemap,
    // basemap: "topo-3d",
    ground: "world-elevation",
    layers: [rcStructures, graphicsLayer, mallGroundCover, rcTrees, newDealBuildingsLabelPoint, newDealBuildings, dcBuildings],
});

map.ground.opacity = 1;

const view = new SceneView({
    container: "viewDiv",
    map: map,
    qualityProfile: "high",
    highlights: [
      {name: "custom", color: "#649b92", haloColor: "#649b92", haloOpacity: 0.9, fillOpacity: 0.5, shadowOpacity: 0.2}
    ],
    environment: {
      background:{
          type: "color", 
          color: [244, 245, 240, 1]
      },
      atmosphereEnabled: false,
      starsEnabled: false
    },
    constraints: {
      altitude: {
        min: 0,
        max: 5000
      }
    },
    camera: {
        position: {
          spatialReference: {
            wkid: 3857
          },
          x: -8578333.504165262,
          y: 4705456.0978203695,
          z: 183.14629888907075
        },
        heading: 86.97859465761329,
        tilt: 83.64442210800793 
    },
    environment: {
      lighting: {
          directShadowsEnabled: true
      }
    },
    ui: {
        components: []
    },
    viewingMode: "global"
});

view.environment.weather = {
  type: "cloudy",
  cloudCover: 0.5  
};

/***Add Compass Widget***/

const zoomButtonsDiv = document.getElementById("zoomButtons");

const compassWidget = new Compass({
  view: view, 
  container: zoomButtonsDiv
});

/***Custom Zoom In/Out Buttons***/

function changeZoom(delta) {
  const camera = view.camera.clone();
  const scale = delta > 0 ? 0.7 : 1.3;
  const newPos = camera.position.clone();
  newPos.x = (newPos.x - view.center.x) * scale + view.center.x;
  newPos.y = (newPos.y - view.center.y) * scale + view.center.y;
  newPos.z = (newPos.z - view.center.z) * scale + view.center.z;
  
  camera.position = newPos;
  view.goTo(camera, { duration: 500, easing: "ease-in-out" });
}

document.getElementById("zoom-in-btn").addEventListener("click", () => {
  changeZoom(1);
});

document.getElementById("zoom-out-btn").addEventListener("click", () => {
  changeZoom(-1);
});

/***Start HitTest Cursor Pointer Functionality***/

view.on("pointer-move", (event) => {
  const opts = {
    include: [rcStructures, graphicsLayer]
  }
  view.hitTest(event, opts).then((response) => {
    if (response.results.length) {
      document.getElementById("viewDiv").style.cursor = "pointer";
    } else {
      document.getElementById("viewDiv").style.cursor = "default";
    }
  });
});

/***Start Popup HitTest Functionality***/

let popupImgUrl = document.getElementById('popup-image-id');
let popupText = document.querySelector('.popup-text')

let highlight;

view.on("immediate-click", (event) => {
  view.hitTest(event).then((hitResult) => {
    if (hitResult.results.length > 0 && hitResult.results[0].graphic.layer.id == "rcStructures") {
        
      /***Make popup div visible***/
    
      $('#cardId').fadeIn();
      $('#cardId').css('display','flex');

      /***Add Popup Content***/

      popupImgUrl.src="./assets/images/placeholder2.jpg";
      popupText.innerHTML = "";

      /***Highlight points functionality***/

      let result = hitResult.results[0].graphic;

      view.whenLayerView(result.layer).then((layerView) => {
          highlight?.remove();
          highlight = layerView.highlight(result, { name: "custom"});
      });

    } /* else if (hitResult.results.find(r => r.graphic === planeGraphic)) {

      console.log(planeGraphic.attributes.caption);
      
      $('#cardId').fadeIn();
      $('#cardId').css('display','flex');

      popupImgUrl.src = "./assets/images/Image3.jpg";
      popupText.innerHTML = String(planeGraphic.attributes.caption);
    
    }*/ else {
        $('#cardId').fadeOut();
        highlight?.remove();

        const { x, y, z } = event.mapPoint;
        console.log(`Clicked at X: ${x}, Y: ${y}, Z: ${z}`);
    }
  })
})

/***View Coordinates***/

view.watch('camera.position', function(newValue, oldValue, property, object) {
  console.log(property , newValue);
});

view.watch('camera.heading', function(newValue, oldValue, property, object) {
  console.log(property , newValue);
});

view.watch('camera.tilt', function(newValue, oldValue, property, object) {
  console.log(property , newValue);
});

/***Timeline Animation***/

const sequenceField = "Const_Time_Integer";
const dateText = document.querySelector('.automated-date');

let layerView;
let animationInterval;
let currentValue = 0;
let maxValue = 0;

//Create Query for Animation

view.whenLayerView(rcStructures).then(async (lv) => {
  layerView = lv;

  const query = rcStructures.createQuery();
  query.where = "1=1";
  query.outStatistics = [{
    onStatisticField: sequenceField,
    outStatisticFieldName: "max_seq",
    statisticType: "max"
  }];

  const result = await rcStructures.queryFeatures(query);
  maxValue = result.features[0].attributes.max_seq || 100;
});

//Update Progress Bar

function updateProgress() {
  if (!maxValue) return;
  const percent = (currentValue / maxValue) * 100;
  progressBar.style.width = percent + "%";
}

//Update date text

function updateDateText () {
  if (currentValue >= 1 && currentValue <= 58) {
    dateText.innerHTML = 'May 13, 1968'
  } else if (currentValue >= 59 && currentValue <= 115) {
    dateText.innerHTML = 'May 14, 1968'
  } else if (currentValue >= 116 && currentValue <= 154) {
    dateText.innerHTML = 'May 17, 1968'
  } else if (currentValue >= 155 && currentValue <= 565) {
    dateText.innerHTML = 'May 24, 1968'
  } else if (currentValue >= 566 && currentValue <= 568) {
    dateText.innerHTML = 'May 29, 1968'
  } else if (currentValue >= 569 && currentValue <= 712) {
    dateText.innerHTML = 'June 1, 1968'
  } else {

  }
}

//Intro Animation Sequence 

function startIntroAnimation() {

  if (!layerView) return;

  clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    currentValue++;
    if (currentValue > maxValue) {
      clearInterval(animationInterval);
      return;
    }

    layerView.filter = {
      where: `${sequenceField} <= ${currentValue}`
    };
  }, .1); 

};

//Start Timline Animation Button

function startAnimation() {

  if (!layerView) return;

  clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    currentValue++;
    if (currentValue > maxValue) {
      clearInterval(animationInterval);
      return;
    }

    layerView.filter = {
      where: `${sequenceField} <= ${currentValue}`
    };

    updateProgress();
    updateDateText();
  }, 20); 
};

//Pause Animation Button

function pauseAnimation() {
  clearInterval(animationInterval);
}

//Reset Animation Button

function resetAnimation() {
  clearInterval(animationInterval);
  currentValue = 0;
  if (layerView) {
    layerView.filter = null;
  }
  updateProgress();
  dateText.innerHTML = 'May 13, 1968'
}

//Create Button Event Listeners

document.getElementById("startBtn").addEventListener("click", startAnimation);
document.getElementById("pauseBtn").addEventListener("click", pauseAnimation);
document.getElementById("resetBtn").addEventListener("click", resetAnimation);

/***End Timeline Animation*/

/****Close Splashscreen after DC Buildings Layer Load****/

const loadingText = document.querySelector(".splash-loading-text");
const loadedText = document.querySelector(".splash-loaded-text");

view.whenLayerView(dcBuildings).then((layerView) => {
  reactiveUtils.whenOnce(() => !layerView.updating).then(() => {
    splashButton.style.background = 'var(--Dark-Brown)'
    splashButton.style.cursor = 'pointer'
    splashButton.disabled = false;
    loadingText.style.display = 'none';
    loadedText.style.display = 'flex';
  });
});


// Tour Pagination

let items = $(".list-wrapper .list-item");
let numItems = items.length;
let perPage = 1;

items.slice(perPage).hide();

$('#pagination-container').pagination({
    items: numItems,
    itemsOnPage: perPage,
    prevText: '<i class="fa-solid fa-arrow-left"></i>',
nextText: '<i class="fa-solid fa-arrow-right"></i>',
    onPageClick: function (pageNumber) {
        $('.list-wrapper').scrollTop(0);

        let showFrom = perPage * (pageNumber - 1);
        let showTo = showFrom + perPage;
        // items.hide().slice(showFrom, showTo).show();
        items.hide().slice(showFrom, showTo).fadeIn(800)

        function tourZoom() {
          if (pageNumber == 1) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8577004.779774044,
                  y: 4705667.843296814,
                  z: 10.543300992809236
                },
                heading: 83.59418325714013,
                tilt: 84.22649756027022
            }, {
              duration: 3000
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageOneGraphic) {
                g.visible = false;
              } else {
                imageOneGraphic.visible = true;
              }
            });
            
          } else if (pageNumber == 2) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576989.152729018,
                  y: 4705679.9810580285,
                  z: 10.485039697960019
                },
                heading: 70.35532553222679,
                tilt: 86.11341892628539
            }, {
              duration: 3000
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageTwoGraphic) {
                g.visible = false;
              } else {
                imageTwoGraphic.visible = true;
              }
            });

          } else if (pageNumber == 3) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576919.096524056,
                  y: 4705683.647870868,
                  z: 10.81275842525065
                },
                heading: 70.62430450730903,
                tilt: 83.49760791353782
            }, {
              duration: 3500
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageThreeGraphic) {
                g.visible = false;
              } else {
                imageThreeGraphic.visible = true;
              }
            });

          } else if (pageNumber == 4) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576823.540303953,
                  y: 4705686.89671136,
                  z: 10.011710852384567
                },
                heading: 174.7211623546343,
                tilt: 84.40962104687159
            }, {
              duration: 4000
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageFourGraphic) {
                g.visible = false;
              } else {
                imageFourGraphic.visible = true;
              }
            });

          } else if (pageNumber == 5) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576613.497337826,
                  y: 4705684.875138781,
                  z: 8.82313084602356
                },
                heading: 77.67761909751498,
                tilt: 82.84882863924025
            }, {
              duration: 4000
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageFiveGraphic) {
                g.visible = false;
              } else {
                imageFiveGraphic.visible = true;
              }
            });

          } else if (pageNumber == 6) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576416.48588196,
                  y: 4705727.700724684,
                  z: 8.832583929412067
                },
                heading: 174.9596704992528,
                tilt: 82.06501693126847
            }, {
              duration: 3500
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageSixGraphic) {
                g.visible = false;
              } else {
                imageSixGraphic.visible = true;
              }
            });

          } else if (pageNumber == 7) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576725.321068317,
                  y: 4705693.5749877365,
                  z: 13.036840473301709
                },
                heading: 175.39613210790532,
                tilt: 74.14001875546752
            }, {
              duration: 3500
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageSevenGraphic) {
                g.visible = false;
              } else {
                imageSevenGraphic.visible = true;
              }
            });

          } else if (pageNumber == 8) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576740.581724314,
                  y: 4705662.478255918,
                  z: 13.309347042813897
                },
                heading: 105.06355952716257,
                tilt: 75.64944936130252
            }, {
              duration: 4500
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageEightGraphic) {
                g.visible = false;
              } else {
                imageEightGraphic.visible = true;
              }
            });

          }  else {};
        }

        tourZoom();
    }
});
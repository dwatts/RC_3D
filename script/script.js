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

/***Start: Global code to send images on click to modal and launch***/

$('.app-image').click(function (e) {
  let location = $(e.target).attr('src')
  let caption = $(e.target).attr('data-caption')
  $('#neatModalImg').attr('src', location);
  $('#img-modal').fadeIn(500);
  $('#img-caption').html(caption);
});

/***Start: Fade in Splash Screen on Load***/

function showDivInner() {
  $(".splash-inner").fadeIn(500);
}

$(document).ready(function(){
    $(".splash-container")
    .css("display", "flex")
    .hide()
    .fadeIn();
    setTimeout(showDivInner, 2000);
});


/***Start: Close splash screen options: guided tour or self explore***/

//Splash button initially disabled until DC Buildings layer loads

const splashGuidedButton = document.querySelector(".splash-guided-btn");
const splashExploreButton = document.querySelector(".splash-explore-btn");


/************************************************/

//Guided Tour Launch Code

/************************************************/

$('.splash-guided-btn').click(function () {
    $('.splash-container').fadeOut(700);
    $('#dateDisplay').fadeIn(700);
    $('.left-panel-btn-container').css("display", "none");
    $('.right-panel-btn-container').css("display", "none");

    // const guidedTourInfoPanel = document.querySelector(".guided-tour-side-panel");

    function firstTask() {
      return new Promise((resolve) => {
        showIntroText(); 
        goToFirstView();
        resolve();
      });
    }

    function secondTask() {
      return new Promise((resolve) => {
        setTimeout(() => {
          setTimeout(() => {
            
            goToPresetView();
            startIntroAnimation();
            showIntroDate();

            setTimeout(() => {
              rcStructures.definitionExpression = "";
              resolve();
            }, 100);

          }, 50);

        }, 10000);
      });
    }

    function thirdTask() {
      return new Promise((resolve) => {
        setTimeout(() => {
          // guidedTourInfoPanel.style.display = 'block';
          $('.guided-tour-side-panel').fadeIn(400);
          resolve();
        }, 13000)
      })
    }

    async function runTourTasksSequentially() {
      return firstTask()
        .then(() => secondTask())
        .then(() => thirdTask())
        .then(() => {
          console.log("All tasks completed");
        });
    }

    //Call async function
    runTourTasksSequentially();
});

//'Next' button on Wiebenson side panel - start guided tour
$('#guided-tour-btn').click(function () {
  toggleTour();
  $('.guided-tour-side-panel').fadeOut(400);
});

/***Start: Guided Tour Intro Animation Functions***/

//Go to first view function

function goToFirstView() {
  view.goTo({
    position: {
      spatialReference: {
        wkid: 3857
      },
      x: -8577967.540472522,
      y: 4705685.053473854,
      z: 209.81217331252992
    },
    heading: 88.50749854394327,
    tilt: 73.64968337378207
  }, {
    duration: 13000
  });      
}

//Go to second view function

function goToPresetView() {
  view.goTo(
    {
      position: {
        spatialReference: {
          wkid: 3857
        },
        x: -8576553.117303116,
        y: 4704561.225728327,
        z: 396.86767570860684
      },
      heading: 358.9942796413037,
      tilt: 66.66810769718653
    },
    {
      duration: 10000
    }
  );
}

//Guided Tour Text Typing Animation (Show div, begin letter animation)

function showIntroText() {
    $(".intro-text-holder")
      .css("display", "flex") // set flex before showing
      .hide()
      .fadeIn(400)
      .delay(9000)
      
      .fadeOut(400, function () {
          $(this).css("display", "none");
      });

    setTimeout(() => textTypingEffect(typingText, text), 2000)
}

//Text animation function

const typingText = document.querySelector(".date-sentence-text");
const text = "Resurrection City was constructed and occupied over the course of 19 days in May and June of 1968.";

function textTypingEffect(element, text, i = 0) {
  element.textContent += text[i];

  //Add letter until end of string is reached
  if (i === text.length -1) {
    return;
  }

  setTimeout(()=> textTypingEffect(element, text, i + 1), 50)
}

//Date Counter 

function showIntroDate() {
  $(".intro-date-holder")
    .css("display", "flex")
    .hide()
    .fadeIn(400)
    .delay(12000)
    
    .fadeOut(600, function () {
          $(this).css("display", "none");
    });

  startDate()
}

//(19 days total)
let currentDate = new Date(1968, 4, 13); // May is month 4 (0-based)
const endDate = new Date(1968, 5, 1);   // June 1, 1968

const display = document.getElementById("dateDisplay");

function updateDate() {
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  display.textContent = formattedDate;

  if (currentDate >= endDate) {
    clearInterval(timer);
    // $('#dateDisplay').fadeOut(700);
    return;
  }

  currentDate.setDate(currentDate.getDate() + 1);  
}

let timer;

function startDate() {
  timer = setInterval(updateDate, 526); 
}

/***End: Guided Tour Intro Animation Functions***/



/************************************************/

//Explore on your own launch code

/************************************************/

$('.splash-explore-btn').click(function () {
    $('.splash-container').fadeOut(700);
    view.goTo({
      position: {
        spatialReference: {
          // latestWkid: 3857,
          wkid: 3857
        },
        x: -8577402.92788584,
        y: 4705134.3496611165,
        z: 405.9044241467491
      },
      heading: 54.60092337030268,
      tilt: 61.38437711848068
    }, {
      duration: 3000
    });

    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
    });

    rcStructures.definitionExpression = "";
    
    $('#labelSwitch')
      .prop('checked', true)
      .trigger('change');
})

/***End: Close splash screen options: guided tour or self explore***/



/***Start: Open guided tour panel and start guided tour***/

let toggle = 1;

function toggleTour() {
  if (toggle == 1) {

    // Remove notable structure highlights
    if (highlightHandle) {
      highlightHandle.remove();
    }

    toggle = 0;
    $('.tour-panel').fadeIn(700);
    $('.tour-btn').addClass('on');

    view.goTo({
      position: {
        spatialReference: { wkid: 3857 },
        x: -8577004.779774044,
        y: 4705667.843296814,
        z: 10.543300992809236
      },
      heading: 83.59418325714013,
      tilt: 84.22649756027022
    }, { duration: 3000 });

    graphicsLayer.graphics.forEach(g => {
      g.visible = (g === imageOneGraphic);
    });

  } else if (toggle == 0) {

    toggle = 1;
    $('.tour-panel').fadeOut(700);
    $('.tour-btn').removeClass('on');
    $('#pagination-container').pagination('selectPage', 1);

    // Add notable structure highlights
    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable" });
    });

    view.goTo({
      position: {
        spatialReference: { wkid: 3857 },
        x: -8576700.517221361,
        y: 4704926.522271065,
        z: 748.4846795396879
      },
      heading: 359.4376327221278,
      tilt: 38.177992495378874
    }, { duration: 3000 });

    graphicsLayer.graphics.forEach(g => {
      g.visible = false;
    });
  }
}

$('#tour-btn').click(toggleTour);

/***End: Open guided tour panel and start guided tour***/



/***Start: Close Tour Panel***/

$('#tour-close' ).click(function(){
    toggle = 1;

    $('.tour-panel').fadeOut(700);
    $('.tour-btn').removeClass('on');
    $('#pagination-container').pagination('selectPage', 1);

    //Add notable structure highlights
  
    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
    });

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
});

/***End: Close Tour Panel***/




/***Start: Assorted controls code***/

//Trigger About Modal

$('.nav-item:nth-of-type(5)').click(function () {
  $('#about-modal').fadeIn(500);
})

//Close all modals

$('#about-close, #img-close').click(function () {
    $('#img-modal').fadeOut(500);
    $('#about-modal').fadeOut(500);
})

//Open / Close side panel

$('#panel-btn').click(function(){
  $('.side-panel').toggleClass('on');
  $('#panel-btn').toggleClass('on');
});

$('#panel-close').click(function(){
  $('.side-panel').removeClass('on');
  $('#panel-btn').toggleClass('on');
});

//Open / Close about panel

$('#help-btn').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

$('#help-close').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

//Close popups

$('#popup-close' ).click(function(){
    $('#cardId').fadeOut();
    highlight?.remove();
});

//Turn on RC structures labels

$('#labelSwitch').change(function(){
  if ($(this).is(':checked')) {
    rcStructureIcons.visible = true
    rcStructureIcons.labelingInfo = [structureUseLabel]
    newDealBuildingsLabelPoint.labelingInfo = [newDealLabel]
  } else {
    rcStructureIcons.visible = false
    rcStructureIcons.labelingInfo = [""]
    newDealBuildingsLabelPoint.labelingInfo = [""]
  }
})

//Toggle Tree Layer

$('#highlightSwitch').change(function(){
  if ($(this).is(':checked')) {
    highlightHandle.remove();
  } else {
    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
    });
  }
})

//Change weather

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

//Toggle Timeline Div

$('#timelineSwitch').change(function(){
  if ($(this).is(':checked')) {
    $('.timeline').addClass('show');
    resetAnimation();
  } else {
    $('.timeline').removeClass('show');
  }
})

/***End: Assorted controls code***/




/***Start: Add WebScene Layers***/

const rcStructures = new SceneLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Resurrection_City_Structure_Models/SceneServer",
  renderer: rcStructuresRenderer,
  outFields: ["*"],
  id: 'rcStructures',
  elevationInfo: {
    mode: "on-the-ground"
  },
  popupEnabled: false,
  definitionExpression: "Const_Time_Integer = 1"
});

const rcStructureIcons = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Structure_Label_Points/FeatureServer",
  popupEnabled: false,
  renderer: rcIconRenderer,
  labelingInfo: [""],
  visible: false
})

const newDealBuildings = new SceneLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/New_Deal_Mall_Buildings/SceneServer",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

const newDealBuildingsLabelPoint = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/New_Deal_Structure_Label_Point/FeatureServer",
  labelingInfo: [""],
  renderer: newDealPointRenderer
})

const rcTrees = new SceneLayer({                    
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Resurrection_City_Trees/SceneServer",
  opacity: 0.7,
  popupEnabled: false
});

const mallGroundCover = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Mall_Area_Ground_Cover/FeatureServer",
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

/***End: Add WebScene Layers***/




/***Start: Mesh / Historic Images / Graphics Layers for Tour Images***/

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

/***End: Mesh / Historic Images / Graphics Layers for Tour Images***/



/***Start: Add Custom Basemap Layers***/

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

/***End: Add Custom Basemap Layers***/




/***Start: Create Scene and SceneView***/

const map = new WebScene({
    basemap: customBasemap,
    // basemap: "topo-3d",
    ground: "world-elevation",
    layers: [rcStructures, rcStructureIcons, graphicsLayer, mallGroundCover, rcTrees, newDealBuildingsLabelPoint, newDealBuildings, dcBuildings],
});

map.ground.opacity = 1;

const view = new SceneView({
    container: "viewDiv",
    map: map,
    qualityProfile: "high",
    highlights: [
      {name: "notable", color: "#ff1303", haloColor: "#ff1303", haloOpacity: 1, fillOpacity: 0, shadowOpacity: 0.2},
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
        max: 7000
      }
    },
    camera: {
        position: {
          spatialReference: {
            wkid: 3857
          },
          x: -8582646.003874714,
          y: 4705325.325278847,
          z: 5634.258735703304
        },
        heading: 88.25759425850616,
        tilt: 37.01304637192474 
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

/***End: Create Scene and SceneView***/



/***Start: Add Compass Widget and Custom Zoom Buttons***/

//Add Compass Widget

const zoomButtonsDiv = document.getElementById("zoomButton");

const compassWidget = new Compass({
  view: view, 
  container: zoomButtonsDiv
});

//Custom Zoom In/Out Buttons

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

/***End: Add Compass Widget and Custom Zoom Buttons***/




/***Start: HitTest Cursor Pointer Functionality***/

view.on("pointer-move", (event) => {
  const opts = {
    include: [rcStructures/*, graphicsLayer*/]
  }
  view.hitTest(event, opts).then((response) => {
    if (response.results.length && response.results[0].graphic.attributes.Tour_Building == 1) {
      document.getElementById("viewDiv").style.cursor = "pointer";
    } else {
      document.getElementById("viewDiv").style.cursor = "default";
    }
  });
});

/***End: HitTest Cursor Pointer Functionality***/




/***Start: Popup HitTest Functionality***/

let popupImgUrl = document.getElementById('popup-image-id');
let popupTitle = document.querySelector('.popup-icon-title h3')

let highlight;

view.on("immediate-click", (event) => {
  view.hitTest(event).then((hitResult) => {
    if (hitResult.results.length > 0 && hitResult.results[0].graphic.layer.id == "rcStructures" && hitResult.results[0].graphic.attributes.Tour_Building == 1) {
        
      //Make popup div visible
    
      $('#cardId').fadeIn();
      $('#cardId').css('display','flex');

      //Add Popup Content

      let structureName = hitResult.results[0].graphic.attributes.Name;
      let popupIcon = document.querySelector('.popup-icon-title img')
      let popupUse = document.querySelector('.popup-text p span');

      popupTitle.innerHTML = `${structureName}`;


      if (structureName == 'Meeting Tent') {
        popupIcon.src = './assets/icons/Gathering.png';
        popupUse.innerHTML = "General gathering area for resident meetings";
      } else if (structureName == 'Workshop / Meeting Tent') {
        popupIcon.src = './assets/icons/Gathering.png';
        popupUse.innerHTML = "Gathering area for resident meetings and workshops"
      } else if (structureName == 'Security') {
        popupIcon.src = './assets/icons/Security.png';
        popupUse.innerHTML = "Security staff headquarters"
      } else if (structureName == 'Campaign Leaders Compound') {
        popupIcon.src = './assets/icons/City_Hall.png';
        popupUse.innerHTML = "Leadership residential area"
      } else if (structureName == 'God\'s Eye Bakery') {
        popupIcon.src = './assets/icons/Bakery.png';
        popupUse.innerHTML = "Bakery supplying bread to residents"
      } else if (structureName == 'Day Care') {
        popupIcon.src = './assets/icons/Child_Care.png';
        popupUse.innerHTML = "Child care facilities"
      } else if (structureName == 'Entertainment Tent') {
        popupIcon.src = './assets/icons/Gathering.png';
        popupUse.innerHTML = "Entertainment tent for residents"
      } else if (structureName == 'Department of Sanitation') {
        popupIcon.src = './assets/icons/Mechanic.png';
        popupUse.innerHTML = "Facilities for santitation workers"
      } else if (structureName == 'Medical Unit' || structureName == 'Medical Services') {
        popupIcon.src = './assets/icons/Medical.png';
        popupUse.innerHTML = "Medical services for residents"
      } else if (structureName == 'Showers') {
        popupIcon.src = './assets/icons/Showers.png';
        popupUse.innerHTML = "Shower facilities"
      } else if (structureName == 'Dining Area') {
        popupIcon.src = './assets/icons/Food_Service.png';
        popupUse.innerHTML = "Main gathering area for food services"
      } else if (structureName == 'Food Storage Trailer') {
        popupIcon.src = './assets/icons/Food_Storage.png';
        popupUse.innerHTML = "Refrigerated trailers for onsite food storage"
      } else if (structureName == 'Toilet') {
        popupIcon.src = './assets/icons/Restroom.png';
        popupUse.innerHTML = "Restroom facilities for residents"
      } else if (structureName == 'Construction Warehouse Tent') {
        popupIcon.src = './assets/icons/City_Hall.png';
        popupUse.innerHTML = "Central area for construction supply distribution"
      } else if (structureName == 'City Hall') {
        popupIcon.src = './assets/icons/City_Hall.png';
        popupUse.innerHTML = "Center of governance for Resurrection City"
      } else if (structureName == 'Main Gathering Tent') {
        popupIcon.src = './assets/icons/Gathering.png';
        popupUse.innerHTML = "Main gathering area for residents"
      } else if (structureName == 'Information Services / Donations / Art Booth') {
        popupIcon.src = './assets/icons/Public_Info.png';
        popupUse.innerHTML = "Donation facilities"
      } else if (structureName == 'Volunteer Sign-in Booth') {
        popupIcon.src = './assets/icons/Public_Info.png';
        popupUse.innerHTML = "Volunteer marshalling area"
      } else if (structureName == 'Dental Services') {
        popupIcon.src = './assets/icons/Medical.png';
        popupUse.innerHTML = "Dental services for residents"
      } else if (structureName == 'Seventh Day Adventist') {
        popupIcon.src = './assets/icons/Public_Info.png';
        popupUse.innerHTML = "Sevent Day Adventists headquarters"
      } else if (structureName == 'Public Information Pavilion') {
        popupIcon.src = './assets/icons/Public_Info.png';
        popupUse.innerHTML = "Primary area for public information"
      } else {
        ""
      };

      //Highlight Structures functionality

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
});

/***End: Popup HitTest Functionality***/




/***Start: Add Special Highlight for Selected RC Structures***/

const specificIds = [10, 56, 57, 58, 59, 60, 61, 62, 63, 99, 100, 101, 102, 104, 105, 106, 143, 153, 157, 267, 268, 422, 499, 652, 653, 677, 680, 687, 688, 689, 711, 712];
let highlightHandle;

// view.whenLayerView(rcStructures).then((layerViewHighlight) => {
//   highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
// });

/***End: Add Special Highlight for Selected RC Structures***/




/***See Camera Coordinates in Console***/

view.watch('camera.position', function(newValue, oldValue, property, object) {
  console.log(property , newValue);
});

view.watch('camera.heading', function(newValue, oldValue, property, object) {
  console.log(property , newValue);
});

view.watch('camera.tilt', function(newValue, oldValue, property, object) {
  console.log(property , newValue);
});

/***Start: Timeline animation for both guided tour intro and timeline widget***/

const sequenceField = "Const_Time_Integer";
const dateText = document.querySelector('.automated-date');

let layerView;
let animationFrameId;
let currentValue = 0;
let maxValue = 0;

let startTime = null;
let pausedElapsed = 0;
const duration = 13000; // Animation length (ms)

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

// Timeline Animation Logic

function animate(timestamp) {
  if (!startTime) startTime = timestamp;

  const elapsed = timestamp - startTime + pausedElapsed;
  const progress = Math.min(elapsed / duration, 1);

  currentValue = Math.floor(progress * maxValue);

  layerView.filter = {
    where: `${sequenceField} <= ${currentValue}`
  };

  updateProgress();
  updateDateText();

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(animate);
  }
}

function startIntroAnimation() {
  if (!layerView) return;

  cancelAnimationFrame(animationFrameId);
  startTime = null;
  pausedElapsed = 0;
  animationFrameId = requestAnimationFrame(animate);
}

// Timeline Controls

function startAnimation() {
  if (!layerView) return;

  cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(animate);
}

function pauseAnimation() {
  cancelAnimationFrame(animationFrameId);

  if (startTime !== null) {
    pausedElapsed += performance.now() - startTime;
    startTime = null;
  }
}

function resetAnimation() {
  cancelAnimationFrame(animationFrameId);

  currentValue = 0;
  startTime = null;
  pausedElapsed = 0;

  if (layerView) {
    layerView.filter = null;
  }

  updateProgress();
  dateText.innerHTML = 'May 13, 1968';
}

// Timeline Progress Bar

function updateProgress() {
  if (!maxValue) return;
  const percent = (currentValue / maxValue) * 100;
  progressBar.style.width = percent + "%";
}

function updateDateText() {
  if (currentValue >= 1 && currentValue <= 58) {
    dateText.innerHTML = 'May 13, 1968';
  } else if (currentValue >= 59 && currentValue <= 115) {
    dateText.innerHTML = 'May 14, 1968';
  } else if (currentValue >= 116 && currentValue <= 154) {
    dateText.innerHTML = 'May 17, 1968';
  } else if (currentValue >= 155 && currentValue <= 565) {
    dateText.innerHTML = 'May 24, 1968';
  } else if (currentValue >= 566 && currentValue <= 568) {
    dateText.innerHTML = 'May 29, 1968';
  } else if (currentValue >= 569 && currentValue <= 712) {
    dateText.innerHTML = 'June 1, 1968';
  }
}

// Timeline Play / Pause / Reset Buttons

document.getElementById("startBtn").addEventListener("click", startAnimation);
document.getElementById("pauseBtn").addEventListener("click", pauseAnimation);
document.getElementById("resetBtn").addEventListener("click", resetAnimation);

/***End: Timeline animation for both guided tour intro and timeline widget***/



/****Start: Update splashscreen UI after DC Buildings Layer Load Complete****/

const loadingText = document.querySelector(".splash-loading-text");
// const loadedText = document.querySelector(".splash-loaded-text");

view.whenLayerView(dcBuildings).then((layerView) => {
  reactiveUtils.whenOnce(() => !layerView.updating).then(() => {
    // splashGuidedButton.style.background = 'var(--Dark-Brown)'
    // splashGuidedButton.style.cursor = 'pointer'
    // splashGuidedButton.disabled = false;
    // splashExploreButton.style.background = 'var(--Dark-Brown)'
    // splashExploreButton.style.cursor = 'pointer'
    // splashExploreButton.disabled = false;
    loadingText.style.display = 'none';
    // loadedText.style.display = 'flex';
    // console.log('layers loaded')
  });
});

/****End: Update splashscreen UI after DC Buildings Layer Load Complete****/



/****Start: Guided Tour Pagination Logic****/

let items = $(".list-wrapper .list-item");
let numItems = items.length;
let perPage = 1;

items.slice(perPage).hide();

$('#pagination-container').pagination({
    items: numItems,
    itemsOnPage: perPage,
    displayedPages: 999,
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

/****End: Guided Tour Pagination Logic****/
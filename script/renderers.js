
//Mall Ground Cover Renderer

const mallRenderer = {
      type: "simple",
      symbol: {
        type: "polygon-3d",
        symbolLayers: [{
          type: "fill",
          material: {
            color: "#e6eae6"
          }
        }]
      }
  };

//DC Buildings Renderer

const dcBuildingsRenderer = {
    type: "simple",
    symbol: {
    type: "mesh-3d",
    symbolLayers: [
        {
        type: "fill",
        material: {
            color: [240, 240, 240, 0.85]
        },
        edges: {
            type: "sketch",
            color: [0, 0, 0, 0.6],
            size: 0.5
        }
        }
    ]
    }
};

//New Deal Building Label Point Renderer

var newDealPointRenderer = {
  type: "simple",
  symbol: {
    type: "point-3d", 
      symbolLayers: [
        {
          type: "icon",
          material: {
            color: [99, 99, 99]
          },
          size: 0,
          outline: {
            color: "#404040",
            size: 1
          }
        }
      ]
    }
};

//RC Structure Renderer

//***********General Edge Renderer**********//

const structureEdges = {
  type: "sketch",
  color: [0, 0, 0, 0.6],
  size: 0.5
}; 

//***********Category Renderer**********//
          
const admin = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#730900"
      },
      edges: structureEdges    
    } 
  ]  
};
  
const gathering = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#944229"
      },
      edges: structureEdges    
    } 
  ]  
};

const groupRes = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#B67C53"
      },
      edges: structureEdges    
    } 
  ]  
}
  
const indRes = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#D8B67D"
      },
      edges: structureEdges    
    } 
  ]  
}  

const services = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#9EA887"
      },
      edges: structureEdges    
    } 
  ]  
}

const utilities = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#649B92"
      },
      edges: structureEdges    
    } 
  ]  
}

const notDetermined = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#efefef"
      },
      edges: structureEdges    
    } 
  ]  
}

const rcStructuresRenderer = {
  type: "unique-value",
  defaultSymbol: {
    type: "mesh-3d",
    symbolLayers: [
      {
        type: "fill", 
        material: {
          color: "#4f4f4f"
        },
        edges: structureEdges  
      }
    ]
  },
  field: "Category",
  uniqueValueInfos: [
    {
      value: "Administration",
      symbol: admin,
    },
    {
      value: "Gathering Spaces",
      symbol: gathering,
    },
    {
      value: "Group / Family Residential",
      symbol: groupRes,
    },
    {
      value: "Individual Residential",
      symbol: indRes,
    },
    {
      value: "Not determined",
      symbol: notDetermined,
    },
    {
      value: "Services",
      symbol: services,
    },
    {
      value: "Utilities",
      symbol: utilities,
    }    
  ],
};

//End RC Structure Category Renderer

//Create RC Structure Icon Renderer
 
const verticalOffset = {
    screenLength: 5,
    maxWorldLength: 30,
    minWorldLength: 15
};

function getIcon(icon) {
  return {
    type: "point-3d", 
    symbolLayers: [
      {
        type: "icon",
        resource: {
            href: icon
        },
        size: 22,
        outline: {
          color: "black",
          size: 1
        }
      }
    ],

    verticalOffset: verticalOffset,

    callout: {
      type: "line",
      color: [0,0,0],
      size: .5,
      border: {
        color: [255,255,255,0]
      }
    }
  };
}      

const rcIconRenderer = {
    type: "unique-value",
    field: "Name_Cat",
    uniqueValueInfos: [
        {
            value: "Administration",
            symbol: getIcon(
                "./assets/icons/City_Hall.png"
            )
        },
        {
            value: "Bakery",
            symbol: getIcon(
                "./assets/icons/Bakery.png"
            )
        },
        {
            value: "Childcare",
            symbol: getIcon(
                "./assets/icons/Child_Care.png"
            )
        },
        {
            value: "Dining",
            symbol: getIcon(
                "./assets/icons/Food_Service.png"
            )
        },
        {
            value: "FoodStorage",
            symbol: getIcon(
                "./assets/icons/Food_Storage.png"
            )
        },
        {
            value: "Gathering",
            symbol: getIcon(
                "./assets/icons/Gathering.png"
            )
        },
        {
            value: "Information",
            symbol: getIcon(
                "./assets/icons/Public_Info.png"
            )
        },
        {
            value: "Medical",
            symbol: getIcon(
                "./assets/icons/Medical.png"
            )
        },
        {
            value: "Residential",
            symbol: getIcon(
                "./assets/icons/Residential.png"
            )
        },
        {
            value: "Security",
            symbol: getIcon(
                "./assets/icons/Security.png"
            )
        },
        {
            value: "Sanitation",
            symbol: getIcon(
                "./assets/icons/Mechanic.png"
            )
        },
        {
            value: "Showers",
            symbol: getIcon(
                "./assets/icons/Showers.png"
            )
        },
        {
            value: "Toilet",
            symbol: getIcon(
                "./assets/icons/Restroom.png"
            )
        }
    ]
};
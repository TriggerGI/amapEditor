<script setup>
import { onMounted, reactive, ref } from 'vue';
let map = ref('')
let layer = reactive()
let selected = reactive()
let region = reactive([])

onMounted(() => {
  init()
})

const init = () => {
  let elements = document.getElementsByClassName('bmap-container');
  // document.querySelector('body').appendChild(strToHtml(str))
  if (elements && elements.length > 0) {
    map = new AMap.Map(elements[0], {
      center: [120.228831, 30.288598],
      zoom: 14.2,
    });

    if (!layer) {
      layer = new AMap.GeoJSON({
        geoJSON: region.value,
        getPolyline: function (geojson, lnglats) {
          console.log(geojson.properties.type);
          return new AMap.Polyline({
            path: lnglats,
            strokeWeight: 3,
            zooms: [2, 26],
            strokeColor: '#1fab89',
            strokeOpacity: 0.5,
            cursor: 'pointer',
            extData: geojson.properties,
            zIndex: 99
          });
        },
        getPolygon: function (geojson, lnglats) {
          return new AMap.Polygon({
            zIndex: 98,
            path: lnglats,
            strokeWeight: 1,
            strokeColor: function () {
              if (geojson.properties.type == '09') {
                return '#b4ebaf'
              } else if (geojson.properties.type == '03') {
                return '#6eb6ff'
              } else if (geojson.properties.type == '08') {
                return '#0084ff'
              } else if (geojson.properties.type == '11') {
                return '#4b5cc5'
              } else if (geojson.properties.type == '02') {
                return '#52616b'
              } else if (geojson.properties.type == '01') {
                return '#fc5185'
              } else if (geojson.properties.type == '04') {
                return '#f4a235'
              }

            },
            fillOpacity: 0.3,
            fillColor: function () {
              if (geojson.properties.type == '09') {
                return '#b4ebaf'
              } else if (geojson.properties.type == '03') {
                return '#6eb6ff'
              } else if (geojson.properties.type == '08') {
                return '#0084ff'
              } else if (geojson.properties.type == '11') {
                return '#4b5cc5'
              } else if (geojson.properties.type == '02') {
                return '#52616b'
              } else if (geojson.properties.type == '01') {
                return '#fc5185'
              } else if (geojson.properties.type == '04') {
                return '#f4a235'
              }

            },
            zooms: [2, 26],
            cursor: 'pointer',
            extData: geojson.properties
          });
        }
      });

    }

    map.add(layer);
    // 绑定事件
    layer.on('click', click);
    layer.on('mouseover', move);
    layer.on('mouseout', out);
    // 覆盖物集合
    let overlaies = layer.getOverlays()
    overlaies.forEach(item => {
      console.log(item._opts.extData.type);
      if (item._opts.extData.type == '00') {
        // 解绑边界点击事件并以边界自动缩放
        item.setOptions({
          zIndex: 97
        })
        item.off('click', click)
        map.setFitView(item)
      }
    })

    if (edgeArr) {
      creatMask()
    }
  }
}

// 添加遮罩层
const creatMask = () => {

  // 外多边形
  var outer = [
    new AMap.LngLat(-360, 90, true),
    new AMap.LngLat(-360, -90, true),
    new AMap.LngLat(360, -90, true),
    new AMap.LngLat(360, 90, true),
  ];

  var pathArray = [
    outer
  ];

  // overlaies.forEach(overlay => {
  //     let inside = overlay.getPath()[0][0]
  //     console.log('inside', inside);
  //     pathArray.push(inside)
  // })

  pathArray.push(edgeArr[0])

  var polygon = new AMap.Polygon({
    path: pathArray,
    strokeColor: '#e53f32',
    strokeWeight: 2,
    strokeStyle: 'dashed',
    fillColor: '#fff',
    fillOpacity: 0.8,
    zIndex: 100
  });

  polygon.setPath(pathArray);
  map.add(polygon)
}

// 覆盖物点击事件
const click = (e) => {
  let info = e.target._opts.extData
  console.log('自定义属性', info);

  // 当前点击覆盖物对象
  selected = e.target
  resetlayer()
  setTimeout(() => {
    clickAction(info);
  }, 100);
}

const clickAction = (info) => {
  doAction({
    actionType: 'drawer',
    drawer: {
      title: info.name,
      size: 'lg',
      resizable: true,
      closeOnOutside: true,
      closeOnEsc: true,
      bodyClassName: 'p-none',
      data: {
        '&': info
      },
      body: [
        {
          '$ref': 'detail'
        }
      ],
      actions: []
    }
  });
}

// 鼠标移入
const move = (e) => {
  resetlayer();
  let overlay = e.target
  if (overlay.className == "Overlay.Polygon") {
    overlay.setOptions({
      fillOpacity: 0.7,
    })
  } else if (overlay.className == "Overlay.Polyline") {
    overlay.setOptions({
      strokeOpacity: 1
    })
  }
}

// 鼠标移出
const out = (e) => {
  let overlay = e.target
  if (overlay.className == "Overlay.Polyline") {
    overlay.setOptions({
      strokeOpacity: 0.5
    })
  }
  resetlayer();
}

const resetlayer = () => {
  // 重置样式
  if (layer) {
    layer.setOptions({
      fillOpacity: 0.3,
    })
  }
  // 当前点击的覆盖物
  if (selected) {
    if (selected.className == 'Overlay.Polyline') {
      selected.setOptions({
        strokeOpacity: 1,
      })
    } else {
      selected.setOptions({
        fillOpacity: 1,
      })
    }
  }

}

let edgeArr = reactive([])
adapterLoading()
// 解析json文件
const adapterLoading = () => {
  // const path = '../data/map2.json'
  const path = 'https://download.langmeta.com/geo/china/330100_1-6.json'

  fetch(path).then(res => {
    return res.json();
  }).then(res => {
    region = res;
    // region.features.map((item, index) => {
    //     if (item.properties.type == '00') {
    //         edgeArr = item.geometry.coordinates[0]
    //     }

    // });
    console.log('rl',region);

    for (var i = 0; i < region.features.length; i++) {
      if (region.features[i].properties.type == '00') {
        edgeArr = region.features[i].geometry.coordinates[0]
      }
      if (!region.features[i].geometry) {
        region.features.splice(i, 1);
        i--;
      }
    }

  }
  );

}




</script>

<template>
  <main>
    <div id='allmap' class='bmap-container'></div>
  </main>
</template>

<style scoped lang="scss">
main {
  .bmap-container {
    width: 100%;
    height: 100vh;
  }
}
</style>
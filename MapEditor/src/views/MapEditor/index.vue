<script setup>polygon
import { onMounted, reactive, ref } from 'vue';

let type = ref('polygon')
// 地图对象
var map = null;
var marker = null
var polyline = null
var polygon = null
var polygonEditor = null;
var polylineEditor = null
// 所有静态覆盖物
let totalPath = []
// 当前编辑态覆盖物
var newPath = []

// 初始化
function init() {
  let elements = document.getElementsByClassName('bmap-container');
  if (elements && elements.length > 0) {
    map = new AMap.Map(elements[0], {
      center: [120.228831, 30.288598],
      zoom: 9,
      zIndex: 99
    });
    map.on('click', addMarker)
  }
}

// 创建折线
const createPolyline = () => {
  removeAll()
  polyline = new AMap.Polyline({
    path: newPath,
    strokeColor: "#3e9de6",
    strokeWeight: 2,
    strokeOpacity: 0.7,
    zIndex: 50,
    bubble: true,
  })

  map.add(polyline)
  polylineEditor = new AMap.PolylineEditor(map, polyline);
  polylineEditor.open()

  polylineEditor.on('removenode', function () {
    map.off('click', addMarker);
    newPath = polyline.getPath()
    submitArr()
    setTimeout(function () {
      map.on('click', addMarker)
    }, 10)
  })

  polylineEditor.on('adjust', function () {
    newPath = polyline.getPath()
    submitArr()

  })

  polylineEditor.on('addnode', function () {
    newPath = polyline.getPath()
    submitArr()

  })
}

// 创建多边形
const createPolygon = () => {
  removeAll()
  polygon = new AMap.Polygon({
    path: newPath,
    strokeColor: "#ff2b3a",
    strokeWeight: 9,
    strokeOpacity: 0.7,
    fillOpacity: 0.5,
    fillColor: '#93c5fd',
    zIndex: 50,
    bubble: false,
  })

  map.add(polygon)

  polygonEditor = new AMap.PolygonEditor(map, polygon);
  polygonEditor.open()

  polygonEditor.on('removenode', function () {
    map.off('click', addMarker);
    newPath = polygon.getPath()
    submitArr()
    setTimeout(function () {
      map.on('click', addMarker)
    }, 10)
  })

  polygonEditor.on('adjust', function () {
    newPath = polygon.getPath()
    submitArr()

  })

  polygonEditor.on('addnode', function () {
    newPath = polygon.getPath()
    submitArr()

  })

}

// 提交的数据格式
const submitArr = () => {
  if (type.value == 'polygon') {
    console.log('多边形最终数据', save());
  } else if (type.value == 'polyline') {
    console.log('折线最终数据a', save());
  }
}

// 地图点击事件，增加新节点
const addMarker = (e) => {
  let point = [e.lnglat.lng, e.lnglat.lat]
  let length = newPath.length
  console.log('newPath',newPath);

  if (length == 0) {
    // 创建点
    var marker = new AMap.Marker({
      position: point,
    });
    marker.setMap(map);
    // 坐标存入数组
    newPath.push(point)

  } else if (length == 1) {
    newPath.push(point)
    createPolyline()
  }
  if (type.value == 'polyline') {
    if (length > 1) {
      newPath = polyline.getPath()
      newPath.push(point)
      createPolyline()
    }
  } else if (type.value == 'polygon') {
    if (length == 2) {
      // ---
      console.log('polyline',polyline);
      newPath = polyline.getPath()
      newPath.push(point)
      createPolygon()

    } else if (length > 2) {
      newPath = polygon.getPath()
      newPath.push(point)
      createPolygon()
    }
  }
  submitArr()
}

// 清除覆盖物，关闭编辑对象，重新渲染
const removeAll = () => {
  if (polylineEditor) {
    polylineEditor.close()
  }
  if (polygonEditor) {
    polygonEditor.close()
  }
  map.clearMap();
  onlyWatch()

}

// 删除指定
const clearAll = () => {
  newPath = []
  removeAll()

  setTimeout(function () {
    submitArr()
  }, 10)
}

// 结束按钮
const finish = () => {
  if (polylineEditor) {
    polylineEditor.close()
  }
  if (polygonEditor) {
    polygonEditor.close()
  }
  if (polyline) {
    polyline = ''
  }
  if (polygon) {
    polygon = ''
  }
  if (newPath) {
    totalPath.push(newPath)
  }
  newPath = []
  removeAll()
  setTimeout(function () {
    // submitArr()
  }, 10)
}

// 创建不编辑的覆盖物
const onlyWatch = () => {
  if (type.value == 'polyline') {
    totalPath.forEach((paths, index) => {
      if (paths) {
        let onlywatchPolyline = new AMap.Polyline({
          path: paths,
          strokeColor: "#009eff",
          strokeWeight: 3,
          cursor: 'pointer',
          strokeOpacity: 0.7,
          zIndex: 50,
          bubble: false,
        })
        map.add(onlywatchPolyline)

        // 点击当前覆盖物开启编辑
        onlywatchPolyline.on('click', function () {
          totalPath[index] = []
          polylineEditor.setTarget(this)
          polylineEditor.open()
          newPath = this.getPath()
          setTimeout(() => {
            createPolyline()
          }, 10);

        })
      }

    })

  } else if (type.value == 'polygon') {

    totalPath.forEach((paths, index) => {
      if (paths) {
        let onlywatchPolygon = new AMap.Polygon({
          path: paths,
          strokeColor: "#009eff",
          strokeWeight: 2,
          strokeOpacity: 0.7,
          fillOpacity: 0.5,
          fillColor: '#93c5fd',
          cursor: 'pointer',
          zIndex: 50,
          bubble: false,
        })
        map.add(onlywatchPolygon)

        onlywatchPolygon.on('click', function () {
          console.log('totalPath', totalPath)
          totalPath[index] = []
          polygonEditor.setTarget(this)
          polygonEditor.open()
          newPath = this.getPath()
          setTimeout(() => {
            createPolygon()
          }, 10);

        })
      }

    })

  }
}

const save = () => {
  for (let i = 0; i < totalPath.length; i++) {
    if (totalPath[i].length == 0) {
      totalPath.splice(i, 1)
      i--
    }
  }
  return JSON.stringify(totalPath)
}

const savemap = () => {
  alert(`图形坐标:  ${JSON.stringify(totalPath)}`)
}

onMounted(() => {
  init()
})

</script>

<template>
  <main>
    <div id='allmap' class='bmap-container'></div>
    <div class="input-card" style="width: 200px">
      <button class="clearAll" @click="clearAll()">删除覆盖物</button>
      <button class="backMap" onclick="backMap()">还原地图</button>
      <button class="finish" @click='finish()'>结束编辑</button>
      <button class="save" @click="savemap()">保存</button>
    </div>
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
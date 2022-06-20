
import './App.css'
import {useRef,useEffect} from 'react'
import {initShaders} from '@/kernel/Connect/index'
import {Compose,Track} from '@/kernel/Animation/index'
import {canvas2gl} from '@/utils/index'
import useGetGl from './hooks/useGetGl'
function App() {
  const canvas=useRef()
  const glTaskQueue=useRef([])
  useEffect(() => {
    const _canvas=canvas.current
    _canvas.width=window.innerWidth
    _canvas.height=window.innerHeight 
    const gl=useGetGl(canvas)
   
    //顶点着色器
    //attribute 解决硬编码
    const vsSource=`
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = a_PointSize;
  }
    `
    //片元着色器
    const fsSource=`
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
      if(dist < 0.5) {
          gl_FragColor = u_FragColor;
      } else {
          discard;
      }
  }
    `
    initShaders(gl,vsSource,fsSource) //js层与gl层通信，让gl使用定义的顶点，片元着色器
    //获取gl层的attribute
    // const a_Position=gl.getAttribLocation(gl.program,'a_Position');
    // //vertexAttrib族修改attribute
    // gl.vertexAttrib3f(a_Position,0.0,0.1,0.0);
    // gl.clearColor(0,0,0,1) //设置颜色 颜色位于gl.COLOR_BUFFER_BIT
    // gl.clear(gl.COLOR_BUFFER_BIT) //刷色
    // gl.drawArrays(gl.POINTS,0,1) //画点
  },[]);
  
  const drawPoints=(e)=>{
    const {clientX, clientY} =e;
    const {left,top,width,height} =canvas.current.getBoundingClientRect();
    //canvas坐标系 -> webgl坐标系 
    const {glX,glY}=canvas2gl(clientX, clientY,left,top,width,height)
    const gl=useGetGl(canvas)
    const color={r:Math.random(),g:Math.random(),b:Math.random(),a:Math.random()}
    const obj={
      glX,
      glY,
      size:Math.random()*100+30,
      color}
    glTaskQueue.current.push(obj)
      const compose=new Compose()
      const track=new Track(obj.color)
      track.start=new Date()
      track.keyMap=new Map([
        ['a',[
            [500,obj.color.a],
            [1000,0],
            [1500,obj.color.a],
        ]],
        ['r',[
          [500,obj.color.r],
          [1000,0],
          [1500,obj.color.r],
      ]],
      ['g',[
        [500,obj.color.g],
        [1000,0],
        [1500,obj.color.g],
    ]],
    ['b',[
      [500,obj.color.b],
      [1000,0],
      [1500,obj.color.b],
  ]],
    ])
    track.timeLen=2000
    track.loop=true
    compose.add(track)
    const a_Position=gl.getAttribLocation(gl.program,'a_Position');
    const a_PointSize=gl.getAttribLocation(gl.program,'a_PointSize');
    const u_FragColor=gl.getUniformLocation(gl.program,'u_FragColor')
    // gl.clearColor(0,0,0,1) //设置颜色 颜色位于gl.COLOR_BUFFER_BIT
    // gl.clear(gl.COLOR_BUFFER_BIT) //刷色

    !(function ani(){
      compose.update(new Date())
       //webgl同步绘图 因为异步的消息队列里不存在buffer上下文
       glTaskQueue.current.forEach(({glX,glY,size,color}) => {
        gl.vertexAttrib2f(a_Position,glX,glY);
        gl.vertexAttrib1f(a_PointSize,size);
        const {r,g,b,a}=color
        gl.uniform4f(u_FragColor,r,g,b,a);
        gl.drawArrays(gl.POINTS, 0, 1);
       
      })
      requestAnimationFrame(ani)
  })()
   
    
  }
//   #canvas {
//     background: url("./images/sky.jpg");
//     background-size: cover;
//     background-position: right bottom;
// }

  return (
    <div className="App" >
    webgl_learn
      <canvas 
      id="canvas"
      ref={canvas}
      onClick={(e)=>{drawPoints(e)}}
       >
      </canvas> 
    </div>
  )
}

export default App

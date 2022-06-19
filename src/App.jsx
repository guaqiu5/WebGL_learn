
import './App.css'
import {useRef,useEffect} from 'react'
import {initShaders} from '@/kernel/Connect/index'
import {canvas2gl} from '@/utils/index'
import useGetGl from './hooks/useGetGl'
function App() {
  const canvas=useRef()
  const glTaskQueue=useRef([])
  useEffect(() => {
    
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
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }
    `
    initShaders(gl,vsSource,fsSource) //js层与gl层通信，让gl使用定义的顶点，片元着色器
    //获取gl层的attribute
    // const a_Position=gl.getAttribLocation(gl.program,'a_Position');
    // //vertexAttrib族修改attribute
    // gl.vertexAttrib3f(a_Position,0.0,0.1,0.0);
    gl.clearColor(0,0,0,1) //设置颜色 颜色位于gl.COLOR_BUFFER_BIT
    gl.clear(gl.COLOR_BUFFER_BIT) //刷色
    // gl.drawArrays(gl.POINTS,0,1) //画点
  },[]);
  
  const drawPoints=(e)=>{
    const {clientX, clientY} =e;
    const {left,top,width,height} =canvas.current.getBoundingClientRect();
    //canvas坐标系 -> webgl坐标系 
    const {glX,glY}=canvas2gl(clientX, clientY,left,top,width,height)
    const gl=useGetGl(canvas)
    glTaskQueue.current.push({glX,glY,size:Math.random()*100})
    const a_Position=gl.getAttribLocation(gl.program,'a_Position');
    const a_PointSize=gl.getAttribLocation(gl.program,'a_PointSize');
    gl.clearColor(0,0,0,1) //设置颜色 颜色位于gl.COLOR_BUFFER_BIT
    gl.clear(gl.COLOR_BUFFER_BIT) //刷色

    //webgl同步绘图 因为异步的消息队列里不存在buffer上下文
    glTaskQueue.current.forEach(({glX,glY,size}) => {
      gl.vertexAttrib2f(a_Position,glX,glY);
      gl.vertexAttrib1f(a_PointSize,size);
      gl.drawArrays(gl.POINTS, 0, 1);
     
    })
    
  }

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


import './App.css'
import {useRef,useEffect} from 'react'
import {initShaders} from '@/kernel/Connect/index'
function App() {
  const canvas=useRef()
  useEffect(() => {
    const _canvas=canvas.current
    _canvas.width=window.innerWidth
    _canvas.height=window.innerHeight
    const gl=_canvas.getContext('webgl')
    //顶点着色器
    const vsSource=`
    void main() {
      gl_Position = vec4(0.2, 0.0, 0.0, 1.0);
      gl_PointSize = 200.0;
  }
    `
    //片元着色器
    const fsSource=`
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }
    `
    initShaders(gl,vsSource,fsSource) //js层与gl层通信，让gl使用定义的顶点，片元着色器
    gl.clearColor(0,0,0,1) //设置颜色 颜色位于gl.COLOR_BUFFER_BIT
    gl.clear(gl.COLOR_BUFFER_BIT) //刷色
    gl.drawArrays(gl.POINTS,0,1) //画点
  },[]);
  return (
    <div className="App" >
    webgl_learn
      <canvas id="canvas" ref={canvas}></canvas> 
    </div>
  )
}

export default App

//接受canvas的ref 返回webgl上下文

const useGetGl=(canvas)=>{
    const _canvas=canvas.current
    _canvas.width=window.innerWidth
    _canvas.height=window.innerHeight
    const gl=_canvas.getContext('webgl')
    return gl
}

export default useGetGl
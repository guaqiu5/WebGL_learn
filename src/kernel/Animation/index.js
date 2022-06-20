// - 合成：多个时间轨的集合
// - 时间轨：通过关键帧，对其中目标对象的状态进行插值计算
// - 补间动画：通过两个关键帧，对一个对象在这两个关键帧之间的状态进行插值计算，从而实现这个对象在两个关键帧间的平滑过渡

export  class Compose{
    constructor(){
        this.parent=null
        this.children=[]
    }
    add(obj){
        obj.parent=this
        this.children.push(obj)
    }
    update(t){
        this.children.forEach(ele=>{
            ele.update(t)
        })
    }
}


export  class Track{
    constructor(target){
        this.target=target
        this.parent=null
        this.start=0
        this.timeLen=5
        this.loop=false
        this.keyMap=new Map()
    }
    update(t){
        const {keyMap,timeLen,target,loop}=this
        let time=t-this.start
        if(loop){
            time=time%timeLen
        }
        for(const [key,value] of keyMap.entries()){
            const last=value.length-1
            
            if(time<value[0][0]){
                target[key]=value[0][1]
            }else if(time>value[last][0]){
                target[key]=value[last][1]
            }else{
                target[key]=getValBetweenFms(time,value,last)
            }
        }
    }
}


function getValBetweenFms(time,fms,last){
    for(let i=0;i<last;i++){
        const fm1=fms[i]
        const fm2=fms[i+1]
        if(time>=fm1[0]&&time<=fm2[0]){
            const delta={
                x:fm2[0]-fm1[0],
                y:fm2[1]-fm1[1],
            }
            const k=delta.y/delta.x
            const b=fm1[1]-fm1[0]*k
            return k*time+b
        }
    }
}
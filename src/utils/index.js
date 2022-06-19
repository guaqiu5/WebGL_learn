export const canvas2gl=(aX, aY, bX, bY,canvasWidth, canvasHeight)=>{
    //向量c=a-b
    const res={
        cssX:aX-bX,
        cssY:aY-bY,
    }
    const {cssX,cssY} = res
    const [halfWidth,halfHeight]=[canvasWidth/2,canvasHeight/2];
    const [xBaseCenter,yBaseCenter]=[cssX-halfWidth,cssY-halfHeight];
    const yBaseCenterTop=-yBaseCenter;
    const [x,y]=[xBaseCenter/halfWidth,yBaseCenterTop/halfHeight];
    return {
        glX:x,
        glY:y,
    }
}
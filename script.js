let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const handleMove = (e) => {
      const { clientX, clientY } = (e.touches && e.touches[0]) || e;
      if (!this.rotating) {
        this.touchMoveX = clientX;
        this.touchMoveY = clientY;

        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }

      const dirX = clientX - this.touchStartX;
      const dirY = clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX*dirX + dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const handleStart = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const { clientX, clientY } = (e.touches && e.touches[0]) || e;
      this.touchStartX = clientX;
      this.touchStartY = clientY;
      this.prevTouchX = clientX;
      this.prevTouchY = clientY;

      if (e.touches && e.touches.length > 1) {
        this.rotating = true;
      }
    };

    const handleEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Mouse events
    document.addEventListener('mousemove', handleMove);
    paper.addEventListener('mousedown', handleStart);
    window.addEventListener('mouseup', handleEnd);

    // Touch events
    document.addEventListener('touchmove', handleMove, { passive: false });
    paper.addEventListener('touchstart', handleStart);
    window.addEventListener('touchend', handleEnd);

    // Prevent default touch behavior
    paper.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
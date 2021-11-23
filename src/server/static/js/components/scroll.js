class Scroll {

  constructor (screen) {
    // 添加事件监听器
    this.event = new Event();

    // 生成 dom 元素
    this.$screen = (new Dom(screen)).style('position', 'relative');
    this.$content = Dom.create('div', {
      class: 'scroll-content',
      style: { 'top': '0px', },
    });
    this.$bar = Dom.create('div', {
      class: 'scroll-bar',
      style: { 'top': '3px', },
      // draggable: true,
      ondragstart: 'return false',
    });
    this.$orbit = Dom.create('div', {
      class: 'scroll-orbit',
    });
    this.$area = Dom.create('div', {
      class: 'scroll-area',
    });

    // 绑定元素
    this.$screen.append(this.$content.append(this.$screen.children()));
    this.$screen.append(this.$area.append(this.$orbit.append(this.$bar)));
    //以及事件
    this.$screen.on('resize', () => {
      this.$content.class().add('-no-transition');
      this.resize()
      // 设置下一帧失效
      requestAnimationFrame(() => {
        this.$content.class().remove('-no-transition');
      });
      this.emit('resize');
    });
    this.$screen.on('resize', () => this.$content.emit('resize'));

    // 设置大小
    this.resize();
    this.scroll(0); // 解决首屏刷新卡顿

    // 滚动事件
    this.$screen.listen('wheel', (event) => {
      if (this.wheelLock) {
        return;
      }
      this.active();
      this.scroll(this.top + event.deltaY);
    });

    // 设置拖拽事件
    // 中间数据
    let oldTop = 0, oldY = 0;
    let ratio = 1;
    // 动作入口
    const onMouseDown = (e) => {
      this.wheelLock = true;  // 锁住 wheel 事件
      // 初始化数据
      oldTop = this.top; oldY = e.pageY;
      ratio = this.contentHeight / (this.screenHeight - 6);
      this.$bar.class().add('-hover');
      this.$screen.listen('mousemove', onMouseMove);
      // e.defaultPrevented();
    };
    let maxDy = 0;
    const onMouseMove = (_e) => {
      let dy = _e.pageY - oldY;
      this.$bar.class().add('-no-transition');
      this.$content.class().add('-no-transition');
      this.scroll(oldTop + dy * ratio);
      if (maxDy < dy) {
        maxDy = dy;
      }
    };
    // 动作出口
    const clearMove = (e) => {
      this.wheelLock = false;
      this.$screen.clear('mousemove', onMouseMove);
      requestAnimationFrame(() => {
        this.$bar.class().remove('-no-transition');
        this.$content.class().remove('-no-transition');
      });
      this.$bar.class().remove('-hover');
      this.active();
    }
    // 鼠标按下
    this.$bar.listen('mousedown', onMouseDown);
    // 鼠标弹起
    this.$area.listen('mouseup', clearMove);
    // 鼠标移出触发区域
    this.$area.listen('mouseleave', clearMove);
  }

  // 设置滚动
  scroll (_top) {
    this.top = _top < this.maxTop ? _top : this.maxTop;
    this.top = this.top > 0 ? this.top : 0;
    this.top = parseInt(this.top);
    // 设置 content top
    this.$content.style('top', `${-this.top}px`);
    // 计算 bar top
    let barTop = parseInt(
      (this.screenHeight - 6) * (this.top / this.contentHeight)
    ) + 3;
    barTop = barTop > this.screenHeight - 3 ? this.screenHeight - 3 : barTop;
    this.$bar.style('top', `${barTop}px`);
  }

  // 重新设计大小
  resize () {
    // 计算大小
    this.contentHeight = this.$content.prop('offsetHeight');
    this.screenHeight = this.$screen.prop('offsetHeight');
    let barHeight = parseInt(
      this.screenHeight * (this.screenHeight - 6) / this.contentHeight
    );
    this.maxTop = this.contentHeight - this.screenHeight;
    // 设置元素大小
    this.$bar.style('height', `${barHeight}px`);
    // 如果 top 大于最大值, 要重新设置
    if (this.top > this.maxTop) {
      this.top = this.maxTop;
      this.$content.style('top', `${-this.top}px`);
    }
  }

  active () {
    if (this.isActive) {
      clearTimeout(this.actHandler);
    } else {
      this.isActive = true;
      this.$bar.class().add('-active');
    }
    this.actHandler = setTimeout(() => {
      this.$bar.class().remove('-active');
      this.isActive = false;
    }, 600);
  }

  container () {
    return this.$content;
  }

  on (type, fn) {
    this.event.on(type, fn);
  }

  emit (type) {
    this.event.emit(type);
  }

}
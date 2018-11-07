<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content" ref="listContent" :class="{'scroll-content1':freeScroll}">
      <div ref="listWrapper">
        <slot>
          <!--<ul class="list-content">-->
          <!--<li @click="clickItem($event,item)" class="list-item" v-for="item in data">{{item}}</li>-->
          <!--</ul>-->
        </slot>
      </div>
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div v-if="!isPullUpLoad" class="before-trigger" :style="`margin-left:${-scrollXLeft}px`">
            <span>{{pullUpTxt}}</span>
          </div>
          <div v-else class="after-trigger" :style="`margin-left:${-scrollXLeft}px`">
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown" :pullDownRefresh="pullDownRefresh" :pullDownStyle="pullDownStyle" :beforePullDown="beforePullDown" :isPullingDown="isPullingDown" :bubbleY="bubbleY">
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else><span>{{refreshTxt}}</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import Loading from '../loading/loading.vue'
import Bubble from '../bubble/bubble.vue'
import { getRect } from '@/assets/js/dom'

const COMPONENT_NAME = 'scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
  name: COMPONENT_NAME,
  props: {
    data: { //数据
      type: Array,
      default: function() {
        return []
      }
    },
    eventPassthrough:{
      type: String,
      default: ''
    },
    scrollToEndFlag: { //监听是否开启自动滚动
      type: Boolean,
      default: false
    },
    probeType: { //监听滚动的位置使用
      type: Number,
      default: 3
    },
    click: { //better-scroll 默认会阻止浏览器的原生 click 事件,从而创建一个新的事件
      type: Boolean,
      default: true
    },
    tap: { //better-scroll 默认会阻止浏览器的原生 click 事件,从而创建一个新的事件
      type: Boolean,
      default: true
    },
    listenScroll: { ///** * 是否派发滚动事件 */
      type: Boolean,
      default: false
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    scrollbar: { //开启滚动条
      type: null,
      default: false
    },
    pullDownRefresh: {
      type: null,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    startY: {
      type: Number,
      default: 0
    },
    endScrollX: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    freeScroll: {
      type: Boolean,
      default: false
    },
    delayTime: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      isPullUpLoad: false,
      pullUpDirty: false,
      pullDownStyle: '',
      bubbleY: 0,
      listWrapperFlag:true,
      scrollXLeft:0,

    }
  },
  computed: {
    pullUpTxt() {
      const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more || '加载成功'

      const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore || '没有更多数据'

      return this.pullUpDirty ? moreTxt : noMoreTxt
    },
    refreshTxt() {
      return this.pullDownRefresh && this.pullDownRefresh.txt || ''
    }
    
  },
  created() {
    
    this.pullDownInitTop = -50
  },
  mounted() {
    var vm = this;
    setTimeout(() => {
      
      this.initScroll()
      // if(vm.freeScroll){
      //     vm.$refs.listContent.style.width = vm.$refs.listContent.children[0].children[0].children[0].clientWidth +'px'
      //     // this.scroll.scrollTo(0, this.scroll.maxScrollY,1000)
      //   }
    }, 200)
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
        this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
      }
      let options = {
        probeType: this.probeType,
        click: this.click,
        tap: this.tap,
        scrollY: this.freeScroll || this.direction === DIRECTION_V,
        scrollX: this.freeScroll || this.direction === DIRECTION_H,
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        freeScroll: this.freeScroll,
        eventPassthrough: this.eventPassthrough
      }
      if(this.endScrollX){
        //问路要从最右开始显示
        // options.startX=-this.$refs.listWrapper.scrollWidth+this.$refs.wrapper.clientWidth
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)
      if(this.endScrollX){
        //问路
        this.scroll.scrollTo(this.scroll.maxScrollX, 0)
      }
      this.scroll.on('scroll',(pos)=>{
        if(-this.scroll.maxScrollY+pos.y>200){
          this.$emit('setEndFlag', false)
        }else{
          this.$emit('setEndFlag', true)
        }
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
          if (this.pullDownRefresh && this.freeScroll) {
            this.scrollXLeft = pos.x;
          }
          // console.log(pos)
        })
      }

      if (this.listenBeforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScrollStart')
        })
      }

      if (this.pullDownRefresh) {
        this._initPullDownRefresh()
      }

      if (this.pullUpLoad) {

        this._initPullUpLoad()
      }
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    clickItem(e, item) {
      console.log(e)
      this.$emit('click', item)
    },
    destroy() {
      this.scroll.destroy()
    },
    forceUpdate(dirty) {
      
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false
        this._reboundPullDown().then(() => {
          this._afterPullDown()
        })
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.pullUpDirty = dirty
        this.refresh()
      } else {
        // if(this.listWrapperFlag){
        //   // this.listWrapperFlag = false
        //   if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
        //     this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
        //   }
        // }
        if(this.endScrollX){
          this.initScroll()
        }else{
          this.refresh()
        }
      }
    },
    _initPullDownRefresh() {
      this.scroll.on('pullingDown', () => {
        this.beforePullDown = false
        this.isPullingDown = true
        this.$emit('pullingDown')
      })

      this.scroll.on('scroll', (pos) => {
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
          this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
        } else {
          this.bubbleY = 0
        }

        if (this.isRebounding) {
          this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
        }
      })
    },
    _initPullUpLoad() {
      this.scroll.on('pullingUp', () => {
        this.isPullUpLoad = true
        this.$emit('pullingUp')
      })
    },
    _reboundPullDown() {
      const { stopTime = 600 } = this.pullDownRefresh
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isRebounding = true
          this.scroll.finishPullDown()
          resolve()
        }, stopTime)
      })
    },
    _afterPullDown() {
      setTimeout(() => {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`
        this.beforePullDown = true
        this.isRebounding = false
        this.refresh()
      }, this.scroll.options.bounceTime)
    }
  },
  watch: {
    data: {
      handler() {
        if(!_.isEmpty(this.scroll)){
          setTimeout(() => {
            if (this.scrollToEndFlag&&this.scrollToEndFlag!=undefined) {
              this.scroll.scrollTo(0, this.scroll.maxScrollY,1000)
            }
            this.forceUpdate(true);
          }, this.refreshDelay)
        }
      },
      deep: true
    },
  },
  components: {
    Loading,
    Bubble
  }
}

</script>
<style scoped>
/*position: absolute*/
  /*left: 0*/
  /*top: 0*/
  /*right: 0*/
  /*bottom: 0*/
/* .list-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #fff;
}
.scroll-content {
  position: relative;
  z-index: 1;
}
.list-content {
  position: relative;
  z-index: 10;
  background: #fff;
}
.list-item {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  padding-left: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
}
.after-trigger {
  margin-top: 10px;
}

.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
} */

.isHeader .list-wrapper {
  top: 1.226667rem /* 92/75 */;
}
.isNav .list-wrapper {
  bottom: 1.333333rem /* 100/75 */;
}
.list-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.scroll-content {
  position: relative;
  z-index: 1;
  
}
.scroll-content1{
  min-width: 100%;
  display: inline-block;
}

.list-content {
  position: relative;
  z-index: 10;
}
.list-item {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  padding-left: 20px;
  border-bottom: 1px solid #e5e5e5;
}
.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
}
.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
</style>

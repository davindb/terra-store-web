import Events from '../Events.js'
import Localization from './Localization.js'
import Animations from '../Animations.js'
import Axes from '../axes/Axes.js'
import Config from '../settings/Config.js'
import CoreUtils from '../CoreUtils.js'
import Crosshairs from '../Crosshairs.js'
import Grid from '../axes/Grid.js'
import Graphics from '../Graphics.js'
import Exports from '../Exports.js'
import Options from '../settings/Options.js'
import Responsive from '../Responsive.js'
import Series from '../Series.js'
import Theme from '../Theme.js'
import Formatters from '../Formatters.js'
import TitleSubtitle from '../TitleSubtitle.js'
import Legend from '../legend/Legend.js'
import Toolbar from '../Toolbar.js'
import Dimensions from '../dimensions/Dimensions.js'
import ZoomPanSelection from '../ZoomPanSelection.js'
import Tooltip from '../tooltip/Tooltip.js'
import Core from '../Core.js'
import Data from '../Data.js'
import UpdateHelpers from './UpdateHelpers.js'

import '../../svgjs/svg.js'
import 'svg.filter.js'
import 'svg.pathmorphing.js'
import 'svg.draggable.js'
import 'svg.select.js'
import 'svg.resize.js'

// global Apex object which user can use to override chart's defaults globally
if (typeof window.Apex === 'undefined') {
  window.Apex = {}
}

export default class InitCtxVariables {
  constructor(ctx) {
    this.ctx = ctx
    this.w = ctx.w
  }

  initModules() {
    this.ctx.publicMethods = [
      'updateOptions',
      'updateSeries',
      'appendData',
      'appendSeries',
      'toggleSeries',
      'showSeries',
      'hideSeries',
      'setLocale',
      'resetSeries',
      'zoomX',
      'toggleDataPointSelection',
      'dataURI',
      'addXaxisAnnotation',
      'addYaxisAnnotation',
      'addPointAnnotation',
      'clearAnnotations',
      'removeAnnotation',
      'paper',
      'destroy'
    ]

    this.ctx.eventList = [
      'click',
      'mousedown',
      'mousemove',
      'mouseleave',
      'touchstart',
      'touchmove',
      'touchleave',
      'mouseup',
      'touchend'
    ]

    this.ctx.animations = new Animations(this.ctx)
    this.ctx.axes = new Axes(this.ctx)
    this.ctx.core = new Core(this.ctx.el, this.ctx)
    this.ctx.config = new Config({})
    this.ctx.data = new Data(this.ctx)
    this.ctx.grid = new Grid(this.ctx)
    this.ctx.graphics = new Graphics(this.ctx)
    this.ctx.coreUtils = new CoreUtils(this.ctx)
    this.ctx.crosshairs = new Crosshairs(this.ctx)
    this.ctx.events = new Events(this.ctx)
    this.ctx.exports = new Exports(this.ctx)
    this.ctx.localization = new Localization(this.ctx)
    this.ctx.options = new Options()
    this.ctx.responsive = new Responsive(this.ctx)
    this.ctx.series = new Series(this.ctx)
    this.ctx.theme = new Theme(this.ctx)
    this.ctx.formatters = new Formatters(this.ctx)
    this.ctx.titleSubtitle = new TitleSubtitle(this.ctx)
    this.ctx.legend = new Legend(this.ctx)
    this.ctx.toolbar = new Toolbar(this.ctx)
    this.ctx.dimensions = new Dimensions(this.ctx)
    this.ctx.updateHelpers = new UpdateHelpers(this.ctx)
    this.ctx.zoomPanSelection = new ZoomPanSelection(this.ctx)
    this.ctx.w.globals.tooltip = new Tooltip(this.ctx)
  }
}

import { type App } from "vue"
// https://VxeTable.cn
import VxeTable from "vxe-table"
// https://github.com/x-extends/vxe-table-plugin-element
import VxeTablePluginElement from "vxe-table-plugin-element"

VxeTable.use(VxeTablePluginElement)

/** 全局默认参数 */
VxeTable.setConfig({
  /** 全局尺寸 */
  size: "medium",
  /** 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡 */
  zIndex: 9999,
  /** 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据 */
  version: 0,
  loading: {
    text: ""
  },
  table: {
    showHeader: true,
    showOverflow: "tooltip",
    showHeaderOverflow: "tooltip",
    autoResize: true,
    // stripe: false,
    border: "inner",
    // round: false,
    emptyText: "暂无数据",
    rowConfig: {
      useKey: true,
      isHover: true,
      isCurrent: true
    },
    columnConfig: {
      useKey: true,
      resizable: false
    },
    align: "center",
    headerAlign: "center"
  },
  pager: {
    // size: "medium",
    /** 配套的样式 */
    perfect: false,
    pageSize: 10,
    pagerCount: 5,
    pageSizes: [10, 20, 50],
    layouts: ["Total", "Home", "PrevJump", "PrevPage", "JumpNumber", "NextPage", "NextJump", "End", "Sizes", "FullJump"]
  },
  modal: {
    minWidth: 500,
    minHeight: 400,
    dblclickZoom: false,
    transfer: true,
    draggable: false
  }
})

export function loadVxeTable(app: App) {
  /** Vxe Table 组件完整引入 */
  app.use(VxeTable)
}

<script lang="tsx" setup>
import { nextTick, reactive, ref, watch } from "vue"
import { ElTag } from "element-plus"
import { VxeUI } from "vxe-table"
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps,
  VxeFormInstance,
  VxeFormProps
} from "vxe-table"
import { deleteTableDataApi, getTableDataApi } from "@/api/table"

defineOptions({
  // 命名当前组件
  name: "VxeTable"
})

interface RowVo {
  id: string
  username: string
  roles: string
  phone: string
  email: string
  status: boolean
  createTime: string
}

//#region 查询与删除
const xGridRef = ref<VxeGridInstance<RowVo>>()
const xGridOpt = reactive<VxeGridProps<RowVo>>({
  loading: true,
  autoResize: true,
  /** 分页配置项 */
  pagerConfig: {
    align: "right"
  },
  /** 表单配置项 */
  formConfig: {
    items: [
      {
        title: "用户名",
        field: "username",
        itemRender: {
          name: "$input",
          props: { placeholder: "请输入", clearable: true }
        }
      },
      {
        title: "手机号",
        field: "phone",
        itemRender: {
          name: "$input",
          props: { placeholder: "请输入", clearable: true }
        }
      },
      {
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: { type: "submit", content: "查询", status: "primary" }
            },
            {
              props: { type: "reset", content: "重置" }
            }
          ]
        }
      }
    ]
  },
  /** 工具栏配置 */
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: { buttons: "toolbar-btns" }
  },
  /** 自定义列配置项 */
  customConfig: {
    /** 是否允许列选中  */
    checkMethod: ({ column }) => !["username"].includes(column.field)
  },
  /** 列配置 */
  columns: [
    {
      type: "checkbox",
      width: "50px"
    },
    {
      field: "username",
      title: "用户名"
    },
    {
      field: "roles",
      title: "角色",
      slots: {
        default: ({ row, column }) => {
          const cellValue = row[column.field]
          const type = cellValue === "admin" ? "primary" : "warning"
          return [
            <ElTag type={type} effect="plain">
              {cellValue}
            </ElTag>
          ]
        }
      }
    },
    {
      field: "phone",
      title: "手机号"
    },
    {
      field: "email",
      title: "邮箱"
    },
    {
      field: "status",
      title: "状态",
      slots: {
        default: ({ row, column }) => {
          const cellValue = row[column.field]
          const tagValue: any[] = cellValue ? ["success", "启用"] : ["danger", "禁用"]
          return [
            <ElTag type={tagValue[0]} effect="plain">
              {tagValue[1]}
            </ElTag>
          ]
        }
      }
    },
    {
      field: "createTime",
      title: "创建时间"
    },
    {
      title: "操作",
      width: "150px",
      fixed: "right",
      showOverflow: false,
      slots: { default: "cell-operate" }
    }
  ],
  /** 数据代理配置项（基于 Promise API） */
  proxyConfig: {
    /** 启用动态序号代理 */
    seq: true,
    /** 是否代理表单 */
    form: true,
    /** 是否自动加载，默认为 true */
    // autoLoad: false,
    props: {
      total: "total"
    },
    ajax: {
      query: async ({ page, form }) => {
        xGridOpt.loading = true
        xGridFn.clearTable()
        //
        let total = 0
        let result: RowVo[] = []
        try {
          /** 接口参数 */
          const params = {
            username: form.username || undefined,
            phone: form.phone || undefined,
            size: page.pageSize,
            currentPage: page.currentPage
          }
          const res = await getTableDataApi(params)
          if (res && res.data) {
            // 总数
            total = res.data.total
            // 列表数据
            result = res.data.list
          }
        } catch (error) {
          console.error("[接口请求出错]", error)
        }
        xGridOpt.loading = false
        // 返回值有格式要求，详情见 vxe-table 官方文档
        return { total, result }
      }
    }
  }
})
const xGridFn = {
  /** 加载表格数据 */
  commitQuery: () => xGridRef.value?.commitProxy("query"),
  /** 清空表格数据 */
  clearTable: () => xGridRef.value?.reloadData([]),
  /** 删除 */
  onDelete: async (row?: RowVo) => {
    const rows = row ? [row] : xGridRef.value?.getCheckboxRecords(true) || []
    if (!rows.length) return
    const msg = rows.length === 1 ? `用户：${rows[0].username}` : `${rows.length}个用户`
    const action = await VxeUI.modal.confirm({
      title: "提示",
      content: `正在删除${msg}，确认删除？`,
      status: "warning",
      escClosable: true,
      maskClosable: true
    })
    if (action !== "confirm") return
    let isOk = true
    await deleteTableDataApi(rows[0].id).catch(() => (isOk = false))
    if (isOk) {
      VxeUI.modal.message({ status: "success", content: "删除成功" })
      xGridFn.commitQuery()
    }
  }
}
//#endregion

//#region 新增与修改
const xModalRef = ref<VxeModalInstance>()
const xModalOpt = reactive<VxeModalProps>({
  title: "",
  showClose: true,
  escClosable: true,
  maskClosable: true,
  beforeHideMethod: () => {
    xFormRef.value?.clearValidate()
    return Promise.resolve()
  }
})

const xFormRef = ref<VxeFormInstance>()
const xFormOpt = reactive<VxeFormProps<RowVo>>({
  span: 24,
  titleWidth: "100px",
  loading: false,
  /** 是否显示标题冒号 */
  titleColon: false,
  /** 表单数据 */
  data: {
    id: "",
    username: "",
    roles: "",
    phone: "",
    email: "",
    status: false,
    createTime: ""
  },
  /** 项列表 */
  items: [
    {
      field: "username",
      title: "用户名",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "phone",
      title: "电话",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      align: "right",
      itemRender: {
        name: "$buttons",
        children: [
          { props: { content: "取消" }, events: { click: () => xModalRef.value?.close() } },
          {
            props: { type: "submit", content: "确定", status: "primary" },
            events: { click: () => xModalFn.onSubmitForm() }
          }
        ]
      }
    }
  ],
  /** 校验规则 */
  rules: {
    username: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("请输入")
            case !itemValue.trim():
              return new Error("空格无效")
          }
        }
      }
    ],
    phone: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("请输入")
            case !itemValue.trim():
              return new Error("空格无效")
          }
        }
      }
    ]
  }
})

// 表单加载时禁止关闭弹窗
watch(
  () => xFormOpt.loading,
  (val) => {
    const lock = !val
    xModalOpt.showClose = lock
    xModalOpt.escClosable = lock
    xModalOpt.maskClosable = lock
  }
)

let isModifyMode = false
const xModalFn = {
  clearFormValidate: () => {
    !isModifyMode && xFormRef.value?.reset()
    xFormRef.value?.clearValidate()
  },
  onShowModal: (row?: RowVo) => {
    if (row) {
      isModifyMode = true
      xModalOpt.title = "修改用户"
      Object.assign(xFormOpt.data || {}, row)
    } else {
      isModifyMode = false
      xModalOpt.title = "新增用户"
    }
    xModalRef.value?.open()
    nextTick(xModalFn.clearFormValidate)
  },
  onSubmitForm: async () => {
    if (xFormOpt.loading || !xFormRef.value) return
    const errMap = await xFormRef.value.validate()
    if (errMap) return
    xFormOpt.loading = true
    // 模拟调用新增接口成功
    await new Promise((resolve) => setTimeout(resolve, 2000))
    VxeUI.modal.message({ status: "success", content: "操作成功" })
    xGridFn.commitQuery()
    xModalRef.value?.close()
    xFormOpt.loading = false
  }
}
//#endregion

//
</script>

<template>
  <div class="app-container">
    <!-- 表格 -->
    <vxe-grid ref="xGridRef" v-bind="xGridOpt">
      <!-- 工具栏 | 左侧按钮列表 -->
      <template #toolbar-btns>
        <vxe-button status="primary" icon="vxe-icon-add" @click="xModalFn.onShowModal()">新增用户</vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete" @click="xGridFn.onDelete()">批量删除</vxe-button>
      </template>
      <!-- 单元格 | 操作 -->
      <template #cell-operate="{ row }">
        <vxe-button mode="text" status="primary" @click="xModalFn.onShowModal(row)">修改</vxe-button>
        <vxe-button mode="text" status="danger" @click="xGridFn.onDelete(row)">删除</vxe-button>
      </template>
    </vxe-grid>

    <!-- 弹窗 -->
    <vxe-modal ref="xModalRef" v-bind="xModalOpt">
      <!-- 表单 -->
      <vxe-form ref="xFormRef" v-bind="xFormOpt" />
    </vxe-modal>
  </div>
</template>
